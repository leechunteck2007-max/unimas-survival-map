export type CollegePhoto = {
  alt: string;
  label: string;
  sourceUrl: string;
  url: string;
  year: string;
};

export type ResidentialCollege = {
  capacity?: number;
  highlights: string[];
  id: string;
  mapPosition: [number, number];
  mapPositionSource: "OpenStreetMap" | "Public location directory";
  name: string;
  photo?: CollegePhoto;
  researchNote: string;
  sourceUrl: string;
};
