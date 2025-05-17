import React from 'react';
import { Calendar, Clock, Monitor, MapPin, DollarSign } from 'lucide-react';

// Mock history data - In real app, this would come from backend
const sessionHistory = [
  {
    id: 1,
    course: 'Advanced Calculus',
    mentor: 'Alex Thompson',
    date: '2024-02-15',
    time: '14:00',
    mode: 'online',
    status: 'waiting_verification',
    amount: 50,
    paymentDate: '2024-02-15'
  },
  {
    id: 2,
    course: 'Data Structures',
    mentor: 'Sarah Chen',
    date: '2024-02-10',
    time: '10:00',
    mode: 'offline',
    location: 'Central Library, Room 204',
    status: 'completed',
    amount: 45,
    paymentDate: '2024-02-10'
  }
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'waiting_verification':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'waiting_verification':
      return 'Waiting for Verification';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export function HistoryPage() {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Session History</h2>
      <div className="space-y-4">
        {sessionHistory.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{session.course}</h3>
                <p className="text-gray-600">with {session.mentor}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusStyle(session.status)}`}>
                {getStatusText(session.status)}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                {new Date(session.date).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-blue-600" />
                {session.time}
              </div>
              <div className="flex items-center text-gray-600">
                {session.mode === 'online' ? (
                  <Monitor className="w-4 h-4 mr-2 text-blue-600" />
                ) : (
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                )}
                {session.mode === 'online' ? 'Online Session' : 'Offline Session'}
              </div>
              {session.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                  {session.location}
                </div>
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between text-gray-600">
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                  Payment Amount: ${session.amount}
                </div>
                <div className="text-sm">
                  Payment Date: {new Date(session.paymentDate).toLocaleDateString()}
                </div>
              </div>
              {session.status === 'waiting_verification' && (
                <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    Your payment is being verified. This usually takes 1-2 business days.
                    We'll notify you once the verification is complete.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}