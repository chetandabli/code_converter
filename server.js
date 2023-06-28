const express = require('express');
require("dotenv").config();
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

const { Configuration, OpenAIApi } = require("openai");

async function generateCompletion(language, code) {
  try {
    const prompt = `Convert the following code:-  ${language} to:\n${code} code`;
    const maxTokens = 500;
    const n = 1;

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
    
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: maxTokens,
        n: n
      });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion
    } else {
      return false
    }
  } catch (error) {
    console.error('Error:', error);
  }
}


// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Handle incoming requests to the /joke route
app.post('/convert', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    let response = await generateCompletion(code, language);
    // const joke = response.data.choices[0].text.trim();
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
