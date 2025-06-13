import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export function CourseCarousel({ courses, onCourseClick }) {
	// Debug: Lihat data courses yang diterima CourseCarousel
	// console.log("[CourseCarousel] Data courses diterima:", courses);

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 5000,
		arrows: true,
	};

	return (
		<div className="mb-12 -mx-4 sm:mx-0">
			<Slider {...settings}>
				{courses.map((course) => {
					// Hanya gunakan jadwal_kursus (sudah dimapping di parent/Home.jsx)
					const schedules = Array.isArray(course.jadwal_kursus)
						? course.jadwal_kursus
						: [];
					return (
						<div key={course.id} className="px-4">
							<div
								className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
								onClick={() => onCourseClick(course)}>
								<img
									loading="lazy"
									src={course.courseImage}
									alt={course.courseName}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "/foto_kursus/kursus_dummy_1.jpg";
									}}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
									<h3 className="text-3xl font-bold text-white mb-2">
										{course.courseName}
									</h3>
									<p className="text-gray-200 mb-4">
										{course.courseDescription}
									</p>
									<div className="flex items-center justify-between">
										<div className="flex gap-2">
											{/*
                                                Badge mode logic:
                                                - Jika tidak ada jadwal sama sekali, tampilkan badge abu-abu "Tidak ada jadwal"
                                                - Jika ada jadwal, cek semua mode valid (online/offline) dari setiap jadwal
                                                - Jika ada mode valid, tampilkan badge Online/Offline sesuai yang ditemukan
                                                - Jika ada jadwal tapi tidak ada mode valid, tampilkan badge abu-abu "Tidak ada jadwal dengan mode valid"
                                            */}
											{schedules.length === 0 ? (
												<span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm">
													Tidak ada jadwal
												</span>
											) : (
												(() => {
													// Ambil semua mode valid dari setiap jadwal
													const validModes = schedules
														.map((j) => j && j.gayaMengajar)
														.filter(
															(v, i, arr) =>
																(v === "online" || v === "offline") &&
																arr.indexOf(v) === i
														);
													if (validModes.length > 0) {
														return (
															<>
																{/* Tampilkan badge Online jika ada jadwal online */}
																{validModes.includes("online") && (
																	<span
																		key="online"
																		className="bg-blue-800 text-white px-4 py-1 rounded-full text-sm">
																		Online
																	</span>
																)}
																{/* Tampilkan badge Offline jika ada jadwal offline */}
																{validModes.includes("offline") && (
																	<span
																		key="offline"
																		className="bg-red-800 text-white px-4 py-1 rounded-full text-sm">
																		Offline
																	</span>
																)}
															</>
														);
													} else {
														// Ada jadwal tapi tidak ada mode valid
														return (
															<span className="bg-gray-400 text-white px-4 py-1 rounded-full text-sm">
																Tidak ada jadwal dengan mode valid
															</span>
														);
													}
												})()
											)}
										</div>
										<span className="text-white">
											Rp{course.price_per_hour}/sesi
										</span>
									</div>
								</div>
							</div>
						</div>
					);
				})}
			</Slider>
		</div>
	);
}
