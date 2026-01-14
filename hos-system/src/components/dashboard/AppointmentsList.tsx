/**
 * HOS - Hospital Management System
 * Appointments List Component
 * ===========================================
 * Displays upcoming/recent appointments
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { formatDate, formatTime, cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Video, MoreVertical } from 'lucide-react';
import type { AppointmentSummary } from '@/types';
import { AppointmentStatus, EncounterType } from '@prisma/client';

interface AppointmentsListProps {
  appointments: AppointmentSummary[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
  showActions?: boolean;
}

const STATUS_VARIANTS: Record<AppointmentStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  SCHEDULED: 'info',
  CONFIRMED: 'info',
  CHECKED_IN: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  NO_SHOW: 'neutral',
  RESCHEDULED: 'neutral',
};

export function AppointmentsList({
  appointments,
  title = 'Upcoming Appointments',
  viewAllHref = '/appointments',
  emptyMessage = 'No appointments scheduled',
  showActions = true,
}: AppointmentsListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {appointment.patientName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate">{appointment.patientName}</p>
                    <Badge variant={STATUS_VARIANTS[appointment.status]} className="text-xs">
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(appointment.scheduledAt)}
                    </span>
                    {appointment.type === EncounterType.TELECONSULT ? (
                      <span className="flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Video Call
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        In-Person
                      </span>
                    )}
                  </div>
                  {appointment.reason && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {appointment.reason}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatDate(appointment.scheduledAt, 'dd MMM')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(appointment.scheduledAt, 'EEEE')}
                  </p>
                </div>

                {/* Actions */}
                {showActions && (
                  <Button variant="ghost" size="icon-sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AppointmentsList;
