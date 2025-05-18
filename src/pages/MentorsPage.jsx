import React, { useState, useEffect } from "react";
// import axios from "axios";
import { MentorCard } from "../components/MentorCard";
import mentorsData from "../utils/constants/MentorsData"; // Import the mentors data from the utils/constants file

const mentors = mentorsData;
export function MentorsPage({ onSchedule }) {
	//   const [suratList, setSuratList] = useState([]);
	//   const [loading, setLoading] = useState(true);

	//   useEffect(() => {
	//     const fetchAllSurat = async () => {
	//       try {
	//         const response = await axios.get('https://equran.id/api/v2/surat');
	//         setSuratList(response.data.data); // Simpan semua data surat apa adanya
	//       } catch (error) {
	//         console.error('Gagal memanggil API:', error);
	//       } finally {
	//         setLoading(false);
	//       }
	//     };

	//     fetchAllSurat();
	//   }, []);

	//   if (loading) {
	//     return <div className="py-8">Loading...</div>;
	//   }

	return (
		<div className="py-8">
			<h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mentors</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{mentors.map((mentor) => (
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
