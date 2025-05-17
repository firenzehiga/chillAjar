import React from 'react';
import { CourseCard } from '../components/CourseCard';

export function CoursesPage({ courses, onCourseClick }) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={onCourseClick}
          />
        ))}
      </div>
    </div>
  );
}