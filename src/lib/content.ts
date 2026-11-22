import profileData from '../content/profile.json';
import experienceData from '../content/experience.json';
import skillsData from '../content/skills.json';
import educationData from '../content/education.json';
import projectsData from '../content/projects.json';
import certificationsData from '../content/certifications.json';

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

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  date: string | null;
  verificationUrl: string | null;
}

export const profile = profileData as Profile;
export const experiences = experienceData.experiences as Experience[];
export const skillCategories = skillsData.categories as SkillCategory[];
export const education = educationData.entries as EducationEntry[];
export const portfolioProjects = projectsData.projects as PortfolioProject[];
export const certifications = certificationsData.certifications as Certification[];

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
