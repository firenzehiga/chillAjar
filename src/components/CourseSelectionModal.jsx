import React from 'react';
import { X, BookOpen } from 'lucide-react';

export function CourseSelectionModal({ courses, onSelect, onClose, selectedCourse }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Select a Course</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Course List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => onSelect(course)}
                className={`w-full p-4 rounded-lg border transition-all ${
                  selectedCourse?.id === course.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium">{course.title}</span>
                  </div>
                  <span className="text-sm text-gray-600">${course.price_per_hour}/hour</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 text-left">{course.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCourse && onSelect(selectedCourse)}
              className={`px-4 py-2 rounded-lg font-medium ${
                selectedCourse
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}