
import React from 'react';
import Section from './Section';

const Contact: React.FC = () => {
    const phoneNumber = "970594643895";
    const whatsappLink = `https://wa.me/${phoneNumber}`;

    return (
        <Section id="contact" title="تواصل معي">
            <div className="max-w-md mx-auto">
                <p className="text-base sm:text-lg text-gray-300 mb-8">
                    هل لديك فكرة مشروع أو ترغب في التعاون؟ لا تتردد في التواصل معي!
                </p>
                <a 
                    href={whatsappLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 text-white font-bold py-3 px-6 md:py-4 md:px-8 rounded-lg text-lg md:text-xl transition-transform duration-300 hover:scale-110 hover:bg-green-400 shadow-lg shadow-green-500/30"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 inline-block mr-2 md:mr-3" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.731 6.086l.287.468-1.173 4.267 4.38-1.147.444.263z" />
                    </svg>
                    تحدث معي على واتساب
                </a>
                <p className="mt-4 text-sm sm:text-base text-gray-400">0594643895</p>
            </div>
        </Section>
    );
};

export default Contact;
