import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Insert data for testing
  await prisma.user.upsert({
    where: { email: "user1@example.com" },
    create: {
      email: "user1@example.com",
      name: "User 1"
    },
    update: {
      email: "user1@example.com",
      name: "User 1"
    },
  });
  await prisma.user.upsert({
    where: { email: "user2@example.com" },
    create: {
      email: "user2@example.com",
      name: "User 2"
    },
    update: {
      email: "user2@example.com",
      name: "User 2"
    },
  });
  await prisma.user.upsert({
    where: { email: "user3@example.com" },
    create: {
      email: "user3@example.com",
      name: "User 3"
    },
    update: {
      email: "user3@example.com",
      name: "User 3"
    },
  });
  console.log('There are 3 users in database');

  {
    const where = {
      OR: []
    } satisfies Prisma.UserWhereInput;

    const users = await prisma.user.findMany({
      where
    });
    console.log(users);
    console.assert(users.length === 0, "No records should be returned with a { OR: [] } query");
  }

  {
    const where = {
      AND: [
        {
          email: "user1@example.com"
        },
        {
          OR: []
        }
      ]
    } satisfies Prisma.UserWhereInput;

    const users = await prisma.user.findMany({
      where
    });
    console.log(users);
    // This assertion fails. Buggy
    console.assert(users.length === 0, "Still no records should be returned");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })