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
}

export function EmployeeList({
  employees,
  departments,
  positions,
  saveAction,
  deleteAction
}: EmployeeListProps) {
  const [filteredEmployees, setFilteredEmployees] =
    useState<Employee[]>(employees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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

    setFilteredEmployees(filtered);
  }, [employees, searchQuery, selectedDepartment, showActiveOnly]);

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ФИО</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Должность</TableHead>
                <TableHead>Отдел</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата создания</TableHead>
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
