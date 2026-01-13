import jsPDF from "jspdf";
import { formatCurrency, generateInvoiceNumber } from "./helpers";
import { formatDateDay } from "./dateFormatter";

/**
 * Generate clean, minimalist professional invoice
 * @param {Object} session - Transaction session data
 * @param {Object} userData - User/customer data
 */
export async function generateInvoicePDF(session, userData = null) {
    const doc = new jsPDF();
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();

    const invoiceNum = generateInvoiceNumber(session.transaksiId, session.created_at);
    const today = new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    // Colors - minimal palette
    const darkText = [40, 40, 40];
    const grayText = [120, 120, 120];
    const brandBlue = [47, 161, 255];

    let y = 25;

    // ========== HEADER - Logo + Title ==========
    // Load and add logo
    try {
        const logo = new Image();
        logo.src = '/logo.png';
        await new Promise((resolve, reject) => {
            logo.onload = () => resolve();
            logo.onerror = () => reject();
            setTimeout(() => reject(new Error('Timeout')), 1500);
        });

        // Add logo (small)
        doc.addImage(logo, 'PNG', 20, y - 8, 12, 12);
    } catch (error) {
        console.warn('Logo not loaded:', error);
    }

    // Company name
    doc.setTextColor(...brandBlue);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('ChillAjar', 35, y);

    // INVOICE title (right aligned)
    doc.setTextColor(...darkText);
    doc.setFontSize(32);
    doc.text('INVOICE', W - 20, y, { align: 'right' });

    y += 8;

    // Tagline
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('Peer To Peer Tutoring Platform', 35, y);

    y = 50;

    // ========== COMPANY & CUSTOMER INFO ==========
    // Label DARI (kiri atas)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('DARI:', 20, y);

    y += 5;

    // Company address (left)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('ChillAjar', 20, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('STT Terpadu Nurul Fikri, Depok', 20, y);

    y += 4;
    doc.text('chillajar.biz.id', 20, y);

    // Label UNTUK (kanan atas)
    let customerY = 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('UNTUK:', W - 20, customerY, { align: 'right' });

    customerY += 5;

    // Customer info (right aligned)
    const customerName = userData?.nama || 'Customer';
    const customerEmail = userData?.email || '-';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text(customerName, W - 20, customerY, { align: 'right' });

    customerY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    const emailText = doc.splitTextToSize(customerEmail, 85);
    for (let i = 0; i < emailText.length; i++) {
        doc.text(emailText[i], W - 20, customerY + (i * 4), { align: 'right' });
    }

    y = 75;

    // Divider line
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(20, y, W - 20, y);

    y = 88;

    // ========== INVOICE DETAILS (2 columns) ==========
    // Left column
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('Nomor Invoice:', 20, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(invoiceNum, 50, y);

    y += 5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('Tanggal Invoice:', 20, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(today, 50, y);

    // Right column
    const rightColX = 110;
    let rightY = 88;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('Tanggal Bayar:', rightColX, rightY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    const paymentDate = session.paymentDate ? formatDateDay(session.paymentDate) : '-';
    doc.text(paymentDate, rightColX + 30, rightY);

    rightY += 5;

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('Metode Bayar:', rightColX, rightY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text('Transfer Bank', rightColX + 30, rightY);

    rightY += 5;

    // Status pembayaran (di sini, bukan di bawah)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('Status:', rightColX, rightY);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Terverifikasi', rightColX + 30, rightY);

    y = 110;

    // ========== ITEMS TABLE ==========
    // Table header
    doc.setFillColor(250, 250, 250);
    doc.rect(20, y, W - 40, 8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('Deskripsi', 24, y + 5.5);
    doc.text('Jumlah', W - 24, y + 5.5, { align: 'right' });

    y += 8;

    // Line under header
    doc.setDrawColor(220, 220, 220);
    doc.line(20, y, W - 20, y);

    y += 8;

    // Item row - dengan label yang sejajar
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text('Sesi Mentoring', 24, y);

    // Biaya Mentor (sejajar dengan Sesi Mentoring)
    if (session.biayaPerSesi) {
        doc.text(formatCurrency(session.biayaPerSesi), W - 24, y, { align: 'right' });
    }

    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    // Fixed position untuk alignment yang rapi
    const labelX = 24;
    const valueX = 58;  // Posisi value setelah label

    // Nama Kursus
    doc.setTextColor(...grayText);
    doc.text('Nama Kursus', labelX, y);
    doc.text(':', 54, y);
    doc.setTextColor(...darkText);
    doc.text(session.course, valueX, y);

    y += 4;

    // Mentor
    doc.setTextColor(...grayText);
    doc.text('Mentor', labelX, y);
    doc.text(':', 54, y);
    doc.setTextColor(...darkText);
    doc.text(session.mentor, valueX, y);

    y += 4;

    // Tanggal Sesi
    doc.setTextColor(...grayText);
    doc.text('Tanggal Sesi', labelX, y);
    doc.text(':', 54, y);
    doc.setTextColor(...darkText);
    doc.text(formatDateDay(session.date), valueX, y);

    y += 4;

    // Waktu (start - end, 1 jam)
    const startTime = session.time;
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 1;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    doc.setTextColor(...grayText);
    doc.text('Waktu', labelX, y);
    doc.text(':', 54, y);
    doc.setTextColor(...darkText);
    doc.text(`${startTime} - ${endTime} WIB (1 jam)`, valueX, y);

    y += 4;

    // Metode Belajar
    doc.setTextColor(...grayText);
    doc.text('Metode Belajar', labelX, y);
    doc.text(':', 54, y);
    doc.setTextColor(...darkText);
    doc.text(session.mode === 'online' ? 'Online' : 'Offline', valueX, y);

    if (session.mode === 'offline' && session.location) {
        y += 4;
        doc.setTextColor(...grayText);
        doc.text('Lokasi', labelX, y);
        doc.text(':', 54, y);
        doc.setTextColor(...darkText);
        const locText = doc.splitTextToSize(session.location, 100);
        doc.text(locText, valueX, y);
    }

    // Nama Paket (jika ada)
    if (session.paket?.nama) {
        y += 4;
        doc.setTextColor(...grayText);
        doc.text('Nama Paket', labelX, y);
        doc.text(':', 54, y);
        doc.setTextColor(...darkText);
        doc.text(session.paket.nama, valueX, y);

        // Harga Paket (sejajar dengan Nama Paket)
        if (session.paket.harga_dasar || session.paket.price) {
            const paketPrice = session.paket.harga_dasar || session.paket.price;
            doc.setFont('helvetica', 'bold');
            doc.text(formatCurrency(paketPrice), W - 24, y, { align: 'right' });
            doc.setFont('helvetica', 'normal'); // Reset font
        }

        // Diskon Paket (jika ada) - Ditampilkan di bawah harga paket
        if (session.paket?.diskon && session.paket.diskon > 0) {
            y += 4;
            doc.setTextColor(...grayText);
            doc.text('Diskon Paket', labelX, y);
            doc.text(':', 54, y);

            doc.setTextColor(220, 38, 38); // Merah untuk diskon
            doc.setFont('helvetica', 'bold');
            doc.text(`- ${formatCurrency(session.paket.diskon)}`, W - 24, y, { align: 'right' });
            doc.setFont('helvetica', 'normal');
        }
    }

    // Item Tambahan (jika ada)
    if (session.paket?.items && session.paket.items.length > 0) {
        y += 6;
        doc.setTextColor(...grayText);
        doc.text('Layanan Tambahan', labelX, y);
        doc.text(':', 54, y);

        doc.setTextColor(...darkText);
        let currentItemY = y;
        session.paket.items.forEach((item) => {
            doc.text(`• ${item.nama}`, valueX, currentItemY);
            currentItemY += 4;
        });

        y = currentItemY - 4; // Adjust y based on items height
    }

    y += 8;

    // Line before totals
    doc.setDrawColor(220, 220, 220);
    doc.line(20, y, W - 20, y);

    y += 10;

    // ========== TOTALS SECTION (lebih rapih) ==========
    const totalsX = W - 70;

    // Subtotal
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...grayText);
    doc.text('Subtotal:', totalsX, y);

    doc.setTextColor(...darkText);
    doc.text(formatCurrency(session.amount), W - 24, y, { align: 'right' });

    y += 6;

    // Single line before total
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(totalsX - 5, y, W - 20, y);

    y += 6;

    // Total (bold)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...darkText);
    doc.text('Total:', totalsX, y);

    doc.setFontSize(13);
    doc.setTextColor(...darkText);
    doc.text(formatCurrency(session.amount), W - 24, y, { align: 'right' });

    // ========== FOOTER ==========
    y = H - 30;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.text('Terima kasih atas kepercayaan Anda.', W / 2, y, { align: 'center' });

    y += 10;

    // Footer line
    doc.setDrawColor(240, 240, 240);
    doc.line(20, y, W - 20, y);

    y += 6;

    // Contact info
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('support@chillajar.com', 20, y);
    doc.text('chillajar.biz.id', W / 2, y, { align: 'center' });
    doc.text(invoiceNum, W - 20, y, { align: 'right' });

    // Download
    doc.save(`Invoice-${session.transaksiId}-ChillAjar.pdf`);
}
