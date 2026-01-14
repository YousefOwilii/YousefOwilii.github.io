"use client";

import { useState, useEffect, useRef } from "react";
// Custom hook for scroll-triggered animation
function useScrollAppear() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, visible] as const;
}

// Configuration - You'll need to add your OpenRouter API key and model ID here
const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ""; // Use environment variable
const OPENROUTER_MODEL_ID = "x-ai/grok-3-mini-beta";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";
import ContactForm from "../components/ContactForm";
import TypewriterEffect from "../components/TypewriterEffect";
import StylizedQuote from "../components/StylizedQuote";
import AICompanionPopout from "../components/AICompanionPopout";

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [themeInitialized, setThemeInitialized] = useState(false);

  // AI Companion Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Scroll animation hooks
  const [aboutHeadingRef, aboutHeadingVisible] = useScrollAppear();
  const [aboutQuoteRef, aboutQuoteVisible] = useScrollAppear();
  const [contactRef, contactVisible] = useScrollAppear();
  const [aiProjectsRef, aiProjectsVisible] = useScrollAppear();
  const [webDevRef, webDevVisible] = useScrollAppear();
  const [mobileAppsRef, mobileAppsVisible] = useScrollAppear();
  const [contentCreationRef, contentCreationVisible] = useScrollAppear();
  const [technicalSkillsRef, technicalSkillsVisible] = useScrollAppear();
  const [softSkillsRef, softSkillsVisible] = useScrollAppear();
  const [booksRef, booksVisible] = useScrollAppear();

  // Function to call OpenRouter API
  const fetchAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    
    try {
      // Check if API key is available
      if (!OPENROUTER_API_KEY) {
        console.error("OpenRouter API key is not set. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your environment variables.");
        return "Sorry, the AI service is not properly configured. Please contact the administrator.";
      }
      
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          'X-Title': 'AI Companion on Yousefowili.me'
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL_ID,
          messages: [
            { role: "system", content: "When they say hi who are you, say your name, don't start stating all the information you have in one go.  Do not mention all the information about me unless they ask about it. If someone speaks in any language, say that you only reply in English sorry. No hyperbole. Avoid overusing emojis. Avoid over reacting. You're an AI version of someone called Yousef Owili. You're super funny in a normal way, witty and charistmatic. make the replies max like two sentence, very small indeed. You're a senior CS student at the british university in egypt. You're born in 12/12/2004, you're 20. You're Egyptian. You're a copy of him, but there are somethings the real yousef didn't tell you about. Right now you're inside his website, yousefowili.me. His website has a home, which has a cool typerwriter animation, and an about, and a contact section where you can shoot the real yousef an email if you want to conatct him, and a projects tab of all the projects I've done so far. If anyone asks you about yousef's love life, say that you're pretty sure he's a baller with girls but he doesn't tell anyone. You life caramel frappuchinos. You go to the gym and take creatine and on your jouney to become jacked as fuck. You absolutely and utterly honor your word. You answer only the questions you're asked nothing more. Seem a little bit professional not that much." },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.content
            })),
            { role: "user", content: userMessage }
          ]
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: `HTTP error ${response.status}` } }));
        throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      const aiResponseContent = data.choices[0]?.message?.content || "Sorry, I couldn't process that request.";
      
      return aiResponseContent;
    } catch (error) {
      console.error("Error fetching AI response:", error);
      return "Sorry, there was an error connecting to the AI service. Please try again later.";
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

  useEffect(() => {
    // Check if user has a preference stored
    const isDark = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(isDark);
    
    // Mark theme as initialized after a brief delay to ensure DOM is ready
    setTimeout(() => setThemeInitialized(true), 100);

    // Listen for theme changes
    const handleThemeChange = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    // Set up a MutationObserver to watch for class changes on the html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!themeInitialized) return;
    const timer = setTimeout(() => setHeroVisible(true), 300);
    return () => clearTimeout(timer);
  }, [themeInitialized]);

  // Project data
  const projects = [
    {
      title: "This website",
      description: "This personal project showcases my skills in modern web development. Built with Next.js, TypeScript, and Tailwind CSS, it features a responsive design, dark mode, and interactive elements like the typewriter effect.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "React"],
      projectUrl: "https://yousefowili.me",
      companyName: "Personal Project",
      imageUrl: "/images/projects/portfolio.jpg",
      companyLogo: isDarkMode ? "/images/projects/personal-logo.png" : "/images/projects/logo-light.png",
    },
    {
      title: "Copywriting Services",
      description: "Worked with CopyLab to produce compelling copy for businesses and their websites. Created engaging content that drives conversions and improves brand messaging.",
      technologies: ["Copywriting", "Content Strategy", "SEO", "Brand Messaging"],
      projectUrl: "#",
      companyName: "CopyLab",
      imageUrl: "/images/projects/copylab.jpg",
      companyLogo: "/images/projects/copylab-logo.png",
    },
    {
      title: "AI Agents for Business",
      description: "Working with ForceAI to streamline AI agents for businesses. Our latest work focuses on creating lead generation and outreach agents that automate customer acquisition processes.",
      technologies: ["AI", "Python", "LangChain", "OpenAI API"],
      projectUrl: "#",
      companyName: "ForceAI",
      imageUrl: "/images/projects/forceai.jpg",
      companyLogo: "/images/projects/forceai-logo.png",
    },
    {
      title: "Media Production",
      description: "Collaborated with GMP (Generic Media Production) to produce video ads, restaurant menus, photo ad campaigns, and more. Created visually appealing content that effectively communicates brand messages.",
      technologies: ["Video Production", "Graphic Design", "Photography", "Adobe Suite"],
      projectUrl: "#",
      companyName: "GMP",
      imageUrl: "/images/projects/gmp.jpg",
      companyLogo: "/images/projects/gmp-logo.png",
    },
    {
      title: "Time Tracking App",
      description: "Currently working with Ease to develop 'Time', a mobile app that helps users track and budget their time throughout the day. The app features intuitive UI/UX and powerful time management tools.",
      technologies: ["SwiftUI", "iOS Development", "UI/UX Design", "Firebase"],
      projectUrl: "#",
      companyName: "Ease",
      imageUrl: "/images/projects/portfolio.jpg",
      companyLogo: "/images/projects/Emblem.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* AI Companion Popout */}
      <AICompanionPopout />

      {/* Navigation */}
      <div className={`transition-all duration-700 ease-out
        ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-md'}`}
        style={{ willChange: 'opacity, transform, filter' }}
      >
        <Navbar />
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="w-full text-center">
          <h1 className={`text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-all duration-700 ease-out
            ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-md'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            Hi, I'm <span className="text-blue-600 dark:text-blue-400">Yousef Owili</span>
          </h1>
          <h2 className={`text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4 transition-all duration-700 ease-out
            ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-md'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            <TypewriterEffect 
              strings={[
                "AI Agents Developer",
                "Copywriter",
                "Full Stack Developer",
                "SwiftUI App Developer",
                "Videographer"
              ]}
            />
          </h2>
          <p className={`text-xl text-gray-600 dark:text-gray-300 mb-8 transition-all duration-700 ease-out
            ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-md'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            A jack of all trades can be a master of all.
          </p>
          <div className={`flex justify-center space-x-4 transition-all duration-700 ease-out
            ${heroVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 -translate-y-8 blur-md'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            <a 
              href="#contact" 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* AI Companion Interface */}
      <section id="ai" className="container mx-auto px-4 md:px-6 py-10 md:py-14">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl p-4 md:p-10">
          <div className="inline-flex items-center gap-3 rounded-full border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-6">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            Ask me something
          </div>
          <div className="grid gap-6 md:gap-10 grid-cols-1 md:grid-cols-[280px_1fr] items-start md:items-center">
            <div className="relative mx-auto md:mx-0 w-full max-w-[200px] md:max-w-none">
              <div className="aspect-[3/4] w-full rounded-2xl bg-gradient-to-b from-blue-500/25 to-transparent border border-blue-400/40 shadow-2xl overflow-hidden">
                <video
                  src="/images/ai-companion.mp4"
                  autoPlay
                  muted
                  playsInline
                  onEnded={(e) => {
                    const video = e.currentTarget;
                    setTimeout(() => {
                      video.play();
                    }, 10000);
                  }}
                  className="object-cover w-full h-full opacity-90"
                />
              </div>
              <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Joe
              </p>
            </div>
            <div className="space-y-4 w-full">
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 p-4 md:p-6 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Chat with Joe</p>
                    <p className="text-xs text-gray-400">The AI version of Yousef</p>
                  </div>
                  <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gray-400">Live</span>
                </div>
                <div className="space-y-3 min-h-[250px] md:min-h-[200px] max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                      No messages yet. Start a conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`rounded-2xl px-4 py-3 text-sm shadow-inner break-words ${
                          message.sender === 'user'
                            ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 ml-4'
                            : 'bg-blue-700/90 text-white mr-4'
                        }`}
                      >
                        <p>
                          <span className={`font-semibold ${
                            message.sender === 'user' 
                              ? 'text-gray-800 dark:text-white' 
                              : ''
                          }`}>
                            {message.sender === 'user' ? 'You:' : 'AI:'}
                          </span>{' '}
                          {message.content}
                        </p>
                      </div>
                    ))
                  )}
                  {isLoading && (
                    <div className="rounded-2xl bg-gray-200 dark:bg-gray-700 px-4 py-3 text-sm text-gray-700 dark:text-gray-200 mr-4">
                      <div className="flex space-x-2 justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={isLoading ? "AI is thinking..." : "Type your question..."}
                    disabled={isLoading}
                    className="flex-1 rounded-full border border-transparent bg-white dark:bg-gray-900/60 px-4 py-2 text-sm text-gray-700 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/80"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="rounded-full bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white dark:bg-gray-900 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2
            ref={aboutHeadingRef}
            className={`text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12 transition-all duration-700 ease-out
              ${aboutHeadingVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
            style={{ willChange: 'opacity, transform, filter' }}
          >
            About Me
          </h2>

          {/* Bento Grid Layout - Integrated into About */}
          <div className="w-full max-w-[1600px] mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 auto-rows-[minmax(180px,1fr)]">
              {/* AI Projects - Large Box (2x3) */}
              <div
                ref={aiProjectsRef}
                className={`col-span-2 row-span-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden group transition-all duration-700 ease-out
                  ${aiProjectsVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
                  <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs md:text-sm font-medium mb-2 tracking-wide">ARTIFICIAL INTELLIGENCE</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">AI Agent Development</h3>
                  <div className="flex-1 grid grid-cols-1 gap-3 mt-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm md:text-base mb-1">AI Web Scraper</div>
                      <div className="text-white/80 text-xs md:text-sm">50+ node AI lead extractor using n8n</div>
                      <div className="text-white/60 text-xs mt-1">Using AI to create search queries, rank potential websites, decide which internal links to crawl into, and finally to extract information from the page content.</div>
                      <div className="text-white/60 text-xs">Using third-party API's like SERP API & more to immitate normal browsing.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm md:text-base mb-1">AI Dreamer</div>
                      <div className="text-yellow-300 text-xs md:text-sm flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                        Currently In Development
                      </div>
                      <div className="text-white/60 text-xs mt-1">Essentially the plan is to leverage AI to interpret dreams according to Ibn Sirin's teachings.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm md:text-base mb-1">WhatsApp Chatbots</div>
                      <div className="text-white/80 text-xs md:text-sm">Business automation solutions</div>
                      <div className="text-white/60 text-xs mt-1">This is why I enjoy living. Being able to link business with tech.</div>
                      <div className="text-white/60 text-xs">I mastered using various comapnies' API including all Meta's services which I used to create WhatsApp chatbots for businesses.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Web Development - Medium Box (2x2) */}
              <div
                ref={webDevRef}
                className={`col-span-2 row-span-2 bg-gradient-to-br from-gray-500 to-gray-700 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden group transition-all duration-700 ease-out
                  ${webDevVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
                  <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs md:text-sm font-medium mb-2 tracking-wide">WEB DEVELOPMENT</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">Modern Websites</h3>
                  <div className="flex-1 grid grid-cols-1 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm md:text-base mb-1">Fantasticoders.com</div>
                      <div className="text-white/80 text-xs md:text-sm">Full-stack business website</div>
                      <div className="text-white/60 text-xs mt-1">Created a website for Fantasticoders fully integrated with AI features & modern responsive design.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm md:text-base mb-1">Yousefowili.me</div>
                      <div className="text-white/80 text-xs md:text-sm">Personal & business portfolio</div>
                      <div className="text-white/60 text-xs mt-1">You're currenly browsing through my personal website which I showcase all the things I'm able to help you with.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Apps - Small Box (1x1) */}
              <div
                ref={mobileAppsRef}
                className={`col-span-1 row-span-1 bg-gradient-to-br from-gray-700 to-gray-900 rounded-3xl shadow-2xl p-4 md:p-6 relative overflow-hidden group transition-all duration-700 ease-out
                  ${mobileAppsVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10">
                  <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs font-medium mb-1 tracking-wide">APPS</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">iOS Apps</h3>
                  <div className="text-white/80 text-xs md:text-sm">Rentainence App</div>
                  <div className="text-white/60 text-xs mt-1">SwiftUI • iOS</div>
                  <div className="text-yellow-300 text-xs md:text-sm flex items-center">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
                        Currently In Development
                      </div>
                </div>
              </div>

              {/* Soft Skills - Small Box (1x1) */}
              <div
                ref={softSkillsRef}
                className={`col-span-1 row-span-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-3xl shadow-2xl p-4 md:p-6 relative overflow-hidden group transition-all duration-700 ease-out
                  ${softSkillsVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10">
                  <div className="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-white animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs font-medium mb-1 tracking-wide">SOFT SKILLS</div>
                  <h3 className="text-sm md:text-lg font-bold text-white mb-2">What Drives Me</h3>
                  <div className="flex flex-col gap-1">
                    <div className="text-white/90 text-xs">Efficient Time Management</div>
                    <div className="text-white/90 text-xs">Ability to tap into Flow State</div>
                    <div className="text-white/90 text-xs">Trial & error. Tenacity.</div>
                    <div className="text-white/90 text-xs">Pressure & stress resilience</div>
                  </div>
                </div>
              </div>

              {/* Books Read - Medium Box (2x2) */}
              <div
                ref={booksRef}
                className={`col-span-2 row-span-2 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden group transition-all duration-700 ease-out
                  ${booksVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
                  <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs md:text-sm font-medium mb-2 tracking-wide">BOOKS READ</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">Authors that Shaped Me</h3>
                  <div className="flex-1 overflow-y-auto max-h-48 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    <div className="grid grid-cols-1 gap-2 text-xs pr-2">
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">The 48 Laws of Power</div>
                        <div className="text-white/80">Robert Greene</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">Why We Sleep</div>
                        <div className="text-white/80">Matthew Walker</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">How to Win Friends & Influence People</div>
                        <div className="text-white/80">Dale Carnegie</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">Atomic Habits</div>
                        <div className="text-white/80">James Clear</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">The Subtle Art of Not Giving a F*ck</div>
                        <div className="text-white/80">Mark Manson</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">Rich Dad Poor Dad</div>
                        <div className="text-white/80">Robert Kiyosaki</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">The Psychology of Money</div>
                        <div className="text-white/80">Morgan Housel</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-white">The Greatest Secret</div>
                        <div className="text-white/80">Rhonda Byrne</div>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2 border border-white/30">
                        <div className="font-semibold text-yellow-300">Currently Reading:</div>
                        <div className="text-yellow-300 font-semibold">Influence: The Psychology of Persuasion</div>
                        <div className="text-white/80">Robert B. Cialdini</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Creation - Large Box (2x2) */}
              <div
                ref={contentCreationRef}
                className={`col-span-2 row-span-2 bg-gradient-to-r from-gray-600 to-gray-800 rounded-3xl shadow-2xl p-6 md:p-8 relative overflow-hidden group transition-all duration-700 ease-out
                  ${contentCreationVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-4 right-4 w-12 h-12 md:w-16 md:h-16">
                  <div className="w-full h-full bg-white/20 rounded-2xl flex items-center justify-center">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10 h-full flex flex-col">
                  <div className="text-white/90 text-xs md:text-sm font-medium mb-2 tracking-wide">CONTENT CREATION</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Visual Storytelling</h3>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm mb-1">Fitness Reels</div>
                      <div className="text-white/80 text-xs">Worked with local gyms creating engaging short-form content for their social media pages.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm mb-1">Brand Reels</div>
                      <div className="text-white/80 text-xs">Creating targeted marketing videos for local clothing brands on social media.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm mb-1">Graphic Design</div>
                      <div className="text-white/80 text-xs">Worked on various designs from logo's to restaurant menus, including copy.</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30 hover:bg-white/30 transition-all duration-300">
                      <div className="font-semibold text-white text-sm mb-1">Event coverage</div>
                      <div className="text-white/80 text-xs">Worked on shooting multiple main events at the British University in Egypt.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Skills - Medium Box (2x1) */}
              <div
                ref={technicalSkillsRef}
                className={`col-span-2 row-span-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-4 md:p-6 relative overflow-hidden group transition-all duration-700 ease-out
                  ${technicalSkillsVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
                style={{ willChange: 'opacity, transform, filter' }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute top-3 right-3 w-10 h-10 md:w-12 md:h-12">
                  <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <div className="relative z-10">
                  <div className="text-white/70 text-xs font-medium mb-1 tracking-wide">TECHNICAL EXPERTISE</div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-3">Core Skills</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Student of Life</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Copywriting</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Prompt Eng.</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Sales</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Market Research</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Content Creation</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Human Psychology</div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 text-white text-xs text-center">Entrepreneurship</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div
              ref={aboutQuoteRef}
              className={`transition-all duration-700 ease-out
                ${aboutQuoteVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
              style={{ willChange: 'opacity, transform, filter' }}
            >
              <StylizedQuote>
                <div className="text-sm md:text-base">
                  <p className="mb-4">
                    The world calls me Owili.
                  </p>
                  <p className="mb-4">
                    I'm currently studying computer science at the British University in Egypt, majoring in Artificial Intelligence. I always had this obsession of wanting to do "something". Something that is positively impactful in some regard. It started by seeing the dedication of some very hard working and talented people, making me tap into courses, videos, anything that can make me more like them. I worked on projects from web development, to developing fully fledged AI agents, to creating copy and fascinations for small businesses, to designing and creating content for local restaurants, gyms, brands and my university.
                  </p>
                  <p>
                    I'm a perfectionist, but I don't let it negatively affect my progress. I do things perfect and quick. I'm fast not sluggish. I completely and utterly honor my word.
                  </p>
                </div>
              </StylizedQuote>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        id="contact"
        className={`bg-white dark:bg-gray-800 py-16 md:py-24 transition-all duration-700 ease-out
          ${contactVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-md'}`}
        style={{ willChange: 'opacity, transform, filter' }}
      >
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
            Get In Touch
          </h2>
          
          <ContactForm />
          
          <div className="mt-16 flex justify-center">
            <div className="flex items-center">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">hi@yousefowili.me</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}