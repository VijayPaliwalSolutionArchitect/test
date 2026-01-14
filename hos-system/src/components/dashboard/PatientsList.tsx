/**
 * HOS - Hospital Management System
 * Patients List Component
 * ===========================================
 * Displays patient list with quick actions
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { calculateAge, cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, FileText, Calendar, MoreVertical } from 'lucide-react';
import type { PatientSummary } from '@/types';
import { Gender } from '@prisma/client';

interface PatientsListProps {
  patients: PatientSummary[];
  title?: string;
  viewAllHref?: string;
  emptyMessage?: string;
  showQuickActions?: boolean;
}

export function PatientsList({
  patients,
  title = 'Recent Patients',
  viewAllHref = '/patients',
  emptyMessage = 'No patients found',
  showQuickActions = true,
}: PatientsListProps) {
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
        {patients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {patients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarImage src={undefined} />
                  <AvatarFallback
                    className={cn(
                      'text-sm font-medium',
                      patient.gender === Gender.MALE
                        ? 'bg-blue-100 text-blue-700'
                        : patient.gender === Gender.FEMALE
                        ? 'bg-pink-100 text-pink-700'
                        : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {patient.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/patients/${patient.id}`}
                      className="font-medium truncate hover:text-primary"
                    >
                      {patient.fullName}
                    </Link>
                    <Badge variant="neutral" className="text-xs">
                      {patient.mrn}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{patient.gender}</span>
                    <span>•</span>
                    <span>{patient.age} years</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {patient.phone}
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                {showQuickActions && (
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" title="View Records">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" title="Book Appointment">
                      <Calendar className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PatientsList;
