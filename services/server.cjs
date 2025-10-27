const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

const intentKeywords = {
    weather: ["طقس", "حالة الطقس", "الجو", "weather"],
    time: ["ساعة", "وقت", "كم الساعة", "شو الساعة", "time", "تاريخ", "هجري", "ميلادي"],
    prayer: ["صلاة", "مواقيت", "أذان", "اذان", "prayer", "timings"],
    games: ["لعبة", "العاب", "ألعاب", "لعب", "game", "games"],
    cybersecurity: [
        "هكر", "اختراق", "شبكات", "أمن سبراني", "امن سبراني", "الامن السبراني", "cybersecurity",
        "hacking", "كالي لينكس", "kali linux", "استخبارات رقمية", "ديب ويب", "dark web",
        "دارك ويب", "امن المعلومات", "امن الشبكات", "الحماية الرقمية", "الهكر الاخلاقي",
        "فيروسات", "دوس اتاك"
    ],
    programming: [
        "برمجة", "برمج", "لغات البرمجة", "تاريخ البرمجة", "programming", "coding",
        "developer", "مطور", "جافاسكريبت", "بايثون", "جافا"
    ],
    science: ["رياضيات", "فيزياء", "math", "physics", "معادلة", "حساب", "علم"],
    about: ["مصطفى", "أمريش", "mustafa", "emrish", "عنك", "من أنت", "صاحب الموقع", "الموقع"],
    motivation: ["تشجيع", "تحفيز", "تعزيز", "محفز", "مستقبل", "طموح", "نصيحة", "طور نفسي"]
};

function detectIntent(userInput) {
    const text = userInput.toLowerCase().trim();
    const conversationalTriggers = ["شو هو", "ايش هو", "احكيلي عن", "ما هو", "عرفلي", "شو قصة"];

    for (const intent in intentKeywords) {
        const keywords = intentKeywords[intent];
        if (keywords.some(keyword => text.includes(keyword))) {
            return intent;
        }
    }

    for (const trigger of conversationalTriggers) {
        if (text.startsWith(trigger)) {
            const potentialSubject = text.substring(trigger.length).trim();
            for (const intent in intentKeywords) {
                const keywords = intentKeywords[intent];
                if (keywords.some(keyword => potentialSubject.includes(keyword))) {
                    return intent;
                }
            }
        }
    }

    return "other";
}


async function getWeatherData(lat, lon) {
    try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            minTemp: data.daily.temperature_2m_min[0],
            maxTemp: data.daily.temperature_2m_max[0],
            timezone: data.timezone
        };
    } catch (error) {
        console.error("Weather API Error:", error);
        return null;
    }
}

