import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { X, Clock, Monitor, MapPin, BookOpen, AlertCircle } from "lucide-react";

export function BookingModal({ mentor, selectedCourse, onClose, onSubmit }) {
    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [topic, setTopic] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    // Only use schedules with valid gayaMengajar
    const filteredSchedules = (
        selectedCourse?.schedules ||
        selectedCourse?.mentors?.[0]?.schedules ||
        []
    ).filter(
        (s) => s.gayaMengajar === "online" || s.gayaMengajar === "offline"
    );

    // Build available modes from schedules
    const availableModes = Array.from(
        new Set(filteredSchedules.map((s) => s.gayaMengajar))
    );

    useEffect(() => {
        if (filteredSchedules.length === 0) {
            setErrorMsg(
                "Tidak ada jadwal dengan gayaMengajar valid (online/offline). Silakan hubungi admin atau mentor."
            );
        } else {
            setErrorMsg("");
        }
    }, [selectedCourse]);

    // Build available locations for offline
    const availableLocations =
        selectedMode === "offline"
            ? [
                  ...new Set(
                      filteredSchedules
                          .filter((s) => s.gayaMengajar === "offline")
                          .map((s) => s.tempat)
                          .filter(Boolean)
                  ),
              ]
            : [];

    // Build available dates for selected mode/location
    // --- Perubahan: Build daftar tanggal hanya dari jadwal dengan gayaMengajar valid dan sesuai mode & lokasi ---
    const availableDates =
        selectedMode && filteredSchedules.length > 0
            ? [
                  ...new Set(
                      filteredSchedules
                          .filter(
                              (s) =>
                                  s.gayaMengajar === selectedMode &&
                                  // Untuk online: ambil semua tanggal, untuk offline: filter lokasi
                                  (selectedMode === "online" ||
                                      (selectedMode === "offline" &&
                                          (!selectedLocation ||
                                              s.tempat === selectedLocation)))
                          )
                          .map((s) => s.tanggal)
                  ),
              ].map((date) => new Date(date))
            : [];
    // --- END Perubahan ---

    // Build available times for selected date/mode/location
    // --- Perubahan: Build daftar waktu hanya dari jadwal dengan gayaMengajar valid, tanggal, mode, dan lokasi ---
    const availableTimes =
        selectedDate && selectedMode && filteredSchedules.length > 0
            ? filteredSchedules
                  .filter(
                      (s) =>
                          s.gayaMengajar === selectedMode &&
                          s.tanggal ===
                              selectedDate.toISOString().split("T")[0] &&
                          (selectedMode === "online" ||
                              (selectedMode === "offline" &&
                                  (!selectedLocation ||
                                      s.tempat === selectedLocation)))
                  )
                  .map((s) => s.waktu)
            : [];
    // --- END Perubahan ---

    const handleSubmit = () => {
        if (!selectedMode) {
            setErrorMsg("Pilih mode pembelajaran terlebih dahulu.");
            return;
        }
        if (filteredSchedules.length === 0) {
            setErrorMsg("Tidak ada jadwal dengan gayaMengajar valid.");
            return;
        }
        if (!selectedDate || !selectedTime) {
            setErrorMsg("Pilih tanggal dan waktu terlebih dahulu.");
            return;
        }
        // Find the selected schedule and check gayaMengajar
        const found = filteredSchedules.find(
            (s) =>
                s.gayaMengajar === selectedMode &&
                s.tanggal === selectedDate.toISOString().split("T")[0] &&
                s.waktu === selectedTime &&
                (selectedMode === "online" ||
                    (selectedMode === "offline" &&
                        (!selectedLocation || s.tempat === selectedLocation)))
        );
        if (!found) {
            setErrorMsg("Jadwal tidak ditemukan atau tidak valid.");
            return;
        }
        setErrorMsg("");
        onSubmit(
            selectedDate,
            selectedTime,
            selectedMode,
            selectedCourse,
            topic,
            selectedLocation
        );
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Book a Session with {mentor.mentorName}
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {selectedCourse && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center">
                                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                                <h3 className="font-medium text-blue-900">
                                    {selectedCourse.courseName}
                                </h3>
                            </div>
                            <p className="text-sm text-blue-700">
                                Rp{selectedCourse.price_per_hour}/sesi
                            </p>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 rounded p-2">
                            <AlertCircle className="w-5 h-5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <div className="mb-6">
                        <label
                            htmlFor="topic"
                            className="block text-sm font-medium text-gray-700 mb-1">
                            Topic to Discuss (Optional)
                        </label>
                        <textarea
                            id="topic"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter the topic you want to discuss in this session..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                        />
                    </div>

                    <div className="mb-6">
                        <h3 className="font-medium mb-2">
                            Select Learning Mode:
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["online", "offline"].map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => {
                                        setSelectedMode(mode);
                                        setSelectedLocation(null);
                                        setSelectedDate(null);
                                        setSelectedTime(null);
                                    }}
                                    disabled={!availableModes.includes(mode)}
                                    className={`flex items-center justify-center p-3 rounded-lg border ${
                                        selectedMode === mode
                                            ? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
                                            : availableModes.includes(mode)
                                            ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                    }`}>
                                    {mode === "online" ? (
                                        <Monitor className="w-5 h-5 mr-2" />
                                    ) : (
                                        <MapPin className="w-5 h-5 mr-2" />
                                    )}
                                    {mode.charAt(0).toUpperCase() +
                                        mode.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedMode === "offline" && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">
                                Select Location:
                            </h3>
                            <div className="space-y-2 gap-3">
                                {availableLocations.length > 0 ? (
                                    availableLocations.map((loc, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => {
                                                setSelectedLocation(loc);
                                                setSelectedDate(null);
                                                setSelectedTime(null);
                                            }}
                                            className={`w-3/4 p-2 rounded-lg border text-left ${
                                                selectedLocation === loc
                                                    ? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                            }`}>
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                {loc}
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                        {filteredSchedules.length === 0
                                            ? "Jadwal belum tersedia untuk kursus ini."
                                            : "Lokasi belum ditentukan untuk jadwal ini."}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {selectedMode &&
                        (selectedMode === "online" || selectedLocation) && (
                            <div className="mb-6">
                                <h3 className="font-medium mb-2">
                                    Select Date:
                                </h3>
                                {availableDates.length === 0 ? (
                                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                                        Belum ada jadwal tersedia untuk{" "}
                                        {selectedMode === "offline"
                                            ? "lokasi ini"
                                            : "mode ini"}
                                        .
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-2">
                                        {availableDates.map((date) => (
                                            <button
                                                type="button"
                                                key={date.toISOString()}
                                                onClick={() => {
                                                    setSelectedDate(date);
                                                    setSelectedTime(null);
                                                }}
                                                className={`p-2 rounded ${
                                                    selectedDate?.toDateString() ===
                                                    date.toDateString()
                                                        ? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
                                                        : "bg-gray-100 hover:bg-gray-200"
                                                }`}>
                                                {format(date, "MMM d")}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    {selectedDate && (
                        <div className="mb-6">
                            <h3 className="font-medium mb-2">Select Time:</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {availableTimes.map((time) => (
                                    <button
                                        type="button"
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`flex items-center justify-center p-2 rounded ${
                                            selectedTime === time
                                                ? "bg-yellow-500 text-white border-yellow-500 focus:outline-none transition-colors"
                                                : "bg-gray-100 hover:bg-gray-200"
                                        }`}>
                                        <Clock className="w-4 h-4 mr-1" />
                                        {time.slice(0, 5)} WIB
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none">
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={
                                !selectedDate ||
                                !selectedTime ||
                                !selectedMode ||
                                filteredSchedules.length === 0 ||
                                (selectedMode === "offline" &&
                                    !selectedLocation)
                            }
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedDate &&
                                selectedTime &&
                                selectedMode &&
                                filteredSchedules.length > 0 &&
                                (selectedMode === "online" || selectedLocation)
                                    ? "bg-black text-white hover:bg-yellow-600"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}>
                            Confirm Booking
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
