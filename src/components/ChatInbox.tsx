import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Check, 
  Phone, 
  MapPin, 
  CreditCard,
  RefreshCw,
  Clock,
  ExternalLink,
  Plus
} from "lucide-react";
import { Conversation, Message, BusinessProfile, Product, FAQ, Order } from "../types";

interface ChatInboxProps {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  businessProfile: BusinessProfile;
  products: Product[];
  faqs: FAQ[];
  onOrderDetected: (order: Partial<Order>) => void;
}

export default function ChatInbox({
  conversations,
  setConversations,
  businessProfile,
  products,
  faqs,
  onOrderDetected
}: ChatInboxProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<"messenger" | "instagram" | "whatsapp">("messenger");
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [detectedOrder, setDetectedOrder] = useState<any | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter conversations for selected platform
  const filteredConversations = conversations.filter(c => c.platform === selectedPlatform);

  // Set active chat automatically if not set
  useEffect(() => {
    if (filteredConversations.length > 0) {
      // Find if we already have an active chat for this platform
      const currentActive = filteredConversations.find(c => c.id === activeChatId);
      if (!currentActive) {
        setActiveChatId(filteredConversations[0].id);
      }
    } else {
      setActiveChatId("");
    }
    setDetectedOrder(null);
  }, [selectedPlatform, conversations]);

  // Scroll to bottom on updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeChatId, loading]);

  const activeChat = conversations.find(c => c.id === activeChatId);

  // Quick Preset Messages for Easy Testing
  const customerQuickPresets = [
    { title: "দাম জানতে চাওয়া (Price Query)", text: "ভাইয়া, এই কটন পাঞ্জাবির জোনের দাম কত আর স্টক আছে নাকি?" },
    { title: "অর্ডার করতে চাওয়া (Ready to Buy)", text: "আমি জামদানি শাড়িটা কিনতে চাই। ঢাকা সিটির বাইরে পাঠাতে কত খরচ?" },
    { title: "অর্ডার ডিটেইলস দেওয়া (Full Details)", text: "আমি সাজিদ করিম। ফোন ০১৭৯৮৭৬৫৪৩২। ঠিকানা: হাউজ ৪২, রোড ৫, বনানী, ঢাকা। ক্যাশ অন ডেলিভারি দিতে চাচ্ছি।" },
    { title: "বিকাশ পেমেন্ট কনফার্ম (bKash TrxID)", text: "আমি জামদানি শাড়ির বাকি বিল ৮৫০ টাকা বিকাশে সেন্ড মানি করেছি। আমার TrxID হলো 9H4JD8E2।" },
    { title: "ডেলিভারি জিজ্ঞেস করা (ETA Query)", text: "অর্ডার করার পর ডেলিভারি পেতে কতদিন টাইম নিবেন আপনারা?" }
  ];

  // Post dynamic message to server-side Gemini Chat bot
  const handleSendMessage = async (textToSend: string, sender: "customer" | "seller" = "customer") => {
    if (!textToSend.trim() || !activeChat) return;

    // 1. Add user message to active chat history locally
    const userMessageId = Math.random().toString(36).substr(2, 9);
    const newUserMsg: Message = {
      id: userMessageId,
      sender: sender,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeChat.messages, newUserMsg];
    
    const updatedConversations = conversations.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: updatedMessages,
          lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: sender === "seller" ? "completed" : "active" as any
        };
      }
      return c;
    });

    setConversations(updatedConversations);
    setInputText("");

    if (sender === "seller") {
      // Merchant replied manually - no AI trigger needed
      return;
    }

    // 2. Query our server side API
    setLoading(true);
    setApiError(null);
    setDetectedOrder(null);

    try {
      // Prepare previous history (filtering or formatting appropriately)
      const chatHistoryForAPI = updatedMessages.slice(0, -1); // exclude the latest message itself

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          chatHistory: chatHistoryForAPI,
          businessProfile,
          products,
          faqs
        })
      });

      if (!response.ok) {
        throw new Error("এআই মডেল কানেক্ট করতে ব্যর্থ হয়েছে। চেক করুন GEMINI_API_KEY বা নেটওয়ার্ক কানেক্টিভিটি।");
      }

      const data = await response.json();
      let aiText = data.reply || "";

      // 3. Process potential order detection
      // Detect order block [ORDER_JSON]: {"customerName": ... }
      const orderJsonMatch = aiText.match(/\[ORDER_JSON\]:\s*(\{.*\})/);
      
      let parsedOrderData: any = null;
      if (orderJsonMatch && orderJsonMatch[1]) {
        try {
          parsedOrderData = JSON.parse(orderJsonMatch[1]);
          setDetectedOrder(parsedOrderData);
          // Strip the JSON markup block out so the customer does not see it
          aiText = aiText.replace(/\[ORDER_JSON\]:\s*(\{.*\})/, "").trim();
        } catch (e) {
          console.error("Failed to parse detected order JSON:", e);
        }
      }

      // 4. Add AI response to conversation
      const aiMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalConversations = conversations.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            customerPhone: parsedOrderData?.phone || c.customerPhone,
            messages: [...updatedMessages, aiMsg],
            lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: "completed" as any
          };
        }
        return c;
      });

      setConversations(finalConversations);

    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Something went wrong.");
      
      // Inject standard fallback message
      const fallbackMsg: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: "ai",
        text: "দুঃখিত ভাইয়া/আপু! সার্ভারে একটু টেকনিক্যাল জটিলতা হয়েছে। আপনার অর্ডার কনফার্ম করতে দয়া করে সরাসরি আমাদের পেজে ইনবক্স করুন অথবা আমাদের হেল্পলাইনে কথা বলুন।",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setConversations(conversations.map(c => {
        if (c.id === activeChat.id) {
          return { ...c, messages: [...updatedMessages, fallbackMsg] };
        }
        return c;
      }));
    } finally {
      setLoading(false);
    }
  };

  // Confirm Auto-Detected Order and insert into order list
  const handleConfirmOrder = () => {
    if (!detectedOrder) return;
    onOrderDetected(detectedOrder);
    setDetectedOrder(null);
    
    // Add success message inline to thread
    const successMsg: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: "seller",
      text: "🎉 ধন্যবাদ! আপনার অর্ডারটি সফলভাবে আমাদের সিস্টেমে রি-লগ করা হয়েছে। শীঘ্রই আমরা প্যাকেজিং শুরু করবো!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (activeChat) {
      setConversations(conversations.map(c => {
        if (c.id === activeChat.id) {
          return { ...c, messages: [...c.messages, successMsg] };
        }
        return c;
      }));
    }
  };

  // Create a brand new customer session dynamically to simulate new threads
  const handleCreateNewCustomer = () => {
    const bdNames = ["সাদিয়া ইসলাম", "রাকিব হাসান", "নাসরিন আকতার", "তাহমিদ চৌধুরী", "আরিফুল ইসলাম", "ফারজানা ইয়াসমিন"];
    const randomName = bdNames[Math.floor(Math.random() * bdNames.length)];
    const randomId = Math.random().toString(36).substr(2, 9);
    
    const newSession: Conversation = {
      id: randomId,
      customerName: `${randomName} (${Math.floor(100 + Math.random() * 900)})`,
      platform: selectedPlatform,
      messages: [
        {
          id: "m-welcome",
          sender: "customer",
          text: "হ্যালো, কেউ আছেন কি? আমি আপনাদের প্রোডাক্টগুলো অর্ডার করতে চাইছিলাম।",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      status: "active",
      lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setConversations([...conversations, newSession]);
    setActiveChatId(randomId);
    setDetectedOrder(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden" id="chat-tab-container">
      {/* Platform & Chat List (Left Sub-column) */}
      <div className="w-80 bg-white border-r border-slate-100 flex flex-col shrink-0" id="chat-list-sidebar">
        {/* Platform tabs */}
        <div className="p-4 border-b border-slate-100 grid grid-cols-3 gap-1.5" id="chat-platform-tabs">
          <button
            onClick={() => setSelectedPlatform("messenger")}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              selectedPlatform === "messenger" 
                ? "bg-blue-50 text-blue-600 border border-blue-100" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Messenger
          </button>
          <button
            onClick={() => setSelectedPlatform("instagram")}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              selectedPlatform === "instagram" 
                ? "bg-pink-50 text-pink-600 border border-pink-100" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            Instagram
          </button>
          <button
            onClick={() => setSelectedPlatform("whatsapp")}
            className={`py-2 text-xs font-bold rounded-xl transition ${
              selectedPlatform === "whatsapp" 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            WhatsApp
          </button>
        </div>

        {/* Create dynamic simulation list */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/40">
          <span className="text-[11px] font-bold text-slate-500">অ্যাক্টিভ গ্রাহকসমূহ</span>
          <button 
            onClick={handleCreateNewCustomer}
            className="flex items-center space-x-1 px-2.5 py-1 text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-slate-950 rounded-lg transition"
            id="btn-new-customer"
          >
            <Plus className="h-3 w-3" />
            <span>নতুন চ্যাট টেস্ট</span>
          </button>
        </div>

        {/* Chat Threads list */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50 p-2 space-y-1" id="chat-threads-scroller">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              এই প্ল্যাটফর্মে এখনো কোনো কথোপকথন সক্রিয় নেই। "নতুন চ্যাট টেস্ট" এ ক্লিক করুন!
            </div>
          ) : (
            filteredConversations.map((chat) => {
              const lastMsg = chat.messages[chat.messages.length - 1];
              const isActive = activeChatId === chat.id;
              return (
                <button
                  key={chat.id}
                  id={`chat-item-${chat.id}`}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setDetectedOrder(null);
                  }}
                  className={`w-full p-3 rounded-xl text-left transition flex items-start space-x-3 ${
                    isActive ? "bg-slate-900 text-slate-100 shadow" : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase border ${
                    isActive ? "bg-emerald-600 text-slate-950 border-emerald-500" : "bg-slate-100 text-slate-600 border-slate-200"
                  }`}>
                    {chat.customerName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate pr-2">{chat.customerName}</span>
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">{chat.lastMessageTime}</span>
                    </div>
                    <p className={`text-[11px] mt-1 truncate ${isActive ? "text-slate-300" : "text-slate-500"}`}>
                      {lastMsg ? lastMsg.text : "No messages yet"}
                    </p>
                    <div className="flex items-center space-x-1.5 mt-2">
                      <span className={`w-2 h-2 rounded-full ${chat.status === "completed" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                      <span className="text-[9px] uppercase tracking-wider font-bold opacity-60">
                        {chat.status === "completed" ? "Automated" : "Awaiting User"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Primary Simulator Message View (Center) */}
      <div className="flex-1 bg-slate-50 flex flex-col h-full" id="chat-viewport">
        {activeChat ? (
          <>
            {/* Active Header */}
            <div className="bg-white border-b border-slate-100 p-4 shrink-0 flex items-center justify-between" id="active-chat-header">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  {activeChat.customerName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900">{activeChat.customerName}</h3>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="capitalize font-mono text-emerald-600">● Live Simulated Sandbox</span>
                    <span>•</span>
                    <span className="uppercase font-semibold text-slate-400">{activeChat.platform} Connection</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                  এআই অ্যাক্টিভ
                </span>
              </div>
            </div>

            {/* Conversation Messages Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" id="chat-bubbles-container">
              {activeChat.messages.map((msg) => {
                const isCustomer = msg.sender === "customer";
                const isAI = msg.sender === "ai";
                return (
                  <div key={msg.id} className={`flex max-w-[80%] flex-col ${isCustomer ? "mr-auto" : "ml-auto text-right"}`}>
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 px-1 mb-1 font-mono">
                      {isCustomer ? (
                        <>
                          <User className="h-3 w-3" />
                          <span>CUSTOMER ({activeChat.customerName})</span>
                        </>
                      ) : isAI ? (
                        <>
                          <Bot className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">SKILLSSTORE AI BOT</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          <span>ME (SELLER MANUAL)</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                      isCustomer 
                        ? "bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm" 
                        : isAI
                        ? "bg-emerald-600 text-slate-950 rounded-tr-none font-medium shadow-md shadow-emerald-600/5 text-left"
                        : "bg-slate-900 text-slate-100 rounded-tr-none text-left"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {/* API Error Toast Inline */}
              {apiError && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-xs rounded-xl max-w-sm mx-auto text-center font-sans">
                  {apiError}
                </div>
              )}

              {/* Bot typing simulation */}
              {loading && (
                <div className="flex flex-col mr-auto max-w-[80%]">
                  <div className="flex items-center space-x-1.5 text-[10px] text-slate-400 px-1 mb-1">
                    <Bot className="h-3 w-3 text-emerald-600 animate-pulse" />
                    <span className="text-emerald-600 font-bold font-mono">SkillsStore AI Typing in Bangla...</span>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-2xl rounded-tl-none text-xs flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-slate-500 text-[10px]">পণ্য ক্যাটালগ ও খাতা যাচাই করা হচ্ছে...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* AI Detected Order Alert Panel (Sticky) */}
            {detectedOrder && (
              <div className="bg-emerald-50 border-t border-b border-emerald-200/50 p-4 shrink-0 flex items-start justify-between md:space-x-4 max-h-[160px] overflow-y-auto" id="detected-order-card">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl mt-0.5 animate-bounce">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-slate-900 flex items-center space-x-1.5">
                      <span>🤖 এআই গ্রাহকের অর্ডার ডিটেক্ট করেছে!</span>
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                        Auto-Matched
                      </span>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 font-sans font-medium text-slate-700">
                      <span className="flex items-center space-x-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>নাম: {detectedOrder.customerName}</span>
                      </span>
                      <span className="flex items-center space-x-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-400" />
                        <span>ফোন: {detectedOrder.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1.5 md:col-span-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />
                        <span className="truncate max-w-[400px]">ঠিকানা: {detectedOrder.address}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-2 shrink-0">
                  <button
                    onClick={handleConfirmOrder}
                    className="px-4 py-2 bg-emerald-600 text-slate-950 font-extrabold text-[11px] rounded-lg transition-all shadow-lg hover:bg-emerald-500 active:bg-emerald-700 cursor-pointer"
                  >
                    অর্ডার খাতায় সেভ করুন
                  </button>
                  <button
                    onClick={() => setDetectedOrder(null)}
                    className="text-[10px] text-slate-500 hover:text-slate-700 underline font-semibold text-center"
                  >
                    ভুল ডিটেকশন, বাতিল
                  </button>
                </div>
              </div>
            )}

            {/* Input Message Form Box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText, "customer");
              }} 
              className="bg-white border-t border-slate-100 p-4 shrink-0" 
              id="chat-input-form"
            >
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50"
                  placeholder="গ্রাহক সেজে এখানে বাংলায় মেসেজ লিখুন... যেমন: দাম কত ভাইয়া?"
                  id="chat-text-input"
                />
                <button
                  type="submit"
                  id="send-customer-btn"
                  className="p-3 bg-emerald-600 hover:bg-emerald-500 font-extrabold text-slate-950 rounded-xl shadow transition cursor-pointer shrink-0"
                  title="কাস্টমার চ্যাট সেন্ড করুন"
                >
                  <Send className="h-4 w-4" />
                </button>
                {/* Manual Seller Takeover Reply Trigger */}
                <button
                  type="button"
                  onClick={() => handleSendMessage(inputText, "seller")}
                  className="px-3 py-3 bg-slate-900 text-slate-50 border border-slate-800 text-[10px] font-bold rounded-xl hover:bg-slate-800 transition shrink-0 cursor-pointer text-center"
                  title="মার্চেন্ট রিকোয়েস্ট রিপ্লাই"
                >
                  Seller Takeover (ম্যানুয়াল)
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center">
                * টিপস: আপনি ডান পাশের কাস্টমার প্রিসেট সিনারিওগুলোতে ক্লিক করেও দ্রুত এআই এর বুদ্ধিমত্তা পরীক্ষা করতে পারেন!
              </p>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 font-sans" id="chat-fallback-empty">
            <MessageSquare className="h-10 w-10 text-slate-300 mb-3" />
            <h4 className="text-sm font-semibold text-slate-700">কোনো চ্যাট সেশন সিলেক্টেড নেই</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">নতুন একটি কাস্টমার টেস্ট সেশন ক্রিয়েট করতে বাম কলামের "নতুন চ্যাট টেস্ট" বাটনে ক্লিক করুন।</p>
          </div>
        )}
      </div>

      {/* Customer Scenario Templates (Right Column) */}
      <div className="w-80 bg-white border-l border-slate-100 p-5 overflow-y-auto shrink-0 space-y-6" id="customer-presets-column">
        <div>
          <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <span>সিমুলেশন প্রিসেটস</span>
          </h4>
          <p className="text-[10px] text-slate-500 mt-1">বাংলাদেশি রিয়েল কাস্টোমার বিহেভিয়ার পরীক্ষা করানোর জন্য প্রিসেট মেসেজে শুধু ক্লিক করুন</p>
        </div>

        <div className="space-y-3" id="presets-list">
          {customerQuickPresets.map((preset, index) => (
            <button
              key={index}
              onClick={() => {
                if (!activeChat) {
                  // Create a new customer if none active
                  handleCreateNewCustomer();
                }
                setInputText(preset.text);
              }}
              className="w-full p-3 text-left border border-slate-100 hover:border-emerald-500/40 rounded-xl bg-slate-50/50 hover:bg-white text-xs space-y-1.5 transition block group"
            >
              <div className="font-bold text-slate-700 text-[11px] group-hover:text-emerald-700 flex items-center justify-between">
                <span>{preset.title}</span>
                <span className="text-[9px] bg-slate-200 group-hover:bg-emerald-50 group-hover:text-emerald-700 px-1 py-0.2 rounded font-mono">Test</span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{preset.text}</p>
            </button>
          ))}
        </div>

        {/* Current Active Knowledge Base Snapshot reference */}
        <div className="p-4 bg-emerald-950/5 rounded-2xl border border-emerald-900/10 text-xs text-slate-700 space-y-3" id="active-catalog-view-panel">
          <h5 className="font-bold text-[11px] text-emerald-800 flex items-center space-x-1">
            <span>📦 অ্যাক্টিভ ক্যাটালগ রেফারেন্স</span>
          </h5>
          <div className="text-[11px] space-y-2 max-h-[140px] overflow-y-auto pr-1">
            <div>
              <p className="font-bold text-slate-800">১. ডেলিভারি চার্জ:</p>
              <p className="text-slate-500 text-[10px5]">ঢাকা সিটি: ৳{businessProfile.deliveryInsideDhaka}</p>
              <p className="text-slate-500 text-[10px5]">ঢাকার বাইরে: ৳{businessProfile.deliveryOutsideDhaka}</p>
            </div>
            <div>
              <p className="font-bold text-slate-800">২. প্রোডাক্টস ({products.length} টি):</p>
              {products.slice(0, 3).map(p => (
                <p key={p.id} className="text-slate-500 text-[10px] truncate">• {p.name} - ৳{p.price}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
