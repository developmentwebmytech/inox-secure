import crypto from "crypto"

export interface PhonePePaymentRequest {
  merchantId: string
  merchantTransactionId: string
  merchantUserId: string
  amount: number
  redirectUrl: string
  redirectMode: string
  callbackUrl: string
  mobileNumber?: string
  paymentInstrument: {
    type: string
    targetApp?: string
  }
}

export interface PhonePeResponse {
  success: boolean
  code: string
  message: string
  data?: {
    merchantId: string
    merchantTransactionId: string
    transactionId: string
    amount: number
    state: string
    responseCode: string
    paymentInstrument: {
      type: string
      utr?: string
    }
  }
}

export class PhonePePayment {
  private merchantId: string
  private saltKey: string
  private saltIndex: string
  private baseUrl: string

  constructor() {
    this.merchantId = process.env.PHONEPE_MERCHANT_ID || ""
    this.saltKey = process.env.PHONEPE_SALT_KEY || ""
    this.saltIndex = process.env.PHONEPE_SALT_INDEX || "1"
    this.baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://api.phonepe.com/apis/hermes"
        : "https://api-preprod.phonepe.com/apis/pg-sandbox"
  }

  generateChecksum(payload: string): string {
    const string = payload + "/pg/v1/pay" + this.saltKey
    return crypto.createHash("sha256").update(string).digest("hex") + "###" + this.saltIndex
  }

  generateStatusChecksum(merchantTransactionId: string): string {
    const string = `/pg/v1/status/${this.merchantId}/${merchantTransactionId}` + this.saltKey
    return crypto.createHash("sha256").update(string).digest("hex") + "###" + this.saltIndex
  }

  async initiatePayment(paymentData: PhonePePaymentRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const payload = JSON.stringify(paymentData)
      const base64Payload = Buffer.from(payload).toString("base64")
      const checksum = this.generateChecksum(base64Payload)

      const response = await fetch(`${this.baseUrl}/pg/v1/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
        body: JSON.stringify({
          request: base64Payload,
        }),
      })

      const result = await response.json()

      if (result.success) {
        return {
          success: true,
          data: {
            redirectUrl: result.data.instrumentResponse.redirectInfo.url,
            transactionId: paymentData.merchantTransactionId,
          },
        }
      } else {
        return {
          success: false,
          error: result.message || "Payment initiation failed",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Payment service unavailable",
      }
    }
  }

  async checkPaymentStatus(merchantTransactionId: string): Promise<PhonePeResponse> {
    try {
      const checksum = this.generateStatusChecksum(merchantTransactionId)

      const response = await fetch(`${this.baseUrl}/pg/v1/status/${this.merchantId}/${merchantTransactionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": this.merchantId,
        },
      })

      const result = await response.json()
      return result
    } catch (error) {
      return {
        success: false,
        code: "INTERNAL_SERVER_ERROR",
        message: "Status check failed",
      }
    }
  }
}
