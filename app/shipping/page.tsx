import Link from "next/link";

export const metadata = {
  title: "Shipping Policy | Inox Secure",
  description:
    "Learn about Inox Secure's shipping policies, delivery times, and business details.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping Policy</h1>
        <p className="text-lg text-gray-600 max-w-6xl">
          Inox Secure is India’s No.1 Local Search Engine platform, bringing
          users fast delivery, top local services, and trusted business
          connections.
        </p>
      </div>

      <div className="max-w-7xl px-6 mx-auto">
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">About Inox Secure</h2>
            <p>
              Inox Secure is a leading Indian local search engine offering
              services such as electronics, groceries, and more across India.
              Established in 2005, Inox Secure helps users connect with trusted
              businesses, enabling seamless transactions and real-time
              communication via chat.
            </p>
            <p>
              Our 'Search Plus' platform and dedicated support for MSMEs allow
              businesses to establish an online presence, manage operations, and
              grow via lifetime free website tools and promotional support.
              Vendors benefit from a money-back guarantee, high visibility, and
              a strong referral network.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>20+ city coverage and growing</li>
              <li>3M+ users with 6M reviews (as of March 2025)</li>
              <li>Real-time chat for user-business communication</li>
              <li>Searchable marketplace and curated social platform</li>
              <li>Experienced team with proven monetization model</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Delivery Areas</h2>
            <p>
              We offer delivery services across India in over 20+ major cities.
              Use your pincode on our website to check availability in your
              area. Service expansion is ongoing, and you may opt-in for alerts
              when delivery is available in your region.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Delivery Times</h2>
            <p>Our standard delivery windows include:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Express Delivery:</strong> 2-3 working days (available
                in select areas)
              </li>
              <li>
                <strong>Standard Delivery:</strong> Within 7-10 days
              </li>
              <li>
                <strong>Scheduled Delivery:</strong> Choose a specific time slot
                (minimum working-hour window)
              </li>
            </ul>
            <p>
              Delivery times depend on stock availability, warehouse proximity,
              traffic, and weather conditions.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Shipping Fees</h2>
            <p>Our delivery fee structure is as follows:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Electronics Minimum order ₹19,999:</strong>if below ₹199 delivery fee
              </li>
              <li>
                <strong>Grocery Minimum order 499 :</strong> if below ₹49 delivery fee
              </li>
              <li>
                <strong>Express Delivery:</strong> Additional ₹199 (if
                available)
              </li>
            </ul>
            <p>
              Memberships or special promotions may include discounted or waived
              delivery fees.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
            <p>
              Track your order in real-time via our website. You'll get updates
              on:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Real-time delivery partner location</li>
              <li>Estimated arrival time</li>
              <li>Partner contact info</li>
              <li>Status updates via SMS and website notifications</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Delivery Verification</h2>
            <p>To ensure secure delivery, we may request:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>OTP verification</li>
              <li>Signature confirmation</li>
              <li>ID check for high-value orders</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Failed Deliveries</h2>
            <p>
              If delivery fails due to issues like incorrect address or customer
              unavailability:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Our delivery partner will attempt to contact you</li>
              <li>Undelivered items may be returned to the warehouse</li>
              <li>You’ll be notified and can reschedule or request a refund</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Installation Services</h2>
            <p>
              Professional installation available during checkout for eligible
              products. Conditions:
            </p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>Service fees depend on product type and complexity</li>
              <li>Subject to technician availability</li>
              <li>Scheduled as per customer convenience</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>For questions or help with shipping, contact us:</p>
            <ul className="list-disc pl-6 space-y-2 my-4">
              <li>
                <strong>Phone:</strong> +91 9680849577{" "}
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:support@inoxsecure.com"
                  className="text-primary hover:underline"
                >
                  support@inoxsecure.com
                </a>
              </li>
              <li>
                <strong>Response Time:</strong> Within 24/7 support
              </li>
            </ul>
          </section>

         

          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Have questions? Contact our support team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
