import React from 'react';
import { User, Mail, MapPin, Phone, Calendar, BookOpen, Star, Award } from 'lucide-react';

// Mock user data - In real app, this would come from authentication
const currentUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  location: 'New York, USA',
  phone: '+1 234 567 890',
  joinedDate: 'January 2024',
  completedCourses: 12,
  averageRating: 4.8,
  achievements: ['Quick Learner', 'Top Student', 'Perfect Attendance']
};

export function ProfilePage() {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-500 to-blue-600 relative">
            <div className="absolute -bottom-16 left-8">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg transform transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentUser.name}</h2>
                <p className="text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {currentUser.joinedDate}
                </p>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium transform transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-lg">
                Edit Profile
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
                <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{currentUser.completedCourses}</div>
                <div className="text-sm text-gray-600">Courses Completed</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
                <Star className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{currentUser.averageRating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl text-center transform transition-all duration-300 hover:scale-105">
                <Award className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{currentUser.achievements.length}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
                  <Mail className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
                  <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{currentUser.location}</span>
                </div>
                <div className="flex items-center text-gray-600 transform transition-all duration-300 hover:translate-x-2">
                  <Phone className="w-5 h-5 mr-3 text-blue-600" />
                  <span>{currentUser.phone}</span>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h3>
              <div className="flex flex-wrap gap-3">
                {currentUser.achievements.map((achievement, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    {achievement}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}