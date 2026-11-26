import profileData from '../content/profile.json';
import experienceData from '../content/experience.json';
import skillsData from '../content/skills.json';
import educationData from '../content/education.json';
import projectsData from '../content/projects.json';
import certificationsData from '../content/certifications.json';
import researchData from '../content/research.json';
import writingData from '../content/writing.json';

export interface Profile {
  name: string;
  headline: string;
  location: string;
  summary: string;
  interests: string[];
  contact: {
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
  };
}

export interface Contribution {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

export interface ExperienceProject {
  id: string;
  name: string;
  kind: string;
  url: string | null;
  description: string;
  roleContext: string;
  contributions: Contribution[];
}

export interface Experience {
  id: string;
  employer: string;
  role: string;
  employmentType: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  projects: ExperienceProject[];
}

export interface SkillCategory {
  id: string;
  name: string;
  items: string[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  classification: string;
  classificationSource: string;
}

export interface PortfolioProject {
  id: string;
  name: string;
  type: string;
  summary: string;
  contributions: string[];
  technologies: string[];
}

export interface ResearchCaseStudy {
  domain: string[];
  motivation: string;
  problemStatement: string;
  researchQuestion: string;
  objectives: string[];
  methodology: string;
  evidenceCollection: string;
  studySelection: string;
  qualityAssessment: string;
  findings: string;
  discussion: string;
  limitations: string;
  conclusion: string;
  supportingMaterials: {
    title: string;
    url: string;
  }[];
}

export interface CompletedResearch {
  id: string;
  title: string;
  status: 'completed';
  summary: string;
  caseStudy: ResearchCaseStudy;
}

export interface ResearchDirection {
  id: string;
  title: string;
  problem: string;
  methodology: string;
}

export interface ResearchInterest {
  title: string;
  description: string;
}

export interface ResearchPublication {
  title: string;
  authors: string;
  venue: string;
  year: string;
}

export interface WritingArticle {
  slug: string;
  title: string;
  summary: string;
  mediumUrl: string;
  publishedAt?: string;
  readingTime?: string;
  tags: string[];
  topics: string[];
  prerequisites: string[];
  relatedProjects: string[];
  keyTakeaways: string[];
}

export type CredentialType = 'formal-certification' | 'course-completion-certificate';

export interface Credential {
  id: string;
  name: string;
  credentialType: CredentialType | null;
  issuer: string | null;
  completionDate: string | null;
  credentialUrl: string | null;
  credentialId: string | null;
  certificateImage: string | null;
}

export const profile = profileData as Profile;
export const experiences = experienceData.experiences as Experience[];
export const skillCategories = skillsData.categories as SkillCategory[];
export const education = educationData.entries as EducationEntry[];
export const portfolioProjects = projectsData.projects as PortfolioProject[];
export const credentials = certificationsData.credentials as Credential[];
export const completedResearch = researchData.completed as CompletedResearch[];
export const researchPublications = researchData.publications as ResearchPublication[];
export const researchInterests = researchData.interests as ResearchInterest[];
export const activeResearch = researchData.active as ResearchDirection[];
export const plannedResearch = researchData.planned as ResearchDirection[];
export const writingArticles = writingData.articles as WritingArticle[];

export const formatPeriod = (startDate: string, endDate: string | null, current = false) => {
  const formatDate = (date: string) => {
    const [year, month] = date.split('-');
    if (!month) return year;
    return new Date(Number(year), Number(month) - 1).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return `${formatDate(startDate)} - ${current ? 'Present' : endDate ? formatDate(endDate) : 'Present'}`;
};
