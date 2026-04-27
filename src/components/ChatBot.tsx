import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Minus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { getChatResponse } from '../services/geminiService';

interface SupportMessage {
  id: string;
  userId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  isAdmin: boolean;
  isRead: boolean;
}

export default function ChatBot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !isOpen) return;

    const q = query(
      collection(db, 'support_messages'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SupportMessage[];
      setMessages(msgs);
      
      // Mark admin messages as read when user sees them
      msgs.forEach(m => {
        if (m.isAdmin && !m.isRead) {
          updateDoc(doc(db, 'support_messages', m.id), { isRead: true });
        }
      });
    }, (err) => {
      console.error("Chat sync error:", err);
    });

    return () => unsubscribe();
  }, [user, isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    if (!user) {
      alert("Please sign in to chat with support.");
      return;
    }

    const text = input;
    setInput('');
    setIsLoading(true);

    try {
      // 1. Save to Firestore
      await addDoc(collection(db, 'support_messages'), {
        userId: user.uid,
        senderId: user.uid,
        senderName: `${user.firstName} ${user.lastName}`,
        text,
        timestamp: new Date().toISOString(),
        isAdmin: false,
        isRead: false
      });

      // 2. Local AI Fallback (if it's the very first message or if we want immediate feedback)
      // We only trigger AI if this is the start or if requested
      if (messages.length === 0) {
        const aiResponse = await getChatResponse(text, []);
        if (aiResponse) {
          await addDoc(collection(db, 'support_messages'), {
            userId: user.uid,
            senderId: 'bot',
            senderName: 'DigiBot',
            text: aiResponse,
            timestamp: new Date().toISOString(),
            isAdmin: true,
            isRead: false
          });
        }
      }
    } catch (e) {
      console.error("Chat send error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-brand text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform relative"
          >
            <MessageSquare size={28} />
            {messages.filter(m => m.isAdmin && !m.isRead).length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? '80px' : '600px'
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-[380px] bg-white rounded-[32px] shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-brand p-5 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                   <MessageSquare size={20} />
                </div>
                <div>
                   <p className="font-bold text-sm">Support Chat</p>
                   <p className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Live Assistance</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                 <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-lg shrink-0">
                   <Minus size={20} />
                 </button>
                 <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-lg shrink-0">
                   <X size={20} />
                 </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth bg-gray-50/50"
                >
                  {messages.length === 0 && (
                    <div className="text-center py-10 space-y-2">
                       <p className="text-gray-400 text-sm font-bold">Welcome to PrimeInvest Support!</p>
                       <p className="text-[10px] text-gray-300 font-medium px-10 leading-relaxed uppercase tracking-widest">Our team is available 24/7. Send a message to start.</p>
                    </div>
                  )}
                  {messages.map((m) => (
                    <div 
                      key={m.id} 
                      className={`flex ${!m.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="flex flex-col gap-1 max-w-[85%]">
                        <div 
                          className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                            !m.isAdmin 
                              ? 'bg-brand text-white rounded-tr-none' 
                              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm'
                          }`}
                        >
                          {m.text}
                        </div>
                        <p className={`text-[8px] font-bold text-gray-300 uppercase ${!m.isAdmin ? 'text-right' : 'text-left'}`}>
                          {m.senderName} • {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-end">
                      <div className="bg-brand/10 p-4 rounded-2xl rounded-tr-none">
                        <Loader2 size={16} className="animate-spin text-brand" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-50">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder={user ? "Ask us anything..." : "Please sign in to chat"}
                      disabled={!user || isLoading}
                      className="w-full bg-gray-100 rounded-2xl py-3 px-6 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-brand border-none font-medium disabled:opacity-50"
                    />
                    <button 
                      onClick={handleSend}
                      disabled={isLoading || !input.trim() || !user}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-brand text-white rounded-xl flex items-center justify-center hover:bg-[#6d1b1b] transition-colors disabled:opacity-50"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
