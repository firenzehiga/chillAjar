import axios from 'axios';

// Pilih baseURL: jika window.location.hostname adalah localhost/127.0.0.1, pakai lokal, selain itu pakai public
const LOCAL_API = 'http://localhost:8000/api';
const PUBLIC_API = 'http://13.250.41.78:8000/api';

const isLocal = ['localhost', '127.0.0.1', '::1'].includes(
    window.location.hostname
);

const api = axios.create({
    baseURL: isLocal ? LOCAL_API : PUBLIC_API,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

// Tambahkan interceptor untuk menyisipkan token di setiap request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
