export interface Subsystem {
  id: string;
  slug: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  pages: Page[];
}

export interface Page {
  id: string;
  name: string;
  path: string;
  description: string;
  icon: string;
  subsystem: string;
  tags: string[];
}

export const subsystems: Subsystem[] = [
  {
    id: 'bi',
    slug: 'bi',
    name: 'BI Система',
    icon: 'BarChart3',
    color: 'blue',
    description: 'Аналитика и отчетность',
    pages: [
      {
        id: 'dashboard',
        name: 'Дашборд',
        path: '/',
        icon: 'Home',
        description: 'Общий обзор системы',
        subsystem: 'bi',
        tags: ['дашборд', 'обзор', 'главная']
      },
      {
        id: 'tables',
        name: 'Таблицы данных',
        path: '/tables',
        icon: 'Database',
        description: 'Управление данными и таблицами',
        subsystem: 'bi',
        tags: ['таблицы', 'данные', 'управление']
      },
      {
        id: 'import',
        name: 'Импорт данных',
        path: '/import',
        icon: 'Upload',
        description: 'Загрузка данных из файлов',
        subsystem: 'bi',
        tags: ['импорт', 'загрузка', 'файлы']
      }
    ]
  },
  {
    id: 'analytics',
    slug: 'analytics',
    name: 'Аналитика',
    icon: 'LineChart',
    color: 'green',
    description: 'Продвинутая аналитика и отчеты',
    pages: [
      {
        id: 'reports',
        name: 'Отчеты',
        path: '/reports',
        icon: 'FileText',
        description: 'Генерация и просмотр отчетов',
        subsystem: 'analytics',
        tags: ['отчеты', 'генерация', 'просмотр']
      }
    ]
  },
  {
    id: 'data',
    slug: 'data',
    name: 'Данные',
    icon: 'Database',
    color: 'purple',
    description: 'Управление данными',
    pages: [
      {
        id: 'production-items',
        name: 'Товары',
        path: '/tables/production-items',
        icon: 'Package',
        description: 'Управление товарами',
        subsystem: 'data',
        tags: ['товары', 'продукция', 'items']
      },
      {
        id: 'customers',
        name: 'Клиенты',
        path: '/customers',
        icon: 'Users2',
        description: 'Управление клиентами',
        subsystem: 'data',
        tags: ['клиенты', 'customers', 'пользователи']
      }
    ]
  }
]; 