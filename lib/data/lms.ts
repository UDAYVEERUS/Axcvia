import type { Bundle, Coupon, LandingPage, Quiz } from "@/lib/types";

// Seed content for the LMS features. Everything here can be overridden or
// extended from the admin dashboard (merged by slug, like courses).

export const quizzes: Quiz[] = [
  {
    slug: "java-fundamentals-sample-test",
    title: "Java Fundamentals — Free Sample Test",
    description:
      "A 10-question sample from our Java Backend mock test series. Try it free to see the format, timing and instant results you get with the full series.",
    courseSlug: "java-backend-development",
    durationMinutes: 10,
    passingPercent: 60,
    isFreeSample: true,
    shuffle: true,
    questions: [
      { text: "Which keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], correctIndex: 1, explanation: "`extends` is used for class inheritance; `implements` is for interfaces." },
      { text: "What is the default value of an int field in a Java class?", options: ["null", "0", "undefined", "-1"], correctIndex: 1, explanation: "Numeric fields default to 0; object references default to null." },
      { text: "Which collection does NOT allow duplicate elements?", options: ["ArrayList", "LinkedList", "HashSet", "Vector"], correctIndex: 2, explanation: "Sets, including HashSet, reject duplicates." },
      { text: "Which of these is a checked exception?", options: ["NullPointerException", "ArithmeticException", "IOException", "ArrayIndexOutOfBoundsException"], correctIndex: 2, explanation: "IOException must be caught or declared; the others are unchecked RuntimeExceptions." },
      { text: "What does the `static` keyword mean for a method?", options: ["It can't be overridden", "It belongs to the class, not an instance", "It is thread-safe", "It returns nothing"], correctIndex: 1, explanation: "Static members belong to the class and can be called without an instance." },
      { text: "Which interface must a class implement to be used in a for-each loop?", options: ["Comparable", "Iterable", "Runnable", "Serializable"], correctIndex: 1, explanation: "The enhanced for loop works on any Iterable." },
      { text: "What is the size of a `long` in Java?", options: ["32 bits", "64 bits", "16 bits", "Depends on the JVM"], correctIndex: 1, explanation: "Java primitives have fixed sizes; long is always 64-bit." },
      { text: "Which statement about String in Java is true?", options: ["Strings are mutable", "Strings are immutable", "Strings are primitives", "Strings can't be compared"], correctIndex: 1, explanation: "String objects cannot be changed after creation; methods return new Strings." },
      { text: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Method", "Just-in-time Virtual Memory", "Java Version Manager"], correctIndex: 0 },
      { text: "Which access modifier makes a member visible only within its own class?", options: ["public", "protected", "private", "default"], correctIndex: 2, explanation: "private restricts access to the declaring class." },
    ],
  },
];

export const bundles: Bundle[] = [
  {
    slug: "java-full-stack-career-bundle",
    title: "Java Full Stack Career Bundle",
    tagline: "Java Backend + Frontend with React + Java Full Stack — everything you need for a Java developer role, at one price.",
    description:
      "Three courses bundled for candidates targeting Java developer roles at service companies and product startups. Start with Core Java and Spring Boot, add React for the frontend, then bring it together in the Java Full Stack program. Includes all recordings, study material, mock tests and placement support for every course in the bundle.",
    courseSlugs: ["java-backend-development", "frontend-development-react", "java-full-stack-development"],
    price: 129997,
    discountPrice: 89999,
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=70",
    validityDays: 365,
    featured: true,
  },
];

export const landingPages: LandingPage[] = [
  {
    slug: "java-classes",
    title: "Java Classes",
    metaTitle: "Java Classes Online — Core Java, Spring Boot & Full Stack Training",
    metaDescription:
      "Live-online Java classes from Axcvia: Core Java, Spring Boot, microservices and Java Full Stack. Recorded sessions, mock tests, and placement support until you're hired.",
    eyebrow: "Java Training",
    heroTitle: "Java classes built around what companies actually hire for",
    heroText:
      "From Core Java fundamentals to Spring Boot microservices and full stack delivery — taught live by engineers who spent 14 years building banking-grade Java systems. Every session is recorded, every module has a mock test.",
    heroImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1600&q=70",
    sections: [
      {
        heading: "Why learn Java with Axcvia",
        body: "Java remains the most-hired backend language in India — Infosys, TCS, Wipro, Capgemini and every bank run on it. Our Java track is designed for that hiring market: fundamentals-first teaching, enterprise patterns, and interview preparation that mirrors real service-company and product-company rounds.\n\n- Live classes with a 15-student cap, so your code gets reviewed\n- Recordings available the same day — never miss a topic\n- Subject-wise mock tests with instant results\n- Capstone projects you can talk about in interviews",
      },
      {
        heading: "Who these classes are for",
        body: "Fresh graduates from any stream, working professionals switching from support or testing roles, and developers who want to move from scripting languages into enterprise backend work. No prior Java knowledge is required for the beginner track.",
      },
    ],
    courseSlugs: ["java-backend-development", "java-full-stack-development"],
    courseTag: "",
    bundleSlugs: ["java-full-stack-career-bundle"],
    faqs: [
      { question: "Do I need a CS degree to join the Java classes?", answer: "No. Most of our Java students come from non-CS backgrounds. The beginner track starts from variables and loops." },
      { question: "Are the classes live or recorded?", answer: "Both. Every live session is recorded and added to your dashboard the same day, with lifetime access to recordings during your enrollment validity." },
      { question: "Do you provide mock tests?", answer: "Yes — every module ends with a timed mock test with instant scoring and explanations, and the full series includes previous-year style interview questions." },
    ],
    highlights: [
      { title: "14+ years", text: "of enterprise Java experience in every trainer" },
      { title: "Recorded", text: "sessions available the same day, 24/7" },
      { title: "Mock tests", text: "after every module, with instant results" },
    ],
    showInNav: true,
    navGroup: "Classes",
  },
  {
    slug: "mock-tests",
    title: "Mock Tests",
    metaTitle: "Online Mock Test Series — Programming, Java, Python & Aptitude",
    metaDescription:
      "Timed online mock tests with instant results and explanations. Practice unlimited attempts during your validity period and track your scores in your dashboard.",
    eyebrow: "Practice",
    heroTitle: "Mock test series with instant results",
    heroText:
      "Exam-style, timed tests you can attempt as many times as you like during your validity period. See your score instantly, review every explanation, and track improvement in your dashboard. Start with a free sample test.",
    heroImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=70",
    sections: [
      {
        heading: "How our mock tests work",
        body: "1. Enroll in a test series (or try the free sample).\n2. Attempt tests from your dashboard — each one is timed like the real exam.\n3. Get your score, pass/fail status and the explanation for every question the moment you submit.\n4. Re-attempt as often as you want during your validity period and watch your scores climb.",
      },
    ],
    courseSlugs: [],
    courseTag: "Mock Test",
    bundleSlugs: [],
    faqs: [
      { question: "How many attempts do I get?", answer: "Unlimited attempts during your enrollment validity. The free sample test can be attempted by any registered student." },
      { question: "Do I get explanations?", answer: "Yes, every question shows the correct answer and an explanation immediately after you submit." },
    ],
    highlights: [
      { title: "Timed", text: "exactly like the real exam" },
      { title: "Instant", text: "scores and explanations" },
      { title: "Unlimited", text: "attempts during validity" },
    ],
    showInNav: true,
    navGroup: "Mock Tests",
  },
];

export const coupons: Coupon[] = [
  {
    code: "WELCOME10",
    description: "10% flat discount for new students",
    percentOff: 10,
    flatOff: 0,
    minAmount: 0,
    newStudentsOnly: true,
    active: true,
    expiresAt: "",
  },
];
