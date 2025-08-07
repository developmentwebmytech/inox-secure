"use client"

import BookingManagement from "@/components/admin/BookingManagement"

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      <div className="flex-1 ">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
            <p className="text-gray-600">View and manage customer bookings and requests</p>
          </div>
          <BookingManagement />
        </div>
      </div>
    </div>
  )
}
