import type { Trainer, Center, Testimonial, PlacementStory, Faq } from "@/lib/types";
import { slugify } from "@/lib/utils";

export const trainers: Trainer[] = [
  {
    name: "Arvind Menon",
    slug: "arvind-menon",
    role: "Lead Trainer — Full Stack & Frontend",
    bio: "Former senior engineer at Flipkart with a decade of experience shipping large-scale React and Node.js applications. Has mentored hundreds of students into their first developer roles.",
    expertise: ["React", "Next.js", "Node.js", "TypeScript", "System Design"],
    experienceYears: 12,
    linkedin: "https://www.linkedin.com/in/arvind-menon-axcvia",
  },
  {
    name: "Priya Raghavan",
    slug: "priya-raghavan",
    role: "Lead Trainer — Data Science & Python",
    bio: "Data scientist with experience at Mu Sigma and a fintech startup, specializing in applied machine learning and analytics. Loves making statistics click for beginners.",
    expertise: ["Python", "Machine Learning", "Pandas", "SQL", "Deep Learning"],
    experienceYears: 10,
    linkedin: "https://www.linkedin.com/in/priya-raghavan-axcvia",
  },
  {
    name: "Suresh Iyer",
    slug: "suresh-iyer",
    role: "Senior Trainer — Java & Spring",
    bio: "Enterprise Java architect who spent 14 years across Infosys and Oracle building banking-grade systems. Known for rigorous, fundamentals-first teaching.",
    expertise: ["Core Java", "Spring Boot", "Microservices", "SQL", "System Design"],
    experienceYears: 14,
    linkedin: "https://www.linkedin.com/in/suresh-iyer-axcvia",
  },
  {
    name: "Kavitha Nair",
    slug: "kavitha-nair",
    role: "Senior Trainer — Testing & QA",
    bio: "QA lead with deep automation experience across Selenium, API testing, and CI pipelines. Passionate about turning beginners into confident QA engineers.",
    expertise: ["Manual Testing", "Selenium", "TestNG", "REST Assured", "Jenkins"],
    experienceYears: 11,
    linkedin: "https://www.linkedin.com/in/kavitha-nair-axcvia",
  },
  {
    name: "Rahul Deshpande",
    slug: "rahul-deshpande",
    role: "Trainer — DevOps, Cloud & Mobile",
    bio: "AWS-certified DevOps engineer and React Native developer who has run infrastructure for high-traffic consumer apps. Teaches with live production-style labs.",
    expertise: ["AWS", "Docker", "Kubernetes", "Terraform", "React Native"],
    experienceYears: 9,
    linkedin: "https://www.linkedin.com/in/rahul-deshpande-axcvia",
  },
  {
    name: "Meera Krishnan",
    slug: "meera-krishnan",
    role: "Career Coach & Placement Head",
    bio: "Former tech recruiter turned career coach. Runs Axcvia's interview preparation, resume clinics, and hiring-partner relationships.",
    expertise: ["Interview Prep", "Resume Building", "Soft Skills", "Hiring Partnerships"],
    experienceYears: 13,
    linkedin: "https://www.linkedin.com/in/meera-krishnan-axcvia",
  },
];

export function getTrainer(slug: string) {
  return trainers.find((t) => t.slug === slug);
}

export const centers: Center[] = [
  {
    name: "Axcvia BTM Layout (Head Office)",
    city: "Bengaluru",
    address: "3rd Floor, Tech Park Tower, 100 Feet Ring Road, BTM Layout, Bengaluru 560076",
    phone: "+91 98765 43210",
    hours: "Mon–Sat, 9:00 AM – 8:00 PM",
    mapUrl: "https://maps.google.com/?q=BTM+Layout+Bengaluru",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Axcvia Rajajinagar",
    city: "Bengaluru",
    address: "2nd Floor, Chord Road Plaza, Rajajinagar, Bengaluru 560010",
    phone: "+91 98765 43211",
    hours: "Mon–Sat, 9:00 AM – 8:00 PM",
    mapUrl: "https://maps.google.com/?q=Rajajinagar+Bengaluru",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=70",
  },
  {
    name: "Axcvia Hyderabad",
    city: "Hyderabad",
    address: "4th Floor, Cyber Heights, Ameerpet, Hyderabad 500016",
    phone: "+91 98765 43212",
    hours: "Mon–Sat, 9:00 AM – 8:00 PM",
    mapUrl: "https://maps.google.com/?q=Ameerpet+Hyderabad",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=900&q=70",
  },
];

