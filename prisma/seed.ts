import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const peserta = await prisma.user.create({
    data: {
      email: 'peserta1@example.com',
      name: 'Peserta 1',
      password: hashedPassword,
      role: 'PESERTA',
    }
  })
  console.log('Peserta 1 created')

  const pengajar = await prisma.user.create({
    data: {
      email: 'pengajar1@example.com',
      name: 'Pengajar 1',
      password: hashedPassword,
      role: 'PENGAJAR',
    }
  })
  console.log('Pengajar 1 created')

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })
  console.log('Admin created')

  await prisma.user.create({
    data: {
      email: 'admin1@example.com',
      name: 'admin 1',
      password: hashedPassword,
      role: 'ADMIN',
    }
  })

  // Buat 1 jadwal absensi oleh admin
  const jadwal = await prisma.jadwalAbsensi.create({
    data: {
      title: 'Pertemuan 1',
      description: 'Pertemuan pertama untuk pelatihan dasar',
      tanggal: new Date(),
      createdBy: admin.id,
    }
  })
  console.log('Jadwal absensi created')

  // Tambahkan entri absensi untuk peserta
  await prisma.absensi.create({
    data: {
      userId: peserta.id,
      jadwalId: jadwal.id,
      status: 'HADIR',
      createdBy: admin.id,
      updatedBy: admin.id
    }
  })
  console.log('Absensi untuk peserta1 ditambahkan')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
