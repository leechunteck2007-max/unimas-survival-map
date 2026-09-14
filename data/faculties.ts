import type { Faculty } from "@/types/faculty";

const commonAddress =
  "Universiti Malaysia Sarawak, 94300 Kota Samarahan, Sarawak, Malaysia";

export const faculties = [
  {
    id: "feng",
    slug: "faculty-of-engineering",
    name: "Faculty of Engineering",
    shortName: "FENG",
    category: "faculty",
    description:
      "UNIMAS faculty for civil, mechanical, electrical and electronic, and chemical engineering education.",
    latitude: 1.468314,
    longitude: 110.4267126,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.feng.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "engineering", "civil", "mechanical", "electrical", "chemical"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.unimas.my/feng",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/8395900",
    lastUpdated: "2026-09-14",
  },
  {
    id: "fmhs",
    slug: "faculty-of-medicine-and-health-sciences",
    name: "Faculty of Medicine and Health Sciences",
    shortName: "FMHS",
    category: "faculty",
    description:
      "UNIMAS faculty for medicine, nursing, and health-science teaching and research.",
    latitude: 1.4636275,
    longitude: 110.4315086,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.fmhs.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "medicine", "medical", "health", "nursing"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.fmhs.unimas.my/",
    coordinateSourceUrl: "https://www.openstreetmap.org/way/1293389655",
    lastUpdated: "2026-09-14",
  },
  {
    id: "frst",
    slug: "faculty-of-resource-science-and-technology",
    name: "Faculty of Resource Science and Technology",
    shortName: "FRST",
    category: "faculty",
    description:
      "UNIMAS faculty focused on natural-resource science, management, conservation, and resource technology.",
    latitude: 1.469668,
    longitude: 110.4281852,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.frst.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "resource science", "technology", "biology", "conservation"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.frst.unimas.my/home/fsts-info",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/8395891",
    lastUpdated: "2026-09-14",
  },
  {
    id: "fbe",
    slug: "faculty-of-built-environment",
    name: "Faculty of Built Environment",
    shortName: "FBE",
    category: "faculty",
    description:
      "UNIMAS faculty for built-environment education, including architecture and quantity surveying.",
    latitude: 1.4679207,
    longitude: 110.4473253,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.fbe.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "built environment", "architecture", "quantity surveying"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.unimas.my/fbe",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/4572612",
    lastUpdated: "2026-09-14",
  },
  {
    id: "feb",
    slug: "faculty-of-economics-and-business",
    name: "Faculty of Economics and Business",
    shortName: "FEB",
    category: "faculty",
    description:
      "UNIMAS faculty for economics, business, accountancy, finance, marketing, and management.",
    latitude: 1.463752,
    longitude: 110.4300178,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.feb.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "economics", "business", "accounting", "finance", "marketing"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.feb.unimas.my/",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/8395870",
    lastUpdated: "2026-09-14",
  },
  {
    id: "fcshd",
    slug: "faculty-of-cognitive-sciences-and-human-development",
    name: "Faculty of Cognitive Sciences and Human Development",
    shortName: "FCSHD",
    category: "faculty",
    description:
      "UNIMAS faculty spanning cognitive science, human resource development, counselling, and psychology.",
    latitude: 1.4628546,
    longitude: 110.4291775,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.fcshd.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "cognitive science", "human development", "counselling", "psychology"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.unimas.my/fcshd",
    coordinateSourceUrl: "https://www.openstreetmap.org/way/483865101",
    lastUpdated: "2026-09-14",
  },
  {
    id: "fssh",
    slug: "faculty-of-social-sciences-and-humanities",
    name: "Faculty of Social Sciences and Humanities",
    shortName: "FSSH",
    category: "faculty",
    description:
      "UNIMAS faculty for social sciences and humanities, including international studies, social work, and development studies.",
    latitude: 1.4637718,
    longitude: 110.4291567,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.fssh.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "social sciences", "humanities", "social work", "international studies"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.unimas.my/fssh",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/7150699",
    lastUpdated: "2026-09-14",
  },
  {
    id: "faca",
    slug: "faculty-of-applied-and-creative-arts",
    name: "Faculty of Applied and Creative Arts",
    shortName: "FACA",
    category: "faculty",
    description:
      "UNIMAS faculty for applied and creative arts, with programmes across design, film, animation, fine arts, music, and theatre.",
    latitude: 1.4637435,
    longitude: 110.4279881,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.faca.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "creative arts", "design", "animation", "music", "theatre"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.faca.unimas.my/",
    coordinateSourceUrl: "https://www.openstreetmap.org/relation/7122551",
    lastUpdated: "2026-09-14",
  },
  {
    id: "fcsit",
    slug: "faculty-of-computer-science-and-information-technology",
    name: "Faculty of Computer Science and Information Technology",
    shortName: "FCSIT",
    category: "faculty",
    description:
      "UNIMAS faculty for computer science, data engineering, multimedia, network computing, and software engineering.",
    latitude: 1.468468,
    longitude: 110.4289035,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.fcsit.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "computer science", "IT", "software", "data", "network"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.unimas.my/fcsit",
    coordinateSourceUrl: "https://www.openstreetmap.org/way/599500539",
    lastUpdated: "2026-09-14",
  },
  {
    id: "felc",
    slug: "faculty-of-education-language-and-communication",
    name: "Faculty of Education, Language and Communication",
    shortName: "FELC",
    category: "faculty",
    description:
      "UNIMAS faculty offering education, language, linguistics, and communication-focused programmes.",
    latitude: 1.4641714,
    longitude: 110.4283941,
    address: commonAddress,
    openingHours: null,
    phone: null,
    email: null,
    website: "https://www.felc.unimas.my/",
    imageUrl: null,
    facilities: [],
    tags: ["faculty", "education", "language", "communication", "linguistics"],
    verified: true,
    coordinateVerified: true,
    sourceUrl: "https://www.felc.unimas.my/",
    coordinateSourceUrl: "https://www.openstreetmap.org/way/483864195",
    lastUpdated: "2026-09-14",
  },
] satisfies Faculty[];

export function getFacultyById(id: string) {
  return faculties.find((faculty) => faculty.id === id);
}

export function getFacultyBySlug(slug: string) {
  return faculties.find((faculty) => faculty.slug === slug);
}

export function searchFaculties(query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  if (!normalizedQuery) return faculties;

  return faculties.filter((faculty) =>
    [faculty.name, faculty.shortName, ...faculty.tags].some((value) =>
      value.toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function hasValidCoordinates(
  faculty: Faculty,
): faculty is Faculty & { latitude: number; longitude: number } {
  return (
    faculty.coordinateVerified &&
    typeof faculty.latitude === "number" &&
    Number.isFinite(faculty.latitude) &&
    faculty.latitude >= -90 &&
    faculty.latitude <= 90 &&
    typeof faculty.longitude === "number" &&
    Number.isFinite(faculty.longitude) &&
    faculty.longitude >= -180 &&
    faculty.longitude <= 180
  );
}

export const mappableFaculties = faculties.filter(hasValidCoordinates);
