const chat = document.getElementById("chat");
const userInput = document.getElementById("userInput");

// Create a simple message display
function displayMessage(msg, from = "bot") {
  const div = document.createElement("div");
  div.innerHTML = `<strong>${from === "bot" ? "🤖 OrderBot" : "🧍 You"}:</strong> ${msg}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

let generator;

// Initialize the model on page load
async function loadModel() {
  displayMessage("Loading AI model... please wait.");
  generator = await window.transformers.pipeline('text-generation', 'Xenova/distilgpt2');
  displayMessage("AI model loaded! Say hi to OrderBot. 🍕");
}
loadModel();

// Generate a response using the model
async function generateReply(prompt) {
  // Use a short max length for quick responses
  const output = await generator(prompt, { max_length: 50, do_sample: true });
  return output[0].generated_text.replace(prompt, '').trim();
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;
  displayMessage(message, "user");
  userInput.value = "";

  if (!generator) {
    displayMessage("Model is still loading, please wait...");
    return;
  }

  // Generate AI response
  const reply = await generateReply(message);
  displayMessage(reply || "Hmm... I don't know what to say yet.");
}
