import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AiService, NewsItem } from '../services/ai';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './explore.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Explore implements OnInit {
  private ai = inject(AiService);
  
  liveNews = signal<NewsItem[]>([]);
  
  facts = [
    { icon: 'public', text: "90 Crore+ voters! India is the biggest democracy on Earth." },
    { icon: 'terrain', text: "In Gir forest, there's a booth kept alive for just ONE voter." },
    { icon: 'touch_app', text: "The magic purple ink stays on your skin for 15+ days!" },
    { icon: 'event', text: "First ever elections in 1951 took 4 months to finish." },
    { icon: 'person', text: "You can vote at 18 now, but it used to be 21 before 1988!" },
    { icon: 'bolt', text: "EVMs run on batteries, so they work even if there's no power!" }
  ];

  quizQuestions = signal([
    {
      question: "What is the maximum number of electors generally allowed per polling station by the ECI?",
      options: ["1,000", "1,500", "2,000"],
      correct: 1,
      answered: signal<number | null>(null)
    },
    {
      question: "Under which Article of the Constitution is the Election Commission of India established?",
      options: ["Article 324", "Article 326", "Article 356"],
      correct: 0,
      answered: signal<number | null>(null)
    },
    {
      question: "In which year and state was the VVPAT system first used in an election?",
      options: ["2011 Kerala", "2013 Nagaland", "2014 Goa"],
      correct: 1,
      answered: signal<number | null>(null)
    }
  ]);

  allAnswered = () => this.quizQuestions().every(q => q.answered() !== null);

  ngOnInit() {
    this.refreshNews();
  }

  async refreshNews() {
    // Show upcoming events immediately as a fallback if API is slow or fails
    const fallbackEvents = [
      { date: 'Upcoming', title: 'National Voter Registration Drive', description: 'ECI announces a month-long drive to register new 18-year-old voters across all districts.', type: 'Event' },
      { date: 'Upcoming', title: 'EVM Awareness Camp', description: 'Interactive demonstrations of EVM and VVPAT machines to be held in major community halls.', type: 'Event' },
      { date: 'Notice', title: 'Deadline for Address Change', description: 'Voters are requested to update their permanent addresses on the electoral roll by the end of the month.', type: 'Reminder' }
    ];
    this.liveNews.set(fallbackEvents);

    try {
      const news = await this.ai.fetchLiveElectionNews();
      if (news && Array.isArray(news) && news.length > 0) {
        this.liveNews.set(news);
      }
    } catch (error) {
      console.warn("API slow or unavailable. Showing fallback events.");
    }
  }

  answerQuiz(questionIndex: number, optionIndex: number) {
    if (this.quizQuestions()[questionIndex].answered() === null) {
      this.quizQuestions()[questionIndex].answered.set(optionIndex);
    }
  }

  resetQuiz() {
    this.quizQuestions().forEach(q => q.answered.set(null));
  }

  // Interactive Myth Buster Puzzle
  mythBuster = signal({
    statement: "If NOTA (None of the Above) gets the highest number of votes in a constituency, a re-election is held with new candidates.",
    options: ["True, NOTA forces a re-election", "False, the runner-up wins"],
    correct: 1,
    answered: signal<number | null>(null),
    explanation: "False! This is a very common myth. While NOTA allows you to formally express dissatisfaction, it has NO legal power to force a re-election. Even if NOTA gets 99% of the votes, the candidate with the next highest votes is declared the winner."
  });
  
  answerMyth(index: number) {
    if (this.mythBuster().answered() === null) {
      this.mythBuster().answered.set(index);
    }
  }
}
