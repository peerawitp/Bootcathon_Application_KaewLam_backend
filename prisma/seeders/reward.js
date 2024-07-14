const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const fs = require("fs");

function randomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const data = JSON.parse(
  fs.readFileSync("prisma/seeders/data/rewardData.json", "utf-8"),
);

const rewardTypesMap = {
  "food-restaurant": "FOOD_BEV",
  "food-delivery": "FOOD_DELIVERY",
};

async function main() {
  for (const parent of data) {
    const rewardType = rewardTypesMap[parent.slug];

    for (const content of parent.contents) {
      await prisma.reward.create({
        data: {
          rewardType: rewardType,
          rewardName: content.name,
          rewardDesc:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed dictum ut lacus non auctor. Duis scelerisque est sapien, eget euismod lectus porttitor pharetra. Mauris vestibulum vel nibh eget commodo. Mauris orci metus, condimentum eu elit vitae, dignissim dictum tortor. Vestibulum sit amet orci dolor. Morbi tristique hendrerit libero. Maecenas sollicitudin, purus id tempus tincidunt, turpis felis mollis sapien, ut rhoncus ex dui gravida nulla. Sed sed bibendum tortor. Fusce fermentum auctor ultricies. Donec venenatis ultricies suscipit. Aliquam non ex et libero lobortis consectetur quis vitae purus. In interdum quam non nibh mollis, id imperdiet arcu finibus. Sed dignissim, quam sit amet accumsan efficitur, quam nibh finibus tellus, quis fringilla turpis dui sed augue. Pellentesque sed dui a ligula laoreet mattis et at libero. Sed eget orci consequat odio maximus fringilla sit amet eget elit. Integer porttitor consectetur euismod. Sed at viverra nisl. Suspendisse mi arcu, semper vitae nulla ut, ornare varius nisl. Proin lacinia, erat vitae dapibus consectetur, lacus mauris maximus nunc, vel eleifend leo turpis non erat. Aliquam viverra urna id pellentesque suscipit. Etiam ullamcorper, elit at tincidunt congue, ipsum leo sagittis eros, rhoncus feugiat erat urna at ex.",
          rewardValue: content.point,
          imageLink: content.image,
          like: 0,
          RewardInstance: {
            create: [
              {
                code: randomString(12),
                createdAt: new Date(content.created_at),
                updatedAt: new Date(content.updated_at),
              },
            ],
          },
        },
      });
    }
  }

  console.log("Seeding RewardData completed!");
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
