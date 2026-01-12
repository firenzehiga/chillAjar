import { MentorCard } from "@/components/MentorCard";
import { MentorSkeletonCard } from "@/components/ui/Skeleton/MentorSkeletonCard";
import { getImageUrl } from "@/utils/getImageUrl";
import { EmptyMentorsState } from "@/components/Fallback/EmptyMentorsState";
import { usePublicMentorsQuery } from "@/hooks/useMentors";
import { useDocumentTitle } from "@/hooks/utils/useDocumentTitle";
import { Search } from "lucide-react";
import { SearchFilter } from "@/components/ui/SearchFilter";
import useAppStore from "@/stores/useAppStore";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { useState, useEffect } from "react";
import Pagination from "@/components/ui/Pagination";

export function MentorsPage({
	courses,
	onSchedule,
	onCoursePackageSelect,
	showPostLoginLoading,
	onNavigate,
	coursesIsLoading = false,
}) {
	useDocumentTitle("Mentor", "Temui Mentor Ahli Kami");

	const {
		mentorSearchQuery,
		setMentorSearchQuery,
		mentorFilters,
		resetMentorFilters,
		applyMentorFilters,
	} = useAppStore();

	// Debounce search query untuk performa lebih baik
	const debouncedMentorSearchQuery = useDebounce(mentorSearchQuery, 500);

	// Pagination state
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6;

	// Reset to page 1 when filters change
	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedMentorSearchQuery, mentorFilters]);

	const {
		data: mentors = [],
		isLoading: mentorsLoading,
		error: mentorsError,
	} = usePublicMentorsQuery();
	if (mentorsLoading || coursesIsLoading || showPostLoginLoading) {
		return (
			<div className="py-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">Mentor Kami</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, idx) => (
						<MentorSkeletonCard key={idx} />
					))}
				</div>
			</div>
		);
	}

	if (mentorsError) {
		let msg = mentorsError.message;
		if (
			mentorsError.response &&
			mentorsError.response.data &&
			mentorsError.response.data.message
		) {
			msg = mentorsError.response.data.message;
		}
		return <p className="text-red-500 text-center mt-8">{msg}</p>;
	}

	const mentorsData = mentors
		.filter((mentor) => mentor.status === "active")
		.map((mentor) => {
			// Buat mapped mentor object dulu
			const mappedMentor = {
				id: mentor.id,
				mentorName: mentor.user?.nama || "",
				mentorImage: getImageUrl(
					mentor.user?.foto_profil,
					"/foto_mentor/default.png"
				),
				mentorRating: mentor.rating || 0,
				mentorAbout: mentor.deskripsi || "",
				mentorPhone: mentor.user?.nomorTelepon || "",
				mentorAddress: mentor.user?.alamat || "",
				mentorBiayaPerSesi: mentor.biayaPerSesi || 0,
			};

			// Mengambil kursus dari prop courses yang sudah di-fetch di App.jsx
			const mentorCourses = courses
				.filter((course) => course.mentor_id === mentor.id)
				.map((course) => ({
					...course,
					mentor: mappedMentor, // <-- gunakan mapped mentor, bukan raw mentor
					id: course.id,
					courseName: course.courseName,
					courseDescription: course.courseDescription,
					courseImage: course.courseImage,
					learnMethod: course.learnMethod,
					price_per_hour: course.price_per_hour,
					schedules: course.mentors[0].schedules, // Ambil schedules dari mentors
				}));

			const availableLearnMethod = mentorCourses.length
				? Array.from(
					new Set(mentorCourses.map((c) => c.learnMethod || "Unknown"))
				)
				: ["Unknown"];

			return {
				...mappedMentor,
				courses: mentorCourses,
			};
		});

	// Apply filters with debounced search
	const finalFilteredMentors = applyMentorFilters(
		mentorsData,
		debouncedMentorSearchQuery,
		mentorFilters
	);

	const hasActiveFilters = Object.values(mentorFilters).some((value) => {
		if (value === "" || value === 0) return false;
		if (Array.isArray(value) && value[0] === 0 && value[1] === 100000)
			return false;
		return true;
	});

	const hasSearchQuery = debouncedMentorSearchQuery?.trim();
	const isFiltering = hasSearchQuery || hasActiveFilters;

	// Pagination calculations
	const totalPages = Math.ceil(finalFilteredMentors.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedMentors = finalFilteredMentors.slice(startIndex, endIndex);



	return (
		<>
			{mentorsData.length === 0 ? (
				<EmptyMentorsState context="mentors" onNavigate={onNavigate} />
			) : finalFilteredMentors.length === 0 && isFiltering ? (
				<div className="py-8 min-h-screen">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">
						Mentor Kami
					</h2>
					<div className="relative py-4 w-full lg:w-2/3 mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<input
								type="text"
								placeholder="Cari nama mentor..."
								value={mentorSearchQuery || ""}
								onChange={(e) => setMentorSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:outline-none"
							/>
						</div>
						<SearchFilter filterType="mentor" />
					</div>

					{/* Empty search results */}
					<div className="flex flex-col items-center justify-center h-64 text-gray-500">
						<Search className="w-16 h-16 text-gray-300 mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							Tidak Ada Hasil Ditemukan
						</h3>
						<p className="text-gray-600 mb-4 text-center max-w-md">
							{hasSearchQuery
								? `Tidak ada mentor yang cocok dengan pencarian "${mentorSearchQuery}" dan filter yang dipilih.`
								: "Tidak ada mentor yang cocok dengan filter yang dipilih."}
							<br />
							Coba kata kunci yang berbeda atau ubah filter.
						</p>
						<div className="flex gap-2 ">
							{hasSearchQuery && (
								<button
									onClick={() => setMentorSearchQuery("")}
									className="px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
									Hapus Pencarian
								</button>
							)}
							{hasActiveFilters && (
								<button
									onClick={resetMentorFilters}
									className="px-4 py-2 bg-chill-blue text-white rounded-lg hover:bg-blue-600 transition-colors">
									Reset Filter
								</button>
							)}
						</div>
					</div>
				</div>
			) : (
				<div className="py-8 min-h-screen">
					<h2 className="text-2xl font-bold text-gray-900 mb-3">Mentor Kami</h2>
					<div className="relative py-4 w-full lg:w-2/3 mb-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<input
								type="text"
								placeholder="Cari nama mentor..."
								value={mentorSearchQuery || ""}
								onChange={(e) => setMentorSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
							/>
						</div>
						<SearchFilter filterType="mentor" />
					</div>

					{/* Show active filters count */}
					{isFiltering && (
						<div className="mb-4 text-sm text-gray-600">
							Menampilkan {finalFilteredMentors.length} mentor dari{" "}
							{mentorsData.length} total mentor
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{paginatedMentors.map((mentor) => ((
							<MentorCard
								key={mentor.id}
								mentor={mentor}
								onSchedule={onSchedule}
								onCoursePackageSelect={onCoursePackageSelect}
								showCourseSelect={true}
								isLoading={coursesIsLoading || mentorsLoading}
							/>
						)))}
					</div>
					{/* Pagination */}
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			)}
		</>
	);
}
