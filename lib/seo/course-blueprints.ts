/**
 * Course blueprints for the admin course generator (/admin/courses/generate).
 *
 * Each blueprint is a complete, search-ready course page: an answer-first
 * tagline, a description, module-by-module curriculum, outcomes, prerequisites,
 * tags and FAQs (the part Google and AI answer engines quote). Topics were
 * chosen for steady Indian hiring demand plus the GenAI wave, and to fill
 * categories the catalog doesn't cover yet.
 *
 * What a blueprint deliberately does NOT set: fee, next batch and trainer.
 * Those are business facts — courses are created with "Fee on request" until
 * an admin fills them in.
 */

export interface CourseBlueprint {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  tagline: string;
  description: string;
  syllabus: { title: string; topics: string[] }[];
  outcomes: string[];
  prerequisites: string[];
  tags: string[];
  faqs: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
}

export const COURSE_BLUEPRINTS: CourseBlueprint[] = [
  {
    slug: "generative-ai-and-llm-app-development",
    title: "Generative AI & LLM App Development",
    category: "Data & AI",
    level: "Intermediate",
    duration: "3 months",
    tagline: "Build and ship production apps on top of LLMs — RAG, tools and agents",
    description:
      "A hands-on engineering course for developers who want to build with large language models rather than train them. You work with LLM APIs, prompt design, embeddings and vector search, retrieval-augmented generation, tool calling and evaluation — then deploy a real AI product with cost, latency and safety controls in place.\n\nEvery module ends with working code you keep, and the capstone is a deployed application you can show in interviews.",
    syllabus: [
      { title: "LLM Foundations for Developers", topics: ["How transformers and tokens work", "Model families and when to use which", "LLM APIs and streaming responses", "Cost, context windows and rate limits"] },
      { title: "Prompt & Context Engineering", topics: ["Structured prompts and output schemas", "Few-shot and chain-of-thought patterns", "Guardrails against prompt injection", "Prompt versioning and regression tests"] },
      { title: "RAG: Retrieval-Augmented Generation", topics: ["Embeddings and vector databases", "Chunking and hybrid search", "Grounding answers with citations", "Measuring retrieval quality"] },
      { title: "Tools, Agents & Workflows", topics: ["Function/tool calling", "Multi-step agent loops", "Background jobs and queues", "Human-in-the-loop review"] },
      { title: "Ship It: Evaluation & Deployment", topics: ["Offline evals and golden datasets", "Tracing, logging and cost dashboards", "Caching and latency tuning", "Capstone: deployed AI application"] },
    ],
    outcomes: [
      "Ship a deployed LLM application with retrieval and tools",
      "Design prompts and evaluations that catch regressions",
      "Build RAG pipelines over your own documents",
      "Control cost, latency and safety in production",
    ],
    prerequisites: ["Comfortable writing Python or JavaScript", "Basic REST API experience"],
    tags: ["Generative AI", "LLM", "RAG", "Python", "AI Engineering"],
    faqs: [
      { question: "Do I need a machine learning background to join?", answer: "No. This is an application-engineering course: you call and orchestrate existing models. You need programming experience, not ML theory or maths." },
      { question: "Which models and tools will I use?", answer: "Commercial LLM APIs plus open models, a vector database for retrieval, and standard web tooling. The patterns are provider-agnostic, so they carry over when models change." },
      { question: "What is the difference between this and the AI & Machine Learning Engineering course?", answer: "This course is about building products on top of existing models. The AI & ML Engineering track goes deeper into training, deep learning and model theory." },
      { question: "What will I have at the end?", answer: "A deployed AI application with retrieval, tool calling, evaluations and cost monitoring — plus the code for every exercise along the way." },
    ],
    metaTitle: "Generative AI & LLM App Development Course (Live Online)",
    metaDescription: "Learn to build production LLM apps — prompts, RAG, vector search, tool calling, evals and deployment. Live online, project-based, with placement support.",
  },
  {
    slug: "ai-agents-and-automation-engineering",
    title: "AI Agents & Automation Engineering",
    category: "Data & AI",
    level: "Advanced",
    duration: "2 months",
    tagline: "Design agentic systems that use tools, remember context and run reliably",
    description:
      "Agents are LLMs given tools, memory and a loop. This course covers how to build them so they stay reliable: planning patterns, tool design, state and memory, retries and guardrails, human approval steps, and the observability you need to debug non-deterministic systems.\n\nYou build three agents — a research assistant, a workflow automator and a customer-support triage bot — and learn when a plain workflow beats an agent.",
    syllabus: [
      { title: "Agent Fundamentals", topics: ["Agent loops vs fixed workflows", "Planning and decomposition patterns", "State, memory and context budgets", "Choosing when NOT to use an agent"] },
      { title: "Tools & Integrations", topics: ["Designing tool schemas", "Calling internal and third-party APIs", "Browser and file-system tools", "Permissions and least privilege"] },
      { title: "Reliability Engineering", topics: ["Retries, timeouts and fallbacks", "Validation and structured outputs", "Guardrails and injection defence", "Human-in-the-loop approvals"] },
      { title: "Observability & Capstone", topics: ["Tracing multi-step runs", "Evaluating agent trajectories", "Cost and token accounting", "Capstone: a production-ready agent"] },
    ],
    outcomes: [
      "Build agents that call tools and recover from failures",
      "Choose between workflows, RAG and agents for a problem",
      "Add tracing, evals and approval gates to agent runs",
      "Deploy an agent with cost and permission controls",
    ],
    prerequisites: ["LLM API experience or our Generative AI course", "Comfortable with Python or TypeScript"],
    tags: ["AI Agents", "Automation", "LLM", "Tool Calling", "AI Engineering"],
    faqs: [
      { question: "Is this course only theory about agents?", answer: "No. You build three working agents and deploy one, with tracing, evaluations and guardrails in place." },
      { question: "Do I need the Generative AI course first?", answer: "You need practical LLM API experience. If you have never called an LLM API, take the Generative AI & LLM App Development course first." },
      { question: "Will this help me automate work at my company?", answer: "Yes. The workflow-automation module covers connecting agents to internal APIs, approval steps and safe permissions for business processes." },
    ],
    metaTitle: "AI Agents & Automation Engineering Course — Live Online",
    metaDescription: "Build reliable AI agents: tool calling, memory, guardrails, human approval and tracing. Advanced live-online course for working developers in India.",
  },
  {
    slug: "spring-boot-microservices",
    title: "Spring Boot Microservices",
    category: "Programming Languages",
    level: "Intermediate",
    duration: "3 months",
    tagline: "Take Java services from monolith to production-grade microservices",
    description:
      "A focused Spring course for Java developers who already know the basics and now need the architecture skills service companies and product teams hire for: Spring Boot 3, REST and validation, Spring Data JPA, Spring Security with JWT, service-to-service communication, resilience patterns, Docker and CI/CD.\n\nYou build one system across the whole course — an order platform split into services, containerised and deployed.",
    syllabus: [
      { title: "Spring Boot in Depth", topics: ["Dependency injection and configuration", "REST controllers and validation", "Exception handling and problem details", "Testing with JUnit 5 and Testcontainers"] },
      { title: "Data & Persistence", topics: ["Spring Data JPA and Hibernate", "Transactions and isolation", "Query tuning and indexes", "Database migrations with Flyway"] },
      { title: "Security & Communication", topics: ["Spring Security and JWT", "Role-based authorisation", "REST clients and retries", "Async messaging basics"] },
      { title: "Microservice Patterns", topics: ["Service boundaries and API contracts", "Config, discovery and gateways", "Resilience: timeouts, circuit breakers", "Distributed logging and tracing"] },
      { title: "Deploy & Operate", topics: ["Dockerising Spring services", "CI/CD pipelines", "Health checks and metrics", "Capstone: multi-service order platform"] },
    ],
    outcomes: [
      "Build and test production-style Spring Boot services",
      "Secure APIs with Spring Security and JWT",
      "Split a monolith into resilient microservices",
      "Containerise and deploy a multi-service system",
    ],
    prerequisites: ["Core Java (OOP, collections, exceptions)", "Basic SQL"],
    tags: ["Java", "Spring Boot", "Microservices", "Backend", "Docker"],
    faqs: [
      { question: "Is this course suitable for freshers?", answer: "It assumes Core Java. Complete beginners should start with Java Backend Development and take this next." },
      { question: "Which Spring version is taught?", answer: "Spring Boot 3 with Java 17+, which is what most Indian product and service companies are hiring for." },
      { question: "Do we cover deployment?", answer: "Yes — Docker, CI/CD pipelines, health checks and metrics, ending with a deployed multi-service capstone." },
    ],
    metaTitle: "Spring Boot Microservices Course — Live Online, Project-Based",
    metaDescription: "Master Spring Boot 3, Spring Data JPA, Spring Security, JWT and microservice patterns with Docker and CI/CD. Live online classes with placement support.",
  },
  {
    slug: "dsa-interview-preparation",
    title: "DSA Interview Preparation",
    category: "Placement Prep",
    level: "Intermediate",
    duration: "3 months",
    tagline: "Pattern-based data structures and algorithms practice for coding rounds",
    description:
      "A structured preparation course for product-company coding rounds and campus placements. Instead of random problem lists, you learn the fifteen patterns that cover most interview questions — two pointers, sliding window, binary search on answer, recursion and backtracking, graphs, dynamic programming — and drill each with timed sets.\n\nWeekly mock coding rounds are reviewed live, so you fix how you think under time pressure, not just the answer.",
    syllabus: [
      { title: "Complexity & Core Structures", topics: ["Time and space analysis", "Arrays, strings and hashing", "Stacks, queues and deques", "Linked lists in interviews"] },
      { title: "Searching & Sorting Patterns", topics: ["Two pointers and sliding window", "Binary search on the answer", "Sorting-based patterns", "Prefix sums and difference arrays"] },
      { title: "Recursion, Trees & Graphs", topics: ["Recursion and backtracking", "Binary trees and BSTs", "BFS, DFS and topological sort", "Union-find and shortest paths"] },
      { title: "Dynamic Programming", topics: ["Memoisation to tabulation", "Knapsack family", "Subsequence and string DP", "DP on grids and trees"] },
      { title: "Interview Simulation", topics: ["Timed mock coding rounds", "Explaining your approach aloud", "Debugging under pressure", "Company-wise question patterns"] },
    ],
    outcomes: [
      "Recognise the pattern behind an unseen problem",
      "Solve medium-level problems within interview time limits",
      "Explain approach and complexity clearly to an interviewer",
      "Complete weekly mock rounds with written feedback",
    ],
    prerequisites: ["Comfortable coding in one language (Java, Python or C++)", "Basic programming constructs"],
    tags: ["DSA", "Interview Preparation", "Placement", "Coding Round", "Problem Solving"],
    faqs: [
      { question: "Which language should I use for this course?", answer: "Java, Python or C++ — you pick one and stay with it. Solutions are discussed in all three." },
      { question: "How many problems will I solve?", answer: "Around 250 curated problems grouped by pattern, plus weekly timed mock rounds with review." },
      { question: "Is this enough for product-company interviews?", answer: "It covers the coding round thoroughly. For senior roles, pair it with our System Design Interview Preparation course." },
      { question: "I am from a non-CS branch. Can I join?", answer: "Yes, if you can already write basic loops, conditionals and functions in one language." },
    ],
    metaTitle: "DSA Interview Preparation Course — Live Online Coding Practice",
    metaDescription: "Pattern-based DSA training for coding interviews: 250+ curated problems, weekly timed mock rounds and live review. Java, Python or C++. Live online.",
  },
  {
    slug: "system-design-interview-preparation",
    title: "System Design Interview Preparation",
    category: "Placement Prep",
    level: "Advanced",
    duration: "2 months",
    tagline: "Design scalable systems and defend your choices in senior interviews",
    description:
      "For developers with two or more years of experience preparing for senior interviews. You learn the building blocks — load balancing, caching, databases and sharding, queues, consistency models — then apply them to the systems that come up in interviews: URL shortener, news feed, chat, rate limiter, payment ledger.\n\nEach session ends with a whiteboard-style design defended under questioning, which is what the round actually tests.",
    syllabus: [
      { title: "Building Blocks", topics: ["Load balancers and reverse proxies", "Caching layers and invalidation", "SQL vs NoSQL trade-offs", "Queues and event-driven design"] },
      { title: "Scaling & Data", topics: ["Replication and sharding", "CAP and consistency models", "Indexing and hot keys", "Rate limiting and back-pressure"] },
      { title: "Design Drills", topics: ["URL shortener and pastebin", "News feed and notifications", "Chat and presence", "Payments and idempotency"] },
      { title: "Interview Craft", topics: ["Requirement clarification", "Estimation and capacity planning", "Trade-off framing", "Mock design rounds with feedback"] },
    ],
    outcomes: [
      "Structure a design answer from requirements to trade-offs",
      "Size systems with realistic capacity estimates",
      "Defend database, cache and queue choices under questioning",
      "Complete mock design rounds with written feedback",
    ],
    prerequisites: ["2+ years of development experience, or our backend courses", "Familiarity with databases and APIs"],
    tags: ["System Design", "Interview Preparation", "Scalability", "Architecture", "Placement"],
    faqs: [
      { question: "Is this course useful for freshers?", answer: "Rarely. Fresher interviews focus on coding rounds — start with DSA Interview Preparation. This course targets 2+ years of experience." },
      { question: "Do we do mock interviews?", answer: "Yes. Every design drill is presented and questioned live, and the final sessions are full mock design rounds with written feedback." },
      { question: "Is low-level design covered?", answer: "The focus is high-level distributed design. Object-oriented low-level design is touched on in the interview-craft module." },
    ],
    metaTitle: "System Design Interview Preparation — Live Online Course",
    metaDescription: "Prepare for senior system design rounds: caching, sharding, queues, consistency and capacity estimation, with live mock design interviews and feedback.",
  },
  {
    slug: "campus-placement-coding-and-aptitude",
    title: "Campus Placement Coding & Aptitude",
    category: "Placement Prep",
    level: "Beginner",
    duration: "2 months",
    tagline: "Clear the written round, coding test and HR interview of campus drives",
    description:
      "A complete campus-drive preparation course for final-year students. It covers the three things that actually decide placement: the aptitude and reasoning test, the basic coding round, and the technical plus HR interview.\n\nYou practise with company-style mock tests every week, build a one-page resume that survives ATS filters, and rehearse the interview answers most students fumble.",
    syllabus: [
      { title: "Quantitative Aptitude", topics: ["Percentages, ratio and averages", "Time, speed, work and distance", "Permutations, combinations and probability", "Speed techniques for timed tests"] },
      { title: "Logical & Verbal Reasoning", topics: ["Series, puzzles and seating arrangement", "Data interpretation", "Reading comprehension", "Error spotting and sentence correction"] },
      { title: "Coding Round Basics", topics: ["Arrays, strings and hashing", "Sorting and searching", "Recursion fundamentals", "Timed platform practice"] },
      { title: "Interview & Resume", topics: ["One-page ATS-friendly resume", "Project explanation framework", "Core CS questions (OS, DBMS, OOP, networks)", "HR round and mock interviews"] },
    ],
    outcomes: [
      "Clear aptitude and reasoning rounds within time limits",
      "Solve entry-level coding questions confidently",
      "Answer core CS and HR questions with structure",
      "Finish with an ATS-ready resume and mock interview feedback",
    ],
    prerequisites: ["Final-year student or recent graduate", "No prior coding experience required"],
    tags: ["Placement", "Aptitude", "Campus Drive", "Interview Preparation", "Freshers"],
    faqs: [
      { question: "Which companies does this prepare me for?", answer: "Mass-recruiter campus drives and entry-level openings at service companies, where aptitude, a basic coding round and an HR interview are the standard pattern." },
      { question: "Do I need programming experience?", answer: "No. The coding module starts from the basics and builds to entry-level interview questions." },
      { question: "Are mock tests included?", answer: "Yes — weekly company-style mock tests with instant scoring, plus mock technical and HR interviews in the final module." },
    ],
    metaTitle: "Campus Placement Coding & Aptitude Course — Live Online",
    metaDescription: "Crack campus drives: aptitude, logical reasoning, entry-level coding rounds, core CS and HR interviews, with weekly mock tests and resume review.",
  },
  {
    slug: "sql-for-data-analysts",
    title: "SQL for Data Analysts",
    category: "Data & AI",
    level: "Beginner",
    duration: "6 weeks",
    tagline: "Query real databases and answer business questions with confidence",
    description:
      "A short, practical SQL course for analysts, testers, product managers and developers who need to get answers out of a database. You start from SELECT and joins and finish with window functions, CTEs and query tuning, working on realistic sales, product and marketing datasets.\n\nEvery module is a set of business questions you answer in SQL, which is exactly how analyst interviews are run.",
    syllabus: [
      { title: "SQL Foundations", topics: ["SELECT, WHERE and ORDER BY", "Data types and NULL handling", "Aggregations and GROUP BY", "Filtering groups with HAVING"] },
      { title: "Joins & Relationships", topics: ["Inner, left and self joins", "Set operations", "Subqueries and EXISTS", "Common data modelling traps"] },
      { title: "Analytical SQL", topics: ["Window functions", "Ranking and running totals", "CTEs and readable queries", "Date and cohort analysis"] },
      { title: "Performance & Interviews", topics: ["Indexes and execution plans", "Rewriting slow queries", "Case-study business questions", "SQL interview drill"] },
    ],
    outcomes: [
      "Answer business questions directly from a database",
      "Write window functions and CTEs with confidence",
      "Read an execution plan and fix a slow query",
      "Clear SQL rounds in analyst interviews",
    ],
    prerequisites: ["No prior SQL or programming experience needed", "Basic spreadsheet familiarity helps"],
    tags: ["SQL", "Data Analytics", "PostgreSQL", "Interview Preparation", "Business Analysis"],
    faqs: [
      { question: "Which database is used in class?", answer: "PostgreSQL, with notes on MySQL differences. The SQL you learn transfers to both, and to cloud warehouses." },
      { question: "Is this enough to become a data analyst?", answer: "SQL is the core skill, and this course covers it thoroughly. For the full role, add our Data Analytics with SQL & Power BI course for dashboards and Python." },
      { question: "Do I need to know Python?", answer: "No. This course is SQL only, which makes it a good first step for non-programmers." },
    ],
    metaTitle: "SQL for Data Analysts — Live Online Course with Real Datasets",
    metaDescription: "Learn SQL from SELECT to window functions on real business datasets. Joins, CTEs, indexes and query tuning, plus analyst interview practice. Live online.",
  },
  {
    slug: "docker-and-kubernetes-for-developers",
    title: "Docker & Kubernetes for Developers",
    category: "Cloud & DevOps",
    level: "Intermediate",
    duration: "2 months",
    tagline: "Containerise your apps and run them on Kubernetes with confidence",
    description:
      "A container course written for developers, not sysadmins. You containerise real applications, write compose files for local development, then move to Kubernetes: deployments, services, config and secrets, probes, autoscaling and rolling updates.\n\nThe course ends with a full CI/CD pipeline that builds an image and deploys it to a cluster on every push.",
    syllabus: [
      { title: "Docker Essentials", topics: ["Images, layers and caching", "Writing lean Dockerfiles", "Volumes and networking", "Docker Compose for local stacks"] },
      { title: "Kubernetes Core", topics: ["Pods, deployments and services", "ConfigMaps and secrets", "Liveness and readiness probes", "Ingress and routing"] },
      { title: "Operating Workloads", topics: ["Rolling updates and rollbacks", "Horizontal autoscaling", "Resource requests and limits", "Logs, metrics and debugging"] },
      { title: "Pipelines & Capstone", topics: ["Registry and image tagging", "CI/CD to a cluster", "Secrets management in pipelines", "Capstone: deploy a multi-service app"] },
    ],
    outcomes: [
      "Containerise any application with a lean image",
      "Deploy and operate workloads on Kubernetes",
      "Debug failing pods, probes and rollouts",
      "Automate build and deploy with CI/CD",
    ],
    prerequisites: ["You can run and build an application locally", "Basic Linux command line"],
    tags: ["Docker", "Kubernetes", "DevOps", "CI/CD", "Containers"],
    faqs: [
      { question: "Do I need cloud experience?", answer: "No. You start locally and move to a managed cluster during the course. Cloud fundamentals are covered as needed." },
      { question: "How is this different from the DevOps & Cloud Engineering course?", answer: "This is a focused container course. The DevOps & Cloud Engineering (AWS) track is broader — Linux, Terraform, monitoring and AWS services." },
      { question: "Will we deploy to a real cluster?", answer: "Yes. The capstone deploys a multi-service application to a managed Kubernetes cluster through a CI/CD pipeline." },
    ],
    metaTitle: "Docker & Kubernetes Course for Developers — Live Online",
    metaDescription: "Containerise apps with Docker and run them on Kubernetes: deployments, probes, autoscaling, rollbacks and CI/CD to a real cluster. Live online classes.",
  },
  {
    slug: "api-and-automation-testing",
    title: "API & Automation Testing",
    category: "Testing",
    level: "Intermediate",
    duration: "2 months",
    tagline: "Test APIs properly and run the suite on every commit",
    description:
      "A specialist testing course for QA engineers and developers who want to go beyond UI clicks. You learn how REST APIs actually work, then build request-level tests with Postman and REST Assured, add contract and data-driven tests, and wire everything into a CI pipeline with readable reports.\n\nPerformance basics are included, so you can spot a slow endpoint before users do.",
    syllabus: [
      { title: "API Fundamentals for Testers", topics: ["HTTP methods, status codes and headers", "REST design conventions", "Authentication: tokens and keys", "Reading API documentation"] },
      { title: "Postman in Depth", topics: ["Collections and environments", "Tests and assertions in JavaScript", "Data-driven runs", "Newman in the pipeline"] },
      { title: "REST Assured with Java", topics: ["Request specification and matchers", "JSON schema validation", "TestNG structure and reporting", "Reusable test framework design"] },
      { title: "CI & Performance", topics: ["Running suites in CI/CD", "Flaky test triage", "Basic load testing", "Capstone: full API test framework"] },
    ],
    outcomes: [
      "Write reliable API tests in Postman and REST Assured",
      "Validate schemas, auth flows and error paths",
      "Run the suite automatically on every commit",
      "Report defects with reproducible evidence",
    ],
    prerequisites: ["Manual testing basics or our Software Testing course", "Some Java or JavaScript familiarity"],
    tags: ["API Testing", "Postman", "REST Assured", "Automation", "QA"],
    faqs: [
      { question: "Is Selenium covered here?", answer: "No — UI automation with Selenium is covered in the Software Testing (Manual + Automation) course. This one is API-focused." },
      { question: "How much coding is involved?", answer: "Enough Java to write clean tests. The framework module teaches the patterns step by step." },
      { question: "Does it help for QA interviews?", answer: "Yes. API testing, framework design and CI integration are the questions most QA interviews now open with." },
    ],
    metaTitle: "API & Automation Testing Course — Postman, REST Assured, CI",
    metaDescription: "Master API testing: HTTP fundamentals, Postman collections, REST Assured frameworks, schema validation and CI pipelines. Live online QA training.",
  },
  {
    slug: "typescript-for-react-developers",
    title: "TypeScript for React Developers",
    category: "Web Development",
    level: "Intermediate",
    duration: "6 weeks",
    tagline: "Type your React codebase properly and stop shipping avoidable bugs",
    description:
      "A short course for JavaScript developers whose team has moved to TypeScript. You learn the type system as it is actually used in React work: props and generics, discriminated unions for state, typed hooks, typed API layers, and the config that catches real bugs.\n\nYou migrate an existing JavaScript React app to TypeScript as the running project, which is the situation most developers face.",
    syllabus: [
      { title: "TypeScript Core", topics: ["Types, interfaces and unions", "Narrowing and type guards", "Generics that stay readable", "Utility types in practice"] },
      { title: "React with Types", topics: ["Typing props, children and refs", "Typed hooks and custom hooks", "Discriminated unions for UI state", "Context and reducers with types"] },
      { title: "Data & APIs", topics: ["Typed fetch layers", "Runtime validation at boundaries", "Form and schema typing", "Handling API error shapes"] },
      { title: "Migration & Tooling", topics: ["tsconfig options that matter", "Incremental JS to TS migration", "Type-safe tests", "Capstone: migrate a real app"] },
    ],
    outcomes: [
      "Type React components, hooks and context confidently",
      "Model UI state with unions instead of boolean soup",
      "Validate data at API boundaries",
      "Migrate a JavaScript codebase to TypeScript incrementally",
    ],
    prerequisites: ["Working knowledge of React", "Comfortable with modern JavaScript"],
    tags: ["TypeScript", "React", "Frontend", "Web Development", "JavaScript"],
    faqs: [
      { question: "Do I need to know React already?", answer: "Yes. This course assumes you build React components today and want to add TypeScript. Beginners should take Frontend Development with React first." },
      { question: "Is Next.js covered?", answer: "The patterns apply to Next.js and the capstone works in either setup, but routing and rendering are covered in the React course, not here." },
      { question: "Will this help in interviews?", answer: "Yes. Most frontend roles in India now list TypeScript, and typed state modelling is a common interview discussion." },
    ],
    metaTitle: "TypeScript for React Developers — Live Online Short Course",
    metaDescription: "Learn TypeScript the way React teams use it: typed props, hooks, state unions, API layers and a real JS-to-TS migration. Six-week live online course.",
  },
];

/** Build a ready-to-save course document from a blueprint. */
export function buildCourseFromBlueprint(bp: CourseBlueprint) {
  return {
    title: bp.title,
    slug: bp.slug,
    category: bp.category,
    type: "classes" as const,
    tagline: bp.tagline,
    description: bp.description,
    syllabus: bp.syllabus,
    outcomes: bp.outcomes,
    prerequisites: bp.prerequisites,
    tags: bp.tags,
    faqs: bp.faqs,
    metaTitle: bp.metaTitle,
    metaDescription: bp.metaDescription,
    duration: bp.duration,
    level: bp.level,
    mode: "online" as const,
    formats: ["live-online", "self-paced"],
    certificate: true,
    // Business facts an admin must set — never invented here.
    fee: 0,
    discountFee: 0,
    nextBatch: "",
    trainerSlug: "",
    image: "",
    // No fabricated social proof.
    rating: 0,
    reviewCount: 0,
    learners: 0,
    featured: false,
    validityDays: 0,
    curriculum: [],
    materials: [],
    isPublished: true,
    source: "seo-generator",
  };
}
