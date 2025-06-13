import React, { useState, useEffect } from "react";
import { ArrowLeft, Camera, AlertCircle } from "lucide-react";
import defaultPhoto from "../../../assets/foto_profil.png";
import api from "../../../api";
import Swal from "sweetalert2";

export function AdminEditProfile({
	onNavigate,
	userRole,
	userData,
	onUpdateUserData,
}) {
	const [formData, setFormData] = useState({
		nama: "",
		email: "",
		nomorTelepon: "",
		alamat: "",
	});

	const [profileImage, setProfileImage] = useState(defaultPhoto);
	const [selectedImage, setSelectedImage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (userData) {
			setFormData({
				nama: userData.nama || "",
				email: userData.email || "",
				nomorTelepon: userData.nomorTelepon || "",
				alamat: userData.alamat || "",
			});
			setProfileImage(
				userData.foto_profil ? `/storage/${userData.foto_profil}` : defaultPhoto
			);
		}
	}, [userData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				setError("Ukuran gambar terlalu besar. Maksimal 5MB.");
				return;
			}
			setSelectedImage(file);
			const imageUrl = URL.createObjectURL(file);
			setProfileImage(imageUrl);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const token = localStorage.getItem("token");

			const userPayload = new FormData();
			userPayload.append("nama", formData.nama);
			userPayload.append("email", formData.email);
			if (formData.nomorTelepon) {
				userPayload.append("nomorTelepon", formData.nomorTelepon);
			}
			if (formData.alamat) {
				userPayload.append("alamat", formData.alamat);
			}
			if (selectedImage) {
				userPayload.append("foto_profil", selectedImage);
			}
			userPayload.append("_method", "PUT");

			const userResponse = await api.post("/user/profil", userPayload, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data",
				},
			});

			if (userResponse.status === 200) {
				Swal.fire({
					icon: "success",
					title: "Success",
					text: "Profil berhasil diperbarui!",
					confirmButtonColor: "#3B82F6",
				});

				console.log(
					"Updated Profile Data from PUT /user/profil:",
					userResponse.data
				);

				const updatedUserData = {
					...userData,
					nama: formData.nama,
					email: formData.email,
					nomorTelepon: formData.nomorTelepon,
					alamat: formData.alamat,
					foto_profil:
						userResponse.data.user?.foto_profil || userData.foto_profil,
					peran: userRole,
				};

				localStorage.setItem("user", JSON.stringify(updatedUserData));
				if (onUpdateUserData) {
					console.log("Calling onUpdateUserData with:", updatedUserData);
					onUpdateUserData(updatedUserData);
				}

				onNavigate("admin-profile");
			} else {
				throw new Error("Gagal memperbarui profil");
			}
		} catch (err) {
			const errorMessage =
				err.response?.data?.message ||
				err.message ||
				"Gagal memperbarui profil";
			setError(errorMessage);
			Swal.fire({
				icon: "error",
				title: "Error",
				text: errorMessage,
				confirmButtonColor: "#EF4444",
			});
			console.error("Error details:", err.response ? err.response.data : err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto px-4 py-10">
			<div className="flex items-center space-x-4 mb-6">
				<button
					onClick={() => onNavigate("admin-profile")}
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
							className="absolute bottom-0 right-0 bg-yellow-600 p-2 rounded-full text-white cursor-pointer hover:bg-yellow-700">
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
							className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
							className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
						className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
						className="mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
					/>
				</div>

				{error && (
					<div className="mb-4 text-red-500 text-sm flex items-center">
						<AlertCircle className="w-4 h-4 mr-2" />
						{error}
					</div>
				)}

				<div className="flex justify-end space-x-4">
					<button
						type="button"
						onClick={() => onNavigate("admin-profile")}
						className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
						disabled={loading}>
						Cancel
					</button>
					<button
						type="submit"
						className={`px-4 py-2 rounded-md transition-colors ${
							loading
								? "bg-gray-300 text-gray-500 cursor-not-allowed"
								: "bg-yellow-600 text-white hover:bg-yellow-700"
						}`}
						disabled={loading}>
						{loading ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</form>
		</div>
	);
}

export default AdminEditProfile;
