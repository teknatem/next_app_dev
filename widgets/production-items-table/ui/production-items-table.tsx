'use client';

import { MoreHorizontal, Edit, Trash2, Search } from 'lucide-react';
import { useState } from 'react';

import {
  getProductionItemTypeLabel,
  getProductionItemTypeColor,
  type ProductionItem
} from '@/entities/production-item';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Input } from '@/shared/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';

// Данные теперь получаем через entities API

interface ProductionItemsTableProps {
  items?: ProductionItem[];
}

export function ProductionItemsTable({
  items = []
}: ProductionItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.article &&
        item.article.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground mb-4">
          В таблице пока нет записей
        </div>
        <Button>Добавить первую позицию</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Поиск */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по названию, коду или артикулу..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Таблица */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Наименование</TableHead>
              <TableHead>Код</TableHead>
              <TableHead>Артикул</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Создано</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <code className="px-2 py-1 bg-muted rounded text-sm">
                    {item.code}
                  </code>
                </TableCell>
                <TableCell>
                  {item.article ? (
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                      {item.article}
                    </code>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={getProductionItemTypeColor(item.type)}>
                    {getProductionItemTypeLabel(item.type)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Действия</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredData.length === 0 && searchTerm && (
        <div className="text-center py-4 text-muted-foreground">
          Нет результатов для поиска "{searchTerm}"
        </div>
      )}
    </div>
  );
}
