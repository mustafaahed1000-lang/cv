
import React from 'react';
import Section from './Section';

const skills = [
    { name: 'تطوير الويب (React, Node.js)', icon: '💻' },
    { name: 'تطوير التطبيقات (React Native)', icon: '📱' },
    { name: 'الذكاء الاصطناعي (Python)', icon: '🤖' },
    { name: 'الأمن السيبراني', icon: '🛡️' },
    { name: 'قواعد البيانات (SQL, NoSQL)', icon: '🗃️' },
    { name: 'الحوسبة السحابية (AWS, Azure)', icon: '☁️' },
];

const Skills: React.FC = () => {
    return (
        <Section id="skills" title="مهاراتي" className="bg-gray-800 bg-opacity-50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {skills.map((skill, index) => (
                    <div 
                        key={index} 
                        className="bg-gray-900 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg hover:shadow-cyan-500/40 hover:border-cyan-400 transition-all duration-300 transform hover:-translate-y-2"
                    >
                        <div className="text-4xl sm:text-5xl mb-4">{skill.icon}</div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{skill.name}</h3>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Skills;
