"use client";

import type React from "react";

export default function FeatureSection() {
  return(
    <section className="w-full py-12 md:py-16 lg:py-20 bg-gray-50 px-14">
    <div className="container px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Free Delivery</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Free delivery on orders above ₹19999. Get your products delivered to
              your doorstep without any extra cost.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Genuine Products</h3>
            <p className="text-gray-500 dark:text-gray-400">
              All our products are 100% genuine with manufacturer warranty and
              after-sales support.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-primary/10 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-primary"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Secure Payments</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Multiple secure payment options including credit/debit cards, UPI,
              and cash on delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}
