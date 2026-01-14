/**
 * HOS - Hospital Management System
 * Lab Dashboard Page
 * ===========================================
 * Dashboard for lab technicians
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  Users,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

const MOCK_STATS = {
  pendingSamples: 15,
  inProgress: 8,
  completedToday: 42,
  urgentOrders: 3,
};

const PENDING_SAMPLES = [
  { id: '1', patient: 'Rahul Verma', test: 'CBC', priority: 'STAT', collectedAt: '10 min ago' },
  { id: '2', patient: 'Sneha Patel', test: 'Lipid Profile', priority: 'URGENT', collectedAt: '25 min ago' },
  { id: '3', patient: 'Arun Kumar', test: 'LFT', priority: 'ROUTINE', collectedAt: '45 min ago' },
  { id: '4', patient: 'Priyanka Singh', test: 'KFT', priority: 'ROUTINE', collectedAt: '1 hour ago' },
];

const IN_PROGRESS_TESTS = [
  { id: '1', patient: 'Vijay Sharma', test: 'HbA1c', progress: 75, eta: '15 min' },
  { id: '2', patient: 'Meera Gupta', test: 'Thyroid Panel', progress: 50, eta: '30 min' },
  { id: '3', patient: 'Rohit Joshi', test: 'Urine Analysis', progress: 90, eta: '5 min' },
];

const RESULTS_TO_REVIEW = [
  { id: '1', patient: 'Kavita Nair', test: 'CBC', isAbnormal: true, completedAt: '5 min ago' },
  { id: '2', patient: 'Deepak Chauhan', test: 'Blood Sugar', isAbnormal: false, completedAt: '15 min ago' },
  { id: '3', patient: 'Pooja Agarwal', test: 'Electrolytes', isAbnormal: true, completedAt: '20 min ago' },
];

export default function LabDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lab Dashboard</h1>
          <p className="text-muted-foreground">Pathology Laboratory - Today&apos;s Overview</p>
        </div>
        <Button className="gap-2 bg-teal-600 hover:bg-teal-700">
          <FlaskConical className="w-4 h-4" />
          New Sample
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Pending Samples"
          value={MOCK_STATS.pendingSamples}
          icon={FlaskConical}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
        <StatsCard
          title="In Progress"
          value={MOCK_STATS.inProgress}
          icon={Clock}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
        />
        <StatsCard
          title="Completed Today"
          value={MOCK_STATS.completedToday}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
        <StatsCard
          title="Urgent Orders"
          value={MOCK_STATS.urgentOrders}
          icon={AlertCircle}
          iconColor="text-red-600"
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Samples */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-yellow-600" />
              Pending Samples
              <Badge variant="warning" className="ml-auto">{PENDING_SAMPLES.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {PENDING_SAMPLES.map((sample, index) => (
                <motion.div
                  key={sample.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-teal-100 text-teal-700 text-sm">
                      {sample.patient.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{sample.patient}</p>
                    <p className="text-xs text-muted-foreground">{sample.test}</p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={sample.priority === 'STAT' ? 'danger' : sample.priority === 'URGENT' ? 'warning' : 'neutral'}
                      className="text-xs"
                    >
                      {sample.priority}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{sample.collectedAt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {IN_PROGRESS_TESTS.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2 p-3 rounded-lg border"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{test.patient}</p>
                      <p className="text-xs text-muted-foreground">{test.test}</p>
                    </div>
                    <Badge variant="info" className="text-xs">ETA: {test.eta}</Badge>
                  </div>
                  <Progress value={test.progress} className="h-2" indicatorClassName="bg-teal-500" />
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results to Review */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Results to Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {RESULTS_TO_REVIEW.map((result, index) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg ${
                    result.isAbnormal ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {result.isAbnormal ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{result.patient}</p>
                    <p className="text-xs text-muted-foreground">{result.test}</p>
                  </div>
                  <Button size="sm" variant="outline" className="text-xs">
                    Review
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
