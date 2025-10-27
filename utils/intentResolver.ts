
export type IntentID =
  | "cybersecurity"
  | "programming"
  | "databases"
  | "networking"
  | "darkweb"
  | "money"
  | "userMood"
  | "siteInfo"
  | "weather"
  | "prayerTimes"
  | "game";

interface IntentRule {
  intent: IntentID;
  keywords: string[];
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "cybersecurity",
    keywords: [
      "امن سيبراني",
      "أمن سيبراني",
      "الامن السبراني",
      "الأمن السيبراني",
      "سيبر سيكيورتي",
      "حماية الحساب",
      "كيف اهكر",
      "هاكر",
      "اختراق",
      "تهكير",
      "malware",
      "phishing",
      "vpn"
    ]
  },
  {
    intent: "programming",
    keywords: [
      "برمجة",
      "كود",
      "كود برمجي",
      "اتعلم لغة",
      "بايثون",
      "جافا",
      "جافاسكربت",
      "javascript",
      "front end",
      "backend",
      "full stack",
      "مطور"
    ]
  },
  {
    intent: "databases",
    keywords: [
      "قاعدة بيانات",
      "database",
      "sql",
      "nosql",
      "جدول البيانات",
      "تخزين بيانات",
      "index"
    ]
  },
  {
    intent: "networking",
    keywords: [
      "شبكة",
      "راوتر",
      "ip",
      "vpn network",
      "wifi",
      "كلمة سر الواي فاي",
      "بنج"
    ]
  },
  {
    intent: "darkweb",
    keywords: [
      "دارك ويب",
      "dark web",
      "ديب ويب",
      "deep web",
      "تور",
      "tor",
      "الويب المظلم"
    ]
  },
  {
    intent: "money",
    keywords: [
      "مصاري",
      "فلوس",
      "دخل",
      "اربح",
      "غني",
      "كيف اصير غني",
      "freelance",
      "فلانسر",
      "شغل اونلاين",
      "نصب اونلاين"
    ]
  },
  {
    intent: "userMood",
    keywords: [
      "انا حزين",
      "انا زعلان",
      "انا تعبان",
      "مضغوط",
      "انا مهموم",
      "انا متضايق",
      "صداع نفسي",
      "مش طايق حدا"
    ]
  },
  {
    intent: "siteInfo",
    keywords: [
      "مين انت",
      "انت صاحبي",
      "انت حبيبي",
      "شو بتسوي",
      "شو خدماتك",
      "شو بتقدر تساعدني",
      "شو الموقع",
      "عن الموقع",
      "عن البوت"
    ]
  },
  {
    intent: "weather",
    keywords: [
      "طقس",
      "الطقس",
      "الجو",
      "حرارة",
      "مطر",
      "كيف الجو",
      "كيف الجو اليوم"
    ]
  },
  {
    intent: "prayerTimes",
    keywords: [
      "مواقيت الصلاة",
      "موعد الصلاة",
      "وقت الصلاة",
      "وقت الأذان",
      "اذان",
      "أذان المغرب",
      "أذان الفجر"
    ]
  },
  {
    intent: "game",
    keywords: [
      "نلعب",
      "اسئلة تافهة",
      "سؤال تافه",
      "سؤال عشوائي",
      "اسألني سؤال",
      "لعبة اسئلة",
      "ملل"
    ]
  }
];

export function resolveIntent(rawUserInput: string): IntentID | null {
  const text = rawUserInput.toLowerCase();
  for (const rule of INTENT_RULES) {
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) {
        return rule.intent;
      }
    }
  }
  return null;
}
