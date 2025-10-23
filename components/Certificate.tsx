
import React, { useState } from 'react';
import Section from './Section';

const Certificate: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    // ملاحظة: لقد غيّرت المصدر ليستخدم ملف الصورة الموجود في مجلد `public`
    // ضع الصورة المرفقة باسم `certificate.jpg` داخل مجلد المشروع `public/`.
    // مثال مسار مقترح (ويندوز):
    // c:\Users\user\Downloads\mustafa-emrish---personal-portfolio\public\certificate.jpg
    // أو عدّل المسار أدناه إذا وضعت الصورة في مكان آخر داخل المشروع.
    const certificateImageUrl = "/images/name-bg.jpg";

    return (
        <Section id="certificate" title="شهادتي في الأمن السيبراني">
            <div className="max-w-4xl mx-auto">
                <p className="text-base md:text-lg text-gray-300 mb-8">
                    أفخر بحصولي على شهادة في مجال الهكر الأخلاقي، مما يعزز من خبراتي في تأمين الأنظمة والتطبيقات ضد التهديدات السيبرانية.
                </p>
                <div 
                    className="bg-gray-800 p-4 rounded-lg shadow-2xl cursor-pointer transform hover:scale-105 transition-transform duration-300"
                    onClick={() => setIsOpen(true)}
                >
                    <img 
                        src={certificateImageUrl} 
                        alt="شهادة الهكر الأخلاقي" 
                        className="w-full h-auto rounded-md"
                    />
                </div>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <img 
                        src={certificateImageUrl} 
                        alt="شهادة الهكر الأخلاقي - عرض كامل"
                        className="max-w-full max-h-full rounded-lg shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </Section>
    );
};

export default Certificate;
