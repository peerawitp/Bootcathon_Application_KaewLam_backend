const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const brands = [
    {
      name: "Mercedes-Benz",
      models: [
        {
          model: "C-Class",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V5W30",
        },
        {
          model: "E-Class",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V5W30",
        },
        { model: "GLE", year: 2022, carType: "SUV", oilViscosity: "V5W30" },
        {
          model: "A-Class",
          year: 2022,
          carType: "HATCHBACK",
          oilViscosity: "V5W30",
        },
        {
          model: "S-Class",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V5W30",
        },
      ],
    },
    {
      name: "BMW",
      models: [
        {
          model: "3 Series",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V5W30",
        },
        { model: "X5", year: 2022, carType: "SUV", oilViscosity: "V5W30" },
        {
          model: "1 Series",
          year: 2022,
          carType: "HATCHBACK",
          oilViscosity: "V5W30",
        },
        {
          model: "5 Series",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V5W30",
        },
        { model: "X3", year: 2022, carType: "SUV", oilViscosity: "V5W30" },
      ],
    },
    {
      name: "Toyota",
      models: [
        {
          model: "Corolla",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W30",
        },
        {
          model: "Camry",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W30",
        },
        { model: "RAV4", year: 2022, carType: "SUV", oilViscosity: "V10W30" },
        {
          model: "Prius",
          year: 2022,
          carType: "HATCHBACK",
          oilViscosity: "V10W30",
        },
        {
          model: "Highlander",
          year: 2022,
          carType: "SUV",
          oilViscosity: "V10W30",
        },
      ],
    },
    {
      name: "Honda",
      models: [
        {
          model: "Civic",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W30",
        },
        {
          model: "Accord",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W30",
        },
        { model: "CR-V", year: 2022, carType: "SUV", oilViscosity: "V10W30" },
        {
          model: "Fit",
          year: 2022,
          carType: "HATCHBACK",
          oilViscosity: "V10W30",
        },
        { model: "Pilot", year: 2022, carType: "SUV", oilViscosity: "V10W30" },
      ],
    },
    {
      name: "Ford",
      models: [
        {
          model: "Focus",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W40",
        },
        {
          model: "Explorer",
          year: 2022,
          carType: "SUV",
          oilViscosity: "V10W40",
        },
        { model: "Escape", year: 2022, carType: "SUV", oilViscosity: "V10W40" },
        {
          model: "Mustang",
          year: 2022,
          carType: "SEDAN",
          oilViscosity: "V10W40",
        },
        {
          model: "F-150",
          year: 2022,
          carType: "PICKUP_TRUCK",
          oilViscosity: "V10W40",
        },
      ],
    },
  ];

  for (const brand of brands) {
    const createdBrand = await prisma.carBrand.create({
      data: {
        name: brand.name,
      },
    });

    for (const model of brand.models) {
      await prisma.carModel.create({
        data: {
          model: model.model,
          year: model.year,
          carType: model.carType,
          oilViscosity: model.oilViscosity,
          brandName: createdBrand.name,
        },
      });
    }
  }

  console.log("Seeding completed!");
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
