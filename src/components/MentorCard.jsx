import React, { useState } from 'react';
import { Star, Phone, MapPinIcon, Monitor, BookOpen, Award, Clock, Heart } from 'lucide-react';
import { CourseSelectionModal } from './CourseSelectionModal';

export function MentorCard({ mentor, onSchedule, showCourseSelect = false, selectedCourse = null }) {
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [selectedMentorCourse, setSelectedMentorCourse] = useState(selectedCourse);
  const [showDetails, setShowDetails] = useState(false);

  const handleScheduleClick = () => {
    if (!selectedMentorCourse && mentor.courses) {
      setShowCourseModal(true);
      return;
    }
    onSchedule(mentor, selectedMentorCourse || selectedCourse);
  };

  const handleCourseSelect = (course) => {
    setSelectedMentorCourse(course);
    setShowCourseModal(false);
    onSchedule(mentor, course);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
        {/* Profile Header */}
        <div className="relative">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600"></div>
          <div className="absolute -bottom-12 left-6">
            <img 
              src={mentor.avatar} 
              alt={mentor.name} 
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        <div className="pt-14 px-6 pb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{mentor.name}</h3>
              <div className="flex items-center text-yellow-400 mt-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                <span className="text-gray-500 text-sm ml-2">({mentor.totalReviews || '50+'} reviews)</span>
              </div>
            </div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {showDetails ? 'Show Less' : 'View Details'}
            </button>
          </div>

          {/* Expertise Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {mentor.expertise.map((skill, index) => (
              <span 
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {/* Expanded Details */}
          {showDetails && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Experience</span>
                  </div>
                  <p className="text-gray-900">{mentor.experience || '5+ years'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Award className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium">Students</span>
                  </div>
                  <p className="text-gray-900">{mentor.totalStudents || '100+'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">About</h4>
                <p className="text-gray-600 text-sm">
                  {mentor.about || 'Experienced educator passionate about helping students succeed. Specializing in personalized learning approaches and interactive teaching methods.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Teaching Locations</h4>
                <div className="space-y-2">
                  {mentor.availability.offline && mentor.location && (
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{mentor.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <Monitor className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm">
                      {mentor.availability.online ? 'Available for online sessions' : 'Online sessions unavailable'}
                    </span>
                  </div>
                </div>
              </div>

              {mentor.phone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm">{mentor.phone}</span>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleScheduleClick}
            className="w-full mt-6 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            <BookOpen className="w-4 h-4" />
            {selectedMentorCourse ? 'Book Selected Course' : 'Select Course'}
          </button>
        </div>
      </div>

      {showCourseModal && (
        <CourseSelectionModal
          courses={mentor.courses || []}
          selectedCourse={selectedMentorCourse}
          onSelect={handleCourseSelect}
          onClose={() => setShowCourseModal(false)}
        />
      )}
    </>
  );
}