"use client"

import CityManagement from "@/components/admin/CityManagement"

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 ">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">City Management</h1>
            <p className="text-gray-600">Manage cities where services are available</p>
          </div>
          <CityManagement />
        </div>
      </div>
    </div>
  )
}
