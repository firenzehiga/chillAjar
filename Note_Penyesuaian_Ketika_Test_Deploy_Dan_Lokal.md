# NOTE: Penyesuaian Testing Deploy & Lokal

- Untuk testing lokal, pastikan `.env` diisi dengan base URL backend lokal (misal: `http://192.168.x.x:8000/`).
- Untuk testing deploy/production, isi `.env` dengan base URL backend public/hosting.
- Setelah mengubah `.env`, selalu restart dev server agar perubahan terbaca.
- Pastikan backend mengizinkan CORS untuk origin frontend (`http://localhost:5173` atau IP device frontend).
- Jika frontend tidak bisa akses gambar/API, cek:
  - IP backend benar dan bisa diakses dari device frontend
  - Port backend terbuka
  - CORS backend sudah benar
- Untuk Vercel/hosting lain, environment variable juga bisa diatur di dashboard hosting (bukan hanya file `.env`).
- Jangan biarkan dua base URL aktif sekaligus di `.env` (cukup satu untuk API, satu untuk gambar).
- Jika error CORS, perbaiki di backend, bukan di frontend.

# Catatan Penting untuk .env (API & getImageUrl)

## 1. API Endpoint
- Gunakan variabel `VITE_PUBLIC_API` di file `.env` untuk mengatur base URL API.
- Contoh:
  ```
  VITE_PUBLIC_API=https://manpro-sizzlingchilli-backend-chill-ajar.onrender.com/api
  # atau untuk lokal:
  # VITE_PUBLIC_API=http://192.168.x.x:8000/api
  ```
- Semua request API di frontend akan diarahkan ke URL ini.
- Ubah value sesuai environment (deploy/lokal), lalu restart dev server.

## 2. Image Endpoint (getImageUrl)
- Gunakan variabel `VITE_IMAGE_BASE_URL` di file `.env` untuk base URL gambar.
- Contoh:
  ```
  VITE_IMAGE_BASE_URL=https://manpro-sizzlingchilli-backend-chill-ajar.onrender.com/
  # atau untuk lokal:
  # VITE_IMAGE_BASE_URL=http://192.168.x.x:8000/
  ```
- Fungsi `getImageUrl(path)` akan otomatis membangun URL gambar dari base ini.
- Pastikan path gambar dari backend hanya path relatif (tanpa domain).

## 3. Best Practice
- Jangan biarkan dua base URL aktif sekaligus untuk API/gambar.
- Selalu restart dev server setelah mengubah `.env`.
- Untuk deploy (Vercel, dsb), environment variable bisa diatur di dashboard hosting.
- Jika error CORS, perbaiki di backend.
