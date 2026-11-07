
export type Lang = "en" | "th";

export const LANGS: readonly Lang[] = ["en", "th"];
export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

export function isLang(value: unknown): value is Lang {
  return value === "en" || value === "th";
}

const en = {
  meta: {
    title: "Nutthanun Pengpala | Developer Portfolio",
    description:
      "Software developer portfolio featuring projects, skills, and experience.",
    projectTitle: "Project | Nutthanun Pengpala",
  },
  nav: {
    brand: "Portfolio",
    about: "About",
    skills: "Skills",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact me",
    language: "Language",
  },
  hero: {
    status: "Open to new opportunities",
    role: "Full-stack software developer",
    description:
      "I design and build web applications and software that solve real-world problems, from the interface to the database.",
    seeProjects: "See my projects",
    contact: "Contact me",
    meta: "Based in Thailand. Web, mobile and backend.",
  },
  about: {
    title: "About",
    subtitle: "Curious by nature, driven by technology.",
    lead: "I'm a software engineering student at Mae Fah Luang University with a foundation in web design and development. I focus on responsive interfaces and well-documented code, from the UI down to the database and APIs.",
    body: "My goal is to keep learning, write maintainable code, and turn ideas into applications that people can actually use.",
    focus: [
      { title: "Web development", detail: "React, Next.js, TypeScript" },
      { title: "Mobile applications", detail: "Flutter, Dart, Firebase" },
      { title: "Backend and databases", detail: "NestJS, Prisma, PostgreSQL" },
    ],
  },
  skills: {
    title: "Skills",
    subtitle: "The tools I use to take an idea from sketch to production.",
    groups: {
      frontend: "Frontend",
      backend: "Backend",
      mobile: "Mobile",
      tools: "Tools",
    },
  },
  projects: {
    title: "Projects",
    loading: "Loading projects...",
    count: (n: number) =>
      `${n} ${n === 1 ? "project" : "projects"}. Filter by technology to narrow them down.`,
    apiNotice: (url: string) =>
      `Can't reach the API at ${url}. Start the NestJS server (port 3001) to load your projects and experience.`,
    all: "All",
    filterAria: "Filter projects",
    emptyTitle: "No projects yet",
    emptyBody:
      "Add Project records in Prisma Studio and they will show up here.",
    featured: "Featured",
    live: "Live",
    visitSite: "Visit site",
    details: "Details",
  },
  experience: {
    title: "Experience",
    subtitle: "Where I've worked and what I've learned along the way.",
    loading: "Loading experience...",
    emptyTitle: "Nothing here yet",
    emptyBody:
      "Add Experience records in Prisma Studio and your timeline will appear here.",
    present: "Present",
  },
  contact: {
    titleLine1: "Have an idea?",
    titleLine2: "Let's build it together.",
    body: "I'm always happy to talk about technology, creative ideas and opportunities to build something meaningful.",
    sendEmail: "Send an email",
    copied: "Copied",
    copiedSr: "Email address copied",
    github: "GitHub",
  },
  footer: {
    backToTop: "Back to top",
  },
  detail: {
    back: "All projects",
    loading: "Loading project...",
    visitLive: "Visit live site",
    sourceCode: "Source code",
    aboutProject: "About this project",
    role: "Role",
    techStack: "Tech stack",
  },
};

export type Dict = typeof en;

