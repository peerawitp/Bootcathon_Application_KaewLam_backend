const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

async function main() {
  const data = JSON.parse(
    fs.readFileSync("prisma/seeders/data/mobilOneCenterLocation.json", "utf-8"),
  );

  for (const location of data.Locations) {
    if (!location.HoursOfOperation24[0]) {
      continue;
    }
    const [openingHours, closingHours] =
      location.HoursOfOperation24[0].hours.split(" - ");

    const [openingHour, openingMinute] = openingHours.split(":").map(Number);
    const [closingHour, closingMinute] = closingHours.split(":").map(Number);

    const openingTime = openingHour * 60 + openingMinute;
    const closingTime = closingHour * 60 + closingMinute;

    await prisma.mobilCenter.create({
      data: {
        lineUid: null,
        name: location.DisplayName,
        address: `${location.AddressLine1}, ${location.AddressLine2}, ${location.City}, ${location.StateProvince}, ${location.PostalCode}`,
        latitude: location.Latitude,
        longitude: location.Longitude,
        openingTime: openingTime,
        closingTime: closingTime,
      },
    });
  }

  console.log("Seeding MobilCenters completed!");
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
