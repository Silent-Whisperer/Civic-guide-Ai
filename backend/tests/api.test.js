import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = 'http://localhost:8080'; // Change this to your live URL if needed

async function runTests() {
  console.log('🚀 Starting API Validation Tests...\n');

  // 1. Health Check
  try {
    const res = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health Check: PASS', res.data);
  } catch (err) {
    console.error('❌ Health Check: FAIL', err.message);
  }

  // 2. Chat API (Validation - empty query)
  try {
    await axios.post(`${BASE_URL}/api/chat`, { query: '' });
    console.error('❌ Chat Validation (Empty): FAIL (Should have returned 400)');
  } catch (err) {
    if (err.response?.status === 400) {
      console.log('✅ Chat Validation (Empty): PASS (Correctly blocked)');
    } else {
      console.error('❌ Chat Validation (Empty): FAIL', err.message);
    }
  }

  // 3. Chat API (Validation - too long)
  try {
    const longQuery = 'a'.repeat(301);
    await axios.post(`${BASE_URL}/api/chat`, { query: longQuery });
    console.error('❌ Chat Validation (Long): FAIL (Should have returned 400)');
  } catch (err) {
    if (err.response?.status === 400) {
      console.log('✅ Chat Validation (Long): PASS (Correctly blocked)');
    } else {
      console.error('❌ Chat Validation (Long): FAIL', err.message);
    }
  }

  // 4. News API
  try {
    const res = await axios.get(`${BASE_URL}/api/news`);
    if (res.data.news && Array.isArray(res.data.news)) {
      console.log('✅ News API: PASS (Found', res.data.news.length, 'articles)');
    } else {
      console.error('❌ News API: FAIL (Invalid format)');
    }
  } catch (err) {
    console.error('❌ News API: FAIL', err.message);
  }

  console.log('\n🏁 Tests complete!');
}

runTests();
