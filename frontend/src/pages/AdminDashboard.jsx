import React from 'react';

/**
 * Admin Dashboard Page Component
 * Basic admin dashboard placeholder
 */
function AdminDashboard() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-primary-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Products</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="card bg-green-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Orders</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
        <div className="card bg-purple-600 text-white">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold">-</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <p className="text-gray-600">• Manage Products</p>
          <p className="text-gray-600">• Manage Orders</p>
          <p className="text-gray-600">• Manage Users</p>
          <p className="text-gray-600">• Manage Blog Posts</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Note: This is a placeholder. Full admin functionality can be added later.
        </p>
      </div>
    </div>
  );
}

export default AdminDashboard;