const th: Dict = {
  meta: {
    title: "Nutthanun Pengpala | Developer Portfolio",
    description:
      "Portfolio Software developer รวมโปรเจกต์ ทักษะ และประสบการณ์",
    projectTitle: "โปรเจกต์ | Nutthanun Pengpala",
  },
  nav: {
    brand: "Portfolio",
    about: "เกี่ยวกับผม",
    skills: "ทักษะที่มี",
    projects: "โปรเจกต์",
    experience: "ประสบการณ์",
    contact: "ติดต่อ",
    language: "ภาษา",
  },
  hero: {
    status: "พร้อมรับโอกาสใหม่ๆ",
    role: "นักพัฒนาซอฟต์แวร์ Full-stack",
    description:
      "ผมออกแบบและพัฒนาเว็บแอปพลิเคชันและซอฟต์แวร์ที่แก้ปัญหาในโลกจริง ตั้งแต่หน้าจอผู้ใช้ไปจนถึงฐานข้อมูล",
    seeProjects: "ดูผลงานของผม",
    contact: "ติดต่อ",
    meta: "อยู่ที่ประเทศไทย เว็บ มือถือ และ ฐานข้อมูล",
  },
  about: {
    title: "เกี่ยวกับผม",
    subtitle: "ช่างสงสัยโดยธรรมชาติ และขับเคลื่อนด้วยเทคโนโลยี",
    lead: "ผมเป็นนักศึกษาวิศวกรรมซอฟต์แวร์ที่มหาวิทยาลัยแม่ฟ้าหลวง มีพื้นฐานด้านการออกแบบและพัฒนาเว็บ ให้ความสำคัญกับหน้าจอแบบ responsive และโค้ดที่มีเอกสารประกอบชัดเจน ตั้งแต่ UI ลงไปถึงฐานข้อมูลและ API",
    body: "เป้าหมายของผมคือเรียนรู้อย่างต่อเนื่อง เขียนโค้ดที่ดูแลรักษาง่าย และเปลี่ยนไอเดียให้เป็นแอปพลิเคชันที่คนใช้งานได้จริง",
    focus: [
      { title: "การพัฒนาเว็บ", detail: "React, Next.js, TypeScript" },
      { title: "แอปพลิเคชันมือถือ", detail: "Flutter, Dart, Firebase" },
      { title: "แบ็กเอนด์และฐานข้อมูล", detail: "NestJS, Prisma, PostgreSQL" },
    ],
  },
  skills: {
    title: "ทักษะ",
    subtitle: "เครื่องมือที่ผมใช้เปลี่ยนไอเดียจากสเก็ตช์ให้เป็นระบบจริง",
    groups: {
      frontend: "Frontend",
      backend: "Backend",
      mobile: "มือถือ",
      tools: "เครื่องมือ",
    },
  },
  projects: {
    title: "โปรเจกต์",
    loading: "กำลังโหลดโปรเจกต์...",
    count: (n: number) =>
      `${n} โปรเจกต์ กรองตามเทคโนโลยีเพื่อดูเฉพาะที่สนใจ`,
    apiNotice: (url: string) =>
      `เชื่อมต่อ API ที่ ${url} ไม่ได้ กรุณาเปิดเซิร์ฟเวอร์ NestJS (พอร์ต 3001) เพื่อโหลดโปรเจกต์และประสบการณ์`,
    all: "ทั้งหมด",
    filterAria: "กรองโปรเจกต์",
    emptyTitle: "ยังไม่มีโปรเจกต์",
    emptyBody: "เพิ่มข้อมูล Project ใน Prisma Studio แล้วจะแสดงที่นี่",
    featured: "แนะนำ",
    live: "Live",
    visitSite: "เปิดเว็บไซต์",
    details: "รายละเอียด",
  },
  experience: {
    title: "ประสบการณ์",
    subtitle: "ที่ที่ผมเคยทำงานและสิ่งที่ได้เรียนรู้ระหว่างทาง",
    loading: "กำลังโหลดประสบการณ์...",
    emptyTitle: "ยังไม่มีข้อมูล",
    emptyBody:
      "เพิ่มข้อมูล Experience ใน Prisma Studio แล้วไทม์ไลน์จะแสดงที่นี่",
    present: "ปัจจุบัน",
  },
  contact: {
    titleLine1: "มีไอเดียไหม?",
    titleLine2: "มาสร้างมันด้วยกัน",
    body: "ผมยินดีเสมอที่จะคุยเรื่องเทคโนโลยี ไอเดียสร้างสรรค์ และโอกาสในการสร้างสิ่งที่มีความหมาย",
    sendEmail: "ส่งอีเมล",
    copied: "คัดลอกแล้ว",
    copiedSr: "คัดลอกอีเมลแล้ว",
    github: "GitHub",
  },
  footer: {
    backToTop: "กลับขึ้นด้านบน",
  },
  detail: {
    back: "โปรเจกต์ทั้งหมด",
    loading: "กำลังโหลดโปรเจกต์...",
    visitLive: "เปิดเว็บไซต์จริง",
    sourceCode: "ซอร์สโค้ด",
    aboutProject: "เกี่ยวกับโปรเจกต์นี้",
    role: "บทบาท",
    techStack: "เทคโนโลยีที่ใช้",
  },
};

export const dict: Record<Lang, Dict> = { en, th };