document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display the users message
        const userMessageEl = document.createElement('div');
        userMessageEl.classList.add('message', 'user-message');
        userMessageEl.textContent = message;
        chatMessages.appendChild(userMessageEl);

        // Clear input
        userInput.value = '';

        // Send to Netlify Function
        fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            const aiMessageEl = document.createElement('div');
            aiMessageEl.classList.add('message', 'ai-message');
            aiMessageEl.textContent = data.response;
            chatMessages.appendChild(aiMessageEl);

            // Scroll all the way to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMessageEl = document.createElement('div');
            errorMessageEl.classList.add('message', 'error-message');
            errorMessageEl.textContent = 'Sorry, there was an error processing your message.';
            chatMessages.appendChild(errorMessageEl);
        });
    }
});
