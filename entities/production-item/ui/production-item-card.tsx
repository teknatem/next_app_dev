'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { MoreHorizontal, Edit, Trash2, Copy, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import type { ProductionItem } from '../model/types';
import {
  getProductionItemTypeLabel,
  getProductionItemTypeColor
} from '../model/types';

interface ProductionItemCardProps {
  item: ProductionItem;
  onEdit?: (item: ProductionItem) => void;
  onDelete?: (item: ProductionItem) => void;
  onView?: (item: ProductionItem) => void;
}

export function ProductionItemCard({
  item,
  onEdit,
  onDelete,
  onView
}: ProductionItemCardProps) {
  const handleCopyCode = () => {
    navigator.clipboard.writeText(item.code);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-medium">{item.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <code className="px-2 py-1 bg-muted rounded text-xs">
                {item.code}
              </code>
              {item.article && (
                <code className="px-2 py-1 bg-muted/50 rounded text-xs">
                  {item.article}
                </code>
              )}
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Действия</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {onView && (
                <DropdownMenuItem onClick={() => onView(item)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Просмотр
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Редактировать
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleCopyCode}>
                <Copy className="mr-2 h-4 w-4" />
                Копировать код
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(item)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Badge className={getProductionItemTypeColor(item.type)}>
            {getProductionItemTypeLabel(item.type)}
          </Badge>
          <div className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleDateString('ru-RU')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
