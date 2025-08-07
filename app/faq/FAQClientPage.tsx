"use client";

import type React from "react";

import { useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  name: string;
  icon: React.ReactNode;
  count: number;
}

export default function FAQClientPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories: FAQCategory[] = [
    { name: "All", icon: "📋", count: 24 },
    { name: "General", icon: "ℹ️", count: 6 },
    { name: "Orders & Payment", icon: "💳", count: 5 },
    { name: "Shipping & Delivery", icon: "🚚", count: 4 },
    { name: "Returns & Exchanges", icon: "🔄", count: 4 },
    { name: "Products & Warranty", icon: "🛡️", count: 3 },
    { name: "Account & Technical", icon: "⚙️", count: 2 },
  ];

  const faqData: FAQItem[] = [
    // General
    {
      id: 1,
      category: "General",
      question: "What is Inox Secure and what products do you sell?",
      answer:
        "Inox Secure is India’s No.1 local search and e-commerce platform for electronics, appliances, and IT products. We connect users with local businesses and offer fast delivery, genuine products, and trusted services. With features like Search Plus and real-time chat, we help users and small businesses grow together.",
    },
    {
      id: 2,
      category: "General",
      question: "What are your delivery areas?",
      answer:
        "We currently deliver to major metropolitan areas across India including Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many other cities. To check if we deliver to your location, simply enter your pincode on our homepage or product pages. We're continuously expanding our delivery network to serve more customers.",
    },
    {
      id: 3,
      category: "General",
      question: "Are all products on your website genuine?",
      answer:
        "Yes, absolutely! We guarantee that all products sold on our platform are 100% genuine and sourced directly from authorized distributors and manufacturers. Every product comes with valid manufacturer warranties and proper documentation. We have strict quality control measures to ensure authenticity.",
    },
    {
      id: 4,
      category: "General",
      question: "Do you offer installation services?",
      answer:
        "Yes, we offer professional installation services for most of our products including air conditioners, washing machines, TVs, and other appliances. You can add installation service during checkout for an additional fee. Our certified technicians will ensure proper installation and provide basic usage guidance.",
    },
    {
      id: 5,
      category: "General",
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team 24/7 through multiple channels: Call us at +91 9680849577, email us at support@inoxsecure.com, use the live chat feature on our website/app, or visit our Help Center for instant answers to common questions.",
    },
    {
      id: 6,
      category: "About Us",
      question: "When was Inox Secure launched?",
      answer: "Inox Secure started its services in 2005 and launched its official website www.inoxsecure.com in 2025 to serve customers online."
    },

    // Orders & Payment
    // Orders & Payment
    {
      id: 7,
      category: "Orders & Payment",
      question: "What payment methods do you accept?",
      answer:
        "We support many payment options for your comfort. You can pay using credit/debit cards (Visa, MasterCard, RuPay), UPI apps like PhonePe or Google Pay, Net Banking, digital wallets, EMI, or Cash on Delivery.",
    },
    {
      id: 8,
      category: "Orders & Payment",
      question: "Can I modify or cancel my order after placing it?",
      answer:
        "Yes, you can cancel or change your order within 30 minutes if it hasn’t shipped. Go to ‘My Orders or contact support quickly. After shipping, cancellation is not allowed—only return is possible.",
    },
    {
      id: 9,
      category: "Orders & Payment",
      question: "When will I receive my refund if I cancel an order?",
      answer:
        "Once your cancellation is confirmed, refunds are processed in 5 to 7 working days. The money will go back to your original payment method. We will notify you when it’s successfully refunded.",
    },
    {
      id: 10,
      category: "Orders & Payment",
      question: "Is it safe to make payments on your website?",
      answer:
        "Yes, your payment is fully secure. We use encrypted SSL connections and trusted payment gateways. Your card details are never stored on our servers. Every transaction is processed through protected channels.",
    },
    {
      id: 11,
      category: "Orders & Payment",
      question: "Why was my payment declined?",
      answer:
        "Payments may fail due to wrong card info, low balance, bank limits, expired card, or network errors. Try again or use another method. You can also contact your bank for help.",
    },

    // Shipping & Delivery
    {
      id: 12,
      category: "Shipping & Delivery",
      question: "What if my delivery is delayed?",
      answer:
        "Delivery may be delayed due to weather, traffic, or other reasons. We will keep you updated through SMS or email. You can also contact our support team for quick help anytime.",
    },
    {
      id: 13,
      category: "Shipping & Delivery",
      question: "What are the delivery charges?",
      answer:
        "Delivery charges are ₹199 for orders below ₹19,999. Orders ₹19,999 and above get free delivery. If Express Delivery is available, it costs ₹199 extra. Charges are shown at checkout clearly.",
    },
    {
      id: 14,
      category: "Shipping & Delivery",
      question: "How can I track my order?",
      answer:
        "You can track your order live on our website. We also send updates by SMS. You’ll see delivery partner location, estimated time, and contact info. Just log in and visit ‘My Orders’.",
    },
    {
      id: 15,
      category: "Shipping & Delivery",
      question: "What if I'm not available during delivery?",
      answer:
        "If you're not available, our delivery partner will try to call you. If delivery fails, we’ll return the item to our warehouse. You can reschedule the delivery or ask for a refund.",
    },


    // Returns & Exchanges
    {
      id: 16,
      category: "Returns & Exchanges",
      question: "What is your return policy?",
      answer:
        "We offer a 7-day return policy for most products from the date of delivery. Items must be unused, in original packaging with all accessories, tags, and warranty cards. We provide free pickup from your doorstep. Refunds are processed within 7-10 business days after we receive and inspect the returned item.",
    },
    {
      id: 17,
      category: "Returns & Exchanges",
      question: "How do I return a product?",
      answer:
        "To return a product: Log into your account and go to 'My Orders', select the item you want to return and click 'Return Item', choose your reason for return and schedule a pickup, pack the item securely in original packaging, and hand it over to our delivery partner during pickup. You'll receive a pickup receipt for your records.",
    },
    {
      id: 18,
      category: "Returns & Exchanges",
      question: "Can I exchange a product instead of returning it?",
      answer:
        "Yes, we offer exchanges for size, color, or model variations within 7 days of delivery, subject to availability. The exchange item must be of equal or higher value. If there's a price difference, you'll need to pay the additional amount or receive a refund for the difference.",
    },
    {
      id: 19,
      category: "Returns & Exchanges",
      question: "What if I receive a damaged or defective product?",
      answer:
        "If you receive a damaged or defective product, please don't accept the delivery if the package appears damaged. If you've already accepted it, report the issue within 24 hours by contacting customer support with photos of the damage. We'll arrange for immediate replacement at no extra cost.",
    },

    // Products & Warranty
    {
      id: 20,
      category: "Products & Warranty",
      question: "Do products come with warranty?",
      answer:
        "Yes, all products come with manufacturer warranties. Warranty periods vary by product and brand - typically 1-2 years for electronics and appliances. Warranty covers manufacturing defects and malfunctions under normal usage. Extended warranty plans are also available for purchase on select products.",
    },
    {
      id: 21,
      category: "Products & Warranty",
      question: "How do I claim warranty for a product?",
      answer:
        "To claim warranty: Contact the manufacturer's customer service (details provided with the product), or reach out to our customer support for assistance. Keep your purchase invoice and warranty card safe as they're required for warranty claims. We'll help coordinate with the manufacturer for repairs or replacements.",
    },
    {
      id: 22,
      category: "Products & Warranty",
      question: "Can I get product demonstrations or technical support?",
      answer:
        "Yes, we provide product demonstrations for select high-value items during delivery/installation. Our customer support team can also provide basic technical guidance. For detailed technical support, you can contact the manufacturer's support team or refer to the product manual and online resources.",
    },

    // Account & Technical
    {
      id: 23,
      category: "Account & Technical",
      question: "How do I create an account or reset my password?",
      answer:
        "To create an account, click 'Sign Up' on our homepage and provide your email, phone number, and create a password. To reset your password, click 'Forgot Password' on the login page, enter your email/phone number, and follow the instructions sent to you. You can also sign up/login using your Google or Facebook account.",
    },
    {
      id: 24,
      category: "Account & Technical",
      question: "Why is the website/app running slowly or not working?",
      answer:
        "If you're experiencing technical issues: Check your internet connection, clear your browser cache and cookies, try using a different browser or device, update your app to the latest version, or restart your device. If problems persist, contact our technical support team for assistance.",
    },
  ];

  const filteredFAQs = faqData.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-transparent">
        <div className="flex flex-col items-center text-center mb-16 px-10 py-10 w-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-white max-w-3xl">
            Find quick answers to common questions about our products, services,
            and policies
          </p>
        </div>
      </div>

      <div className="container mx-auto">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`p-4 rounded-lg border text-center transition-all duration-200 hover:shadow-md ${selectedCategory === category.name
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-gray-200 hover:border-primary"
                  }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs opacity-75">
                  {category.count} questions
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="mb-16 px-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory === "All" ? "All Questions" : selectedCategory}
            </h2>
            <span className="text-gray-500">
              {filteredFAQs.length} question
              {filteredFAQs.length !== 1 ? "s" : ""} found
            </span>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse different categories.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleExpanded(faq.id)}
                    className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <span className="text-sm text-primary font-medium">
                        {faq.category}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      {expandedItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  {expandedItems.includes(faq.id) && (
                    <div className="px-6 pb-4 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed pt-4">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get instant help from our support team
            </p>
            <Button className="w-full">Start Chat</Button>
          </div>
          <div className="bg-green-50 p-6 rounded-lg text-center">
            <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Call Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Speak directly with our team
            </p>
            <Button variant="outline" className="w-full">
              <a href="tel:+91 9680849577">Call Now</a>
            </Button>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg text-center">
            <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">Send us your questions</p>
            <Link href="/contact">
              <Button variant="outline" className="w-full">
                Send Email
              </Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
