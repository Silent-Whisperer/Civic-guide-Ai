import { ChangeDetectionStrategy, Component, signal, computed, inject, ElementRef, viewChild, effect, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AiService } from '../services/ai';
import { animate, stagger } from "motion";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
  details: string[];
  link?: { text: string; url: string };
  color: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, FormsModule],
  templateUrl: './home.html',
})
export class Home {
  private aiService = inject(AiService);
  private platformId = inject(PLATFORM_ID);
  
  steps = signal<Step[]>([
    {
      id: 1,
      title: 'Why Vote in India?',
      description: 'In India, your vote is your power to help choose the government.',
      icon: 'priority_high',
      color: 'bg-orange-100 border-orange-200 text-orange-800',
      details: [
        'The Indian Constitution gives every citizen the right to vote.',
        'Voting ensures your needs (like water, roads, and electricity) are heard.',
        'It is your duty and right to choose your leader.'
      ],
      link: { text: 'About Indian Elections', url: 'https://eci.gov.in/elections/elections-in-india/' }
    },
    {
      id: 2,
      title: 'Am I Eligible?',
      description: 'Under the Indian Constitution, almost everyone can vote!',
      icon: 'person_search',
      color: 'bg-blue-100 border-blue-200 text-blue-800',
      details: [
        'You must be a Citizen of India.',
        'You must be at least 18 years old.',
        'You must have your name in the Voter List (Electoral Roll).'
      ],
      link: { text: 'Check Your Name on List', url: 'https://voters.eci.gov.in/' }
    },
    {
      id: 3,
      title: 'Get Your Voter ID',
      description: 'You need an EPIC card (Voter ID) or another valid ID to vote.',
      icon: 'badge',
      color: 'bg-purple-100 border-purple-200 text-purple-800',
      details: [
        'Apply for your Voter ID card online if you don\'t have one.',
        'If you don\'t have the card yet, you can still vote if your name is on the list.',
        'Carry an Aadhaar card or another official ID just in case.'
      ],
      link: { text: 'Get Your Voter ID', url: 'https://voters.eci.gov.in/registration/form6' }
    },
    {
      id: 4,
      title: 'Find Your Booth',
      description: 'Know exactly where to go on election day.',
      icon: 'location_on',
      color: 'bg-green-100 border-green-200 text-green-800',
      details: [
        'Find your Polling Station (the booth) near your home.',
        'Check the date for your specific city or area.',
        'Follow the white or blue signs for your ward.'
      ],
      link: { text: 'Find Your Polling Station', url: 'https://electorallookup.eci.gov.in/' }
    },
    {
      id: 5,
      title: 'The Voting Process',
      description: 'Go in, get the ink, and press the button!',
      icon: 'touch_app',
      color: 'bg-red-100 border-red-200 text-red-800',
      details: [
        'The officer will check your name and put blue ink on your left finger.',
        'Go to the EVM machine and press the blue button next to your choice.',
        'Listen for the "Beep" and see the slip in the VVPAT window for 7 seconds.'
      ],
      link: { text: 'How to Vote (Guide)', url: 'https://eci.gov.in/voter/voter-guide/' }
    }
  ]);

  currentStepIndex = signal(0);
  currentStep = () => this.steps()[this.currentStepIndex()];
  
  // Chat state
  userQuestion = signal('');
  chatHistory = signal<{ role: 'user' | 'assistant'; content: string }[]>([]);
  isTyping = signal(false);

  // Checklist state
  checkCitizen = signal(false);
  checkAge = signal(false);
  checkAddress = signal(false);
  isEligible = computed(() => this.checkCitizen() && this.checkAge() && this.checkAddress());

  roadmapContent = viewChild<ElementRef>('roadmapContent');
  
  scrollToRoadmap() {
    this.roadmapContent()?.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  scrollToChat() {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  constructor() {
    effect(() => {
      this.animateStepChange();
    });
  }

  animateStepChange() {
    if (!isPlatformBrowser(this.platformId)) return;
    
    // Track dependency so effect re-runs on step change
    this.currentStepIndex(); 
    
    const el = this.roadmapContent()?.nativeElement;
    if (!el) return;

    const items = el.querySelectorAll('.animate-item');
    if (items.length > 0) {
      // First, reset their state to avoid flickering before animation starts properly in the next frame
      animate(items, { opacity: 0, transform: 'translateY(10px)' }, { duration: 0 });

      // We use a small delay to ensure the DOM has fully updated with new text before animating
      setTimeout(() => {
        animate(
          items,
          { 
            opacity: [0, 1], 
            y: [20, 0],
            scale: [0.98, 1],
          },
          { 
            delay: stagger(0.06),
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1] 
          }
        );
      }, 10);
    }
  }

  nextStep() {
    if (this.currentStepIndex() < this.steps().length - 1) {
      this.currentStepIndex.set(this.currentStepIndex() + 1);
    }
  }

  prevStep() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.set(this.currentStepIndex() - 1);
    }
  }

  setStep(index: number) {
    this.currentStepIndex.set(index);
  }

  async askAi() {
    const question = this.userQuestion().trim();
    if (!question) return;

    this.chatHistory.update(h => [...h, { role: 'user', content: question }]);
    this.userQuestion.set('');
    this.isTyping.set(true);

    const answer = await this.aiService.getSimpleAnswer(question);
    
    this.chatHistory.update(h => [...h, { role: 'assistant', content: answer }]);
    this.isTyping.set(false);
  }

  quickAsk(text: string) {
    this.userQuestion.set(text);
    this.askAi();
  }
}
