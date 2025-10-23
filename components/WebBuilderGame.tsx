
import React, { useState } from 'react';

const components = [
    { id: 'header', name: 'Header - ترويسة' },
    { id: 'main', name: 'Main - محتوى' },
    { id: 'footer', name: 'Footer - تذييل' },
];

const WebBuilderGame: React.FC = () => {
    const [slots, setSlots] = useState<{ [key: string]: string | null }>({ header: null, main: null, footer: null });
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
        setDraggedItem(id);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, slotId: string) => {
        e.preventDefault();
        if (draggedItem) {
            setSlots(prev => ({ ...prev, [slotId]: draggedItem }));
            setDraggedItem(null);
        }
    };
    
    const isCorrect = slots.header === 'header' && slots.main === 'main' && slots.footer === 'footer';

    const getComponentById = (id: string | null) => components.find(c => c.id === id);

    return (
        <div className="text-white text-center p-2 sm:p-4">
            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-cyan-300">[ WEB BUILDER ]</h3>
            <p className="mb-6 text-base sm:text-lg">اسحب وأفلت المكونات في أماكنها الصحيحة لبناء صفحة ويب.</p>

            <div className="flex flex-col md:flex-row justify-around items-start gap-8">
                {/* Available Components */}
                <div className="w-full md:w-1/3">
                    <h4 className="font-bold mb-4 text-lg sm:text-xl">المكونات المتاحة</h4>
                    <div className="space-y-4">
                        {components.filter(c => !Object.values(slots).includes(c.id)).map(comp => (
                            <div
                                key={comp.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, comp.id)}
                                className="bg-cyan-600 p-4 rounded-md cursor-grab active:cursor-grabbing"
                            >
                                {comp.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Webpage Structure */}
                <div className="w-full md:w-2/3 border-2 border-dashed border-gray-600 rounded-lg p-4">
                    {Object.keys(slots).map(slotId => (
                        <div
                            key={slotId}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, slotId)}
                            className={`min-h-[80px] flex items-center justify-center m-2 rounded-md transition-colors ${slots[slotId] ? 'bg-gray-700' : 'bg-gray-800'}`}
                        >
                            {slots[slotId] ? 
                                <span className="p-4 bg-gray-600 rounded">{getComponentById(slots[slotId])?.name}</span> : 
                                <span className="text-gray-400 capitalize">{slotId}</span>
                            }
                        </div>
                    ))}
                </div>
            </div>
            {isCorrect && (
                <p className="mt-8 text-xl sm:text-2xl text-green-400 font-bold animate-pulse">
                    ممتاز! لقد بنيت الصفحة بنجاح!
                </p>
            )}
        </div>
    );
};

export default WebBuilderGame;
