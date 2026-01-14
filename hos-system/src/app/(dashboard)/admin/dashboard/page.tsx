/**
 * HOS - Hospital Management System
 * Admin Dashboard Page
 * ===========================================
 * Main dashboard for administrators with KPIs, charts, and quick actions
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Building2,
  IndianRupee,
  Package,
  AlertTriangle,
  TrendingUp,
  ClipboardList,
  UserPlus,
  FileText,
  Pill,
  Activity,
} from 'lucide-react';
import { StatsCard, QuickActions, RecentActivity, AppointmentsList } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppointmentStatus, EncounterType } from '@prisma/client';

// Mock data for demonstration
const MOCK_STATS = {
  totalOPD: 156,
  totalIPD: 42,
  totalRevenue: 485000,
  totalPatients: 1250,
  todayAppointments: 48,
  pendingReports: 12,
  lowStockItems: 5,
  activeStaff: 78,
};

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Rahul Verma',
    patientId: 'p1',
    doctorName: 'Dr. Rajesh Sharma',
    doctorId: 'd1',
    scheduledAt: new Date(Date.now() + 30 * 60 * 1000),
    status: AppointmentStatus.SCHEDULED,
    type: EncounterType.OPD,
    reason: 'Follow-up consultation',
  },
  {
    id: '2',
    patientName: 'Sneha Patel',
    patientId: 'p2',
    doctorName: 'Dr. Priya Patel',
    doctorId: 'd2',
    scheduledAt: new Date(Date.now() + 60 * 60 * 1000),
    status: AppointmentStatus.CONFIRMED,
    type: EncounterType.TELECONSULT,
    reason: 'Skin consultation',
  },
  {
    id: '3',
    patientName: 'Arun Kumar',
    patientId: 'p3',
    doctorName: 'Dr. Amit Kumar',
    doctorId: 'd3',
    scheduledAt: new Date(Date.now() + 90 * 60 * 1000),
    status: AppointmentStatus.CHECKED_IN,
    type: EncounterType.OPD,
    reason: 'Chest pain evaluation',
  },
  {
    id: '4',
    patientName: 'Priyanka Singh',
    patientId: 'p4',
    doctorName: 'Dr. Sunita Gupta',
    doctorId: 'd4',
    scheduledAt: new Date(Date.now() + 120 * 60 * 1000),
    status: AppointmentStatus.SCHEDULED,
    type: EncounterType.OPD,
    reason: 'Annual checkup',
  },
];

const MOCK_ACTIVITIES = [
  {
    id: '1',
    type: 'appointment',
    title: 'New Appointment Booked',
    description: 'Rahul Verma booked appointment with Dr. Sharma',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'report',
    title: 'Lab Report Published',
    description: 'CBC report for MRN#12345 is now available',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: '₹12,500 received from patient Sneha Patel',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
  {
    id: '4',
    type: 'registration',
    title: 'New Patient Registered',
    description: 'Arun Kumar registered via patient portal',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '5',
    type: 'prescription',
    title: 'Prescription Dispensed',
    description: 'Prescription #RX2024001 dispensed from pharmacy',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
];

const QUICK_ACTIONS = [
  { title: 'New Patient', href: '/admin/patients/new', icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { title: 'Book Appointment', href: '/admin/appointments/new', icon: Calendar, color: 'text-green-600', bgColor: 'bg-green-100' },
  { title: 'Generate Bill', href: '/admin/billing/new', icon: FileText, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  { title: 'Add Stock', href: '/admin/inventory/add', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100' },
];

const INVENTORY_ALERTS = [
  { name: 'Paracetamol 500mg', current: 25, min: 100, status: 'critical' },
  { name: 'Surgical Gloves', current: 150, min: 200, status: 'low' },
  { name: 'IV Fluid (NS)', current: 30, min: 50, status: 'low' },
  { name: 'Face Masks', current: 80, min: 100, status: 'low' },
  { name: 'Syringes 5ml', current: 200, min: 300, status: 'low' },
];

const DEPARTMENT_STATS = [
  { name: 'General Medicine', opd: 45, ipd: 12, revenue: 125000 },
  { name: 'Cardiology', opd: 32, ipd: 8, revenue: 185000 },
  { name: 'Orthopedics', opd: 28, ipd: 10, revenue: 95000 },
  { name: 'Pediatrics', opd: 35, ipd: 6, revenue: 55000 },
  { name: 'Gynecology', opd: 16, ipd: 6, revenue: 25000 },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your hospital overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" dot>
            System Healthy
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's OPD"
          value={MOCK_STATS.totalOPD}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active IPD"
          value={MOCK_STATS.totalIPD}
          icon={Building2}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Today's Revenue"
          value={MOCK_STATS.totalRevenue}
          prefix="₹"
          icon={IndianRupee}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Patients"
          value={MOCK_STATS.totalPatients}
          icon={ClipboardList}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <QuickActions actions={QUICK_ACTIONS} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <AppointmentsList
            appointments={MOCK_APPOINTMENTS}
            title="Today's Appointments"
            viewAllHref="/admin/appointments"
          />
        </div>

        {/* Recent Activity */}
        <div>
          <RecentActivity activities={MOCK_ACTIVITIES} />
        </div>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEPARTMENT_STATS.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{dept.name}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                      <span>OPD: {dept.opd}</span>
                      <span>IPD: {dept.ipd}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">₹{dept.revenue.toLocaleString()}</p>
                    <p className="text-xs text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Inventory Alerts
              <Badge variant="warning" className="ml-auto">{INVENTORY_ALERTS.length} items</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {INVENTORY_ALERTS.map((item, index) => {
                const percentage = Math.round((item.current / item.min) * 100);
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.name}</span>
                      <Badge
                        variant={item.status === 'critical' ? 'danger' : 'warning'}
                        className="text-xs"
                      >
                        {item.current} / {item.min}
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                      indicatorClassName={item.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'}
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OPD vs IPD Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Patient Flow - Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chart visualization will appear here</p>
              <p className="text-sm">Recharts integration ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
