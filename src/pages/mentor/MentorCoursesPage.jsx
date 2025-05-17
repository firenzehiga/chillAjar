import React from "react";
import { BookOpen, Plus, Pencil, Trash, Star } from "lucide-react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Sample data
const courses = [
	{
		id: 1,
		title: "Advanced Mathematics",
		category: "Mathematics",
		students: 15,
		rating: 4.8,
	},
	{
		id: 2,
		title: "Web Development",
		category: "Programming",
		students: 12,
		rating: 4.9,
	},
	// Add more courses...
];

export function MentorCoursesPage() {
	const columnHelper = createColumnHelper();

	const courseColumns = [
		columnHelper.accessor("title", {
			header: "Title",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("category", {
			header: "Category",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("students", {
			header: "Students",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("rating", {
			header: "Rating",
			cell: (info) => (
				<div className="flex items-center">
					<Star className="w-4 h-4 text-yellow-400 fill-current" />
					<span className="ml-1">{info.getValue()}</span>
				</div>
			),
		}),
		columnHelper.display({
			id: "actions",
			cell: (info) => (
				<div className="flex space-x-2">
					<button
						type="button"
						className="p-1 text-blue-600 hover:text-blue-800"
					>
						<Pencil className="w-4 h-4" />
					</button>
					<button type="button" className="p-1 text-red-600 hover:text-red-800">
						<Trash className="w-4 h-4" />
					</button>
				</div>
			),
		}),
	];

	const coursesTable = useReactTable({
		data: courses,
		columns: courseColumns,
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
					<BookOpen className="w-6 h-6 mr-2 text-blue-600" />
					My Courses
				</h1>
				<p className="text-gray-600">Manage your courses</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">My Courses</h2>
					<button
						type="button"
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Course
					</button>
				</div>
				{renderTable(coursesTable)}
			</div>
		</div>
	);
}
