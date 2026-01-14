/**
 * HOS - Hospital Management System
 * Pharmacy Dashboard Page
 * ===========================================
 * Dashboard for pharmacists
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Pill,
  Package,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const MOCK_STATS = {
  pendingPrescriptions: 18,
  dispensedToday: 85,
  lowStockItems: 12,
  expiringItems: 5,
};

const PRESCRIPTION_QUEUE = [
  { id: '1', patient: 'Rahul Verma', doctor: 'Dr. Sharma', items: 3, status: 'pending', time: '5 min ago' },
  { id: '2', patient: 'Sneha Patel', doctor: 'Dr. Patel', items: 2, status: 'processing', time: '10 min ago' },
  { id: '3', patient: 'Arun Kumar', doctor: 'Dr. Kumar', items: 4, status: 'ready', time: '15 min ago' },
  { id: '4', patient: 'Priyanka Singh', doctor: 'Dr. Gupta', items: 1, status: 'pending', time: '20 min ago' },
];

const LOW_STOCK_ITEMS = [
  { name: 'Paracetamol 500mg', current: 25, min: 100, category: 'Analgesic' },
  { name: 'Amoxicillin 500mg', current: 30, min: 80, category: 'Antibiotic' },
  { name: 'Omeprazole 20mg', current: 15, min: 50, category: 'Antacid' },
  { name: 'Metformin 500mg', current: 40, min: 100, category: 'Antidiabetic' },
];

const EXPIRING_SOON = [
  { name: 'Insulin Glargine', batch: 'INS2024A', expiry: '15 Aug 2024', qty: 20, daysLeft: 5 },
  { name: 'Ceftriaxone 1g', batch: 'CEF2024B', expiry: '20 Aug 2024', qty: 50, daysLeft: 10 },
  { name: 'Eye Drops', batch: 'EYE2024C', expiry: '25 Aug 2024', qty: 30, daysLeft: 15 },
];

const TOP_DISPENSED = [
  { name: 'Paracetamol 500mg', count: 150 },
  { name: 'Amoxicillin 500mg', count: 85 },
  { name: 'Omeprazole 20mg', count: 72 },
  { name: 'Cetirizine 10mg', count: 65 },
  { name: 'Metformin 500mg', count: 58 },
];

export default function PharmacyDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pharmacy Dashboard</h1>
          <p className="text-muted-foreground">Drug Dispensing & Inventory Management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Package className="w-4 h-4" />
            Stock Entry
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <ShoppingCart className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Prescriptions"
          value={MOCK_STATS.pendingPrescriptions}
          icon={Clock}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Dispensed Today"
          value={MOCK_STATS.dispensedToday}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Low Stock Items"
          value={MOCK_STATS.lowStockItems}
          icon={AlertTriangle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
        <StatsCard
          title="Expiring Soon"
          value={MOCK_STATS.expiringItems}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Queue */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pill className="w-5 h-5 text-purple-600" />
                Prescription Queue
                <Badge variant="warning" className="ml-2">{PRESCRIPTION_QUEUE.length}</Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {PRESCRIPTION_QUEUE.map((rx, index) => (
                  <motion.div
                    key={rx.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-100 text-purple-700">
                        {rx.patient.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{rx.patient}</p>
                      <p className="text-xs text-muted-foreground">{rx.doctor} • {rx.items} items</p>
                    </div>
                    <Badge
                      variant={rx.status === 'ready' ? 'success' : rx.status === 'processing' ? 'warning' : 'neutral'}
                      className="text-xs"
                    >
                      {rx.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      {rx.status === 'ready' ? 'Dispense' : 'Process'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Dispensed */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Top Dispensed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TOP_DISPENSED.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                  </div>
                  <Badge variant="neutral" className="text-xs">{item.count}</Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {LOW_STOCK_ITEMS.map((item, index) => {
                const percentage = Math.round((item.current / item.min) * 100);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <Badge variant="danger" className="text-xs">
                        {item.current} / {item.min}
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                      indicatorClassName={percentage < 30 ? 'bg-red-500' : 'bg-yellow-500'}
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-500" />
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {EXPIRING_SOON.map((item, index) => (
                <motion.div
                  key={item.batch}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className={`p-2 rounded-lg ${
                    item.daysLeft <= 7 ? 'bg-red-100' : 'bg-orange-100'
                  }`}>
                    <Calendar className={`w-4 h-4 ${
                      item.daysLeft <= 7 ? 'text-red-600' : 'text-orange-600'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Batch: {item.batch} • Qty: {item.qty}</p>
                  </div>
                  <Badge variant={item.daysLeft <= 7 ? 'danger' : 'warning'} className="text-xs">
                    {item.daysLeft} days
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
