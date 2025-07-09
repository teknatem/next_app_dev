import { Page } from '@/shared/config/subsystems';

export const searchPages = (query: string, pages: Page[]): Page[] => {
  if (!query.trim()) return [];
  
  const searchTerm = query.toLowerCase().trim();
  
  return pages.filter(page => {
    const pageText = [
      page.name.toLowerCase(),
      page.description.toLowerCase(),
      page.subsystem.toLowerCase(),
      ...page.tags.map(tag => tag.toLowerCase())
    ].join(' ');
    
    // Простой поиск по подстроке
    return pageText.includes(searchTerm);
  });
}; 