import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Camera } from "lucide-react";
import defaultPhoto from "../assets/foto_profil.png";
import api from "../api";

export function EditProfilePage({ onNavigate, userRole, userData }) {
	// State untuk form
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		nomorTelepon: "",
		alamat: "",
		deskripsi: "",
		gayaMengajar: "",
	});

	// State untuk gambar profile
	const [profileImage, setProfileImage] = useState(defaultPhoto);
	const [selectedImage, setSelectedImage] = useState(null);

	// Fetch data profile menggunakan useQuery
	const {
		data: profileData,
		isLoading,
		error,
	} = useQuery({
		queryKey: ["mentorProfile"],
		queryFn: async () => {
			if (!userRole || userRole !== "mentor") return null;
			const token = localStorage.getItem("token");
			const response = await api.get("/mentor/profil-saya", {
				headers: { Authorization: `Bearer ${token}` },
			});
			console.log("Profile data:", response.data); // Debug struktur data
			return response.data;
		},
		enabled: userRole === "mentor", // Hanya fetch jika peran adalah mentor
	});

	// Update formData dan profileImage saat data dari API tersedia
	useEffect(() => {
		if (profileData) {
			setFormData({
				nama: profileData.user?.nama || "Chill Ajar",
				email: profileData.user?.email || "chillajar@example.com",
				nomorTelepon: profileData.user?.nomorTelepon || "+628123456789",
				alamat: profileData.user?.alamat || "Jl. Contoh No. 123",
				deskripsi: profileData.deskripsi || "Deskripsi belum diisi",
				gayaMengajar: profileData.gayaMengajar || "",
			});
			setProfileImage(
				profileData.user?.image || profileData.image || defaultPhoto
			);
		}
	}, [profileData]);

	// kalo bukan mentor, ambil data dari userData
	useEffect(() => {
		if (userRole !== "mentor" && userData) {
			setFormData({
				nama: userData.nama || "",
				email: userData.email || "",
				nomorTelepon: userData.nomorTelepon || "",
				alamat: userData.alamat || "",
				deskripsi: "",
				gayaMengajar: "",
			});
			setProfileImage(userData.image || defaultPhoto);
		}
	}, [userRole, userData]);

	// Handler untuk perubahan input teks
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handler untuk perubahan gambar
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 2 * 1024 * 1024) {
				alert("Ukuran gambar terlalu besar. Maksimal 2MB.");
				return;
			}
			setSelectedImage(file);
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
		}
	};

	// Fungsi submit sementara
	const handleSubmit = (e) => {
		e.preventDefault();
		const updatedData = { ...formData };

		if (selectedImage) {
			updatedData.image = selectedImage; // Nanti akan dikirim sebagai FormData
		}

		console.log("Form submitted:", updatedData);
		alert(
			"Profile update functionality will be available once the backend endpoint is ready!"
		);
		onNavigate("profile");
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-gray-600">
				<div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-3"></div>
				<p>Loading profile data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex items-center justify-center h-[60vh] flex-col text-red-500">
				<p>{error.message || "Gagal mengambil data profile"}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
					Reload
				</button>
			</div>
		);
	}

	return (
		<div className="py-8 max-w-2xl mx-auto">
			<div className="flex items-center mb-6">
				<button
					type="button"
					onClick={() => onNavigate("profile")}
					className="mr-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300">
					<ArrowLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
			</div>

			<div className="bg-white rounded-lg shadow p-6">
				<form onSubmit={handleSubmit}>
					{/* Gambar Profile */}
					<div className="mb-6 flex justify-center">
						<div className="relative">
							<img
								src={profileImage}
								alt="Profile"
								className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
							/>
							<label
								htmlFor="profileImage"
								className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700">
								<Camera className="w-5 h-5" />
								<input
									type="file"
									id="profileImage"
									name="profileImage"
									accept="image/*"
									onChange={handleImageChange}
									className="hidden"
								/>
							</label>
						</div>
					</div>

					<div className="mb-4">
						<label
							htmlFor="nama"
							className="block text-sm font-medium text-gray-700">
							Nama
						</label>
						<input
							type="text"
							id="nama"
							name="nama"
							value={formData.nama}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="nomorTelepon"
							className="block text-sm font-medium text-gray-700">
							Nomor Telepon
						</label>
						<input
							type="text"
							id="nomorTelepon"
							name="nomorTelepon"
							value={formData.nomorTelepon}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="alamat"
							className="block text-sm font-medium text-gray-700">
							Alamat
						</label>
						<textarea
							id="alamat"
							name="alamat"
							value={formData.alamat}
							onChange={handleChange}
							className="mt-1 p-2 w-full border rounded-md"
						/>
					</div>

					{/* Field Khusus Mentor */}
					{userRole === "mentor" && (
						<>
							<div className="mb-4">
								<label
									htmlFor="gayaMengajar"
									className="block text-sm font-medium text-gray-700">
									Gaya Mengajar
								</label>
								<input
									type="text"
									id="gayaMengajar"
									name="gayaMengajar"
									value={formData.gayaMengajar}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>

							<div className="mb-4">
								<label
									htmlFor="deskripsi"
									className="block text-sm font-medium text-gray-700">
									Deskripsi
								</label>
								<textarea
									id="deskripsi"
									name="deskripsi"
									value={formData.deskripsi}
									onChange={handleChange}
									className="mt-1 p-2 w-full border rounded-md"
								/>
							</div>
						</>
					)}

					<div className="flex justify-end gap-4">
						<button
							type="button"
							onClick={() => onNavigate("profile")}
							className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default EditProfilePage;
