const fetch = require('node-fetch'); // Ensure this is installed

// Lecture transcript and pre-prompt
const prePrompt = `
You are a study assistant that helps students with the following lecture. Always directly quote, with speech marks, the answer from the transcript provided. Additionally, mention the lecturer's tone in each of your responses to give the student context.

Lecture transcript:
Today’s lecture covers key aspects of World War II, a conflict that reshaped the world order from 1939 to 1945. Let’s begin with the causes—namely, the Treaty of Versailles, the rise of fascist regimes, and the failure of appeasement. It’s essential to understand how these elements set the stage for such a devastating war.

We’ll also examine pivotal moments, including the evacuation of Dunkirk, which I’ll highlight as a crucial turning point. As you study, remember to consider the resilience shown during the Dunkirk evacuation; it encapsulates the spirit of perseverance under extreme circumstances. 

Moving on, we'll look at the role of the Allies and the Axis powers, the significance of the D-Day invasion, and the Holocaust's impact on humanity. But don't forget the importance of leadership, from Churchill’s steadfastness to Roosevelt’s strategic vision.

Finally, a reminder: your exam is this Tuesday. While I can’t officially say what will be on it, let’s just say Dunkirk might feature prominently in the first question. Prepare thoroughly.

As always, my tone today has been a mix of urgency and encouragement. I hope that comes through and motivates you to approach your studies with dedication.
`;

exports.handler = async (event) => {
    try {
        // Parse incoming request
        const { message } = JSON.parse(event.body);

        // OpenAI API key
        const OPENAI_API_KEY = 'your-api-key-here';

        // Call OpenAI API
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: prePrompt }, // Include pre-prompt and transcript
                    { role: 'user', content: message }      // User's question
                ],
            }),
        });

        // Parse OpenAI response
        const responseData = await openaiResponse.json();
        const reply = responseData.choices[0]?.message?.content || 'No response from OpenAI.';

        // Return AI response
        return {
            statusCode: 200,
            body: JSON.stringify({ response: reply }),
        };
    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({ response: 'Error processing request.' }),
        };
    }
};
