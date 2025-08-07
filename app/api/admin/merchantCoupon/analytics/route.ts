import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CouponCode } from "@/lib/models/CouponCode";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import "@/lib/models/Merchant"

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Verify admin token
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get all coupons with populated merchant data
    const coupons = await CouponCode.find({})
      .populate("merchantId", "businessName")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });

    // Calculate overall metrics
    const totalCoupons = coupons.length;
    const activeCoupons = coupons.filter(
      (c) => c.isActive && new Date(c.validUntil) > new Date()
    ).length;
    const totalRedemptions = coupons.reduce(
      (sum, coupon) => sum + coupon.usedCount,
      0
    );
    const totalDiscountGiven = coupons.reduce(
      (sum, coupon) =>
        sum +
        coupon.redemptions.reduce(
          (redemptionSum, r) => redemptionSum + r.discountAmount,
          0
        ),
      0
    );

    // Calculate monthly statistics for the last 12 months
    const monthlyStats = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthRedemptions = coupons.reduce((sum, coupon) => {
        return (
          sum +
          coupon.redemptions.filter((r) => {
            const redemptionDate = new Date(r.redeemedAt);
            return redemptionDate >= monthStart && redemptionDate <= monthEnd;
          }).length
        );
      }, 0);

      const monthDiscount = coupons.reduce((sum, coupon) => {
        return (
          sum +
          coupon.redemptions
            .filter((r) => {
              const redemptionDate = new Date(r.redeemedAt);
              return redemptionDate >= monthStart && redemptionDate <= monthEnd;
            })
            .reduce((redemptionSum, r) => redemptionSum + r.discountAmount, 0)
        );
      }, 0);

      monthlyStats.push({
        month: monthStart.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        redemptions: monthRedemptions,
        discountGiven: Math.round(monthDiscount * 100) / 100,
      });
    }

    // Get top performing coupons
    const topCoupons = coupons
      .map((coupon) => ({
        _id: coupon._id,
        code: coupon.code,
        title: coupon.title,
        merchantName: coupon.merchantId?.businessName || "Unknown",
        createdBy: coupon.createdBy?.name || "Unknown",
        createdByRole: coupon.createdByRole,
        usedCount: coupon.usedCount,
        totalDiscount: coupon.redemptions.reduce(
          (sum, r) => sum + r.discountAmount,
          0
        ),
        isActive: coupon.isActive,
        validUntil: coupon.validUntil,
      }))
      .sort((a, b) => b.usedCount - a.usedCount)
      .slice(0, 10);

    // Get recent redemptions
    const recentRedemptions = [];
    coupons.forEach((coupon) => {
      coupon.redemptions.forEach((redemption) => {
        recentRedemptions.push({
          couponCode: coupon.code,
          couponTitle: coupon.title,
          merchantName: coupon.merchantId?.businessName || "Unknown",
          customerName: redemption.customerName,
          customerPhone: redemption.customerPhone,
          orderAmount: redemption.orderAmount,
          discountAmount: redemption.discountAmount,
          redeemedAt: redemption.redeemedAt,
        });
      });
    });

    recentRedemptions.sort(
      (a, b) =>
        new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime()
    );

    // Calculate coupon type distribution
    const typeDistribution = {
      percentage: coupons.filter((c) => c.discountType === "percentage").length,
      fixed: coupons.filter((c) => c.discountType === "fixed").length,
    };

    // Calculate creator distribution
    const creatorDistribution = {
      admin: coupons.filter((c) => c.createdByRole === "admin").length,
      agent: coupons.filter((c) => c.createdByRole === "agent").length,
    };

    return NextResponse.json({
      overallMetrics: {
        totalCoupons,
        activeCoupons,
        totalRedemptions,
        totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100,
      },
      monthlyStats,
      topCoupons,
      recentRedemptions: recentRedemptions.slice(0, 20),
      typeDistribution,
      creatorDistribution,
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
