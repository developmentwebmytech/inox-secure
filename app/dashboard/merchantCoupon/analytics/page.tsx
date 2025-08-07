"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  TrendingUp,
  Users,
  CreditCard,
  Target,
  PieChart,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  overallMetrics: {
    totalCoupons: number;
    activeCoupons: number;
    totalRedemptions: number;
    totalDiscountGiven: number;
  };
  monthlyStats: Array<{
    month: string;
    redemptions: number;
    discountGiven: number;
  }>;
  topCoupons: Array<{
    _id: string;
    code: string;
    title: string;
    merchantName: string;
    createdBy: string;
    createdByRole: string;
    usedCount: number;
    totalDiscount: number;
    isActive: boolean;
    validUntil: string;
  }>;
  recentRedemptions: Array<{
    couponCode: string;
    couponTitle: string;
    merchantName: string;
    customerName: string;
    customerPhone: string;
    orderAmount: number;
    discountAmount: number;
    redeemedAt: string;
  }>;
  typeDistribution: {
    percentage: number;
    fixed: number;
  };
  creatorDistribution: {
    admin: number;
    agent: number;
  };
}

export default function CouponAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/merchantCoupon/analytics");

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/merchantCoupon">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coupons
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Coupon Analytics</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/merchantCoupon">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Coupons
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Coupon Analytics</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">
              {error || "Failed to load analytics"}
            </p>
            <Button onClick={fetchAnalytics} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    overallMetrics,
    monthlyStats,
    topCoupons,
    recentRedemptions,
    typeDistribution,
    creatorDistribution,
  } = analytics;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/merchantCoupon">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Coupons
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Coupon Analytics</h1>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallMetrics.totalCoupons}
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-green-600">
                {overallMetrics.activeCoupons} Active
              </Badge>
              <Badge variant="outline" className="text-gray-600">
                {overallMetrics.totalCoupons - overallMetrics.activeCoupons}{" "}
                Inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Redemptions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallMetrics.totalRedemptions}
            </div>
            <p className="text-xs text-muted-foreground">
              All time redemptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Discount Given
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{overallMetrics.totalDiscountGiven.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Customer savings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Discount</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {overallMetrics.totalRedemptions > 0
                ? Math.round(
                    overallMetrics.totalDiscountGiven /
                      overallMetrics.totalRedemptions
                  )
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per redemption</p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupon Types</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Percentage</span>
                <Badge variant="outline">{typeDistribution.percentage}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Fixed Amount</span>
                <Badge variant="outline">{typeDistribution.fixed}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created By</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Admin</span>
                <Badge variant="outline" className="text-blue-600">
                  {creatorDistribution.admin}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Agent</span>
                <Badge variant="outline" className="text-green-600">
                  {creatorDistribution.agent}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Performance (Last 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyStats.map((stat, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-semibold">{stat.month}</h3>
                  <p className="text-sm text-gray-600">
                    {stat.redemptions} redemptions
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₹{stat.discountGiven.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Discount given</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Coupons */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCoupons.slice(0, 10).map((coupon, index) => (
              <div
                key={coupon._id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{coupon.code}</h3>
                      {coupon.isActive ? (
                        <Badge variant="outline" className="text-green-600">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-red-600">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{coupon.title}</p>
                    <p className="text-sm text-gray-500">
                      Merchant: {coupon.merchantName} | Created by:{" "}
                      {coupon.createdBy} ({coupon.createdByRole})
                    </p>
                    <p className="text-xs text-gray-400">
                      Valid until:{" "}
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{coupon.usedCount} redemptions</p>
                  <p className="text-sm text-gray-600">
                    ₹{coupon.totalDiscount.toLocaleString()} saved
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Redemptions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Redemptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRedemptions.slice(0, 15).map((redemption, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{redemption.couponCode}</h3>
                    <Badge variant="outline">{redemption.couponTitle}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Customer: {redemption.customerName} (
                    {redemption.customerPhone})
                  </p>
                  <p className="text-sm text-gray-600">
                    Merchant: {redemption.merchantName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(redemption.redeemedAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    ₹{redemption.orderAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Order Amount</p>
                  <p className="font-bold text-green-600">
                    ₹{redemption.discountAmount}
                  </p>
                  <p className="text-sm text-gray-600">Discount</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
