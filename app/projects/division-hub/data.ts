import { z } from "zod";

const StaffSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  email: z.email(),
  extension: z.string().regex(/^\d{4}$/),
});

const DepartmentSlugSchema = z.enum(["procurement", "hr", "facilities"]);

const DepartmentSchema = z.object({
  slug: DepartmentSlugSchema,
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  description: z.string().min(1),
  responsibilities: z.array(z.string().min(1)).min(1),
  gradient: z.string().min(1),
  staff: z.array(StaffSchema).length(6),
});

const DepartmentsSchema = z.object({
  procurement: DepartmentSchema,
  hr: DepartmentSchema,
  facilities: DepartmentSchema,
});

export type Staff = z.infer<typeof StaffSchema>;
export type DepartmentSlug = z.infer<typeof DepartmentSlugSchema>;
export type Department = z.infer<typeof DepartmentSchema>;

const rawDepartments = {
  procurement: {
    slug: "procurement",
    name: "Procurement",
    shortDescription:
      "Sourcing, contracts, and vendor relationships across the county.",
    description:
      "The Procurement department manages purchasing, vendor onboarding, and contract compliance for every county program. The team negotiates pricing, runs competitive bids, and keeps spend transparent for public records.",
    responsibilities: [
      "Run public RFPs and competitive solicitations",
      "Onboard and review vendors against compliance criteria",
      "Negotiate and renew master service agreements",
      "Publish quarterly spend dashboards for residents",
    ],
    gradient: "from-indigo-500 to-purple-700",
    staff: [
      { name: "Aisha Khan", role: "Director of Procurement", email: "akhan@example.gov", extension: "1101" },
      { name: "Marcus Reilly", role: "Senior Contracts Officer", email: "mreilly@example.gov", extension: "1108" },
      { name: "Priya Natarajan", role: "Vendor Compliance Lead", email: "pnatarajan@example.gov", extension: "1114" },
      { name: "Diego Alvarez", role: "Procurement Analyst", email: "dalvarez@example.gov", extension: "1122" },
      { name: "Hannah O'Connor", role: "RFP Coordinator", email: "hoconnor@example.gov", extension: "1130" },
      { name: "Tomas Berg", role: "Procurement Operations Specialist", email: "tberg@example.gov", extension: "1141" },
    ],
  },
  hr: {
    slug: "hr",
    name: "Human Resources",
    shortDescription:
      "Hiring, benefits, and workplace policy for county employees.",
    description:
      "Human Resources supports recruiting, onboarding, benefits, and employee relations across the county. The team partners with each division on workforce planning and policy guidance.",
    responsibilities: [
      "Lead recruiting, posting, and structured interview programs",
      "Administer health, retirement, and leave benefits",
      "Mediate workplace concerns and conduct investigations",
      "Maintain compliance with state and federal labor regulations",
    ],
    gradient: "from-emerald-500 to-teal-700",
    staff: [
      { name: "Renée Bassi", role: "Chief People Officer", email: "rbassi@example.gov", extension: "2101" },
      { name: "Samuel Yoon", role: "Recruiting Manager", email: "syoon@example.gov", extension: "2107" },
      { name: "Layla Hossain", role: "Benefits Administrator", email: "lhossain@example.gov", extension: "2115" },
      { name: "Owen McCarthy", role: "Employee Relations Specialist", email: "omccarthy@example.gov", extension: "2123" },
      { name: "Bea Sandoval", role: "HR Business Partner", email: "bsandoval@example.gov", extension: "2129" },
      { name: "Jordan Pham", role: "People Operations Analyst", email: "jpham@example.gov", extension: "2138" },
    ],
  },
  facilities: {
    slug: "facilities",
    name: "Facilities",
    shortDescription:
      "Buildings, maintenance, and physical infrastructure for the county.",
    description:
      "Facilities keeps every county building safe, accessible, and operational. The team handles maintenance, capital projects, energy efficiency, and emergency response for physical infrastructure.",
    responsibilities: [
      "Schedule preventive maintenance for county buildings",
      "Coordinate capital improvement and renovation projects",
      "Track energy use and reduce operating costs",
      "Respond to building emergencies and safety concerns",
    ],
    gradient: "from-rose-500 to-orange-600",
    staff: [
      { name: "Eleanor Park", role: "Director of Facilities", email: "epark@example.gov", extension: "3101" },
      { name: "Rashid Mensah", role: "Facilities Operations Manager", email: "rmensah@example.gov", extension: "3109" },
      { name: "Catalina Ruiz", role: "Capital Projects Lead", email: "cruiz@example.gov", extension: "3117" },
      { name: "Yuki Tanaka", role: "Energy and Sustainability Analyst", email: "ytanaka@example.gov", extension: "3124" },
      { name: "Brendan Walsh", role: "Maintenance Supervisor", email: "bwalsh@example.gov", extension: "3132" },
      { name: "Nadia Petrov", role: "Building Safety Coordinator", email: "npetrov@example.gov", extension: "3140" },
    ],
  },
};

export const departments = DepartmentsSchema.parse(rawDepartments);

export const departmentList: Department[] = [
  departments.procurement,
  departments.hr,
  departments.facilities,
];

export const allStaff: ReadonlyArray<Staff & { departmentSlug: DepartmentSlug; departmentName: string }> =
  departmentList.flatMap((dept) =>
    dept.staff.map((s) => ({
      ...s,
      departmentSlug: dept.slug,
      departmentName: dept.name,
    }))
  );
