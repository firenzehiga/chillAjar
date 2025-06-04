import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, Monitor, MapPin, DollarSign } from 'lucide-react';
import api from '../api';
import { PaymentModal } from '../components/PaymentModal';

export function TransactionHistoryPage({ userData, onPaymentSubmit }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [updatingSessionId, setUpdatingSessionId] = useState(null);
    const queryClient = useQueryClient();

    const pelangganId = userData?.pelanggan?.id;

    const {
        data: sessions = [],
        isLoading: loadingSessions,
        error: errorSessions,
    } = useQuery({
        queryKey: ['sessions', pelangganId],
        queryFn: async () => {
            const res = await api.get('/pelanggan/daftar-sesi');
            return res.data;
        },
        enabled: !!pelangganId,
    });

    const {
        data: transactions = [],
        isLoading: loadingTransactions,
        error: errorTransactions,
    } = useQuery({
        queryKey: ['transactions', pelangganId],
        queryFn: async () => {
            const res = await api.get('/transaksi');
            return res.data.filter((t) => t.pelanggan_id === pelangganId);
        },
        enabled: !!pelangganId,
    });

    const history = useMemo(() => {
        if (!sessions.length) return [];
        return sessions.map((sesi) => {
            const transaksi = transactions.find((t) => t.sesi_id === sesi.id);
            const jadwal = sesi.jadwal_kursus || sesi.jadwalKursus;
            // Ambil status sesi (bukan status pembayaran)
            const statusSesi = sesi.status || sesi.statusSesi || '-';
            return {
                id: sesi.id,
                course: sesi.kursus?.namaKursus || '-',
                mentor: sesi.mentor?.user?.nama || '-',
                mentor_id: sesi.mentor?.id || null,
                date: jadwal?.tanggal || '-',
                time: jadwal?.waktu.slice(0, 5) || '-',
                mode: sesi.kursus?.gayaMengajar || '-',
                topic: sesi.detailKursus || 'No Topic Specified',
                location: jadwal?.tempat || '-',
                status: transaksi
                    ? transaksi.statusPembayaran === 'menunggu_verifikasi'
                        ? 'waiting_verification'
                        : transaksi.statusPembayaran === 'accepted'
                        ? 'accepted'
                        : transaksi.statusPembayaran === 'rejected'
                        ? 'rejected'
                        : 'pending_payment'
                    : 'pending_payment',
                amount: sesi.mentor?.biayaPerSesi || 0,
                paymentDate: transaksi?.tanggalPembayaran || null,
                transaksiId: transaksi?.id,
                statusSesi, // tambahkan status sesi
            };
        });
    }, [sessions, transactions]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'waiting_verification':
                return 'bg-yellow-100 text-yellow-800';
            case 'accepted':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending_payment':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'waiting_verification':
                return 'Menunggu Verifikasi';
            case 'accepted':
                return 'Disetujui';
            case 'rejected':
                return 'Ditolak';
            case 'pending_payment':
                return 'Menunggu Pembayaran';
            default:
                return status;
        }
    };

    const handleContinuePayment = (session) => {
        setSelectedSession(session);
        setShowPaymentModal(true);
    };

    const handlePaymentFromHistory = async (data) => {
        setUpdatingSessionId(selectedSession.id);
        await onPaymentSubmit({
            ...data,
            transaksiId: selectedSession.transaksiId, // Sertakan transaksiId untuk update
        });
        setShowPaymentModal(false);
    };

    useEffect(() => {
        if (!updatingSessionId) return;
        const updatedSession = history.find((s) => s.id === updatingSessionId);
        if (
            updatedSession &&
            updatedSession.status !== 'pending_payment' &&
            updatedSession.status !== 'rejected'
        ) {
            setUpdatingSessionId(null);
        }
    }, [history, updatingSessionId]);

    const isLoading = loadingSessions || loadingTransactions;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
                <Calendar className="w-12 h-12 text-gray-400 mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2 animate-pulse">
                    Memuat riwayat transaksi...
                </h3>
            </div>
        );
    }

    if (errorSessions || errorTransactions) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] text-red-600">
                <p>Gagal memuat data. Silakan coba lagi.</p>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[40vh] text-gray-600">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                    Tidak Ada Riwayat Transaksi
                </h3>
                <p className="text-gray-500 mb-4 text-center">
                    Anda belum memiliki riwayat transaksi. Silakan lakukan
                    pemesanan sesi untuk memulai!
                </p>
            </div>
        );
    }

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Riwayat Transaksi
            </h2>
            <div className="space-y-4">
                {history.map((session) => (
                    <div
                        key={session.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {session.course}
                                </h3>
                                <p className="text-gray-600">
                                    dengan {session.mentor}
                                </p>
                            </div>
                            {updatingSessionId === session.id ? (
                                <div className="flex items-center text-blue-500">
                                    <svg
                                        className="animate-spin h-5 w-5 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8z"></path>
                                    </svg>
                                    Memperbarui...
                                </div>
                            ) : (
                                <span
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(
                                        session.status
                                    )}`}>
                                    {getStatusText(session.status)}
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                                {new Date(session.date).toLocaleDateString(
                                    'id-ID',
                                    {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    }
                                )}{' '}
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                                Jam Mulai: {session.time}
                            </div>
                            <div className="flex items-center text-gray-600">
                                {session.mode === 'online' ? (
                                    <Monitor className="w-4 h-4 mr-2 text-blue-600" />
                                ) : (
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                )}
                                {session.mode === 'online'
                                    ? 'Sesi Online'
                                    : 'Sesi Offline'}
                            </div>
                            {session.mode === 'offline' && (
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                                    Lokasi: {session.location}
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4 mt-4">
                            <div className="flex items-center justify-between text-gray-600">
                                <div className="flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                                    Total Harga: Rp{session.amount}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        Tanggal Pembayaran:{' '}
                                        {session.paymentDate
                                            ? new Date(
                                                  session.paymentDate
                                              ).toLocaleDateString('id-ID', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-'}
                                    </span>
                                </div>
                            </div>
                            {session.status === 'waiting_verification' && (
                                <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                                    <p className="text-yellow-800 text-sm">
                                        Pembayaran Anda sedang diverifikasi.
                                        Proses ini biasanya memakan waktu 1-2
                                        hari kerja. Kami akan memberi notifikasi
                                        setelah verifikasi selesai.
                                    </p>
                                </div>
                            )}
                            {session.status === 'accepted' && (
                                <div className="mt-4 bg-green-50 p-4 rounded-lg">
                                    <p className="text-green-800 text-sm">
                                        Pembayaran Anda diterima. Silakan tunggu
                                        mentor untuk memulai sesi.
                                    </p>
                                </div>
                            )}

                            {session.status === 'rejected' && (
                                <div className="mt-4 bg-red-50 p-4 rounded-lg">
                                    <p className="text-red-800 text-sm mb-3">
                                        Pembayaran Anda ditolak. Silakan kirim
                                        ulang bukti pembayaran yang valid.
                                    </p>
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            handleContinuePayment(session)
                                        }>
                                        Kirim Ulang Bukti
                                    </button>
                                </div>
                            )}
                            {session.status === 'pending_payment' && (
                                <div className="mt-4">
                                    <button
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                        onClick={() =>
                                            handleContinuePayment(session)
                                        }>
                                        Selesaikan Pembayaran
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Simulasi PaymentModal */}
            {showPaymentModal && selectedSession && (
                <PaymentModal
                    booking={{
                        course: {
                            courseName: selectedSession.course,
                            price_per_hour: selectedSession.amount,
                        },
                        mentor: { mentorName: selectedSession.mentor },
                        date: selectedSession.date,
                        time: selectedSession.time,
                        mode: selectedSession.mode,
                        location: selectedSession.location,
                        topic: selectedSession.topic, // atau isi sesuai kebutuhan
                        sesi: {
                            // tambahkan sesi jika perlu id untuk transaksi
                            id: selectedSession.id,
                            pelanggan_id: userData?.pelanggan?.id,
                            mentor_id: selectedSession.mentor_id, // pastikan ada
                        },
                    }}
                    course={{ courseName: selectedSession.course }}
                    mentor={{ mentorName: selectedSession.mentor }}
                    onClose={() => setShowPaymentModal(false)}
                    onSubmit={handlePaymentFromHistory}
                />
            )}
        </div>
    );
}
