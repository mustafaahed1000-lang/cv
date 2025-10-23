import React from 'react';

interface SectionProps {
    id: string;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, children, className = '' }) => {
    return (
        <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 ${className}`}>
            <div className="container mx-auto text-center">
                <h2 className="text-4xl font-black text-white mb-4 relative inline-block">
                    {title}
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-cyan-400 rounded-full"></span>
                </h2>
                {subtitle && (
                    <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">{subtitle}</p>
                )}
                <div className="mt-12">
                    {children}
                </div>
            </div>
        </section>
    );
};

export default Section;