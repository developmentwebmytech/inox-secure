"use client"
import PincodeManagement from "@/components/admin/PincodeManagement"

export default function PincodesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 ">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pincode Management</h1>
            <p className="text-gray-600">Manage blacklisted pincodes and service areas</p>
          </div>
          <PincodeManagement />
        </div>
      </div>
    </div>
  )
}
