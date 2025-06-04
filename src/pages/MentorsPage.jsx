import React from "react";
import { MentorCard } from "../components/MentorCard";
import api from "../api";
import defaultPhoto from "../../public/foto_kursus/default.jpg";
import { useQuery } from "@tanstack/react-query";
import { MentorSkeletonCard } from "../components/Skeleton/MentorSkeletonCard";

export function MentorsPage({ courses, onSchedule }) {
	const {
		data: mentors = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["publicMentorsPage"],
		queryFn: async () => {
			const mentorsResponse = await api.get("/public/mentor");
			return mentorsResponse.data;
		},
		staleTime: 0,
		refetchOnWindowFocus: false,
		retry: 1,
	});

	if (isLoading) {
		return (
			<div className="py-8">
				<h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mentors</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, idx) => (
						<MentorSkeletonCard key={idx} />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		let msg = error.message;
		if (error.response && error.response.data && error.response.data.message) {
			msg = error.response.data.message;
		}
		return <p className="text-red-500 text-center mt-8">{msg}</p>;
	}

	const mentorsData = mentors.map((mentor) => {
		// Mengambil kursus dari prop courses yang sudah di-fetch di App.jsx
		const mentorCourses = courses
			.filter((course) => course.mentor_id === mentor.id)
			.map((course) => ({
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
			id: mentor.id,
			mentorName: mentor.user?.nama || "Unknown Mentor",
			mentorImage: mentor.user?.foto_profil || defaultPhoto,
			mentorRating: mentor.rating || 0,
			mentorAbout: mentor.deskripsi || "No description",
			availableLearnMethod,
			teachingMode: {
				online: mentorCourses.some((c) => c.learnMethod === "Online Learning"),
				offline: mentorCourses.some(
					(c) => c.learnMethod === "Offline Learning"
				),
			},
			phone: mentor.user?.nomorTelepon || "+1234567890",
			mentorAddress: mentor.user?.alamat || "Alamat tidak tersedia",
			courses: mentorCourses,
		};
	});

	return (
		<div className="py-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mentors</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mentorsData.map((mentor) => (
					<MentorCard
						key={mentor.id}
						mentor={mentor}
						onSchedule={onSchedule}
						showCourseSelect={true}
					/>
				))}
			</div>
		</div>
	);
}
