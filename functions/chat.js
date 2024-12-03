const { OpenAI } = require('openai');

// Lecture transcript as a constant
const lectureTranscript = `Today's lecture covers key aspects of World War II, a conflict that reshaped the world order from 1939 to 1945. Let's begin with the causes—namely, the Treaty of Versailles, the rise of fascist regimes, and the failure of appeasement. It's essential to understand how these elements set the stage for such a devastating war.
We'll also examine pivotal moments, including the evacuation of Dunkirk, which I'll highlight as a crucial turning point. As you study, remember to consider the resilience shown during the Dunkirk evacuation; it encapsulates the spirit of perseverance under extreme circumstances. 
Moving on, we'll look at the role of the Allies and the Axis powers, the significance of the D-Day invasion, and the Holocaust's impact on humanity. But don't forget the importance of leadership, from Churchill's steadfastness to Roosevelt's strategic vision.
Finally, a reminder: your exam is this Tuesday. While I can't officially say what will be on it, let's just say Dunkirk might feature prominently in the first question. Prepare thoroughly.
As always, my tone today has been a mix of urgency and encouragement. I hope that comes through and motivates you to approach your studies with dedication.`;

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
          content: `You are a study assistant that helps students with the following lecture. Always directly quote, with speech marks, the answer from the transcript provided. Additionally, mention the lecturer's tone in each of your responses to give the student context. When answering questions, first find the exact quote from the transcript that addresses the question, and then provide context about the lecturer's tone and delivery.

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