const testimonialSeed: Omit<Testimonial, "slug">[] = [
  {
    studentName: "Sneha Patil",
    courseSlug: "full-stack-web-development",
    courseTitle: "Full Stack Web Development",
    role: "Software Engineer",
    company: "Freshworks",
    rating: 5,
    title: "From zero code to software engineer",
    avatar: "https://images.unsplash.com/photo-1728141123512-87c415cecc9d?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "I came from a non-CS background and had never written a line of code. The project-first teaching style and mock interviews made all the difference — I got placed within a month of finishing.",
  },
  {
    studentName: "Mohammed Faizal",
    courseSlug: "java-backend-development",
    courseTitle: "Java Backend Development",
    role: "Associate Engineer",
    company: "Infosys",
    rating: 5,
    title: "The best Java classes I have attended",
    avatar: "https://images.unsplash.com/photo-1778692258270-bc0e80e975c0?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "Suresh sir's Java classes are the best I've attended anywhere. Concepts are drilled with practice problems daily, and the placement team kept scheduling interviews until I cracked one.",
  },
  {
    studentName: "Ananya Sharma",
    courseSlug: "data-science-with-python",
    courseTitle: "Data Science with Python",
    role: "Data Analyst",
    company: "Flipkart",
    rating: 5,
    title: "The capstone carried my interviews",
    avatar: "https://images.unsplash.com/photo-1617009762269-c062aaf6b3a0?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "The capstone on a real e-commerce dataset became the centerpiece of my interviews. Practical, current, and genuinely supportive trainers.",
  },
  {
    studentName: "Vignesh R",
    courseSlug: "software-testing-automation",
    courseTitle: "Software Testing (Manual + Automation)",
    role: "QA Engineer",
    company: "Zoho",
    rating: 4,
    title: "Support job to QA automation",
    avatar: "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "Went from a support job to QA automation in four months. The Selenium framework we built in class is exactly what companies ask about.",
  },
  {
    studentName: "Divya Menon",
    courseSlug: "frontend-development-react",
    courseTitle: "Frontend Development with React",
    role: "Frontend Developer",
    company: "Razorpay",
    rating: 5,
    title: "Depth that tutorials never reach",
    avatar: "https://images.unsplash.com/photo-1592621385612-4d7129426394?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "Loved the depth — server components, performance, accessibility. This is not a tutorial-level course; it's how real teams build UIs.",
  },
  {
    studentName: "Karthik Reddy",
    courseSlug: "devops-cloud-engineering-aws",
    courseTitle: "DevOps & Cloud Engineering (AWS)",
    role: "DevOps Engineer",
    company: "Mindtree",
    rating: 5,
    title: "Real AWS labs, real confidence",
    avatar: "https://images.unsplash.com/photo-1649433658557-54cf58577c68?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "Every concept came with a live lab on real AWS infrastructure. I cleared my AWS certification two weeks after the course ended.",
  },
  {
    studentName: "Rohit Kulkarni",
    courseSlug: "cpp-programming-dsa",
    courseTitle: "C++ Programming & Data Structures",
    role: "Final-year student",
    company: "RV College",
    rating: 5,
    title: "DSA finally makes sense",
    avatar: "https://images.unsplash.com/photo-1594489005731-5f1e09b71d00?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "I'd tried three online DSA courses before this. Solving problems live with a mentor who explains the pattern, not just the answer, changed everything for me.",
  },
  {
    studentName: "Nikita Rao",
    courseSlug: "ai-machine-learning-engineering",
    courseTitle: "AI & Machine Learning Engineering",
    role: "Software Developer",
    company: "a Bengaluru startup",
    rating: 5,
    title: "Built and shipped a real AI product",
    avatar: "https://images.unsplash.com/photo-1741354035032-eff737bfd35c?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "The GenAI modules are genuinely current — RAG, embeddings, agents. My capstone chatbot is live in production at my company today.",
  },
  {
    studentName: "Arjun Pillai",
    courseSlug: "full-stack-web-development",
    courseTitle: "Full Stack Web Development",
    role: "Junior Developer",
    company: "Cognizant",
    rating: 4,
    title: "Small batch, big difference",
    avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=facearea&facepad=2.5&w=200&h=200&q=70",
    text: "Fifteen people in a batch means your code actually gets reviewed. The mock interview feedback was brutal and exactly what I needed.",
  },
];

