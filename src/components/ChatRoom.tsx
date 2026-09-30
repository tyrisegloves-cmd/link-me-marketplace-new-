import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceProvider } from '../types';
import { VerifiedIcon } from '../data';

interface Message {
  id: number;
  sender: 'customer' | 'pro';
  text: string;
  time: string;
}

interface ChatRoomProps {
  provider: ServiceProvider;
  customerName: string;
  issue: string;
  location: string;
  availability: string;
  onClose: () => void;
}

const getTime = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const proAutoReplies = [
  "Thanks for reaching out! I've reviewed your request and I'm available to help.",
  "Could you send me a photo of the issue if possible? That would help me give a more accurate estimate.",
  "Based on what you've described, I'd estimate this will take about 1-2 hours. Does that timeframe work for you?",
  "Great, I'll plan to bring all the necessary tools and materials. No extra charges for that.",
  "Looking forward to helping you out! Feel free to message me if anything changes before our appointment.",
];

export function ChatRoom({ provider, customerName, issue, location, availability, onClose }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const proReplyIdx = useRef(0);

  // Initial system messages
  useEffect(() => {
    const now = getTime();
    const initialMessages: Message[] = [
      {
        id: 1,
        sender: 'customer',
        text: `Hi ${provider.name}, I need help with: ${issue}`,
        time: now,
      },
      {
        id: 2,
        sender: 'customer',
        text: `📍 Location: ${location}\n📅 Availability: ${availability}`,
        time: now,
      },
    ];
    setMessages(initialMessages);

    // Pro auto-greets after a short delay
    const t = setTimeout(() => {
      setIsTyping(true);
      const t2 = setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'pro',
            text: `Hi ${customerName}! ${proAutoReplies[0]}`,
            time: getTime(),
          },
        ]);
        proReplyIdx.current = 1;
      }, 1800);
      return () => clearTimeout(t2);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: 'customer',
      text,
      time: getTime(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');

    // Simulate pro typing then reply
    const delay = 1000 + Math.random() * 1500;
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const reply = proAutoReplies[proReplyIdx.current % proAutoReplies.length];
        proReplyIdx.current++;
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            sender: 'pro',
            text: reply,
            time: getTime(),
          },
        ]);
      }, 1200 + Math.random() * 1000);
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[85vh] sm:h-[75vh]">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={provider.avatar} alt={provider.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900 text-sm">{provider.name}</span>
              {provider.verified && <VerifiedIcon />}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Online • Usually responds instantly</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Step 2 indicator */}
      <div className="px-5 py-2 bg-blue-50 border-b border-blue-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-blue-600" />
          <div className="h-1.5 flex-1 rounded-full bg-blue-600" />
        </div>
        <p className="text-[10px] text-blue-700 font-bold mt-1">Step 2 of 2 — Chat with {provider.name}</p>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-slate-50/80 scrollbar-hide">
        {/* System message */}
        <div className="text-center">
          <span className="inline-block text-[10px] font-bold text-slate-400 bg-white border border-slate-200 rounded-full px-3 py-1">
            🔒 This conversation is encrypted and secure
          </span>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${msg.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  msg.sender === 'customer'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-md'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${msg.sender === 'customer' ? 'text-blue-200' : 'text-slate-400'}`}>
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm flex items-center gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-400"
                  animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-200 bg-white shrink-0">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              input.trim()
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/25 cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
