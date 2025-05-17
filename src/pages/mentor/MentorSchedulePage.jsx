import React from "react";
import { Calendar, Plus, Pencil, Trash } from "lucide-react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

// Sample data
const schedules = [
	{
		id: 1,
		day: "Monday",
		startTime: "09:00",
		endTime: "17:00",
		mode: "online",
		location: null,
	},
	{
		id: 2,
		day: "Wednesday",
		startTime: "10:00",
		endTime: "18:00",
		mode: "offline",
		location: "Central Library, Room 204",
	},
	{
		id: 3,
		day: "Friday",
		startTime: "14:00",
		endTime: "22:00",
		mode: "online",
		location: "Kampus A2 STT-Terpadu Nurul Fikri",
	},
	// Add more schedules...
];

export function MentorSchedulePage() {
	const columnHelper = createColumnHelper();

	const scheduleColumns = [
		columnHelper.accessor("day", {
			header: "Day",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("startTime", {
			header: "Start Time",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("endTime", {
			header: "End Time",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("mode", {
			header: "Mode",
			cell: (info) => (
				<span
					className={`capitalize ${info.getValue() === "online" ? "text-green-600" : "text-blue-600"}`}
				>
					{info.getValue()}
				</span>
			),
		}),
		columnHelper.accessor("location", {
			header: "Location",
			cell: (info) => info.getValue() || "N/A",
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

	const scheduleTable = useReactTable({
		data: schedules,
		columns: scheduleColumns,
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
					<Calendar className="w-6 h-6 mr-2 text-blue-600" />
					My Schedule
				</h1>
				<p className="text-gray-600">Manage your teaching schedule</p>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Teaching Schedule</h2>
					<button
						type="button"
						className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
					>
						<Plus className="w-4 h-4 mr-2" />
						Add Schedule
					</button>
				</div>
				{renderTable(scheduleTable)}
			</div>
		</div>
	);
}
