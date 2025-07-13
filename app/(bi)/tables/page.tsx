'use client';
import {
  Database,
  Table as TableIcon,
  Plus,
  Search,
  Settings,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const tableConfigs = [
  {
    id: 'production_items',
    name: 'Номенклатура производства',
    description:
      'Каталог производственных материалов, полуфабрикатов и готовых изделий',
    recordCount: 0,
    lastUpdated: 'Не заполнено',
    status: 'ready',
    icon: '📦',
    href: '/tables/production-items'
  },
  {
    id: 'production_items_consumption',
    name: 'Расход номенклатуры',
    description:
      'Учет расхода производственных материалов по документам и датам',
    recordCount: 0,
    lastUpdated: 'Не заполнено',
    status: 'ready',
    icon: '📊',
    href: '/tables/production-items-consumption'
  }
];

const TableRow = ({ table }: { table: (typeof tableConfigs)[0] }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'Готово';
      case 'pending':
        return 'В процессе';
      case 'error':
        return 'Ошибка';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4">
      {/* Левая часть - иконка и информация */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="text-xl flex-shrink-0">{table.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{table.name}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {table.description}
          </p>
        </div>
      </div>

      {/* Средняя часть - статистика */}
      <div className="flex items-center gap-6 text-sm flex-shrink-0">
        <div className="text-center">
          <div className="font-medium">
            {table.recordCount.toLocaleString()}
          </div>
          <div className="text-muted-foreground">записей</div>
        </div>
        <div className="text-center">
          <Badge className={getStatusColor(table.status)}>
            {getStatusText(table.status)}
          </Badge>
        </div>
      </div>

      {/* Правая часть - действия */}
      <div className="flex items-center gap-2 lg:ml-6 flex-shrink-0">
        <Button asChild size="sm" className="flex-1 lg:flex-none">
          <Link href={table.href}>
            <Search className="w-4 h-4 mr-2" />
            <span className="lg:hidden">Просмотр</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`${table.href}/analytics`}>
            <BarChart3 className="w-4 h-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm">
          <Link href={`${table.href}/settings`}>
            <Settings className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Быстрые действия
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <Button asChild className="w-full justify-start">
        <Link href="/import">
          <Plus className="w-4 h-4 mr-2" />
          Импорт данных
        </Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/tables/new">
          <TableIcon className="w-4 h-4 mr-2" />
          Добавить таблицу
        </Link>
      </Button>
      <Button asChild variant="outline" className="w-full justify-start">
        <Link href="/analytics">
          <BarChart3 className="w-4 h-4 mr-2" />
          Аналитика
        </Link>
      </Button>
    </CardContent>
  </Card>
);

export default function TablesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="w-8 h-8" />
            Управление таблицами
          </h1>
          <p className="text-muted-foreground mt-2">
            Просмотр, редактирование и управление таблицами базы данных
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Основной контент */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Все таблицы</TabsTrigger>
              <TabsTrigger value="production">Производство</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="space-y-3">
                {tableConfigs.map((table) => (
                  <TableRow key={table.id} table={table} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="production" className="space-y-4">
              <div className="space-y-3">
                {tableConfigs
                  .filter((table) => table.id.includes('production'))
                  .map((table) => (
                    <TableRow key={table.id} table={table} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                Аналитические таблицы будут добавлены в следующих версиях
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Боковая панель */}
        <div className="space-y-4">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
