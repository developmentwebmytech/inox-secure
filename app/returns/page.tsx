import Link from "next/link";

export const metadata = {
  title: "Return & Refund Policy | Inox Secure",
  description:
    "View Inox Secure's return and refund policies for electronics, appliances, and more.",
};

export default function ReturnPolicyPage() {
  return (
    <div className="px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="flex flex-col items-center text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Return & Refund Policy
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl">
          Learn about how you can return eligible items, and Inox Secure’s
          commitment to customer satisfaction and support.
        </p>
      </div>

      <div className="max-w-6xl mx-auto prose prose-lg">
        <section className="mb-10">
          <h2 className="text-2xl font-bold">Eligible Items for Return</h2>
          <p>
            We accept return requests under specific conditions. Please review
            the list below:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Electronics:</strong> TVs, laptops, smartphones, tablets
              – open box delivery eligible
            </li>
            <li>
              <strong>Home Appliances:</strong> Washing machines, refrigerators,
              ACs – open box delivery eligible
            </li>
            <li>
              <strong>Kitchen Appliances:</strong> Microwaves, mixer grinders,
              induction cooktops – open box delivery eligible
            </li>
            <li>
              <strong>IT Accessories:</strong> Keyboards, mice, headphones,
              speakers – open box delivery eligible
            </li>
            <li>
              <strong>Small Appliances:</strong> Irons, vacuum cleaners, air
              purifiers – open box delivery eligible
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold">How to Return an Item</h2>
          <ol className="list-decimal pl-6 space-y-3 mt-4">
            <li>
              <strong>Initiate Return Request:</strong> Log into your account
              and navigate to <em>My Orders</em>.
            </li>
            <li>
              <strong>Select Item:</strong> Choose the product and click{" "}
              <em>Return Item</em>.
            </li>
            <li>
              <strong>Upload Photos:</strong> Submit clear photos of the product
              showing any issues/damages.
            </li>
            <li>
              <strong>Approval Step:</strong> Our representative will review
              your request and respond with approval or rejection.
            </li>
            <li>
              <strong>Reason for Return:</strong> Select your reason and submit
              the request.
            </li>
            <li>
              <strong>Pickup/Instructions:</strong> If approved, we’ll schedule
              pickup or provide further steps.
            </li>
          </ol>

          
          <ul className="mt-6 list-disc list-inside">
            <h1><strong>Note:</strong></h1>
            <li> Product can be returned within 3 days.</li>
            <li>No replacement and exchange is available.</li>
            <li>Post approval, refund will be credited to original payment method within 10 working days.</li>
          </ul>

        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold">About Inox Secure</h2>
          <p>
            <strong>Inox Secure</strong> is India’s No.1 local search engine
            platform, helping users find essential services such as electronics,
            grocery delivery, and household support through a single website.
          </p>
          <p>
            We aim to empower both users and businesses by enabling convenient
            day-to-day transactions. From local searches to business listings
            and digital storefronts, Inox Secure has transformed how Indians
            engage with local businesses.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold">Corporate Information</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Started operations in 2005 with local search services.</li>
            <li>
              Official website{" "}
              <a
                href="https://www.inoxsecure.com"
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline"
              >
                www.inoxsecure.com
              </a>{" "}
              launched in 2025.
            </li>
            <li>
              Now offering a wide range of daily-use services via our “Search
              Plus” platform.
            </li>
            <li>
              Providing an end-to-end business management solution for SMEs.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold">Key Highlights</h2>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Pan-India Reach:</strong> Active across 20+ cities.
            </li>
            <li>
              <strong>Tech-Enabled Platform:</strong> From real-time messenger
              to curated content and order tools.
            </li>
            <li>
              <strong>Over 3 Million Users:</strong> With 6 million+ reviews by
              March 31, 2025.
            </li>
            <li>
              <strong>Reliable for MSMEs:</strong> Providing visibility,
              websites, and payment tools.
            </li>
            <li>
              <strong>Trust-Backed:</strong> All vendors are verified and backed
              with a money-back guarantee.
            </li>
            <li>
              <strong>Experienced Team:</strong> Led by industry experts with a
              proven monetization model.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold">Need Help?</h2>
          <p>
            If you have any issues with your return or require assistance,
            contact us:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>
              <strong>Phone:</strong> +91 9680849577
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
            Still need help? Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
}
