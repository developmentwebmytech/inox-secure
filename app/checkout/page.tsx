"use client";

import type React from "react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CheckoutPage() {
  const { state: cartState, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);

  const shippingFee = cartState.total > 19999 ? 0 : 199;
  const finalTotal = cartState.total - discount + shippingFee;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          cartTotal: cartState.total,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDiscount(data.discount);
        setAppliedCoupon({
          code: couponCode,
          discount: data.discount,
          description: data.coupon.description,
        });
        toast.success("Coupon applied successfully!");
      } else {
        setDiscount(0);
        setAppliedCoupon(null);
        toast.error(data.error || "Invalid coupon code");
      }
    } catch (error) {
      setDiscount(0);
      setAppliedCoupon(null);
      toast.error("Failed to apply coupon");
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const orderData = {
        items: cartState.items,
        total: finalTotal,
        subtotal: cartState.total,
        discount,
        shipping_fee: shippingFee,
        coupon_code: appliedCoupon?.code || null,
        shipping_address: formData,
        billing_address: formData,
        payment_method: paymentMethod,
        user_email: formData.email,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const order = await response.json();
        if (!order.order_number) {
          toast.error("Order number is missing from response");
          return;
        }

        // Record coupon usage if applied
        if (appliedCoupon) {
          await fetch("/api/coupons/record-usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: appliedCoupon.code }),
          });
        }

        // Payment method handling
        if (paymentMethod === "phonepe") {
          const paymentResponse = await fetch("/api/payments/phonepe/initiate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: order.order_number,
              amount: finalTotal,
              userPhone: formData.phone,
            }),
          });

          const paymentData = await paymentResponse.json();

          if (paymentData.success) {
            clearCart();
            window.location.href = paymentData.redirectUrl;
          } else {
            toast.error(paymentData.error || "Payment initiation failed");
          }
        } else {
          clearCart();
          router.push(`/order-confirmation/${order.order_number}`);
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement failed:", error);
      toast.error("Order placement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handlePlaceOrder}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Order Form */}
              <div className="space-y-6">
                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      required
                    />
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      required
                    />
                  </CardContent>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleInputChange}
                      placeholder="Address Line 1"
                      required
                    />
                    <Input
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleInputChange}
                      placeholder="Address Line 2 (Optional)"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        required
                      />
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="Postal Code"
                        required
                      />
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        disabled
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="flex items-center gap-2">
                          <Badge variant="secondary">Cash on Delivery</Badge>
                          <span className="text-sm text-gray-600">Pay when you receive your order</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <RadioGroupItem value="phonepe" id="phonepe" />
                        <Label htmlFor="phonepe" className="flex items-center gap-2">
                          <Badge className="bg-purple-600 text-white">PhonePe</Badge>
                          <span className="text-sm text-gray-600">Pay securely with PhonePe</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                {/* Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {cartState.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={60}
                          height={60}
                          className="rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{item.name}</h3>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartState.total.toLocaleString()}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-₹{discount.toLocaleString()}</span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span>Shipping</span>
                        {shippingFee === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span>₹{shippingFee}</span>
                        )}
                      </div>

                      <Separator />

                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{finalTotal.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Coupon */}
                <Card>
                  <CardHeader>
                    <CardTitle>Coupon Code</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button type="button" variant="outline" onClick={applyCoupon}>
                        Apply
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800 font-medium">
                          Coupon "{appliedCoupon.code}" applied!
                        </p>
                        <p className="text-sm text-green-600">
                          You saved ₹{discount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-[#0042adef] hover:bg-[#0042ad] text-lg py-6"
                  disabled={isProcessing || cartState.items.length === 0}
                >
                  {isProcessing
                    ? "Processing..."
                    : paymentMethod === "phonepe"
                    ? `Pay with PhonePe - ₹${finalTotal.toLocaleString()}`
                    : `Place Order - ₹${finalTotal.toLocaleString()}`}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
