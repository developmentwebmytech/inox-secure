// lib/phonepeClient.ts
import { StandardCheckoutClient, Env } from "pg-sdk-node"

let client: ReturnType<typeof StandardCheckoutClient.getInstance> | null = null

export function getPhonePeClient() {
  if (!client) {
    client = StandardCheckoutClient.getInstance(
      process.env.PHONEPE_CLIENT_ID!,
      process.env.PHONEPE_CLIENT_SECRET!,
      1,
      process.env.NODE_ENV === "production" ? Env.PRODUCTION : Env.SANDBOX
    )
  }
  return client
}
