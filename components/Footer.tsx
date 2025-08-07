"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Globe2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import Logo from "@/public/logo-white.png";
import Image from "next/image";
import PhonePe from "@/public/Payment-icons/PhonePe.png";
import Cash from "@/public/Payment-icons/cash.png";
import Upi from "@/public/Payment-icons/upi.png";
import Paytm from "@/public/Payment-icons/Paytm.png";
import { useSession } from "next-auth/react"

export function Footer() {
  const { data: session } = useSession();
  return (
    <footer className="w-full bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="bg-[#0042ad]">
        <div className="container mx-auto px-4 md:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-20 w-32">
                  <Image src={Logo} alt="Variety Logo" fill className="object-contain" />
                </div>
              </Link>
              <p className="text-sm md:text-base text-blue-100">
                Your trusted partner for premium electronics and appliances,
                delivered with care and precision.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-blue-100 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 96808 49577</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@inoxsecure.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Banglore, India</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4 pt-4">
                <Link href="https://www.facebook.com/share/1AGuPvvadp/" className="text-blue-200 hover:text-white">
                  <Facebook className="h-6 w-6" />
                </Link>
                <Link href="https://www.instagram.com/invites/contact/?utm_source=ig_contact_invite&utm_medium=copy_link&utm_content=yp3o2dm" className="text-blue-200 hover:text-white">
                  <Instagram className="h-6 w-6" />
                </Link>
                <Link href="https://www.threads.net/@inoxsecure?invite=0" className="text-blue-200 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-current" viewBox="0 0 100 100">
                    <path d="M50 0C22.43 0 0 22.43 0 50s22.43 50 50 50 50-22.43 50-50S77.57 0 50 0Zm11.37 74.09c-6.77 0-12.25-3.67-15.64-10.3-2.48-4.95-3.32-11.04-2.61-18.09.08.01.17.02.25.03 4.43.63 7.57 2.54 9.39 5.67 1.39 2.35 1.66 5.02.76 7.37a8.21 8.21 0 0 1-1.81 2.78 8.42 8.42 0 0 0 3.12 2.18c.94.38 1.96.58 3.02.58 2.7 0 5.02-.98 6.89-2.91 1.88-1.94 2.87-4.32 2.87-6.94 0-3.26-.96-6.11-2.85-8.47-1.45-1.83-3.55-3.44-6.25-4.78a20.8 20.8 0 0 0-7.89-2.04 33.06 33.06 0 0 1 0-4.17c.52.02 1.06.04 1.6.07 7.2.42 12.97 2.74 17.17 6.9 4.25 4.22 6.4 9.82 6.4 16.65 0 5.37-1.85 9.88-5.51 13.42-3.49 3.38-8.1 5.11-13.42 5.11Z" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h3 className="text-xl md:text-2xl font-semibold mb-4 text-orange-400">Shop</h3>
              <ul className="space-y-2 text-sm md:text-lg text-blue-100">
                <li><Link href="/products" className="hover:text-orange-400">All Products</Link></li>
                <li><Link href="/electronics" className="hover:text-orange-400">Electronics</Link></li>
                <li><Link href="/appliances" className="hover:text-orange-400">Appliances</Link></li>
                <li><Link href="/it-products" className="hover:text-orange-400">IT Products</Link></li>
                <li><Link href="/service" className="hover:text-orange-400">Services</Link></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl md:text-2xl font-medium mb-4 text-orange-400">Quick Links</h3>
              <ul className="space-y-2 text-sm md:text-lg text-blue-100">
                <li><Link href="/about" className="hover:text-orange-400">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-orange-400">Contact Us</Link></li>
                {session?.user && (
                  <li>
                    <Link href="/account" className="hover:text-orange-400">
                      My Account
                    </Link>
                  </li>
                )}
                <li><Link href="/auth/agent" className="hover:text-orange-400">Agent Login</Link></li>
                <li><Link href="/auth/merchant" className="hover:text-orange-400">Merchant Login</Link></li>
              </ul>
            </div>

            {/* Customer Policy */}
            <div>
              <h3 className="text-xl md:text-2xl font-medium mb-4 text-orange-400">Customer Policy</h3>
              <ul className="space-y-2 text-sm md:text-lg text-blue-100">
                <li><Link href="/terms" className="hover:text-orange-400">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="hover:text-orange-400">Privacy Policy</Link></li>
                <li><Link href="/shipping" className="hover:text-orange-400">Shipping & Delivery</Link></li>
                <li><Link href="/returns" className="hover:text-orange-400">Returns & Exchanges</Link></li>
                <li><Link href="/faq" className="hover:text-orange-400">FAQ</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-600">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6 px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left text-blue-100">
              <div className="flex items-center gap-2">
                <Globe2 className="w-6 h-6" />
                <span className="text-base">India</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                <span className="font-bold text-sm">FedEx</span>
                <span className="font-bold text-sm">
                  <span className="text-blue-400">BLUE</span><span className="text-yellow-400">DART</span>
                </span>
                <span className="font-bold text-sm">DELHIVERY</span>
              </div>
            </div>

            <div className="text-center text-sm text-blue-100">© 2025 INOX Store. All rights reserved.</div>

            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <span className="text-sm whitespace-nowrap mt-3 text-white">100% Secure Payments</span>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {[Paytm, Cash, Upi, PhonePe].map((src, i) => (
                  <div key={i} className="bg-white rounded h-10 w-20 flex items-center justify-center">
                    <Image src={src} alt={`Payment ${i}`} width={80} height={40} className="object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}