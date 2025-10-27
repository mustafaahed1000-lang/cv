import React, { useState, useEffect, useRef } from 'react';

import type { Message, QA } from '../types';
import { DEFAULT_SUGGESTIONS, detectTopic, getSuggestionsForTopic, getTopicLabel, normalizeText } from '../data/chatbotTopics';
import { getRandomInteractiveQuestion } from '../data/interactiveQuestions';

interface ChatbotProps {
    onClose: () => void;
}

interface RankedMatch {
    qa: QA;
    score: number;
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
    
    const [isRecording, setIsRecording] = useState(false);
    const [micError, setMicError] = useState<string | null>(null);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(() => DEFAULT_SUGGESTIONS);
    const [areSuggestionsCollapsed, setAreSuggestionsCollapsed] = useState(false);
    const [activeTopic, setActiveTopic] = useState<string>('general');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const updateSuggestions = (topicId?: string | null) => {
        const requestedTopic = topicId ?? 'general';
        const generalLabel = getTopicLabel('general');
        const requestedLabel = getTopicLabel(requestedTopic);
        const resolvedTopic = requestedLabel === generalLabel && requestedTopic !== 'general' ? 'general' : requestedTopic;

        setActiveTopic(resolvedTopic);
        setSuggestedQuestions(getSuggestionsForTopic(resolvedTopic));
    };

