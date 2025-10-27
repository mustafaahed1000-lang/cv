const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../dist")));

function detectIntent(userInput) {
    const text = userInput.toLowerCase().trim();

    // Weather related queries
    if (text.includes("طقس") || text.includes("حالة الطقس") || text.includes("الجو") ||
        text.includes("الطقس") || text.includes("weather")) {
        return "weather";
    }

    // Time related queries
    if (text.includes("ساعة") || text.includes("الوقت") || text.includes("كم الساعة") ||
        text.includes("شو الساعة") || text.includes("ماذا الساعة") || text.includes("time") ||
        text.includes("التاريخ") || text.includes("تاريخ اليوم") || text.includes("كم التاريخ") ||
        text.includes("شو اليوم") || text.includes("هجري") || text.includes("ميلادي")) {
        return "time";
    }

    // Prayer times
    if (text.includes("صلاة") || text.includes("مواقيت") || text.includes("الأذان") ||
        text.includes("اذان") || text.includes("prayer") || text.includes("timings")) {
        return "prayer";
    }

    // Games related queries
    if (text.includes("لعبة") || text.includes("العاب") || text.includes("ألعاب") ||
        text.includes("لعب") || text.includes("game") || text.includes("games") ||
        text.includes("شو هي اللعبة") || text.includes("شو هي الألعاب") || text.includes("كيف العب")) {
        return "games";
    }

    // Hacking and cybersecurity queries
    if (text.includes("هكر") || text.includes("اختراق") || text.includes("شبكات") ||
        text.includes("أمن سبراني") || text.includes("cybersecurity") || text.includes("hacking") ||
        text.includes("كالي لينكس") || text.includes("kali linux") || text.includes("استخبارات رقمية") ||
        text.includes("ديب ويب") || text.includes("dark web") || text.includes("دارك ويب") ||
        text.includes("شو يعني هكر") || text.includes("شنو يعني اختراق") || text.includes("شو هي الشبكات")) {
        return "cybersecurity";
    }

    // Programming queries
    if (text.includes("برمجة") || text.includes("برمج") || text.includes("لغات البرمجة") ||
        text.includes("تاريخ البرمجة") || text.includes("programming") || text.includes("coding") ||
        text.includes("developer") || text.includes("مطور") || text.includes("شو هي البرمجة") ||
        text.includes("شو هي لغات البرمجة") || text.includes("شو يعني برمجة")) {
        return "programming";
    }

    // Mathematics and physics queries
    if (text.includes("رياضيات") || text.includes("فيزياء") || text.includes("math") ||
        text.includes("physics") || text.includes("معادلة") || text.includes("حساب") ||
        text.includes("شو هي الرياضيات") || text.includes("شو هي الفيزياء")) {
        return "science";
    }

    // About Mustafa and the website
    if (text.includes("مصطفى") || text.includes("أمريش") || text.includes("mustafa") ||
        text.includes("emrish") || text.includes("عنك") || text.includes("من أنت") ||
        text.includes("صاحب الموقع") || text.includes("الموقع") || text.includes("شو هو مصطفى") ||
        text.includes("شو هو أمريش") || text.includes("من هو مصطفى أمريش")) {
        return "about";
    }

    // Motivational queries
    if (text.includes("تشجيع") || text.includes("تحفيز") || text.includes("تعزيز") ||
        text.includes("محفز") || text.includes("مستقبل") || text.includes("طموح") ||
        text.includes("شو افعل") || text.includes("كيف اطور نفسي") || text.includes("نصيحة")) {
        return "motivation";
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
                    reply = `🌤️ الطقس الحالي:
الحرارة الآن ${weatherData.temperature}°C والرياح ${weatherData.windspeed} كم/س 💨
اليوم من ${weatherData.minTemp}° إلى ${weatherData.maxTemp}° 📊
الطقس في فلسطين جميل دائماً! 🇵🇸✨`;
                } else {
                    reply = "عذراً، لا أستطيع الحصول على بيانات الطقس حالياً 🌤️. جرب مرة أخرى لاحقاً! 😊";
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

                // Calculate approximate Hijri date (simplified calculation)
                const hijriOffset = 579; // Approximate offset between Gregorian and Hijri
                const hijriYear = Math.floor((now.getFullYear() - 622) + (hijriOffset / 354.37));
                const hijriMonth = Math.floor((now.getMonth() + 1) + ((hijriOffset % 354.37) / 29.53));
                const hijriDay = Math.floor(now.getDate() + ((hijriOffset % 29.53)));

                if (timeData) {
                    const currentTime = now.toLocaleTimeString("ar-PS", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    });
                    reply = `⏰ الوقت المحلي الآن (${timeData.timezone}) هو ${currentTime} 🕐
📅 التاريخ الميلادي: ${gregorianDate}
📆 التاريخ الهجري التقريبي: ${hijriDay}/${hijriMonth}/${hijriYear} هـ
الوقت في فلسطين جميل دائماً! 🇵🇸✨`;
                } else {
                    const currentTime = now.toLocaleTimeString("ar-PS", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                    });
                    reply = `⏰ الوقت الآن هو ${currentTime} 🕐
📅 التاريخ الميلادي: ${gregorianDate}
📆 التاريخ الهجري التقريبي: ${hijriDay}/${hijriMonth}/${hijriYear} هـ
الوقت في فلسطين جميل دائماً! 🇵🇸✨`;
                }
                break;

            case "prayer":
                const weatherForPrayer = await getWeatherData(userLat, userLon);
                if (weatherForPrayer) {
                    const prayerData = await getPrayerTimes(userLat, userLon, weatherForPrayer.timezone);
                    if (prayerData) {
                        reply = `🕌 مواقيت الصلاة حسب ${weatherForPrayer.timezone}:

الفجر: ${prayerData.fajr} 🌅
الظهر: ${prayerData.dhuhr} ☀️
العصر: ${prayerData.asr} 🌤️
المغرب: ${prayerData.maghrib} 🌇
العشاء: ${prayerData.isha} 🌙

بارك الله فيك! 🤲✨`;
                    } else {
                        reply = "عذراً، لا أستطيع الحصول على مواقيت الصلاة حالياً 🕌. جرب مرة أخرى لاحقاً! 😊";
                    }
                } else {
                    reply = "عذراً، لا أستطيع الحصول على مواقيت الصلاة حالياً 🕌. جرب مرة أخرى لاحقاً! 😊";
                }
                break;

            case "games":
                const gamesResponses = [
                    `🎮 في موقع مصطفى أمريش، ستجد مجموعة رائعة من الألعاب التفاعلية! هذه الألعاب مصممة لتوفير تجربة ترفيهية وتعليمية ممتعة. تشمل الألعاب:
• لعبة الذكاء التي اختبر قدراتك الذهنية
• لعبة الذاكرة التي تساعدك على تحسين تركيزك
• ألعاب الألغاز الممتعة

كل لعبة لديها قواعدها الخاصة، ولكنها جميعاً سهلة الفهم والتعلم. يمكنك البدء بالنقر على أيقونة اللعبة التي تهمك، وستظهر لك تعليمات اللعب قبل البدء. استمتع بوقتك في استكشاف هذه الألعاب الممتعة! 🎯🧩`,

                    `🕹️ تحب الألعاب؟ حلو كتير! في موقع مصطفى أمريش عندنا ألعاب كتير حلوة ومسلية:
• لعبة تخمين الأرقام - جرب حظك وقدراتك الذهنية
• لعبة الذاكرة - شوف قد إيه بتتذكر
• ألعاب تفاعلية بتعلّمك وأنت بتلعب

كل لعبة عندها طريقة لعبها، بس كلها بسيطة وممتعة. جرب أي لعبة بدك إياها، ورح تلاقي شرح كامل قبل ما تبدأ. بالتوفيق! 🏆🎮`,

                    `🎲 أهلاً بك في عالم الألعاب في موقع مصطفى أمريش!
عندنا مجموعة متنوعة من الألعاب المصممة خصيصاً لتكون مسلية ومفيدة في نفس الوقت:
• ألعاب ذكاء لتحفيز عقلك
• ألعاب منطق لتطوير مهارات التفكير
• ألعاب تفاعلية للمرح والتعلم

مفيش أي مجهود مطلوب منك غير الضغط على زر البدء! كل الألعاب جاهزة وتنتظرك. استمتع! 🎯🕹️`
                ];
                reply = gamesResponses[Math.floor(Math.random() * gamesResponses.length)];
                break;

            case "cybersecurity":
                const cybersecurityResponses = [
                    `🔐 عالم الأمن السبراني والهكر الأخلاقي:
الهكر الأخلاقي هو استخدام المهارات التقنية لاكتشاف الثغرات وإصلاحها، وليس للتدمير. أدوات مثل كالي لينكس توفر بيئة متكاملة لاختبار الأمان.

🛡️ أهم مبادئ الأمن السبراني:
1. الحماية وليس الاختراق
2. الإبلاغ عن الثغرات بدلاً من استغلالها
3. احترام الخصوصية والقوانين

⚠️ الديب ويب والدارك ويب:
هذه الأجزاء من الإنترنت غير متاحة عبر محركات البحث العادية. قد تكون خطرة وتحتوي على محتوى غير قانوني. يُنصح بتجنبها والتركيز على تطوير المهارات في الأمن السبراني الإيجابي.

💡 أفضل مصادر التعلم:
• منصات مثل Hack The Box و TryHackMe
• شهادات مثل CEH و OSCP
• مجتمعات الأمن السبراني المحلية والعالمية

تذكر دائماً: القوة الكبيرة تأتي مع مسؤولية أكبر! 🌟`,

                    `🖥️ أدوات الأمن السبراني المشهورة:
• Metasploit: لإدارة الثغرات والاختراق الاختباري
• Wireshark: لتحليل الشبكات
• Nmap: لمسح الشبكات والمنافذ
• Burp Suite: لاختبار أمان تطبيقات الويب

🐧 كالي لينكس:
هي توزيعة لينكس متخصصة في اختبار الأمان والاختراق الأخلاقي، تحتوي على أكثر من 600 أداة مدمجة للأمن السبراني.

🔍 الاستخبارات الرقمية:
هي عملية جمع وتحليل البيانات الرقمية لدعم التحقيقات الأمنية. تشمل تحليل الأجهزة والشبكات والبيانات الوصفية.

🚨 نصيحة هامة:
تعلم الأمن السبراني يتطلب التزاماً بالأخلاق والقوانين. استخدم مهاراتك للخير وحماية الآخرين! 🛡️✨`,

                    `🔒 بالعربي الفلسطيني - شو يعني أمن سبراني؟
الأمن السبراني هو حماية الأنظمة والشبكات والبيانات من الهجمات الرقمية. الهكر الأخلاقي هو اللي بيعرف كيف يخترق بس بيستخدم المعرفة عشان يحمي مش عشان يضر.

🛠️ أهم الأدوات:
• كالي لينكس: نظام تشغيل مخصص للأمن السبراني
• Nmap: لفحص الشبكات
• Wireshark: لتحليل البيانات المتبادلة في الشبكة
• Aircrack-ng: لاختبار أمان الشبكات اللاسلكية

🌐 الإنترنت الخفي (الديب ويب والدارك ويب):
هناك أجزاء من الإنترنت مش ظاهرة لمحركات البحث العادية. الديب ويب بيحتوي على معلومات مش مفهرسة، والدارك ويب بيحتوي على محتوى غالباً غير قانوني. نصيحتي: ابتعد عنهم!

💪 إذا حابب تتعلم، ابدأ بالأساسيات وركز على الهكر الأخلاقي. في مجتمعات كتير حلوة بتساعد المبتدئين! 🚀`
                ];
                reply = cybersecurityResponses[Math.floor(Math.random() * cybersecurityResponses.length)];
                break;

            case "programming":
                const programmingResponses = [
                    `👨‍💻 تاريخ لغات البرمجة:
بدأت البرمجة مع الآلات الميكانيكية في القرن التاسع عشر، ثم تطورت مع ظهور الحواسيب الإلكترونية في الأربعينيات. من أقدم اللغات:
• FORTRAN (1957) - للعمليات العلمية
• COBOL (1959) - للأعمال التجارية
• C (1972) - أساس أنظمة يونكس ولينكس
• Python (1991) - سهلة التعلم ومتعددة الاستخدامات

🌍 أشهر لغات البرمجة حالياً:
• JavaScript - لتطوير الويب
• Python - للذكاء الاصطناعي وعلم البيانات
• Java - لتطبيقات المؤسسات
• C++ - لأنظمة التشغيل والألعاب
• Go - للأنظمة الموزعة

💡 نصيحة للمبتدئين:
ابدأ بلغة سهلة مثل Python أو JavaScript، وركز على فهم المفاهيم الأساسية قبل الانتقال إلى لغات أكثر تعقيداً! 🚀`,

                    `🌟 عالم البرمجة:
البرمجة هي فن إعطاء الأوامر للحاسوب لتنفيذ مهام محددة. كل لغة برمجة لها قواعدها الخاصة وتستخدم في مجالات مختلفة.

🔧 أنواع البرمجة:
• برمجة الواجهات الأمامية (Frontend) - ما يراه المستخدم
• برمجة الواجهات الخلفية (Backend) - الخوادم وقواعد البيانات
• برمجة تطبيقات الموبايل
• برمجة الأنظمة المدمجة
• علم البيانات والذكاء الاصطناعي

📚 مسارات التعلم:
1. ابدأ بأساسيات البرمجة والخوارزميات
2. اختر مجالاً يثير اهتمامك
3. تعلم اللغات المناسبة لهذا المجال
4. طبق ما تعلمت في مشاريع عملية
5. انضم لمجتمعات المطورين

تذكر: أفضل طريقة لتعلم البرمجة هي الممارسة المستمرة! 💻✨`,

                    `💻 بالعربي الفلسطيني - شو يعني برمجة؟
البرمجة هي كتابة أوامر للكمبيوتر عشان يعمل حاجات معينة. شبهها بتكون بتكلم بلغة الكمبيوتر الفهمها.

🌐 أهم لغات البرمجة:
• جافاسكريبت: للمواقع وتطبيقات الويب
• بايثون: للذكاء الاصطناعي والتحليل
• جافا: للتطبيقات الكبيرة والأنظمة
• سي++: للألعاب والبرامج القوية
• سوفت: لتطبيقات الموبايل

📈 إذا بدك تتعلم برمجة:
1. ابدأ بلغة سهلة زي بايثون
2. تعلم الأساسيات المهمة (المتغيرات، الشروط، الحلقات)
3. طبق على مشاريع صغيرة
4. انضم لمجموعات المبرمجين
5. لا تستسع

البرمجة مش صعبة كتير إذا بدك إياها بجد! بتحتاج صبر وممارسة بس. بالتوفيق! 🚀`
                ];
                reply = programmingResponses[Math.floor(Math.random() * programmingResponses.length)];
                break;

            case "science":
                const scienceResponses = [
                    `🔬 الرياضيات والفيزياء - عجائب العلم:
الرياضيات هي لغة الكون، والفيزياء هي فهم قوانين الطبيعة. هذان المجالان مرتبطان ارتباطاً وثيقاً ويساعداننا على فهم العالم من حولنا.

📐 أهم مفاهيم الرياضيات:
• الجبر: التعامل مع المعادلات والمتغيرات
• الهندسة: دراسة الأشكال والأبعاد
• الإحصاء: تحليل البيانات والاستنتاجات
• التفاضل والتكامل: دراسة التغير والتراكم

⚛️ أهم نظريات الفيزياء:
• النسبية لأينشتاين: مفهوم الزمكان والجاذبية
• ميكانيكا الكم: سلوك الجسيمات الصغيرة جداً
• الديناميكا الحرارية: الحرارة والطاقة
• الكهرومغناطيسية: العلاقة بين الكهرباء والمغناطيسية

🧠 نصيحة لطلاب العلوم:
الرياضيات والفيزياء تتطلب ممارسة مستمرة. حل المسائل بانتظام هو أفضل طريقة لتطوير الفهم العميق! 💡✨`,

                    `🧮 بالعربي الفلسطيني - الرياضيات والفيزياء ببساطة:
الرياضيات مش بس أرقام وحساب، هي طريقة تفكير ومنطق. والفيزياء بتشرح لنا إيش اللي بيصير حولينا في الكون.

📈 أهم فروع الرياضيات:
• الجبر: بيتعلم نحل معادلات
• حساب المثلثات: بيتعلم عن الزوايا والأبعاد
• الإحصاء: بيتعلم نحلل بيانات
• حساب التفاضل والتكامل: بيتعلم عن التغيرات

⚡ أهم فروع الفيزياء:
• الميكانيكا: بيتكلم عن الحركة والقوى
• الكهرباء والمغناطيس: بيتكلم عن الشحنات والمجالات
• الحرارة: بيتكلم عن الطاقة الحرارية
• الضوء: بيتكلم عن موجات الضوء والرؤية

💡 إذا بدك تتفوق:
1. حاول تفهم المفاهيم مش تحفظها بس
2. حل مسائل كتير
3. ربط العلم بحياتك اليومية
4. استخدم فيديوهات وتطبيقات تعليمية

العلم مش صعب إذا فهمت أساسياته! بالتوفيق! 🎓`
                ];
                reply = scienceResponses[Math.floor(Math.random() * scienceResponses.length)];
                break;

            case "about":
                const aboutResponses = [
                    `👨‍💻 عن مصطفى أمريش:
مصطفى أمريش هو مطور فلسطيني متخصص في تطوير الويب والأمن السبراني. يتميز بشغفه الكبير بالتكنولوجيا وحرصه على تطوير مهاراته باستمرار.

🌟 مهاراته الرئيسية:
• تطوير الواجهات الأمامية والخلفية
• الأمن السبراني وحماية الأنظمة
• تصميم تجارب المستخدم التفاعلية
• تطوير الألعاب التعليمية

🎯 أهدافه:
تطوير حلول تقنية مبتكرة تساعد الناس وتسهل حياتهم، بالإضافة إلى نشر الوعي في مجال الأمن السبراني في فلسطين والعالم العربي.

💡 فلسفته:
"التكنولوجيا يجب أن تكون في خدمة الإنسان، والعلم يجب أن يشارك به الجميع"`,

                    `🏠 عن الموقع:
موقع مصطفى أمريش هو منصة شخصية تهدف إلى:
• عرض المشاريع والأعمال التقنية
• مشاركة المعرفة في مجال البرمجة والأمن
• تقديم أدوات تفاعلية مفيدة
• توفير ألعاب تعليمية مسلية

✨ مميزات الموقع:
• تصميم عصري وسهل الاستخدام
• محتوى تعليمي متنوع
• أدوات تفاعلية عملية
• ألعاب تعليمية ممتعة

🤝 هدف الموقع:
أن يكون مصدر إلهام للشباب الفلسطيني والعربي في مجال التكنولوجيا، وإثبات أن الفلسطينيين قادرون على المنافسة عالمياً في هذا المجال!`,

                    `🇵🇸 بالعربي الفلسطيني - عن مصطفى والموقع:
مصطفى أمريش شاب فلسطيني بحب التكنولوجيا وبرمجة الكمبيوتر. من فلسطين، بيعمل على مشاريع كتير حلوة وبيحب يشارك علومه مع الناس.

💻 شغفه:
• برمجة وتطوير مواقع
• أمن الحاسوب والشبكات
• تصميم ألعاب تعليمية
• مساعدة الناس تتعلم التكنولوجيا

🌐 الموقع بتاعه:
هو موقع شخصي بيجمع فيه كل شغلاته الحلوة:
• مشاريعه البرمجية
• أدوات مفيدة للناس
• ألعاب تعليمية مسلية
• معلومات عن الأمن السبراني

🎯 هدفه:
يورّث علمه للناس ويساعد شباب فلسطين يتعلموا برمجة وأمن الكمبيوتر. بيؤمن إن الشباب الفلسطيني عندهم قدرة عالية ويقدروا يصيروا من أحسن المبرمجين في العالم! 🚀`
                ];
                reply = aboutResponses[Math.floor(Math.random() * aboutResponses.length)];
                break;

            case "motivation":
                const motivationResponses = [
                    `🌟 كلمات تحفيزية للنمو والتطور:
"النجاح ليس نهاية الطريق، والفشل ليس قاضياً عليك، بل الشجاعة في الاستمرار هي ما يهم." - ونستون تشرشل

💪 نصائح للتطور الشخصي:
1. حدد أهدافاً واضحة وقابلة للقياس
2. تعلم شيئاً جديداً كل يوم
3. حافظ على صحتك الجسدية والنفسية
4. اقبل التحديات كفرص للنمو
5. احتفل بإنجازاتك الصغيرة

🎯 في مجال التكنولوجيا:
• ابدأ بالأساسيات وقوِها جيداً
• لا تخف من التجربة والخطأ
• انضم لمجتمعات المطورين
• ابنِ مشاريع تعكس مهاراتك
• كن فضولياً ولا تتوقف عن التعلم

تذكر: كل خبير كان يوماً مبتدئاً! 🚀✨`,

                    `🔥 رسالة تشجيعية:
أنت أقوى مما تعتقد، وأكثر قدرة مما تتخيل. كل عظيم بدأ من الصفر، وكل نجاح بدأ بخطوة أولى.

💡 في طريق تعلم البرمجة والأمن السبراني:
• الصبر مفتاح النجاح
• الممارسة أهم من النظرية
• المجتمعات الداعمة تساعدك كثيراً
• لا تقارن نفسك بالآخرين
• احتفل بتقدمك حتى لو كان صغيراً

🌱 للنمو الشخصي:
• اقرأ كتباً في مجالك
• استمع لقصص نجاح الآخرين
• حافظ على توازن حياتك
• نمِّ مهارات التواصل
• تذكر دائماً "لماذا" بدأت

أنت قادر على تحقيق أهدافك! استمر في المضي قدماً! 💪🎯`,

                    `🇵🇸 بالعربي الفلسطيني - كلمات تشجيعية:
"إذا عجبك حالك، ركز في هدفك وبس". هاد المثل بيقولنا إذا بدك توصل لحاجة، لازم تركز فيها وتعمل كل اللي يلزم عشان توصلها.

🚀 إذا بدك تتعلم برمجة أو أمن سبراني:
1. ابدأ خطوة خطوة، مش لازم تتعلم كل شي دفعة واحدة
2. لا تخاف من الغلط، الغلط بيعلمنا
3. ابحث عن ناس بتشغف زي ما إنت
4. اعمل مشاريع صغيرة وبعدين كبرها
5. لا تقارن حالك مع غيرك، كل واحد في طريقه

💪 لتطوير نفسك:
• قرأ كتب ومقالات في مجالك
• شارك في دورات وورش عمل
• حافظ على صحتك، العقل السليم في الجسم السليم
• لا تنسى تأخذ راحتك، الإرهاق بوقف الإبداع

أنت قادر! بس صدق بنفسك واستمر! 🌟`
                ];
                reply = motivationResponses[Math.floor(Math.random() * motivationResponses.length)];
                break;

            default:
                reply = "أهلاً وسهلاً! أنا المساعد الذكي لمصطفى أمريش 😊 كيف يمكنني مساعدتك اليوم؟";
                break;
        }

        res.json({ reply });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({
            reply: "عذراً، حدث خطأ في الخادم. يرجى المحاولة مرة أخرى! 😅"
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
