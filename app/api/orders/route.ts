import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { sendOrderConfirmationEmail } from "@/lib/email";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const orderData = await request.json();

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Create or find user
    let user = await User.findOne({ email: orderData.user_email });
    let isNewUser = false;
    let userCredentials = null;

    if (!user) {
      // Create new user with random password
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = new User({
        name: orderData.shipping_address.fullName,
        email: orderData.user_email,
        password: hashedPassword,
        phone: orderData.shipping_address.phone,
      });
      await user.save();

      isNewUser = true;
      userCredentials = {
        email: user.email,
        password: randomPassword,
      };
    }

    // Create order
    const order = new Order({
      user_id: user._id,
      order_number: orderNumber,
      items: orderData.items.map((item: any) => ({
        product_id: item.productId,
        variation_id: item.variantId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image,
        size: item.size || "",
        color: item.color || "",
      })),
      total: orderData.total,
      subtotal: orderData.subtotal,
      discount: orderData.discount || 0,
      coupon_code: orderData.coupon_code,
      shipping_address: {
        full_name: orderData.shipping_address.fullName,
        address_line1: orderData.shipping_address.addressLine1,
        address_line2: orderData.shipping_address.addressLine2,
        city: orderData.shipping_address.city,
        state: orderData.shipping_address.state,
        postal_code: orderData.shipping_address.postalCode,
        country: orderData.shipping_address.country,
        phone: orderData.shipping_address.phone,
      },
      billing_address: {
        full_name: orderData.billing_address.fullName,
        address_line1: orderData.billing_address.addressLine1,
        address_line2: orderData.billing_address.addressLine2,
        city: orderData.billing_address.city,
        state: orderData.billing_address.state,
        postal_code: orderData.billing_address.postalCode,
        country: orderData.billing_address.country,
        phone: orderData.billing_address.phone,
      },
      payment_method: orderData.payment_method,
      payment_status:
        orderData.payment_method === "cod" ? "pending" : "processing",
      payment_details: {
        method: orderData.payment_method,
        ...(orderData.payment_method === "phonepe" && {
          gateway: "phonepe",
          initiated_at: new Date(),
        }),
      },
    });

    await order.save();

    // Send order confirmation email
    try {
      await sendOrderConfirmationEmail({
        to: user.email,
        orderNumber,
        customerName: user.name,
        items: orderData.items,
        total: orderData.total,
        paymentMethod: orderData.payment_method,
        isNewUser,
        credentials: userCredentials,
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
