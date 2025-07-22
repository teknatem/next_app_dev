'use client';

import { useTransition } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { type Employee } from '../types.shared';

interface EmployeeDetailsProps {
  employee?: Employee;
  formAction: (formData: FormData) => void;
  onCancel: () => void;
}

export function EmployeeDetails({
  employee,
  formAction,
  onCancel
}: EmployeeDetailsProps) {
  const [isPending, startTransition] = useTransition();

  const action = (formData: FormData) => {
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>
          {employee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          {employee && (
            <input type="hidden" name="employeeId" value={employee.id} />
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">ФИО *</Label>
              <Input
                id="fullName"
                name="fullName"
                defaultValue={employee?.fullName}
                required
                placeholder="Иванов Иван Иванович"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={employee?.email || ''}
                placeholder="ivanov@company.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Должность *</Label>
              <Input
                id="position"
                name="position"
                defaultValue={employee?.position}
                required
                placeholder="Менеджер"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Отдел *</Label>
              <Input
                id="department"
                name="department"
                defaultValue={employee?.department}
                required
                placeholder="Отдел продаж"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              name="isActive"
              defaultChecked={employee?.isActive ?? true}
            />
            <Label htmlFor="isActive">Активный сотрудник</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" disabled={isPending}>
              {employee ? 'Обновить' : 'Создать'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
