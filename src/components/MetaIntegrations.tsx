import React, { useState } from "react";
import { 
  Key, 
  Check, 
  HelpCircle, 
  Copy, 
  ShieldAlert, 
  ShieldCheck, 
  Globe, 
  Settings, 
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { MetaCredential } from "../types";

interface MetaIntegrationsProps {
  credentials: MetaCredential;
  setCredentials: (credentials: MetaCredential) => void;
}

export default function MetaIntegrations({ credentials, setCredentials }: MetaIntegrationsProps) {
  const [pageId, setPageId] = useState(credentials.pageId);
  const [pageToken, setPageToken] = useState(credentials.pageToken);
  const [appSecret, setAppSecret] = useState(credentials.appSecret);
  const [verifyToken, setVerifyToken] = useState(credentials.verifyToken);
  const [isSaved, setIsSaved] = useState(false);
  
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

  // Auto-calculated fields
  const mockWebhookUrl = `${window.location.origin}/api/webhook`;

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setCredentials({
      pageId,
      pageToken,
      appSecret,
      verifyToken,
      isConnected: pageId !== "" && pageToken !== ""
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCopyText = (text: string, type: "url" | "token") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 3000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 3000);
    }
  };

  return (
    <div className="p-8 space-y-8" id="meta-tab-container">
      {/* Title */}
      <div className="border-b border-slate-100 pb-5" id="meta-tab-header">
        <h2 className="text-2xl font-extrabold text-slate-950 flex items-center space-x-2">
          <Key className="h-6 w-6 text-emerald-600" />
          <span>মেটা হ্যান্ডশেক ও ওয়েবহুক সেটআপ (Official Meta Connect)</span>
        </h2>
        <p className="text-slate-500 text-xs mt-1">
          অফিসিয়াল ও লিগ্যাল মেটা এপিআই কানেক্ট করে আপনার ফেসবুক পেজকে সুরক্ষিত রাখুন
        </p>
      </div>

      {/* Safety Alert (Addresses "account er kono somossa na hoar gurutto") */}
      <div className="bg-emerald-950/10 border border-emerald-900/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4" id="meta-safety-panel">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-widest text-emerald-400">মেটা পলিসি শতভাগ নিরাপদ</h4>
            <p className="text-xs text-slate-200">
              SkillsStoreBD কোনো স্ক্র্যাপার বা অননুমোদিত আনঅফিসিয়াল ক্রোম এক্সটেনশন ব্যবহার করে না। সম্পূর্ণ মেটা ডেভলপার ড্যাশবোর্ড থেকে অফিসিয়াল গ্রাফ এপিআই (Graph API Version v20+) ও ওয়েবহুক সিস্টেম ব্যবহার করায় পেজ সাসপেন্ড বা অ্যাকাউন্ট রেস্ট্রিকশন হওয়ার ০% ঝুঁকি!
            </p>
          </div>
        </div>
        <div className="inline-flex space-x-1.5 bg-emerald-500/10 py-1.5 px-3 rounded-full text-[10px] font-bold text-emerald-400 shrink-0 font-mono border border-emerald-500/20">
          ✓ Verified Official Method
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="meta-split-layout">
        {/* Connection Setup Forms */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center space-x-2">
            <Settings className="h-4 w-4 text-emerald-600" />
            <span>মেটা এপিআই ক্রিডেনশিয়ালস ফরম</span>
          </h3>

          <form onSubmit={handleSaveCredentials} className="space-y-4" id="meta-credentials-form">
            {/* Page ID */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                <span>Facebook Page ID</span>
                <HelpCircle className="h-3 w-3 text-slate-400" title="আপনার পেজের About সেকশনে পাবেন" />
              </label>
              <input 
                type="text" 
                value={pageId}
                onChange={(e) => setPageId(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50 text-slate-800"
                placeholder="যেমন: 104847382749323"
              />
            </div>

            {/* Page Access Token */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                <span>Page Access Token (EAAB...)</span>
                <HelpCircle className="h-3 w-3 text-slate-400" title="Meta Developer Console থেকে সংগৃহীত টোকেন" />
              </label>
              <textarea 
                rows={3}
                value={pageToken}
                onChange={(e) => setPageToken(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50 text-slate-800 font-mono"
                placeholder="EAABxxxxxxxxx..."
              />
              <p className="text-[10px] text-slate-400">মাস্টার পেজ টোকেন যা দিয়ে চ্যাটবট মেসেজ রিসিভ ও অটোমেটিক সেন্ড করে।</p>
            </div>

            {/* App Secret */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Facebook App Secret</label>
              <input 
                type="password" 
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50 text-slate-800 font-mono"
                placeholder="e867ac3b114..."
              />
            </div>

            {/* Webhook Verification Token */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600 flex items-center space-x-1">
                <span>Webhook Verification Token</span>
                <HelpCircle className="h-3 w-3 text-slate-400" title="যেকোনো একটি গোপন শব্দ বা কোড যা কাস্টমাইজড" />
              </label>
              <input 
                type="text" 
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 bg-slate-50/50 text-slate-800 font-mono"
                placeholder="SkillsStoreBDVerify123"
                required
              />
              <p className="text-[10px] text-slate-400">ফেসবুক ডেভলপার সেটআপে ভেরিফাই করার জন্য এটি এন্ট্রি করতে হবে।</p>
            </div>

            {/* Check Save status */}
            <button
              type="submit"
              id="meta-save-btn"
              className="w-full py-3 bg-emerald-600 text-slate-950 font-bold text-xs tracking-wider rounded-xl hover:bg-emerald-500 active:bg-emerald-700 transition shadow block cursor-pointer"
            >
              {isSaved ? "সফলভাবে সেটআপ সংরক্ষিত হয়েছে!" : "মেটা ক্রিডেনশিয়ালস সেভ করুন"}
            </button>
          </form>

          {/* Webhook Auto-calculated links for pasting to FB platform */}
          <div className="pt-4 border-t border-slate-100 space-y-3" id="meta-webhook-pasting">
            <h4 className="text-xs font-bold text-slate-700">ফেসবুক ডেভলপারের জন্য কোড লিঙ্কসমূহ:</h4>
            
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">1. Webhook Callback URL:</span>
                <button 
                  onClick={() => handleCopyText(mockWebhookUrl, "url")}
                  className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center space-x-1"
                >
                  {copiedUrl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUrl ? "কপি হয়েছে" : "কপি ইউআরএল"}</span>
                </button>
              </div>
              <p className="text-[11px] font-mono select-all break-all bg-white border border-slate-100 p-2 text-slate-700 rounded-lg">{mockWebhookUrl}</p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500">2. Verify Token Code:</span>
                <button 
                  onClick={() => handleCopyText(verifyToken, "token")}
                  className="text-[10px] text-emerald-600 font-bold hover:underline flex items-center space-x-1"
                >
                  {copiedToken ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedToken ? "কপি হয়েছে" : "কপি টোকেন"}</span>
                </button>
              </div>
              <p className="text-[11px] font-mono select-all bg-white border border-slate-100 p-2 text-slate-700 rounded-lg">{verifyToken || "VerifyToken value not set yet"}</p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Bangla Instruction Guide */}
        <div className="bg-slate-900 text-slate-200 rounded-2xl p-6 border border-slate-800 space-y-6 overflow-y-auto max-h-[850px]" id="meta-bangla-instructions">
          <div>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded font-bold uppercase tracking-wide">
              Official Step-by-Step Bangla Guide
            </span>
            <h3 className="text-lg font-bold text-white mt-3">৫ মিনিটে ফেসবুক পেজে অফিসিয়াল কানেক্টিং গাইডলাইনস</h3>
            <p className="text-xs text-slate-450 mt-1">এই ৫টি ধাপ ফলো করে আজই কোনো ডোমেইন বা অ্যাকাউন্টের সমস্যা ছাড়াই সেলস এপিআই চালু করুন</p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed text-slate-300" id="inst-steps">
            {/* Step 1 */}
            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
              <p className="font-bold text-white">ধাপ ১: মেটা ডেভলপার অ্যাকাউন্ট ক্রিয়েট</p>
              <p>
                প্রথমে <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline inline-flex items-center space-x-0.5"><span>developers.facebook.com</span><ExternalLink className="h-3 w-3" /></a> সাইটে গিয়ে আপনার নরমাল ফেসবুক আইডি দিয়ে লগইন করুন এবং একটি "Business" টাইপ ডেভেলপার অ্যাপ তৈরি করুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
              <p className="font-bold text-white">ধাপ ২: মেসেঞ্জার ও হোয়াটসঅ্যাপ অপশন চালু</p>
              <p>
                অ্যাপ ড্যাশবোর্ডে গিয়ে "Add Product" থেকে **Messenger** এবং **Instagram Graph API** এড করুন। এটি আপনার ইনবক্স পড়ার অ্যাক্সেস রিকোয়েস্ট তৈরি করে।
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
              <p className="font-bold text-white">ধাপ ৩: পেজ টোকেন ও পারমিশন জেনারেট</p>
              <p>
                মেসেঞ্জার সেটিংসের "Token Generation" সেকশনে গিয়ে আপনার স্পেসিফিক পেজটি সিলেক্ট করে **Generate Token** এ ক্লিক করুন। এরপর `pages_messaging`, `pages_manage_metadata` এবং `instagram_basic` পারমিশনগুলোতে টিক মার্ক দিয়ে তৈরি হওয়া বড় "EAAB..." টোকেনটি কপি করে বাম পাশের ফরমের **Page Access Token** ঘরে বসিয়ে দিন।
              </p>
            </div>

            {/* Step 4 */}
            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
              <p className="font-bold text-white">ধাপ ৪: ওয়েবহুক কনফিগ করুন</p>
              <p>
                অ্যাপের ওয়েবহুক সেটিংসের "Subscribe to Webhook" এ ক্লিক করুন। বাম পাশে কষাকৃত কফি করা **Webhook Callback URL** এবং **Verify Token** কপি করে নিয়ে মেটা প্যানেলের উইজেটে সাবমিট করুন। ভেরিফাই হয়ে যাবে ইন্সট্যান্টলি!
              </p>
            </div>

            {/* Step 5 */}
            <div className="border-l-2 border-emerald-500 pl-4 space-y-1">
              <p className="font-bold text-white">ধাপ ৫: মেসেজ ইভেন্ট সাবস্ক্রাইব</p>
              <p>
                ভেরিফিকেশন সম্পন্ন হওয়ার পর Webhook Fields সেকশন থেকে অবশ্যই **messages** এবং **messaging_postbacks** ইভেন্টগুলো "Subscribe" বাটন টগল করে দিন। ব্যাস! কাস্টমার মেসেজ দিলেই এআই অটোপাইলট উত্তর দেওয়া শুরু করবে এবং আপনার সেল্স ড্যাশবোর্ডে ট্র্যাক হবে।
              </p>
            </div>
          </div>

          {/* BD Account Safety Guidelines Warnings */}
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-xl space-y-2 text-[11px]" id="meta-safety-info">
            <div className="flex items-center space-x-1.5 font-bold text-amber-300">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>পেজ নিরাপদ রাখার জরুরি মার্চেন্ট সতর্কতা:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-300 leading-normal pl-1">
              <li>অস্থির হয়ে একই কাস্টমারকে সেকেন্ডে ৫-১০ বার এপিআই ট্রিক রিপ্লাই করাবেন না।</li>
              <li>গ্রাহকের প্রথম রিকোয়েস্টের পর ২৪ ঘন্টার মধ্যে রিপ্লাই শেষ করতে হবে মেটা প্রো-টোকল অনুযায়ী।</li>
              <li>উন্মুক্ত এআই ব্যবহার করায় বিকাশ/নগদ রেফ কোড ছাড়া ম্যানুয়ালি মার্চেন্ট ক্যাশে পেমেন্ট বুকিং ডবল চেক করাই সবচেয়ে বুদ্ধিমানের কাজ।</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
