/**
 * HOS - Hospital Management System
 * Marketing Dashboard Page
 * ===========================================
 * Dashboard for marketing and growth team
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Megaphone,
  Mail,
  MessageSquare,
  Users,
  TrendingUp,
  Star,
  BarChart3,
  Target,
  Send,
  Eye,
  MousePointer,
} from 'lucide-react';
import { StatsCard } from '@/components/dashboard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const MOCK_STATS = {
  activeCampaigns: 4,
  totalReach: 15420,
  avgOpenRate: 42.5,
  npsScore: 78,
};

const ACTIVE_CAMPAIGNS = [
  { id: '1', name: 'Follow-Up Reminder', channel: 'Email', status: 'active', sent: 1250, opened: 520, clicked: 180 },
  { id: '2', name: 'Health Checkup Promotion', channel: 'SMS', status: 'active', sent: 2500, opened: null, clicked: null },
  { id: '3', name: 'Vaccination Drive', channel: 'Push', status: 'scheduled', sent: 0, opened: 0, clicked: 0 },
  { id: '4', name: 'Diabetes Awareness', channel: 'In-App', status: 'draft', sent: 0, opened: 0, clicked: 0 },
];

const PATIENT_SEGMENTS = [
  { name: 'Regular Visitors', count: 450, percentage: 36, color: 'bg-blue-500' },
  { name: 'New Patients', count: 280, percentage: 22, color: 'bg-green-500' },
  { name: 'Chronic Care', count: 320, percentage: 26, color: 'bg-purple-500' },
  { name: 'Inactive (6+ months)', count: 200, percentage: 16, color: 'bg-gray-400' },
];

const RECENT_FEEDBACK = [
  { id: '1', rating: 5, comment: 'Excellent service! Dr. Sharma was very helpful.', date: '2 hours ago' },
  { id: '2', rating: 4, comment: 'Good experience, but waiting time was long.', date: '5 hours ago' },
  { id: '3', rating: 5, comment: 'Very clean facility and professional staff.', date: '1 day ago' },
];

const EMAIL_PERFORMANCE = {
  totalSent: 5000,
  delivered: 4850,
  opened: 2125,
  clicked: 680,
  bounced: 150,
};

export default function MarketingDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketing Dashboard</h1>
          <p className="text-muted-foreground">Patient Engagement & Growth</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button className="gap-2 bg-pink-600 hover:bg-pink-700">
            <Megaphone className="w-4 h-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Campaigns"
          value={MOCK_STATS.activeCampaigns}
          icon={Megaphone}
          iconColor="text-pink-600"
          iconBgColor="bg-pink-100"
        />
        <StatsCard
          title="Total Reach"
          value={MOCK_STATS.totalReach}
          icon={Users}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: 18, isPositive: true }}
        />
        <StatsCard
          title="Avg Open Rate"
          value={MOCK_STATS.avgOpenRate}
          suffix="%"
          icon={Eye}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="NPS Score"
          value={MOCK_STATS.npsScore}
          icon={Star}
          iconColor="text-yellow-600"
          iconBgColor="bg-yellow-100"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Campaigns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-pink-600" />
                Campaigns
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {ACTIVE_CAMPAIGNS.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${
                      campaign.channel === 'Email' ? 'bg-blue-100' :
                      campaign.channel === 'SMS' ? 'bg-green-100' :
                      campaign.channel === 'Push' ? 'bg-purple-100' : 'bg-orange-100'
                    }`}>
                      {campaign.channel === 'Email' ? <Mail className="w-4 h-4 text-blue-600" /> :
                       campaign.channel === 'SMS' ? <MessageSquare className="w-4 h-4 text-green-600" /> :
                       <Send className="w-4 h-4 text-purple-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{campaign.name}</p>
                      <p className="text-xs text-muted-foreground">{campaign.channel}</p>
                    </div>
                    <Badge
                      variant={campaign.status === 'active' ? 'success' : campaign.status === 'scheduled' ? 'warning' : 'neutral'}
                      className="text-xs"
                    >
                      {campaign.status}
                    </Badge>
                    {campaign.sent > 0 && (
                      <div className="text-right text-xs text-muted-foreground">
                        <p>Sent: {campaign.sent.toLocaleString()}</p>
                        {campaign.opened !== null && (
                          <p>Opened: {Math.round((campaign.opened / campaign.sent) * 100)}%</p>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Segments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Patient Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PATIENT_SEGMENTS.map((segment, index) => (
                <motion.div
                  key={segment.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{segment.name}</span>
                    <span className="text-xs text-muted-foreground">{segment.count}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={segment.percentage}
                      className="h-2 flex-1"
                      indicatorClassName={segment.color}
                    />
                    <span className="text-xs font-medium w-10">{segment.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Email Performance (This Month)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Send className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-muted-foreground">Sent</span>
                  </div>
                  <p className="text-xl font-bold">{EMAIL_PERFORMANCE.totalSent.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-muted-foreground">Opened</span>
                  </div>
                  <p className="text-xl font-bold">{EMAIL_PERFORMANCE.opened.toLocaleString()}</p>
                  <p className="text-xs text-green-600">
                    {Math.round((EMAIL_PERFORMANCE.opened / EMAIL_PERFORMANCE.delivered) * 100)}% rate
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointer className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-muted-foreground">Clicked</span>
                  </div>
                  <p className="text-xl font-bold">{EMAIL_PERFORMANCE.clicked.toLocaleString()}</p>
                  <p className="text-xs text-purple-600">
                    {Math.round((EMAIL_PERFORMANCE.clicked / EMAIL_PERFORMANCE.opened) * 100)}% CTR
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-muted-foreground">Bounced</span>
                  </div>
                  <p className="text-xl font-bold">{EMAIL_PERFORMANCE.bounced}</p>
                  <p className="text-xs text-red-600">
                    {Math.round((EMAIL_PERFORMANCE.bounced / EMAIL_PERFORMANCE.totalSent) * 100)}% rate
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Feedback */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Recent Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {RECENT_FEEDBACK.map((feedback, index) => (
                <motion.div
                  key={feedback.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground ml-auto">{feedback.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">"{feedback.comment}"</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
