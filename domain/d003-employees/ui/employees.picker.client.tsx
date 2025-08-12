'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/shared/ui/table';
import { Search, User } from 'lucide-react';

import { type Employee } from '../types.shared';
import { formatDate } from '../lib/date-utils';
import {
  searchEmployeesAction,
  getDepartmentsAction
} from '../index';

interface EmployeePickerProps {
  onEmployeeSelect: (employee: Employee) => void;
  triggerButtonText?: string;
  trigger?: React.ReactNode;
}

export function EmployeePicker({
  onEmployeeSelect,
  triggerButtonText = 'Select Employee',
  trigger
}: EmployeePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadEmployees = async (searchQuery?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await searchEmployeesAction({
        query: searchQuery,
        isActive: true // только активные сотрудники
      });

      if (result.success && result.data) {
        setEmployees(result.data);
      } else {
        setError(result.error || 'Failed to load employees');
      }
    } catch (err) {
      setError('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search) {
        loadEmployees(search);
      } else {
        loadEmployees();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (employee: Employee) => {
    onEmployeeSelect(employee);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <User className="mr-2 h-4 w-4" />
            {triggerButtonText}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[70vw] h-[70vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Employee</DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search employees by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Loading employees...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="border rounded-lg overflow-hidden max-h-[50vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {employee.fullName}
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.email || '-'}</TableCell>
                    <TableCell>
                      <Badge
                        variant={employee.isActive ? 'default' : 'secondary'}
                      >
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(employee.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSelect(employee)}
                        className="h-7 px-2 text-xs"
                      >
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {employees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No employees found</p>
                {search && (
                  <p className="text-sm">Try adjusting your search terms</p>
                )}
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
