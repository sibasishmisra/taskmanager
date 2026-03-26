import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const EMAIL = "sibasish@bookingjini.com";
const PASSWORD = "Winner@123";

const tasks = [
  {
    title: "Write the new company vision statement",
    description: "Define the shift from software company to hotel performance and outcome company in one clear page.",
    priority: "URGENT",
  },
  {
    title: "Finalize the new positioning line",
    description: 'Lock one external-facing statement such as "We don\'t sell software. We drive hotel performance."',
    priority: "URGENT",
  },
  {
    title: "Create a one-page strategic shift note",
    description: "Summarize old mindset vs new mindset for internal circulation across teams.",
    priority: "HIGH",
  },
  {
    title: "List the top customer outcomes we want to own",
    description: "Define the core business outcomes: revenue growth, occupancy, direct bookings, cost reduction, automation, and decision quality.",
    priority: "HIGH",
  },
  {
    title: "Map all current products/features to outcomes",
    description: "Translate existing modules like booking engine, channel manager, CRM, PMS into measurable customer outcomes.",
    priority: "HIGH",
  },
  {
    title: "Define the Daily Decision Engine framework",
    description: "Write what the system should tell the customer every day: what is leaking, what action is needed, what can be automated.",
    priority: "HIGH",
  },
  {
    title: "Identify the top 10 daily hotel problems",
    description: "Capture the most frequent pain points hotels face that our product must solve proactively.",
    priority: "HIGH",
  },
  {
    title: "Prepare a product gap analysis",
    description: "List what is missing today in product, automation, AI, reporting, and actionability.",
    priority: "HIGH",
  },
  {
    title: "Draft the 30-day MVP roadmap",
    description: "Decide what can be shipped fast to reflect the new outcome-first vision.",
    priority: "URGENT",
  },
  {
    title: "Prepare the 60-day execution roadmap",
    description: "Build the next layer after MVP with clear milestones, dependencies, and priorities.",
    priority: "HIGH",
  },
  {
    title: "Create a build vs integrate matrix",
    description: "Decide which capabilities should be built in-house and which should be solved via white-label tools, APIs, or integrations.",
    priority: "MEDIUM",
  },
  {
    title: "Identify white-label and third-party tools",
    description: "Shortlist external solutions for voice, workflow automation, intelligence, reporting, and AI support.",
    priority: "MEDIUM",
  },
  {
    title: "Rewrite the pitch deck narrative",
    description: "Move the sales story from modules and features to ROI, business outcomes, and hotel performance.",
    priority: "URGENT",
  },
  {
    title: "Rewrite the website headline and key messaging",
    description: "Make the website communicate growth engine, performance engine, and autonomous hotel operations.",
    priority: "HIGH",
  },
  {
    title: "Rewrite the sales opening script",
    description: "Ensure the sales team starts with customer pain, business result, and ROI instead of feature listing.",
    priority: "HIGH",
  },
  {
    title: "Prepare 3–5 outcome-led case studies",
    description: "Convert customer success stories into proof points around revenue increase, direct booking uplift, automation, or efficiency.",
    priority: "MEDIUM",
  },
  {
    title: "Create an internal AI-first usage charter",
    description: "Define how each team should use AI daily in sales, ops, product, marketing, and engineering.",
    priority: "MEDIUM",
  },
  {
    title: "Run a leadership alignment meeting and record decisions",
    description: "Close open debates on vision, messaging, outcomes, and priorities so there is one direction.",
    priority: "URGENT",
  },
  {
    title: "Assign owners for each transformation stream",
    description: "Allocate ownership across vision, product reframing, sales shift, integration roadmap, and launch readiness.",
    priority: "HIGH",
  },
  {
    title: "Create the launch readiness checklist",
    description: "Prepare the final checklist covering messaging, roadmap, team alignment, training, beta plan, and rollout timeline.",
    priority: "HIGH",
  },
];

async function main() {
  // Upsert user
  let user = await prisma.user.findUnique({ where: { email: EMAIL } });

  if (!user) {
    const hashed = await bcrypt.hash(PASSWORD, 12);
    user = await prisma.user.create({
      data: { name: "Sibasish Mishra", email: EMAIL, password: hashed },
    });
    console.log(`Created user: ${user.email} (${user.id})`);
  } else {
    console.log(`User already exists: ${user.email} (${user.id})`);
  }

  // Create all 20 tasks
  let created = 0;
  for (const task of tasks) {
    await prisma.task.create({
      data: {
        title: task.title,
        description: task.description,
        status: "TODO",
        priority: task.priority,
        userId: user.id,
        tags: "",
      },
    });
    created++;
    console.log(`  [${created}/20] ${task.title}`);
  }

  console.log(`\nDone. ${created} tasks created for ${EMAIL}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
