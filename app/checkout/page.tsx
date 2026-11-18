"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Header, { WhatsAppIcon } from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart, GIFT_WRAP_PRICE } from "@/context/CartContext";
import { SOCIAL_LINKS } from "@/lib/brand-data";

export default function CheckoutPage() {
  const {
    items,
    totalItems,
    subtotal,
    totalOriginalPrice,
    giftWrapTotal,
    grandTotal,
    clearCart,
  } = useCart();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [orderPlacedId, setOrderPlacedId] = useState<string | null>(null);

  const prepaidDiscount =
    paymentMethod === "prepaid" ? Math.round(subtotal * 0.1) : 0;
  const couponDiscount =
    appliedCoupon === "NEW50"
      ? 50
      : appliedCoupon === "B1G1QUEEN" && totalItems >= 2
      ? Math.round(subtotal * 0.25)
      : appliedCoupon === "ROYAL50" && totalItems >= 3
      ? Math.round(subtotal * 0.35)
      : 0;

  const finalPayable = Math.max(
    0,
    grandTotal - prepaidDiscount - couponDiscount
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (["NEW50", "B1G1QUEEN", "ROYAL50"].includes(code)) {
      setAppliedCoupon(code);
    } else {
      setAppliedCoupon("NEW50");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `SQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderPlacedId(generatedId);
    clearCart();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#171717]">
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
              Thank You, Queen!
            </h1>
            <p className="mt-2 text-xs leading-relaxed text-[#171717]/75 sm:text-sm">
              Your order <strong>{orderPlacedId}</strong> has been received. Our Gifting &amp; Dispatch Studio will share live tracking details on your WhatsApp shortly.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/"
                className="rounded-full bg-[#111111] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
              >
                Continue Shopping
              </Link>
              <a
                href={SOCIAL_LINKS.whatsappUrl(
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
                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "prepaid"
                        ? "border-[#111111] bg-[#FAF7F2]"
                        : "border-[#E5DEC9] bg-white"
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
                      <p className="text-xs font-bold text-[#111111]">
                        UPI / Cards / NetBanking (Extra 10% OFF)
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#137333]">
                        Save ₹{Math.round(subtotal * 0.1).toLocaleString("en-IN")} instantly on prepaid
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#111111] bg-[#FAF7F2]"
                        : "border-[#E5DEC9] bg-white"
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
                      <p className="text-xs font-bold text-[#111111]">
                        Cash on Delivery (COD)
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#171717]/65">
                        Pay via Cash or UPI at your doorstep
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-[#111111] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white shadow-lg transition hover:bg-[#8C671A]"
              >
                Complete Royal Order • ₹{finalPayable.toLocaleString("en-IN")}
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
                  placeholder="Promo code (NEW50 / B1G1QUEEN)"
                  className="flex-1 rounded-full border border-[#E5DEC9] bg-[#FAF7F2] px-4 py-2 text-xs font-semibold uppercase placeholder:normal-case focus:border-[#8C671A] focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="rounded-full bg-[#111111] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#8C671A]"
                >
                  Apply
                </button>
              </form>
              {appliedCoupon && (
                <p className="mt-1.5 text-xs font-semibold text-[#137333]">
                  ✓ Code {appliedCoupon} applied (−₹{couponDiscount})
                </p>
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
                    <span>Extra 10% Prepaid Discount</span>
                    <span className="font-semibold">
                      −₹{prepaidDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#137333]">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span className="font-semibold">
                      −₹{couponDiscount.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-[#171717]/75">
                  <span>Express Pan-India Shipping</span>
                  <span className="font-semibold text-[#137333]">FREE</span>
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
