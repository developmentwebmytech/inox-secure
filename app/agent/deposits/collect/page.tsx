"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Wallet, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

interface Merchant {
  _id: string;
  businessName: string;
  userId: {
    name: string;
    email: string;
  };
  wallet: {
    balance: number;
  };
}

export default function CollectDepositPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [formData, setFormData] = useState({
    merchantId: "",
    amount: "1000",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchingMerchants, setFetchingMerchants] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchMerchants();
  }, []);

  const fetchMerchants = async () => {
    setFetchingMerchants(true);
    try {
      console.log("Fetching merchants..."); // Debug log
      const response = await fetch("/api/agent/merchants?status=approved");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); // Debug log

      // Handle different possible response structures
      let merchantsList = [];
      if (data.merchants && Array.isArray(data.merchants)) {
        merchantsList = data.merchants;
      } else if (data.data && Array.isArray(data.data)) {
        merchantsList = data.data;
      } else if (Array.isArray(data)) {
        merchantsList = data;
      }

      console.log("Processed merchants:", merchantsList); // Debug log
      setMerchants(merchantsList);

      if (merchantsList.length === 0) {
        setError("No approved merchants found");
      }
    } catch (error) {
      console.error("Failed to fetch merchants:", error);
      setError(
        "Failed to load merchants. Please check your connection and try again."
      );
    } finally {
      setFetchingMerchants(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.merchantId) {
      setError("Please select a merchant");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("Submitting deposit:", formData); // Debug log

      const response = await fetch("/api/agent/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          merchantId: formData.merchantId,
          amount: parseFloat(formData.amount),
          notes: formData.notes.trim(),
        }),
      });

      const data = await response.json();
      console.log("Response data:", data); // Debug log

      if (response.ok && data.success) {
        setSuccess(
          `Deposit of ₹${formData.amount} collected successfully! ${
            data.deposit?.receiptNumber
              ? `Receipt: ${data.deposit.receiptNumber}`
              : ""
          }`
        );

        // Reset form
        setFormData({
          merchantId: "",
          amount: "1000",
          notes: "",
        });

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push("/agent/deposits/history");
        }, 3000);
      } else {
        setError(data.message || data.error || "Failed to collect deposit");
      }
    } catch (error) {
      console.error("Deposit submission error:", error);
      setError(
        "Network error occurred. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError("");
  };

  const selectedMerchant = merchants.find((m) => m._id === formData.merchantId);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/agent/deposits">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Deposits
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Collect Deposit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Manual Deposit Collection
          </CardTitle>
        </CardHeader>
        <CardContent>
          {fetchingMerchants ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Loading merchants...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="merchant">Select Merchant</Label>
                {fetchingMerchants ? (
                  <div className="flex items-center justify-center p-4 border rounded-md">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2"></div>
                    <span className="text-sm text-gray-600">
                      Loading merchants...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.merchantId}
                    onValueChange={(value) =>
                      handleInputChange("merchantId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          merchants.length === 0
                            ? "No merchants available"
                            : "Choose a merchant"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {merchants.length === 0 ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                          No approved merchants found.
                          <br />
                          <Button
                            variant="link"
                            size="sm"
                            onClick={fetchMerchants}
                            className="mt-2"
                          >
                            Refresh List
                          </Button>
                        </div>
                      ) : (
                        merchants.map((merchant) => (
                          <SelectItem key={merchant._id} value={merchant._id}>
                            {merchant.businessName} - {merchant.userId.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                {merchants.length === 0 && !fetchingMerchants && (
                  <p className="text-sm text-gray-500 mt-1">
                    No approved merchants available. Please ensure merchants are
                    approved first.
                  </p>
                )}
              </div>

              {merchants.length === 0 && !fetchingMerchants && (
                <p className="text-sm text-gray-500 mt-1">
                  No approved merchants available. Please ensure merchants are
                  approved first.
                </p>
              )}

              {selectedMerchant && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold">
                    {selectedMerchant.businessName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedMerchant.userId.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedMerchant.userId.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    Current Wallet Balance: ₹
                    {selectedMerchant.wallet.balance.toLocaleString()}
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="amount">Deposit Amount (₹) *</Label>
                <Select
                  value={formData.amount}
                  onValueChange={(value) => handleInputChange("amount", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1000">₹1,000</SelectItem>
                    <SelectItem value="2000">₹2,000</SelectItem>
                    <SelectItem value="5000">₹5,000</SelectItem>
                    <SelectItem value="10000">₹10,000</SelectItem>
                    <SelectItem value="25000">₹25,000</SelectItem>
                    <SelectItem value="50000">₹50,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add any additional notes about this deposit..."
                  rows={3}
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Deposit Terms:</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• 3-month maturity period</li>
                  <li>• Amount will be locked until maturity</li>
                  <li>• Merchant will receive email confirmation</li>
                  <li>• Receipt will be generated automatically</li>
                </ul>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={
                  loading || !formData.merchantId || merchants.length === 0
                }
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Deposit...
                  </>
                ) : (
                  `Collect ₹${formData.amount} Deposit`
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Debug Information (remove in production) */}
      {/* Debug Information - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-sm">Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-xs">
              <div>
                <strong>Merchants Count:</strong> {merchants.length}
              </div>
              <div>
                <strong>Fetching:</strong> {fetchingMerchants.toString()}
              </div>
              <div>
                <strong>Selected Merchant ID:</strong>{" "}
                {formData.merchantId || "None"}
              </div>
              <div>
                <strong>API Response Structure:</strong>
              </div>
              <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(merchants.slice(0, 2), null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
