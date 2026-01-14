/**
 * HOS - Hospital Management System
 * Database Reset Script
 * ===========================================
 * Removes all seeded data while preserving Super Admin
 * Run: npx ts-node prisma/reset.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Reset database - Delete all records except Super Admin
 */
async function reset() {
  console.log('🧹 Starting HOS database reset...');
  console.log('⚠️  This will delete all data except Super Admin user.\n');

  try {
    // -----------------------------
    // Delete in order (FK safety)
    // -----------------------------

    // AI & Audit
    console.log('🗑️  Deleting AI interactions...');
    await prisma.aIInteraction.deleteMany();

    console.log('🗑️  Deleting audit logs...');
    await prisma.auditLog.deleteMany();

    console.log('🗑️  Deleting domain events...');
    await prisma.domainEvent.deleteMany();

    // Notifications & Feedback
    console.log('🗑️  Deleting notifications...');
    await prisma.notification.deleteMany();

    console.log('🗑️  Deleting feedback...');
    await prisma.feedback.deleteMany();

    // Marketing
    console.log('🗑️  Deleting campaigns...');
    await prisma.campaign.deleteMany();

    // HR & Payroll
    console.log('🗑️  Deleting payroll records...');
    await prisma.payroll.deleteMany();

    console.log('🗑️  Deleting leave records...');
    await prisma.leave.deleteMany();

    console.log('🗑️  Deleting shifts...');
    await prisma.shift.deleteMany();

    console.log('🗑️  Deleting attendance records...');
    await prisma.attendance.deleteMany();

    console.log('🗑️  Deleting employee records...');
    await prisma.employee.deleteMany();

    // Billing
    console.log('🗑️  Deleting payments...');
    await prisma.payment.deleteMany();

    console.log('🗑️  Deleting invoice items...');
    await prisma.invoiceItem.deleteMany();

    console.log('🗑️  Deleting invoices...');
    await prisma.invoice.deleteMany();

    // Inventory
    console.log('🗑️  Deleting inventory items...');
    await prisma.inventoryItem.deleteMany();

    // Clinical - Reports & Orders
    console.log('🗑️  Deleting medical reports...');
    await prisma.medicalReport.deleteMany();

    console.log('🗑️  Deleting medical orders...');
    await prisma.medicalOrder.deleteMany();

    // Clinical - Prescriptions & Diagnosis
    console.log('🗑️  Deleting prescriptions...');
    await prisma.prescription.deleteMany();

    console.log('🗑️  Deleting diagnoses...');
    await prisma.diagnosis.deleteMany();

    console.log('🗑️  Deleting clinical notes...');
    await prisma.clinicalNote.deleteMany();

    console.log('🗑️  Deleting vitals...');
    await prisma.vital.deleteMany();

    // IPD
    console.log('🗑️  Deleting nurse assignments...');
    await prisma.nurseAssignment.deleteMany();

    console.log('🗑️  Deleting admissions...');
    await prisma.admission.deleteMany();

    // Encounters & Appointments
    console.log('🗑️  Deleting appointments...');
    await prisma.appointment.deleteMany();

    console.log('🗑️  Deleting encounters...');
    await prisma.encounter.deleteMany();

    // Patients
    console.log('🗑️  Deleting patients...');
    await prisma.patient.deleteMany();

    // Beds & Wards
    console.log('🗑️  Deleting beds...');
    await prisma.bed.deleteMany();

    console.log('🗑️  Deleting wards...');
    await prisma.ward.deleteMany();

    // Departments
    console.log('🗑️  Deleting departments...');
    await prisma.department.deleteMany();

    // Auth
    console.log('🗑️  Deleting sessions...');
    await prisma.session.deleteMany();

    console.log('🗑️  Deleting accounts...');
    await prisma.account.deleteMany();

    console.log('🗑️  Deleting verification tokens...');
    await prisma.verificationToken.deleteMany();

    // Users (except Super Admin)
    console.log('🗑️  Deleting users (preserving Super Admin)...');
    await prisma.user.deleteMany({
      where: {
        email: { not: 'superadmin@hos.com' },
      },
    });

    // Note: We keep the tenant and super admin
    console.log('\n✅ Database reset completed successfully!');
    console.log('\n📋 Preserved:');
    console.log('   - Tenant configuration');
    console.log('   - Super Admin user (superadmin@hos.com)');
    console.log('\n💡 Run "npx prisma db seed" to re-populate the database.');

  } catch (error) {
    console.error('\n❌ Reset failed:', error);
    throw error;
  }
}

reset()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
