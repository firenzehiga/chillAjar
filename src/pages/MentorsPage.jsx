import React from 'react';
import { MentorCard } from '../components/MentorCard';

// Sample mentors data with courses
const mentors = [
  {
    id: 'm1',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    rating: 4.8,
    expertise: ['Calculus', 'Linear Algebra'],
    availability: { online: true, offline: true },
    phone: '+1234567890',
    location: 'Central Library, Building A',
    courses: [
      {
        id: 'c1',
        title: 'Advanced Calculus',
        price_per_hour: 50,
        description: 'Master complex calculus concepts'
      },
      {
        id: 'c2',
        title: 'Linear Algebra Fundamentals',
        price_per_hour: 45,
        description: 'Understanding vector spaces and linear transformations'
      }
    ]
  },
  {
    id: 'm2',
    name: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
    rating: 4.9,
    expertise: ['Algorithms', 'Python'],
    availability: { online: true, offline: false },
    phone: '+1234567891',
    courses: [
      {
        id: 'c3',
        title: 'Python Programming',
        price_per_hour: 55,
        description: 'Learn Python from basics to advanced'
      },
      {
        id: 'c4',
        title: 'Data Structures & Algorithms',
        price_per_hour: 60,
        description: 'Master fundamental computer science concepts'
      }
    ]
  },
  {
    id: 'm3',
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    rating: 4.7,
    expertise: ['Physics', 'Mathematics'],
    availability: { online: true, offline: true },
    phone: '+1234567892',
    location: 'Science Building, Room 204',
    courses: [
      {
        id: 'c5',
        title: 'Physics Mechanics',
        price_per_hour: 50,
        description: 'Understanding fundamental physics principles'
      },
      {
        id: 'c6',
        title: 'Advanced Mathematics',
        price_per_hour: 55,
        description: 'Complex mathematical problem solving'
      }
    ]
  }
];

export function MentorsPage({ onSchedule }) {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mentors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map(mentor => (
          <MentorCard
            key={mentor.id}
            mentor={mentor}
            onSchedule={onSchedule}
            showCourseSelect={true}
          />
        ))}
      </div>
    </div>
  );
}