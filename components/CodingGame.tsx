
import React, { useState } from 'react';

const questions = [
    {
        question: 'ما هي النتيجة النهائية لـ `console.log(1 + "2" + 3)`؟',
        options: ['6', '"123"', '"33"', 'Error'],
        answer: '"123"',
    },
    {
        question: 'أي من التالي ليس نوع بيانات أساسي في JavaScript؟',
        options: ['String', 'Number', 'Array', 'Boolean'],
        answer: 'Array',
    },
    {
        question: 'ما هي الدالة المستخدمة في React لتعريف الحالة في المكونات الوظيفية؟',
        options: ['useState', 'useEffect', 'useContext', 'this.state'],
        answer: 'useState',
    },
];

const CodingGame: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleAnswer = (option: string) => {
        if (feedback) return;

        if (option === questions[currentQuestion].answer) {
            setScore(score + 1);
            setFeedback('إجابة صحيحة!');
        } else {
            setFeedback(`إجابة خاطئة. الصحيحة هي: ${questions[currentQuestion].answer}`);
        }

        setTimeout(() => {
            setFeedback('');
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
            } else {
                setShowResult(true);
            }
        }, 2000);
    };
    
    const restartGame = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
        setFeedback('');
    };

    return (
        <div className="text-white text-center p-2 sm:p-4">
             <h3 className="text-xl sm:text-2xl font-bold mb-4 text-cyan-300">[ CODING QUIZ ]</h3>
            {showResult ? (
                <div>
                    <h4 className="text-2xl sm:text-3xl mb-4">انتهى الاختبار!</h4>
                    <p className="text-lg sm:text-xl mb-6">نتيجتك هي {score} من {questions.length}</p>
                    <button onClick={restartGame} className="bg-cyan-500 text-white px-6 py-2 rounded-md hover:bg-cyan-400 transition-colors">
                        إعادة اللعب
                    </button>
                </div>
            ) : (
                <div>
                    <p className="text-lg sm:text-xl mb-6 min-h-[6rem]">{questions[currentQuestion].question}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                disabled={!!feedback}
                                className="bg-gray-800 p-4 rounded-md text-base sm:text-lg hover:bg-cyan-600 transition-colors duration-200 disabled:opacity-50"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {feedback && <p className="mt-6 text-lg sm:text-xl">{feedback}</p>}
                </div>
            )}
        </div>
    );
};

export default CodingGame;
