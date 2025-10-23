import React, { useState } from 'react';
import Section from './Section';
import HackerGame from './HackerGame';
import CodingGame from './CodingGame';
import WebBuilderGame from './WebBuilderGame';

type Game = 'hacker' | 'coding' | 'web';

const Games: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game>('hacker');

    const renderGame = () => {
        switch (activeGame) {
            case 'hacker':
                return <HackerGame />;
            case 'coding':
                return <CodingGame />;
            case 'web':
                return <WebBuilderGame />;
            default:
                return <HackerGame />;
        }
    };

    return (
        <Section id="games" title="ألعاب تفاعلية" className="bg-gray-800 bg-opacity-50">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-center flex-wrap gap-4 mb-8">
                    <button
                        onClick={() => setActiveGame('hacker')}
                        className={`px-6 py-2 rounded-md transition-colors duration-300 ${activeGame === 'hacker' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        لعبة الهكر
                    </button>
                    <button
                        onClick={() => setActiveGame('coding')}
                        className={`px-6 py-2 rounded-md transition-colors duration-300 ${activeGame === 'coding' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        لعبة البرمجة
                    </button>
                    <button
                        onClick={() => setActiveGame('web')}
                        className={`px-6 py-2 rounded-md transition-colors duration-300 ${activeGame === 'web' ? 'bg-cyan-500 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        لعبة بناء المواقع
                    </button>
                </div>
                <div className="bg-black rounded-lg p-4 md:p-8 border border-cyan-500 shadow-2xl shadow-cyan-500/20 min-h-[400px]">
                    {renderGame()}
                </div>
            </div>
        </Section>
    );
};

export default Games;