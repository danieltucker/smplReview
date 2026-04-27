import { requireOrganization } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TestimonialsList } from "./testimonials-list";

export default async function TestimonialsPage() {
  const org = await requireOrganization();

  const [pending, published, rejected] = await Promise.all([
    prisma.testimonial.findMany({ where: { organizationId: org.id, status: "PENDING" }, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ where: { organizationId: org.id, status: "PUBLISHED" }, orderBy: { createdAt: "desc" } }),
    prisma.testimonial.findMany({ where: { organizationId: org.id, status: "REJECTED" }, orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">Testimonials</h1>
      <TestimonialsList pending={pending} published={published} rejected={rejected} />
    </div>
  );
}
