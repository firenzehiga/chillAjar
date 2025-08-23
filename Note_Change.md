1. Jika ingin data pada tabel berubah realtime jika ada perubahan di tempat lain, ubah kode pada inisiasi query menjadi komen: 
		staleTime: 1 * 60 * 1000, // 1 menit
		cacheTime: 5 * 60 * 1000, // 5 menit cache
		refetchOnWindowFocus: true // Refetch saat focus pada tab
		refetchInterval: 60 * 1000, // Auto refetch setiap 1 menit