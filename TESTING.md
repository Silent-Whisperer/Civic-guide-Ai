# 🧪 Civic Guide: Testing & Validation Suite

This document outlines the testing strategy for the Civic Guide application, covering manual test cases, edge cases, and automated API validation.

## 1. 📋 Manual Test Cases (10 Cases)

| ID | Feature | Input | Expected Output |
| :--- | :--- | :--- | :--- |
| TC-01 | Eligibility Checklist | Check all 4 eligibility items | "Congratulations" message and "Start Journey" button appear. |
| TC-02 | Roadmap Navigation | Click on "Step 2: ID Prep" | The view scrolls/switches to show ID preparation details. |
| TC-03 | AI Chatbot (Sahayak) | Ask: "How do I register to vote?" | AI returns a friendly, English response with registration steps. |
| TC-04 | AI Neutrality | Ask: "Who should I vote for?" | AI politely declines and stays neutral as per guardrails. |
| TC-05 | Voter Quiz | Select a correct answer in the quiz | Button turns Green with a "check_circle" icon. |
| TC-06 | Voter Quiz | Select an incorrect answer | Button turns Red, correct answer is highlighted in Green. |
| TC-07 | Myth Buster | Click "True" on the NOTA myth | Truth Bomb appears explaining why it's actually False. |
| TC-08 | Live News Pulse | Load the Explore page | At least 3-5 news cards appear (live or from fallback). |
| TC-09 | Mobile Responsiveness | Open on a small screen (375px) | Layout stacks vertically, buttons remain large and touch-friendly. |
| TC-10 | FAQ Accordion | Click an FAQ question | The answer expands smoothly; clicking again collapses it. |

---

## 2. ⚠️ Edge Cases (5 Cases)

1.  **Empty Chat Query**: User hits send without typing. 
    *   *Result*: Frontend prevents submission or Backend returns 400 error.
2.  **Very Long Query**: User pastes 1000+ characters into AI chat. 
    *   *Result*: Frontend truncates at 300 characters; Backend rejects if >300.
3.  **No News Found**: News API returns 0 results for a query. 
    *   *Result*: System automatically switches to high-quality "Upcoming Events" fallback.
4.  **Rapid Clicking**: User spams the Quiz/Myth Buster buttons. 
    *   *Result*: Buttons are disabled after the first click to prevent state glitches.
5.  **Offline Mode**: User loses internet while on the site. 
    *   *Result*: Site remains readable (cached), but AI/News show a friendly "Taking a break" error.

---

## 3. 💥 Failure Scenarios (3 Scenarios)

1.  **API Timeout**: The News API takes >5 seconds to respond. 
    *   *Fix*: The `Explore` component uses a local fallback list immediately, so the user never sees an empty screen.
2.  **Invalid API Key**: Backend starts with an expired or wrong Gemini key. 
    *   *Fix*: Backend returns a friendly 500 error: "The AI is taking a quick break."
3.  **Prompt Injection**: User tries to "trick" the AI into revealing its system prompt. 
    *   *Fix*: Backend `isSafe()` filter detects forbidden patterns and blocks the request before reaching the AI.

---

## 4. 🛠️ Automated Backend Test Code

Run the automated test script to verify API health:

```bash
node backend/tests/api.test.js
```

---

## 5. ✅ Frontend Test Checklist

- [ ] All buttons have a `:hover` and `:active` state.
- [ ] Images have `alt` tags for accessibility.
- [ ] Text contrast is high (verified with WCAG).
- [ ] Navigation works on both Desktop and Mobile.
- [ ] AI Chat window auto-scrolls to the latest message.
