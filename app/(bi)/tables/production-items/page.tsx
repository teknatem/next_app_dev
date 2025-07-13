'use client';

import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';
import { ProductionItemsTable } from '@/widgets/production-items-table/ui/production-items-table';

const ProductionItemsPage = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Навигация */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/tables">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к таблицам
          </Link>
        </Button>
        <div className="h-6 w-px bg-border" />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            📦 Номенклатура производства
          </h1>
          <p className="text-sm text-muted-foreground">
            Каталог производственных материалов, полуфабрикатов и готовых
            изделий
          </p>
        </div>
      </div>

      {/* Действия */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Добавить позицию
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Импорт
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Экспорт
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Всего позиций
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Пока нет записей</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Материалы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">type = 'material'</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Готовые изделия
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">type = 'finished'</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Последнее обновление
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">Нет данных</div>
            <p className="text-xs text-muted-foreground">
              Добавьте первую запись
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Таблица данных */}
      <Card>
        <CardHeader>
          <CardTitle>Список номенклатуры</CardTitle>
          <CardDescription>
            Просмотр и редактирование производственной номенклатуры
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Загрузка...</div>
              </div>
            }
          >
            <ProductionItemsTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductionItemsPage;
