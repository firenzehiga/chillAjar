import React, { useState } from 'react';
import { Users, BookOpen, Clock, DollarSign, UserCheck, Settings, Pencil, Trash, Plus } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

// Sample data
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'mentor' },
  // Add more users...
];

const courses = [
  { id: 1, title: 'Advanced Mathematics', category: 'Mathematics', price: 50 },
  { id: 2, title: 'Web Development', category: 'Programming', price: 60 },
  // Add more courses...
];

const mentors = [
  { id: 1, name: 'Dr. Smith', expertise: 'Mathematics', rating: 4.8 },
  { id: 2, name: 'Prof. Johnson', expertise: 'Programming', rating: 4.9 },
  // Add more mentors...
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const columnHelper = createColumnHelper();

  const userColumns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: info => (
        <select
          value={info.getValue()}
          onChange={e => handleRoleChange(info.row.original.id, e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const courseColumns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('price', {
      header: 'Price/Hour',
      cell: info => `$${info.getValue()}`,
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const mentorColumns = [
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('expertise', {
      header: 'Expertise',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('rating', {
      header: 'Rating',
      cell: info => info.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      cell: info => (
        <div className="flex space-x-2">
          <button className="p-1 text-blue-600 hover:text-blue-800">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800">
            <Trash className="w-4 h-4" />
          </button>
        </div>
      ),
    }),
  ];

  const usersTable = useReactTable({
    data: users,
    columns: userColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const coursesTable = useReactTable({
    data: courses,
    columns: courseColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const mentorsTable = useReactTable({
    data: mentors,
    columns: mentorColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRoleChange = (userId, newRole) => {
    console.log(`Changing role for user ${userId} to ${newRole}`);
    // Implement role change logic here
  };

  const renderTable = (table) => (
    <div className="mt-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">User Management</h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </button>
            </div>
            {renderTable(usersTable)}
          </div>
        );
      case 'courses':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Course Management</h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </button>
            </div>
            {renderTable(coursesTable)}
          </div>
        );
      case 'mentors':
        return (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Mentor Management</h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Mentor
              </button>
            </div>
            {renderTable(mentorsTable)}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Users className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">1,234</span>
              </div>
              <h3 className="text-gray-600 font-medium">Total Users</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">45</span>
              </div>
              <h3 className="text-gray-600 font-medium">Active Courses</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">12</span>
              </div>
              <h3 className="text-gray-600 font-medium">Pending Approvals</h3>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900">$15,678</span>
              </div>
              <h3 className="text-gray-600 font-medium">Total Revenue</h3>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your platform's resources and users</p>
      </div>

      <div className="mb-8">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Courses
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center ${
              activeTab === 'mentors'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Mentors
          </button>
        </nav>
      </div>

      {renderContent()}
    </div>
  );
}