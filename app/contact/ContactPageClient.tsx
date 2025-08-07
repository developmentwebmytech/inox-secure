"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPageClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const res = await fetch("/api/contact-submissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData), // yahan tumhara form data jaa raha hai
    });

    if (res.ok) {
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } else {
      console.error("Form submit failed");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r bg-blue-500">
        <div className="flex flex-col items-center text-center mb-16 px-6 md:px-10 py-10 w-full text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-lg text-white max-w-4xl">
            Have questions or need assistance? Our team is here to help. Reach out to us through any of the channels below.
            Stay informed with the latest updates on product availability, return policies, and service support from our
            customer care experts.
          </p>
        </div>
      </div>

      <div className="w-full px-6 md:px-20 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Call Us */}
          <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">
              Our customer support team is available 24/7
            </p>
            <a
              href="tel:+91 9680849577"
              className="text-primary font-medium hover:underline"
            >
              +91 9680849577
            </a>
          </div>

          {/* Email Us */}
          <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll get back to you
            </p>
            <a
              href="mailto:support@inoxsecure.com"
              className="text-primary font-medium hover:underline"
            >
              support@inoxsecure.com
            </a>
          </div>

          {/* Visit Us */}
          <div className="bg-primary/5 p-6 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Our headquarters location</p>
            <address className="not-italic text-primary font-medium">
              Banglore, India
            </address>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16 w-full">
          {/* Contact Form */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                <p>
                  Your message has been sent successfully. We'll get back to you
                  as soon as possible.
                </p>
                <Button className="mt-4" onClick={() => setIsSubmitted(false)}>
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter message subject"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Enter your message"
                    rows={5}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Map and Business Hours */}
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-6">Find Us</h2>
            {/* <div className="relative h-[300px] w-full mb-8 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113843.23621488883!2d75.7138881!3d26.9124336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db30ddcdd9983%3A0x4d842a2f0e68b8f3!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1720526100000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div> */}

            <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Customer Support:</span>
                <span className="ml-2 text-gray-600">24/7</span>
              </div>
              {/* <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mr-2 mt-1" />
                <span className="font-medium">Office Hours:</span>
                <div className="ml-2 text-gray-600">
                  <div>Monday - Friday: 9:00 AM - 6:00 PM</div>
                  <div>Saturday: 10:00 AM - 4:00 PM</div>
                  <div>Sunday: Open</div>
                </div>
              </div> */}
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-primary mr-2 mt-1" />
                <span className="font-medium">Delivery Hours:</span>
                <div className="ml-2 text-gray-600">
                  <div>Every day: 8:00 AM - 10:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