async function getPrayerTimes(lat, lon, timezone) {
    try {
        const url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=8&school=1&timezonestring=${timezone}`;
        const response = await fetch(url);
        const data = await response.json();

        return {
            fajr: data.data.timings.Fajr,
            dhuhr: data.data.timings.Dhuhr,
            asr: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isha: data.data.timings.Isha
        };
    } catch (error) {
        console.error("Prayer API Error:", error);
        return null;
    }
}

app.post("/api/chat", async (req, res) => {
    try {
        const { message, lat, lon } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const intent = detectIntent(message);
        const defaultLat = 31.9522;
        const defaultLon = 35.2332;
        const userLat = lat || defaultLat;
        const userLon = lon || defaultLon;

        let reply = "";

        switch (intent) {
            case "weather":
                const weatherData = await getWeatherData(userLat, userLon);
                if (weatherData) {
                    reply = `🌤️ الطقس الحالي في ${weatherData.timezone}:
الحرارة ${weatherData.temperature}°C والرياح ${weatherData.windspeed} كم/س 💨
الحرارة اليوم بين ${weatherData.minTemp}° و ${weatherData.maxTemp}° 📊
الجو في فلسطين دايماً حلو! 🇵🇸 عندك أي سؤال تاني؟`;
                } else {
                    reply = "عذراً، ما قدرت أجيبข้อมูล الطقس حالياً 🌤️. جرب كمان شوي! 😊";
                }
                break;

            case "time":
                const timeData = await getWeatherData(userLat, userLon);
                const now = new Date();
                const gregorianDate = now.toLocaleDateString("ar-SA", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    weekday: 'long'
                });
                const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {day: 'numeric', month: 'long',year : 'numeric'}).format(now);

                if (timeData) {
                    const currentTime = now.toLocaleTimeString("ar-PS", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                        timeZone: timeData.timezone
                    });
                    reply = `⏰ الساعة عنا هلأ (${timeData.timezone}) هي ${currentTime} 🕐
📅 التاريخ الميلادي: ${gregorianDate}
📆 التاريخ الهجري: ${hijriDate}
كيف بقدر أخدمك كمان؟`;
                } else {
                    const currentTime = now.toLocaleTimeString("ar-PS", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    });
                    reply = `⏰ الساعة هلأ ${currentTime} 🕐
📅 التاريخ الميلادي: ${gregorianDate}
📆 التاريخ الهجري: ${hijriDate}
شو بتحب تعرف كمان؟`;
                }
                break;

            case "prayer":
                const weatherForPrayer = await getWeatherData(userLat, userLon);
                if (weatherForPrayer) {
                    const prayerData = await getPrayerTimes(userLat, userLon, weatherForPrayer.timezone);
                    if (prayerData) {
                        reply = `🕌 مواقيت الصلاة في ${weatherForPrayer.timezone}:

الفجر: ${prayerData.fajr} 🌅
الظهر: ${prayerData.dhuhr} ☀️
العصر: ${prayerData.asr} 🌤️
المغرب: ${prayerData.maghrib} 🌇
العشاء: ${prayerData.isha} 🌙

تقبل الله طاعتكم! 🤲 بدك مساعدة بشي تاني؟`;
                    } else {
                        reply = "آسف، ما قدرت أجيب مواقيت الصلاة حالياً 🕌. جرب بعد شوي لو سمحت! 😊";
                    }
                } else {
                    reply = "آسف، ما قدرت أجيب مواقيت الصلاة حالياً 🕌. جرب بعد شوي لو سمحت! 😊";
                }
                break;

            case "games":
                const gamesResponses = [
                    `🎮 في موقع مصطفى أمريش، بتلاقي ألعاب تفاعلية حلوة كتير! مصممة للتسلية والتعليم بنفس الوقت. منها:
• لعبة الذكاء لاختبار قدراتك.
• لعبة الذاكرة لتحسين تركيزك.
• ألغاز مسلية.

كل لعبة إلها طريقتها الخاصة، بس كلها سهلة وممتعة. جرب بنفسك واحكيلي رأيك! 🎯`,
                    `🕹️ بتحب الألعاب؟ ممتاز! عنا في موقع مصطفى أمريش ألعاب مسلية ومفيدة:
• لعبة تخمين الأرقام - شوف قدراتك الذهنية.
• لعبة الذاكرة - قديش بتقدر تتذكر؟

كل لعبة الها شرح بسيط قبل ما تبدأ. يلا بلش واستمتع! 🏆 عندك لعبة معينة حابب تسأل عنها؟`
                ];
                reply = gamesResponses[Math.floor(Math.random() * gamesResponses.length)];
                break;

            case "cybersecurity":
                const cybersecurityResponses = [
                    `🔐 الأمن السيبراني (Cybersecurity) هو حماية أنظمتنا وبياناتنا من الهجمات الإلكترونية. الهكر الأخلاقي هو الخبير اللي بستخدم مهاراته لكشف الثغرات وحمايتنا، مش لإيذائنا.

بدك تعرف عن مجال معين في الأمن السيبراني؟ مثلاً كيف تحمي حالك من الفيروسات أو الاختراق؟`,
                    `🇵🇸 أهلين فيك بعالم الحماية الرقمية! 
الأمن السيبراني، أو زي ما بنحكي "حماية الشبكات"، هو ببساطة كيف نحمي أجهزتنا ومعلوماتنا من أي حدا بحاول يسرقها أو يخربها عن طريق الإنترنت.
مثلاً، كلمة السر القوية اللي بتحطها لحساباتك هي جزء من أمنك السيبرANI الشخصي.

عندك فضول تعرف عن إشي معين في هالمجال؟ مثلاً عن الفيروسات أو كيف تحمي حالك؟ اسألني! 😉`,
                    `🛡️ بدك تحمي حالك أونلاين؟ هاي شوية نصايح فلسطينية أصيلة:

1.  **كلمة سر قوية:** ما تستخدم تواريخ ميلاد أو أرقام سهلة. خربطها حروف كبيرة وصغيرة ورموز. زي طبخة المقلوبة، كل ما كانت مكوناتها أكثر، كل ما كانت أزكى وأصعب للتقليد! 😜
2.  **لا تفتح أي رابط بيجيك:** خصوصاً من أرقام ما بتعرفها. ممكن يكون "فخ" لسرقة معلوماتك.
3.  **تحديث البرامج:** دايماً حدث تلفونك والكمبيوتر لآخر نسخة. التحديثات بتسكر الثغرات اللي ممكن الهكرز يستغلوها.

عندك أي سؤال تاني عن كيف تبقى آمن على الإنترنت؟ أنا جاهز!`,
                ];
                reply = cybersecurityResponses[Math.floor(Math.random() * cybersecurityResponses.length)];
                break;

            case "programming":
                const programmingResponses = [
                    `👨‍💻 البرمجة هي كتابة تعليمات للكمبيوتر عشان ينفذ مهمة معينة. زي لما تعطي وصفة لحدا عشان يطبخ طبخة، بس هون بتكون التعليمات مكتوبة بلغة بفهمها الكمبيوتر.

في لغات برمجة كتير زي Python و JavaScript و Java. كل لغة الها استخداماتها. حابب تعرف عن لغة معينة؟`,
                    `💻 بالعربي الفلسطيني - شو يعني برمجة؟
البرمجة هي إنك "تحكي" مع الكمبيوتر بلغته عشان يعمل اللي بدك ياه. إنت بتكتب كود (نص برمجي)، والكمبيوتر بنفذه.

🌐 أشهر لغات البرمجة واستخداماتها:
• **JavaScript:** للمواقع والتطبيقات التفاعلية.
• **Python:** للذكاء الاصطناعي وتحليل البيانات وسهل للبداية.
• **Java:** لتطبيقات الشركات الكبيرة والأندرويد.

شو المجال اللي بجذبك أكثر في البرمجة؟ يمكن أقدر أساعدك من وين تبدأ!`,
                ];
                reply = programmingResponses[Math.floor(Math.random() * programmingResponses.length)];
                break;

            case "science":
                const scienceResponses = [
                    `🔬 الرياضيات والفيزياء هما أساس فهمنا للكون. الرياضيات هي اللغة اللي بنستخدمها لوصف الطبيعة، والفيزياء هي العلم اللي بدرس قوانين هاي الطبيعة.

عندك سؤال معين في الرياضيات أو الفيزياء؟ أو حابب تعرف عن عالم معين مثل أينشتاين أو فيثاغورس؟`,
                    `🧮 بالعربي الفلسطيني - الرياضيات والفيزياء ببساطة:
الرياضيات مش بس أرقام، هي منطق وطريقة تفكير. والفيزياء بتفسرلنا كل إشي بصير حوالينا، من حركة الكواكب لأصغر الجزيئات.

حابب ندردش عن موضوع معين فيهم؟ مثلاً، شو قصة التفاحة اللي وقعت على راس نيوتن؟ 🍎`
                ];
                reply = scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
                break;

            case "about":
                const aboutResponses = [
                    `👨‍💻 مصطفى أمريش هو مطور فلسطيني بحب التكنولوجيا والأمن السيبراني. هدفه من هاد الموقع هو مشاركة معرفته ومساعدة الشباب العربي والفلسطيني على دخول عالم التكنولوجيا.

حابب تعرف أكتر عن مهاراته أو مشاريعه؟`,
                    `🇵🇸 بالعربي الفلسطيني - عن مصطفى والموقع:
مصطفى أمريش شب فلسطيني من الخليل، بحب البرمجة والتكنولوجيا كتير. عمل هاد الموقع عشان يكون زي "ديوان" إلكتروني يشارك فيه معرفته ومشارعه مع كل الناس، وخصوصي أهل بلده.

هدفه يورجي إنه الشباب الفلسطيني قادر يبدع في أي مجال. عندك أي سؤال عن مصطفى أو عن الموقع؟`
                ];
                reply = aboutResponses[Math.floor(Math.random() * aboutResponses.length)];
                break;

            case "motivation":
                const motivationResponses = [
                    `🌟 "كل خبير كان يوماً ما مبتدئاً." لا تخف من البدايات، فالرحلة الطويلة تبدأ بخطوة. ما هو هدفك الذي تسعى لتحقيقه؟ دعنا نتحدث عنه!`,
                    `🇵🇸 بالعربي الفلسطيني - اسمع مني هالكلمتين:
"اللي إله نية، ما بتغلبه منقية". يعني إذا عندك إصرار وعزيمة، فش إشي بوقّف بطريقك. كلنا بنواجه صعوبات، بس المهم نكمل ونحاول. شو التحدي اللي بواجهك حالياً؟ يمكن نقدر نلاقي له حل سوا!`
                ];
                reply = motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
                break;

            default:
                const defaultResponses = [
                    "أهلاً فيك! أنا المساعد الذكي في موقع مصطفى أمريش. كيف بقدر أخدمك اليوم؟ 😊",
                    "يا هلا! أنا هنا لمساعدتك. شو بتحب تعرف؟",
                    "مرحباً! أنا مساعدك الرقمي. اسألني أي سؤال في بالك."
                ];
                reply = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
                break;
        }

        res.json({ reply });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            reply: "عذراً، صار في خطأ فني. سامحنا وحاول كمان مرة بعد شوي! 😅"
        });
    }
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Chat API available at http://localhost:${PORT}/api/chat`);
});

module.exports = app;
