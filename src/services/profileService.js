import api from "@/api";

// ========== PROFIL ADMIN ==========
// Admin tidak perlu endpoint get karena hanya menggunakan data dari props

// ========== PROFIL MENTOR ==========
export const getMentorProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/mentor/profil-saya", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ========== PROFIL PELANGGAN ==========
export const getPelangganProfileInfo = async () => {
  const token = localStorage.getItem("token");
  const response = await api.get("/pelanggan/profil-info", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// ========== EDIT PROFIL (UMUM) ==========
export const updateProfile = async (payload) => {
  const token = localStorage.getItem("token");
  const userPayload = new FormData();
  
  userPayload.append("nama", payload.nama);
  userPayload.append("email", payload.email);
  if (payload.nomorTelepon) {
    userPayload.append("nomorTelepon", payload.nomorTelepon);
  }
  if (payload.alamat) {
    userPayload.append("alamat", payload.alamat);
  }
  if (payload.foto_profil instanceof File) {
    userPayload.append("foto_profil", payload.foto_profil);
  }
  if (payload.deskripsi) {
    userPayload.append("deskripsi", payload.deskripsi);
  }
  userPayload.append("_method", "PUT");

  const response = await api.post("/user/profil", userPayload, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};