import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import {Order} from "@/models/Order"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string; orderId: string } }) {
  try {
    await connectDB()

    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }    

    const decoded = session.user

    // Check if user is accessing their own order
    if (decoded.id !== params.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const order:any = await Order.findOne({
      _id: params.orderId,
      user_id: params.id,
    }).lean()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Generate HTML invoice
    const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${order.order_number}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #0042ad; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #0042ad; margin-bottom: 5px; }
            .invoice-title { font-size: 20px; margin-top: 20px; }
            .order-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .order-details, .billing-details { width: 48%; }
            .section-title { font-weight: bold; margin-bottom: 10px; color: #0042ad; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f8f9fa; font-weight: bold; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-final { font-weight: bold; font-size: 18px; border-top: 2px solid #0042ad; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            .status-badge { 
                display: inline-block; 
                padding: 4px 8px; 
                border-radius: 4px; 
                font-size: 12px; 
                font-weight: bold;
                ${
                  order.status === "delivered"
                    ? "background-color: #d4edda; color: #155724;"
                    : order.status === "shipped"
                      ? "background-color: #d1ecf1; color: #0c5460;"
                      : order.status === "processing"
                        ? "background-color: #fff3cd; color: #856404;"
                        : "background-color: #f8d7da; color: #721c24;"
                }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-name">Inoxsecure Company</div>
            <div>123 Business Street, City, State 12345</div>
            <div>Phone: (555) 123-4567 | Email: info@company.com</div>
            <div class="invoice-title">INVOICE</div>
        </div>

        <div class="order-info">
            <div class="order-details">
                <div class="section-title">Order Information</div>
                <div><strong>Order Number:</strong> ${order.order_number}</div>
                <div><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</div>
                <div><strong>Status:</strong> <span class="status-badge">${order.status.toUpperCase()}</span></div>
                <div><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</div>
                <div><strong>Payment Status:</strong> ${order.payment_status.toUpperCase()}</div>
            </div>
            <div class="billing-details">
                <div class="section-title">Billing Address</div>
                <div>${order.billing_address.full_name}</div>
                <div>${order.billing_address.address_line1}</div>
                ${order.billing_address.address_line2 ? `<div>${order.billing_address.address_line2}</div>` : ""}
                <div>${order.billing_address.city}, ${order.billing_address.state} ${order.billing_address.postal_code}</div>
                <div>${order.billing_address.country}</div>
                <div>Phone: ${order.billing_address.phone}</div>
            </div>
        </div>

        <div class="section-title">Order Items</div>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.items
                  .map(
                    (item:any) => `
                    <tr>
                        <td>
                            ${item.name}
                            ${item.size ? `<br><small>Size: ${item.size}</small>` : ""}
                            ${item.color ? `<br><small>Color: ${item.color}</small>` : ""}
                        </td>
                        <td>${item.quantity}</td>
                        <td>₹${item.price.toLocaleString()}</td>
                        <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>₹${order.subtotal.toLocaleString()}</span>
            </div>
            ${
              order.discount > 0
                ? `
                <div class="total-row" style="color: #28a745;">
                    <span>Discount ${order.coupon_code ? `(${order.coupon_code})` : ""}:</span>
                    <span>-₹${order.discount.toLocaleString()}</span>
                </div>
            `
                : ""
            }
            <div class="total-row">
                <span>Shipping:</span>
                <span style="color: #28a745;">Free</span>
            </div>
            <div class="total-row">
                <span>Tax (18%):</span>
                <span>₹${Math.round((order.total - order.discount) * 0.18).toLocaleString()}</span>
            </div>
            <div class="total-row total-final">
                <span>Total Amount:</span>
                <span>₹${order.total.toLocaleString()}</span>
            </div>
        </div>

        ${
          order.shipping_address
            ? `
            <div style="margin-top: 30px;">
                <div class="section-title">Shipping Address</div>
                <div>${order.shipping_address.full_name}</div>
                <div>${order.shipping_address.address_line1}</div>
                ${order.shipping_address.address_line2 ? `<div>${order.shipping_address.address_line2}</div>` : ""}
                <div>${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.postal_code}</div>
                <div>${order.shipping_address.country}</div>
                <div>Phone: ${order.shipping_address.phone}</div>
            </div>
        `
            : ""
        }

        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice. No signature required.</p>
        </div>
    </body>
    </html>
    `

    return new NextResponse(invoiceHTML, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="invoice-${order.order_number}.html"`,
      },
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
