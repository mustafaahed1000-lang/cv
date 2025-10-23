import React, { useState, useEffect } from 'react';
import { NAMES_IN_LANGUAGES } from '../constants';

// Array of GIFs for the text background carousel
const gifBackgrounds = [
    '/images/slide1.jpg',
  '/images/slide2.jpg',
  '/images/slide3.jpg',
  '/images/slide4.jpg',
  '/images/slide5.jpg',
  '/images/slide6.jpg',
  '/images/slide7.jpg',
  '/images/slide8.gif'// Abstract Circuit
];

const Hero: React.FC = () => {
    const [showNames, setShowNames] = useState(false);
    const [animatedNames, setAnimatedNames] = useState<{ id: number; name: string; style: React.CSSProperties }[]>([]);
    const [currentGifIndex, setCurrentGifIndex] = useState(0);

    // Effect for the main name's GIF background carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentGifIndex(prevIndex => (prevIndex + 1) % gifBackgrounds.length);
        }, 3000); // Change GIF every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const triggerAnimation = () => {
        if (showNames) return;
        setShowNames(true);
    };

    // Effect for the floating names animation on click
    useEffect(() => {
        if (showNames) {
            const newAnimatedNames = NAMES_IN_LANGUAGES.map((item, index) => ({
                id: index,
                name: item.name,
                style: {
                    position: 'absolute',
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    color: `hsl(${Math.random() * 360}, 100%, 70%)`,
                    animation: `fade-in-out ${Math.random() * 2 + 3}s ease-in-out forwards`,
                    fontSize: `${Math.random() * 1.5 + 1}rem`,
                    textShadow: '0 0 5px currentColor',
                } as React.CSSProperties,
            }));
            setAnimatedNames(newAnimatedNames);

            const timer = setTimeout(() => {
                setShowNames(false);
                setAnimatedNames([]);
            }, 5000); // Animation duration

            return () => clearTimeout(timer);
        }
    }, [showNames]);

    return (
        <section 
            className="h-screen flex items-center justify-center text-center bg-cover bg-center relative overflow-hidden transition-all duration-1000 ease-in-out"
            style={{ backgroundImage: `url('${gifBackgrounds[currentGifIndex]}')` }}
        >
            <div className="absolute inset-0 bg-gray-900 opacity-80"></div>
            <div className="relative z-10 px-4">
                <h1 
                    className="text-5xl sm:text-7xl lg:text-8xl font-black text-white cursor-pointer transition-all duration-1000 ease-in-out hover:scale-105"
                    onClick={triggerAnimation}
                >
                    مصطفى عاهد أمريش
                </h1>
                <p className="mt-4 text-lg sm:text-xl md:text-2xl text-cyan-400 text-glow">
                    خبير في تطوير المواقع والتطبيقات والذكاء الاصطناعي
                </p>
                {showNames && (
                    <div className="absolute inset-0 w-full h-full">
                        {animatedNames.map(item => (
                            <span key={item.id} style={item.style}>
                                {item.name}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fade-in-out {
                    0% { opacity: 0; transform: scale(0.5); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0; transform: scale(0.5); }
                }
            `}</style>
        </section>
    );
};

export default Hero;