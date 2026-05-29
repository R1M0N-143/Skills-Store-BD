import React, { useState } from "react";
import { 
  Settings, 
  Plus, 
  Trash2, 
  Bot, 
  Info, 
  HelpCircle, 
  Check, 
  Sparkles,
  DollarSign,
  Phone,
  Truck
} from "lucide-react";
import { BusinessProfile, Product, FAQ } from "../types";

interface AIConfiguratorProps {
  profile: BusinessProfile;
  setProfile: (profile: BusinessProfile) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  faqs: FAQ[];
  setFaqs: (faqs: FAQ[]) => void;
}

export default function AIConfigurator({
  profile,
  setProfile,
  products,
  setProducts,
  faqs,
  setFaqs
}: AIConfiguratorProps) {
  
  // Profile inputs state
  const [storeName, setStoreName] = useState(profile.storeName);
  const [phone, setPhone] = useState(profile.phone);
  const [bkashNumber, setBkashNumber] = useState(profile.bkashNumber);
  const [bkashType, setBkashType] = useState(profile.bkashType);
  const [nagadNumber, setNagadNumber] = useState(profile.nagadNumber);
  const [nagadType, setNagadType] = useState(profile.nagadType);
  const [deliveryInside, setDeliveryInside] = useState(profile.deliveryInsideDhaka);
  const [deliveryOutside, setDeliveryOutside] = useState(profile.deliveryOutsideDhaka);
  const [aiTone, setAiTone] = useState(profile.aiTone);
  const [aiLanguageStyle, setAiLanguageStyle] = useState(profile.aiLanguageStyle);

  // New Product inputs
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdStock, setNewProdStock] = useState("");
  const [newProdDesc, setNewProdDesc] = useState("");

  // New FAQ inputs
  const [newFAQQuestion, setNewFAQQuestion] = useState("");
  const [newFAQAnswer, setNewFAQAnswer] = useState("");

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      storeName,
      phone,
      bkashNumber,
      bkashType,
      nagadNumber,
      nagadType,
      deliveryInsideDhaka: Number(deliveryInside),
      deliveryOutsideDhaka: Number(deliveryOutside),
      aiTone,
      aiLanguageStyle
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) return;
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProdName,
      price: Number(newProdPrice),
      stock: Number(newProdStock) || 50,
      description: newProdDesc
    };
    setProducts([...products, newProduct]);
    // reset
    setNewProdName("");
    setNewProdPrice("");
    setNewProdStock("");
    setNewProdDesc("");
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddFAQ = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFAQQuestion || !newFAQAnswer) return;
    const newFAQ: FAQ = {
      id: Math.random().toString(36).substr(2, 9),
      question: newFAQQuestion,
      answer: newFAQAnswer
    };
    setFaqs([...faqs, newFAQ]);
    setNewFAQQuestion("");
    setNewFAQAnswer("");
  };

  const handleDeleteFAQ = (id: string) => {
    setFaqs(faqs.filter(f => f.id !== id));
  };

  return (
    <div className="p-8 space-y-8" id="configurator-tab">
      {/* Title Header */}
      <div className="flex items-center justify-between" id="config-header">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 flex items-center space-x-2">
            <Settings className="h-6 w-6 text-emerald-600" />
            <span>স্টোর ও এআই ট্রেনিং কনফিগারেটর</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">আপনার স্টোরের পণ্যতালিকা, সাপোর্ট ওয়ালেট এবং এআই চ্যাট করার ভঙ্গি ট্রেনিং সেটআপ করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="config-grid">
        {/* Col 1: Store & Wallet settings */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5" id="profile-form">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
              <Bot className="h-4 w-4 text-emerald-600" />
              <span>১. স্টোর ও এআই প্রোফাইল</span>
            </h3>

            {/* Store Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">স্টোরের নাম (Store Name)</label>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                placeholder="যেমন: SkillsStoreBD"
              />
            </div>

            {/* Helpline phone */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">হেল্পলাইন নম্বর (Phone)</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                placeholder="যেমন: 01712345678"
              />
            </div>

            {/* bKash Number */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-600">বিকাশ নম্বর</label>
                <input 
                  type="text" 
                  value={bkashNumber} 
                  onChange={(e) => setBkashNumber(e.target.value)} 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="বিকাশ নম্বর"
                />
              </div>
              <div className="col-span-1 space-y-1">
                <label className="text-xs font-bold text-slate-600">টাইপ</label>
                <select 
                  value={bkashType} 
                  onChange={(e) => setBkashType(e.target.value as any)} 
                  className="w-full text-xs px-2 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white bg-slate-50/50"
                >
                  <option value="personal">Personal</option>
                  <option value="merchant">Merchant</option>
                </select>
              </div>
            </div>

            {/* Nagad Number */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-bold text-slate-600">নগদ নম্বর</label>
                <input 
                  type="text" 
                  value={nagadNumber} 
                  onChange={(e) => setNagadNumber(e.target.value)} 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="নগদ নম্বর"
                />
              </div>
              <div className="col-span-1 space-y-1">
                <label className="text-xs font-bold text-slate-600">টাইপ</label>
                <select 
                  value={nagadType} 
                  onChange={(e) => setNagadType(e.target.value as any)} 
                  className="w-full text-xs px-2 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white bg-slate-50/50"
                >
                  <option value="personal">Personal</option>
                  <option value="merchant">Merchant</option>
                </select>
              </div>
            </div>

            {/* Delivery Cost inside Dhaka */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block truncate">ডেলিভারি (ঢাকা সিটি)</label>
                <input 
                  type="number" 
                  value={deliveryInside} 
                  onChange={(e) => setDeliveryInside(Number(e.target.value))} 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="60"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block truncate">ডেলিভারি (ঢাকার বাইরে)</label>
                <input 
                  type="number" 
                  value={deliveryOutside} 
                  onChange={(e) => setDeliveryOutside(Number(e.target.value))} 
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="120"
                />
              </div>
            </div>

            {/* AI Tone Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">এআই এর কথার সুর (AI Tone)</label>
              <select 
                value={aiTone} 
                onChange={(e) => setAiTone(e.target.value as any)} 
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white bg-slate-50/50"
              >
                <option value="friendly">মিষ্টি ও বন্ধুত্বপূর্ণ (Friendly - জি আপু/ভাইয়া)</option>
                <option value="professional">প্রফেশনাল ও ডিরেক্ট (Professional - তথ্যবহুল)</option>
                <option value="enthusiastic">উত্তেজনাপূর্ণ ও সেলস ওরিয়েন্টেড (Enthusiastic)</option>
              </select>
            </div>

            {/* AI Language Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">ভাষা ও লিখনশৈলী (AI Style)</label>
              <select 
                value={aiLanguageStyle} 
                onChange={(e) => setAiLanguageStyle(e.target.value as any)} 
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:bg-white bg-slate-50/50"
              >
                <option value="standard_bangla">প্রমিত সাধু/চলিত বাংলা (Standard Bangla - চমৎকার)</option>
                <option value="colloquial_bangla">আঞ্চলিক/কথ্য বাংলা (Colloquial Bangla - নিচ্ছেন, পাচ্ছেন)</option>
                <option value="banglish">বাংলিশ চ্যাট ফরম্যাট (Banglish - Kemon achen? Order)</option>
              </select>
            </div>

            {/* Save Button */}
            <button 
              type="submit" 
              id="save-profile-btn"
              className="w-full py-3 bg-emerald-600 text-slate-950 font-bold text-xs tracking-wider rounded-xl transition-all shadow-md hover:bg-emerald-500 active:bg-emerald-700 cursor-pointer flex items-center justify-center space-x-1"
            >
              {saveSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>সফলভাবে সেভ হয়েছে!</span>
                </>
              ) : (
                <span>এআই মডেল আপডেট করুন</span>
              )}
            </button>
          </form>
        </div>

        {/* Col 2 & 3: Product Management & FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Products management */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-emerald-600" />
                <span>২. ক্যাটালগ প্রোডাক্টস লিস্ট (Products)</span>
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-mono font-bold">
                {products.length} Products Available
              </span>
            </h3>

            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4 max-h-[290px] overflow-y-auto pr-1" id="config-products-list">
              {products.length === 0 ? (
                <div className="col-span-full py-6 text-center text-slate-400 text-xs">
                  কোনো প্রোডাক্ট যোগ করা হয়নি। নিচে প্রোডাক্টের নাম ও প্রাইস দিয়ে যোগ করুন!
                </div>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="p-3.5 border border-slate-100 rounded-xl bg-slate-50/50 flex flex-col justify-between relative group hover:border-emerald-500/35 transition" id={`product-card-${p.id}`}>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="absolute top-2.5 right-2.5 p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-150"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 pr-5 truncate">{p.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 h-7">{p.description || "No description provided."}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] border-t border-slate-100 pt-2 font-mono">
                      <span className="text-emerald-700 font-extrabold text-xs">৳{p.price}</span>
                      <span className="text-slate-500">স্টক: {p.stock}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add product form panel */}
            <form onSubmit={handleAddProduct} className="mt-4 p-4 border border-dashed border-slate-200 bg-slate-50/20 rounded-xl space-y-3" id="add-product-form">
              <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Plus className="h-3.5 w-3.5 text-emerald-600" />
                <span>নতুন পণ্য যোগ করুন (Add Product)</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="text" 
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 md:col-span-2"
                  placeholder="পণ্যের নাম (যেমন: Tangail Saree, Honey)"
                  required
                />
                <input 
                  type="number" 
                  value={newProdPrice}
                  onChange={(e) => setNewProdPrice(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 col-span-1"
                  placeholder="BDT ৳ দাম"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input 
                  type="number" 
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 md:col-span-1"
                  placeholder="স্টক কদর (ডিফল্ট: ৫০)"
                />
                <input 
                  type="text" 
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 md:col-span-2"
                  placeholder="সংক্ষিপ্ত বিবরণ (যেমন: ১০০% পিউর কটন, সুন্দরবন থেকে সংগৃহীত)"
                />
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  type="submit" 
                  id="add-product-submit"
                  className="px-5 py-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-800 rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>এড প্রোডাক্ট</span>
                </button>
              </div>
            </form>
          </div>

          {/* Section: Custom Knowledge Base / FAQs */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-emerald-600" />
                <span>৩. কাস্টম নলেজ বেজ ও প্রশ্নোত্তর (Trainer FAQ)</span>
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded font-mono font-bold">
                {faqs.length} Training Questions
              </span>
            </h3>

            {/* FAQs list list */}
            <div className="space-y-3 py-4 max-h-[220px] overflow-y-auto pr-1" id="config-faqs-list">
              {faqs.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs">
                  এখনো কোনো প্রশ্নোত্তর যোগ করা হয়নি। নিচে এআই কে ট্রেইন করার জন্য কাস্টম প্রশ্নোত্তর যোগ করুন!
                </div>
              ) : (
                faqs.map((f) => (
                  <div key={f.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50/50 relative group flex items-start justify-between" id={`faq-card-${f.id}`}>
                    <div className="space-y-1.5 pr-8">
                      <p className="font-bold text-xs text-slate-800">প্রশ্ন: {f.question}</p>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-sans">{f.answer}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteFAQ(f.id)}
                      className="p-1 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-100 rounded-lg shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition duration-150"
                      title="মুছে ফেলুন"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Add FAQ form panel */}
            <form onSubmit={handleAddFAQ} className="p-4 border border-dashed border-slate-200 bg-slate-50/20 rounded-xl space-y-3" id="add-faq-form">
              <h4 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                <Plus className="h-3.5 w-3.5 text-emerald-600" />
                <span>নতুন প্রশ্নোত্তর দিয়ে ট্রেইন করান (Train AI)</span>
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input 
                  type="text" 
                  value={newFAQQuestion}
                  onChange={(e) => setNewFAQQuestion(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="প্রশ্ন (যেমন: শোরুম কোথায়? আপনাদের ডেলিভারি টাইম কত?)"
                  required
                />
                <input 
                  type="text" 
                  value={newFAQAnswer}
                  onChange={(e) => setNewFAQAnswer(e.target.value)}
                  className="text-xs px-3 py-2 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="উত্তর (যেমন: আমাদের শোরুম মিরপুর-১০, ঢাকাতে। ডেলিভারি টাইম ১-২ দিন।)"
                  required
                />
              </div>

              <div className="flex justify-end pt-1">
                <button 
                  type="submit" 
                  id="add-faq-submit"
                  className="px-5 py-2 bg-slate-900 text-slate-50 font-bold hover:bg-slate-800 rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>ট্রেইনারে যোগ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
