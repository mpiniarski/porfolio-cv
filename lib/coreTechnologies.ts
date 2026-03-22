import type { CvData } from "@/lib/resumeData";

const DEFAULT_CORE_TECHNOLOGIES: NonNullable<CvData["cv"]["core_technologies"]> = [
  {
    name: "TypeScript",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  {
    name: "React",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    name: "Vue",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
  },
  {
    name: "Next.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    invert_logo: true,
  },
  {
    name: "GraphQL",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },
  {
    name: "Node.js",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Kotlin",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  },
  {
    name: "Playwright",
    logo: "https://playwright.dev/img/playwright-logo.svg",
  },
];

export function getCoreTechnologies(cv: CvData["cv"]): NonNullable<CvData["cv"]["core_technologies"]> {
  const from = cv.core_technologies;
  if (from?.length) return from;
  return DEFAULT_CORE_TECHNOLOGIES;
}
