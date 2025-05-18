import eko from "../../assets/eko.jpg";
import pemweb from "../../assets/webpro.jpg";
const coursesData = [
	{
		id: "1",
		title: "Statistika Probabilitas",
		description:
			"Master complex mathematical concepts with expert peer tutors.",
		image:
			"https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
		category: "Mathematics",
		price_per_hour: 20,
		mentors: [
			{
				id: "m1",
				name: "Eko Muchamad Haryono",
				avatar: eko,
				rating: 4.8,
				expertise: ["Calculus", "Linear Algebra"],
				availability: { online: true, offline: true },
				phone: "+1234567890",
				location: "Kampus B STT Nurul Fikri",
			},
		],
	},
	{
		id: "2",
		title: "Dasar Dasar Pemrograman",
		description:
			"Learn essential programming concepts and algorithms with python.",
		image:
			"https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=800",
		category: "Computer Science",
		price_per_hour: 20,
		mentors: [
			{
				id: "m2",
				name: "Eko Muchamad Haryono",
				avatar: eko,
				rating: 4.9,
				expertise: ["Algorithms", "Python"],
				availability: { online: true, offline: false },
				phone: "+1234567891",
			},
		],
	},
	{
		id: "3",
		title: "Pemrograman Web",
		description:
			"Learn essential programming concepts and algorithms with python.",
		image: pemweb,
		category: "Software Engineering",
		price_per_hour: 20,
		mentors: [
			{
				id: "m2",
				name: "Eko Muchamad Haryono",
				avatar: eko,
				rating: 4.9,
				expertise: ["Algorithms", "Python"],
				availability: { online: true, offline: false },
				phone: "+1234567891",
			},
		],
	},
];

export default coursesData;
