
import React, { useState, useEffect, useRef } from 'react';
import type { Message } from '../types';
import { resolveIntent, IntentID } from '../utils/intentResolver';
import { topicSuggestions } from '../data/chatbotTopicsExtended';
import { interactiveQuestions } from '../data/interactiveQuestions';
import {
  getWeatherForLocation,
  getPrayerTimesForLocation,
} from '../utils/environmentData';
import { chatbotTopics } from '../data/chatbotTopics';


// --- Interfaces and Type Definitions ---

interface ChatbotProps {
    onClose: () => void;
    userLocation: { latitude: number; longitude: number } | null;
}

interface SpeechRecognition {
    continuous: boolean;
    lang: string;
    interimResults: boolean;
    onresult: (event: any) => void;
    onend: () => void;
    onerror: (event: any) => void;
    start: () => void;
    stop: () => void;
}

interface SpeechRecognitionStatic {
    new (): SpeechRecognition;
}

declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}

const extractCity = (text: string): string | null => {
    const cities = ["غزة", "رام الله", "نابلس", "الخليل", "جنين", "طولكرم", "بيت لحم", "أريحا", "قلقيلية", "رفح", "خانيونس"];
    const lowerText = text.toLowerCase();
    for (const city of cities) {
        if (lowerText.includes(city)) {
            return city;
        }
    }
    return null;
}


// --- React Component ---

const Chatbot: React.FC<ChatbotProps> = ({ onClose, userLocation }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastIntent, setLastIntent] = useState<IntentID | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // --- Effects ---

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'ar-PS';
            recognition.onresult = (event) => setUserInput(event.results[0][0].transcript);
            recognition.onend = () => setIsRecording(false);
            recognition.onerror = (event) => {
                setMicError(event.error === 'not-allowed' ? 'تم رفض الوصول إلى الميكروفون.' : `حدث خطأ: ${event.error}`);
                setIsRecording(false);
            };
            recognitionRef.current = recognition;
        }
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        setMessages([{ sender: 'bot', text: 'أهلاً وسهلاً! أنا المساعد الذكي لمصطفى أمريش 😊 كيف يمكنني مساعدتك اليوم؟' }]);
    }, []);

    
    // --- Core Logic: handleSendMessage ---

    const handleSendMessage = async (e: React.FormEvent, question?: string) => {
        e.preventDefault();
        const textToSend = (question || userInput).trim();
        if (!textToSend || isLoading) return;

        setMessages(prev => [...prev, { sender: 'user', text: textToSend }]);
        setUserInput('');
        setIsLoading(true);

        const intent = resolveIntent(textToSend);
        setLastIntent(intent);
        let botReply: string;

        if (intent === 'game') {
            const q = interactiveQuestions[Math.floor(Math.random() * interactiveQuestions.length)];
            botReply = q.text;
        } else if (intent === 'weather') {
            const detectedCity = extractCity(textToSend);
            const w = getWeatherForLocation(detectedCity || "فلسطين");
            botReply = `الجو في ${w.city}: ${w.description}, الحرارة تقريباً ${w.tempC}°C`;
        } else if (intent === 'prayerTimes') {
            const detectedCity = extractCity(textToSend);
            const p = getPrayerTimesForLocation(detectedCity || "فلسطين");
            botReply = `الصلاة الجاية (${p.nextPrayerName}) في ${p.city} الساعة ${p.nextPrayerTime}`;
        } else {
            // Fallback to original logic based on intent
            switch (intent) {
                case 'cybersecurity':
                    botReply = 'الأمن السيبراني هو مجال واسع ومهم. يمكنك أن تسألني عن كيفية حماية حساباتك، ما هو التصيد الاحتيالي، أو عن الفيروسات.';
                    break;
                case 'programming':
                    botReply = 'البرمجة عالم ممتع. أستطيع إخبارك عن لغات البرمجة المختلفة، والفرق بين تطوير الواجهات الأمامية والخلفية، وغير ذلك الكثير.';
                    break;
                 case 'siteInfo':
                    botReply = 'أنا مساعد ذكي طوره مصطفى أمريش. وظيفتي هي الإجابة على أسئلتك حول البرمجة، والأمن السيبراني، ومواضيع أخرى متنوعة. يمكننا أيضاً أن نلعب لعبة أسئلة إذا أردت!';
                    break;
                case 'money':
                    botReply = 'يمكن تحقيق الدخل عبر الإنترنت من خلال العمل الحر (freelancing) في مجالات مثل البرمجة، التصميم، أو كتابة المحتوى. من المهم الحذر من عمليات النصب والاحتيال.';
                    break;
                case 'userMood':
                    botReply = 'أتفهم أنك قد تشعر بالضيق أحياناً. أنا هنا لأستمع إليك. تذكر أن الحديث عن مشاعرك يمكن أن يساعد.';
                    break;
                case 'darkweb':
                    botReply = 'الدارك ويب هو جزء من الإنترنت لا يمكن الوصول إليه عبر محركات البحث العادية. غالباً ما يرتبط بأنشطة غير قانونية، لذا يجب توخي الحذر الشديد عند التعامل معه.';
                    break;
                default:
                    botReply = `عذرًا، لم أفهم سؤالك تمامًا. يمكنك أن تسألني عن مصطفى، خدماته في البرمجة والأمن السيبراني، أو تجربة أحد الأسئلة المقترحة.`;
            }
        }

        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
        setIsLoading(false);
    };

    // --- UI Event Handlers ---

    const handleMicClick = () => {
        if (!recognitionRef.current) {
            setMicError('المتصفح لا يدعم التعرف على الكلام.');
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            setMicError(null);
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };
    
    const handleSuggestedQuestionClick = (question: string) => {
        const syntheticEvent = { preventDefault: () => {} } as React.FormEvent;
        handleSendMessage(syntheticEvent, question);
    };
    
    const suggestions = lastIntent ? (topicSuggestions[lastIntent] || []) : [];


    // --- JSX Render ---
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl w-full max-w-lg h-[80vh] flex flex-col text-white">
                <header className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-cyan-400">المساعد الذكي</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index}>
                            <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                                </div>
                            </div>
                            {index === messages.length - 1 && msg.sender === 'bot' && (
                                <div className="suggestions-row flex flex-wrap gap-2 mt-2">
                                  {suggestions.map(s => (
                                    <button
                                      key={s.id}
                                      className="suggestion-btn bg-gray-700 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-600 transition-colors"
                                      onClick={() => handleSuggestedQuestionClick(s.text)}
                                    >
                                      {s.text}
                                    </button>
                                  ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                           <div className="bg-gray-700 p-3 rounded-lg flex items-center space-x-2 rtl:space-x-reverse">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </main>

                <footer className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse pt-2">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={isLoading}
                            className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
                            aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل'}
                        >
                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                        </button>
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-400 disabled:opacity-50">
                            إرسال
                        </button>
                    </form>
                    {micError && <p className="text-red-500 text-xs mt-2 text-center">{micError}</p>}
                </footer>
            </div>
        </div>
    );
};

export default Chatbot;
