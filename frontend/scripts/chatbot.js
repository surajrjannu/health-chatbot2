document.getElementById("send-btn").addEventListener("click", async () => {
    const userInput = document.getElementById("chat-input").value.trim();
    if (!userInput) return;

    appendMessage("user", userInput);
    document.getElementById("chat-input").value = "";

    // Show a loading indicator
    appendMessage("bot", "Typing...");

    try {
        const response = await fetch("http://localhost:5501/api/chat", { // Updated port
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: userInput }),
        });
        const data = await response.json();

        // Update the bot's message
        updateLastMessage("bot", data.reply);
    } catch (error) {
        updateLastMessage("bot", "Sorry, I couldn't process your request.");
        console.error("Error:", error);
    }
});

function appendMessage(sender, text) {
    const chatContainer = document.getElementById("chat-container");
    const messageDiv = document.createElement("div");
    messageDiv.className = "mb-4";
    messageDiv.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="bi ${sender === "bot" ? "bi-robot text-blue-500" : "bi-person-circle text-gray-500"} text-2xl"></i>
            </div>
            <div class="ml-3 bg-${sender === "bot" ? "blue-50" : "gray-100"} rounded-lg p-4 max-w-[80%]">
                <p class="text-gray-800">${text}</p>
            </div>
        </div>
    `;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Auto-scroll
}

function updateLastMessage(sender, text) {
    const chatContainer = document.getElementById("chat-container");
    const lastMessage = chatContainer.querySelector(`.mb-4:last-child .bg-${sender === "bot" ? "blue-50" : "gray-100"}`);
    if (lastMessage) {
        lastMessage.innerHTML = `<p class="text-gray-800">${text}</p>`;
    }
}
