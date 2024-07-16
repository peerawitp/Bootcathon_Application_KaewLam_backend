const fs = require("fs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(
    fs.readFileSync("prisma/seeders/data/productData.json", "utf-8"),
  );

  for (const product of data) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log("Seeding completed.");
  process.exit(0);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
