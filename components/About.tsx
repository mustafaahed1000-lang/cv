import React from 'react';
import Section from './Section';

const About: React.FC = () => {
    const subtitleText = "مطور متكامل وخبير في الأمن السيبراني، أجمع بين الإبداع التقني والحماية الرقمية لبناء حلول مبتكرة وآمنة.";
    const singleImageUrl = '/images/about-me.jpg'; // Static hacker image

    return (
        <Section id="about" title="نبذة عني" subtitle={subtitleText}>
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-center gap-10 md:gap-16">
                {/* Single Static Image */}
                <div className="md:w-1/3 w-2/3">
                    <div className="relative w-full rounded-lg shadow-2xl shadow-cyan-500/20">
                        <img
                            src={singleImageUrl}
                            alt="مصطفى أمريش"
                            className="w-full h-full object-cover rounded-lg"
                            style={{ aspectRatio: '1 / 1' }}
                        />
                    </div>
                </div>
                {/* About Text */}
                <div className="md:w-2/3 text-center md:text-right text-base md:text-lg text-gray-300 leading-relaxed">
                    <p className="mb-4">
                        مرحبًا! أنا مصطفى أمريش، مطور شغوف متخصص في بناء حلول رقمية مبتكرة وآمنة. بخبرة واسعة تمتد من تطوير واجهات الويب التفاعلية باستخدام React إلى بناء تطبيقات قوية من جانب الخادم باستخدام Node.js، أسعى دائمًا لتقديم تجارب مستخدم استثنائية.
                    </p>
                    <p className="mb-4">
                        أمتلك أيضًا خبرة في تطوير تطبيقات الهواتف المحمولة عبر منصة React Native، وأهتم بشكل كبير بمجال الذكاء الاصطناعي وتطبيقاته العملية باستخدام Python. أمان التطبيقات والأنظمة هو أحد أهم أولوياتي، وهو ما دفعني للتخصص في مجال الأمن السيبراني والهكر الأخلاقي لحماية البنى التحتية الرقمية.
                    </p>
                    <p>
                        هدفي هو تحويل الأفكار المعقدة إلى منتجات بسيطة، أنيقة، وفعالة. أنا دائم التعلم ومتحمس لمواجهة التحديات التقنية الجديدة والمساهمة في بناء مستقبل رقمي أفضل.
                    </p>
                </div>
            </div>
        </Section>
    );
};

export default About;