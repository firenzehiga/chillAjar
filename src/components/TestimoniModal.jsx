import React, { useState } from 'react';
import Swal from 'sweetalert2';

export const TestimoniModal = ({ isOpen, onClose, onSubmit }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const today = new Date().toISOString().slice(0, 10);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ rating, komentar: comment }); // hanya kirim rating & komentar
            Swal.fire({
                icon: 'success',
                title: 'Testimoni berhasil dikirim!',
                showConfirmButton: false,
                timer: 1800,
            });
            setRating(5);
            setComment('');
            onClose();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text:
                    err?.response?.data?.message ||
                    err?.message ||
                    'Gagal mengirim testimoni.',
                confirmButtonColor: '#3B82F6',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-all">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg animate-fadeIn relative">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                    onClick={onClose}
                    aria-label="Tutup"
                    disabled={loading}>
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-2 text-center text-yellow-400">
                    Beri Testimoni
                </h2>
                <p className="text-center text-gray-500 mb-6 text-sm">
                    Bagikan pengalamanmu mengikuti sesi ini!
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-5 flex flex-col items-center">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Rating:
                        </label>
                        <div className="flex gap-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    type="button"
                                    key={star}
                                    className={`text-3xl transition-colors ${
                                        (hoverRating || rating) >= star
                                            ? 'text-yellow-400'
                                            : 'text-gray-300'
                                    }`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    aria-label={`Beri rating ${star}`}
                                    disabled={loading}>
                                    ★
                                </button>
                            ))}
                        </div>
                        <span className="text-sm text-gray-500">
                            {rating} / 5
                        </span>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Tanggal:
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-200 rounded-lg p-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                            value={today}
                            readOnly
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-semibold text-gray-700">
                            Komentar (opsional):
                        </label>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition min-h-[80px] resize-none"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Tulis pengalamanmu... (boleh dikosongkan)"
                            disabled={loading}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                            onClick={onClose}
                            disabled={loading}>
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 font-semibold shadow-sm transition"
                            disabled={loading}>
                            {loading ? 'Mengirim...' : 'Kirim'}
                        </button>
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.25s cubic-bezier(.4,0,.2,1); }
            `}</style>
        </div>
    );
};
