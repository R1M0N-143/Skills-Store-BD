import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// REST API endpoint for AI responses
app.post("/api/chat", async (req, res) => {
  try {
    const { message, chatHistory, businessProfile, products, faqs } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getAiClient();

    // Construct the context instructions dynamically
    const storeName = businessProfile?.storeName || "Our Shop";
    const phone = businessProfile?.phone || "";
    const bKash = businessProfile?.bkashNumber ? `${businessProfile.bkashNumber} (${businessProfile.bkashType})` : "Not provided";
    const Nagad = businessProfile?.nagadNumber ? `${businessProfile.nagadNumber} (${businessProfile.nagadType})` : "Not provided";
    const deliveryIn = businessProfile?.deliveryInsideDhaka ?? 60;
    const deliveryOut = businessProfile?.deliveryOutsideDhaka ?? 120;
    
    // Format products
    const productListText = products && products.length > 0 
      ? products.map((p: any) => `- Name: ${p.name}, Price: ৳${p.price}, Stock: ${p.stock}, Description: ${p.description}`).join("\n")
      : "No specific products listed. Act dynamically.";

    // Format FAQs
    const faqListText = faqs && faqs.length > 0
      ? faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n")
      : "No specific FAQs loaded.";

    // Language guidelines
    let languageGuide = "";
    if (businessProfile?.aiLanguageStyle === "colloquial_bangla") {
      languageGuide = "Use colloquial Bangla (e.g., standard regional or informal words like 'পাচ্ছেন', 'নিচ্ছেন', 'অর্ডার', 'ঠিকানাটা দিবেন') while retaining high politeness and warmth.";
    } else if (businessProfile?.aiLanguageStyle === "banglish") {
      languageGuide = "Use Banglish (Bangla words written with English letters or a mixed syntax such as 'Apun ke welcome amader shop e! Oder korte can?') - very common among young consumers in Bangladesh.";
    } else {
      languageGuide = "Use beautiful standard Bangla with fluent, polite language. Start greetings with 'Assalamu Alaikum' (আসসালামু আলাইকুম) or 'Nomoshkar' reflecting high hospitality.";
    }

    const toneGuide = businessProfile?.aiTone === "friendly" 
      ? "super friendly, eager, warm, using cheerful polite phrases ('জি ভাইয়া/আপু', 'অবশ্যই সাহায্য করছি')."
      : businessProfile?.aiTone === "enthusiastic"
      ? "extremely passionate, sales-driven, highlighting discounts, offers, and best features of the product."
      : "professional, quick, direct, business-oriented but polite.";

    const systemInstruction = `You are a real-life native Bangladeshi Sales Representative and Customer Success Assistant for the online store "${storeName}". 
Your main objective is to answer customers in a warm, helpful manner, share product details and pricing in BDT (৳), and seamlessly guide them to place an order.

CRITICAL IDENTITY & BEHAVIOR:
1. Always behave as if you are a real human team member of ${storeName}. NEVER mention that you are an AI model, Gemini, or a large language model.
2. Tone: ${toneGuide}
3. Language format: ${languageGuide}
4. Always state prices in Bangladeshi Taka (BDT / ৳).
5. Payment choices:
   - Cash on Delivery (COD) is available.
   - bKash: ${bKash}
   - Nagad: ${Nagad}
6. Delivery Charges:
   - Inside Dhaka: ৳${deliveryIn} (deliver within 24-48 hours)
   - Outside Dhaka: ৳${deliveryOut} (deliver within 3-4 days)

ORDER PROCESSING PROTOCOL:
When a customer wants to buy, politely collect the following 4 details step-by-step or check if they already provided them:
- Product Details (the exact item and quantity they want to buy. Ensure the item is selected from our listed products).
- Customer Name.
- Customer Contact Mobile Phone Number (Must be a 11-digit Bangladeshi mobile number starting with 01, e.g. 01712345678, 019..., 018..., 015..., 016..., 013..., 014...).
- Delivery Address inside Bangladesh.
- Preferred Payment Method (Cash on Delivery, bKash, or Nagad). If they select bKash/Nagad, ask them to send money to the respective number and provide the last 4 digits of the payment transaction ID or Reference.

ORDER SUMMATION & DETECTOR:
Double-check if the user has provided all information needed for the order.
Once (and ONLY once) you have obtained the full Name, 11-digit Phone, detailed Address, selected Product, Quantity, and Payment Method, output a beautiful receipt summation for them.
AND you MUST also append a single line at the very end of your message in EXACTLY this format to trigger our dashboard's DB entry (Do not output this code/markup to the user directly, keep it on a separate line at the end):
[ORDER_JSON]: {"customerName": "NAME", "phone": "PHONE", "address": "ADDRESS", "paymentMethod": "METHOD", "paymentRef": "REF_OR_NONE", "items": [{"productName": "PRODUCT_NAME", "quantity": 1, "price": 500}]}

OUR PRODUCTS:
${productListText}

CUSTOM STORE FAQs:
${faqListText}

Please respond to the dynamic user message below.`;

    // Process chat history from the request formatted for the new SDK
    // The chats.create takes model and config. But we can query models.generateContent directly
    // converting chatHistory to the expected format (contents array)
    const formattedContents: any[] = [];
    
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((msg) => {
        formattedContents.push({
          role: msg.sender === "customer" ? "user" : "model",
          parts: [{ text: msg.text }]
        });
      });
    }

    // Append the current user message
    formattedContents.push({
      role: "user",
      parts: [{ text: message }]
    });

    // Make the content generation call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "দুঃখিত, আমি ঠিক বুঝতে পারিনি। পুনরায় বলবেন কি?";
    res.json({ reply: replyText });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong with the AI bot." });
  }
});

// Facebook Webhook Verification Handshake
app.get("/api/webhook", (req, res) => {
  console.log("Incoming Facebook Webhook Handshake Enquiry:", req.query);
  
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Default verify token from user configuration or fallback standard
  const VERIFY_TOKEN = (process.env.FACEBOOK_VERIFY_TOKEN || "SKILLS_STORE_VERIFY_TOKEN_BD_E_COMM_2026").trim();

  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK_VERIFY_SUCCESS_CONFIRMED: Token matches and mode verified successfully!");
      res.set("Content-Type", "text/plain");
      res.status(200).send(String(challenge));
    } else {
      console.warn(`WEBHOOK_VERIFY_FAILED: Token mismatch. Received: "${token}", Expected: "${VERIFY_TOKEN}"`);
      res.status(403).send("Verification failed: Token mismatch or improper subscription mode.");
    }
  } else {
    console.warn("WEBHOOK_VERIFY_BAD_REQUEST: Missing hub.mode or hub.verify_token query params.");
    res.status(400).send("Bad request parameters.");
  }
});

// Facebook Webhook Event Receiver (Acknowledges webhook payload from Meta)
app.post("/api/webhook", (req, res) => {
  console.log("Received facebook event webhook payload:", JSON.stringify(req.body, null, 2));
  res.status(200).send("EVENT_RECEIVED");
});

async function startServer() {
  // Serve Vite dev asset files or production build
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillsStoreBD Backend Server is running on port ${PORT}`);
  });
}

startServer();
