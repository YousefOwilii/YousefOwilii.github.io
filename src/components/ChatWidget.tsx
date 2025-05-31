import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Configuration - You'll need to add your OpenRouter API key and model ID here
const OPENROUTER_API_KEY = "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"; // Replace with your OpenRouter API key
const OPENROUTER_MODEL_ID = "deepseek/deepseek-r1-0528:free"; // Replace with your chosen model ID
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Mock responses for fallback when API doesn't work
const MOCK_RESPONSES = [
  "I'm just an AI, but I'll do my best to help!",
  "That's an interesting question, let me think...",
  "As a CS student, I'd approach that problem differently.",
  "Born in 2004, so I'm still learning about that!",
  "Let me keep it brief - that's a great point.",
  "I study at BUE and that's definitely in my field.",
  "Hmm, that's a tricky one, but I'll try to answer.",
  "As the AI version of Yousef, I'd say go for it!",
  "That's exactly what I've been thinking about lately.",
  "Great question, though I'm still processing my thoughts on that."
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useApiMode, setUseApiMode] = useState(true); // Toggle between API and fallback mode
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Try a test API call when component mounts to see if API works
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'HEAD',
          headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          }
        });
        
        // If we can't connect, switch to fallback mode
        if (!response.ok) {
          console.log("API test failed, switching to fallback mode");
          setUseApiMode(false);
        }
      } catch (error) {
        console.log("API test failed with error, switching to fallback mode", error);
        setUseApiMode(false);
      }
    };
    
    testApiConnection();
  }, []);

  const toggleChat = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Reset welcome screen when opening if chat is empty
      if (messages.length === 0) {
        setShowWelcome(true);
      }
    }
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  // Helper function to generate a mock response
  const generateMockResponse = (userMessage: string) => {
    // Use the user message to deterministically select a response (but still seems random)
    const index = userMessage.length % MOCK_RESPONSES.length;
    return `${userMessage.length % 2 === 0 ? "👨‍💻 " : ""}${MOCK_RESPONSES[index]}`;
  };

  // Function to call OpenRouter API or fallback to mock responses
  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    // If we're in fallback mode, just return a mock response
    if (!useApiMode) {
      // Add a delay to simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsLoading(false);
      return generateMockResponse(userMessage);
    }
    
    try {
      // Create message array
      const messageArray = [
        { role: "system", content: "You're an AI version of someone called Yousef Owili. You're funny in a normal way, witty and charistmatic. make the replies max like one sentence, very small indeed. You're a senior CS student at the british university in egypt. You're born in 12/12/2004. You answer only the questions you're asked nothing more. Seem a little bit professional not that much." },
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        { role: "user", content: userMessage }
      ];
      
      // Try direct API connection
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Version of Yousef'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL_ID,
          messages: messageArray
        }),
      });
      
      if (!response.ok) {
        console.warn("API response not OK, falling back to mock mode");
        setUseApiMode(false); // Switch to fallback mode for future responses
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const aiResponseContent = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that request.";
      
      return aiResponseContent;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      
      // Switch to fallback mode for future responses
      setUseApiMode(false);
      
      // Return a mock response when API fails
      return generateMockResponse(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue.trim();
    setInputValue('');

    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);

    // Get AI response
    const aiContent = await fetchAIResponse(userInput);
    
    // Add AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: aiContent,
      sender: 'ai',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiResponse]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chat toggle button with pulse animation */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none relative ${
          !isOpen && !isAnimating ? 'animate-pulse-subtle' : ''
        } ${isAnimating ? 'scale-90' : 'scale-100'}`}
        aria-label="Open chat"
      >
        <div className={`absolute inset-0 rounded-full bg-indigo-400 animate-ping-slow opacity-75 ${isOpen ? 'hidden' : 'block'}`}></div>
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat container with improved animations */}
      <div 
        ref={chatContainerRef}
        className={`absolute bottom-16 right-0 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden transition-all duration-500 ${
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }`