import { X, BookOpen } from "lucide-react";
import { getImageUrl } from "../utils/getImageUrl";
import useLockBodyScroll from "@/hooks/utils/useLockBodyScroll";
import { motion } from "framer-motion";
export function CourseSelectionModal({
	courses,
	onSelect,
	onConfirm,
	onClose,
	selectedCourse,
	onCoursePackageSelect, // New prop to handle course selection and trigger package modal
}) {
	useLockBodyScroll(true);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg w-full max-w-3xl">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							Pilih Kursus yang Diinginkan
						</h2>
						<button
							type="button"
							onClick={onClose}
							className="text-gray-500 hover:text-gray-700 transition-colors">
							<X className="w-5 h-5" />
						</button>
					</div>
				</div>

				<div className="p-6 max-h-[60vh] overflow-y-auto">
					<div className="space-y-4">
						{courses.length === 0 ? (
							<div className="text-center text-gray-500 py-8">
								Mentor ini belum menetapkan kursus.
								<br /> Silahkan memilih kursus lain.
							</div>
						) : (
							courses.map((course) => (
								<button
									type="button"
									key={course.id}
									onClick={() => onSelect(course)}
									className={`w-full text-left rounded-xl border-2 transition-all outline-none focus:outline-none flex flex-col gap-2 p-3 sm:p-4 shadow-sm ${
										selectedCourse?.id === course.id
											? "border-blue-500 bg-blue-50"
											: "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
									}`}>
									<div className="flex items-center gap-3">
										{/* Foto mentor */}
										{course.mentor && (
											<img
												src={getImageUrl(
													course.mentor.mentorImage,
													"/foto_kursus/default.jpg"
												)}
												alt={course.mentor?.mentorName || "Nama Mentor"}
												className="w-10 h-10 rounded-full border-2 border-blue-400 shadow object-cover bg-white"
												onError={(e) => {
													e.target.onerror = null;
													e.target.src = "/foto_kursus/default.jpg";
												}}
											/>
										)}
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<BookOpen className="w-5 h-5 text-blue-500" />
												<span className="font-semibold text-gray-900 text-base truncate">
													{course.courseName}
												</span>
											</div>
											<span className="block text-xs text-gray-500 mt-0.5 truncate">
												{course.mentor?.mentorName}
											</span>
										</div>
									</div>
									<div className="pl-1">
										<p className="text-xs text-gray-700 mb-1 leading-snug">
											{course.courseDescription}
										</p>
										{/* Dibawha ini kalau mau nampilin lokasinya */}
										{/* {course.schedules &&
											course.schedules.length > 0 &&
											(() => {
												const hasOnline = course.schedules.some(
													(sch) => sch.gayaMengajar?.toLowerCase() === "online"
												);
												const offlineLocs = course.schedules
													.filter(
														(sch) =>
															sch.gayaMengajar?.toLowerCase() === "offline" &&
															sch.tempat
													)
													.map((sch) => sch.tempat)
													.filter(Boolean);

												return (
													<div className="text-xs text-gray-400 mt-1">
														<span className="text-gray-900 font-medium block mb-1">
															Lokasi:
														</span>
														<ul className="ml-3 list-disc space-y-0.5">
															{hasOnline && (
																<li className="text-gray-700">Online</li>
															)}
															{offlineLocs.map((loc, idx) => (
																<li className="text-gray-700" key={idx}>
																	{loc}
																</li>
															))}
														</ul>
													</div>
												);
											})()} */}
										{/* Yang Sekarang Dipakai: Menampilkan gaya mengajar */}
										{(() => {
											if (course.schedules && course.schedules.length > 0) {
												const hasOnline = course.schedules.some(
													(sch) => sch.gayaMengajar?.toLowerCase() === "online"
												);
												const hasOffline = course.schedules.some(
													(sch) => sch.gayaMengajar?.toLowerCase() === "offline"
												);
												let metode = "";
												if (hasOnline && hasOffline)
													metode = "Online & Offline";
												else if (hasOnline) metode = "Online";
												else if (hasOffline) metode = "Offline";

												return (
													<div className="text-xs text-gray-400 mt-1">
														<span className="text-gray-900 font-medium">
															Gaya Belajar:
														</span>{" "}
														<span className="font-semibold text-blue-600">
															{metode}
														</span>
													</div>
												);
											} else {
												return (
													<div className="text-xs text-gray-400 mt-1">
														<span className="text-red-600 font-medium">
															Belum ada jadwal
														</span>{" "}
													</div>
												);
											}
										})()}
									</div>
								</button>
							))
						)}
					</div>
				</div>

				<div className="p-6 border-t bg-gray-50">
					<div className="flex justify-end space-x-3">
						<button
							type="button"
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
							Batal
						</button>
						<button
							type="button"
							onClick={() => {
								if (selectedCourse && onCoursePackageSelect) {
									onCoursePackageSelect(selectedCourse);
								} else {
									onConfirm();
								}
							}}
							className={`px-4 py-2 rounded-lg font-medium ${
								selectedCourse
									? "bg-blue-500 text-white hover:bg-blue-600"
									: "bg-gray-200 text-gray-500 cursor-not-allowed"
							}`}
							disabled={!selectedCourse}>
							{onCoursePackageSelect
								? "Lanjut Pilih Paket"
								: "Konfirmasi Pilihan"}
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
