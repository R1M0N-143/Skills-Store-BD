import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AIConfigurator from "./components/AIConfigurator";
import ChatInbox from "./components/ChatInbox";
import OrdersList from "./components/OrdersList";
import MetaIntegrations from "./components/MetaIntegrations";
import { BusinessProfile, Product, FAQ, Order, Conversation, MetaCredential } from "./types";
import { Sparkles, ShoppingBag, Bot, AlertCircle, CheckCircle2 } from "lucide-react";

// Pre-populated high-fidelity Bangladeshi E-comm Demo Data
const initialProfile: BusinessProfile = {
  storeName: "SkillsStoreBD Handloom Craft",
  phone: "01712000333",
  bkashNumber: "01712000444",
  bkashType: "personal",
  nagadNumber: "01998000777",
  nagadType: "merchant",
  deliveryInsideDhaka: 60,
  deliveryOutsideDhaka: 120,
  aiTone: "friendly",
  aiLanguageStyle: "standard_bangla"
};

const initialProducts: Product[] = [
  {
    id: "p1",
    name: "ঐতিহ্যবাহী টাঙ্গাইল সুতি জামদানি শাড়ি (Traditional Saree)",
    price: 4500,
    stock: 15,
    description: "১০০% কটন পিওর সুতা ও রেশম সুতা দিয়ে টাঙ্গাইলের দক্ষ কারিগরের হাতে বোনা ঐতিহ্যবাহী জামদানি শাড়ি।"
  },
  {
    id: "p2",
    name: "রসুন-কালিজিরা প্রিমিয়াম সুতি পাঞ্জাবি (Premium Panjabi)",
    price: 1850,
    stock: 35,
    description: "খাঁটি সুতি আরামদায়ক কাপড়, আধুনিক স্লিম ফিট কাটিং ও গর্জিয়াস এমব্রয়ডারি বাটন ডেকোরেশন।"
  },
  {
    id: "p3",
    name: "সুন্দরবনের প্রাকৃতিক প্রাকৃতিক খলিশা মধু (Organic Honey)",
    price: 850,
    stock: 50,
    description: "সুন্দরবনের গহীন বন থেকে চাক কেটে আনা ১০০% খাঁটি কাঁচা খলিশা ফুলের তরল ও সুমিষ্ট মধু (১ কেজি জার)।"
  }
];

const initialFAQs: FAQ[] = [
  {
    id: "f1",
    question: "আপনাদের অফিসের বা শোরুমের ঠিকানা কোথায়?",
    answer: "আপাতত আমাদের কোনো রিটেইল শোরুম বা আউটলেট নেই ভাইয়া। মিরপুর ১০, ঢাকা থেকে আমাদের অনলাইন প্ল্যাটফর্ম পরিচালিত হয় এবং হোম ডেলিভারি দিয়ে থাকি।"
  },
  {
    id: "f2",
    question: "ডেলিভারি চার্জ ও সময় কত দিন?",
    answer: "ঢাকা সিটির ভেতর আমাদের ডেলিভারি চার্জ মাত্র ৬০ টাকা এবং ১-২ দিনের মধ্যে পেয়ে যাবেন। ঢাকার বাইরে চার্জ ১২০ টাকা এবং ৩-৪ দিনের মধ্যে কুরিয়ারে পেয়ে যাবেন।"
  }
];

const initialConversations: Conversation[] = [
  {
    id: "c1",
    customerName: "মাহমুদ হাসান কাফি",
    customerPhone: "01798765432",
    platform: "messenger",
    messages: [
      {
        id: "m-init",
        sender: "customer",
        text: "আসসালামু আলাইকুম ভাইয়া। সুতি পাঞ্জাবি যেটা আছে ঐটার স্টক কি এভেইলেবল আছে?",
        timestamp: "04:30 PM"
      },
      {
        id: "m-reply",
        sender: "ai",
        text: "ওয়ালাইকুম আসসালাম কাফি ভাইয়া! আশা করি ভালো আছেন। জি আমাদের 'রসুন-কালিজিরা প্রিমিয়াম সুতি পাঞ্জাবি'টি আমাদের ক্যাটালগে স্টক এভেইলেবল আছে ভাইয়া। এটির প্রাইস ১৮৫০ টাকা। আপনি কি অর্ডার করতে চান?",
        timestamp: "04:31 PM"
      }
    ],
    status: "active",
    lastMessageTime: "04:31 PM"
  },
  {
    id: "c2",
    customerName: "সুমাইয়া জান্নাত আফরিন",
    customerPhone: "01815123456",
    platform: "instagram",
    messages: [
      {
        id: "m-inst-1",
        sender: "customer",
        text: "Hello! Jamdani saree er color change available hobe naki? price bdt 4500 e rakha jabe?",
        timestamp: "02:18 PM"
      },
      {
        id: "m-inst-2",
        sender: "ai",
        text: "Assalamu Alaikum Afrin apu! traditional Jamdani saree er automatic price ৳4,500. customizable color stock thakbe. order confirm korte chaile full details pathayen.",
        timestamp: "02:20 PM"
      }
    ],
    status: "active",
    lastMessageTime: "02:20 PM"
  },
  {
    id: "c3",
    customerName: "আব্দুল আহাদ চৌধুরী",
    platform: "whatsapp",
    messages: [
      {
        id: "m-wa-1",
        sender: "customer",
        text: "১ কেজি খলিশা মধু অর্ডার করতে চাই। ঢাকা ক্যান্টনমেন্টে ডেলিভারি দেন আপনারা?",
        timestamp: "Yesterday"
      }
    ],
    status: "active",
    lastMessageTime: "Yesterday"
  }
];

