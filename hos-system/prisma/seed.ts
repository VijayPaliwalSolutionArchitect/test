/**
 * HOS - Hospital Management System
 * Database Seeding Script
 * ===========================================
 * Creates demo data for all dashboards and modules
 * Run: npx prisma db seed
 */

import { PrismaClient, Role, TenantType, Gender, EncounterType, EncounterStatus, AppointmentStatus, VitalType, NoteType, OrderType, OrderStatus, InvoiceStatus, PaymentMethod, BedStatus, CampaignChannel, CampaignStatus, ShiftType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Hash password using bcrypt
 */
async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Generate random date within range
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate random number within range
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Main seeding function
 */
async function main() {
  console.log('🌱 Starting HOS database seeding...');

  // -----------------------------
  // TENANT SETUP
  // -----------------------------
  console.log('📦 Creating tenant...');
  const tenant = await prisma.tenant.create({
    data: {
      name: 'HOS Demo Hospital',
      type: TenantType.HOSPITAL,
      slug: 'hos-demo',
      settings: {
        timezone: 'Asia/Kolkata',
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        appointmentDuration: 15,
      },
      theme: {
        primaryColor: '#3B82F6',
        logo: '/logo.png',
      },
    },
  });

  // -----------------------------
  // DEPARTMENTS
  // -----------------------------
  console.log('🏥 Creating departments...');
  const departments = await Promise.all([
    prisma.department.create({ data: { tenantId: tenant.id, name: 'General Medicine', code: 'GEN' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Cardiology', code: 'CARD' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Orthopedics', code: 'ORTHO' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Pediatrics', code: 'PED' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Gynecology', code: 'GYN' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Emergency', code: 'ER' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Radiology', code: 'RAD' } }),
    prisma.department.create({ data: { tenantId: tenant.id, name: 'Pathology', code: 'PATH' } }),
  ]);

  // -----------------------------
  // WARDS & BEDS
  // -----------------------------
  console.log('🛏️ Creating wards and beds...');
  const wards = await Promise.all([
    prisma.ward.create({ data: { tenantId: tenant.id, name: 'General Ward A', code: 'GWA', floor: '1', capacity: 20 } }),
    prisma.ward.create({ data: { tenantId: tenant.id, name: 'General Ward B', code: 'GWB', floor: '1', capacity: 20 } }),
    prisma.ward.create({ data: { tenantId: tenant.id, name: 'ICU', code: 'ICU', floor: '2', capacity: 10 } }),
    prisma.ward.create({ data: { tenantId: tenant.id, name: 'Private Rooms', code: 'PVT', floor: '3', capacity: 15 } }),
  ]);

  // Create beds for each ward
  for (const ward of wards) {
    const bedCount = ward.code === 'ICU' ? 10 : ward.code === 'PVT' ? 15 : 20;
    for (let i = 1; i <= bedCount; i++) {
      await prisma.bed.create({
        data: {
          wardId: ward.id,
          bedNumber: `${ward.code}-${i.toString().padStart(2, '0')}`,
          bedType: ward.code === 'ICU' ? 'ICU' : ward.code === 'PVT' ? 'Private' : 'General',
          status: Math.random() > 0.7 ? BedStatus.OCCUPIED : BedStatus.AVAILABLE,
          features: ward.code === 'ICU' ? ['Ventilator', 'Monitor', 'Oxygen'] : ['Oxygen'],
        },
      });
    }
  }

  // -----------------------------
  // USERS - SUPER ADMIN
  // -----------------------------
  console.log('👤 Creating super admin...');
  const superAdmin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'superadmin@hos.com',
      name: 'Super Admin',
      passwordHash: await hash('Admin@123'),
      role: Role.SUPER_ADMIN,
      isActive: true,
    },
  });

  // -----------------------------
  // USERS - ADMINISTRATIVE STAFF
  // -----------------------------
  console.log('👥 Creating administrative staff...');
  const adminUsers = await Promise.all([
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'admin@hos.com',
        name: 'Hospital Admin',
        passwordHash: await hash('Admin@123'),
        role: Role.ADMIN,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'reception@hos.com',
        name: 'Front Desk',
        passwordHash: await hash('Reception@123'),
        role: Role.RECEPTIONIST,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'hr@hos.com',
        name: 'HR Manager',
        passwordHash: await hash('HR@123'),
        role: Role.HR,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'finance@hos.com',
        name: 'Finance Officer',
        passwordHash: await hash('Finance@123'),
        role: Role.FINANCE,
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'marketing@hos.com',
        name: 'Marketing Head',
        passwordHash: await hash('Marketing@123'),
        role: Role.MARKETING,
        isActive: true,
      },
    }),
  ]);

  // -----------------------------
  // USERS - DOCTORS (10)
  // -----------------------------
  console.log('👨‍⚕️ Creating doctors...');
  const doctorNames = [
    'Dr. Rajesh Sharma', 'Dr. Priya Patel', 'Dr. Amit Kumar', 'Dr. Sunita Gupta',
    'Dr. Vikram Singh', 'Dr. Neha Reddy', 'Dr. Arjun Mehta', 'Dr. Kavita Joshi',
    'Dr. Sanjay Verma', 'Dr. Anita Desai'
  ];

  const doctors = await Promise.all(
    doctorNames.map((name, i) =>
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `doctor${i + 1}@hos.com`,
          name,
          passwordHash: hash('Doctor@123'),
          role: Role.DOCTOR,
          isActive: true,
          metadata: {
            specialization: departments[i % departments.length].name,
            qualification: 'MBBS, MD',
            experience: randomInt(5, 20),
            consultationFee: randomInt(500, 1500),
          },
        },
      })
    )
  );

  // -----------------------------
  // USERS - NURSES (5)
  // -----------------------------
  console.log('👩‍⚕️ Creating nurses...');
  const nurseNames = ['Nurse Rekha', 'Nurse Meena', 'Nurse Pooja', 'Nurse Deepa', 'Nurse Suman'];

  const nurses = await Promise.all(
    nurseNames.map((name, i) =>
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `nurse${i + 1}@hos.com`,
          name,
          passwordHash: hash('Nurse@123'),
          role: Role.NURSE,
          isActive: true,
        },
      })
    )
  );

  // -----------------------------
  // USERS - LAB TECHNICIANS (3)
  // -----------------------------
  console.log('🔬 Creating lab technicians...');
  const labTechs = await Promise.all(
    ['Lab Tech Ravi', 'Lab Tech Suresh', 'Lab Tech Mohan'].map((name, i) =>
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `lab${i + 1}@hos.com`,
          name,
          passwordHash: hash('Lab@123'),
          role: Role.LAB_TECH,
          isActive: true,
        },
      })
    )
  );

  // -----------------------------
  // USERS - RADIOLOGISTS (2)
  // -----------------------------
  console.log('📡 Creating radiologists...');
  const radiologists = await Promise.all(
    ['Dr. Radiology Kumar', 'Dr. Radiology Singh'].map((name, i) =>
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `radio${i + 1}@hos.com`,
          name,
          passwordHash: hash('Radio@123'),
          role: Role.RADIOLOGIST,
          isActive: true,
        },
      })
    )
  );

  // -----------------------------
  // USERS - PHARMACISTS (2)
  // -----------------------------
  console.log('💊 Creating pharmacists...');
  const pharmacists = await Promise.all(
    ['Pharmacist Anil', 'Pharmacist Sunil'].map((name, i) =>
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `pharma${i + 1}@hos.com`,
          name,
          passwordHash: hash('Pharma@123'),
          role: Role.PHARMACIST,
          isActive: true,
        },
      })
    )
  );

  // -----------------------------
  // EMPLOYEES (Link staff users)
  // -----------------------------
  console.log('📋 Creating employee records...');
  const allStaff = [...adminUsers, ...doctors, ...nurses, ...labTechs, ...radiologists, ...pharmacists];
  
  for (let i = 0; i < allStaff.length; i++) {
    const user = allStaff[i];
    await prisma.employee.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        employeeNo: `EMP${(i + 1).toString().padStart(4, '0')}`,
        designation: user.role,
        department: departments[i % departments.length].name,
        joiningDate: randomDate(new Date('2020-01-01'), new Date('2024-01-01')),
        salary: user.role === Role.DOCTOR ? randomInt(100000, 300000) : randomInt(25000, 80000),
      },
    });
  }

  // -----------------------------
  // PATIENTS (20)
  // -----------------------------
  console.log('🏥 Creating patients...');
  const patientNames = [
    'Rahul Verma', 'Sneha Patel', 'Arun Kumar', 'Priyanka Singh', 'Vijay Sharma',
    'Meera Gupta', 'Rohit Joshi', 'Anjali Reddy', 'Suresh Mehta', 'Kavita Nair',
    'Deepak Chauhan', 'Pooja Agarwal', 'Nitin Yadav', 'Swati Kapoor', 'Rakesh Tiwari',
    'Divya Iyer', 'Manoj Pandey', 'Ritu Saxena', 'Ashok Mishra', 'Neelam Bhat'
  ];

  const patients = await Promise.all(
    patientNames.map(async (name, i) => {
      // Create user account for patient portal
      const patientUser = await prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: `patient${i + 1}@mail.com`,
          name,
          passwordHash: await hash('Patient@123'),
          role: Role.PATIENT,
          isActive: true,
        },
      });

      // Create patient record
      return prisma.patient.create({
        data: {
          tenantId: tenant.id,
          userId: patientUser.id,
          mrn: `MRN${(i + 1).toString().padStart(6, '0')}`,
          fullName: name,
          gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          dob: randomDate(new Date('1960-01-01'), new Date('2010-01-01')),
          phone: `98${randomInt(10000000, 99999999)}`,
          email: `patient${i + 1}@mail.com`,
          address: `${randomInt(1, 500)} Main Street, City`,
          bloodGroup: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'][randomInt(0, 7)],
          allergies: i % 3 === 0 ? ['Penicillin'] : [],
          emergencyContact: {
            name: 'Emergency Contact',
            phone: `99${randomInt(10000000, 99999999)}`,
            relation: 'Spouse',
          },
        },
      });
    })
  );

  // -----------------------------
  // APPOINTMENTS (30 - past & upcoming)
  // -----------------------------
  console.log('📅 Creating appointments...');
  const now = new Date();
  const appointments = [];

  for (let i = 0; i < 30; i++) {
    const isPast = i < 20;
    const scheduledAt = isPast
      ? randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now)
      : randomDate(now, new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000));

    const patient = patients[randomInt(0, patients.length - 1)];
    const doctor = doctors[randomInt(0, doctors.length - 1)];

    const apt = await prisma.appointment.create({
      data: {
        tenantId: tenant.id,
        patientId: patient.id,
        doctorId: doctor.id,
        departmentId: departments[randomInt(0, departments.length - 1)].id,
        appointmentNo: `APT${(i + 1).toString().padStart(6, '0')}`,
        type: i % 5 === 0 ? EncounterType.TELECONSULT : EncounterType.OPD,
        status: isPast ? AppointmentStatus.COMPLETED : AppointmentStatus.SCHEDULED,
        scheduledAt,
        duration: 15,
        reason: ['Follow-up', 'New consultation', 'Routine checkup', 'Symptoms review'][randomInt(0, 3)],
        checkedInAt: isPast ? scheduledAt : null,
        completedAt: isPast ? new Date(scheduledAt.getTime() + 20 * 60 * 1000) : null,
      },
    });
    appointments.push(apt);
  }

  // -----------------------------
  // ENCOUNTERS WITH CLINICAL DATA (25)
  // -----------------------------
  console.log('📝 Creating encounters with clinical data...');
  const encounters = [];

  for (let i = 0; i < 25; i++) {
    const patient = patients[i % patients.length];
    const doctor = doctors[randomInt(0, doctors.length - 1)];
    const isIPD = i < 5;
    const isCompleted = i < 20;

    const encounter = await prisma.encounter.create({
      data: {
        tenantId: tenant.id,
        patientId: patient.id,
        doctorId: doctor.id,
        encounterNo: `ENC${(i + 1).toString().padStart(6, '0')}`,
        type: isIPD ? EncounterType.IPD : EncounterType.OPD,
        status: isCompleted ? EncounterStatus.COMPLETED : EncounterStatus.IN_PROGRESS,
        chiefComplaint: [
          'Fever and body ache',
          'Chest pain',
          'Back pain',
          'Headache and dizziness',
          'Cough and cold',
          'Abdominal pain',
          'Joint pain',
          'Skin rash',
        ][randomInt(0, 7)],
        startedAt: randomDate(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), now),
        endedAt: isCompleted ? now : null,
      },
    });
    encounters.push(encounter);

    // Create vitals for encounter
    await prisma.vital.createMany({
      data: [
        { encounterId: encounter.id, type: VitalType.BP, value: `${randomInt(110, 140)}/${randomInt(70, 90)}`, unit: 'mmHg' },
        { encounterId: encounter.id, type: VitalType.HEART_RATE, value: `${randomInt(60, 100)}`, unit: 'bpm' },
        { encounterId: encounter.id, type: VitalType.TEMP, value: `${(97 + Math.random() * 3).toFixed(1)}`, unit: '°F' },
        { encounterId: encounter.id, type: VitalType.SPO2, value: `${randomInt(95, 100)}`, unit: '%' },
        { encounterId: encounter.id, type: VitalType.WEIGHT, value: `${randomInt(50, 90)}`, unit: 'kg' },
      ],
    });

    // Create clinical notes
    await prisma.clinicalNote.createMany({
      data: [
        { encounterId: encounter.id, noteType: NoteType.SUBJECTIVE, content: 'Patient complains of symptoms for the past 3 days. No significant medical history.', createdBy: doctor.id },
        { encounterId: encounter.id, noteType: NoteType.OBJECTIVE, content: 'On examination, patient appears stable. Vitals within normal limits.', createdBy: doctor.id },
        { encounterId: encounter.id, noteType: NoteType.ASSESSMENT, content: 'Provisional diagnosis made based on clinical presentation.', createdBy: doctor.id },
        { encounterId: encounter.id, noteType: NoteType.PLAN, content: 'Advised medications and follow-up in 1 week. Lab tests ordered if symptoms persist.', createdBy: doctor.id },
      ],
    });

    // Create diagnosis
    await prisma.diagnosis.create({
      data: {
        encounterId: encounter.id,
        icdCode: ['J06.9', 'R50.9', 'M54.5', 'K30', 'R51'][randomInt(0, 4)],
        description: [
          'Acute upper respiratory infection',
          'Fever, unspecified',
          'Low back pain',
          'Functional dyspepsia',
          'Headache',
        ][randomInt(0, 4)],
        isPrimary: true,
      },
    });

    // Create prescriptions
    const medications = [
      { name: 'Paracetamol 500mg', dosage: '1 tablet', frequency: '1-0-1', duration: '5 days' },
      { name: 'Amoxicillin 500mg', dosage: '1 capsule', frequency: '1-1-1', duration: '7 days' },
      { name: 'Omeprazole 20mg', dosage: '1 capsule', frequency: '1-0-0', duration: '14 days' },
      { name: 'Cetirizine 10mg', dosage: '1 tablet', frequency: '0-0-1', duration: '5 days' },
    ];

    for (const med of medications.slice(0, randomInt(1, 3))) {
      await prisma.prescription.create({
        data: {
          encounterId: encounter.id,
          patientId: patient.id,
          prescribedBy: doctor.id,
          medication: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          instructions: 'Take after food',
          isDispensed: isCompleted && Math.random() > 0.3,
        },
      });
    }

    // Create lab orders for some encounters
    if (i % 2 === 0) {
      const labOrder = await prisma.medicalOrder.create({
        data: {
          encounterId: encounter.id,
          orderedBy: doctor.id,
          type: OrderType.LAB,
          status: isCompleted ? OrderStatus.PUBLISHED : OrderStatus.IN_PROGRESS,
          testName: ['Complete Blood Count', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test'][randomInt(0, 3)],
          testCode: `LAB${randomInt(1000, 9999)}`,
          priority: ['ROUTINE', 'URGENT'][randomInt(0, 1)],
        },
      });

      // Create lab report if completed
      if (isCompleted) {
        await prisma.medicalReport.create({
          data: {
            orderId: labOrder.id,
            patientId: patient.id,
            result: {
              hemoglobin: `${(12 + Math.random() * 4).toFixed(1)} g/dL`,
              wbc: `${randomInt(4000, 11000)} /µL`,
              platelets: `${randomInt(150000, 400000)} /µL`,
            },
            findings: 'All parameters within normal limits.',
            impression: 'Normal study',
            verifiedBy: labTechs[randomInt(0, labTechs.length - 1)].id,
            verifiedAt: now,
            publishedAt: now,
            isAbnormal: Math.random() > 0.8,
          },
        });
      }
    }

    // Create IPD admission for IPD encounters
    if (isIPD) {
      const availableBed = await prisma.bed.findFirst({
        where: { status: BedStatus.AVAILABLE },
      });

      if (availableBed) {
        await prisma.admission.create({
          data: {
            encounterId: encounter.id,
            patientId: patient.id,
            bedId: availableBed.id,
            admissionNo: `ADM${(i + 1).toString().padStart(6, '0')}`,
            status: isCompleted ? 'DISCHARGED' : 'ADMITTED',
            admittedAt: encounter.startedAt!,
            expectedDischarge: new Date(encounter.startedAt!.getTime() + 5 * 24 * 60 * 60 * 1000),
            dischargedAt: isCompleted ? now : null,
            attendingDoctorId: doctor.id,
          },
        });

        // Update bed status
        if (!isCompleted) {
          await prisma.bed.update({
            where: { id: availableBed.id },
            data: { status: BedStatus.OCCUPIED },
          });
        }
      }
    }
  }

  // -----------------------------
  // INVOICES & PAYMENTS
  // -----------------------------
  console.log('💰 Creating invoices and payments...');
  for (let i = 0; i < 15; i++) {
    const patient = patients[randomInt(0, patients.length - 1)];
    const isPaid = i < 10;
    const totalAmount = randomInt(500, 10000);

    const invoice = await prisma.invoice.create({
      data: {
        tenantId: tenant.id,
        patientId: patient.id,
        invoiceNo: `INV${(i + 1).toString().padStart(6, '0')}`,
        status: isPaid ? InvoiceStatus.PAID : InvoiceStatus.DUE,
        subtotal: totalAmount,
        tax: totalAmount * 0.05,
        totalAmount: totalAmount * 1.05,
        paidAmount: isPaid ? totalAmount * 1.05 : 0,
        dueAmount: isPaid ? 0 : totalAmount * 1.05,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Create invoice items
    await prisma.invoiceItem.createMany({
      data: [
        { invoiceId: invoice.id, description: 'Consultation Fee', category: 'Consultation', unitPrice: 500, total: 500 },
        { invoiceId: invoice.id, description: 'Lab Tests', category: 'Lab', unitPrice: totalAmount - 500, total: totalAmount - 500 },
      ],
    });

    // Create payment if paid
    if (isPaid) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: totalAmount * 1.05,
          method: [PaymentMethod.CASH, PaymentMethod.CARD, PaymentMethod.UPI][randomInt(0, 2)],
          status: 'SUCCESS',
        },
      });
    }
  }

  // -----------------------------
  // INVENTORY ITEMS
  // -----------------------------
  console.log('📦 Creating inventory items...');
  const inventoryItems = [
    { name: 'Paracetamol 500mg', category: 'Medication', quantity: 500, minStock: 100, costPrice: 2, sellPrice: 5 },
    { name: 'Amoxicillin 500mg', category: 'Medication', quantity: 200, minStock: 50, costPrice: 10, sellPrice: 20 },
    { name: 'Omeprazole 20mg', category: 'Medication', quantity: 150, minStock: 30, costPrice: 5, sellPrice: 12 },
    { name: 'Syringes 5ml', category: 'Supplies', quantity: 1000, minStock: 200, costPrice: 3, sellPrice: 8 },
    { name: 'Surgical Gloves', category: 'Supplies', quantity: 500, minStock: 100, costPrice: 5, sellPrice: 10 },
    { name: 'Bandages', category: 'Supplies', quantity: 300, minStock: 50, costPrice: 10, sellPrice: 25 },
    { name: 'IV Fluid (NS)', category: 'Supplies', quantity: 100, minStock: 20, costPrice: 30, sellPrice: 60 },
    { name: 'Cotton Rolls', category: 'Supplies', quantity: 200, minStock: 40, costPrice: 15, sellPrice: 30 },
    { name: 'Antiseptic Solution', category: 'Supplies', quantity: 50, minStock: 10, costPrice: 50, sellPrice: 100 },
    { name: 'Face Masks', category: 'Supplies', quantity: 25, minStock: 100, costPrice: 5, sellPrice: 10 }, // Low stock alert
  ];

  for (const item of inventoryItems) {
    await prisma.inventoryItem.create({
      data: {
        tenantId: tenant.id,
        name: item.name,
        sku: item.name.replace(/\s+/g, '-').toUpperCase(),
        category: item.category,
        quantity: item.quantity,
        minStock: item.minStock,
        costPrice: item.costPrice,
        sellPrice: item.sellPrice,
        unit: item.category === 'Medication' ? 'Strips' : 'Pcs',
        expiryDate: new Date(now.getTime() + randomInt(30, 365) * 24 * 60 * 60 * 1000),
      },
    });
  }

  // -----------------------------
  // MARKETING CAMPAIGNS
  // -----------------------------
  console.log('📢 Creating marketing campaigns...');
  const campaigns = [
    { name: 'Follow-Up Reminder', channel: CampaignChannel.EMAIL, status: CampaignStatus.ACTIVE },
    { name: 'Health Checkup Promotion', channel: CampaignChannel.SMS, status: CampaignStatus.ACTIVE },
    { name: 'Vaccination Drive', channel: CampaignChannel.PUSH, status: CampaignStatus.SCHEDULED },
    { name: 'Diabetes Awareness', channel: CampaignChannel.IN_APP, status: CampaignStatus.DRAFT },
  ];

  for (const campaign of campaigns) {
    await prisma.campaign.create({
      data: {
        tenantId: tenant.id,
        name: campaign.name,
        channel: campaign.channel,
        status: campaign.status,
        isActive: campaign.status === CampaignStatus.ACTIVE,
        content: {
          subject: `${campaign.name} - HOS Hospital`,
          body: `Dear Patient, ${campaign.name.toLowerCase()} information here.`,
        },
        stats: {
          sent: randomInt(100, 1000),
          delivered: randomInt(80, 950),
          opened: randomInt(50, 500),
          clicked: randomInt(20, 200),
        },
      },
    });
  }

  // -----------------------------
  // ATTENDANCE & SHIFTS
  // -----------------------------
  console.log('⏰ Creating attendance and shifts...');
  const employees = await prisma.employee.findMany();

  for (const emp of employees.slice(0, 10)) {
    // Create attendance for last 7 days
    for (let d = 0; d < 7; d++) {
      const date = new Date(now.getTime() - d * 24 * 60 * 60 * 1000);
      const isPresent = Math.random() > 0.1;

      await prisma.attendance.create({
        data: {
          employeeId: emp.id,
          date,
          checkIn: isPresent ? new Date(date.setHours(9, 0, 0)) : null,
          checkOut: isPresent ? new Date(date.setHours(18, 0, 0)) : null,
          status: isPresent ? 'PRESENT' : 'ABSENT',
          hoursWorked: isPresent ? 9 : 0,
        },
      });
    }

    // Create upcoming shifts
    for (let d = 1; d <= 7; d++) {
      const date = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
      await prisma.shift.create({
        data: {
          employeeId: emp.id,
          shiftType: [ShiftType.MORNING, ShiftType.AFTERNOON, ShiftType.NIGHT][randomInt(0, 2)],
          date,
          startTime: new Date(date.setHours(9, 0, 0)),
          endTime: new Date(date.setHours(18, 0, 0)),
        },
      });
    }
  }

  // -----------------------------
  // NOTIFICATIONS
  // -----------------------------
  console.log('🔔 Creating notifications...');
  const notificationTypes = ['APPOINTMENT', 'LAB_RESULT', 'BILLING', 'SYSTEM'];

  for (const patient of patients.slice(0, 10)) {
    const patientUser = await prisma.user.findUnique({ where: { id: patient.userId! } });
    if (patientUser) {
      await prisma.notification.create({
        data: {
          tenantId: tenant.id,
          userId: patientUser.id,
          title: 'Appointment Reminder',
          message: 'You have an upcoming appointment tomorrow.',
          type: 'APPOINTMENT',
          status: 'SENT',
        },
      });
    }
  }

  // -----------------------------
  // DOMAIN EVENTS (Sample)
  // -----------------------------
  console.log('📡 Creating domain events...');
  const eventTypes = ['PatientRegistered', 'AppointmentBooked', 'EncounterStarted', 'PrescriptionIssued', 'ReportPublished'];

  for (let i = 0; i < 10; i++) {
    await prisma.domainEvent.create({
      data: {
        tenantId: tenant.id,
        actorId: doctors[randomInt(0, doctors.length - 1)].id,
        entityType: 'Encounter',
        entityId: encounters[randomInt(0, encounters.length - 1)].id,
        eventType: eventTypes[randomInt(0, eventTypes.length - 1)],
        payload: { timestamp: now.toISOString(), source: 'seed' },
        status: 'PROCESSED',
        processedAt: now,
      },
    });
  }

  // -----------------------------
  // AI INTERACTIONS (Sample)
  // -----------------------------
  console.log('🤖 Creating AI interactions...');
  for (let i = 0; i < 5; i++) {
    await prisma.aIInteraction.create({
      data: {
        tenantId: tenant.id,
        userId: doctors[randomInt(0, doctors.length - 1)].id,
        role: Role.DOCTOR,
        prompt: 'Summarize the patient clinical history',
        response: 'Based on the available records, the patient has been presenting with recurring symptoms...',
        modelVersion: 'gpt-4-turbo',
        latencyMs: randomInt(500, 2000),
        tokensUsed: randomInt(500, 1500),
      },
    });
  }

  // -----------------------------
  // PATIENT FEEDBACK
  // -----------------------------
  console.log('⭐ Creating patient feedback...');
  for (let i = 0; i < 10; i++) {
    await prisma.feedback.create({
      data: {
        tenantId: tenant.id,
        patientId: patients[randomInt(0, patients.length - 1)].id,
        rating: randomInt(3, 5),
        npsScore: randomInt(7, 10),
        category: ['CONSULTATION', 'LAB', 'PHARMACY', 'GENERAL'][randomInt(0, 3)],
        comment: 'Good experience overall. Staff was helpful.',
      },
    });
  }

  console.log('\n✅ HOS database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Tenant: ${tenant.name}`);
  console.log(`   - Departments: ${departments.length}`);
  console.log(`   - Wards: ${wards.length}`);
  console.log(`   - Staff Users: ${allStaff.length + 1}`);
  console.log(`   - Patients: ${patients.length}`);
  console.log(`   - Appointments: ${appointments.length}`);
  console.log(`   - Encounters: ${encounters.length}`);
  console.log(`   - Inventory Items: ${inventoryItems.length}`);
  console.log(`   - Campaigns: ${campaigns.length}`);
  console.log('\n🔐 Default Login Credentials:');
  console.log('   Super Admin: superadmin@hos.com / Admin@123');
  console.log('   Admin: admin@hos.com / Admin@123');
  console.log('   Doctor: doctor1@hos.com / Doctor@123');
  console.log('   Nurse: nurse1@hos.com / Nurse@123');
  console.log('   Lab Tech: lab1@hos.com / Lab@123');
  console.log('   Pharmacist: pharma1@hos.com / Pharma@123');
  console.log('   HR: hr@hos.com / HR@123');
  console.log('   Marketing: marketing@hos.com / Marketing@123');
  console.log('   Patient: patient1@mail.com / Patient@123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
