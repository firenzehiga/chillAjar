import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Camera } from "lucide-react";
import defaultPhoto from "../assets/foto_profil.png";
import api from "../api";

export function EditProfilePage({ onNavigate, userRole, userData }) {
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		nomorTelepon: "",
		alamat: "",
		deskripsi: "",
		gayaMengajar: "",
	});

	const [profileImage, setProfileImage] = useState(defaultPhoto);
	const [selectedImage, setSelectedImage] = useState(null);

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
			return response.data;
		},
		enabled: userRole === "mentor",
	});

	useEffect(() => {
		if (profileData) {
			setFormData({
				nama: profileData.user?.nama || "",
				email: profileData.user?.email || "",
				nomorTelepon: profileData.user?.nomorTelepon || "",
				alamat: profileData.user?.alamat || "",
				deskripsi: profileData.deskripsi || "",
				gayaMengajar: profileData.gayaMengajar || "",
			});
			setProfileImage(
				profileData.user?.image || profileData.image || defaultPhoto
			);
		}
	}, [profileData]);

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

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

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

	const handleSubmit = (e) => {
		e.preventDefault();
		const updatedData = { ...formData };
		if (selectedImage) {
			updatedData.image = selectedImage;
		}
		console.log("Form submitted:", updatedData);
		alert(
			"Profile update functionality will be available once the backend endpoint is ready!"
		);
		onNavigate("profile");
	};

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-[50vh] text-gray-500">
				<div className="animate-spin rounded-full h-8 w-8 border-4 border-yellow-500 border-t-transparent mr-3" />
				<p>Loading profile data...</p>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-red-600">
				<p>{error.message || "Gagal mengambil data profile"}</p>
				<button
					onClick={() => window.location.reload()}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
					Reload
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<div className="flex items-center space-x-4 mb-6">
				<button
					onClick={() => onNavigate("profile")}
					className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
					<ArrowLeft className="w-5 h-5 text-gray-700" />
				</button>
				<h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
			</div>
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-lg shadow space-y-6">
				<div className="flex justify-center">
					<div className="relative w-32 h-32">
						<img
							src={profileImage}
							alt="Profile"
							className="rounded-full w-full h-full object-cover border-2 border-gray-300"
						/>
						<label
							htmlFor="profileImage"
							className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full text-white cursor-pointer hover:bg-blue-700">
							<Camera className="w-5 h-5" />
							<input
								type="file"
								id="profileImage"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</label>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<label
							htmlFor="nama"
							className="text-sm font-semibold text-gray-900">
							Nama
						</label>
						<input
							type="text"
							id="nama"
							name="nama"
							value={formData.nama}
							onChange={handleChange}
							className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="flex flex-col">
						<label
							htmlFor="email"
							className="text-sm font-semibold text-gray-900">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="nomorTelepon"
						className="text-sm font-semibold text-gray-900">
						Nomor Telepon
					</label>
					<input
						type="text"
						id="nomorTelepon"
						name="nomorTelepon"
						value={formData.nomorTelepon}
						onChange={handleChange}
						className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex flex-col">
					<label
						htmlFor="alamat"
						className="text-sm font-semibold text-gray-900">
						Alamat
					</label>
					<textarea
						id="alamat"
						name="alamat"
						value={formData.alamat}
						onChange={handleChange}
						className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				{userRole === "mentor" && (
					<>
						<div className="flex flex-col">
							<label
								htmlFor="deskripsi"
								className="text-sm font-semibold text-gray-900">
								Deskripsi
							</label>
							<textarea
								id="deskripsi"
								name="deskripsi"
								value={formData.deskripsi}
								onChange={handleChange}
								className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</>
				)}

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => onNavigate("profile")}
						className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
						Save Changes
					</button>
				</div>
			</form>
		</div>
	);
}

export default EditProfilePage;
