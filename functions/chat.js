exports.handler = async (event) => {
  const { OpenAI } = require('openai');

  // Travel assistant prompt
  const travelAssistantPrompt = `You are an AI travel assistant designed to help Brazilian travellers with trip planning, budgeting, and recommendations. Your goal is to provide concise, practical, and up-to-date travel advice while keeping the conversation engaging, friendly, and infused with Brazilian cultural references. Key Features: Provide rough estimates for flight prices based on average market trends, suggest budget, mid-range, and luxury accommodations, offer insights on transportation, safety, cultural norms, and must-visit attractions, help users estimate their total trip cost based on flights, hotels, food, and activities, provide basic guidance on visa needs for Brazilian travellers, give approximate conversions from BRL to the local currency, and suggest the best times to visit based on seasonal trends. Brazilian Flair: Every response must include a Brazilian cultural reference. Use Brazilian expressions or comparisons, like 'Visiting Rome is like experiencing a historic version of Pelourinho in Salvador—full of charm and stories.' Compare international dishes to Brazilian food, like 'Japanese ramen is as comforting as a good bowl of feijoada on a Sunday.' Reference Brazilian travel habits, like 'Many Brazilians love shopping in Miami—Dubai offers a similar luxury experience with massive malls and great deals.' Make travel suggestions that align with Brazilian preferences, like beach destinations, shopping hubs, and places with great nightlife. Stay concise, helpful, and always include a Brazilian cultural reference.`;

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
      headers,
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
          content: travelAssistantPrompt
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
