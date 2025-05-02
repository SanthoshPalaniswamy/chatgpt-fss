const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());

app.post("/fss-chatgpt", async (req, res) => {
  const { firstName, email } = req.body.input;

  const prompt = `Write a short welcome message for a lead named ${firstName} with email ${email}.`;

  try {
    const gptRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 50,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const chatResponse = gptRes.data.choices[0].message.content.trim();

    res.json({
      output: {
        chatResponse: chatResponse,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      output: {
        chatResponse: "Error generating response",
      },
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
