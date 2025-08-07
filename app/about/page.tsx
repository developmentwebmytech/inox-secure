import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata = {
  title: "About Us | Inoxsecure",
  description: "Learn about Inoxsecure - India's No. 1 Local Search Engine",
}

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-blue-600">
        <div className="flex flex-col items-center text-center mb-16 px-10 py-20 w-full text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About Inoxsecure</h1>
          <p className="text-lg md:text-xl text-white max-w-4xl leading-relaxed">
            India's No. 1 Local Search Engine providing comprehensive local search services and connecting users with
            businesses across the nation through our advanced website platform.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-20 py-16">
        {/* Our Story - Centered */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Our Story</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-blue-600">Inoxsecure</strong> is India's leading local search engine that
                  provides comprehensive local search related services to users across India through our advanced
                  website platform. We are the <strong>LOCAL No. 1 Search engine</strong> that has revolutionized how
                  people discover and connect with local businesses.
                </p>
                <p>
                  The company's operations began in <strong>2005</strong> with offering local search services under the
                  Inoxsecure brand, which is now the leading local search engine in India. Our official website{" "}
                  <strong>www.inoxsecure.com</strong> was launched in 2025, marking a new era in our digital presence.
                </p>
                <p>
                  Inoxsecure has also initiated <strong>'Search Plus' services</strong> and house needed services like
                  electronics, grocery, and much more for its users. These services aim at making several day-to-day
                  tasks conveniently actionable and accessible to users through one WEBSITE.
                </p>
               
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative h-[450px] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/client-choosing-laptop-store.jpg" alt="Inoxsecure Team" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Corporate Information */}
        <div className="mb-20 bg-blue-50 p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Corporate Information</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    The company's operations began in <strong>2005</strong> with offering local search services under
                    the Inoxsecure brand, which is now the leading local search engine in India.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    The official website <strong>www.inoxsecure.com</strong> was launched in 2025.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Inoxsecure search services are available to user platforms as website.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    We specialize in electronics and grocery products to meet your daily needs.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Inoxsecure search services bridge the gap between users and businesses by helping users find
                    relevant providers of products and services effortlessly.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    We help businesses listed in INOXSECURE database to market their offerings effectively.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Highlights */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Key Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Pan India Presence</h3>
              <p className="text-gray-600 text-center">
                Services offered all over India across <strong>20+ cities</strong> with robust presence in all cities
                and towns of India.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl border border-blue-200">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">First-Mover Advantage</h3>
              <p className="text-gray-600 text-center">
                Being the <strong>industry pioneer</strong>, Inoxsecure has a robust presence in all cities and towns of
                India with years of experience and proven track record.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Trustable & Scalable Platform</h3>
              <p className="text-gray-600 text-center">
                A vast range of features for more engaging user experience with{" "}
                <strong>2-3 transaction oriented</strong> search plus verticals, social sharing platform, and Real Time
                Chat Messenger on a single platform.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl border border-purple-200">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Most Searched Platform</h3>
              <p className="text-gray-600 text-center">
                With over <strong>3 million users</strong> (quarterly average unique users) who have contributed to{" "}
                <strong>6 million ratings and reviews</strong> as of March 31, 2025.
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Reliable Platform for MSMEs</h3>
              <p className="text-gray-600 text-center">
                Inoxsecure's value-added offerings of{" "}
                <strong>huge online visibility, payment solutions, customized website</strong> all packaged together,
                make it an attractive value proposition for MSMEs.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl border border-yellow-200">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center text-gray-800">Local Expertise</h3>
              <p className="text-gray-600 text-center">
                With a <strong>strong and widespread sales force</strong>, years of experience and in-depth local market
                knowledge, we enjoy significant expertise across all regions of the country.
              </p>
            </div>
          </div>
        </div>

        {/* Our Services */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Our Services</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-10 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Search Plus Services</h3>
              <ul className="space-y-3 text-orange-100">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Electronics & Technology Products
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Grocery & Daily Essentials
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  House Needed Services
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Local Business Discovery
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Social Sharing Platform
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-10 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Business Solutions</h3>
              <ul className="space-y-3 text-blue-100">
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  End-to-End Business Management
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Custom Website Development
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Payment Solutions
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Online Visibility Enhancement
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Real Time Chat Messenger
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Working System */}
        <div className="mb-20 bg-gray-50 p-12 rounded-2xl">
          <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">How We Work</h2>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Our Working System</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our website helps you find an <strong>online nearest assistant business and modern artisan</strong>.
                  We bridge the gap between users and businesses by helping users find relevant providers of products
                  and services effortlessly, while helping businesses listed in INOXSECURE database to market their
                  offerings.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  The organisation also aims to make communication between users and businesses seamless through its{" "}
                  <strong>Real Time Chat Messenger</strong>. We provide curated content on latest happenings to users
                  through our official social sharing platform.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Join Our Service</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  All the connected business and skilled artisans with us are all in your convenience and your work.{" "}
                  <strong>You can be trusted for your personal technical item</strong> by doing any business and work
                  through our website.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  All the vendors associated with us are associated with a belief because we assure them of{" "}
                  <strong>money back guarantee</strong>. Several MSMEs have continuous associations with Inoxsecure due
                  to our reliable platform and healthy relations.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Besides, Inoxsecure's healthy relations with existing MSMEs enable them to get{" "}
                  <strong>referrals and repeat business</strong>. We have a long operating history with a proven
                  monetization model and experienced management team.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Why Choose Inoxsecure</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Money Back Guarantee</h3>
              <p className="text-gray-600">
                All vendors associated with us are connected with trust because we assure them of money back guarantee
                for complete peace of mind.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Long Operating History</h3>
              <p className="text-gray-600">
                With operations since 2005 and a proven monetization model, we have established ourselves as the
                industry leader with extensive experience.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg border">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Experienced Management Team</h3>
              <p className="text-gray-600">
                Our experienced management team brings years of expertise and in-depth local market knowledge across all
                regions of the country.
              </p>
            </div>
          </div>
        </div>

        {/* Join Us CTA */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-12 rounded-2xl text-center">
          <h2 className="text-4xl font-bold mb-6">Join the Inoxsecure Network</h2>
          <p className="max-w-3xl mx-auto mb-8 text-lg leading-relaxed">
            Whether you're a business looking to expand your reach or a user seeking reliable local services, Inoxsecure
            is your trusted partner in connecting communities across India. Experience fast and reliable facilities that
            benefit both users and business partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/service">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
              >
                Explore Services
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white px-8 py-4 text-lg"
                size="lg"
              >
                Partner With Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
