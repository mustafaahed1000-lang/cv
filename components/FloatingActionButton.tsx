
import React from 'react';

interface FloatingActionButtonProps {
    onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-8 right-8 bg-cyan-500 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 z-50 animate-bounce"
            aria-label="افتح المساعد الذكي"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
        </button>
    );
};

export default FloatingActionButton;
