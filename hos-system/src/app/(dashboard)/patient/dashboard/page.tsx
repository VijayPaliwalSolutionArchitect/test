/**
 * HOS - Hospital Management System
 * Patient Dashboard Page
 * ===========================================
 * Personal health dashboard for patients
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Pill,
  Heart,
  Activity,
  MessageSquare,
  Clock,
  CreditCard,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Mock patient data
const PATIENT_PROFILE = {
  name: 'Rahul Verma',
  mrn: 'MRN000001',
  age: 35,
  bloodGroup: 'O+',
  conditions: ['Type 2 Diabetes', 'Hypertension'],
  allergies: ['Penicillin'],
};

const UPCOMING_APPOINTMENTS = [
  {
    id: '1',
    doctorName: 'Dr. Rajesh Sharma',
    specialty: 'General Medicine',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    time: '10:30 AM',
    type: 'Follow-up',
  },
  {
    id: '2',
    doctorName: 'Dr. Priya Patel',
    specialty: 'Cardiology',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: '2:00 PM',
    type: 'Consultation',
  },
];

const ACTIVE_PRESCRIPTIONS = [
  { id: '1', name: 'Metformin 500mg', dosage: '1-0-1', remaining: 15, total: 30 },
  { id: '2', name: 'Amlodipine 5mg', dosage: '0-0-1', remaining: 20, total: 30 },
  { id: '3', name: 'Aspirin 75mg', dosage: '0-1-0', remaining: 25, total: 30 },
];

const RECENT_REPORTS = [
  { id: '1', name: 'HbA1c', date: '15 Aug 2024', status: 'Ready', isAbnormal: false },
  { id: '2', name: 'Lipid Profile', date: '15 Aug 2024', status: 'Ready', isAbnormal: true },
  { id: '3', name: 'Blood Pressure Log', date: '10 Aug 2024', status: 'Ready', isAbnormal: false },
];

const HEALTH_METRICS = [
  { name: 'Blood Pressure', value: '128/82', unit: 'mmHg', status: 'normal', icon: Activity },
  { name: 'Blood Sugar', value: '142', unit: 'mg/dL', status: 'warning', icon: Heart },
  { name: 'Weight', value: '78', unit: 'kg', status: 'normal', icon: Activity },
];

export default function PatientDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {PATIENT_PROFILE.name}</h1>
          <p className="text-muted-foreground">Here&apos;s your health overview</p>
        </div>
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
          <MessageSquare className="w-4 h-4" />
          Health Assistant
        </Button>
      </div>

      {/* Health Overview Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-white/30">
                <AvatarFallback className="bg-white/20 text-white text-xl">
                  {PATIENT_PROFILE.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{PATIENT_PROFILE.name}</h2>
                <p className="text-white/80">MRN: {PATIENT_PROFILE.mrn}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-6 ml-auto">
              <div className="text-center">
                <p className="text-white/70 text-sm">Age</p>
                <p className="text-xl font-bold">{PATIENT_PROFILE.age} yrs</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">Blood Group</p>
                <p className="text-xl font-bold">{PATIENT_PROFILE.bloodGroup}</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-sm">Conditions</p>
                <p className="text-xl font-bold">{PATIENT_PROFILE.conditions.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {HEALTH_METRICS.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <motion.div
              key={metric.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      metric.status === 'normal' ? 'bg-green-100' : 'bg-yellow-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        metric.status === 'normal' ? 'text-green-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <p className="text-xl font-bold">
                        {metric.value} <span className="text-sm font-normal text-muted-foreground">{metric.unit}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { title: 'Book Appointment', icon: Calendar, color: 'text-blue-600', bgColor: 'bg-blue-100' },
          { title: 'View Reports', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-100' },
          { title: 'My Prescriptions', icon: Pill, color: 'text-purple-600', bgColor: 'bg-purple-100' },
          { title: 'Pay Bills', icon: CreditCard, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        ].map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-gray-800 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <div className={`p-3 rounded-xl ${action.bgColor}`}>
                <Icon className={`w-6 h-6 ${action.color}`} />
              </div>
              <span className="text-sm font-medium text-center">{action.title}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {UPCOMING_APPOINTMENTS.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {apt.doctorName.split(' ').pop()?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{apt.doctorName}</p>
                    <p className="text-xs text-muted-foreground">{apt.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{apt.time}</p>
                    <p className="text-xs text-muted-foreground">
                      {apt.date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-600" />
              Active Prescriptions
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ACTIVE_PRESCRIPTIONS.map((rx, index) => {
                const percentage = (rx.remaining / rx.total) * 100;
                return (
                  <motion.div
                    key={rx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{rx.name}</p>
                        <p className="text-xs text-muted-foreground">Dosage: {rx.dosage}</p>
                      </div>
                      <Badge variant={percentage < 30 ? 'warning' : 'neutral'} className="text-xs">
                        {rx.remaining} left
                      </Badge>
                    </div>
                    <Progress
                      value={percentage}
                      className="h-2"
                      indicatorClassName={percentage < 30 ? 'bg-yellow-500' : 'bg-purple-500'}
                    />
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Recent Reports
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_REPORTS.map((report, index) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg ${
                    report.isAbnormal ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      report.isAbnormal ? 'text-red-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                  <Badge variant={report.isAbnormal ? 'danger' : 'success'} className="text-xs">
                    {report.isAbnormal ? 'Review Needed' : 'Normal'}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Health Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Conditions</p>
                <div className="flex flex-wrap gap-2">
                  {PATIENT_PROFILE.conditions.map((condition) => (
                    <Badge key={condition} variant="info" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {PATIENT_PROFILE.allergies.map((allergy) => (
                    <Badge key={allergy} variant="danger" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Health Assistant Prompt */}
      <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-7 h-7" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold mb-1">AI Health Assistant</h3>
              <p className="text-white/80 text-sm">
                Have questions about your health? Our AI assistant can help you understand your reports and provide general health guidance.
              </p>
            </div>
            <Button variant="secondary" className="shrink-0">
              Chat Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
