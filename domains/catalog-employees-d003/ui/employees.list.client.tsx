'use client';

import { useState, useEffect } from 'react';
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

interface EmployeeListProps {
  employees: Employee[];
  departments: string[];
  positions: string[];
  saveAction: (formData: FormData) => void;
  deleteAction: (formData: FormData) => void;
  striped?: boolean; // Добавлен проп для зебры
}

export function EmployeeList({
  employees,
  departments,
  positions,
  saveAction,
  deleteAction,
  striped = true // По умолчанию зебра включена
}: EmployeeListProps) {
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<keyof Employee | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Функция сортировки
  const sortEmployees = (emps: Employee[]) => {
    if (!sortKey) return emps;
    return [...emps].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDir === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
      }
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDir === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }
      return 0;
    });
  };

  // Фильтрация сотрудников
  useEffect(() => {
    let filtered = employees;

    if (searchQuery) {
      filtered = filtered.filter((emp) =>
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedDepartment) {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment
      );
    }

    if (showActiveOnly) {
      filtered = filtered.filter((emp) => emp.isActive);
    }

    setFilteredEmployees(sortEmployees(filtered));
  }, [
    employees,
    searchQuery,
    selectedDepartment,
    showActiveOnly,
    sortKey,
    sortDir
  ]);

  const handleSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    // Maybe show a toast notification here
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('ru-RU');
  };

  const formAction = (formData: FormData) => {
    saveAction(formData);
    handleSuccess();
  };

  // Обработчик клика по заголовку
  const handleSort = (key: keyof Employee) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите имя..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Отдел</Label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
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

      {/* Таблица сотрудников */}
      <Card>
        <CardHeader>
          <CardTitle>Сотрудники ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className={`table-1c${striped ? ' table-1c-striped' : ''}`}>
              <TableHeader>
                <TableRow>
                  <TableHead
                    onClick={() => handleSort('fullName')}
                    style={{ cursor: 'pointer' }}
                  >
                    ФИО{' '}
                    {sortKey === 'fullName' && (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('email')}
                    style={{ cursor: 'pointer' }}
                  >
                    Email{' '}
                    {sortKey === 'email' && (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('position')}
                    style={{ cursor: 'pointer' }}
                  >
                    Должность{' '}
                    {sortKey === 'position' && (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('department')}
                    style={{ cursor: 'pointer' }}
                  >
                    Отдел{' '}
                    {sortKey === 'department' &&
                      (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('isActive')}
                    style={{ cursor: 'pointer' }}
                  >
                    Статус{' '}
                    {sortKey === 'isActive' && (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead
                    onClick={() => handleSort('createdAt')}
                    style={{ cursor: 'pointer' }}
                  >
                    Дата создания{' '}
                    {sortKey === 'createdAt' && (sortDir === 'asc' ? '▲' : '▼')}
                  </TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.fullName}
                    </TableCell>
                    <TableCell>{employee.email || '-'}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.isActive ? 'default' : 'secondary'}
                      >
                        {employee.isActive ? 'Активный' : 'Неактивный'}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(employee.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(employee)}
                        >
                          Редактировать
                        </Button>
                        <form action={deleteAction}>
                          <input
                            type="hidden"
                            name="employeeId"
                            value={employee.id}
                          />
                          <Button
                            type="submit"
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              if (
                                !confirm(
                                  `Вы уверены, что хотите деактивировать сотрудника "${employee.fullName}"?`
                                )
                              ) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Деактивировать
                          </Button>
                        </form>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredEmployees.length === 0 && (
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
