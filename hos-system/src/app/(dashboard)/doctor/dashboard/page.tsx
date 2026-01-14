/**
 * HOS - Hospital Management System
 * Doctor Dashboard Page
 * ===========================================
 * Main dashboard for doctors with appointments, tasks, and AI copilot
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Calendar,
  ClipboardList,
  FlaskConical,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Video,
  FileText,
} from 'lucide-react';
import { StatsCard, AppointmentsList, RecentActivity } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AppointmentStatus, EncounterType } from '@prisma/client';

// Mock data
const MOCK_STATS = {
  todayPatients: 12,
  completedConsults: 8,
  pendingReports: 5,
  followUps: 3,
};

const MOCK_APPOINTMENTS = [
  {
    id: '1',
    patientName: 'Rahul Verma',
    patientId: 'p1',
    doctorName: 'Dr. Rajesh Sharma',
    doctorId: 'd1',
    scheduledAt: new Date(Date.now() + 15 * 60 * 1000),
    status: AppointmentStatus.CHECKED_IN,
    type: EncounterType.OPD,
    reason: 'Follow-up for hypertension',
  },
  {
    id: '2',
    patientName: 'Sneha Patel',
    patientId: 'p2',
    doctorName: 'Dr. Rajesh Sharma',
    doctorId: 'd1',
    scheduledAt: new Date(Date.now() + 45 * 60 * 1000),
    status: AppointmentStatus.CONFIRMED,
    type: EncounterType.TELECONSULT,
    reason: 'Diabetes management',
  },
  {
    id: '3',
    patientName: 'Arun Kumar',
    patientId: 'p3',
    doctorName: 'Dr. Rajesh Sharma',
    doctorId: 'd1',
    scheduledAt: new Date(Date.now() + 75 * 60 * 1000),
    status: AppointmentStatus.SCHEDULED,
    type: EncounterType.OPD,
    reason: 'Chest pain evaluation',
  },
];

const PENDING_TASKS = [
  { id: '1', title: 'Review lab report for Rahul Verma', priority: 'high', type: 'lab', dueTime: '10 min' },
  { id: '2', title: 'Sign prescription for Sneha Patel', priority: 'medium', type: 'prescription', dueTime: '30 min' },
  { id: '3', title: 'Complete discharge summary - Arun Kumar', priority: 'high', type: 'document', dueTime: '1 hour' },
  { id: '4', title: 'Respond to referral request', priority: 'low', type: 'referral', dueTime: '2 hours' },
];

const PENDING_LAB_RESULTS = [
  { id: '1', patientName: 'Rahul Verma', testName: 'Lipid Profile', status: 'Result Ready', isAbnormal: true },
  { id: '2', patientName: 'Meera Gupta', testName: 'HbA1c', status: 'In Progress', isAbnormal: false },
  { id: '3', patientName: 'Vijay Sharma', testName: 'Liver Function', status: 'Result Ready', isAbnormal: false },
];

const RECENT_PATIENTS = [
  { id: '1', name: 'Rohit Joshi', mrn: 'MRN001234', lastVisit: '2 days ago', condition: 'Diabetes Type 2' },
  { id: '2', name: 'Anjali Reddy', mrn: 'MRN001235', lastVisit: '3 days ago', condition: 'Hypertension' },
  { id: '3', name: 'Suresh Mehta', mrn: 'MRN001236', lastVisit: '1 week ago', condition: 'COPD' },
];

export default function DoctorDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Good Morning, Dr. Sharma</h1>
          <p className="text-muted-foreground">You have {MOCK_STATS.todayPatients} patients scheduled today</p>
        </div>
        <Button className="gap-2">
          <MessageSquare className="w-4 h-4" />
          AI Copilot
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Today's Patients"
          value={MOCK_STATS.todayPatients}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Completed"
          value={MOCK_STATS.completedConsults}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Pending Reports"
          value={MOCK_STATS.pendingReports}
          icon={FlaskConical}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Follow-ups Due"
          value={MOCK_STATS.followUps}
          icon={Calendar}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <AppointmentsList
            appointments={MOCK_APPOINTMENTS}
            title="Today's Schedule"
            viewAllHref="/doctor/appointments"
          />
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Pending Tasks
              <Badge variant="warning" className="ml-auto">{PENDING_TASKS.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PENDING_TASKS.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Due in {task.dueTime}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Lab Results */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-teal-600" />
              Lab Results to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PENDING_LAB_RESULTS.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                      {result.patientName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{result.patientName}</p>
                    <p className="text-xs text-muted-foreground">{result.testName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {result.isAbnormal && (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    )}
                    <Badge variant={result.status === 'Result Ready' ? 'success' : 'warning'} className="text-xs">
                      {result.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Recent Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RECENT_PATIENTS.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                      {patient.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{patient.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{patient.mrn}</span>
                      <span>•</span>
                      <span>{patient.lastVisit}</span>
                    </div>
                  </div>
                  <Badge variant="neutral" className="text-xs">
                    {patient.condition}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Copilot Quick Access */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <MessageSquare className="w-8 h-8" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">AI Clinical Copilot</h3>
              <p className="text-white/80">
                Get AI-powered assistance for clinical documentation, differential diagnosis suggestions, and drug interaction alerts.
              </p>
            </div>
            <Button variant="secondary" className="shrink-0">
              Open Copilot
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
