import { MentorCard } from "@/components/MentorCard";
import { MentorSkeletonCard } from "@/components/Skeleton/MentorSkeletonCard";
import { getImageUrl } from "@/utils/getImageUrl";
import { EmptyMentorsState } from "@/components/Fallback/EmptyMentorsState";
import { usePublicMentorsQuery } from "@/hooks/useMentors";
import { useDocumentTitle } from "@/hooks/utils/useDocumentTitle";

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

	return (
		<>
			{mentorsData.length === 0 ? (
				<EmptyMentorsState context="mentors" onNavigate={onNavigate} />
			) : (
				<div className="py-8 min-h-screen">
					<h2 className="text-2xl font-bold text-gray-900 mb-6">Mentor Kami</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{mentorsData.map((mentor) => (
							<MentorCard
								key={mentor.id}
								mentor={mentor}
								onSchedule={onSchedule}
								onCoursePackageSelect={onCoursePackageSelect}
								showCourseSelect={true}
								isLoading={coursesIsLoading || mentorsLoading}
							/>
						))}
					</div>
				</div>
			)}
		</>
	);
}