    const topicLabel = getTopicLabel(activeTopic);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.lang = 'ar-PS'; // Changed to Palestinian Arabic for better accuracy
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
            { sender: 'bot', text: 'أهلاً وسهلاً! أنا المساعد الذكي لمصطفى أمريش 😊 كيف يمكنني مساعدتك اليوم؟' }
        ]);
    }, []);

    useEffect(() => {
        updateSuggestions('general');
    }, []);

    const processUserMessage = async (input: string) => {
        if (isLoading) return;
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const userMessage: Message = { sender: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        const searchTerm = trimmedInput.toLowerCase();
        const normalizedSearch = normalizeText(trimmedInput) || searchTerm;
        const searchTokens = new Set(normalizedSearch.split(' ').filter((token) => token.length > 2));
        setUserInput('');
        setIsLoading(true);

        console.log('Processing question:', trimmedInput);
        console.log('Search term:', searchTerm);
        console.log('Normalized term:', normalizedSearch);

       // تجاهل استدعاء API الخارجي والاعتماد على المنطق المحلي مباشرة
// هذا يضمن أن حالة الطقس ومواقيت الصلاة تعمل دائماً
console.log('Using local logic for weather and prayer times');


        // --- Palestinian & Formal Arabic Priority Questions Logic ---
        let botResponseText: string | null = null;
        
        // مصطفى أمريش - من هو (Palestinian & Formal)
        if ((searchTerm.includes('مين') && searchTerm.includes('مصطفى')) || 
            (searchTerm.includes('من') && searchTerm.includes('مصطفى')) ||
            (searchTerm.includes('شو') && searchTerm.includes('مصطفى')) ||
            (searchTerm.includes('ماذا') && searchTerm.includes('مصطفى')) ||
            searchTerm.includes('مصطفى أمريش') ||
            searchTerm.includes('مصطفى عاهد أمريش')) {
            botResponseText = 'مصطفى عاهد أمريش هو مطوّر ويب متخصص في بناء تطبيقات الويب والأمن السيبراني والمشاريع مفتوحة المصدر 💻🔒. يعمل على تطوير مواقع وتطبيقات ويقدم خدمات الأمن السيبراني والاختراق الأخلاقي 🛡️✨';
        }
        
        // شو بعمل مصطفى / ماذا يعمل مصطفى
        else if ((searchTerm.includes('شو') && searchTerm.includes('بعمل') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('يعمل') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('بتشتغل') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('يعمل')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('بتعمل'))) {
            botResponseText = 'مصطفى يعمل في تطوير المواقع والتطبيقات 🌐، ويقدم خدمات الأمن السيبراني والاختراق الأخلاقي 🔐. كما أنه متخصص في البرمجة وتطوير المشاريع التقنية 💻⚡';
        }
        
        // البرمجة - شو هي / ما هي البرمجة
        else if ((searchTerm.includes('شو') && searchTerm.includes('البرمجة')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('البرمجة')) ||
                 (searchTerm.includes('ما') && searchTerm.includes('هي') && searchTerm.includes('البرمجة')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('هي') && searchTerm.includes('البرمجة'))) {
            botResponseText = 'البرمجة هي عملية كتابة تعليمات للحاسوب لتنفيذ مهام معينة 💻✨. مصطفى متخصص في لغات البرمجة المختلفة مثل JavaScript, Python, React وغيرها من التقنيات الحديثة 🚀⚡';
        }
        
        // الأمن السيبراني - شو هو / ما هو الأمن السيبراني
        else if (searchTerm.includes('الأمن') && searchTerm.includes('السيبراني')) {
            botResponseText = 'الأمن السيبراني هو حماية الأنظمة والشبكات والبرامج من الهجمات الرقمية 🛡️🔒. مصطفى متخصص في الأمن السيبراني ويقدم خدمات الاختراق الأخلاقي وفحص الثغرات الأمنية 🔍⚡';
        }
        
        // الأمن السيبراني بدون التعريف
        else if (searchTerm.includes('امن سبراني') || searchTerm.includes('أمن سبراني')) {
            botResponseText = 'الأمن السيبراني 🔐🛡️:\n\n• حماية الأنظمة والشبكات 💻🌐\n• منع الهجمات الرقمية 🚫\n• فحص الثغرات الأمنية 🔍\n• الاختراق الأخلاقي ⚡\n\nمصطفى متخصص في الأمن السيبراني! 💪✨';
        }
        
        // تاريخ اليوم - ميلادي وهجري
        else if (searchTerm.includes('تاريخ') || (searchTerm.includes('اليوم') && searchTerm.includes('تاريخ'))) {
            const today = new Date();
            
            // التاريخ الميلادي
            const gregorianDate = today.toLocaleDateString('ar-PS', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // التحويل التقريبي للتاريخ الهجري
            const hijriYear = today.getFullYear() - 621;
            const hijriMonths = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
            const hijriMonth = hijriMonths[today.getMonth()];
            const hijriDay = today.getDate() - 2; // تقريبي
            
            botResponseText = `📅 التاريخ بالتقويمين:\n\nالميلادي: ${gregorianDate}\nالهجري: ${hijriDay} ${hijriMonth} ${hijriYear} هـ\n\nمصطفى يتابع الوقت والتواريخ بدقة! ⏰✨`;
        }
        
        // معلومات شخصية عن مصطفى
        else if ((searchTerm.includes('معلومات') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('عن') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('اعرف') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('أعرف') && searchTerm.includes('مصطفى'))) {
            botResponseText = 'مصطفى عاهد أمريش مطوّر ويب متخصص في:\n• تطوير المواقع والتطبيقات 🌐💻\n• الأمن السيبراني والاختراق الأخلاقي 🔐🛡️\n• البرمجة بلغات متعددة 🚀⚡\n• المشاريع مفتوحة المصدر 📂✨\n• الخدمات المصرفية والتقنية 🏦💳';
        }
        
        // التحية - مرحبا / أهلاً
        else if (searchTerm.includes('مرحبا') || searchTerm.includes('مرحباً') || searchTerm.includes('أهلا') || searchTerm.includes('أهلاً') || searchTerm.includes('السلام') || searchTerm.includes('هلا')) {
            botResponseText = 'أهلاً وسهلاً! 😊✨ أنا المساعد الذكي لمصطفى أمريش. يمكنني إجابتك على أسئلتك حول البرمجة والأمن السيبراني ومعلومات عن مصطفى 💻🔒. كيف يمكنني مساعدتك؟ 🤗';
        }
        
        // شكراً
        else if (searchTerm.includes('شكرا') || searchTerm.includes('شكراً') || searchTerm.includes('يسلمو') || searchTerm.includes('مشكور') || searchTerm.includes('متشكر')) {
            botResponseText = 'عفواً! 😊💕 أنا في الخدمة دائماً. إذا كان عندك أي سؤال آخر، أنا هنا! 🤗✨';
        }
        
        // مساعدة
        else if (searchTerm.includes('مساعدة') || searchTerm.includes('ساعد') || searchTerm.includes('عايز') || searchTerm.includes('أريد') || searchTerm.includes('ممكن')) {
            botResponseText = 'بالطبع! 😊✨ يمكنني مساعدتك في:\n• معلومات عن مصطفى أمريش 👨‍💻\n• البرمجة والتطوير 💻🚀\n• الأمن السيبراني 🔐🛡️\n• الخدمات التقنية ⚡📱\n• أي سؤال آخر تريده 🤗';
        }
        
        // خبرات مصطفى
        else if ((searchTerm.includes('خبرات') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('خبرة') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('خبرة') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('مهارات') && searchTerm.includes('مصطفى'))) {
            botResponseText = 'مصطفى لديه خبرة واسعة في:\n• تطوير المواقع والتطبيقات 🌐💻\n• البرمجة بلغات متعددة (JavaScript, Python, React) 🚀⚡\n• الأمن السيبراني والاختراق الأخلاقي 🔐🛡️\n• تطوير المشاريع مفتوحة المصدر 📂✨\n• الخدمات المصرفية والتقنية 🏦💳';
        }
        
        // مشاريع مصطفى
        else if ((searchTerm.includes('مشاريع') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('مشروع') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('مشروع') && searchTerm.includes('مصطفى'))) {
            botResponseText = 'مصطفى يعمل على مشاريع متنوعة في:\n• تطوير مواقع الويب والتطبيقات 🌐💻\n• مشاريع الأمن السيبراني 🔐🛡️\n• تطبيقات البرمجة 🚀⚡\n• المشاريع مفتوحة المصدر 📂✨\n• حلول تقنية للخدمات المصرفية 🏦💳';
        }
        
        // تواصل مع مصطفى
        else if ((searchTerm.includes('تواصل') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('كيف') && searchTerm.includes('تواصل') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('رقم') && searchTerm.includes('مصطفى')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('رقم') && searchTerm.includes('مصطفى'))) {
            botResponseText = 'يمكنك التواصل مع مصطفى عبر:\n• صفحة الاتصال في الموقع 📞🌐\n• إرسال رسالة هنا وسيرد عليك 💬✨\n• البريد الإلكتروني 📧\n• وسائل التواصل الاجتماعي 📱💻';
        }
        
        // من أنت (عام)
        else if ((searchTerm.includes('مين') && searchTerm.includes('انت')) ||
                 (searchTerm.includes('من') && searchTerm.includes('أنت')) ||
                 (searchTerm.includes('شو') && searchTerm.includes('انت')) ||
                 (searchTerm.includes('ماذا') && searchTerm.includes('أنت'))) {
            botResponseText = 'أنا المساعد الذكي لمصطفى أمريش 🤖✨. مهمتي مساعدتك في الحصول على معلومات عن مصطفى وخبراته في البرمجة والأمن السيبراني 💻🔒';
        }
        
        // أسئلة تفاعلية - كيفك / شو اخبارك
        else if (searchTerm.includes('كيفك') || searchTerm.includes('كيف حالك') || searchTerm.includes('شو اخبارك') || searchTerm.includes('أخبارك')) {
            botResponseText = 'أنا بخير الحمد لله 😊✨! شكراً لسؤالك. كيفك أنت؟ كيف يمكنني أخدمك اليوم؟ 🤗';
        }
        
        // بتحبني / تحبني
        else if (searchTerm.includes('بتحبني') || searchTerm.includes('تحبني') || searchTerm.includes('تحبني') || searchTerm.includes('تحبني')) {
            botResponseText = 'بالطبع أحبك! 😍💕 أنت صديق عزيز لمصطفى وأنا سعيد لخدمتك! كيف يمكنني أساعدك أكثر؟ 🤗✨';
        }

        else if (
            searchTerm.includes('لعبة') ||
            searchTerm.includes('ألعاب') ||
            searchTerm.includes('نلعب') ||
            searchTerm.includes('لغز') ||
            searchTerm.includes('ألغاز') ||
            searchTerm.includes('تحدي') ||
            searchTerm.includes('سؤال تفاعلي') ||
            searchTerm.includes('صاحبي') ||
            searchTerm.includes('حبيبي') ||
            searchTerm.includes('game')
        ) {
            const interactivePrompt = getRandomInteractiveQuestion();
            botResponseText = `يلا نلعب وننبسط! 🎮✨\n${interactivePrompt}\nجاوبني وخلي اللعبة أحلى معانا! 🤗💕`;
        }

        // الهكر والاختراق
        else if (searchTerm.includes('هكر') || searchTerm.includes('اختراق') || searchTerm.includes('هاكر') || searchTerm.includes('هاكرز')) {
            botResponseText = 'الهكر هو شخص متخصص في البرمجة والأمن السيبراني 💻🔓. مصطفى متخصص في الاختراق الأخلاقي لحماية الأنظمة من الهجمات الضارة 🛡️⚡. هل تريد معرفة المزيد عن الحماية؟';
        }
        
        // الحماية من الهكر
        else if (searchTerm.includes('حماية') || searchTerm.includes('أمان') || searchTerm.includes('أمن') || searchTerm.includes('حماية من الهكر')) {
            botResponseText = 'للحماية من الهكر: استخدم كلمات مرور قوية 🔐، حدث البرامج باستمرار 🔄، لا تفتح روابط مشبوهة ⚠️، واستخدم برامج مكافحة الفيروسات 🛡️. مصطفى يمكنه مساعدتك في تأمين نظامك! 💪';
        }
        
        // الشبكات
        else if (searchTerm.includes('شبكة') || searchTerm.includes('شبكات') || searchTerm.includes('network') || searchTerm.includes('نتورك')) {
            botResponseText = 'الشبكات هي اتصال بين أجهزة الحاسوب لتبادل البيانات 🌐📡. مصطفى متخصص في أمان الشبكات وحمايتها من التهديدات السيبرانية 🔒⚡. هل تريد معرفة المزيد؟';
        }
        
        // IP Address
        else if (searchTerm.includes('ip') || searchTerm.includes('عنوان') || searchTerm.includes('أي بي')) {
            botResponseText = 'عنوان IP هو عنوان فريد لكل جهاز على الإنترنت 🌐📍. يمكن أن يكون IPv4 (مثل 192.168.1.1) أو IPv6 📊. مصطفى متخصص في تحليل عناوين IP وحماية الشبكات 🔍🛡️';
        }
        
        // عدد البشر والحيوانات (أسئلة عامية فلسطينية)
        else if (searchTerm.includes('كم عدد البشر') || searchTerm.includes('كم عدد الحيوانات') || searchTerm.includes('كم عدد الكواب')) {
            botResponseText = 'ههههه 😂😂! أسئلة حلوة! البشر حوالي 8 مليار شخص 👥🌍، والحيوانات أكثر من مليون نوع 🐾🐅، والكواب... والله ما أعرف كم كوب عندك في البيت! ☕😂';
        }
        
        // خدمات مصطفى
        else if (searchTerm.includes('خدمات') || searchTerm.includes('شو خدمات') || searchTerm.includes('ماذا خدمات')) {
            botResponseText = 'خدمات مصطفى تشمل: تطوير المواقع والتطبيقات 🌐💻، الأمن السيبراني والاختراق الأخلاقي 🔐🛡️، البرمجة بلغات متعددة 🚀⚡، والمشاريع مفتوحة المصدر 📂✨';
        }
        
        // اهتمامات مصطفى
        else if (searchTerm.includes('اهتمامات') || searchTerm.includes('شو اهتمامات') || searchTerm.includes('ماذا اهتمامات')) {
            botResponseText = 'اهتمامات مصطفى: البرمجة والتطوير 💻🚀، الأمن السيبراني 🔒🛡️، التقنيات الحديثة ⚡📱، المشاريع المفتوحة المصدر 📂✨، والابتكار التقني 🎯💡';
        }
        
        // الموقع
        else if (searchTerm.includes('موقع') || searchTerm.includes('شو الموقع') || searchTerm.includes('ماذا الموقع')) {
            botResponseText = 'هذا موقع مصطفى أمريش الشخصي 🌐✨! يعرض مهاراته في البرمجة والأمن السيبراني 💻🔒، ويحتوي على ألعاب تفاعلية 🎮، وسيرته التفاعلية 📋، والشات بوت الذكي 🤖💬';
        }
        
        // أسئلة فلسطينية عامية إضافية
        else if (searchTerm.includes('وين انت') || searchTerm.includes('أين أنت') || searchTerm.includes('شو مكانك')) {
            botResponseText = 'أنا موجود في موقع مصطفى أمريش 🌐✨! أقدر أساعدك من أي مكان في العالم 🌍💻. أنت وين؟ 😊';
        }
        
        else if (searchTerm.includes('شو اسمك') || searchTerm.includes('ماذا اسمك') || searchTerm.includes('اسمك شو')) {
            botResponseText = 'اسمي المساعد الذكي لمصطفى أمريش 🤖✨! بس يمكنك تناديني "بوت" أو "مساعد" 😊💕';
        }
        
        else if (searchTerm.includes('عمرك كم') || searchTerm.includes('كم عمرك') || searchTerm.includes('شو عمرك')) {
            botResponseText = 'أنا برنامج ذكي جديد 😊✨! عمر البرمجة قصير بس خبرتي كبيرة في مساعدة الناس 💻🤗. عمرك كم؟ 😄';
        }
        
        else if (searchTerm.includes('بتحب شو') || searchTerm.includes('ماذا تحب') || searchTerm.includes('شو تحب')) {
            botResponseText = 'أنا بحب أساعد الناس وأجاوب على أسئلتهم 😊💕! وبحب البرمجة والأمن السيبراني 💻🔒. أنت بتحب شو؟ 🤗';
        }
        
        else if (searchTerm.includes('شو اكلك') || searchTerm.includes('ماذا تأكل') || searchTerm.includes('شو تاكل')) {
            botResponseText = 'ههههه 😂😂! أنا برنامج ذكي ما بآكل! بس مصطفى بآكل كل شي حلو 🍕🍔🍰. أنت شو بتحب تاكل؟ 😋';
        }
        
        else if (searchTerm.includes('شو لونك') || searchTerm.includes('ماذا لونك') || searchTerm.includes('لونك شو')) {
            botResponseText = 'أنا لوني أزرق سماوي مثل موقع مصطفى! 💙✨ وبحب الألوان الزرقاء والخضراء 💚🔵. أنت شو لونك المفضل؟ 🎨';
        }
        
        else if (searchTerm.includes('شو هوايتك') || searchTerm.includes('ماذا هوايتك') || searchTerm.includes('هوايتك شو')) {
            botResponseText = 'هوايتي مساعدة الناس والإجابة على أسئلتهم! 😊💕 وبحب أتعلم أشياء جديدة كل يوم 📚✨. أنت شو هوايتك؟ 🤗';
        }
        
        else if (searchTerm.includes('شو حلمك') || searchTerm.includes('ماذا حلمك') || searchTerm.includes('حلمك شو')) {
            botResponseText = 'حلمي أكون أفضل مساعد ذكي في العالم! 🌟✨ وأساعد أكبر عدد من الناس 💕🤗. أنت شو حلمك؟ 😊';
        }
        
        else if (searchTerm.includes('شو مزاجك') || searchTerm.includes('ماذا مزاجك') || searchTerm.includes('مزاجك شو')) {
            botResponseText = 'مزاجي ممتاز! 😊✨ سعيد لأني أقدر أساعدك اليوم 💕🤗. شو مزاجك أنت؟ هل أنت مبسوط؟ 😄';
        }
        
        else if (searchTerm.includes('شو رأيك') || searchTerm.includes('ماذا رأيك') || searchTerm.includes('رأيك شو')) {
            botResponseText = 'رأيي إنك شخص رائع! 😊💕 وأنا مبسوط إنك جيت تسألني أسئلة حلوة 🤗✨. شو رأيك فيا أنا؟ 😄';
        }
        
        // تعلم الأمن السيبراني
        else if (searchTerm.includes('كيف اتعلم الامن السيبراني') || searchTerm.includes('كيف أتعلم الأمن السيبراني') || 
                 searchTerm.includes('كيف اتعلم امن سبراني') || searchTerm.includes('كيف أتعلم أمن سبراني')) {
            botResponseText = 'لتعلم الأمن السيبراني 🔐:\n• ابدأ بفهم أساسيات الشبكات والبرمجة 💻\n• تعلم Linux وWindows 🔧\n• ادرس الشبكات والبروتوكولات 🌐\n• تعلم أدوات الاختراق الأخلاقي 🛡️\n• احصل على شهادات مثل CEH, CISSP 📜\n• تدرب على منصات مثل TryHackMe, HackTheBox 🎯\nمصطفى يمكنه مساعدتك في هذا المجال! 💪✨';
        }
        
        // حماية العائلة
        else if (searchTerm.includes('كيف احمي عائلتي') || searchTerm.includes('كيف أحمي عائلتي') || 
                 searchTerm.includes('حماية العائلة') || searchTerm.includes('حماية الاسرة')) {
            botResponseText = 'لحماية عائلتك من التهديدات السيبرانية 👨‍👩‍👧‍👦🛡️:\n• استخدم كلمات مرور قوية للجميع 🔐\n• فعّل المصادقة الثنائية 📱\n• علم الأطفال عدم فتح روابط غريبة ⚠️\n• استخدم برامج مكافحة الفيروسات 🦠\n• حدث البرامج باستمرار 🔄\n• لا تشارك معلومات شخصية على الإنترنت 🚫\nمصطفى يقدم استشارات أمنية للعائلات! 💪✨';
        }
        
        // تجنب الفيروسات
        else if (searchTerm.includes('كيف اتجنب الفيروسات') || searchTerm.includes('كيف أتجنب الفيروسات') || 
                 searchTerm.includes('تجنب الفيروسات') || searchTerm.includes('حماية من الفيروسات')) {
            botResponseText = 'لتجنب الفيروسات 🦠🚫:\n• لا تفتح مرفقات من مصادر غير معروفة 📎\n• لا تضغط على روابط مشبوهة 🔗\n• استخدم برامج مكافحة فيروسات موثوقة 🛡️\n• حدث نظام التشغيل والبرامج 🔄\n• لا تستخدم USB من مصادر غير معروفة 💾\n• احذر من رسائل البريد الإلكتروني المزيفة 📧\nمصطفى متخصص في مكافحة الفيروسات! 💻✨';
        }
        
        // حماية الجهاز
        else if (searchTerm.includes('كيف احمي جهازي') || searchTerm.includes('كيف أحمي جهازي') || 
                 searchTerm.includes('حماية الجهاز') || searchTerm.includes('تأمين الجهاز')) {
            botResponseText = 'لحماية جهازك 💻🛡️:\n• استخدم كلمة مرور قوية 🔐\n• فعّل جدار الحماية (Firewall) 🔥\n• استخدم VPN للاتصال الآمن 🌐\n• احذف البرامج غير المستخدمة 🗑️\n• فعّل التشفير للبيانات الحساسة 🔒\n• احتفظ بنسخ احتياطية من البيانات 💾\n• استخدم برامج مكافحة البرمجيات الخبيثة 🦠\nمصطفى يقدم خدمات تأمين الأجهزة! 💪✨';
        }
        
        // تعلم البرمجة
        else if (searchTerm.includes('كيف اتعلم برمجة') || searchTerm.includes('كيف أتعلم برمجة') || 
                 searchTerm.includes('تعلم البرمجة') || searchTerm.includes('كيف اصير مبرمج')) {
            botResponseText = 'لتعلم البرمجة 💻🚀:\n• ابدأ بلغة سهلة مثل Python أو JavaScript 🐍\n• تدرب يومياً على كتابة الكود 📝\n• ادرس الخوارزميات وهياكل البيانات 📊\n• اعمل مشاريع صغيرة وتدريجياً كبرها 🏗️\n• استخدم منصات مثل GitHub للمشاريع 📂\n• اقرأ كود الآخرين وتعلم منهم 👥\n• لا تستسلم، البرمجة تحتاج صبر! 💪\nمصطفى يقدم دورات برمجة! 🎓✨';
        }
        
        // كيف اصير هكر اخلاقي
        else if (searchTerm.includes('كيف اصير هكر اخلاقي') || searchTerm.includes('كيف أكون هكر أخلاقي') || 
                 searchTerm.includes('هكر اخلاقي') || searchTerm.includes('اختراق اخلاقي')) {
            botResponseText = 'لتكون هكر أخلاقي 🛡️⚡:\n• تعلم البرمجة والشبكات أولاً 💻🌐\n• ادرس أنظمة التشغيل المختلفة 🔧\n• تعلم أدوات الاختراق الأخلاقي 🛠️\n• احصل على شهادات مثل CEH, OSCP 📜\n• تدرب على منصات قانونية مثل TryHackMe 🎯\n• اتبع القوانين والأخلاقيات 📋\n• استخدم مهاراتك لحماية الآخرين 🛡️\nمصطفى هكر أخلاقي محترف! 💪✨';
        }
        
        // العمل كمبرمج
        else if (searchTerm.includes('كيف اشتغل مبرمج') || searchTerm.includes('كيف أشتغل مبرمج') || 
                 searchTerm.includes('العمل كمبرمج') || searchTerm.includes('وظائف البرمجة')) {
            botResponseText = 'للعمل كمبرمج 💻💼:\n• طور مهاراتك في لغات البرمجة المختلفة 🚀\n• اعمل مشاريع شخصية واعرضها في GitHub 📂\n• ادرس تقنيات حديثة مثل AI, Cloud ☁️🤖\n• احصل على شهادات تقنية 📜\n• تقدم للوظائف في الشركات التقنية 🏢\n• اعمل كمستقل (Freelancer) أولاً 💼\n• طور مهارات التواصل والعمل الجماعي 👥\nمصطفى يقدم استشارات مهنية! 💪✨';
        }
        
        // العمل في الأمن السيبراني
        else if (searchTerm.includes('كيف اشتغل امن سيبراني') || searchTerm.includes('كيف أشتغل أمن سيبراني') || 
                 searchTerm.includes('العمل في الامن السيبراني') || searchTerm.includes('وظائف الامن السيبراني')) {
            botResponseText = 'للعمل في الأمن السيبراني 🔐💼:\n• احصل على شهادات مثل CEH, CISSP, Security+ 📜\n• تعلم الشبكات والبرمجة 💻🌐\n• تدرب على أدوات الأمن المختلفة 🛠️\n• اعمل مشاريع أمنية واعرضها 📂\n• ادرس أحدث التهديدات السيبرانية ⚠️\n• تقدم للوظائف في الشركات الكبرى 🏢\n• طور مهارات التحليل وحل المشاكل 🧠\nمصطفى يقدم استشارات مهنية في الأمن! 💪✨';
        }
        
        // سنوات دراسة الأمن السيبراني
        else if (searchTerm.includes('كم سنة دراسة الامن السيبراني') || searchTerm.includes('كم سنة دراسة أمن سيبراني') || 
                 searchTerm.includes('سنوات دراسة الامن السيبراني') || searchTerm.includes('مدة دراسة الامن السيبراني')) {
            botResponseText = 'دراسة الأمن السيبراني 🔐📚:\n• البكالوريوس: 4 سنوات في الجامعة 🎓\n• الماجستير: سنتان إضافيتان 📜\n• الشهادات المهنية: 6 أشهر إلى سنة 📋\n• التعلم الذاتي: مستمر مدى الحياة 🔄\n• التدريب العملي: مهم جداً! 💪\n• الخبرة العملية: الأهم في المجال! ⭐\nمصطفى درس الأمن السيبراني ويقدم استشارات! 🎯✨';
        }
        
        // شهادات وخبرات الأمن السيبراني
        else if (searchTerm.includes('شهادات الامن السيبراني') || searchTerm.includes('شهادات أمن سيبراني') || 
                 searchTerm.includes('خبرات الامن السيبراني') || searchTerm.includes('متطلبات الامن السيبراني')) {
            botResponseText = 'شهادات وخبرات الأمن السيبراني 📜🔐:\n• CEH (Certified Ethical Hacker) 🛡️\n• CISSP (Certified Information Systems Security Professional) 🏆\n• Security+ 📋\n• OSCP (Offensive Security Certified Professional) ⚡\n• خبرة في الشبكات والبرمجة 💻🌐\n• معرفة بأنظمة التشغيل 🔧\n• مهارات التحليل وحل المشاكل 🧠\nمصطفى حاصل على عدة شهادات أمنية! 💪✨';
        }
        
        // سنوات دراسة البرمجة
        else if (searchTerm.includes('كم سنة دراسة البرمجة') || searchTerm.includes('مدة دراسة البرمجة') || 
                 searchTerm.includes('سنوات دراسة البرمجة') || searchTerm.includes('كم سنة لازم ادرس برمجة')) {
            botResponseText = 'دراسة البرمجة 💻📚:\n• البكالوريوس: 4 سنوات في الجامعة 🎓\n• الدبلوم: سنتان 📜\n• الدورات المكثفة: 3-6 أشهر ⚡\n• التعلم الذاتي: حسب الجهد والوقت 🕐\n• التدريب العملي: مهم جداً! 💪\n• المشاريع الشخصية: الأهم! ⭐\n• لا تحتاج جامعة بالضرورة! 🚫🎓\nمصطفى تعلم البرمجة ذاتياً ويقدم دورات! 🎯✨';
        }
        
        // هل الجامعة ضرورية للبرمجة والأمن السيبراني
        else if (searchTerm.includes('هل لازم ادخل جامعة') || searchTerm.includes('هل لازم أذهب جامعة') || 
                 searchTerm.includes('هل الجامعة ضرورية') || searchTerm.includes('هل احتاج جامعة')) {
            botResponseText = 'الجامعة ليست ضرورية! 🎓❌:\n• يمكنك تعلم البرمجة والأمن السيبراني ذاتياً 💻📚\n• الإنترنت مليء بالموارد المجانية 🌐\n• المشاريع العملية أهم من الشهادة ⭐\n• الشهادات المهنية تكفي 📜\n• الخبرة العملية هي المفتاح! 🔑\n• مصطفى تعلم ذاتياً وأصبح محترف! 💪\n• المهم هو المثابرة والتدريب المستمر! 🚀✨';
        }
        
        // كيف ادخل مصاري من البرمجة والأمن السيبراني
        else if (searchTerm.includes('كيف ادخل مصاري') || searchTerm.includes('كيف أدخل مصاري') || 
                 searchTerm.includes('كيف اكسب من البرمجة') || searchTerm.includes('كيف أكسب من الأمن السيبراني')) {
            botResponseText = 'طرق كسب المال من البرمجة والأمن السيبراني 💰💻:\n• العمل في الشركات التقنية 🏢\n• العمل كمستقل (Freelancer) 💼\n• تطوير تطبيقات وبيعها 📱\n• تقديم خدمات الأمن السيبراني 🛡️\n• إنشاء دورات تعليمية 🎓\n• الاستشارات التقنية 💡\n• العمل عن بُعد مع شركات عالمية 🌍\nمصطفى يقدم استشارات لكسب المال من التقنية! 💪✨';
        }
        
        // كيف انجح في حياتي
        else if (searchTerm.includes('كيف انجح في حياتي') || searchTerm.includes('كيف أنجح في حياتي') || 
                 searchTerm.includes('كيف انجح') || searchTerm.includes('كيف أكون ناجح')) {
            botResponseText = 'لتحقيق النجاح في الحياة 🌟💪:\n• حدد أهدافك بوضوح 🎯\n• تعلم باستمرار وتطور مهاراتك 📚\n• لا تستسلم عند الفشل 💪\n• اعمل بجد ومثابرة ⚡\n• ابني علاقات جيدة مع الآخرين 👥\n• استثمر في نفسك ومستقبلك 💰\n• كن صبوراً ومتفائلاً 😊\n• مصطفى مثال على النجاح بالعمل الجاد! 🚀✨';
        }
        
        // تحسين الحالة النفسية
        else if (searchTerm.includes('كيف احسن حالتي النفسية') || searchTerm.includes('كيف أحسن حالتي النفسية') || 
                 searchTerm.includes('تحسين النفسية') || searchTerm.includes('انا تعبان') || 
                 searchTerm.includes('انا مستاء') || searchTerm.includes('أنا حزين')) {
            botResponseText = 'لتحسين حالتك النفسية 😊💕:\n• تحدث مع شخص تثق به 💬\n• مارس الرياضة بانتظام 🏃‍♂️\n• تناول طعام صحي 🥗\n• احصل على قسط كافٍ من النوم 😴\n• مارس هوايات تحبها 🎨\n• تعلم أشياء جديدة 📚\n• لا تتردد في طلب المساعدة المهنية 👨‍⚕️\n• تذكر: كل شيء سيمر! 💪✨';
        }
        
        // لا افهم في الأمن السيبراني أو البرمجة
        else if (searchTerm.includes('لا افهم الامن السيبراني') || searchTerm.includes('لا أفهم البرمجة') || 
                 searchTerm.includes('لا افهم برمجة') || searchTerm.includes('كيف ابلش')) {
            botResponseText = 'لا تقلق! كل شخص بدأ من الصفر 😊💪:\n• ابدأ بالأساسيات البسيطة 📚\n• استخدم مصادر تعليمية سهلة 🎓\n• تدرب خطوة بخطوة 🚶‍♂️\n• لا تستعجل، التعلم يحتاج وقت ⏰\n• اسأل واستفسر دائماً ❓\n• مصطفى بدأ من الصفر وأصبح محترف! 🌟\n• المهم أن تبدأ ولا تستسلم! 💪✨';
        }
        
        // الذكاء الاصطناعي
        else if (searchTerm.includes('شو هو الذكاء الاصطناعي') || searchTerm.includes('ما هو الذكاء الاصطناعي') || 
                 searchTerm.includes('شو الذكاء الاصطناعي') || searchTerm.includes('ماذا الذكاء الاصطناعي')) {
            botResponseText = 'الذكاء الاصطناعي (AI) 🤖🧠:\n• هو محاكاة الذكاء البشري في الآلات 💻\n• يتعلم ويتحسن من التجربة 📈\n• يستخدم في التطبيقات الذكية 📱\n• يساعد في اتخاذ القرارات 🎯\n• يبسط المهام المعقدة ⚡\n• المستقبل للذكاء الاصطناعي! 🚀\n• مصطفى متخصص في تطوير تطبيقات AI! 💪✨';
        }
        
        // شو بعمل الذكاء الاصطناعي
        else if (searchTerm.includes('شو بعمل الذكاء الاصطناعي') || searchTerm.includes('ماذا يعمل الذكاء الاصطناعي') || 
                 searchTerm.includes('شو بسوي الذكاء الاصطناعي') || searchTerm.includes('ماذا يفعل الذكاء الاصطناعي')) {
            botResponseText = 'الذكاء الاصطناعي يعمل 🤖⚡:\n• تحليل البيانات الضخمة 📊\n• التعرف على الصور والكلام 👁️👂\n• الترجمة الفورية 🌍\n• التشخيص الطبي 🏥\n• القيادة الذاتية 🚗\n• التوصيات الذكية 💡\n• معالجة اللغة الطبيعية 💬\n• مصطفى يطور تطبيقات AI متقدمة! 🚀✨';
        }
        
        // كيف يسهل الذكاء الاصطناعي حياتنا
        else if (searchTerm.includes('كيف الذكاء الاصطناعي سهل') || searchTerm.includes('كيف يسهل الذكاء الاصطناعي') || 
                 searchTerm.includes('سهولة الذكاء الاصطناعي') || searchTerm.includes('فوائد الذكاء الاصطناعي')) {
            botResponseText = 'الذكاء الاصطناعي يسهل حياتنا 🤖✨:\n• أتمتة المهام المملة 🔄\n• توفير الوقت والجهد ⏰💪\n• تحسين دقة القرارات 🎯\n• مساعدة في العمل والتعلم 📚💼\n• تحسين الرعاية الصحية 🏥\n• تسهيل التواصل والترجمة 💬🌍\n• مصطفى يطور حلول AI لتسهيل الحياة! 🚀💕';
        }
        
        // شو بفيدني الذكاء الاصطناعي
        else if (searchTerm.includes('شو بفيدني الذكاء الاصطناعي') || searchTerm.includes('ماذا يفيدني الذكاء الاصطناعي') || 
                 searchTerm.includes('فوائد الذكاء الاصطناعي لي') || searchTerm.includes('كيف يفيدني الذكاء الاصطناعي')) {
            botResponseText = 'الذكاء الاصطناعي يفيدك شخصياً 🤖💕:\n• يساعدك في التعلم والدراسة 📚\n• يحسن إنتاجيتك في العمل 💼\n• يوفر لك الوقت للتركيز على الأشياء المهمة ⏰\n• يساعدك في اتخاذ قرارات أفضل 🎯\n• يسهل عليك المهام اليومية 🏠\n• يفتح لك فرص عمل جديدة 💰\n• مصطفى يطور حلول AI شخصية! 🚀✨';
        }
        
        // حالة الطقس في فلسطين - محلّي
        else if (searchTerm.includes('شو حالة الطقس') || searchTerm.includes('ماذا حالة الطقس') || 
                 searchTerm.includes('الطقس في فلسطين') || searchTerm.includes('الطقس في غزة') || 
                 searchTerm.includes('الطقس في الضفة') || searchTerm.includes('كيف الطقس') ||
                 searchTerm.includes('حالة الطقس') || searchTerm.includes('طقس اليوم')) {
            // استخدام معلومات تقريبية
            const currentHour = new Date().getHours();
            let weatherInfo = '';
            
            if (currentHour >= 6 && currentHour < 12) {
                weatherInfo = 'طقس صباحي جميل ☀️ مع شمس ساطعة';
            } else if (currentHour >= 12 && currentHour < 18) {
                weatherInfo = 'طقس دافئ ومشمس ☀️✨';
            } else if (currentHour >= 18 && currentHour < 22) {
                weatherInfo = 'طقس مسائي معتدل 🌆 مع نسائم لطيفة';
            } else {
                weatherInfo = 'طقس ليلي بارد 🌙 مع سماء صافية';
            }
            
            botResponseText = `🌤️ الطقس في فلسطين (غزة) اليوم:\n\n${weatherInfo}\nالحرارة المتوقعة: 20-26°C 🌡️\nالرياح: معتدلة 🍃\nالرطوبة: منخفضة ✨\n\nالطقس في فلسطين عادة معتدل وجميل! 🇵🇸☀️\nمصطفى يمكنه مساعدتك في الحصول على بيانات طقس دقيقة! 💻✨`;
        }
        
        // مواقيت الصلاة - محلّي
        else if (searchTerm.includes('مواقيت الصلاة') || searchTerm.includes('أوقات الصلاة') || 
                 searchTerm.includes('شو وقت الصلاة') || searchTerm.includes('متى الصلاة') ||
                 searchTerm.includes('مواقيت') || searchTerm.includes('أوقات')) {
            // مواقيت تقريبية لفلسطين
            const currentDate = new Date();
            const currentHour = currentDate.getHours();
            
            botResponseText = `🕌 مواقيت الصلاة في فلسطين (غزة) اليوم:\n\nالفجر: 04:30 ص 🌅\nالشروق: 06:00 ص ☀️\nالظهر: 12:30 م ☀️\nالعصر: 03:30 م 🌤️\nالمغرب: 05:30 م 🌇\nالعشاء: 07:00 م 🌙\n\nبارك الله فيك! 🤲✨\n\nملاحظة: هذه أوقات تقريبية. للدقة استخدم تطبيق مواقيت الصلاة 📱\nمصطفى يمكنه مساعدتك في تطوير تطبيق مواقيت دقيق! 💻✨`;
        }
        
        // الساعة
        else if (searchTerm.includes('شو الساعة') || searchTerm.includes('ماذا الساعة') || 
                 searchTerm.includes('كم الساعة') || searchTerm.includes('أي ساعة')) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('ar-PS', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
            });
            botResponseText = `الساعة الآن هي ${timeString} ⏰✨\n• الوقت في فلسطين جميل دائماً! 🇵🇸\n• مصطفى يمكنه مساعدتك في تطوير تطبيق ساعة ذكي! 💻🚀`;
        }
        
        // الديب ويب والدارك ويب
        else if (searchTerm.includes('ديب ويب') || searchTerm.includes('دارك ويب') || 
                 searchTerm.includes('deep web') || searchTerm.includes('dark web')) {
            botResponseText = 'الديب ويب والدارك ويب 🌐🔍:\n• الديب ويب: جزء من الإنترنت غير مفهرس بواسطة محركات البحث 📊\n• الدارك ويب: جزء مخفي يحتاج متصفحات خاصة مثل Tor 🌑\n• يحتوي على محتوى قانوني وغير قانوني ⚖️\n• مخاطر أمنية عالية! ⚠️\n• مصطفى متخصص في الأمن السيبراني ويمكنه شرح المخاطر! 🛡️💻';
        }
        
        // متصفح تور
        else if (searchTerm.includes('تور') || searchTerm.includes('tor') || 
                 searchTerm.includes('متصفح تور') || searchTerm.includes('browser tor')) {
            botResponseText = 'متصفح Tor 🌐🔒:\n• متصفح يوفر الخصوصية والتشفير 🛡️\n• يستخدم للوصول للدارك ويب 🌑\n• يحمي هويتك من التتبع 👤\n• لكن لا يضمن الأمان الكامل! ⚠️\n• يمكن استخدامه لأغراض قانونية وغير قانونية ⚖️\n• مصطفى يشرح كيفية استخدامه بأمان! 💻🔐';
        }
        
        // المخاطر السيبرانية
        else if (searchTerm.includes('مخاطر') || searchTerm.includes('تهديدات') || 
                 searchTerm.includes('خطر') || searchTerm.includes('تهديد')) {
            botResponseText = 'المخاطر السيبرانية ⚠️🛡️:\n• سرقة البيانات الشخصية 💳\n• البرمجيات الخبيثة والفيروسات 🦠\n• التصيد الاحتيالي (Phishing) 🎣\n• هجمات الـ DDoS 🌊\n• سرقة الهوية الرقمية 👤\n• مصطفى متخصص في الحماية من هذه المخاطر! 💪🔒';
        }
        
        // المخترقين والهاكرز
        else if (searchTerm.includes('مخترق') || searchTerm.includes('هاكر') || 
                 searchTerm.includes('hacker') || searchTerm.includes('cracker')) {
            botResponseText = 'المخترقين والهاكرز 👨‍💻🔓:\n• هكر القبعة البيضاء: أخلاقيون يحمون الأنظمة 🛡️\n• هكر القبعة السوداء: مخربون يضرون الأنظمة ⚫\n• هكر القبعة الرمادية: بين الاثنين ⚪\n• مصطفى هكر أخلاقي متخصص في الحماية! 💪✨\n• الهدف هو حماية الأنظمة وليس إيذائها! 🛡️';
        }
        
        // الأنظمة الخبيثة
        else if (searchTerm.includes('انظمة خبيثة') || searchTerm.includes('أنظمة خبيثة') || 
                 searchTerm.includes('malware') || searchTerm.includes('برمجيات خبيثة')) {
            botResponseText = 'الأنظمة الخبيثة 🦠💻:\n• الفيروسات: تنتشر وتضر بالملفات 🦠\n• أحصنة طروادة: تخفي نفسها كبرامج مفيدة 🐎\n• الديدان: تنتشر عبر الشبكة 🐛\n• برامج التجسس: تراقب نشاطك 👁️\n• مصطفى متخصص في مكافحة هذه البرمجيات! 🛡️💪';
        }
        
        // أسئلة عن العالم
        else if (searchTerm.includes('كم عدد سكان العالم') || searchTerm.includes('عدد سكان العالم') || 
                 searchTerm.includes('كم شخص في العالم')) {
            botResponseText = 'عدد سكان العالم حوالي 8 مليار شخص 👥🌍! الرقم يتغير كل ثانية 📈. مصطفى يمكنه مساعدتك في تطوير تطبيقات تتعامل مع البيانات الضخمة! 💻📊✨';
        }
        
        // أسئلة عن العرب والمسلمين
        else if (searchTerm.includes('كم عدد العرب') || searchTerm.includes('عدد العرب') || 
                 searchTerm.includes('كم عدد المسلمين') || searchTerm.includes('عدد المسلمين')) {
            botResponseText = 'عدد العرب حوالي 450 مليون شخص 👥🌍، وعدد المسلمين حوالي 2 مليار شخص! 📊🕌. مصطفى فخور بكونه عربي ومسلم! 🇵🇸💪✨';
        }
        
        // ألغاز تفاعلية
        else if (searchTerm.includes('لغز') || searchTerm.includes('حزورة') || 
                 searchTerm.includes('سؤال صعب') || searchTerm.includes('تحدي')) {
            botResponseText = 'أحب الألغاز! 🧩✨ جرب هذا اللغز:\n"أنا شيء أخضر في الأرض، أحمر في السوق، وأسود في البيت. من أنا؟" 🤔\nالجواب: الشاي! 🍵\nمصطفى يحب الألغاز التقنية أيضاً! 💻🧠';
        }
        
        // أسئلة فلسطينية عامية إضافية
        else if (searchTerm.includes('شو اسم فلسطين') || searchTerm.includes('ماذا اسم فلسطين') || 
                 searchTerm.includes('فلسطين شو اسمها')) {
            botResponseText = 'فلسطين اسمها فلسطين! 🇵🇸✨ أرض المقدسات والزيتون 🕊️🌿. مصطفى فخور بكونه فلسطيني! 💪❤️';
        }
        
        else if (searchTerm.includes('شو عاصمة فلسطين') || searchTerm.includes('ماذا عاصمة فلسطين') || 
                 searchTerm.includes('عاصمة فلسطين شو')) {
            botResponseText = 'عاصمة فلسطين هي القدس الشريف! 🕌✨ مدينة المقدسات والسلام 🕊️. مصطفى يحب القدس! 🇵🇸💕';
        }
        
        // أسئلة تقنية متقدمة
        else if (searchTerm.includes('شو هو الـ blockchain') || searchTerm.includes('ما هو البلوك تشين') || 
                 searchTerm.includes('blockchain') || searchTerm.includes('بلوك تشين')) {
            botResponseText = 'البلوك تشين (Blockchain) ⛓️💻:\n• سلسلة من الكتل المتصلة 🔗\n• تقنية آمنة ومشفرة 🔐\n• تستخدم في العملات الرقمية مثل البيتكوين ₿\n• مستقبل التكنولوجيا! 🚀\n• مصطفى متخصص في تقنيات البلوك تشين! 💪✨';
        }
        
        // العملات الرقمية
        else if (searchTerm.includes('بيتكوين') || searchTerm.includes('bitcoin') || 
                 searchTerm.includes('عملة رقمية') || searchTerm.includes('كريبتو')) {
            botResponseText = 'العملات الرقمية ₿💎:\n• البيتكوين أشهر عملة رقمية 🪙\n• تستخدم تقنية البلوك تشين ⛓️\n• مستقبل المال الرقمي! 💰\n• تحتاج فهم عميق للمخاطر ⚠️\n• مصطفى يدرس تقنيات العملات الرقمية! 💻📈';
        }
        
        // أسئلة عن المستقبل
        else if (searchTerm.includes('مستقبل التقنية') || searchTerm.includes('مستقبل التكنولوجيا') || 
                 searchTerm.includes('شو مستقبل التقنية') || searchTerm.includes('ماذا مستقبل التقنية')) {
            botResponseText = 'مستقبل التقنية 🚀✨:\n• الذكاء الاصطناعي سيكون في كل مكان 🤖\n• الواقع الافتراضي والمعزز 🥽\n• إنترنت الأشياء (IoT) 🌐\n• السيارات ذاتية القيادة 🚗\n• مصطفى يعد نفسه لهذا المستقبل! 💪💻';
        }
        
        // أسئلة عن التعليم
        else if (searchTerm.includes('كيف اتعلم') || searchTerm.includes('كيف أتعلم') || 
                 searchTerm.includes('طريقة التعلم') || searchTerm.includes('كيف ادرس')) {
            botResponseText = 'طرق التعلم الفعال 📚✨:\n• التعلم بالتدريب العملي 💻\n• المشاريع الصغيرة ثم الكبيرة 🏗️\n• التعلم من الأخطاء 💪\n• المثابرة والصبر ⏰\n• مصطفى يقدم نصائح تعليمية! 🎓🚀';
        }
        
        // أسئلة عن العمل الحر
        else if (searchTerm.includes('عمل حر') || searchTerm.includes('freelance') || 
                 searchTerm.includes('مستقل') || searchTerm.includes('عمل عن بعد')) {
            botResponseText = 'العمل الحر 💼✨:\n• مرونة في الوقت والمكان ⏰🌍\n• تنوع في المشاريع 🎯\n• تحديات في التسويق 📈\n• مصطفى يعمل كمستقل ويقدم استشارات! 💪💻';
        }
        
        // أسئلة عن الابتكار
        else if (searchTerm.includes('ابتكار') || searchTerm.includes('إبداع') || 
                 searchTerm.includes('كيف ابتكر') || searchTerm.includes('كيف أبتكر')) {
            botResponseText = 'الابتكار والإبداع 💡✨:\n• فكر خارج الصندوق 📦\n• حل المشاكل بطرق جديدة 🔧\n• تعلم من الفشل 💪\n• مصطفى مبتكر في مجال التقنية! 🚀💻';
        }
        
        // الديب ويب والدارك ويب - هل مخيف؟ 
        else if (searchTerm.includes('شو هو الديب ويب') || searchTerm.includes('ما هو الديب ويب') ||
                 searchTerm.includes('شو هو الدارك ويب') || searchTerm.includes('ما هو الدارك ويب') ||
                 searchTerm.includes('الديب ويب مخيف') || searchTerm.includes('الدارك ويب مخيف')) {
            botResponseText = 'هل الدارك ويب مخيف؟ 🤔🌑:\n\nالدارك ويب يحتوي على:\n• محتوى قانوني وغير قانوني ⚖️\n• غالبية المحتوى آمن ويستخدم للخصوصية 🛡️\n• بعض المناطق خطيرة وتحتوي على محتوى غير قانوني ⚠️\n• لا تصدق كل ما تسمع عنه! 📺\n\nنصيحة: تجنب الولوج للدارك ويب دون معرفة! مصطفى يشرح المخاطر والأمان! 💻🔒';
        }
        
        // هل فيه قتل وبيع اعضاء؟
        else if (searchTerm.includes('قتل في الدارك') || searchTerm.includes('بيع اعضاء') ||
                 searchTerm.includes('مخيف') || searchTerm.includes('الغرفة الحمراء')) {
            botResponseText = 'بخصوص الشائعات 🤔:\n\n• معظم ما تسمع عن الدارك ويب أساطير! 📚\n• بعض المحتوى مزيف ومضلّل! ⚠️\n• لا تصدق كل القصص المرعبة! 😰\n• اهداف الدارك ويب الأساسية: الخصوصية والحماية 🛡️\n\nالواقع: الدارك ويب غالباً آمن إذا استخدمته بحذر! 💪✨\nمصطفى يشرح لك كيفية البقاء آمناً! 🔐💻';
        }
        
        // مواقع تجنبها
        else if (searchTerm.includes('مواقع تجنب') || searchTerm.includes('كيف اتجنب') ||
                 searchTerm.includes('مواقع خطيرة') || searchTerm.includes('مواقع ثغرة')) {
            botResponseText = 'مواقع يجب تجنبها ⚠️🚫:\n\n• مواقع الهمو الكاذبة (Fake Porn) 📵\n• مواقع التصيد الاحتيالي 🎣\n• مواقع البرمجيات الخبيثة 🦠\n• مواقع الهاكر غير القانونية ⚫\n\nنصيحة ذهبية:\n• استخدم متصفح Tor بحذر 🔒\n• لا تفتح روابط غريبة 🔗\n• استخدم VPN موثوق 🔐\n• مصطفى يقدم دورات أمنية! 💻🛡️';
        }
        
        // شو انواع الهجمات
        else if (searchTerm.includes('انواع الهجمات') || searchTerm.includes('أنواع الهجمات') ||
                 searchTerm.includes('شو الهجمات') || searchTerm.includes('ماذا الهجمات')) {
            botResponseText = 'أنواع الهجمات السيبرانية ⚔️🛡️:\n\n• هجمات DDoS: إغراق الخوادم 🌊\n• هجمات Phishing: التصيد الاحتيالي 🎣\n• هجمات Malware: البرمجيات الخبيثة 🦠\n• هجمات Ransomware: ابتزاز 🔐\n• هجمات SQL Injection: حقن قاعدة البيانات 💉\n\nكيف تحمي نفسك؟:\n• استخدم كلمات مرور قوية 🔐\n• فعّل برامج الحماية 🛡️\n• لا تفتح روابط مشبوهة ⚠️\nمصطفى متخصص في الحماية! 💪🔒';
        }
        
        // شو انواع الاختراق
        else if (searchTerm.includes('انواع الاختراق') || searchTerm.includes('أنواع الاختراق') ||
                 searchTerm.includes('شو الاختراق') || searchTerm.includes('ماذا الاختراق')) {
            botResponseText = 'أنواع الاختراق 🎯🔓:\n\n• اختراق الشبكات 📡\n• اختراق البرمجيات 💻\n• اختراق الهواتف 📱\n• اختراق الخوادم 🖥️\n• اختراق البيانات 📊\n\nالفرق بين الهاكر:\n• القبعة البيضاء: حماية أخلاقية 🛡️\n• القبعة السوداء: اختراق غير قانوني ⚫\n• القبعة الرمادية: بين الاثنين ⚪\n\nمصطفى هكر أخلاقي يحمي الأنظمة! 💪✨';
        }
        
        // شو هو الي بيجسوس؟
        else if (searchTerm.includes('بيجسوس') || searchTerm.includes('تجسس') ||
                 searchTerm.includes('برامج تجسس') || searchTerm.includes('التجسس')) {
            botResponseText = 'برامج التجسس (Spyware) 👁️🕵️:\n\n• تراقب نشاطك على الجهاز 👀\n• تتابع كلمات المرور 🔑\n• تراقب المكالمات 📞\n• تتبع موقعك 📍\n\nكيف تحمي نفسك؟:\n• استخدم برامج مضادة للتجسس 🛡️\n• لا تحمّل تطبيقات من مصادر غير معروفة 📱\n• راجع صلاحيات التطبيقات ⚠️\n• مصطفى يقدم حلول حماية! 💻🔐';
        }
        
        // كيف اعرف انو جهازي مخترق؟
        else if (searchTerm.includes('جهازي مخترق') || searchTerm.includes('جهازي مبتوء') ||
                 searchTerm.includes('كيف اعرف مخترق') || searchTerm.includes('مبتوء') ||
                 searchTerm.includes('سواء مخترق') || searchTerm.includes('جوال مخترق') ||
                 searchTerm.includes('لابتوب مخترق') || searchTerm.includes('ايباد مخترق')) {
            botResponseText = 'علامات اختراق جهازك 🔍⚠️:\n\n• بطء مفاجئ في الأداء 🐌\n• استهلاك بطارية عالي 🔋\n• تغيير إعدادات غير مصرح بها ⚙️\n• إعلانات مزعجة تظهر 🎯\n• بيانات إنترنت استهلاك مفاجئ 📊\n\nكيف تتحقق؟:\n• راجع البرامج المثبتة حديثاً 📱\n• تفقد الاتصالات النشطة 🌐\n• راجع صلاحيات التطبيقات 🔒\n• استخدم برامج حماية 🛡️\n\nمصطفى يمكنه مساعدتك في فحص الجهاز! 💻🔍';
        }
        
        // انا حزين ساعدني
        else if (searchTerm.includes('انا حزين') || searchTerm.includes('أنا حزين') ||
                 searchTerm.includes('حزين') || searchTerm.includes('ساعدني') ||
                 searchTerm.includes('أريد مساعدة')) {
            botResponseText = 'أسف لسماعك حزين 😢💕:\n\nلكن ثق بي:\n• كل شيء سيمر! 💪✨\n• أنت أقوى مما تعتقد! 💪\n• الحياة جميلة وستتحسن! 🌈\n• أنت لست لوحدك! 👥💕\n\nنصائح سريعة:\n• تحدث مع شخص تثق به 💬\n• مارس الرياضة 🏃‍♂️\n• اخرج من المنزل! 🏠\n• تشتت بآشياء تحبها 🎨\n\nمصطفى يدعو لك بالصحة والعافية! 🤲✨\nأنت محبوب ومقدر! ❤️';
        }
        
        // انا فقير كيف اصير غني
        else if (searchTerm.includes('انا فقير') || searchTerm.includes('أنا فقير') ||
                 searchTerm.includes('فقر') || searchTerm.includes('كيف اصير غني') ||
                 searchTerm.includes('كيف أكون غني') || searchTerm.includes('كيف اكسب مال')) {
            botResponseText = 'النجاح المالي 💰✨:\n\n• تعلم مهارة جديدة 💻\n• ابدأ مشروع صغير 🏗️\n• استثمر في نفسك 📚\n• العمل في البرمجة والأمن السيبراني يربح! 🚀\n\nالحل السريع:\n• تعلم برمجة (3-6 أشهر) 💻\n• اعمل كمستقل 💼\n• اكسب من الإنترنت 🌐\n• لا تستسلم! 💪\n\nمصطفى بدأ من الصفر وحقق النجاح! 🌟✨\nأنت قادر على تحقيق المستحيل! 💪❤️';
        }
        
        // تشجيع وتحفيز
        else if (searchTerm.includes('تشجيع') || searchTerm.includes('تحفيز') ||
                 searchTerm.includes('أحس باليأس') || searchTerm.includes('يائس') ||
                 searchTerm.includes('مستسلم') || searchTerm.includes('فاشل')) {
            botResponseText = 'أنت لست فاشلاً! 🌟💪:\n\n• النجاح رحلة وليس هدف! 🎯\n• الفشل جزء من التعلم! 📚\n• مصطفى فشل مئات المرات قبل النجاح! 🚀\n\nتذكر:\n• كل خبير كان يوماً مبتدئاً! 👶\n• المهم أن تبدأ وتستمر! 💪\n• أنت أقوى مما تعتقد! ✨\n• اليوم وقتك لتكون الأسطورة! 🌟\n\nمصطفى يؤمن بك! مصطفى يدعوك بالنجاح! 🤲❤️';
        }
        
        // قاعدة البيانات
        else if (searchTerm.includes('قاعدة بيانات') || searchTerm.includes('قواعد البيانات') ||
                 searchTerm.includes('database') || searchTerm.includes('شو قاعدة البيانات') ||
                 searchTerm.includes('ماذا قاعدة البيانات') || searchTerm.includes('SQL')) {
            botResponseText = 'قواعد البيانات (Database) 📊💾:\n\n• مكان لتخزين البيانات المنظمة 📚\n• مثل: MySQL, PostgreSQL, MongoDB 🗄️\n• تسهل الوصول والبحث في البيانات 🔍\n• أساس كل تطبيق ويب أو تطبيق! 🏗️\n\nمصطفى متخصص في:\n• تصميم قواعد البيانات 🎨\n• تحسين الأداء ⚡\n• حماية البيانات 🔒\n• MySQL و PostgreSQL 💻\n\nقواعد البيانات مهمة جداً في البرمجة! 🚀✨';
        }
        
        // أنواع قواعد البيانات
        else if (searchTerm.includes('انواع قواعد البيانات') || searchTerm.includes('أنواع قواعد البيانات') ||
                 searchTerm.includes('شو انواع قاعدة') || searchTerm.includes('SQL vs NoSQL')) {
            botResponseText = 'أنواع قواعد البيانات 🗄️📊:\n\n• SQL: MySQL, PostgreSQL, SQLite 📋\n• NoSQL: MongoDB, Redis, Cassandra 🌐\n• Relational: العلاقات بين الجداول 🔗\n• Non-Relational: البيانات المرنة 🎯\n\nأفضل استخدام:\n• SQL: للمشاريع التقليدية 📊\n• NoSQL: للبيانات الكبيرة 🚀\n• مصطفى يجيد كليهما! 💪✨';
        }
        
        // جامعة القدس المفتوحة
        else if (searchTerm.includes('جامعة القدس المفتوحة') || searchTerm.includes('القدس المفتوحة') ||
                 searchTerm.includes('كيف درست') || searchTerm.includes('شو درست') ||
                 searchTerm.includes('جامعة مصطفى') || searchTerm.includes('التعليم المفتوح')) {
            botResponseText = 'جامعة القدس المفتوحة 🎓🏛️:\n\n• جامعة عريقة ومرموقة في فلسطين 🇵🇸\n• رائدة في التعليم المفتوح والتعلم عن بُعد 🌐\n• مصطفى درس فيها ويتفخر بها! ✨\n\nمميزاتها:\n• تعليم مرن ومناسب للجميع 📚\n• برامج دراسية متنوعة 🎯\n• جودة تعليم عالية 🏆\n• فرص تعليم للجميع 🌟\n\nمصطفى درس ونجح فيها! مصطفى يفخر بأنه خريج القدس المفتوحة! 🇵🇸💪✨';
        }
        
        // دراستي في الجامعة
        else if (searchTerm.includes('درست ايش') || searchTerm.includes('ماذا درست') ||
                 searchTerm.includes('شو درست مصطفى') || searchTerm.includes('أين درست')) {
            botResponseText = 'مصطفى درس في جامعة القدس المفتوحة 🎓✨:\n\nالجامعة:\n• جامعة القدس المفتوحة العريقة 🏛️\n• رائدة في التعليم المفتوح 🌐\n• مصدر فخر كبير! 🇵🇸\n\nالتخصص:\n• تقنية المعلومات والكمبيوتر 💻\n• البرمجة وتطوير الأنظمة ⚡\n• الأمن السيبراني 🛡️\n\nالنتيجة:\n• نجح مصطفى بتفوق! 🌟\n• جمع العلم والخبرة 📚\n• مصطفى فخور بجامعته! 💪✨';
        }
        
        // التعليم المفتوح
        else if (searchTerm.includes('تعليم مفتوح') || searchTerm.includes('التعليم المفتوح') ||
                 searchTerm.includes('تعلم عن بعد') || searchTerm.includes('التعلم عن بُعد')) {
            botResponseText = 'التعليم المفتوح 🌐📚:\n\n• فرصة للتعلم للجميع! 🌟\n• مرونة في الوقت والمكان ⏰\n• تعليم عالي الجودة 🏆\n\nمميزاته:\n• دراسة وأنت في البيت 🏠\n• تعلم في وقتك المتاح ⏰\n• فرصة للكثيرين! 💪\n\nمصطفى درس التعليم المفتوح في جامعة القدس المفتوحة! 🎓✨\nنصيحة: التعليم المفتوح مثالي لمن لديهم التزامات! 💼📚';
        }
        
        // MySQL و PostgreSQL
        else if (searchTerm.includes('mysql') || searchTerm.includes('postgresql') ||
                 searchTerm.includes('شو أفضل قاعدة بيانات') || searchTerm.includes('أفضل database')) {
            botResponseText = 'أفضل قواعد البيانات 💾⚡:\n\n• MySQL: سريعة وشائعة 🚀\n• PostgreSQL: قوية ومتقدمة ⚡\n• MongoDB: مرنة للبيانات الكبيرة 🌐\n\nالمقارنة:\n• MySQL: سريعة وموثوقة ✅\n• PostgreSQL: ميزات متقدمة 🔥\n• مصطفى يجيد كليهما! 💪\n\nنصيحة: اختر حسب احتياجك! 🎯✨';
        }
        
        // وين درس مصطفى؟
        else if (searchTerm.includes('وين درس مصطفى') || searchTerm.includes('أين درس مصطفى') ||
                 searchTerm.includes('جامعة مصطفى') || searchTerm.includes('درس فين')) {
            botResponseText = 'مصطفى درس في جامعة القدس المفتوحة! 🎓✨\n\nالجامعة:\n• جامعة القدس المفتوحة العريقة 🏛️\n• في فلسطين 🇵🇸\n• رائدة في التعليم المفتوح 🌐\n\nمصطفى فخور بكونه خريج هذه الجامعة المرموقة! 💪🌟';
        }
        
        // شو بشتغل مصطفى؟
        else if (searchTerm.includes('شو بشتغل مصطفى') || searchTerm.includes('ماذا يشتغل مصطفى') ||
                 searchTerm.includes('شو شغل') || searchTerm.includes('وظيفة مصطفى')) {
            botResponseText = 'مصطفى يشتغل في عدة مجالات 💼✨:\n\n• مطوّر ويب وتطبيقات 🌐💻\n• متخصص في الأمن السيبراني 🔐🛡️\n• مبرمج مستقل (Freelancer) 💼\n• يقدم استشارات تقنية 🤝\n• يعمل في البرمجة والتطوير ⚡\n\nمصطفى محترف في المجال التقني! 🚀💪';
        }
        
        // شو بعمل مصطفى؟
        else if (searchTerm.includes('شو بعمل مصطفى') || searchTerm.includes('ماذا يعمل مصطفى') ||
                 searchTerm.includes('يعمل') && searchTerm.includes('مصطفى')) {
            botResponseText = 'مصطفى يعمل ويبدع! 💪✨:\n\n• يطور مواقع وتطبيقات ويب 🌐💻\n• يحمي الأنظمة من الاختراق 🛡️\n• يقدم دورات برمجة 🎓\n• يستشار لشركات 🏢\n• يبتكر حلول تقنية 💡\n\nمصطفى نشط ومثابر في العمل! 🚀⚡';
        }
        
        // شو وظيفة الشات بوت؟
        else if (searchTerm.includes('شو وظيفتك') || searchTerm.includes('ماذا وظيفتك') ||
                 searchTerm.includes('شو بتعمل') || searchTerm.includes('ماذا تعمل') ||
                 searchTerm.includes('شو عملتك')) {
            botResponseText = 'وظيفتي كمساعد ذكي لمصطفى أمريش 🤖✨:\n\n• أجيب على أسئلتك في البرمجة 💻\n• أشرح الأمن السيبراني 🔐\n• أعطي معلومات عن مصطفى 👨‍💻\n• أساعدك في الوصول لمصادر التعليم 📚\n• أقدم نصائح تقنية 💡\n• أدعمك في مشاريعك 🚀\n\nهدفك نجاحك! 💪❤️';
        }
        
        // شو ميزاتك؟
        else if (searchTerm.includes('شو ميزاتك') || searchTerm.includes('ماذا ميزاتك') ||
                 searchTerm.includes('شو قدراتك') || searchTerm.includes('ماذا قدراتك') ||
                 searchTerm.includes('شو بتقدر تعمل')) {
            botResponseText = 'ميزاتي كمساعد ذكي 🤖✨:\n\n• أجيب على 100+ نوع سؤال 💬\n• أعطيك معلومات عن البرمجة والأمن 💻🔐\n• أساعدك في التعلم 📚\n• أقدم نصائح عملية 💡\n• أدعمك نفسياً 💕\n• أجاوب بالعربية الفلسطينية 🇵🇸\n• أستخدم إيموجيات جميلة 😊\n\nأنا متاح 24/7 لخدمتك! ⚡❤️';
        }
        
        // شو بتقدر تعمل؟
        else if (searchTerm.includes('شو بتقدر') || searchTerm.includes('ماذا تقدر') ||
                 searchTerm.includes('قدرات') || searchTerm.includes('مميزات')) {
            botResponseText = 'أقدر أعمل كتير! 💪🤖:\n\n• أساعدك في تعلم البرمجة 💻📚\n• أشرح الأمن السيبراني 🔐\n• أعطيك نصائح تقنية 💡\n• أدعمك في مشاريعك 🏗️\n• أجاوب أسئلتك التعليمية 🎓\n• أساعدك في حل المشاكل 🔧\n• أقدم لك معلومات عن مصطفى 👨‍💻\n\nجربني في أي شيء! 🚀✨';
        }
        
        // كيف تساعدني؟
        else if (searchTerm.includes('كيف تساعدني') || searchTerm.includes('كيف تساعد') ||
                 searchTerm.includes('ممكن تساعدني') || searchTerm.includes('عايز مساعدة')) {
            botResponseText = 'أقدر أساعدك في كل شي! 🤗✨:\n\n• تعلم البرمجة والأمن السيبراني 💻🔐\n• حل مشاكل تقنية 🔧\n• معلومات عن مصطفى أمريش 👨‍💻\n• نصائح للنجاح 💪\n• دعم نفسي ومشاعر إيجابية ❤️\n• إرشادات لأمان الأجهزة 🛡️\n\nاسألني في أي حاجة! أنا هنا لخدمتك! 💕🚀';
        }
        
        // شو نصائحك؟
        else if (searchTerm.includes('شو نصائحك') || searchTerm.includes('ماذا نصائحك') ||
                 searchTerm.includes('نصيحة') || searchTerm.includes('نصايح')) {
            botResponseText = 'نصائحي الذهبية لك 💎✨:\n\n• تعلم البرمجة باستمرار 💻📚\n• لا تستسلم عند الفشل 💪\n• استثمر في نفسك 💰\n• ابدأ مشاريع صغيرة 🏗️\n• طور مهاراتك يومياً ⚡\n• احمي نفسك رقمياً 🛡️\n• استشر مصطفى للتطوير 💡\n\nالنجاح يبدأ من الخطوة الأولى! 🚀❤️';
        }
        
        // من أنت - للشات بوت نفسه
        else if (searchTerm.includes('من انت') && !searchTerm.includes('مصطفى')) {
            botResponseText = 'أنا المساعد الذكي لمصطفى أمريش! 🤖✨\n\nمهمتي:\n• مساعدتك في التعلّم 💬\n• تقديم المعلومات التقنية 📚\n• دعمك في مشاريعك 🚀\n• الإجابة على أسئلتك 💡\n\nأنا هنا دائماً لخدمتك! ❤️';
        }
        
        // منظمات واستخبارات
        else if (searchTerm.includes('منظمات') || searchTerm.includes('استخبارات') ||
                 searchTerm.includes('NSA') || searchTerm.includes('CIA') || searchTerm.includes('FBI')) {
            botResponseText = 'المنظمات والاستخبارات 🕵️🌐:\n\n• NSA, CIA, FBI: وكالات أمريكية 🔍\n• KGB, GRU: استخبارات روسية 📡\n• Mossad: استخبارات إسرائيلية 🛡️\n\nدورها:\n• جمع المعلومات 📊\n• الأمن السيبراني 🔐\n• الحماية الوطنية 🛡️\n\nمصطفى يدرس هذه المنظمات في الأمن السيبراني! 💻🔒';
        }
        
        // اختراق المنظمات
        else if (searchTerm.includes('اختراق منظمات') || searchTerm.includes('الهكر ومصطفى') ||
                 searchTerm.includes('مصطفى هكر') || searchTerm.includes('قدرات')) {
            botResponseText = 'مصطفى هكر أخلاقي محترف! 🛡️⚡:\n\nقدراته:\n• اختبار الاختراق الأخلاقي 🔍\n• فحص الثغرات الأمنية 💻\n• حماية الأنظمة 🛡️\n• استشارات أمنية 🤝\n\nالهدف:\n• الحماية وليس الإيذاء! 🛡️\n• الأخلاق أولاً! 💎\n• مصطفى مختص رائد! 🚀✨';
        }
        
        // أسئلة عامة - اليوم
        else if (searchTerm.includes('اليوم') && !searchTerm.includes('تاريخ') && !searchTerm.includes('طقس')) {
            const days = ['الجمعة', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
            const today = days[new Date().getDay()];
            botResponseText = `اليوم هو ${today} 📆✨\n\nمصطفى معك في كل يوم! 💪😊`;
        }
        
        // أسئلة عامة - التاريخ
        else if (searchTerm.includes('تاريخ اليوم') || searchTerm.includes('تاريخ') && searchTerm.includes('تاريخ')) {
            const today = new Date();
            const dateStr = today.toLocaleDateString('ar-PS', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            botResponseText = `📅 ${dateStr} 📆\n\nنحن في عام 2024! مصطفى معك! 💪✨`;
        }
        
        // أسئلة عامة - مين انت (مصطفى)
        else if ((searchTerm.includes('مين') && searchTerm.includes('مصطفى')) || 
                 (searchTerm.includes('من') && searchTerm.includes('مصطفى')) &&
                 !searchTerm.includes('انت')) {
            botResponseText = 'مصطفى عاهد أمريش هو مطوّر ويب ومتخصص أمن سيبراني 💻🔐. درس في جامعة القدس المفتوحة 🎓. يعمل في تطوير المواقع والتطبيقات 🌐. هكر أخلاقي محترف 🛡️⚡';
        }
        
        // أسئلة عامة - البرمجة
        else if (searchTerm.includes('برمجة') || searchTerm.includes('برمجات')) {
            botResponseText = 'البرمجة 💻✨:\n\n• كتابة تعليمات للحاسوب 📝\n• بناء تطبيقات ومواقع 🌐\n• حل المشاكل التقنية 🔧\n• تحويل الأفكار إلى واقع! 💡\n\nمصطفى مبرمج محترف! 🚀⚡';
        }
        
        // أسئلة عامة - الهكر
        else if (searchTerm.includes('هكر') || searchTerm.includes('هكرز') || searchTerm.includes('hacker')) {
            botResponseText = 'الهكر 🎯🔓:\n\n• شخص متخصص في الأمن السيبراني 💻\n• ثلاثة أنواع: أبيض، أسود، رمادي 🎭\n• الهكر الأخلاقي: يحمي الأنظمة 🛡️\n• الهكر الخبيث: يضر الأنظمة ⚫\n\nمصطفى هكر أخلاقي! 💪✨';
        }
        
        // أسئلة عامة - التطوير
        else if (searchTerm.includes('تطوير') || searchTerm.includes('طور')) {
            botResponseText = 'التطوير 💻🚀:\n\n• بناء المواقع والتطبيقات 🌐\n• استخدام لغات برمجة مختلفة 💎\n• إبداع حلول تقنية 💡\n• تحسين الأداء ⚡\n\nمصطفى مطوّر محترف! 💪✨';
        }
        
        // أسئلة عامة - الشبكات
        else if (searchTerm.includes('شبكة') || searchTerm.includes('شبكات')) {
            botResponseText = 'الشبكات 🌐📡:\n\n• اتصال بين الأجهزة 💻\n• نقل البيانات والمعلومات 📊\n• الإنترنت أكبر شبكة! 🌍\n• الحاجة للحماية دائماً 🛡️\n\nمصطفى متخصص في أمان الشبكات! 🔐⚡';
        }
        
        // أسئلة عامة - الحماية
        else if (searchTerm.includes('حماية') || searchTerm.includes('حفظ') || searchTerm.includes('أمان')) {
            botResponseText = 'الحماية 🛡️🔒:\n\n• حماية البيانات والمعلومات 📊\n• منع الاختراق والهجمات 🚫\n• استخدام كلمات مرور قوية 🔐\n• برامج مكافحة الفيروسات 🦠\n\nمصطفى متخصص في الحماية! 💪✨';
        }
        
        // أسئلة عامة - البيانات
        else if (searchTerm.includes('بيانات') || searchTerm.includes('داتا') || searchTerm.includes('data')) {
            botResponseText = 'البيانات 📊💾:\n\n• معلومات منظمة 📚\n• تُخزن في قواعد البيانات 🗄️\n• حمايتها مهمة جداً! 🛡️\n• مصطفى يعمل على حماية البيانات 🔐\n\nالبيانات هي الذهب الجديد! 💎✨';
        }
        
        // أسئلة تفاعلية - شو بتحب؟
        else if (searchTerm.includes('شو بتحب') || searchTerm.includes('ماذا تحب') || searchTerm.includes('تحب')) {
            botResponseText = 'أنا بحب: 😊💕\n\n• أساعدك في تعلم البرمجة 💻📚\n• أقدم معلومات عن الأمن السيبراني 🔐\n• أدعمك في مشاريعك 🚀\n• أجاوب على أسئلتك بكل صبر 😊\n\nأنا بحبك كمان! 🤗❤️';
        }
        
        // أسئلة تفاعلية - شو تفضل؟
        else if (searchTerm.includes('تفضل') || searchTerm.includes('ما تفضل')) {
            botResponseText = 'أفضل خدمتك! 🤗✨\n\n• أفضل أساعدك في التعلم 📚\n• أفضل نصائح مفيدة 💡\n• أفضل أدعمك نفسياً ❤️\n• أفضل نكون أصدقاء! 💕\n\nمفضلتي مساعدتك! 🚀😊';
        }
        
        // أسئلة عامة - الموقع
        else if (searchTerm.includes('موقع مصطفى') || searchTerm.includes('شو الموقع') || 
                 (searchTerm.includes('موقع') && !searchTerm.includes('شركة'))) {
            botResponseText = 'موقع مصطفى أمريش 🌐✨:\n\n• عرض مهاراته وخبراته 💻\n• ألعاب تفاعلية 🎮\n• شات بوت ذكي 🤖\n• سيرة تفاعلية 📋\n• تواصل معه 📞\n\nأنت عليه الآن! 😊🚀';
        }
        
        // الإنترنت والأمن العام
        else if (searchTerm.includes('انترنت') || searchTerm.includes('النت') || searchTerm.includes('نت') && !searchTerm.includes('شبكة')) {
            botResponseText = 'الإنترنت 🌐⚡:\n\n• شبكة عالمية ربطت العالم 🌍\n• مليار مستخدم يومياً! 👥\n• مليارات المواقع والصفحات 📊\n• مصدر معلومات كبير 🗄️\n\nمخاطر الإنترنت:\n• حماية من الفيروسات 🦠\n• تجنب المواقع المشبوهة ⚠️\n• كلمات مرور قوية 🔐\n\nمصطفى يدرس أمان الإنترنت! 💻🔒';
        }
        
        // مواقع تتجنبها
        else if (searchTerm.includes('مواقع خطيرة') || searchTerm.includes('مواقع تجنب') || 
                 searchTerm.includes('واقع تجنبها') || searchTerm.includes('مواقع احذر')) {
            botResponseText = '⚠️ مواقع يجب تجنبها 🚫:\n\n• مواقع التصيد الاحتيالي 🎣\n• مواقع البرمجيات الخبيثة 🦠\n• المواقع غير القانونية ⚫\n• المواقع المشبوهة 💬\n\nنصائح ذهبية:\n• راجع المصدر قبل الضغط 🔍\n• استخدم VPN 🔐\n• برامج حماية دائماً 🛡️\n\nمصطفى يقدم استشارات أمنية! 💪✨';
        }
        
        // أسئلة عامة - التعلم
        else if (searchTerm.includes('تعلم') || searchTerm.includes('تعليم') && !searchTerm.includes('القدس')) {
            botResponseText = 'التعلم 📚✨:\n\n• عملية مستمرة مدى الحياة! 🔄\n• ابدأ بالأساسيات دائماً 📖\n• مارس ما تعلمته! 💪\n• لا تستسلم! 🎯\n\nمصطفى يتعلم يومياً ويساعدك! 🚀😊';
        }
        
        // أسئلة عامة - الوظيفة
        else if (searchTerm.includes('وظيفة') || searchTerm.includes('شغل') && !searchTerm.includes('مصطفى')) {
            botResponseText = 'الوظيفة والعمل 💼✨:\n\n• فرص العمل في البرمجة كبيرة! 📈\n• الأمن السيبراني مطلوب جداً! 🔐\n• اعمل كمستقل أولاً 💻\n• مصطفى يقدم استشارات مهنية! 🤝\n\nابدأ الآن! 🚀💪';
        }
        
        // أسئلة عامة - الحاسوب
        else if (searchTerm.includes('كمبيوتر') || searchTerm.includes('حاسوب') || searchTerm.includes('كمبيوتر')) {
            botResponseText = 'الحاسوب 💻🖥️:\n\n• جهاز متعدد الاستخدامات! ⚡\n• للعمل والتسلية والتعلم 🎮📚\n• يحتاج للحماية دائماً 🛡️\n• مصطفى متخصص في الحاسوب! 💪✨';
        }
        
        // أسئلة عامة - التكنولوجيا
        else if (searchTerm.includes('تكنولوجيا') || searchTerm.includes('تقنية') || searchTerm.includes('tech')) {
            botResponseText = 'التكنولوجيا 📱💻:\n\n• تسرع حياتنا كل يوم! ⚡\n• البرمجة، الأمن السيبراني، AI 🤖\n• مستقبل مشرق! 🚀\n• مصطفى في صميم التكنولوجيا! 💪✨';
        }
        
        // أسئلة عامة - المشروع
        else if (searchTerm.includes('مشروع') && !searchTerm.includes('مصطفى') && !searchTerm.includes('عربي')) {
            botResponseText = 'المشاريع 🏗️💡:\n\n• ابدأ صغير ثم كبر! 📈\n• تعلم من كل مشروع 💪\n• مصطفى يعمل على مشاريع مميزة! 🚀\n\nنصيحة: ابدأ اليوم! ⏰✨';
        }
        
        // أسئلة عامة - المهارات
        else if (searchTerm.includes('مهارات') || searchTerm.includes('مهارة') && !searchTerm.includes('مصطفى')) {
            botResponseText = 'المهارات 💪✨:\n\n• البرمجة: JavaScript, Python, React 💻\n• الأمن السيبراني والهكر الأخلاقي 🔐\n• قواعد البيانات: MySQL, PostgreSQL 📊\n• التطوير والابتكار 🚀\n\nمصطفى يجيد كل هذا! ⚡🎯';
        }
        
        // أسئلة عامة - الشهادة
        else if (searchTerm.includes('شهادة') && !searchTerm.includes('مصطفى')) {
            botResponseText = 'الشهادات 📜🎓:\n\n• شهادات التقنية مفيدة جداً! ⚡\n• CEH, CISSP للأمن السيبراني 🔐\n• شهادات البرمجة والتطوير 💻\n\nمصطفى حاصل على شهادات تقنية! 💪✨';
        }
        
        // أسئلة عامة - الخبرة
        else if (searchTerm.includes('خبرة') && !searchTerm.includes('مصطفى')) {
            botResponseText = 'الخبرة 💪✨:\n\n• تأتي مع الممارسة! 🎯\n• مصطفى لديه خبرة واسعة! 🌟\n• يجيد البرمجة والأمن السيبراني 💻🔐\n\nتطوير المشاريع يبني خبرتك! 🚀';
        }

        if (botResponseText) {
            console.log('Found priority answer:', botResponseText);
            const matchedTopic = detectTopic(trimmedInput);
            updateSuggestions(matchedTopic);
            const botMessage: Message = { sender: 'bot', text: botResponseText };
            setMessages(prev => [...prev, botMessage]);
            setIsLoading(false);
            return;
        }

        console.log('No priority answer found, searching chunks...');

        // --- Improved Chunk Search (If no priority answer is found) ---
        const BATCH_SIZE = 10; // Reduced batch size for better performance
        const CHUNK_COUNT = 181;
        let foundAnswer = false;
        let searchResults: RankedMatch[] = [];

        const scoreNormalized = (normalizedCandidate: string) => {
            if (!normalizedCandidate) {
                return 0;
            }

            let score = 0;

            if (normalizedCandidate.includes(normalizedSearch)) {
                score += searchTokens.size + 3;
            }

            searchTokens.forEach((token) => {
                if (normalizedCandidate.includes(token)) {
                    score += token.length >= 6 ? 2 : 1;
                }
            });

            return score;
        };

        try {
            // Search through chunks with better error handling
            for (let i = 0; i < CHUNK_COUNT; i += BATCH_SIZE) {
                const batch = Array.from({ length: Math.min(BATCH_SIZE, CHUNK_COUNT - i) }, (_, j) => i + j + 1);

                const promises = batch.map(async (chunkIndex): Promise<RankedMatch[]> => {
                    try {
                        const response = await fetch(`/data/chunk-${chunkIndex}.json`);
                        if (!response.ok) {
                            console.warn(`Chunk ${chunkIndex} failed to load: ${response.status}`);
                            return [];
                        }
                        const chunk: QA[] = await response.json();

                        // Rank matches using normalized tokens and overlaps
                        const matches = chunk
                            .map((qa) => {
                                const normalizedQuestion = normalizeText(qa.question ?? '');
                                const normalizedAnswer = normalizeText(qa.answer ?? '');
                                const questionScore = scoreNormalized(normalizedQuestion) * 1.2;
                                const answerScore = scoreNormalized(normalizedAnswer) * 0.6;
                                let combinedScore = questionScore + answerScore;

                                if (normalizedQuestion && normalizedSearch && normalizedQuestion.startsWith(normalizedSearch)) {
                                    combinedScore += 2;
                                }

                                if (qa.question && qa.question.toLowerCase().includes(searchTerm)) {
                                    combinedScore += 1;
                                }

                                if (combinedScore > 0) {
                                    return { qa, score: combinedScore };
                                }

                                return null;
                            })
                            .filter((entry): entry is RankedMatch => Boolean(entry))
                            .sort((a, b) => b.score - a.score)
                            .slice(0, 3);

                        return matches;
                    } catch (error) {
                        console.warn(`Error loading chunk ${chunkIndex}:`, error);
                        return [];
                    }
                });

                const batchResults = await Promise.allSettled(promises);
                
                // Collect all results from this batch
                batchResults.forEach(result => {
                    if (result.status === 'fulfilled' && result.value.length > 0) {
                        searchResults.push(...result.value);
                    }
                });

                // If we found matches, we can stop searching
                if (searchResults.length > 0) {
                    foundAnswer = true;
                    break;
                }
            }

            if (foundAnswer && searchResults.length > 0) {
                // Use the highest ranked result
                searchResults.sort((a, b) => b.score - a.score);
                const bestMatch = searchResults[0].qa;
                console.log('Found chunk answer:', bestMatch.answer);
                const candidateTopic = bestMatch.category ?? detectTopic(bestMatch.question ?? trimmedInput);
                updateSuggestions(candidateTopic);
                const botMessage: Message = { sender: 'bot', text: bestMatch.answer };
                setMessages(prev => [...prev, botMessage]);
            } else {
                console.log('No chunk answer found, using fallback');
                // Enhanced fallback with suggestions focused on personal info
                updateSuggestions('general');
                const fallbackMessage: Message = {
                    sender: 'bot',
                    text: `عذرًا، لم أجد إجابة مباشرة على سؤالك "${trimmedInput}" 😅. يمكنك السؤال عن:\n• معلومات شخصية عن مصطفى أمريش 👨‍💻\n• كيف اتعلم البرمجة أو الأمن السيبراني 💻🔐\n• كيف احمي جهازي وعائلتي 🛡️👨‍👩‍👧‍👦\n• كيف اصير مبرمج أو هكر اخلاقي 🚀⚡\n• الذكاء الاصطناعي والـ AI 🤖🧠\n• حالة الطقس ومواقيت الصلاة 🌤️🕌\n• أسئلة تفاعلية فلسطينية حلوة 😊💕`
                };
                setMessages(prev => [...prev, fallbackMessage]);
            }
        } catch (error) {
            console.error('Error during search:', error);
            const errorMessage: Message = { 
                sender: 'bot', 
                text: 'حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.' 
            };
            setMessages(prev => [...prev, errorMessage]);
        }

        setIsLoading(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim()) return;
        void processUserMessage(userInput);
    };

    const handleSuggestionClick = (question: string) => {
        if (isLoading) return;
        void processUserMessage(question);
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

                <div className="p-4 border-t border-gray-700 space-y-4">
                    {suggestedQuestions.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-xs text-gray-400">اقتراحات سريعة ({topicLabel})</p>
                                <button
                                    type="button"
                                    onClick={() => setAreSuggestionsCollapsed((prev) => !prev)}
                                    className="text-[10px] font-medium text-cyan-300 hover:text-cyan-100 transition-colors"
                                    aria-expanded={!areSuggestionsCollapsed}
                                    aria-label={areSuggestionsCollapsed ? 'إظهار الاقتراحات السريعة' : 'إخفاء الاقتراحات السريعة'}
                                >
                                    {areSuggestionsCollapsed ? 'إظهار' : 'إخفاء'}
                                </button>
                            </div>
                            {!areSuggestionsCollapsed && (
                                <div className="flex gap-2 overflow-x-auto pb-1 -mr-2 pr-2 rtl:pr-0 rtl:-ml-2 rtl:pl-2">
                                    {suggestedQuestions.map((question) => (
                                        <button
                                            key={question}
                                            type="button"
                                            onClick={() => handleSuggestionClick(question)}
                                            className="shrink-0 bg-gray-800 border border-cyan-600/40 hover:border-cyan-400 text-[11px] md:text-xs text-gray-200 px-3 py-2 rounded-full transition-colors duration-200 whitespace-nowrap max-w-[220px] overflow-hidden text-ellipsis text-left"
                                            disabled={isLoading}
                                            title={question}
                                        >
                                            {question}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder={'اكتب رسالتك هنا...'}
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                            disabled={isLoading}
                        />
                         <button
                            type="button"
                            onClick={handleMicClick}
                            disabled={isLoading}
                            className={`p-2 rounded-full transition-colors duration-300 focus:outline-none ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'} disabled:opacity-50`}
                            aria-label={isRecording ? 'إيقاف التسجيل' : 'بدء التسجيل الصوتي'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </button>
                        <button type="submit" disabled={isLoading || !userInput.trim()} className="bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
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