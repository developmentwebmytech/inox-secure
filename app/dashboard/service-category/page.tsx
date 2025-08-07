"use client"

import CategoryManagement from "@/components/admin/CategoryManagement"

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 ">
        <div className="p-8">
          <div className="mb-8">
             <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Categories Management</h1>
            <p className="text-gray-600">Manage service categories and their settings</p>
          </div>
          <CategoryManagement />
        </div>
      </div>
    </div>
  )
}
