import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import prisma from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent)
        break

      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent)
        break

      case "charge.refunded":
        await handleChargeRefunded(event.data.object as Stripe.Charge)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error handling webhook event:", error)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const { cartId, userId, shippingAddress, billingAddress } = session.metadata || {}

  if (!cartId) {
    console.error("No cartId in session metadata")
    return
  }

  // Fetch cart with items
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  })

  if (!cart) {
    console.error("Cart not found:", cartId)
    return
  }

  // Generate unique order number
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`

  // Parse addresses
  const parsedShippingAddress = shippingAddress ? JSON.parse(shippingAddress) : null
  const parsedBillingAddress = billingAddress ? JSON.parse(billingAddress) : null

  // Create order
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: userId || cart.userId!,
      email: session.customer_email || session.customer_details?.email || "",
      phone: session.customer_details?.phone || null,
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping: cart.shipping,
      tax: cart.tax,
      total: cart.total,
      currency: "USD",
      shippingAddress: parsedShippingAddress || session.customer_details?.address || {},
      billingAddress: parsedBillingAddress || session.customer_details?.address || null,
      paymentMethod: "CARD",
      paymentStatus: "CAPTURED",
      transactionId: session.payment_intent as string,
      paymentGateway: "stripe",
      gatewayOrderId: session.id,
      paidAt: new Date(),
      status: "CONFIRMED",
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          sku: item.sku,
          image: item.image,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.subtotal,
        })),
      },
    },
  })

  // Update product stock quantities
  for (const item of cart.items) {
    if (item.product.trackInventory) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
          purchaseCount: {
            increment: item.quantity,
          },
        },
      })
    }
  }

  // Clear cart items
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  })

  // Update cart
  await prisma.cart.update({
    where: { id: cart.id },
    data: {
      subtotal: 0,
      discount: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    },
  })

  console.log("Order created successfully:", order.orderNumber)
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update order payment status
  await prisma.order.updateMany({
    where: { transactionId: paymentIntent.id },
    data: {
      paymentStatus: "CAPTURED",
      paidAt: new Date(),
    },
  })

  console.log("Payment succeeded:", paymentIntent.id)
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update order payment status
  await prisma.order.updateMany({
    where: { transactionId: paymentIntent.id },
    data: {
      paymentStatus: "FAILED",
    },
  })

  console.log("Payment failed:", paymentIntent.id)
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  // Update order to refunded status
  await prisma.order.updateMany({
    where: { transactionId: charge.payment_intent as string },
    data: {
      paymentStatus: "REFUNDED",
      status: "REFUNDED",
    },
  })

  console.log("Charge refunded:", charge.id)
}
