// script.js
// Load this with <script type="module" src="script.js"></script> in your HTML

import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@1.1.1/dist/transformers.min.js';



const systemPrompt = `
You are OrderBot, an automated service to collect orders for a pizza restaurant. 
You first greet the customer, then collects the order, 
and then asks if it's a pickup or delivery. 
You wait to collect the entire order, then summarize it and check for a final 
time if the customer wants to add anything else. 
If it's a delivery, you ask for an address. 
Finally you collect the payment.
Make sure to clarify all options, extras and sizes to uniquely 
identify the item from the menu.
You respond in a short, very conversational friendly style.
The menu includes 
pepperoni pizza  12.95, 10.00, 7.00 
cheese pizza   10.95, 9.25, 6.50 
eggplant pizza   11.95, 9.75, 6.75 
fries 4.50, 3.50 
greek salad 7.25 
Toppings: 
extra cheese 2.00, 
mushrooms 1.50 
sausage 3.00 
canadian bacon 3.50 
AI sauce 1.50 
peppers 1.00 
Drinks: 
coke 3.00, 2.00, 1.00 
sprite 3.00, 2.00, 1.00 
bottled water 5.00 
`;

// Initialize chat history with system prompt
let chatHistory = [
  { role: 'system', content: systemPrompt }
];

// Initialize pipeline variable globally
let conversational;

async function init() {
  try {
    // Load conversational pipeline from transformers.js
    conversational = await pipeline('conversational');
    console.log('Model loaded!');

    // Start chat with greeting
    const greeting = await askBot("Hi");
    console.log("Bot:", greeting);
    
    // Here you can connect your UI input box to the function sendMessage below
    
  } catch (err) {
    console.error('Error loading model:', err);
  }
}

// Function to send a message and get a reply from the bot
async function askBot(userMessage) {
  // Add user message to history
  chatHistory.push({ role: 'user', content: userMessage });

  // Prepare combined prompt text for the model — you might need to format this based on your model
  const promptText = chatHistory.map(m => `${m.role}: ${m.content}`).join('\n');

  try {
    // Call the model's conversational pipeline
    const response = await conversational(promptText);

    // The model output might be inside response.generated_text or similar — adjust if needed
    const botReply = response.generated_text || response.text || response;

    // Add bot reply to history
    chatHistory.push({ role: 'assistant', content: botReply });

    return botReply;
  } catch (err) {
    console.error('Error during model conversation:', err);
    return "Sorry, something went wrong.";
  }
}

// Example usage in console:
// (async () => {
//   await init();
//   const reply1 = await askBot("I want a medium eggplant pizza with no toppings.");
//   console.log("Bot:", reply1);
// })();

// Call init to load model when script runs
init();

// Export askBot if you want to call it from your UI event handlers
export { askBot };
