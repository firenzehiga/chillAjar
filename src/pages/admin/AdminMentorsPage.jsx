import React from "react";
import { UserCheck, Plus, Pencil, Trash } from "lucide-react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Sample data
const mentors = [
	{ id: 1, name: "Dr. Smith", expertise: "Mathematics", rating: 4.8 },
	{ id: 2, name: "Prof. Johnson", expertise: "Programming", rating: 4.9 },
	// Add more mentors...
];

export function AdminMentorsPage() {
	const columnHelper = createColumnHelper();

	const mentorColumns = [
		columnHelper.accessor("name", {
			header: "Name",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("expertise", {
			header: "Expertise",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("rating", {
			header: "Rating",
			cell: (info) => info.getValue(),
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

	const mentorsTable = useReactTable({
		data: mentors,
		columns: mentorColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const renderTable = (table) => (
		<div className="mt-4 overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
					<UserCheck className="w-6 h-6 mr-2 text-blue-600" />
					Manage Mentors
				</h1>
				<p className="text-gray-600">Manage platform mentors</p>
			</div>

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
		</div>
	);
}
export default AdminMentorsPage;
