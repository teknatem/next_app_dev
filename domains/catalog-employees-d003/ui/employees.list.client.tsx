'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState
} from '@tanstack/react-table';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import { type Employee } from '../model/employees.schema';
import { EmployeeDetails } from './employees.details.client';
import { useCurrentDomainContext } from '@/shared/store/current-domain-context';
import { Pencil } from 'lucide-react';

interface EmployeeListProps {
  employees: Employee[];
  departments: string[];
  positions: string[];
  saveAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  striped?: boolean;
}

export function EmployeeList({
  employees,
  departments,
  positions,
  saveAction,
  deleteAction,
  striped = true
}: EmployeeListProps) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Подключение к domain context store
  const {
    currentItem: currentEmployee,
    setCurrentItem: setCurrentEmployee,
    setDomain,
    setCounts
  } = useCurrentDomainContext();

  // Инициализация домена при монтировании
  useEffect(() => {
    setDomain('employees');
  }, [setDomain]);

  // Фильтрация по активности
  const filteredEmployees = useMemo(() => {
    if (showActiveOnly) {
      return employees.filter((emp) => emp.isActive);
    }
    return employees;
  }, [employees, showActiveOnly]);

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const handleSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const formAction = (formData: FormData) => {
    saveAction(formData);
    handleSuccess();
  };

  // Обработчик выбора строки
  const handleRowClick = (employee: Employee) => {
    setCurrentEmployee(employee);
  };

  // Определение колонок
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'fullName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            ФИО
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => (
          <div className="font-medium">{getValue<string>()}</div>
        ),
        enableGlobalFilter: true
      },
      {
        accessorKey: 'email',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Email
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => getValue<string>() || '-',
        enableGlobalFilter: true
      },
      {
        accessorKey: 'position',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Должность
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => getValue<string>(),
        enableGlobalFilter: true
      },
      {
        accessorKey: 'department',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Отдел
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => getValue<string>(),
        enableGlobalFilter: true,
        filterFn: 'equals'
      },
      {
        accessorKey: 'isActive',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Статус
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => (
          <Badge variant={getValue<boolean>() ? 'default' : 'secondary'}>
            {getValue<boolean>() ? 'Активный' : 'Неактивный'}
          </Badge>
        ),
        sortingFn: 'basic'
      },
      {
        accessorKey: 'createdAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="h-auto p-0 font-semibold"
          >
            Дата создания
            {column.getIsSorted() === 'asc' && ' ▲'}
            {column.getIsSorted() === 'desc' && ' ▼'}
          </Button>
        ),
        cell: ({ getValue }) => formatDate(getValue<Date>()),
        sortingFn: 'datetime'
      },
      {
        id: 'actions',
        header: () => <div className="text-right">Действия</div>,
        cell: ({ row }) => {
          const employee = row.original;
          return (
            <div
              className="flex items-center justify-end space-x-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => openEditDialog(employee)}
                className="h-7 w-7" // Уменьшаем кнопку
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Редактировать</span>
              </Button>
            </div>
          );
        },
        enableSorting: false
      }
    ],
    []
  );

  const table = useReactTable({
    data: filteredEmployees,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter
    },
    enableGlobalFilter: true,
    globalFilterFn: 'includesString'
  });

  // Обновление счетчиков в domain context
  useEffect(() => {
    const totalCount = employees.length;
    const filteredCount = table.getFilteredRowModel().rows.length;
    setCounts(totalCount, filteredCount);
  }, [employees.length, table.getFilteredRowModel().rows.length, setCounts]);

  // Получаем значение фильтра по отделу
  const departmentFilter =
    (table.getColumn('department')?.getFilterValue() as string) || '';

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Поиск по имени</Label>
              <Input
                id="search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Введите имя..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Отдел</Label>
              <select
                id="department"
                value={departmentFilter}
                onChange={(e) =>
                  table
                    .getColumn('department')
                    ?.setFilterValue(e.target.value || undefined)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Все отделы</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="activeOnly"
                checked={showActiveOnly}
                onCheckedChange={(checked) =>
                  setShowActiveOnly(checked as boolean)
                }
              />
              <Label htmlFor="activeOnly">Только активные</Label>
            </div>

            <div className="flex items-end">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>Добавить сотрудника</Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Добавить нового сотрудника</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о новом сотруднике
                    </DialogDescription>
                  </DialogHeader>
                  <EmployeeDetails
                    formAction={formAction}
                    onCancel={() => setIsCreateDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Информация о выбранном сотруднике */}
      {currentEmployee && (
        <Card>
          <CardHeader>
            <CardTitle>Выбранный сотрудник</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="font-medium">{currentEmployee.fullName}</div>
              <div className="text-sm text-gray-500">
                {currentEmployee.position}
              </div>
              <div className="text-sm text-gray-500">
                {currentEmployee.department}
              </div>
              <Badge
                variant={currentEmployee.isActive ? 'default' : 'secondary'}
              >
                {currentEmployee.isActive ? 'Активный' : 'Неактивный'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Таблица сотрудников */}
      <Card>
        <CardHeader>
          <CardTitle>
            Сотрудники ({table.getFilteredRowModel().rows.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className={`table-1c${striped ? ' table-1c-striped' : ''}`}>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => {
                  const employee = row.original;
                  const isSelected = currentEmployee?.id === employee.id;

                  return (
                    <TableRow
                      key={row.id}
                      onClick={() => handleRowClick(employee)}
                      className={`cursor-pointer transition-colors hover:bg-gray-50`}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          style={{
                            paddingTop: '4px',
                            paddingBottom: '4px',
                            background: isSelected
                              ? 'linear-gradient(to bottom, #f7fee7, #ecfccb, #f7fee7)'
                              : undefined,
                            width:
                              cell.column.id === 'actions' ? '80px' : undefined
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {table.getFilteredRowModel().rows.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Сотрудники не найдены
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог редактирования */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Редактировать сотрудника</DialogTitle>
            <DialogDescription>
              Измените информацию о сотруднике
            </DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <EmployeeDetails
              employee={editingEmployee}
              formAction={formAction}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
