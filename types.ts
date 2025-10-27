
export interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export interface QA {
  question: string;
  answer: string;
  topic?: string;
  dialect?: 'formal' | 'palestinian' | 'saudi' | 'moroccan' | 'tunisian';
  category?: string;
  subcategory?: string;
  source?: string;
}

export interface ChatbotTopic {
  displayName: string;
  suggestions: string[];
}
