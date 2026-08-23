import type { BlogPost } from "@/lib/types";

// Static seed for the blog. Posts added from the admin dashboard are merged
// over these by slug (see lib/services/blog.ts).
export const blogPosts: BlogPost[] = [
  {
    title: "How to Become a Full Stack Developer in 2026 (Without a CS Degree)",
    slug: "become-full-stack-developer-2026",
    excerpt:
      "A realistic, month-by-month roadmap from zero to job-ready full stack developer — what to learn, what to skip, and how to build a portfolio recruiters actually open.",
    category: "Career Guides",
    tags: ["Full Stack", "Career Change", "Roadmap", "React", "Node.js"],
    authorSlug: "arvind-menon",
    authorName: "Arvind Menon",
    coverImage:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-07-28T09:00:00.000Z",
    readingMinutes: 8,
    relatedCourseSlugs: ["full-stack-web-development", "frontend-development-react"],
    featured: true,
    content: `Most of the people who join our Full Stack batch don't have a computer science degree. Commerce graduates, mechanical engineers, support executives — and a good number of them are writing production code within six months. Here's the roadmap we use.

## Month 1–2: HTML, CSS and JavaScript fundamentals

Don't rush this. Everything you build later sits on top of JavaScript, so spend time on:

- Variables, functions, arrays and objects
- The DOM and event handling
- \`fetch\`, promises and \`async/await\`
- Flexbox and CSS Grid for layout

**Build:** a to-do app, a weather dashboard using a public API, and a responsive landing page.

## Month 3: React

React is still the most-hired frontend library in India by a wide margin. Learn components, props, state, hooks, and routing. Then learn how to talk to an API and handle loading and error states properly — that's what separates a tutorial project from a real one.

## Month 4: Node.js, Express and MongoDB

Now go backend. Build a REST API with authentication, validation, and a database. Understand what happens when two users hit the same endpoint at once.

> The single most useful thing you can do here is deploy your API publicly and break it on purpose. Debugging in production teaches more than any course video.

## Month 5: Capstone project + Git workflow

Pick one meaningful product — a job board, a booking system, a clinic management app — and build it end to end with a proper Git history, pull requests, and a README.

## Month 6: Interview preparation

- Data structures and algorithms (arrays, strings, hash maps, basic recursion)
- JavaScript trivia: closures, event loop, \`this\`
- System design basics: how would you scale the app you just built?

### What to skip

Don't learn three frontend frameworks. Don't spend a month on CSS animations. Don't start with TypeScript on day one — add it in month 3 when React starts to feel comfortable.

## Doing it with structure

Self-learning works, but the drop-off rate is brutal — most people stall somewhere around month 3 when the tutorials stop and the real problems start. That's exactly where a small live batch, code reviews, and a trainer who has shipped production React help the most.`,
  },
  {
    title: "Java vs Python for Your First Programming Job: An Honest Comparison",
    slug: "java-vs-python-first-programming-job",
    excerpt:
      "Both languages can land you a job. We compare hiring demand in India, learning curve, salaries, and which one fits your background — with data from our own placement cell.",
    category: "Career Guides",
    tags: ["Java", "Python", "Career Change", "Placements"],
    authorSlug: "suresh-iyer",
    authorName: "Suresh Iyer",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-07-14T09:00:00.000Z",
    readingMinutes: 7,
    relatedCourseSlugs: ["java-backend-development", "python-programming-django", "data-science-with-python"],
    featured: true,
    content: `"Should I learn Java or Python?" is the question we hear most at counselling calls. The honest answer: it depends on which job you want, not which language is "better".

## Where the jobs are

Looking at openings across Naukri, LinkedIn and our hiring-partner network over the last two quarters:

- **Java** dominates enterprise and service-company hiring — Infosys, TCS, Wipro, Capgemini, and every bank and insurance firm. Huge volume of entry-level roles.
- **Python** leads in data, analytics, automation and AI roles, plus startups building with Django or FastAPI.

## Learning curve

Python is easier to start with. You'll write useful scripts in week one. Java is stricter — types, classes, and more setup — but that strictness teaches you discipline that transfers to every other language.

## Salaries for freshers

In our own placements so far, Java backend roles have started between ₹4.5–6.5 LPA and Python/data roles between ₹4.8–7.2 LPA. The spread depends more on the company than the language.

## Our recommendation

| Your background | Start with |
| --- | --- |
| Non-CS graduate, want a stable first job quickly | Java |
| Maths/stats/commerce, interested in data | Python |
| Want to build products at startups | Either — pick by framework (Spring Boot vs Django) |
| Planning to move into AI/ML later | Python |

Whichever you choose, commit to one for at least six months before adding the other.`,
  },
  {
    title: "Top 25 React Interview Questions (And How to Actually Answer Them)",
    slug: "react-interview-questions-answers",
    excerpt:
      "The questions that keep showing up in frontend interviews at Indian product companies — grouped by topic, with the reasoning interviewers want to hear rather than memorised definitions.",
    category: "Interview Prep",
    tags: ["React", "Interview Prep", "Frontend", "JavaScript"],
    authorSlug: "arvind-menon",
    authorName: "Arvind Menon",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-06-30T09:00:00.000Z",
    readingMinutes: 11,
    relatedCourseSlugs: ["frontend-development-react", "full-stack-web-development"],
    featured: false,
    content: `We run mock interviews every Saturday, and the same React questions come up batch after batch. Here are the ones worth preparing properly.

## Fundamentals

1. **What is the virtual DOM and why does React use it?** Talk about reconciliation and batching, not just "it's faster".
2. **Difference between state and props?** Ownership and mutability.
3. **What are keys and why do they matter in lists?** Explain what goes wrong when you use the array index.
4. **Controlled vs uncontrolled components.**
5. **What does \`useEffect\` actually do, and when does it run?**

## Hooks

6. Why can't you call hooks inside conditions?
7. Explain \`useMemo\` vs \`useCallback\` — and when *not* to use them.
8. How would you write a custom hook for fetching data?
9. What problem does \`useRef\` solve beyond DOM access?
10. What is stale closure and how does it show up with \`setInterval\`?

## State management

11. When do you reach for Context vs a library like Zustand or Redux?
12. How do you avoid unnecessary re-renders with Context?
13. Explain lifting state up with an example.

## Performance

14. What is code splitting and how do you do it in React?
15. How does \`React.memo\` work, and why might it make things slower?
16. How would you debug a component that re-renders too often?

## Modern React

17. Server Components vs Client Components — what runs where?
18. What are Suspense boundaries?
19. How do you handle forms with Server Actions?

## Practical / coding

20. Build a debounced search input.
21. Implement a simple modal with focus trapping.
22. Write a component that paginates an API.
23. Fix a given component that has a memory leak.

## Behavioural

24. Walk us through a bug you found in production.
25. How do you review someone else's pull request?

### How to prepare

Don't memorise answers. For every question, build a 20-line example in CodeSandbox. When you've *written* the stale-closure bug yourself, you never forget the explanation.`,
  },
  {
    title: "From B.Com to Software Engineer at Freshworks: Sneha's Story",
    slug: "sneha-patil-bcom-to-software-engineer",
    excerpt:
      "Sneha had never written a line of code before joining Axcvia. Eight months later she accepted an offer at Freshworks. She talks about the hard middle stretch, mock interviews, and what she'd do differently.",
    category: "Student Stories",
    tags: ["Student Stories", "Placements", "Full Stack", "Career Change"],
    authorSlug: "meera-krishnan",
    authorName: "Meera Krishnan",
    coverImage:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-06-12T09:00:00.000Z",
    readingMinutes: 6,
    relatedCourseSlugs: ["full-stack-web-development"],
    featured: false,
    content: `**Sneha Patil** graduated with a B.Com in 2025, spent a year in an accounts role, and joined our Full Stack Web Development batch in October. This is her story in her own words, lightly edited.

## Why coding?

"I was doing reconciliations in Excel all day and kept thinking, *a program should be doing this*. A friend showed me a Python script that did her weekly report in four seconds. That was it."

## The first month

"Honestly, harder than I expected. Everyone else seemed to get JavaScript faster. What helped was the batch size — fifteen people — so I couldn't hide. Arvind would look at my screen and say 'explain this line to me'. Painful, but it worked."

## The hard middle

"Month three. React. I almost quit. The doubt-clearing sessions on Sunday were what kept me going — I'd bring a list of ten things I didn't understand and leave with nine answered."

## Capstone

Sneha built an expense-tracking app for small businesses — a product born directly from her accounts experience. It became the centrepiece of every interview.

## Interviews

"Mock interviews with Meera were brutal. She'd stop me mid-answer and say 'the interviewer has already lost interest'. By the time the real Freshworks interview happened, it felt easy in comparison."

## The offer

Software Engineer, Freshworks, ₹6.5 LPA. Eight months after writing her first \`console.log\`.

> "If you're from a non-tech background: your domain knowledge is an asset, not a gap. Build your capstone around it."

Read more [placement stories](/placements) or [talk to us](/contact) about your own path.`,
  },
  {
    title: "What Does a Software Tester Actually Do? A Day in the Life",
    slug: "what-does-a-software-tester-do",
    excerpt:
      "QA is one of the most underrated entry points into tech. Here's what a junior automation tester really does all day, the tools you'll use, and why it's a great first job.",
    category: "Industry Insights",
    tags: ["Testing", "QA", "Automation", "Selenium", "Career Change"],
    authorSlug: "kavitha-nair",
    authorName: "Kavitha Nair",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-05-26T09:00:00.000Z",
    readingMinutes: 6,
    relatedCourseSlugs: ["software-testing-automation"],
    featured: false,
    content: `Testing roles are often the fastest route into a tech company for non-CS graduates — and they pay better than most people assume. Here's what the job really looks like.

## 9:30 — Stand-up

You join the development team's daily stand-up. You report which features you tested yesterday, which bugs you logged, and what's blocked.

## 10:00 — Writing test cases

A new feature ("users can reset their password") lands in your queue. You write test cases: happy path, wrong email, expired link, link used twice, rate limits. Good testers think about what *shouldn't* work.

## 11:30 — Automation

You turn yesterday's manual checks into Selenium scripts in Java, using TestNG and Page Object Model so they stay maintainable. They'll run in Jenkins every night.

## 14:00 — API testing

The mobile team changed an endpoint. You hit it with REST Assured and Postman, check status codes, response shape, and the error messages.

## 16:00 — Bug triage

You demonstrate a bug to a developer. Clear reproduction steps, screenshots, logs. A vague bug report wastes everyone's afternoon; a good one gets fixed in an hour.

## Tools you'll use

- Jira for tracking
- Selenium + TestNG for UI automation
- Postman / REST Assured for APIs
- Git and Jenkins for CI
- SQL for checking data

## Why it's a great first job

You learn how software is *really* built, across the whole stack, and many testers move into SDET, DevOps, or development roles within a few years.`,
  },
  {
    title: "Announcing Our AI & Machine Learning Engineering Track",
    slug: "announcing-ai-machine-learning-track",
    excerpt:
      "Our most requested course is here: a hands-on AI & ML engineering program covering Python, deep learning, LLM applications and deployment — taught live by practitioners.",
    category: "Axcvia News",
    tags: ["AI", "Machine Learning", "New Course", "Python"],
    authorSlug: "priya-raghavan",
    authorName: "Priya Raghavan",
    coverImage:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=70",
    publishedAt: "2026-05-10T09:00:00.000Z",
    readingMinutes: 4,
    relatedCourseSlugs: ["ai-machine-learning-engineering", "data-science-with-python"],
    featured: false,
    content: `After months of requests from students and hiring partners, we're launching a dedicated **AI & Machine Learning Engineering** track.

## What's different about this course

Plenty of ML courses teach you to train a model in a notebook. Very few teach you to ship one. This track is built around the work that ML engineers actually get paid for:

- Python and data handling with Pandas and NumPy
- Classical ML with scikit-learn — and knowing when it's enough
- Deep learning with PyTorch
- Building applications on top of large language models: prompting, retrieval, evaluation
- Deploying models as APIs and monitoring them

## Who it's for

Working developers who want to move into AI roles, data analysts stepping up to engineering, and strong graduates with Python basics.

## Batch details

The first live-online batch starts soon with a maximum of 15 seats. Every session is recorded, and placement support applies as with all our courses.`,
  },
];
