document.addEventListener('DOMContentLoaded', () => {
    const pptxUpload = document.getElementById('pptxUpload');
    const pptxStatus = document.getElementById('pptxStatus');
    const sendBtn = document.getElementById('sendButton');
    const userInput = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');

    let presentationContext = '';

    // Splash Screen Logic
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        const chatContainer = document.querySelector('.chat-container');
        
        splashScreen.classList.add('hidden');
        chatContainer.style.opacity = '1';
        chatContainer.classList.remove('hidden');
    }, 1000);

    // PowerPoint Upload Handler
    pptxUpload.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        pptxStatus.textContent = 'Processing PowerPoint...';

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const arrayBuffer = e.target.result;
                
                // Use pptxgen to parse the PowerPoint
                const pptx = new PptxGen();
                pptx.load(arrayBuffer);

                // Extract text from slides
                presentationContext = pptx.slides.map((slide, index) => {
                    // Extract text from each slide
                    const slideText = slide.data.reduce((text, element) => {
                        if (element.text) {
                            text += element.text + ' ';
                        }
                        return text;
                    }, '');

                    return `Slide ${index + 1}: ${slideText.trim()}`;
                }).join('\n\n');

                pptxStatus.textContent = `Uploaded: ${file.name} (${pptx.slides.length} slides)`;
                appendMessage('System', `PowerPoint uploaded successfully. You can now ask questions about the presentation.`);
            };
            
            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('PowerPoint processing error:', error);
            pptxStatus.textContent = 'Error processing PowerPoint';
            appendMessage('System', 'Failed to process the PowerPoint file.');
        }
    });

    // Send Message Function
    function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Display user message
        appendMessage('You', message);

        // Clear input
        userInput.value = '';

        // Prepare message with PowerPoint context
        const fullMessage = presentationContext 
            ? `Context from uploaded PowerPoint:\n${presentationContext}\n\nUser Question: ${message}`
            : message;

        // Send to Netlify Function
        fetch('/.netlify/functions/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: fullMessage })
        })
        .then(response => response.json())
        .then(data => {
            // Display AI message with typewriter effect
            appendMessage('Igloo AI', data.response);
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('Igloo AI', 'Sorry, there was an error processing your request.');
        });
    }

    // Append Message Function with Typewriter Effect
    function appendMessage(sender, message) {
        const p = document.createElement('p');
        const chatWindow = document.getElementById('chatWindow');
        p.innerHTML = `<strong>${sender}:</strong> <span class="typewriter"></span>`;
        chatWindow.appendChild(p);

        // Typewriter effect
        const typewriter = p.querySelector('.typewriter');
        let index = 0;

        function type() {
            if (index < message.length) {
                typewriter.innerHTML += message.charAt(index);
                index++;
                setTimeout(type, 20); // Adjust typing speed here
            }
        }
        type();

        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
});