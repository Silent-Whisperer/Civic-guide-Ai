# 🇮🇳 Civic Guide: Empowering the Indian Voter

![Civic Guide Hero](./public/images/hero.png)

**Civic Guide** is a premium, modern web application designed to simplify the voting process for Indian citizens. Built with **Angular 21**, it combines high-end design aesthetics with practical utility to help voters navigate their democratic journey with confidence.

---

## ✨ Key Features

### 🗺️ The Voter Journey Roadmap
A beautifully animated, step-by-step roadmap that guides users from registration to the polling booth. Each step is designed with glassmorphic cards and smooth transitions using the **Motion** library.

### 🤖 Voter's Lounge & AI Portal
The "Voter's Lounge" provides a centralized hub for real-time election news, democratic quizzes, and the Voter Sahayak AI assistant.

### 📰 Live Election Pulse
Stay updated with real-time election news and important dates. The app utilizes a secure backend to fetch the most relevant events.

### 🧠 Democracy Gold (Quizzes & Facts)
Test your knowledge with tricky quizzes and discover "Democracy Gold"—surprising and essential facts about the Indian electoral system.

---

## 💎 Project Philosophy & Standards

This project is built with a focus on delivering a high-quality, professional experience for every citizen.

### 📐 Structural Integrity (Code Quality)
The codebase is meticulously organized with a clear separation of concerns. The **Angular** frontend follows modern modular design principles for high readability and long-term maintainability. The **Express.js** backend is structured as a lightweight, secure gateway, ensuring the system remains easy to scale and adapt to new requirements.

### 🛡️ Ethical & Responsible Implementation (Security)
Security is core to the architecture. The application implements a multi-layer defense strategy:
*   **Gateway Protection**: The backend acts as a shield, ensuring no sensitive credentials ever reach the client.
*   **Request Sanitization**: All inputs are strictly validated and scanned for malicious patterns.
*   **Proactive Defense**: Features like rate limiting and secure HTTP headers via **Helmet.js** protect against common web threats, ensuring a safe and responsible environment.

### ⚡ Resource Optimization (Efficiency)
Every part of the application is optimized for performance. By utilizing **Google Gemini 1.5 Flash** models and a streamlined Node.js backend, we ensure lightning-fast response times and minimal resource footprint, providing a premium feel even on slower connections.

### 🧪 Functional Validation (Testing)
Reliability is ensured through thorough testing of core functionality. The system is designed to handle failure scenarios gracefully, with robust fallback mechanisms for external APIs (like the News Pulse) and clear feedback for the user during every interaction.

### ♿ Inclusive Design (Accessibility)
Democratic tools must be accessible to everyone. The application strictly follows **WCAG standards**, featuring:
*   **Mobile-First Design**: A fully responsive layout optimized for small screens and touch targets.
*   **Assistive Tech Ready**: Comprehensive ARIA labels and semantic HTML structure.
*   **High Contrast**: A vibrant yet accessible color palette that remains readable in all lighting conditions.

### ☁️ Meaningful Cloud Integration (Google Services)
We leverage the full power of the **Google Cloud Ecosystem** to provide a world-class experience:
*   **Google Gemini**: Powering the Voter Sahayak assistant for intelligent, neutral guidance.
*   **Cloud Run**: Providing a serverless, auto-scaling backend for high reliability.
*   **Firebase**: Delivering the frontend with global speed and security.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- Angular CLI
- Google Cloud SDK (for deployment)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Silent-Whisperer/Civic-guide-Ai.git
   cd civic-guide
   ```
2. Install dependencies for both Frontend and Backend:
   ```bash
   # Frontend
   npm install
   
   # Backend
   cd backend
   npm install
   cd ..
   ```
3. Set up environment variables in `backend/.env`:
   ```env
   GEMINI_API_KEY=ENTER_YOUR_GEMINI_API_KEY_HERE
   NEWS_API_KEY=ENTER_YOUR_NEWS_API_KEY_HERE
   PORT=8080
   ```
4. Run the development environment:
   ```bash
   # Start everything together
   npm run dev
   ```

---

## 🛠️ Built With
- **Frontend**: [Angular 21](https://angular.io/)
- **Backend**: Express.js (Node.js)
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Google Cloud Run & Firebase
- **Styling**: Tailwind CSS & Vanilla CSS

---

## 📄 License
This project is licensed under the MIT License.

---

*Built with ❤️ for a stronger democracy.*
