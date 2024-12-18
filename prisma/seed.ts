import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // First clear existing data
  await prisma.visitRequest.deleteMany({});
  await prisma.catProfile.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.waitlist.deleteMany({});

  // Create Cat Owners
  const owner1 = await prisma.user.create({
    data: {
      email: 'sarah.chen@example.com',
      name: 'Sarah Chen',
      userType: 'CAT_OWNER',
      location: 'Berkeley, CA',
      bio: 'Cat enthusiast with two lovely Persian cats. Looking for gentle visitors who appreciate calm environments.',
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'james.wilson@example.com',
      name: 'James Wilson',
      userType: 'CAT_OWNER',
      location: 'Oakland, CA',
      bio: 'Professional photographer with a playful Maine Coon. Home most weekends.',
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      email: 'maria.garcia@example.com',
      name: 'Maria Garcia',
      userType: 'CAT_OWNER',
      location: 'San Francisco, CA',
      bio: 'Veterinary student with three rescue cats. Great opportunity to learn about different cat personalities!',
    },
  });

  // Create Cat Lovers
  const lover1 = await prisma.user.create({
    data: {
      email: 'david.kim@example.com',
      name: 'David Kim',
      userType: 'CAT_LOVER',
      location: 'Berkeley, CA',
      bio: 'Graduate student missing my family cats. Experienced with both shy and outgoing cats.',
    },
  });

  const lover2 = await prisma.user.create({
    data: {
      email: 'emma.thompson@example.com',
      name: 'Emma Thompson',
      userType: 'CAT_LOVER',
      location: 'San Francisco, CA',
      bio: 'Remote worker seeking feline companionship. Can provide references from previous cat sitting.',
    },
  });

  // Create Cat Profiles
  const cat1 = await prisma.catProfile.create({
    data: {
      name: 'Luna',
      age: 4,
      description: 'Gentle Persian cat who loves quiet afternoons and gentle pets. Particularly enjoys being brushed.',
      available: true,
      ownerId: owner1.id,
    },
  });

  const cat2 = await prisma.catProfile.create({
    data: {
      name: 'Milo',
      age: 3,
      description: 'Energetic Maine Coon who enjoys interactive play. Knows several tricks and loves treats!',
      available: true,
      ownerId: owner2.id,
    },
  });

  const cat3 = await prisma.catProfile.create({
    data: {
      name: 'Shadow',
      age: 2,
      description: 'Shy black cat who warms up quickly. Loves string toys and window watching.',
      available: true,
      ownerId: owner3.id,
    },
  });

  const cat4 = await prisma.catProfile.create({
    data: {
      name: 'Bella',
      age: 5,
      description: 'Friendly Siamese who loves attention. Very vocal and enjoys being the center of attention.',
      available: true,
      ownerId: owner3.id,
    },
  });

  // Create Visit Requests
  await prisma.visitRequest.create({
    data: {
      catId: cat1.id,
      visitorId: lover1.id,
      ownerId: owner1.id,
      status: 'PENDING',
      startTime: new Date('2024-12-20T14:00:00Z'),
      endTime: new Date('2024-12-20T16:00:00Z'),
      message: 'Would love to meet Luna! I have experience with Persian cats and always bring a brush.',
    },
  });

  await prisma.visitRequest.create({
    data: {
      catId: cat2.id,
      visitorId: lover2.id,
      ownerId: owner2.id,
      status: 'APPROVED',
      startTime: new Date('2024-12-21T15:00:00Z'),
      endTime: new Date('2024-12-21T17:00:00Z'),
      message: 'Excited to meet Milo! I have lots of experience with active cats.',
    },
  });

  // Create Waitlist Entries
  await prisma.waitlist.create({
    data: {
      email: 'alex.murphy@example.com',
      userType: 'CAT_LOVER',
      signupDate: new Date('2024-12-15'),
    },
  });

  await prisma.waitlist.create({
    data: {
      email: 'sofia.patel@example.com',
      userType: 'CAT_OWNER',
      signupDate: new Date('2024-12-16'),
    },
  });

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });