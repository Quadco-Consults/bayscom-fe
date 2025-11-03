'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from '@/lib/types';

const userSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Phone number is required'),
  roleId: z.string().min(1, 'Role is required'),
  departmentId: z.string().min(1, 'Department is required'),
  positionId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended', 'on-leave', 'terminated']),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
  user?: User;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

// Mock data - replace with actual API calls
const roles = [
  { id: '1', name: 'Admin' },
  { id: '2', name: 'Station Manager' },
  { id: '3', name: 'Driver' },
  { id: '4', name: 'Accountant' },
  { id: '5', name: 'HR Officer' },
  { id: '6', name: 'Operations Officer' },
];

const departments = [
  { id: '1', name: 'Management' },
  { id: '2', name: 'Operations' },
  { id: '3', name: 'Logistics & Fleet' },
  { id: '4', name: 'Sales & Marketing' },
  { id: '5', name: 'Finance & Accounting' },
  { id: '6', name: 'Human Resources' },
];

const positions = [
  { id: '1', title: 'Operations Director' },
  { id: '2', title: 'Station Manager' },
  { id: '3', title: 'Truck Driver' },
  { id: '4', title: 'Fleet Manager' },
  { id: '5', title: 'Accountant' },
  { id: '6', title: 'HR Officer' },
];

export function UserForm({ user, onSubmit, onCancel }: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          roleId: user.roleId,
          departmentId: user.departmentId,
          positionId: user.positionId || '',
          status: user.status,
        }
      : {
          status: 'active',
        },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
          <Input {...register('firstName')} placeholder="Enter first name" />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
          <Input {...register('lastName')} placeholder="Enter last name" />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
        <Input type="email" {...register('email')} placeholder="user@bayscom.com" />
        {errors.email && (
          <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
        <Input {...register('phoneNumber')} placeholder="+234 800 000 0000" />
        {errors.phoneNumber && (
          <p className="text-xs text-red-600 mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
          <select
            {...register('departmentId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
          {errors.departmentId && (
            <p className="text-xs text-red-600 mt-1">{errors.departmentId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            {...register('positionId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
          >
            <option value="">Select Position</option>
            {positions.map(pos => (
              <option key={pos.id} value={pos.id}>{pos.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role*</label>
          <select
            {...register('roleId')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
          {errors.roleId && (
            <p className="text-xs text-red-600 mt-1">{errors.roleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
          <select
            {...register('status')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B1538]"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="on-leave">On Leave</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}
