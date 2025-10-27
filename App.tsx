import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Certificate from './components/Certificate';
import Games from './components/Games';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import FloatingActionButton from './components/FloatingActionButton';
import TerminalCV from './components/TerminalCV';

const App: React.FC = () => {
    const [isChatbotOpen, setChatbotOpen] = useState(false);
    const [isTerminalOpen, setTerminalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        // Get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting user location:", error);
                }
            );
        }
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
        e.preventDefault();
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false); // Close mobile menu on click
    };
    
    const handleTerminalClick = () => {
        setTerminalOpen(true);
        setIsMenuOpen(false);
    };

    const handleChatbotClick = () => {
        setChatbotOpen(true);
        setIsMenuOpen(false);
    };

    return (
        <div className="relative min-h-screen bg-gray-900 text-gray-200 overflow-x-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0"></div>
            
            <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-80 backdrop-blur-md z-50 shadow-lg shadow-cyan-500/10">
                <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <h1 className="text-2xl font-black text-cyan-400 text-glow opacity-80">مصطفى أمريش</h1>
                    
                    {/* Desktop Menu */}
                    <ul className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
                        <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="hover:text-cyan-400 transition-colors duration-300">عني</a></li>
                        <li><a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="hover:text-cyan-400 transition-colors duration-300">مهاراتي</a></li>
                        <li><a href="#certificate" onClick={(e) => handleNavClick(e, 'certificate')} className="hover:text-cyan-400 transition-colors duration-300">شهادتي</a></li>
                        <li><a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="hover:text-cyan-400 transition-colors duration-300">ألعاب</a></li>
                        <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="hover:text-cyan-400 transition-colors duration-300">تواصل</a></li>
                        <li><button onClick={() => setTerminalOpen(true)} className="hover:text-cyan-400 transition-colors duration-300">سيرتي التفاعلية</button></li>
                        <li><button onClick={() => setChatbotOpen(true)} className="hover:text-cyan-400 transition-colors duration-300 bg-cyan-500/20 px-3 py-1 rounded-md">دردشة مع الذكاء الاصطناعي</button></li>
                    </ul>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-gray-900 bg-opacity-95 absolute top-full left-0 w-full">
                        <ul className="flex flex-col items-center space-y-6 py-8">
                            <li><a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-lg hover:text-cyan-400 transition-colors duration-300">عني</a></li>
                            <li><a href="#skills" onClick={(e) => handleNavClick(e, 'skills')} className="text-lg hover:text-cyan-400 transition-colors duration-300">مهاراتي</a></li>
                            <li><a href="#certificate" onClick={(e) => handleNavClick(e, 'certificate')} className="text-lg hover:text-cyan-400 transition-colors duration-300">شهادتي</a></li>
                            <li><a href="#games" onClick={(e) => handleNavClick(e, 'games')} className="text-lg hover:text-cyan-400 transition-colors duration-300">ألعاب</a></li>
                            <li><a href="#contact" onClick={(e) => handleNavClick(e, 'contact')} className="text-lg hover:text-cyan-400 transition-colors duration-300">تواصل</a></li>
                            <li><button onClick={handleTerminalClick} className="text-lg hover:text-cyan-400 transition-colors duration-300">سيرتي التفاعلية</button></li>
                            <li><button onClick={handleChatbotClick} className="text-lg hover:text-cyan-400 transition-colors duration-300 bg-cyan-500/20 px-4 py-2 rounded-md">دردشة مع الذكاء الاصطناعي</button></li>
                        </ul>
                    </div>
                )}
            </header>

            <main className="relative z-10 pt-20"> {/* Add padding-top to avoid content being hidden by fixed header */}
                <Hero />
                <About />
                <Skills />
                <Certificate />
                <Games />
                <Contact />
            </main>

            <footer className="relative z-10 bg-gray-900 bg-opacity-70 py-6 text-center text-gray-400">
                <p>&copy; 2024 مصطفى عاهد أمريش. كل الحقوق محفوظة.</p>
            </footer>

            <FloatingActionButton onClick={() => setChatbotOpen(true)} />
            {isChatbotOpen && <Chatbot onClose={() => setChatbotOpen(false)} userLocation={userLocation} />}
            {isTerminalOpen && <TerminalCV onClose={() => setTerminalOpen(false)} />}
        </div>
    );
};

export default App;
