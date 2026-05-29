export interface BusinessProfile {
  storeName: string;
  phone: string;
  bkashNumber: string;
  bkashType: "personal" | "merchant";
  nagadNumber: string;
  nagadType: "personal" | "merchant";
  deliveryInsideDhaka: number;
  deliveryOutsideDhaka: number;
  aiTone: "friendly" | "professional" | "enthusiastic";
  aiLanguageStyle: "standard_bangla" | "colloquial_bangla" | "banglish";
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "bKash" | "Nagad" | "Cash on Delivery";
  paymentRef?: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Cancelled";
}

export interface Message {
  id: string;
  sender: "customer" | "ai" | "seller";
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customerName: string;
  customerPhone?: string;
  platform: "messenger" | "instagram" | "whatsapp";
  messages: Message[];
  status: "active" | "completed" | "needs_action";
  lastMessageTime: string;
  currentDraft?: string;
}

export interface MetaCredential {
  pageId: string;
  pageToken: string;
  appSecret: string;
  verifyToken: string;
  isConnected: boolean;
}
