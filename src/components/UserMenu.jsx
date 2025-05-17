import React, { useState } from 'react';
import { LogOut, User, Settings, History } from 'lucide-react';

// Mock user data - In real app, this would come from authentication
const currentUser = {
  name: 'Firenze Higa Putra',
  email: 'firenhiga@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
};

export function UserMenu({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 focus:outline-none group"
      >
        <span className="text-sm font-medium text-gray-700 hidden sm:block group-hover:text-blue-600">
          {currentUser.name}
        </span>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="h-8 w-8 rounded-full ring-2 ring-gray-200 group-hover:ring-blue-200"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-gray-500">{currentUser.email}</p>
          </div>

          <button
            onClick={() => handleNavigate('profile')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Your Profile
          </button>

          <button
            onClick={() => handleNavigate('history')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <History className="w-4 h-4 mr-2" />
            Session History
          </button>

          <button
            onClick={() => handleNavigate('settings')}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>

          <button
            onClick={() => {
              // Handle logout
              setIsOpen(false);
            }}
            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}