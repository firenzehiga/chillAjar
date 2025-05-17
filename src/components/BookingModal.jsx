import React, { useState } from 'react';
import { format } from 'date-fns';
import { X, Clock, Monitor, MapPin, BookOpen } from 'lucide-react';

// Sample available slots - In real app, this would come from the backend
const availableSlots = {
  online: {
    times: ['09:00', '10:00', '11:00', '14:00', '15:00'],
    days: [0, 1, 2, 3, 4] // 0 is today, 1 is tomorrow, etc.
  },
  offline: {
    times: ['13:00', '14:00', '15:00', '16:00'],
    days: [1, 2, 4], // Only specific days available for offline
    locations: [
      'Central Library, Building A',
      'Science Building, Room 204',
      'Engineering Lab, Floor 3'
    ]
  }
};

const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() + i);
  return date;
});

export function BookingModal({ mentor, selectedCourse, onClose, onSubmit }) {
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSubmit = () => {
    if (selectedDate && selectedTime && selectedMode) {
      const [hours, minutes] = selectedTime.split(':');
      const dateTime = new Date(selectedDate);
      dateTime.setHours(parseInt(hours), parseInt(minutes));
      onSubmit(dateTime, selectedTime, selectedMode, selectedCourse);
    }
  };

  const isDateAvailable = (date, mode) => {
    const dayIndex = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return availableSlots[mode].days.includes(dayIndex);
  };

  const isTimeAvailable = (time, mode) => {
    return availableSlots[mode].times.includes(time);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Book a Session with {mentor.name}</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedCourse && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-900">{selectedCourse.title}</h3>
              </div>
              <p className="text-sm text-blue-700">${selectedCourse.price_per_hour}/hour</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2">Select Learning Mode:</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSelectedMode('online');
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedLocation(null);
                }}
                disabled={!mentor.availability.online}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  selectedMode === 'online'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : mentor.availability.online
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Monitor className="w-5 h-5 mr-2" />
                Online
              </button>
              <button
                onClick={() => {
                  setSelectedMode('offline');
                  setSelectedDate(null);
                  setSelectedTime(null);
                  setSelectedLocation(null);
                }}
                disabled={!mentor.availability.offline}
                className={`flex items-center justify-center p-3 rounded-lg border ${
                  selectedMode === 'offline'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : mentor.availability.offline
                    ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Offline
              </button>
            </div>
          </div>

          {selectedMode === 'offline' && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Location:</h3>
              <div className="space-y-2">
                {availableSlots.offline.locations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedLocation(location)}
                    className={`w-full p-3 rounded-lg border text-left ${
                      selectedLocation === location
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {location}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedMode && (selectedMode === 'online' || selectedLocation) && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Date:</h3>
              <div className="grid grid-cols-3 gap-2">
                {nextWeekDates.map((date) => {
                  const available = isDateAvailable(date, selectedMode);
                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => available && setSelectedDate(date)}
                      disabled={!available}
                      className={`p-2 rounded ${
                        selectedDate?.toDateString() === date.toDateString()
                          ? 'bg-blue-500 text-white'
                          : available
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {format(date, 'MMM d')}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDate && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Select Time:</h3>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots[selectedMode].times.map((time) => {
                  const available = isTimeAvailable(time, selectedMode);
                  return (
                    <button
                      key={time}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}
                      className={`flex items-center justify-center p-2 rounded ${
                        selectedTime === time
                          ? 'bg-blue-500 text-white'
                          : available
                          ? 'bg-gray-100 hover:bg-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Clock className="w-4 h-4 mr-1" />
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selectedDate || !selectedTime || !selectedMode || (selectedMode === 'offline' && !selectedLocation)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedDate && selectedTime && selectedMode && (selectedMode === 'online' || selectedLocation)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}