const initialOrders: Order[] = [
  {
    id: "O-834928",
    createdAt: "May 28, 2026",
    customerName: "আরিফুল ইসলাম রোমান",
    phone: "01823456789",
    address: "চকবাজার কলোনী, চকবাজার, চট্টগ্রাম",
    items: [
      {
        productId: "p3",
        productName: "সুন্দরবনের প্রাকৃতিক প্রাকৃতিক খলিশা মধু (Organic Honey)",
        quantity: 1,
        price: 850
      }
    ],
    totalAmount: 970, // 850 + 120 delivery
    paymentMethod: "bKash",
    paymentRef: "9JKX8DE2",
    status: "Confirmed"
  },
  {
    id: "O-748392",
    createdAt: "May 29, 2026",
    customerName: "সাদিয়া আফরিন ন্যান্সি",
    phone: "01511234568",
    address: "হাউজ ১২, রোড ৫, ধানমন্ডি, ঢাকা",
    items: [
      {
        productId: "p2",
        productName: "রসুন-কালিজিরা প্রিমিয়াম সুতি পাঞ্জাবি (Premium Panjabi)",
        quantity: 1,
        price: 1850
      }
    ],
    totalAmount: 1910, // 1850 + 60 delivery
    paymentMethod: "Cash on Delivery",
    status: "Pending"
  }
];

