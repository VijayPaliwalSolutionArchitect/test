/**
 * HOS - Hospital Management System
 * HR Dashboard Page
 * ===========================================
 * Dashboard for HR and Payroll management
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  Clock,
  CreditCard,
  UserPlus,
  FileText,
  CheckCircle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const MOCK_STATS = {
  totalEmployees: 125,
  presentToday: 112,
  onLeave: 8,
  pendingPayroll: 5,
};

const LEAVE_REQUESTS = [
  { id: '1', name: 'Dr. Amit Kumar', type: 'Sick Leave', days: 2, from: '15 Aug', status: 'pending' },
  { id: '2', name: 'Nurse Meena', type: 'Casual Leave', days: 1, from: '16 Aug', status: 'pending' },
  { id: '3', name: 'Lab Tech Ravi', type: 'Annual Leave', days: 5, from: '20 Aug', status: 'pending' },
];

const RECENT_HIRES = [
  { id: '1', name: 'Dr. Neha Reddy', role: 'Doctor', department: 'Cardiology', joinDate: '1 Aug 2024' },
  { id: '2', name: 'Nurse Pooja', role: 'Nurse', department: 'ICU', joinDate: '5 Aug 2024' },
  { id: '3', name: 'Pharmacist Sunil', role: 'Pharmacist', department: 'Pharmacy', joinDate: '10 Aug 2024' },
];

const DEPARTMENT_STATS = [
  { name: 'Doctors', count: 15, present: 14, percentage: 93 },
  { name: 'Nurses', count: 45, present: 40, percentage: 89 },
  { name: 'Lab Technicians', count: 12, present: 11, percentage: 92 },
  { name: 'Pharmacists', count: 8, present: 8, percentage: 100 },
  { name: 'Admin Staff', count: 20, present: 18, percentage: 90 },
];

const PAYROLL_SUMMARY = {
  totalSalary: 4500000,
  processed: 120,
  pending: 5,
};

export default function HRDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
          <p className="text-muted-foreground">Employee Management & Payroll</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </Button>
          <Button className="gap-2 bg-yellow-600 hover:bg-yellow-700">
            <UserPlus className="w-4 h-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={MOCK_STATS.totalEmployees}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Present Today"
          value={MOCK_STATS.presentToday}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="On Leave"
          value={MOCK_STATS.onLeave}
          icon={Calendar}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <StatsCard
          title="Pending Payroll"
          value={MOCK_STATS.pendingPayroll}
          icon={CreditCard}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leave Requests */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Leave Requests
              <Badge variant="warning" className="ml-auto">{LEAVE_REQUESTS.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {LEAVE_REQUESTS.map((request, index) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-yellow-100 text-yellow-700 text-sm">
                        {request.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{request.name}</p>
                      <p className="text-xs text-muted-foreground">{request.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {request.days} days from {request.from}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-green-600 hover:text-green-700 hover:bg-green-100">
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-100">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Attendance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Today&apos;s Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEPARTMENT_STATS.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {dept.present}/{dept.count}
                    </span>
                  </div>
                  <Progress
                    value={dept.percentage}
                    className="h-2"
                    indicatorClassName={
                      dept.percentage >= 90 ? 'bg-green-500' :
                      dept.percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }
                  />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Hires */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-green-600" />
              Recent Hires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_HIRES.map((hire, index) => (
                <motion.div
                  key={hire.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-green-100 text-green-700 text-sm">
                      {hire.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{hire.name}</p>
                    <p className="text-xs text-muted-foreground">{hire.role} • {hire.department}</p>
                  </div>
                  <Badge variant="success" className="text-xs">
                    New
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Summary */}
      <Card className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <CreditCard className="w-7 h-7" />
              </div>
              <div>
                <p className="text-white/80 text-sm">This Month&apos;s Payroll</p>
                <p className="text-2xl font-bold">₹{(PAYROLL_SUMMARY.totalSalary / 100000).toFixed(1)}L</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold">{PAYROLL_SUMMARY.processed}</p>
                <p className="text-white/80 text-sm">Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{PAYROLL_SUMMARY.pending}</p>
                <p className="text-white/80 text-sm">Pending</p>
              </div>
            </div>
            <Button variant="secondary" className="shrink-0">
              Process Payroll
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
