import type { CvCaseStudy, CvData } from "./resumeData";

export function listCaseStudyIds(cv: CvData["cv"]): string[] {
  return (cv.case_studies?.items ?? []).map((s) => s.id);
}

export function getCaseStudyById(cv: CvData["cv"], id: string): CvCaseStudy | undefined {
  return cv.case_studies?.items?.find((s) => s.id === id);
}
