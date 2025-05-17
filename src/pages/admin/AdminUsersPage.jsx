import React from "react";
import { Users, Plus, Pencil, Trash } from "lucide-react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Sample data
const users = [
	{ id: 1, name: "John Doe", email: "john@example.com", role: "student" },
	{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "mentor" },
	// Add more users...
];

export function AdminUsersPage() {
	const columnHelper = createColumnHelper();

	const userColumns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("email", {
			header: "Email",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("role", {
			header: "Role",
			cell: (info) => (
				<select
					value={info.getValue()}
					onChange={(e) =>
						handleRoleChange(info.row.original.id, e.target.value)
					}
					className="border rounded px-2 py-1"
				>
					<option value="student">Student</option>
					<option value="mentor">Mentor</option>
					<option value="admin">Admin</option>
				</select>
			),
		}),
		columnHelper.display({
			id: "actions",
			cell: (info) => (
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

	const handleRoleChange = (userId, newRole) => {
		console.log(`Changing role for user ${userId} to ${newRole}`);
		// Implement role change logic here
	};

	const renderTable = (table) => (
		<div className="mt-4 overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
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

	return (
		<div className="py-8">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900 flex items-center">
					<Users className="w-6 h-6 mr-2 text-blue-600" />
					Manage Users
				</h1>
				<p className="text-gray-600">Manage platform users</p>
			</div>

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
		</div>
	);
}
