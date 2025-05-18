import eko from "../../assets/eko.jpg";

const mentorsData = [
	{
		id: "m1",
		name: "Eko Muchamad Haryono",
		avatar: eko,
		rating: 4.8,
		expertise: ["Calculus", "Linear Algebra"],
		availability: { online: true, offline: true },
		phone: "+1232067890",
		location: "Kampus B STT Nurul Fikri",
		courses: [
			{
				id: "c1",
				title: "Advanced Calculus",
				price_per_hour: 20,
				description: "Master complex calculus concepts",
			},
			{
				id: "c2",
				title: "Linear Algebra Fundamentals",
				price_per_hour: 20,
				description: "Understanding vector spaces and linear transformations",
			},
		],
	},
	{
		id: "m2",
		name: "Eko Muchamad Haryono",
		avatar: eko,
		rating: 4.9,
		expertise: ["Algorithms", "Python"],
		availability: { online: true, offline: false },
		phone: "+1232067891",
		location: "Kampus B STT Nurul Fikri",

		courses: [
			{
				id: "c3",
				title: "Python Programming",
				price_per_hour: 55,
				description: "Learn Python from basics to advanced",
			},
			{
				id: "c4",
				title: "Data Structures & Algorithms",
				price_per_hour: 60,
				description: "Master fundamental computer science concepts",
			},
		],
	},
	{
		id: "m3",
		name: "Eko Muchamad Haryono",
		avatar: eko,
		rating: 4.7,
		expertise: ["Physics", "Mathematics"],
		availability: { online: true, offline: true },
		phone: "+1232067892",
		location: "Kampus B STT Nurul Fikri",
		courses: [
			{
				id: "c5",
				title: "Physics Mechanics",
				price_per_hour: 20,
				description: "Understanding fundamental physics principles",
			},
			{
				id: "c6",
				title: "Advanced Mathematics",
				price_per_hour: 55,
				description: "Complex mathematical problem solving",
			},
		],
	},
];

export default mentorsData;
