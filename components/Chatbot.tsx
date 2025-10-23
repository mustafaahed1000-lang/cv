import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI } from '../services/geminiService';
import type { Message } from '../types';

interface ChatbotProps {
    onClose: () => void;
}

// FIX: Add type definitions for the Web Speech API to resolve TypeScript errors.
// This is necessary because the required DOM libraries might not be included in the project's tsconfig.
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

// Ensure SpeechRecognition types are available on the window object
declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}

const Chatbot: React.FC<ChatbotProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCooldown, setIsCooldown] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'ar-SA';
            recognition.interimResults = false;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setUserInput(transcript);
            };

            recognition.onend = () => {
                setIsRecording(false);
            };

            recognition.onerror = (event) => {
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setMicError('تم رفض الوصول إلى الميكروفون. يرجى تمكينه في إعدادات المتصفح.');
                } else {
                    setMicError(`حدث خطأ في التعرف على الكلام: ${event.error}`);
                }
                setIsRecording(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Speech recognition not supported in this browser.");
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setMessages([
            { sender: 'bot', text: 'مرحبًا! أنا المساعد الذكي لمصطفى أمريش. كيف يمكنني مساعدتك اليوم؟' }
        ]);
    }, []);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading || isCooldown) return;

        const userMessage: Message = { sender: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const botResponseText = await sendMessageToAI(userInput);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
        } catch (error: any) {
            let errorMessageText = 'عذرًا، حدث خطأ ما. يرجى المحاولة مرة أخرى.';
            if (error.response && error.response.status === 429) {
                errorMessageText = 'عذرًا، لقد تم تجاوز الحد اليومي للطلبات المجانية. يرجى المحاولة مرة أخرى غدًا أو استخدام مفتاح API آخر.';
            }
            const errorMessage: Message = { sender: 'bot', text: errorMessageText };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            setIsCooldown(true);
            setTimeout(() => setIsCooldown(false), 5000); // 5-second cooldown
        }
    };

    const handleMicClick = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            return;
        }

        if (recognitionRef.current) {
            setMicError(null);
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (e) {
                console.error("Could not start recognition:", e);
                setMicError('لم يتمكن من بدء التسجيل. قد يكون قيد الاستخدام بالفعل.');
                setIsRecording(false);
            }
        } else {
            setMicError('متصفحك لا يدعم ميزة التعرف على الكلام.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-cyan-500 rounded-lg shadow-2xl w-full max-w-lg h-[80vh] flex flex-col text-white">
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-cyan-400">المساعد الذكي</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                            <div className="bg-gray-700 p-3 rounded-lg flex items-center space-x-2">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></span>
                                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={isCooldown ? 'يرجى الانتظار قبل إرسال رسالة أخرى...' : 'اكتب رسالتك هنا...'}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            disabled={isLoading || isCooldown}
                        />
                         <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={isLoading || isCooldown}
                            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-50`}
                            aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل الصوتي'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        <button type="submit" disabled={isLoading || isCooldown || !userInput.trim()} className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                            إرسال
                        </button>
                    </form>
                    {micError && <p className="text-red-500 text-xs mt-2 text-center">{micError}</p>}
                </div>
            </div>
        </div>
    );
};

export default Chatbot;