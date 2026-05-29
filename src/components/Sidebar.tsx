import React from "react";
import { 
  Bot, 
  TrendingUp, 
  ShoppingCart, 
  Settings, 
  MessageSquare, 
  Key, 
  Sparkles,
  Info
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  storeName: string;
}

export default function Sidebar({ activeTab, setActiveTab, storeName }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", name: "ওভারভিউ (Dashboard)", icon: TrendingUp, desc: "কনভার্সন ও সেলস স্ট্যাটস" },
    { id: "chat", name: "আই ইনবক্স ও টেস্ট (Social Inbox)", icon: MessageSquare, desc: "লাইভ কাস্টমার চ্যাট ও টেস্ট" },
    { id: "config", name: "স্টোর ও এআই ট্রেনিং (Configure AI)", icon: Settings, desc: "প্রোডাক্টস, পেমেন্ট ও ট্রেনিং" },
    { id: "orders", name: "অর্ডার খাতা (Orders)", icon: ShoppingCart, desc: "অটো-ডিটেক্টেড সেলস লিস্ট" },
    { id: "meta", name: "মেটা কানেক্ট ও সেফটি (Meta API)", icon: Key, desc: "বাংলিশ গাইড ও রি-ডাইরেকশন" },
  ];

  return (
    <aside className="w-80 bg-[#111113] text-zinc-300 flex flex-col border-r border-[#222226] shrink-0 h-screen sticky top-0" id="sidebar-container">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#222226] flex items-center space-x-3" id="sidebar-brand">
        <div className="bg-indigo-600 text-white p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <Bot className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center space-x-1 font-display">
            <span>SkillsStore</span>
            <span className="text-indigo-400 font-extrabold text-xs bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/25">BD</span>
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">AI Social Media Manager</p>
        </div>
      </div>

      {/* Store Quick Status */}
      <div className="px-6 py-4 bg-[#161618]/40 border-b border-[#222226]/60" id="sidebar-status">
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">অ্যাক্টিভ মার্চেন্ট শপ:</span>
          <span className="text-xs font-semibold px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
            ● Live
          </span>
        </div>
        <p className="text-sm font-semibold text-zinc-200 mt-1 truncate">{storeName || "আমার শপ"}</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" id="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-start space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 text-left ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 font-medium"
                  : "text-zinc-450 hover:bg-[#161618] hover:text-white"
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${isActive ? "text-white" : "text-zinc-400"}`} />
              <div className="flex flex-col min-w-0">
                <span className="text-sm tracking-wide font-medium">{item.name}</span>
                <span className={`text-[10px] mt-0.5 font-sans truncate ${isActive ? "text-indigo-200" : "text-zinc-500"}`}>
                  {item.desc}
                </span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Trust & Safe Account Policy Footer */}
      <div className="p-4 bg-[#0A0A0B]/60 border-t border-[#222226] text-xs text-zinc-550 space-y-2 mt-auto" id="sidebar-footer">
        <div className="flex items-start space-x-2 text-[11px] leading-relaxed bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10 text-zinc-300">
          <Sparkles className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
          <span>
            <strong>Official Meta API</strong> ইউজ করার কারণে পেজ রেস্ট্রিকশন বা পলিসি ভায়োলেশনের কোনো রিটেইল ঝুঁকি নেই!
          </span>
        </div>
        <div className="text-[10px] text-zinc-500 text-center font-mono py-1">
          Developed for BD E-comm v1.0.0
        </div>
      </div>
    </aside>
  );
}
