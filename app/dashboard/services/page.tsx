"use client"

import ServiceManagement from "@/components/admin/ServiceManagement"

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Management</h1>
            <p className="text-gray-600">Add, edit, and manage all your services</p>
          </div>
          <ServiceManagement />
        </div>
      </div>
    </div>
  )
}
