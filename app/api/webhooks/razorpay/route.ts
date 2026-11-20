import { NextResponse, after } from "next/server";

import {
  markOrderPaid,
  markOrderPaymentFailed,
  sendPaidOrderEmails,
  verifyRazorpayWebhookSignature,
} from "@/lib/server/razorpay";

interface RazorpayWebhookPayload {
  event?: string;
  payload?: {
    payment?: {
      entity?: {
        id?: string;
        order_id?: string;
        error_description?: string;
        notes?: Record<string, string | undefined>;
      };
    };
    order?: {
      entity?: {
        id?: string;
        receipt?: string;
        notes?: Record<string, string | undefined>;
      };
    };
  };
}

export async function POST(request: Request) {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET?.trim()) {
      console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not configured.");
      return NextResponse.json(
        { success: false, error: "Webhook secret is not configured." },
        { status: 500 }
      );
    }

    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature") ?? "";

    if (!signature) {
      return NextResponse.json(
        { success: false, error: "Missing x-razorpay-signature header." },
        { status: 400 }
      );
    }

    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      console.error("[razorpay-webhook] Signature mismatch.");
      return NextResponse.json(
        { success: false, error: "Invalid webhook signature." },
        { status: 400 }
      );
    }

    const body = JSON.parse(rawBody) as RazorpayWebhookPayload;
    const event = body.event ?? "";

    switch (event) {
      case "payment.captured": {
        const payment = body.payload?.payment?.entity;
        if (!payment) break;

        const result = await markOrderPaid({
          orderId: payment.notes?.internal_order_id || payment.notes?.order_id,
          razorpayOrderId: payment.order_id,
          razorpayPaymentId: payment.id,
          source: "webhook",
        });

        if (result.transitioned && result.emailData) {
          const emailData = result.emailData;
          after(async () => {
            await sendPaidOrderEmails(emailData);
          });
        }
        break;
      }

      case "order.paid": {
        const orderEntity = body.payload?.order?.entity;
        const paymentEntity = body.payload?.payment?.entity;
        if (!orderEntity) break;

        const result = await markOrderPaid({
          orderId: orderEntity.notes?.internal_order_id || orderEntity.notes?.order_id || orderEntity.receipt,
          razorpayOrderId: orderEntity.id,
          razorpayPaymentId: paymentEntity?.id,
          source: "webhook",
        });

        if (result.transitioned && result.emailData) {
          const emailData = result.emailData;
          after(async () => {
            await sendPaidOrderEmails(emailData);
          });
        }
        break;
      }

      case "payment.failed": {
        const payment = body.payload?.payment?.entity;
        if (!payment) break;

        await markOrderPaymentFailed({
          orderId: payment.notes?.internal_order_id || payment.notes?.order_id,
          razorpayOrderId: payment.order_id,
          reason: payment.error_description || "Payment failed",
        });
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ success: true, event }, { status: 200 });
  } catch (err) {
    console.error("[razorpay-webhook] Error handling webhook:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
