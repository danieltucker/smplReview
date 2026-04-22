import { PrismaClient, RatingStyle, TestimonialStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  await prisma.testimonial.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.embedToken.deleteMany();
  await prisma.widgetConfig.deleteMany();
  await prisma.reviewSite.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const org = await prisma.organization.create({
    data: {
      clerkOrgId: "org_seed_placeholder",
      name: "Acme Auto Shop",
      widgetConfig: {
        create: {
          ratingFloor: 4,
          ratingStyle: RatingStyle.BUTTONS,
          hideOnBadPrerating: true,
        },
      },
      reviewSites: {
        createMany: {
          data: [
            {
              name: "Google Business",
              url: "https://g.page/r/your-google-review-link",
              weight: 3,
              isActive: true,
            },
            {
              name: "Yelp",
              url: "https://www.yelp.com/biz/your-business",
              weight: 1,
              isActive: true,
            },
          ],
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      clerkUserId: "user_seed_placeholder",
      organizationId: org.id,
      role: "admin",
    },
  });

  const token = await prisma.embedToken.create({
    data: {
      organizationId: org.id,
      label: "Main Website",
    },
  });

  await prisma.submission.create({
    data: {
      organizationId: org.id,
      embedTokenId: token.id,
      rating: 2,
      message: "The wait time was longer than expected.",
      submitterName: "Jane D.",
    },
  });

  await prisma.testimonial.createMany({
    data: [
      {
        organizationId: org.id,
        embedTokenId: token.id,
        submitterName: "Mike R.",
        body: "Best service in town. They had my car ready same day!",
        rating: 5,
        status: TestimonialStatus.PUBLISHED,
      },
      {
        organizationId: org.id,
        embedTokenId: token.id,
        submitterName: "Sarah T.",
        body: "Very professional and honest with pricing. Will be back.",
        rating: 5,
        status: TestimonialStatus.PENDING,
      },
    ],
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
