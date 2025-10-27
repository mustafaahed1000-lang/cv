import { INTERACTIVE_QUESTIONS } from './interactiveQuestions';

export interface TopicConfig {
    id: string;
    label: string;
    keywords: string[];
    suggestions: string[];
}

const TOPIC_CONFIGS: TopicConfig[] = [
    {
        id: 'cybersecurity',
        label: 'الأمن السيبراني',
        keywords: [
            'الأمن السيبراني',
            'امن سبراني',
            'أمن سبراني',
            'سيبراني',
            'cybersecurity',
            'security',
            'cyber',
            'هكر',
            'هاكر',
            'اختراق',
            'اختراق اخلاقي',
            'ddos',
            'dark web',
            'ديب ويب',
            'دارك ويب',
            'tor',
            'vpn',
            'حماية الجهاز',
            'مخاطر',
            'تهديد'
        ],
        suggestions: [
            'ما هو الأمن السيبراني؟',
            'كيف أبدأ تعلم الأمن السيبراني خطوة بخطوة؟',
            'ما الفرق بين الاختراق الأخلاقي والاختراق الخبيث؟',
            'كيف أحمي جهازي من الفيروسات والهجمات؟',
            'ما أهم الشهادات المطلوبة للعمل في الأمن السيبراني؟',
            'كيف أحمي عائلتي على الإنترنت؟',
            'شو هو الدارك ويب وكيف أتعامل معه بأمان؟',
            'ما هي أدوات الاختراق الأخلاقي الأساسية؟'
        ]
    },
    {
        id: 'programming',
        label: 'البرمجة والتطوير',
        keywords: [
            'برمجة',
            'مبرمج',
            'كود',
            'coding',
            'javascript',
            'react',
            'تطوير',
            'مشروع برمجي',
            'تطبيق',
            'مطور'
        ],
        suggestions: [
            'كيف أتعلم البرمجة من الصفر؟',
            'ما أفضل لغات البرمجة للمبتدئين؟',
            'كيف أبدأ أول مشروع ويب؟',
            'شو هي مهارات مصطفى في البرمجة؟',
            'كيف أشتغل مبرمج عن بعد؟',
            'ما الفرق بين الواجهة الأمامية والخلفية؟',
            'ما أفضل مصادر عربية لتعلم React؟',
            'كيف أطور لعبة بسيطة باستخدام JavaScript؟'
        ]
    },
    {
        id: 'website',
        label: 'الموقع والخدمات',
        keywords: [
            'موقع',
            'مواقع',
            'خدمات',
            'تواصل',
            'سيرة',
            'سيرتي',
            'portfolio',
            'الخدمات'
        ],
        suggestions: [
            'ما هي الخدمات التي يقدمها مصطفى؟',
            'كيف أتواصل مع مصطفى؟',
            'شو مميزات الموقع الشخصي لمصطفى؟',
            'كيف أحجز استشارة تقنية مع مصطفى؟',
            'ما هي الألعاب الموجودة في الموقع؟',
            'كيف أجرب السيرة التفاعلية؟',
            'ما المشاريع التي يعمل عليها مصطفى حالياً؟',
            'كيف أطلب بناء موقع مخصص؟'
        ]
    },
    {
        id: 'about',
        label: 'عن مصطفى أمريش',
        keywords: [
            'مصطفى',
            'أمريش',
            'مصطفى أمريش',
            'مصطفى عاهد',
            'سيرة مصطفى',
            'خبرات مصطفى',
            'مهارات مصطفى'
        ],
        suggestions: [
            'من هو مصطفى أمريش؟',
            'ما هي خبرات مصطفى المهنية؟',
            'شو أبرز إنجازات مصطفى؟',
            'ما الشهادات التي يمتلكها مصطفى؟',
            'كيف بدأ مصطفى مسيرته في التقنية؟',
            'ما هي رؤية مصطفى للمستقبل؟',
            'كيف يدعم مصطفى المجتمع التقني؟',
            'ما هي أقوى مهارات مصطفى؟'
        ]
    },
    {
        id: 'ai',
        label: 'الذكاء الاصطناعي',
        keywords: [
            'ذكاء اصطناعي',
            'الذكاء الاصطناعي',
            'ai',
            'machine learning',
            'روبوت',
            'smart'
        ],
        suggestions: [
            'ما هو الذكاء الاصطناعي؟',
            'كيف يساعد الذكاء الاصطناعي في حياتنا اليومية؟',
            'شو مشاريع مصطفى في الذكاء الاصطناعي؟',
            'كيف أتعلم الذكاء الاصطناعي؟',
            'ما الفرق بين الذكاء الاصطناعي والتعلم الآلي؟',
            'كيف أبدأ مشروع يعتمد على الذكاء الاصطناعي؟',
            'ما المهارات المطلوبة للعمل في AI؟',
            'شو أهم تطبيقات الذكاء الاصطناعي؟'
        ]
    },
    {
        id: 'interactive',
        label: 'أسئلة تفاعلية وألعاب',
        keywords: [
            'لعبة',
            'ألعاب',
            'نلعب',
            'لغز',
            'ألغاز',
            'تحدي',
            'سؤال تفاعلي',
            'صاحبي',
            'حبيبي',
            'لعب'
        ],
        suggestions: INTERACTIVE_QUESTIONS
    },
    {
        id: 'motivation',
        label: 'نصائح وتحفيز',
        keywords: [
            'نصيحة',
            'نصائح',
            'انجح',
            'حياتي',
            'مساعدة',
            'تحفيز',
            'نفسية'
        ],
        suggestions: [
            'كيف أنجح في حياتي؟',
            'ما هي أفضل نصيحة للتعلم المستمر؟',
            'كيف أحافظ على حماسي في التعلم؟',
            'كيف أطور نفسي مهنياً؟',
            'كيف أتعامل مع الضغط النفسي؟',
            'ما خطوات بناء خطة تعلم شخصية؟',
            'كيف أحصل على توازن بين العمل والحياة؟',
            'ما طرق تطوير مهاراتي يومياً؟'
        ]
    },
    {
        id: 'general',
        label: 'اقتراحات عامة',
        keywords: [],
        suggestions: [
            'من هو مصطفى أمريش؟',
            'ما الفرق بين البرمجة والأمن السيبراني؟',
            'كيف أتعلم البرمجة بسرعة؟',
            'ما هو الأمن السيبراني؟',
            'كيف أحمي جهازي الشخصي؟',
            'أعطني لغز تفاعلي جديد.',
            'ما المشاريع التي يقدمها مصطفى؟',
            'كيف أجد مصادر عربية للتعلم؟'
        ]
    }
];

