import { Subsystem, Page } from '@/shared/config/subsystems';

export const getSubsystemBySlug = (slug: string, subsystems: Subsystem[]): Subsystem | undefined => {
  return subsystems.find(s => s.slug === slug);
};

export const getAllPages = (subsystems: Subsystem[]): Page[] => {
  return subsystems.flatMap(s => s.pages);
}; 