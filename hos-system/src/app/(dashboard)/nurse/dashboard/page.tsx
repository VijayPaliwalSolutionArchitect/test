/**
 * HOS - Hospital Management System
 * Nurse Dashboard Page
 * ===========================================
 * Dashboard for nurses with patient assignments and tasks
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Activity,
  Pill,
  ClipboardList,
  AlertTriangle,
  Clock,
  BedDouble,
  CheckCircle,
  Bell,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

// Mock data
const MOCK_STATS = {
  assignedPatients: 8,
  pendingTasks: 12,
  medicationsDue: 5,
  vitalsDue: 3,
};

const ASSIGNED_PATIENTS = [
  { id: '1', name: 'Rahul Verma', bed: 'ICU-01', status: 'Critical', doctor: 'Dr. Sharma', admittedAt: '2 days ago' },
  { id: '2', name: 'Sneha Patel', bed: 'GWA-05', status: 'Stable', doctor: 'Dr. Patel', admittedAt: '4 days ago' },
  { id: '3', name: 'Arun Kumar', bed: 'GWA-08', status: 'Improving', doctor: 'Dr. Kumar', admittedAt: '1 day ago' },
  { id: '4', name: 'Priyanka Singh', bed: 'PVT-03', status: 'Stable', doctor: 'Dr. Gupta', admittedAt: '3 days ago' },
];

const PENDING_TASKS = [
  { id: '1', patient: 'Rahul Verma', task: 'Administer IV Medication', time: 'Now', priority: 'high', type: 'medication' },
  { id: '2', patient: 'Sneha Patel', task: 'Record Vitals', time: '15 min', priority: 'medium', type: 'vitals' },
  { id: '3', patient: 'Arun Kumar', task: 'Wound Dressing Change', time: '30 min', priority: 'medium', type: 'procedure' },
  { id: '4', patient: 'All Patients', task: 'Shift Handover Report', time: '2 hours', priority: 'low', type: 'documentation' },
];

const MEDICATION_SCHEDULE = [
  { id: '1', patient: 'Rahul Verma', medication: 'Insulin 10U', time: '8:00 AM', status: 'due' },
  { id: '2', patient: 'Sneha Patel', medication: 'Paracetamol 500mg', time: '8:30 AM', status: 'due' },
  { id: '3', patient: 'Arun Kumar', medication: 'Ceftriaxone 1g IV', time: '9:00 AM', status: 'pending' },
];

const ALERTS = [
  { id: '1', type: 'critical', message: 'ICU-01 - Rahul Verma: BP dropping', time: '5 min ago' },
  { id: '2', type: 'warning', message: 'GWA-05 - Sneha Patel: Fever spike', time: '20 min ago' },
];

export default function NurseDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
          <p className="text-muted-foreground">Good morning, Nurse Rekha | Morning Shift</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <ClipboardList className="w-4 h-4" />
            Shift Handover
          </Button>
        </div>
      </div>

      {/* Alerts Banner */}
      {ALERTS.length > 0 && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div className="flex-1">
                <p className="font-medium text-red-800 dark:text-red-200">Active Alerts</p>
                <p className="text-sm text-red-600 dark:text-red-300">{ALERTS[0].message}</p>
              </div>
              <Badge variant="danger">{ALERTS.length} alerts</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Assigned Patients"
          value={MOCK_STATS.assignedPatients}
          icon={Users}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Pending Tasks"
          value={MOCK_STATS.pendingTasks}
          icon={ClipboardList}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="Medications Due"
          value={MOCK_STATS.medicationsDue}
          icon={Pill}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
        />
        <StatsCard
          title="Vitals Due"
          value={MOCK_STATS.vitalsDue}
          icon={Activity}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Assigned Patients */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-green-600" />
                My Assigned Patients
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ASSIGNED_PATIENTS.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {patient.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{patient.name}</p>
                        <Badge
                          variant={patient.status === 'Critical' ? 'danger' : patient.status === 'Improving' ? 'success' : 'neutral'}
                          className="text-xs"
                        >
                          {patient.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3 h-3" />
                          {patient.bed}
                        </span>
                        <span>{patient.doctor}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs">
                        <Activity className="w-3 h-3 mr-1" />
                        Vitals
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs">
                        <Pill className="w-3 h-3 mr-1" />
                        Meds
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-yellow-600" />
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
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.priority === 'high' ? 'bg-red-500 animate-pulse' :
                    task.priority === 'medium' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{task.task}</p>
                    <p className="text-xs text-muted-foreground">{task.patient}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{task.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Medication Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-purple-600" />
            Medication Schedule - Next Hour
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MEDICATION_SCHEDULE.map((med, index) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-lg border hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={med.status === 'due' ? 'warning' : 'neutral'} className="text-xs">
                    {med.time}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
                <p className="font-medium text-sm">{med.medication}</p>
                <p className="text-xs text-muted-foreground">{med.patient}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
