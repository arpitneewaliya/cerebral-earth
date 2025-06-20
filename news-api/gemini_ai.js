const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function gemini_summary(prompt) {
  try {
    const result = await model.generateContent('Fetch the image url from these news articles: ' + prompt);
    const response = await result.response;
    const text = await response.text(); // Make sure to await the response
    console.log("GEMINI TEXT" + text)
    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

async function get_gemini_response(promt) {
  try {
    const result = await model.generateContent(promt);
    const response = await result.response;
    const text = await response.text(); // Make sure to await the response
    console.log("GEMINI TEXT" + text)
    return text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

module.exports = { gemini_summary, get_gemini_response };
