import { Injectable } from '@angular/core';

export interface NewsItem {
  title: string;
  description: string;
  date: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly BASE_URL = 'https://civic-guide-backend-988752352517.asia-south1.run.app'; // Update this if you deploy the backend somewhere else. For local testing use http://localhost:8080

  async getSimpleAnswer(question: string): Promise<string> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: question })
      });
      
      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      return data.reply || data.response || "I'm having a little trouble thinking right now. Please try again!";
    } catch (error) {
      console.error('Chat Error:', error);
      return "I'm having a little trouble thinking right now. 😅 Please check back in a moment!";
    }
  }

  async fetchLiveElectionNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/api/news`);
      if (!response.ok) throw new Error('News fetch failed');
      
      const data = await response.json();
      return data.news || [];
    } catch (error) {
      console.error('News Error:', error);
      return [];
    }
  }
}
