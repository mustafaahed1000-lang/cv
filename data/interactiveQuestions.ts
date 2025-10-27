
export interface InteractiveQuestion {
  id: string;
  text: string;
  category:
    | "fun"
    | "personal"
    | "tech"
    | "money"
    | "mood"
    | "wouldYouRather";
}

const baseQuestions: InteractiveQuestion[] = [
  { id: "friend-1", text: "انا بالنسبة إلك شو؟ صاحبك ولا مستخدم؟", category: "personal" },
  { id: "friend-2", text: "بتحبني ولا لأ؟ يعني هل انت معي ولا مع العالم؟", category: "personal" },
  { id: "mood-1", text: "شكلك مش رايق اليوم؟ احكيلي شو مضايقك؟", category: "mood" },
  { id: "mood-2", text: "حاسس بقهر ولا الوضع عادي؟", category: "mood" },
  { id: "life-1", text: "لو صحيت مليونير بكرا الصبح إيش أول حركة تعملها؟", category: "money" },
  { id: "life-2", text: "لو معك 10,000$ هسا وين بتصرفهم؟", category: "money" },
  { id: "life-3", text: "بدك تصير غني ولا بدك تصير مرتاح نفسياً؟ اختار.", category: "money" },

  { id: "wyr-1", text: "لو خيروك: تعيش في الفضاء لحالك ولا بغزة مع أصحابك؟ وليش؟", category: "wouldYouRather" },
  { id: "wyr-2", text: "لو كنت حيوان. بتختار تكون أسد ولا كلب وفي وفاء؟", category: "wouldYouRather" },
  { id: "wyr-3", text: "لو ترجع بالوقت ولا تروح على المستقبل؟", category: "wouldYouRather" },

  { id: "tech-1", text: "شو أكتر تقنية بتخوف الناس برأيك: الذكاء الاصطناعي ولا الهاكرز؟", category: "tech" },
  { id: "tech-2", text: "بتفكر الإنترنت آمن؟ ولا كله مراقب؟", category: "tech" },
  { id: "tech-3", text: "بتعرف شو يعني الأمن السيبراني ولا بتحب أشرحلك من الصفر؟", category: "tech" },
  { id: "tech-4", text: "لو سألتك مين أخطر: هاكر محترف ولا واحد حاط باسورد 123456؟", category: "tech" },

  { id: "fusha-1", text: "لو استطعت تغيير شيء واحد في عالم التقنية فما هو؟", category: "fun" },
  { id: "fusha-2", text: "هل تظن أن المال يشتري الراحة أم لا؟ علل.", category: "money" },
  { id: "fusha-3", text: "ما معنى أن تكون آمناً رقمياً؟", category: "tech" },

  { id: "social-1", text: "قديش بتقيّم صحتك النفسية من 1 ل 10؟", category: "mood" },
  { id: "social-2", text: "شو أكتر شغلة بتعملك سترس هالفترة؟", category: "mood" },
  { id: "social-3", text: "برأيك في ناس بتسمعك ولا بتحس حالك لوحدك؟", category: "personal" },

  { id: "classic-1", text: "كيف حالك؟", category: "personal" },
  { id: "classic-2", text: "أنا زهقان. سَلّيني.", category: "fun" },
  { id: "classic-3", text: "احكيلي فش قلبي لو سمحت؟", category: "mood" },
  { id: "classic-4", text: "كيف أجيب مصاري أونلاين بطريقة قانونية؟", category: "money" },
  { id: "classic-5", text: "اشرحلي الدارك ويب بدون ما تورطني.", category: "tech" },
  { id: "classic-6", text: "شو يعني هاكر؟ وهل لازم أخاف؟", category: "tech" },
  { id: "classic-7", text: "شو يعني برمجة؟", category: "tech" },
  { id: "classic-8", text: "أهم لغة برمجة أتعلمها أول اشي؟", category: "tech" },
  { id: "classic-9", text: "كيف أبدأ أتعلم قواعد البيانات؟", category: "tech" },
  { id: "classic-10", text: "شو الفرق بين الديب ويب والدارك ويب؟", category: "tech" }
];

const openers = [
  "سؤال سريع:",
  "احكي بصراحة:",
  "لو لحالك هسا:",
  "خليني أسألك:",
  "بدون تفكير:",
  "جاوبني دغري:",
  "بمزحش هالمرة:"
];

const tailers = [
  "وليش؟",
  "وما تكذب.",
  "وبدون فلسفة.",
  "اعطي جواب جد.",
  "حقيقي مو تمثيل.",
  "بدون ما تتهرب."
];

export function generateInteractiveQuestions(limit = 1000): InteractiveQuestion[] {
  const out: InteractiveQuestion[] = [];
  let counter = 0;

  for (const q of baseQuestions) {
    if (counter >= limit) break;
    out.push(q);
    counter++;
  }

  for (const q of baseQuestions) {
    for (const o of openers) {
      for (const t of tailers) {
        if (counter >= limit) break;
        out.push({
          id: `${q.id}-v${counter}`,
          text: `${o} ${q.text} ${t}`,
          category: q.category
        });
        counter++;
      }
      if (counter >= limit) break;
    }
    if (counter >= limit) break;
  }

  return out;
}

export const interactiveQuestions: InteractiveQuestion[] = generateInteractiveQuestions();