const initialMeta: MetaCredential = {
  pageId: "",
  pageToken: "",
  appSecret: "",
  verifyToken: "SKILLS_STORE_VERIFY_TOKEN_BD_E_COMM_2026",
  isConnected: false
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Load state from local storage or fallback to defaults
  const [profile, setProfile] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem("skillsstore_profile");
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("skillsstore_products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [faqs, setFaqs] = useState<FAQ[]>(() => {
    const saved = localStorage.getItem("skillsstore_faqs");
    return saved ? JSON.parse(saved) : initialFAQs;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem("skillsstore_conversations");
    return saved ? JSON.parse(saved) : initialConversations;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("skillsstore_orders");
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [credentials, setCredentials] = useState<MetaCredential>(() => {
    const saved = localStorage.getItem("skillsstore_credentials");
    return saved ? JSON.parse(saved) : initialMeta;
  });

  const [orderNotif, setOrderNotif] = useState<string | null>(null);

  // Sync state to local storage on edits
  useEffect(() => {
    localStorage.setItem("skillsstore_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("skillsstore_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("skillsstore_faqs", JSON.stringify(faqs));
  }, [faqs]);

  useEffect(() => {
    localStorage.setItem("skillsstore_conversations", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem("skillsstore_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("skillsstore_credentials", JSON.stringify(credentials));
  }, [credentials]);

  // Hook triggered when AI successfully detects order elements
  const handleOrderDetected = (detectedData: any) => {
    if (!detectedData) return;

    // Smart logic for delivery calculation inside/outside Dhaka
    const addressStr = detectedData.address || "";
    const isDhaka = addressStr.includes("ঢাকা") || addressStr.toLowerCase().includes("dhaka") || addressStr.includes("মিরপুর") || addressStr.includes("ধানমন্ডি") || addressStr.includes("উত্তরা") || addressStr.includes("বনানী");
    const deliveryCost = isDhaka ? profile.deliveryInsideDhaka : profile.deliveryOutsideDhaka;

    // Compute bill prices
    let itemsComputed: any[] = [];
    let subtotal = 0;

    if (detectedData.items && Array.isArray(detectedData.items)) {
      detectedData.items.forEach((item: any) => {
        // Try to match pricing in database active product catalog otherwise fallback to safe default BDT
        const dbProduct = products.find(p => p.name.includes(item.productName) || item.productName.includes(p.name));
        const price = dbProduct ? dbProduct.price : 1000;
        const finalName = dbProduct ? dbProduct.name : item.productName;

        itemsComputed.push({
          productId: dbProduct ? dbProduct.id : "matched-item",
          productName: finalName,
          quantity: item.quantity || 1,
          price: price
        });

        subtotal += price * (item.quantity || 1);
      });
    } else {
      // Create single item fallback
      const defaultProduct = products[0];
      itemsComputed.push({
        productId: defaultProduct.id,
        productName: defaultProduct.name,
        quantity: 1,
        price: defaultProduct.price
      });
      subtotal = defaultProduct.price;
    }

    const totalAmount = subtotal + deliveryCost;

    const newOrder: Order = {
      id: "O-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) + " (AI)",
      customerName: detectedData.customerName || "গ্রাহক",
      phone: detectedData.phone || "01xxxxxxxxx",
      address: detectedData.address || "বাংলাদেশ",
      items: itemsComputed,
      totalAmount: totalAmount,
      paymentMethod: detectedData.paymentMethod || "Cash on Delivery",
      paymentRef: detectedData.paymentRef || undefined,
      status: "Pending"
    };

    setOrders(prev => [...prev, newOrder]);
    
    // Sparkle user notification feedback
    setOrderNotif(`মাস্টার অর্ডার খাতায় #${newOrder.id} (${newOrder.customerName}) সফলভাবে সংরক্ষিত হয়েছে!`);
    setTimeout(() => setOrderNotif(null), 6000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E1E1E6] flex flex-row font-sans" id="applet-viewport">
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        storeName={profile.storeName}
      />

      {/* Main viewport panels */}
      <main className="flex-1 overflow-y-auto relative h-screen bg-[#0A0A0B]">
        {/* Custom App topbar for alerts & stats summaries */}
        <div className="bg-[#111113] border-b border-[#222226] flex items-center justify-between px-8 py-3.5 sticky top-0 z-40" id="topbar-container">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
            <span className="text-[11px] font-bold text-zinc-400 font-mono tracking-widest uppercase">
              SkillsStoreBD AI Core Live
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Quick status wallets indicators */}
            <div className="flex items-center space-x-2 text-[10px] font-sans font-semibold text-zinc-400">
              <span className="px-2 py-0.5 bg-[#161618] border border-[#222226] rounded text-zinc-300">
                bKash Wallet: {profile.bkashNumber ? "Active" : "None"}
              </span>
              <span className="px-2 py-0.5 bg-[#161618] border border-[#222226] rounded text-zinc-300">
                Nagad Wallet: {profile.nagadNumber ? "Active" : "None"}
              </span>
            </div>
          </div>
        </div>

        {/* Global Success Banner/Notif when order is added */}
        {orderNotif && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-[#161618] border-2 border-indigo-500/35 text-white py-3.5 px-6 rounded-2xl flex items-center space-x-3 shadow-2xl z-50 animate-bounce max-w-lg w-full">
            <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
            <div className="text-xs">
              <p className="font-extrabold text-[#E1E1E6]">🎉 এআই কাস্টমার অর্ডার বুক করেছে!</p>
              <p className="text-zinc-400 mt-0.5 font-medium">{orderNotif}</p>
            </div>
          </div>
        )}

        {/* Content routing wrapper */}
        <div id="main-content-panels">
          {activeTab === "dashboard" && (
            <Dashboard 
              orders={orders} 
              conversations={conversations} 
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "chat" && (
            <ChatInbox
              conversations={conversations}
              setConversations={setConversations}
              businessProfile={profile}
              products={products}
              faqs={faqs}
              onOrderDetected={handleOrderDetected}
            />
          )}

          {activeTab === "config" && (
            <AIConfigurator
              profile={profile}
              setProfile={setProfile}
              products={products}
              setProducts={setProducts}
              faqs={faqs}
              setFaqs={setFaqs}
            />
          )}

          {activeTab === "orders" && (
            <OrdersList
              orders={orders}
              setOrders={setOrders}
              products={products}
              businessProfile={profile}
            />
          )}

          {activeTab === "meta" && (
            <MetaIntegrations
              credentials={credentials}
              setCredentials={setCredentials}
            />
          )}
        </div>
      </main>
    </div>
  );
}
