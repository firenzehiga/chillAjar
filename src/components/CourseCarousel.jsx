import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getImageUrl } from "../utils/getImageUrl";
import { AsyncImage } from "loadable-image";
import { Fade } from "transitions-kit";
export function CourseCarousel({ courses, onCourseClick }) {
	// Debug: Lihat data courses yang diterima CourseCarousel
	// console.log("[CourseCarousel] Data courses diterima:", courses);

	const maxCoursesToShow = 5; // Maksimal 5 kursus yang ditampilkan
	const carouselData = courses
		.filter((course) => course.mentor && course.mentor.status === "active")
		.slice(0, maxCoursesToShow);
	const settings = {
		dots: true,
		infinite: carouselData.length > 1, // Hanya infinite jika ada > 1 course
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: carouselData.length > 1, // Hanya autoplay jika ada > 1 course
		autoplaySpeed: 5000,
		arrows: carouselData.length > 1, // Hanya show arrows jika ada > 1 course
	};

	return (
		<div className="mb-12 mt-7 -mx-4 sm:mx-0">
			<Slider {...settings}>
				{carouselData.map((course) => {
					// Hanya gunakan jadwal_kursus (sudah dimapping di parent/Home.jsx)
					const schedules = Array.isArray(course.jadwal_kursus)
						? course.jadwal_kursus
						: [];
					return (
						<div key={course.id} className="px-4">
							<div
								className="relative h-[400px] rounded-xl overflow-hidden cursor-pointer"
								onClick={() => onCourseClick(course)}>
								<AsyncImage
									loader={<div className="w-full h-full bg-gray-300" />}
									Transition={Fade}
									src={getImageUrl(
										course.courseImage,
										"/foto_kursus/default.jpg"
									)}
									alt={course.courseName}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.onerror = null;
										e.target.src = "/foto_kursus/default.jpg";
									}}
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
									<h3 className="text-3xl font-bold text-white mb-2">
										{course.courseName}
									</h3>
									<p className="text-gray-200 mb-4">
										{course.courseDescription}
									</p>
									<div className="flex items-center justify-between sm:flex-row flex-col gap-3">
										<div className="flex gap-2">
											{/*
                                                Badge mode logic:
                                                - Jika tidak ada jadwal sama sekali, tampilkan badge abu-abu "Tidak ada jadwal"
                                                - Jika ada jadwal, cek semua mode valid (online/offline) dari setiap jadwal
                                                - Jika ada mode valid, tampilkan badge Online/Offline sesuai yang ditemukan
                                                - Jika ada jadwal tapi tidak ada mode valid, tampilkan badge abu-abu "Tidak ada jadwal dengan mode valid"
                                            */}
											{schedules.length === 0 ? (
												<span className="bg-red-700 text-white px-4 py-1 rounded-full text-sm ">
													Jadwal belum tersedia
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
										<span className="bg-blue-700 text-white px-4 py-1 rounded-full text-sm">
											Mulai dari Rp
											{course.price_per_hour.toLocaleString("id-ID")}/sesi
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
