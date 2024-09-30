const prisma = require("../prismaClient");

async function main() {
  await prisma.admin.create({
    data: {
      username: "admin",
      email: "admin@gmail.com",
      password: "hashedpassword",
    },
  });

  console.log("Database seeded.");
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
