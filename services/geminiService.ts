import axios from 'axios';

const API_URL = '/api/chat';

export const sendMessageToAI = async (message: string): Promise<string> => {
    try {
        const response = await axios.post(API_URL, { message });
        return response.data.reply;
    } catch (error) {
        console.error("Error sending message to local server:", error);
        return "عذرًا، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي. يرجى التأكد من أن الخادم يعمل والمحاولة مرة أخرى.";
    }
};
