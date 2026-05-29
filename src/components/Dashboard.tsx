import React from "react";
import { 
  TrendingUp, 
  MessageSquare, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  DollarSign,
  ArrowRight,
  Sparkles,
  Bot
} from "lucide-react";
import { Order, Conversation } from "../types";

interface DashboardProps {
  orders: Order[];
  conversations: Conversation[];
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ orders, conversations, setActiveTab }: DashboardProps) {
  // Stats Calculations
  const completedOrders = orders.filter(o => o.status === "Confirmed" || o.status === "Shipped");
  const pendingOrders = orders.filter(o => o.status === "Pending");
  
  const totalSalesVal = completedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const pendingSalesVal = pendingOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

  const totalInteractions = conversations.reduce((acc, curr) => acc + curr.messages.length, 0);
  const aiInteractions = conversations.reduce(
    (acc, curr) => acc + curr.messages.filter(m => m.sender === "ai").length, 
    0
  );

  const aiConversionRate = conversations.length > 0
    ? Math.round((orders.length / conversations.length) * 100)
    : 0;

  // Platform Distribution
  const messengerCount = conversations.filter(c => c.platform === "messenger").length;
  const whatsappCount = conversations.filter(c => c.platform === "whatsapp").length;
  const instagramCount = conversations.filter(c => c.platform === "instagram").length;

  return (
    <div className="space-y-8 p-8" id="dashboard-tab">
      {/* Banner / Premium Welcome */}
      <div className="bg-gradient-to-br from-[#1E1E21] via-[#161618] to-[#111113] p-8 rounded-3xl border border-[#222226] text-white relative overflow-hidden shadow-xl" id="dashboard-hero">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-400 px-3.5 py-1.5 rounded-full border border-indigo-500/20 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            <span>বাংলাদেশি ই-কমার্স সেলস ইনোভেশন ২০২৬</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white font-display">
            আসসালামু আলাইকুম! SkillsStoreBD তে স্বাগতম ✨
          </h2>
          <p className="text-zinc-305 text-sm md:text-base leading-relaxed">
            আপনার ফেসবুক পেজ, ইনস্টাগ্রাম এবং হোয়াটসঅ্যাপ চ্যাটবক্স এখন সম্পূর্ণ এআই চালিত। কাস্টমারদের মেসেজের উত্তর দেওয়া থেকে শুরু করে সম্পূর্ণ অর্ডার তোলা ও পেমেন্ট কনফার্মেশন — সবকিছুই হচ্ছে নিজে নিজে।
          </p>
          <div className="pt-4 flex items-center space-x-4">
            <button 
              onClick={() => setActiveTab("chat")}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center space-x-2 cursor-pointer"
              id="dashboard-btn-simulator"
            >
              <span>চ্যাট সিমুলেটর পরীক্ষা করুন</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setActiveTab("config")}
              className="px-5 py-2.5 bg-[#161618] hover:bg-[#222226] text-zinc-305 text-sm font-semibold rounded-xl border border-[#222226] transition"
              id="dashboard-btn-training"
            >
              এআই ট্রেনিং ও প্রোডাক্টস
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Analytic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-analytic-cards">
        {/* Card 1: Sales */}
        <div className="bg-gradient-to-br from-[#1E1E21] to-[#161618] rounded-2xl border border-[#222226] p-6 flex items-start space-x-4 shadow hover:border-zinc-800 transition">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">মোট বিক্রয় (কনফার্মড)</span>
            <h3 className="text-2xl font-serif font-bold italic text-white mt-1">৳{totalSalesVal.toLocaleString()}</h3>
            <p className="text-xs text-zinc-400 mt-1">
              পেন্ডিং অর্ডার: <span className="text-amber-400 font-semibold">৳{pendingSalesVal.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Card 2: AI Automation Volume */}
        <div className="bg-gradient-to-br from-[#1E1E21] to-[#161618] rounded-2xl border border-[#222226] p-6 flex items-start space-x-4 shadow hover:border-zinc-800 transition">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">এআই অটোমেশন রেট</span>
            <h3 className="text-2xl font-serif font-bold italic text-indigo-400 mt-1">
              {totalInteractions > 0 ? Math.round((aiInteractions / totalInteractions) * 100) : 100}%
            </h3>
            <p className="text-xs text-zinc-400 font-medium mt-1">
              {aiInteractions} / {totalInteractions} টি বার্তা এআই দিয়েছে
            </p>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-gradient-to-br from-[#1E1E21] to-[#161618] rounded-2xl border border-[#222226] p-6 flex items-start space-x-4 shadow hover:border-zinc-800 transition">
          <div className="p-3 bg-[#222226] text-zinc-350 rounded-xl">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">মোট অর্ডার রিসিভড</span>
            <h3 className="text-2xl font-serif font-bold italic text-white mt-1">{orders.length} টি</h3>
            <p className="text-xs text-zinc-400 mt-1 flex items-center space-x-1">
              <Clock className="h-3 w-3 text-amber-500" />
              <span>{pendingOrders.length} টি অর্ডার পেন্ডিং</span>
            </p>
          </div>
        </div>

        {/* Card 4: AI Conversion Success */}
        <div className="bg-gradient-to-br from-[#1E1E21] to-[#161618] rounded-2xl border border-[#222226] p-6 flex items-start space-x-4 shadow hover:border-zinc-800 transition">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">চ্যাট অর্ডার কনভার্সন</span>
            <h3 className="text-2xl font-serif font-bold italic text-white mt-1">{aiConversionRate}%</h3>
            <p className="text-xs text-zinc-400 mt-1">
              মোট কাস্টমার টার্গেট: <span className="font-semibold text-zinc-200">{conversations.length} জন</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="dashboard-main-columns font-sans">
        {/* Col 1 & 2: Platform Status and Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Progress: Platforms */}
          <div className="bg-[#161618] rounded-2xl border border-[#222226] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-5">সোশ্যাল চ্যানেল কানেক্টিভিটি স্ট্যাটাস</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Facebook Card */}
              <div className="border border-[#222226] rounded-xl p-4 bg-[#111113]/55 hover:bg-[#111113] transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-md shadow-blue-500/15">
                      f
                    </div>
                    <span className="text-xs font-bold text-zinc-350">Facebook Page</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-sans font-bold text-white">{messengerCount} Conversations</div>
                <p className="text-[10px] text-zinc-500 mt-1">অটোমেটিক মেসেঞ্জার রেসপন্স চালু</p>
              </div>

              {/* Instagram Card */}
              <div className="border border-[#222226] rounded-xl p-4 bg-[#111113]/55 hover:bg-[#111113] transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-400 to-purple-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                      IG
                    </div>
                    <span className="text-xs font-bold text-zinc-350">Instagram DM</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-sans font-bold text-white">{instagramCount} Conversations</div>
                <p className="text-[10px] text-zinc-500 mt-1">অটোমেটিক ডিএম রেসপন্স চালু</p>
              </div>

              {/* WhatsApp Card */}
              <div className="border border-[#222226] rounded-xl p-4 bg-[#111113]/55 hover:bg-[#111113] transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-sm shadow-md">
                      WA
                    </div>
                    <span className="text-xs font-bold text-zinc-350">WhatsApp Business</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-sm font-sans font-bold text-white">{whatsappCount} Conversations</div>
                <p className="text-[10px] text-zinc-500 mt-1">হোয়াটসঅ্যাপ এপিআই ওর্ডার ট্র্যাকিং চালু</p>
              </div>
            </div>
          </div>

          {/* Recent Orders List */}
          <div className="bg-[#161618] rounded-2xl border border-[#222226] shadow-sm" id="dashboard-recent-orders">
            <div className="p-6 border-b border-[#222226] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">সাম্প্রতিক সংগৃহীত অর্ডারসমূহ (সর্বশেষ ৫টি)</h3>
              <button 
                onClick={() => setActiveTab("orders")}
                className="text-indigo-400 hover:text-indigo-300 font-semibold text-xs transition flex items-center space-x-1"
              >
                <span>সব দেখুন</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              {orders.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  এখনো কোনো অর্ডার সংগৃহীত হয়নি। চ্যাট সিমুলেটরে কাস্টমার সেজে প্রথম অর্ডার করে দেখুন!
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#111113] border-b border-[#222226] text-[11px] font-bold text-zinc-400 uppercase">
                      <th className="p-4 pl-6">কাস্টমার</th>
                      <th className="p-4">ঠিকানা ও ফোন</th>
                      <th className="p-4">পণ্য ও বিল</th>
                      <th className="p-4">পেমেন্ট মেথড</th>
                      <th className="p-4 pr-6 text-right">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222226]">
                    {orders.slice(-5).reverse().map((order) => (
                      <tr key={order.id} className="border-b border-[#222125] hover:bg-[#111113]/30 transition text-xs">
                        <td className="p-4 pl-6">
                          <p className="font-semibold text-zinc-200">{order.customerName}</p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{order.createdAt}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-mono text-zinc-400">{order.phone}</p>
                          <p className="text-[10px] text-zinc-500 truncate max-w-[150px] mt-0.5">{order.address}</p>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col text-zinc-350">
                            {order.items.map((item, idx) => (
                              <span key={idx} className="font-medium truncate max-w-[140px]">
                                {item.productName} (x{item.quantity})
                              </span>
                            ))}
                            <span className="font-bold text-indigo-400 mt-0.5 font-sans">৳{order.totalAmount}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[10px] rounded font-bold uppercase ${
                            order.paymentMethod === "Cash on Delivery" 
                              ? "bg-[#222226] text-zinc-400" 
                              : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                          }`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === "Confirmed"
                              ? "bg-green-500/10 text-green-400 border border-green-500/20"
                              : order.status === "Pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : order.status === "Shipped"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-400/20"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Col 3: AI Quick Insights */}
        <div className="space-y-6" id="dashboard-col-insights">
          <div className="bg-[#161618] rounded-2xl border border-[#222226] p-6 shadow-sm">
            <h3 className="text-sm font-bold text-white mb-4">রিয়েল-টাইম কাস্টমার ইনসাইটস</h3>
            
            <div className="space-y-4">
              {/* Feature info */}
              <div className="flex items-start space-x-3 p-3.5 bg-[#111113]/55 rounded-xl border border-[#222226]/50">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg mt-0.5 shrink-0">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">অটোমেটিক বিল সামারি ডিটেকশন</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                    কাস্টমার নাম, ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর, ফুল অ্যাড্রেস ও ক্যাশ অন ডেলিভারি বা বিকাশ সিলেক্ট করলেই এআই রিসিভড বিল ক্যালকুলেট করে মেলাবে।
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 bg-[#111113]/55 rounded-xl border border-[#222226]/50">
                <div className="p-2 bg-pink-500/10 text-pink-400 rounded-lg mt-0.5 shrink-0">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">বিকাশ/নগদ পেমেন্ট ট্র্যাকিং</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                    AI গ্রাহককে আপনার পার্সোনাল/মার্চেন্ট নাম্বারে সেন্ড মানি করতে বলবে এবং ট্রান্সেকশন আইডি (TrxID) দিলে অর্ডার ফাইলে সেভ করে নিবে।
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3.5 bg-[#111113]/55 rounded-xl border border-[#222226]/50">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg mt-0.5 shrink-0">
                  <CheckCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200">হিউম্যান টেকওভার অ্যালার্ট</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
                    কাস্টমার জটিল কোনো রিকোয়েস্ট করলে বা আপনার সাথে কথা বলতে চাইলে সিস্টেম এডমিনকে লাইভ নোটিফিকেশন দিবে টেকওভার করার জন্য।
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick FAQ / Tips for High Sales */}
          <div className="bg-gradient-to-br from-[#1E1E21] to-[#111113] rounded-2xl border border-[#222226] p-6 text-white shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-indigo-400 animate-pulse" />
              <span>মার্চেন্ট টিপস: সেলস ২ গুণ বাড়ান!</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              সঠিক এআই ট্রেনিং এবং আপনার কাস্টম প্রোডাক্ট ক্যাটালগ থাকলে কাস্টমার এসে ফিরে যাবে না। এআই ক্যাটালগ অনুযায়ী স্বতঃস্ফূর্তভাবে বাংলা কথাই কাস্টমারকে বুঝাবে।
            </p>
            <div className="mt-4 pt-4 border-t border-[#222226] flex items-center justify-between text-xs text-zinc-500">
              <span>এআই প্রম্পট স্ট্যাটাস:</span>
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">Optimized</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
