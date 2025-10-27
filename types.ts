
export interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export interface QA {
  question: string;
  answer: string;
  dialect?: 'formal' | 'palestinian' | 'saudi' | 'moroccan' | 'tunisian';
  category?: string;
  subcategory?: string;
  source?: string;
}
