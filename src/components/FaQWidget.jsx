import React, { useState, useRef, useEffect } from "react";
import {
	X,
	Search,
	Book,
	Users,
	MessageCircleQuestionIcon,
	CreditCard,
	Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqData = [
	{
		id: 1,
		category: "Getting Started",
		icon: Book,
		questions: [
			{
				id: "gs1",
				question: "Bagaimana cara memesan sesi dengan mentor?",
				answer:
					"Untuk memesan sesi:\n\n1. Telusuri kursus atau mentor\n2. Pilih mentor yang diinginkan\n3. Pilih Paket\n4. Pilih jadwal dan gaya belajar\n5. Klik Pesan dan Selesaikan pembayaran\n6. Ikuti sesi pada waktu yang dijadwalkan!",
			},
			{
				id: "gs2",
				question: "Metode pembayaran apa yang diterima?",
				answer:
					"Kami saat ini menerima 1 metode pembayaran, yaitu transfer bank.\n\nSetelah memesan:\n• Anda akan menerima detail bank\n• Upload bukti pembayaran untuk verifikasi",
			},
			{
				id: "gs3",
				question: "Bagaimana cara membuat akun?",
				answer:
					'Langkah-langkah membuat akun:\n\n1. Klik tombol "Masuk" di pojok kanan atas\n2. Pilih "Daftar"\n3. Anda dapat mendaftar sebagai siswa atau mentor',
			},
		],
	},
	{
		id: 2,
		category: "Sessions",
		icon: Users,
		questions: [
			{
				id: "s1",
				question: "Apa perbedaan antara sesi online dan offline?",
				answer:
					"Perbedaan sesi:\n\n• Online: Dilakukan melalui panggilan video seperti Zoom/Gmeet\n• Offline: Pertemuan tatap muka di lokasi tertentu\n\nLokasi offline bisa di perpustakaan atau pusat belajar.",
			},
			{
				id: "s2",
				question: "Bisakah saya menjadwal ulang sesi saya?",
				answer:
					"Ya, Anda dapat menjadwal ulang sesuai kesepakatan dengan mentor.\n\nCara menjadwal ulang:\n• Hubungi mentor mengenai pembuatan jadwal kembali lalu daftar seperti biasa.",
			},
			{
				id: "s3",
				question: "Bagaimana jika mentor tidak hadir?",
				answer:
					"Jika mentor tidak hadir dalam 15 menit:\n\n✅ Anda akan menerima pengembalian dana penuh\n\n⚠️ Mohon segera hubungi tim dukungan kami",
			},
		],
	},
	{
		id: 3,
		category: "Payment",
		icon: CreditCard,
		questions: [
			{
				id: "p1",
				question: "Berapa lama verifikasi pembayaran?",
				answer:
					"Waktu verifikasi pembayaran:\n\n⏱️ Paling lambat 1 hari kerja\n📩 Notifikasi: Anda akan menerima pemberitahuan setelah pembayaran terverifikasi",
			},
			{
				id: "p2",
				question: "Bisakah saya mendapatkan pengembalian dana?",
				answer:
					"Kebijakan refund:\n\n✅ Bisa meminta refund hingga 24 jam sebelum sesi\n⏱️ Proses refund: 2-3 hari kerja\n💳 Dana akan dikembalikan ke rekening asal",
			},
			{
				id: "p3",
				question: "Apakah ada diskon untuk beberapa sesi?",
				answer:
					"Paket sesi tersedia!\n\n📦 Kami menawarkan paket untuk beberapa sesi dengan mentor yang sama\n💬 Hubungi mentor langsung untuk diskusi harga khusus\n💰 Biasanya lebih hemat dari sesi satuan",
			},
		],
	},
	{
		id: 4,
		category: "Technical",
		icon: Settings,
		questions: [
			{
				id: "t1",
				question: "Apa yang diperlukan untuk sesi online?",
				answer:
					"Persiapan sesi online:\n\n📶 Koneksi internet yang stabil\n📱 Perangkat dengan kamera dan mikrofon\n🔇 Lingkungan belajar yang tenang\n💻 Browser yang mendukung video call",
			},
			{
				id: "t2",
				question: "Platform apa yang digunakan untuk panggilan video?",
				answer:
					"Platform video call yang kami gunakan:\n\n🎥 Zoom\n📹 Google Meet\n\n📝 Mentor akan membagikan link meeting sebelum sesi dimulai",
			},
			{
				id: "t3",
				question: "Saya mengalami masalah teknis saat sesi",
				answer:
					"Solusi masalah teknis:\n\n1. Refresh browser atau restart aplikasi\n2. Periksa koneksi internet\n3. Restart perangkat jika perlu\n\n⚠️ Jika masalah berlanjut:\n• Hubungi layanan dukungan teknis kami lewat chat whatsapp pada tombol ? di pojok kanan bawah",
			},
		],
	},
];

export function FaQWidget() {
	const [isOpen, setIsOpen] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: 0,
			sender: "bot",
			message:
				"Halo! Saya di sini untuk membantu pertanyaan tentang ChillAjar. Ada yang bisa saya bantu?",
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "text",
		},
	]);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(null);
	const [showCategories, setShowCategories] = useState(true);
	const messagesEndRef = useRef(null);

	const scrollMessageToTop = () => {
		const container = messagesEndRef.current?.parentElement;
		if (!container) return;

		// Coba untuk menemukan bubble pesan terakhir dan gulir ke atas kontainer.
		// Pengguna dan bot bubble keduanya menggunakan "p-3 rounded-2xl" jadi kita target itu.
		const bubbles = container.querySelectorAll(".p-3.rounded-2xl");
		const lastBubble = bubbles[bubbles.length - 1];

		if (lastBubble) {
			const nudgeUp = 50; // untuk menambahkan sedikit ruang di atas bubble
			setTimeout(() => {
				const containerRect = container.getBoundingClientRect();
				const bubbleRect = lastBubble.getBoundingClientRect();
				const top =
					bubbleRect.top - containerRect.top + container.scrollTop - nudgeUp;
				container.scrollTo({ top, behavior: "smooth" });
			}, 60);
		} else {
			// Fallback: scroll ke bawah jika tidak ada bubble ditemukan
			container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
		}
	};

	useEffect(() => {
		scrollMessageToTop();
	}, [messages]);

	const addMessage = (message, sender = "user") => {
		const newMessage = {
			id: Date.now(),
			sender,
			message,
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "text",
		};
		setMessages((prev) => [...prev, newMessage]);

		// Hanya scroll ke bawah jika pesan dari bot (asumsi user sudah melihat pesan mereka sendiri)
		if (sender === "bot") {
			setTimeout(() => {
				scrollToBottom();
			}, 100);
		}
	};

	const handleQuestionClick = (question) => {
		if (isProcessing) return;

		setIsProcessing(true);

		// Add user question
		addMessage(question.question, "user");

		// Add a single "typing" bubble (three styled dots) as a temporary bot message
		const typingId = Date.now() + Math.random();
		const typingMessage = {
			id: typingId,
			sender: "bot",
			// Use JSX for a nicely styled animated three-dot indicator (Tailwind classes)
			message: (
				<div className="flex items-center space-x-1">
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "0ms" }}
					/>
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "120ms" }}
					/>
					<span
						className="w-2 h-2 bg-gray-400 rounded-full inline-block animate-bounce"
						style={{ animationDelay: "240ms" }}
					/>
				</div>
			),
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
			type: "typing",
		};
		setMessages((prev) => [...prev, typingMessage]);

		setShowCategories(false);

		// Replace typing bubble with real answer after a short delay
		setTimeout(() => {
			setMessages((prev) => prev.filter((m) => m.id !== typingId));
			addMessage(question.answer, "bot");
			setIsProcessing(false);
		}, 800);
	};

	const handleCategoryClick = (category) => {
		if (isProcessing) return;

		setIsProcessing(true);
		setSelectedCategory(category);
		setShowCategories(false);
		addMessage(`Saya ingin tahu tentang ${category.category}`, "user");

		setTimeout(() => {
			addMessage(
				`Berikut beberapa pertanyaan umum tentang ${category.category}:`,
				"bot"
			);
			setIsProcessing(false);
		}, 500);
	};

	const handleBackToCategories = () => {
		if (isProcessing) return;

		setIsProcessing(true);
		setSelectedCategory(null);
		setShowCategories(true);
		setSearchQuery("");
		addMessage("Tampilkan semua kategori", "user");

		setTimeout(() => {
			addMessage("Berikut topik utama yang bisa saya bantu:", "bot");
			setIsProcessing(false);
		}, 500);
	};

	const filteredQuestions = selectedCategory
		? selectedCategory.questions.filter(
				(q) =>
					q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
					q.answer.toLowerCase().includes(searchQuery.toLowerCase())
		  )
		: faqData
				.flatMap((cat) => cat.questions)
				.filter(
					(q) =>
						q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
						q.answer.toLowerCase().includes(searchQuery.toLowerCase())
				);

	return (
		<>
			{/* FAQ Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				className=" focus:outline-none fixed bottom-6 left-6 w-12 h-12 bg-yellow-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group z-40"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}>
				<MessageCircleQuestionIcon className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
			</motion.button>

			{/* FAQ Window */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						className="fixed bottom-24 left-6 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
						{/* Header */}
						<div className="p-4 bg-gradient-to-r from-yellow-600 to-yellow-600 text-white">
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									<div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
										<MessageCircleQuestionIcon className="w-5 h-5" />
									</div>
									<div>
										<h3 className="font-medium">FAQ? Assistance</h3>
										<p className="text-xs text-yellow-100">
											Bagaimana saya bisa membantu?
										</p>
									</div>
								</div>
								<button
									onClick={() => setIsOpen(false)}
									className="p-1 hover:bg-white/20 rounded-lg transition-colors">
									<X className="w-4 h-4" />
								</button>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className={`flex ${
										message.sender === "user" ? "justify-end" : "justify-start"
									}`}>
									<div
										className={`max-w-xs ${
											message.sender === "user" ? "order-2" : "order-1"
										}`}>
										{message.sender === "bot" && (
											<div className="flex items-center space-x-2 mb-1">
												<div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-yellow-500 rounded-full flex items-center justify-center">
													<MessageCircleQuestionIcon className="w-3 h-3 text-white" />
												</div>
												<span className="text-xs text-gray-500">Bot FAQ</span>
											</div>
										)}
										<div
											className={`p-3 rounded-2xl ${
												message.sender === "user"
													? "bg-yellow-600 text-white rounded-br-md"
													: "bg-white text-gray-900 rounded-bl-md shadow-sm border"
											}`}>
											<p className="text-sm whitespace-pre-line leading-relaxed">
												{message.message}
											</p>
										</div>
										<p className="text-xs text-gray-400 mt-1 text-center">
											{message.time}
										</p>
									</div>
								</motion.div>
							))}

							{/* Categories or Questions */}
							{showCategories && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="space-y-2">
									<div className="text-xs text-gray-500 text-center mb-3">
										Pilih kategori:
									</div>
									{faqData.map((category) => (
										<button
											key={category.id}
											onClick={() => handleCategoryClick(category)}
											disabled={isProcessing}
											className={`w-full p-3 bg-white rounded-xl border transition-all duration-200 text-left ${
												isProcessing
													? "opacity-50 cursor-not-allowed"
													: "hover:border-yellow-300 hover:bg-yellow-50"
											}`}>
											<div className="flex items-center space-x-3">
												<category.icon className="w-5 h-5 text-yellow-600" />
												<span className="font-medium text-gray-900">
													{category.category}
												</span>
											</div>
										</button>
									))}
								</motion.div>
							)}

							{selectedCategory && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									className="space-y-2">
									<div className="flex items-center justify-between mb-3">
										<div className="text-xs text-gray-500">
											Pertanyaan tentang {selectedCategory.category}:
										</div>
										<button
											onClick={handleBackToCategories}
											disabled={isProcessing}
											className={`text-xs transition-colors ${
												isProcessing
													? "text-gray-400 cursor-not-allowed"
													: "text-yellow-500 hover:text-yellow-600"
											}`}>
											← Kembali
										</button>
									</div>
									{selectedCategory.questions.map((question) => (
										<button
											key={question.id}
											onClick={() => handleQuestionClick(question)}
											disabled={isProcessing}
											className={`w-full p-3 bg-white rounded-xl border transition-all duration-200 text-left ${
												isProcessing
													? "opacity-50 cursor-not-allowed"
													: "hover:border-yellow-300 hover:bg-yellow-50"
											}`}>
											<p className="text-sm font-medium text-gray-900">
												{question.question}
											</p>
										</button>
									))}
								</motion.div>
							)}

							<div ref={messagesEndRef} />
						</div>

						{/* Search Input */}
						<div className="p-4 border-t bg-white">
							<div className="flex items-center space-x-2">
								<div className="flex-1 relative">
									<Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
									<input
										type="text"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										placeholder="Cari FAQ..."
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
									/>
								</div>
								{searchQuery && (
									<button
										onClick={() => setSearchQuery("")}
										disabled={isProcessing}
										className={`w-full p-2 text-left text-xs rounded-lg transition-colors ${
											isProcessing
												? "bg-gray-50 text-red-200opacity-50 cursor-not-allowed"
												: "bg-gray-50 text-red-200hover:bg-yellow-50"
										}`}>
										<div className="flex items-center">
											<X className="w-4 h-4" />
											{searchQuery}
										</div>
									</button>
								)}
							</div>

							{/* Search Results */}
							{searchQuery && (
								<div className="mt-2 max-h-32 overflow-y-auto space-y-1">
									{filteredQuestions.slice(0, 3).map((question) => (
										<button
											key={question.id}
											onClick={() => {
												handleQuestionClick(question);
												setSearchQuery("");
											}}
											className="w-full p-2 text-left text-xs bg-gray-50 hover:bg-yellow-50 rounded-lg transition-colors">
											{question.question}
										</button>
									))}
									{filteredQuestions.length === 0 && (
										<p className="text-xs text-gray-500 p-2">
											Tidak ada pertanyaan ditemukan
										</p>
									)}
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
