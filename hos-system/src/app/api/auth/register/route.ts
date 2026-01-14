/**
 * HOS - Hospital Management System
 * Register API Route
 * ===========================================
 * POST /api/auth/register - Register new patient
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth';
import { generateSequentialNumber } from '@/lib/db/utils';
import { Role, Gender } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Get default tenant (or first tenant for simplicity)
    let tenant = await prisma.tenant.findFirst({
      where: { isActive: true },
    });

    if (!tenant) {
      // Create default tenant if none exists
      tenant = await prisma.tenant.create({
        data: {
          name: 'HOS Hospital',
          type: 'HOSPITAL',
          slug: 'hos-hospital',
        },
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user and patient in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          tenantId: tenant!.id,
          email: email.toLowerCase(),
          name,
          phone,
          passwordHash,
          role: Role.PATIENT,
          isActive: true,
        },
      });

      // Generate MRN
      const mrn = await generateSequentialNumber(tenant!.id, 'MRN', 'patient');

      // Create patient record
      const patient = await tx.patient.create({
        data: {
          tenantId: tenant!.id,
          userId: user.id,
          mrn,
          fullName: name,
          gender: Gender.OTHER, // Will be updated in profile
          dob: new Date('2000-01-01'), // Placeholder, will be updated in profile
          phone: phone || '',
          email: email.toLowerCase(),
        },
      });

      return { user, patient };
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        tenantId: tenant.id,
        userId: result.user.id,
        action: 'CREATE',
        entity: 'Patient',
        entityId: result.patient.id,
        newData: { email, name, mrn: result.patient.mrn },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
