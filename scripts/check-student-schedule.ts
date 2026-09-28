import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_0vBsYnaSTM4R@ep-dark-bonus-b4h2tg8o-pooler.c-6.us-east-2.aws.neon.tech/sigce-db?sslmode=require&schema=public',
    },
  },
});

async function check() {
  const courseId = 'bbbaf40f-2e0d-44b9-8fe3-059e4ed5d5ae';
  const schedules = await prisma.classSchedule.findMany({
    where: { courseId },
    include: { subject: true, teacher: true },
  });
  console.log(`Horarios configurados para 5º de Primaria: ${schedules.length}`);
  schedules.forEach((s) => {
    console.log(`- ${s.dayOfWeek} P${s.periodIndex} (${s.startTime}-${s.endTime}): ${s.subject.name} - Prof. ${s.teacher?.firstName} ${s.teacher?.lastName}`);
  });
}

check().finally(() => prisma.$disconnect());
