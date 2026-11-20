"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import Header, { WhatsAppIcon } from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useSite, useWhatsApp } from "@/components/site/SiteProvider";
import {
  getCheckoutContext,
  placeOrder,
  quoteCheckout,
  verifyRazorpayPayment,
  type CheckoutContext,
  type PublicQuote,
} from "./actions";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayFailedResponse {
  error?: {
    description?: string;
    reason?: string;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", cb: (res: RazorpayFailedResponse) => void) => void;
}

interface RazorpayWindow extends Window {
  Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
}

export default function CheckoutPage() {
  const {
    items,
    totalItems,
    subtotal,
    totalOriginalPrice,
    giftWrapTotal,
    grandTotal,
    clearCart,
    giftWrapPrice: GIFT_WRAP_PRICE,
  } = useCart();
  const { settings: pay } = useSite();
  const whatsapp = useWhatsApp();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">(pay.online_enabled || !pay.cod_enabled ? "prepaid" : "cod");
  const [instructions, setInstructions] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [ctx, setCtx] = useState<CheckoutContext | null>(null);
  const [quote, setQuote] = useState<PublicQuote | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderIssues, setOrderIssues] = useState<string[]>([]);

  // Prefill from the signed-in customer's profile / saved address.
  useEffect(() => {
    let alive = true;
    getCheckoutContext()
      .then((c) => {
        if (!alive) return;
        setCtx(c);
        const u = c.user;
        const a = c.address;
        if (u) {
          setFullName((v) => v || a?.full_name || u.name);
          setEmail((v) => v || u.email);
          setPhone((v) => v || a?.phone || u.phone);
        }
        if (a) {
          setAddress((v) => v || [a.line1, a.line2].filter(Boolean).join(", "));
          setCity((v) => v || a.city);
          setStateName((v) => v || a.state);
          setPincode((v) => v || a.pincode);
        }
        if (!c.settings.codEnabled) setPaymentMethod("prepaid");
        else if (!c.settings.onlineEnabled) setPaymentMethod("cod");
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const cartPayload = useMemo(
    () =>
      items.map((i) => ({
        slug: i.slug,
        quantity: i.quantity,
        finish: i.plating,
        giftWrap: Boolean(i.giftWrap),
        giftMessage: i.giftMessage ?? "",
      })),
    [items]
  );

  // Server-side price check (live prices, stock, coupon rules).
  useEffect(() => {
    if (!cartPayload.length) return;
    let alive = true;
    const t = setTimeout(() => {
      quoteCheckout(cartPayload, appliedCoupon ?? "", paymentMethod)
        .then((q) => {
          if (alive) setQuote(q);
        })
        .catch(() => {});
    }, 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [cartPayload, appliedCoupon, paymentMethod]);

  const prepaidPercent = ctx?.settings.prepaidDiscountPercent ?? pay.prepaid_discount_percent;
  const onlineFee = ctx?.settings.onlineFee ?? pay.online_fee;
  const codFee = ctx?.settings.codFee ?? pay.cod_fee;
  const codMax = ctx?.settings.codMaxOrder ?? pay.cod_max_order;
  const codEnabled = (ctx?.settings.codEnabled ?? pay.cod_enabled) && !(codMax > 0 && (quote?.subtotal ?? subtotal) > codMax);
  const onlineEnabled = ctx?.settings.onlineEnabled ?? pay.online_enabled;
  const paymentFee = paymentMethod === "cod" ? codFee : onlineFee;
  // The prepaid discount is recomputed instantly (same formula as the server) so
  // switching payment mode never shows a stale total while the re-quote is in flight.
  const prepaidDiscount =
    paymentMethod === "prepaid" ? Math.round(((quote?.subtotal ?? subtotal) * prepaidPercent) / 100) : 0;
  const couponDiscount = quote?.couponDiscount ?? 0;
  const shippingFee = quote?.shippingFee ?? 0;
  const finalPayable = quote
    ? Math.max(0, quote.subtotal + quote.giftWrapTotal + quote.shippingFee + paymentFee - prepaidDiscount - quote.couponDiscount)
    : Math.max(0, grandTotal + paymentFee - prepaidDiscount - couponDiscount);
  const couponApplied = Boolean(quote?.couponCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    setAppliedCoupon(code || null);
  };

  const openRazorpay = (res: {
    orderId: string;
    orderNumber: string;
    razorpayOrderId: string;
    razorpayKeyId: string;
    amount: number;
  }) => {
    const RazorpayCtor = typeof window !== "undefined" ? (window as RazorpayWindow).Razorpay : undefined;
    if (!RazorpayCtor) {
      setPlacing(false);
      setOrderError("Payment gateway is still loading — please wait a second and try again.");
      return;
    }

    const rzp = new RazorpayCtor({
      key: res.razorpayKeyId,
      amount: res.amount,
      currency: "INR",
      name: "SHIQUEEN",
      description: `Order ${res.orderNumber}`,
      order_id: res.razorpayOrderId,
      prefill: {
        name: fullName,
        email,
        contact: phone,
      },
      notes: {
        internal_order_id: res.orderId,
        order_number: res.orderNumber,
      },
      theme: { color: "#8C671A" },
      modal: {
        ondismiss: () => {
          setPlacing(false);
          setOrderError("Payment was cancelled. You can try again whenever you're ready.");
        },
      },
      handler: async (response: RazorpaySuccessResponse) => {
        try {
          const verified = await verifyRazorpayPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            orderId: res.orderId,
          });
          if (verified.ok) {
            setOrderPlacedId(verified.orderNumber);
            setPaymentId(verified.razorpayPaymentId);
            setInstructions("");
            clearCart();
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            setOrderError(verified.error);
          }
        } catch {
          setOrderError(
            "Payment was received, but we couldn't verify it right now. Please contact support on WhatsApp with your order number."
          );
        } finally {
          setPlacing(false);
        }
      },
    });

    rzp.on("payment.failed", (failure: RazorpayFailedResponse) => {
      setPlacing(false);
      setOrderError(failure?.error?.description || "Payment failed. Please try again or choose another payment method.");
    });

    rzp.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placing) return;
    setPlacing(true);
    setOrderError(null);
    setOrderIssues([]);
    try {
      const res = await placeOrder({
        items: cartPayload,
        couponCode: couponApplied ? appliedCoupon ?? "" : "",
        paymentMethod,
        fullName,
        phone,
        email,
        address,
        city,
        state: stateName,
        pincode,
      });
      if (res.ok) {
        if (res.isRazorpay) {
          openRazorpay(res);
          return;
        }
        setOrderPlacedId(res.orderNumber);
        setPaymentId(null);
        setInstructions(res.instructions);
        clearCart();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setPlacing(false);
      } else {
        setOrderError(res.error);
        setOrderIssues(res.issues ?? []);
        setPlacing(false);
      }
    } catch {
      setOrderError("We couldn't reach the server. Please check your connection and try again.");
      setPlacing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717]">
      {(onlineEnabled || ctx?.settings.razorpayEnabled) && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      )}
      <Header />

      <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 lg:px-12">
        {orderPlacedId ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-[#E5DEC9] bg-white p-8 text-center shadow-xs">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EA] text-2xl text-[#137333]">
              ✓
            </span>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-[#8C671A]">
              Order Confirmed • {orderPlacedId}
            </p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-[#111111]">
              Thank you!
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#171717]/75 sm:text-sm">
              Your order <strong>{orderPlacedId}</strong> has been received. We&apos;ll share dispatch and tracking updates with you shortly.
            </p>
            {paymentId && (
              <p className="mt-2 text-xs text-[#171717]/65">
                Payment ID: <span className="font-mono font-semibold text-[#111111] select-all">{paymentId}</span>
              </p>
            )}
            {instructions && (
              <div className="mx-auto mt-4 max-w-md whitespace-pre-line rounded-2xl border border-[#E5DEC9] bg-[#FBF7EE] p-4 text-left text-sm text-[#171717]">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-[#8C671A]">How to pay</p>
                {instructions}
              </div>
            )}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-full bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
              >
                Continue Shopping
              </Link>
              <a
                href={whatsapp(
                  `Hi Shiqueen! My Order ID is ${orderPlacedId}. Please share dispatch & tracking updates.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#171717] bg-[#FAF7F2] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#171717]"
              >
                <WhatsAppIcon className="h-4 w-4 text-[#1E7E34]" />
                <span>Track on WhatsApp</span>
              </a>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border border-[#E5DEC9] bg-white p-8 text-center shadow-xs">
            <h1 className="font-serif text-2xl font-bold text-[#111111]">
              Your Checkout Bag is Empty
            </h1>
            <p className="mt-2 text-xs text-[#171717]/70">
              Add your favorite anti-tarnish jewelry, watches, or gift hampers before checking out.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-full bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
            >
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Shipping & Payment Form */}
            <form
              onSubmit={handlePlaceOrder}
              className="space-y-6 rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs sm:p-8 lg:col-span-7"
            >
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8C671A]">
                  Shiqueen Secure Express Checkout
                </p>
                <h1 className="mt-1 font-serif text-2xl font-bold text-[#111111] sm:text-3xl">
                  Delivery &amp; Payment Details
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    WhatsApp / Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717]">
                  Email Address (for Invoice &amp; Tracking)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="queen@example.com"
                  className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#171717]">
                  Complete Delivery Address (House No, Building, Area) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat / House No., Street, Landmark"
                  className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171717]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="Maharashtra"
                    className="mt-1 w-full rounded-xl border border-[#E5DEC9] bg-[#FAF7F2] px-3.5 py-2.5 text-xs focus:border-[#8C671A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                  Select Payment Mode
                </p>
                <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {onlineEnabled && (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "prepaid" ? "border-[#111111] bg-[#FAF7F2]" : "border-[#E5DEC9] bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "prepaid"}
                      onChange={() => setPaymentMethod("prepaid")}
                      className="mt-0.5 accent-[#111111]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#111111]">
                        {pay.online_label}
                        {prepaidPercent > 0 ? ` (Extra ${prepaidPercent}% OFF)` : ""}
                      </p>
                      <p className="mt-0.5 text-xs text-[#171717]/70">{pay.online_description}</p>
                      {prepaidPercent > 0 && (
                        <p className="mt-0.5 text-xs font-semibold text-[#137333]">
                          Save ₹{Math.round(((quote?.subtotal ?? subtotal) * prepaidPercent) / 100).toLocaleString("en-IN")}
                        </p>
                      )}
                      {onlineFee > 0 && <p className="mt-0.5 text-xs font-semibold text-[#8A4B00]">+ ₹{onlineFee.toLocaleString("en-IN")} payment charge</p>}
                    </div>
                  </label>
                  )}

                  {codEnabled && (
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "cod" ? "border-[#111111] bg-[#FAF7F2]" : "border-[#E5DEC9] bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-0.5 accent-[#111111]"
                    />
                    <div>
                      <p className="text-sm font-bold text-[#111111]">{pay.cod_label}</p>
                      <p className="mt-0.5 text-xs text-[#171717]/70">{pay.cod_description}</p>
                      {codFee > 0 && <p className="mt-0.5 text-xs font-semibold text-[#8A4B00]">+ ₹{codFee.toLocaleString("en-IN")} COD charge</p>}
                    </div>
                  </label>
                  )}
                </div>
                {!(ctx?.settings.codEnabled ?? pay.cod_enabled) && (
                  <div className="mt-3 flex items-start gap-2.5 rounded-2xl border border-[#DFC99B]/60 bg-[#FAF6EE] p-3 text-xs text-[#2C241D]/90">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#8C671A] text-[10px] font-bold text-white mt-0.5">ℹ</span>
                    <div>
                      <p className="font-semibold text-[#111111]">Prepaid Orders Only • COD Unavailable</p>
                      <p className="mt-0.5 text-[11px] text-[#171717]/70 leading-relaxed">
                        To guarantee safe express transit and swift dispatches, we accept 100% secure payments via UPI (GPay, PhonePe, Paytm), Debit/Credit Cards &amp; NetBanking.
                      </p>
                    </div>
                  </div>
                )}
                {!codEnabled && (ctx?.settings.codEnabled ?? pay.cod_enabled) && codMax > 0 && (
                  <p className="mt-2 text-xs text-[#171717]/70">Cash on Delivery is available for orders up to ₹{codMax.toLocaleString("en-IN")}.</p>
                )}
              </div>

              {orderError && (
                <div role="alert" className="rounded-2xl border border-[#F4C7C3] bg-[#FEF3F2] p-4 text-sm text-[#912018]">
                  <p className="font-semibold">{orderError}</p>
                  {orderIssues.length > 0 && (
                    <ul className="mt-1 list-disc pl-5">
                      {orderIssues.map((i) => (
                        <li key={i}>{i}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {ctx && !ctx.user && (
                <p className="text-sm text-[#171717]/75">
                  Have an account?{" "}
                  <Link href="/login?next=/checkout" className="font-semibold text-[#8C671A] underline">
                    Sign in
                  </Link>{" "}
                  to track this order from your dashboard.
                </p>
              )}

              <button
                type="submit"
                disabled={placing}
                className="w-full rounded-full bg-[#111111] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#8C671A] disabled:cursor-wait disabled:opacity-70"
              >
                {placing ? "Placing your order…" : `Complete Royal Order • ₹${finalPayable.toLocaleString("en-IN")}`}
              </button>
            </form>

            {/* Right Column: Order Summary & Coupon Box */}
            <aside className="rounded-3xl border border-[#E5DEC9] bg-white p-6 shadow-xs lg:col-span-5">
              <h2 className="font-serif text-xl font-bold text-[#111111]">
                Order Summary ({totalItems} items)
              </h2>

              <div className="mt-4 divide-y divide-[#E5DEC9]">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.plating}-${item.giftWrap}`}
                    className="flex items-center justify-between gap-3 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[#E5DEC9]">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#111111]">
                          {item.name} × {item.quantity}
                        </p>
                        <p className="text-[11px] text-[#171717]/65">
                          {item.plating}
                          {item.giftWrap
                            ? ` • Special Gift Wrap (+₹${GIFT_WRAP_PRICE})`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#111111]">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <form onSubmit={handleApplyCoupon} className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Promo code"
                  className="flex-1 rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-2 text-xs font-semibold uppercase placeholder:normal-case focus:border-[#8C671A] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && quote && (
                <p className={`mt-1.5 text-xs font-semibold ${couponApplied ? "text-[#137333]" : "text-[#B42318]"}`}>
                  {couponApplied
                    ? `✓ Code ${quote.couponCode} applied (−₹${couponDiscount.toLocaleString("en-IN")})`
                    : quote.couponMessage}
                </p>
              )}
              {quote && quote.issues.length > 0 && (
                <ul className="mt-3 list-disc rounded-xl bg-[#FEF3F2] p-3 pl-7 text-xs text-[#912018]">
                  {quote.issues.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              )}

              <div className="mt-5 space-y-2 border-t border-[#E5DEC9] pt-4 text-xs">
                <div className="flex justify-between text-[#171717]/75">
                  <span>MRP Total</span>
                  <span className="line-through">
                    ₹{totalOriginalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[#171717]/75">
                  <span>Selling Subtotal</span>
                  <span className="font-semibold text-[#111111]">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {giftWrapTotal > 0 && (
                  <div className="flex justify-between text-[#171717]/75">
                    <span>Special Gift Wrap</span>
                    <span className="font-semibold text-[#111111]">
                      ₹{giftWrapTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {prepaidDiscount > 0 && (
                  <div className="flex justify-between text-[#137333]">
                    <span>Extra {prepaidPercent}% Prepaid Discount</span>
                    <span className="font-semibold">
                      −₹{prepaidDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#137333]">
                    <span>Coupon Discount ({quote?.couponCode})</span>
                    <span className="font-semibold">
                      −₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {paymentFee > 0 && (
                  <div className="flex justify-between text-[#171717]/75">
                    <span>{paymentMethod === "cod" ? "COD charges" : "Payment charges"}</span>
                    <span className="font-semibold text-[#111111]">₹{paymentFee.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#171717]/75">
                  <span>Express Pan-India Shipping</span>
                  {shippingFee > 0 ? (
                    <span className="font-semibold text-[#111111]">₹{shippingFee.toLocaleString("en-IN")}</span>
                  ) : (
                    <span className="font-semibold text-[#137333]">FREE</span>
                  )}
                </div>
                <div className="flex items-baseline justify-between border-t border-[#E5DEC9] pt-3 text-sm font-bold text-[#111111]">
                  <span>Total Payable</span>
                  <span className="text-lg">
                    ₹{finalPayable.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
