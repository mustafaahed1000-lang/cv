import React, { useState, useEffect, useRef } from 'react';

interface TerminalCVProps {
    onClose: () => void;
}

const cvContent = [
    './fetch-cv-mustafa-emrish.sh',
    'Fetching professional data... Access Granted.',
    '---',
    '## التفاصيل الشخصية (Personal Info)',
    '* الاسم: مصطفى عاهد أمريش',
    '* البريد الإلكتروني: mustafa.ahed2000@gmail.com',
    '* الهاتف: 0594643895',
    '* العنوان: الخليل، فلسطين',
    '---',
    '## الهدف الوظيفي (Objective)',
    '> متخصص في تكنولوجيا المعلومات بخلفية قوية في أنظمة وشبكات الحاسوب، وخبير في الأمن السيبراني. أسعى لتطبيق خبراتي لضمان سلامة وتأمين البنى التحتية التقنية وتطوير حلول مبتكرة لتعزيز الأمان المعلوماتي.',
    '---',
    '## الخبرة العملية (Experience)',
    '* المسمى: مطور واجهات أمامية وخلفية (Full-Stack)',
    '* الفترة: أغسطس 2023 - حتى الآن',
    '* المهام: تطوير واجهات (React)، بناء تطبيقات خادم (Node.js)، تصميم قواعد بيانات (MySQL, MongoDB)، تطبيق ممارسات البرمجة الآمنة، وتحسين أداء التطبيقات.',
    '---',
    '## المؤهلات الدراسية (Education)',
    '* بكالوريوس تكنولوجيا المعلومات (2022 - 2026) - جامعة القدس المفتوحة',
    '* شهادة في الأمن السيبراني (2023 - 2025) - جامعة القدس المفتوحة',
    '---',
    '## المهارات التقنية (Skills)',
    '* أمن المعلومات: جيد جدًا',
    '* إدارة قواعد البيانات: جيد جدًا',
    '* البرمجة وتطوير البرمجيات: جيد جدًا',
    '* إدارة الشبكات: جيد',
    '* تحليل البيانات: جيد جدًا',
    '---',
    '## اللغات (Languages)',
    '* العربية: مستوى الطلاقة',
    '* الإنجليزية: متوسط المستوى',
    '---',
    'Process finished successfully.',
    'CV data loaded. Ready for download.',
];


const TerminalCV: React.FC<TerminalCVProps> = ({ onClose }) => {
    const [lines, setLines] = useState<string[]>([]);
    const terminalEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < cvContent.length) {
                setLines(prev => [...prev, cvContent[currentIndex]]);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 150); // Adjust speed of typing here

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [lines]);
    
    const cvDownloadLink = "/mustafa-emrish-cv.pdf"; 

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 font-mono" onClick={onClose}>
            <div className="bg-black border-2 border-green-500 rounded-lg shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col text-green-400" onClick={(e) => e.stopPropagation()}>
                {/* Terminal Header */}
                <div className="flex justify-between items-center p-2 bg-gray-800 border-b border-green-500">
                    <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                    <h3 className="text-sm text-gray-300">mustafa@portfolio: ~/cv</h3>
                     <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 p-4 overflow-y-auto text-sm relative terminal-body">
                    {lines.map((line, index) => {
                        if (typeof line !== 'string') {
                            return null;
                        }

                        if (index === 0) {
                            return (
                                <div key={index} className="flex">
                                    <span className="text-cyan-400 mr-2">$</span>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{line}</p>
                                </div>
                            );
                        }
                        if (line.startsWith('## ')) {
                            return <p key={index} className="text-cyan-400 font-bold mt-2" style={{ whiteSpace: 'pre-wrap' }}>{line.substring(3)}</p>;
                        }
                        if (line.startsWith('> ')) {
                            return <p key={index} className="text-gray-300 italic ml-4 border-l-2 border-gray-500 pl-2 my-1" style={{ whiteSpace: 'pre-wrap' }}>{line.substring(2)}</p>;
                        }
                        if (line.startsWith('* ')) {
                            return <p key={index} className="ml-4" style={{ whiteSpace: 'pre-wrap' }}>• {line.substring(2)}</p>;
                        }
                        if (line === '---') {
                            return <p key={index} className="text-gray-600 my-1">--------------------------------------------------</p>;
                        }
                        return <p key={index} className="text-green-400" style={{ whiteSpace: 'pre-wrap' }}>{line}</p>;
                    })}

                    {lines.length === cvContent.length && (
                         <div className="flex items-center mt-2">
                            <span className="text-cyan-400 mr-2">$</span>
                            <span className="w-2 h-4 bg-green-400 animate-blink"></span>
                        </div>
                    )}
                     <div ref={terminalEndRef} />
                </div>
                 {/* Terminal Footer with Download Button */}
                {lines.length === cvContent.length && (
                    <div className="p-2 border-t border-green-500 text-center bg-gray-800">
                        <a 
                            href={cvDownloadLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-400 transition-colors text-sm font-bold"
                        >
                            تحميل السيرة الذاتية (PDF)
                        </a>
                    </div>
                )}
            </div>
             <style>{`
                @keyframes blink {
                    50% { opacity: 0; }
                }
                .animate-blink {
                    animation: blink 1s step-end infinite;
                }
                .terminal-body::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: repeating-linear-gradient(
                        0deg,
                        rgba(0, 0, 0, 0.15),
                        rgba(0, 0, 0, 0.15) 1px,
                        transparent 1px,
                        transparent 3px
                    );
                    pointer-events: none;
                }
            `}</style>
        </div>
    );
};

export default TerminalCV;