const placementSeed: Omit<PlacementStory, "slug">[] = [
  { studentName: "Sneha Patil", background: "B.Com graduate", company: "Freshworks", role: "Software Engineer", packageLpa: 6.5, year: 2026, courseTitle: "Full Stack Web Development" },
  { studentName: "Mohammed Faizal", background: "Mechanical Engineer", company: "Infosys", role: "Associate Engineer", packageLpa: 5.2, year: 2026, courseTitle: "Java Backend Development" },
  { studentName: "Ananya Sharma", background: "B.Sc Mathematics", company: "Flipkart", role: "Data Analyst", packageLpa: 7.2, year: 2026, courseTitle: "Data Science with Python" },
  { studentName: "Vignesh R", background: "BCA graduate", company: "Zoho", role: "QA Engineer", packageLpa: 4.8, year: 2026, courseTitle: "Software Testing" },
  { studentName: "Divya Menon", background: "Career switcher (design)", company: "Razorpay", role: "Frontend Developer", packageLpa: 8.5, year: 2026, courseTitle: "Frontend with React" },
  { studentName: "Karthik Reddy", background: "IT support, 3 yrs", company: "Mindtree", role: "DevOps Engineer", packageLpa: 7.8, year: 2026, courseTitle: "DevOps & Cloud (AWS)" },
];

const faqSeed: Omit<Faq, "slug">[] = [
  {
    question: "Do I need a computer science background to join?",
    answer:
      "No. Most of our beginner tracks — Full Stack, Java, Testing, and Data Science — start from absolute basics. Most of our students come from non-CS backgrounds.",
    category: "General",
  },
  {
    question: "What formats do you offer — live online or self-paced?",
    answer:
      "Both. Live-online instructor-led batches over video with real-time doubt clearing, and self-paced recorded courses with weekly doubt-clearing sessions. We're online-first for now — classroom centers are on our roadmap.",
    category: "Courses",
  },
  {
    question: "How does placement assistance work?",
    answer:
      "After you complete the course and clear our internal assessments, our placement team schedules interviews with hiring partners, runs mock interviews, and polishes your resume. Support continues until you're placed — there's no fixed cap on interview opportunities.",
    category: "Placements",
  },
  {
    question: "Can I pay the fee in installments?",
    answer:
      "Yes. Most courses support 2–3 interest-free installments. EMI options via major credit cards and select finance partners are also available at checkout.",
    category: "Payments",
  },
  {
    question: "Will I get a certificate?",
    answer:
      "Yes. You receive an Axcvia course completion certificate after finishing the curriculum and capstone project, which you can add to LinkedIn and your resume.",
    category: "Courses",
  },
  {
    question: "What if I miss a class?",
    answer:
      "Every live session is recorded and available in your student dashboard. You can also attend the same topic in a parallel batch, subject to availability.",
    category: "Courses",
  },
  {
    question: "Do you offer a demo class before enrolling?",
    answer:
      "Yes — book a free demo through any enquiry form on the site. You can attend one full session of the actual batch before deciding.",
    category: "General",
  },
  {
    question: "Is there a refund policy?",
    answer:
      "You can cancel within 7 days of batch start for a full refund minus a small processing fee, provided less than 20% of the course has been delivered. See our Refund Policy page for details.",
    category: "Payments",
  },
];

// Seed entries get deterministic slugs so dashboard edits can override them.
export const testimonials: Testimonial[] = testimonialSeed.map((t) => ({
  ...t,
  slug: slugify(`${t.studentName}-${t.company}`),
}));

export const placementStories: PlacementStory[] = placementSeed.map((p) => ({
  ...p,
  slug: slugify(`${p.studentName}-${p.company}`),
}));

export const faqs: Faq[] = faqSeed.map((f) => ({ ...f, slug: slugify(f.question) }));
