const { OpenAI } = require('openai');

// Lecture transcript as a constant
const lectureTranscript = `Good afternoon, everyone, and welcome to today’s lecture at Aston University. Our focus is on World War II, 
a defining conflict from 1939 to 1945 that reshaped global politics and society. Let’s begin by addressing the causes: the Treaty of 
Versailles, the economic and social upheaval it triggered, the rise of fascist regimes like those in Germany and Italy, and the failure 
of appeasement policies. Hint for your exam: Be ready to discuss how each of these factors interplayed to spark such a devastating war. 
From there, we’ll explore pivotal events, including the Dunkirk evacuation—a moment of extraordinary resilience despite overwhelming odds. 
Dunkirk serves as a case study in morale-boosting leadership, and you might find a question on it Tuesday. We’ll also cover D-Day, 
a triumph of coordination and sheer determination by the Allies, as well as the Holocaust, which remains a grim reminder of the war’s 
humanitarian impact and is vital to understanding the global push for post-war justice. Another potential exam focus: Pay close attention to 
leadership—Churchill’s resolve, Roosevelt’s strategic brilliance, and how they mobilized their nations during critical moments. As always, 
leadership comparisons make excellent essay material. Remember, Tuesday’s exam isn’t just about memorizing events but analyzing cause-and-effect 
relationships and identifying turning points. If you can connect these dots, you’ll excel. Any questions so far? 
[Student raises hand: 'Professor John, why is Dunkirk emphasized so much in history?'] That’s an excellent question! Dunkirk stands out not because it was a 
tactical victory but because it symbolized moral strength. The rescue of over 300,000 troops showcased remarkable resilience and unity under dire circumstances, 
inspiring the Allies to continue the fight. It’s a perfect example of a turning point, and yes, hint hint, it might feature prominently in the exam. Keep this in mind as you study.`;

exports.handler = async (event, context) => {
  // CORS headers to allow cross-origin requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the incoming message
    const { message } = JSON.parse(event.body);

    // Initialize OpenAI with API key from environment variables
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `You are a study assistant that helps students with the following lecture. Always directly quote, with speech marks, the answer from the transcript provided when relevant but give
          context as to why you feel the quote is relevant then provide the direct quote. Additionally, mention the lecturer's tone in each of your responses to give the student context. When answering questions, first find the exact quote from the transcript 
          that addresses the question, and then provide context about the lecturer's tone and delivery.

Lecture Transcript:
${lectureTranscript}`
        },
        { role: "user", content: message }
      ]
    });

    // Return the AI's response
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        response: response.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to process your request',
        details: error.message 
      })
    };
  }
};