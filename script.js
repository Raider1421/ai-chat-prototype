document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Replace with your actual OpenAI API key
    const OPENAI_API_KEY = 'your-openai-api-key';

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display user message
        const userMessageEl = document.createElement('div');
        userMessageEl.classList.add('message', 'user-message');
        userMessageEl.textContent = message;
        chatMessages.appendChild(userMessageEl);

        // Clear input
        userInput.value = '';

        // Send to OpenAI
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message}
                ]
            })
        })
        .then(response => response.json())
        .then(data => {
            const aiResponse = data.choices[0].message.content;
            const aiMessageEl = document.createElement('div');
            aiMessageEl.classList.add('message', 'ai-message');
            aiMessageEl.textContent = aiResponse;
            chatMessages.appendChild(aiMessageEl);

            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});