const TOPIC_MAP = new Map<string, TopicConfig>(TOPIC_CONFIGS.map((topic) => [topic.id, topic]));

const pickSuggestions = (list: string[], limit: number) => {
    const finalLimit = Math.min(limit, list.length);
    if (finalLimit <= 0) {
        return [];
    }

    if (list.length <= finalLimit) {
        return [...list];
    }

    const selected: string[] = [];
    const usedIndices = new Set<number>();

    while (selected.length < finalLimit) {
        const randomIndex = Math.floor(Math.random() * list.length);
        if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            selected.push(list[randomIndex]);
        }
    }

    return selected;
};

export const DEFAULT_SUGGESTIONS = pickSuggestions(TOPIC_MAP.get('general')?.suggestions ?? [], 6);

export const detectTopic = (text?: string | null) => {
    if (!text) {
        return 'general';
    }

    const normalized = text.toLowerCase();

    for (const topic of TOPIC_CONFIGS) {
        if (topic.id === 'general') {
            continue;
        }

        if (topic.keywords.some((keyword) => normalized.includes(keyword))) {
            return topic.id;
        }
    }

    return 'general';
};

export const getSuggestionsForTopic = (topicId: string, limit = 6) => {
    const topic = TOPIC_MAP.get(topicId) ?? TOPIC_MAP.get('general');
    if (!topic) {
        return [];
    }

    return pickSuggestions(topic.suggestions, limit);
};

export const getTopicLabel = (topicId: string) => {
    const topic = TOPIC_MAP.get(topicId);
    return topic?.label ?? TOPIC_MAP.get('general')?.label ?? 'اقتراحات عامة';
};
