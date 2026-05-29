import React, { useState } from "react";
import { 
  ShoppingCart, 
  Trash2, 
  Check, 
  Clock, 
  X, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  CreditCard,
  Plus,
  Copy,
  Info
} from "lucide-react";
import { Order, Product, BusinessProfile } from "../types";

interface OrdersListProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  products: Product[];
  businessProfile: BusinessProfile;
}

export default function OrdersList({
  orders,
  setOrders,
  products,
  businessProfile
}: OrdersListProps) {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  
  // Local state for manual order logging modal/form
  const [showManualForm, setShowManualForm] = useState(false);
  const [manCustomerName, setManCustomerName] = useState("");
  const [manPhone, setManPhone] = useState("");
  const [manAddress, setManAddress] = useState("");
  const [manProductSelected, setManProductSelected] = useState("");
  const [manQuantity, setManQuantity] = useState("1");
  const [manPaymentMethod, setManPaymentMethod] = useState<"bKash" | "Nagad" | "Cash on Delivery">("Cash on Delivery");
  const [manPaymentRef, setManPaymentRef] = useState("");
  const [manCity, setManCity] = useState<"inside" | "outside">("inside");

  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  // Status counters
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o => o.status === "Pending").length;
  const confirmedOrdersCount = orders.filter(o => o.status === "Confirmed").length;
  const shippedOrdersCount = orders.filter(o => o.status === "Shipped").length;

  // Filter handlers
  const filteredOrders = orders.filter(order => {
    if (selectedStatusFilter === "all") return true;
    return order.status.toLowerCase() === selectedStatusFilter.toLowerCase();
  });

  // Action Button Handlers
  const handleUpdateStatus = (id: string, newStatus: "Pending" | "Confirmed" | "Shipped" | "Cancelled") => {
    setOrders(orders.map(o => {
      if (o.id === id) {
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  const handleDeleteOrder = (id: string) => {
    if(confirm("অর্ডারটি মুছে ফেলতে চান? এটি পুনরায় রিকভার করা যাবে না।")) {
      setOrders(orders.filter(o => o.id !== id));
    }
  };

  // Helper Copy Courier Text Function (BD Merchants need exactly Name + Phone + Address + Bill formatted clearly)
  const handleCopyCourierText = (order: Order) => {
    const formatted = `Name: ${order.customerName}\nPhone: ${order.phone}\nAddress: ${order.address}\nProduct: ${order.items.map(i => `${i.productName} (x${i.quantity})`).join(", ")}\nCash Amount: ${order.paymentMethod === "Cash on Delivery" ? order.totalAmount : 0} BDT\nPayment Mode: ${order.paymentMethod}`;
    navigator.clipboard.writeText(formatted);
    setCopiedOrderId(order.id);
    setTimeout(() => setCopiedOrderId(null), 3000);
  };

  // Manual Logger submit
  const handleLogManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manCustomerName || !manPhone || !manAddress || !manProductSelected) return;

    // Resolve product price
    const prod = products.find(p => p.id === manProductSelected);
    if (!prod) return;

    const deliveryCost = manCity === "inside" ? businessProfile.deliveryInsideDhaka : businessProfile.deliveryOutsideDhaka;
    const finalBill = (prod.price * Number(manQuantity)) + deliveryCost;

    const newOrder: Order = {
      id: "M-" + Math.floor(100000 + Math.random() * 900000),
      createdAt: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }) + " (Manual)",
      customerName: manCustomerName,
      phone: manPhone,
      address: manAddress,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          quantity: Number(manQuantity),
          price: prod.price
        }
      ],
      totalAmount: finalBill,
      paymentMethod: manPaymentMethod,
      paymentRef: manPaymentRef || undefined,
      status: "Confirmed"
    };

    setOrders([...orders, newOrder]);
    
    // Reset fields
    setManCustomerName("");
    setManPhone("");
    setManAddress("");
    setManProductSelected("");
    setManQuantity("1");
    setManPaymentMethod("Cash on Delivery");
    setManPaymentRef("");
    setShowManualForm(false);
  };

  return (
    <div className="p-8 space-y-6" id="orders-tab">
      {/* Upper header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="orders-header">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950 flex items-center space-x-2">
            <ShoppingCart className="h-6 w-6 text-emerald-600" />
            <span>অর্ডার রিসিভড খাতা (Order Book)</span>
          </h2>
          <p className="text-slate-500 text-xs mt-1">সব এআই অটোপাইলট অর্ডার ডিটেকশন এবং ম্যানুয়াল এন্ট্রির মূল বিবরণী</p>
        </div>

        {/* Manual logger triggers */}
        <button
          onClick={() => setShowManualForm(!showManualForm)}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-50 font-bold text-xs rounded-xl flex items-center space-x-1 border border-slate-700 transition shadow cursor-pointer ml-auto md:ml-0"
          id="btn-manual-order"
        >
          <Plus className="h-4 w-4" />
          <span>ম্যানুয়ালি নতুন অর্ডার এন্ট্রি</span>
        </button>
      </div>

      {/* Grid counters summary for state toggles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="orders-stat-bar">
        <button
          onClick={() => setSelectedStatusFilter("all")}
          className={`p-4 rounded-2xl border text-left transition ${
            selectedStatusFilter === "all" ? "bg-slate-900 border-slate-950 text-white shadow" : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">সব অর্ডার (Total)</span>
          <h4 className="text-xl font-bold font-sans mt-0.5">{totalOrdersCount} টি</h4>
        </button>

        <button
          onClick={() => setSelectedStatusFilter("pending")}
          className={`p-4 rounded-2xl border text-left transition ${
            selectedStatusFilter === "pending" ? "bg-amber-500 border-amber-600 text-slate-950 shadow" : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">অপেক্ষমাণ (Pending)</span>
          <h4 className="text-xl font-bold font-sans mt-0.5">{pendingOrdersCount} টি</h4>
        </button>

        <button
          onClick={() => setSelectedStatusFilter("confirmed")}
          className={`p-4 rounded-2xl border text-left transition ${
            selectedStatusFilter === "confirmed" ? "bg-emerald-600 border-emerald-700 text-white shadow" : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">কনফার্মড (Confirmed)</span>
          <h4 className="text-xl font-bold font-sans mt-0.5">{confirmedOrdersCount} টি</h4>
        </button>

        <button
          onClick={() => setSelectedStatusFilter("shipped")}
          className={`p-4 rounded-2xl border text-left transition ${
            selectedStatusFilter === "shipped" ? "bg-blue-600 border-blue-700 text-white shadow" : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">ডেলিভারড (Delivered)</span>
          <h4 className="text-xl font-bold font-sans mt-0.5">{shippedOrdersCount} টি</h4>
        </button>
      </div>

      {/* Collapsible: Manual Order Entry Form */}
      {showManualForm && (
        <form onSubmit={handleLogManualOrder} className="bg-slate-900 text-slate-100 p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl" id="manual-order-form-block">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
              <Plus className="h-4 w-4 text-emerald-400" />
              <span>নতুন কাস্টমার বিবরণী (Manual Order Log)</span>
            </h3>
            <button 
              type="button" 
              onClick={() => setShowManualForm(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">ক্রেতার নাম (Customer Name)</label>
              <input 
                type="text" 
                value={manCustomerName} 
                onChange={(e) => setManCustomerName(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                placeholder="যেমন: রাফসান জানি"
                required
              />
            </div>
            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">মোবাইল নম্বর (১১ ডিজিট)</label>
              <input 
                type="text" 
                value={manPhone} 
                onChange={(e) => setManPhone(e.target.value)} 
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white font-mono"
                placeholder="01xxxxxxxxx"
                required
              />
            </div>
            {/* Product selection */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">পণ্য সিলেক্ট করুন</label>
              <select 
                value={manProductSelected}
                onChange={(e) => setManProductSelected(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                required
              >
                <option value="">নির্বাচন করুন</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (৳{p.price})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Quantity */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-[11px] font-bold text-slate-300">পরিমাণ (Qty)</label>
              <input 
                type="number" 
                value={manQuantity}
                onChange={(e) => setManQuantity(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
                min="1"
              />
            </div>
            
            {/* City inside/outside */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-[11px] font-bold text-slate-300">ডেলিভারি এরিয়া</label>
              <select 
                value={manCity}
                onChange={(e) => setManCity(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
              >
                <option value="inside">ঢাকা সিটি (৳{businessProfile.deliveryInsideDhaka})</option>
                <option value="outside">ঢাকার বাইরে (৳{businessProfile.deliveryOutsideDhaka})</option>
              </select>
            </div>

            {/* Payment method */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-[11px] font-bold text-slate-300">পেমেন্ট মেথড</label>
              <select 
                value={manPaymentMethod}
                onChange={(e) => setManPaymentMethod(e.target.value as any)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
              >
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="bKash">bKash</option>
                <option value="Nagad">Nagad</option>
              </select>
            </div>

            {/* Reference payment ID */}
            <div className="space-y-1 md:col-span-1">
              <label className="text-[11px] font-bold text-slate-300">বিকাশ/নগদ TrxID (যদি থাকে)</label>
              <input 
                type="text" 
                value={manPaymentRef}
                onChange={(e) => setManPaymentRef(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white font-mono"
                placeholder="যেমন: 9H4JD8E2"
              />
            </div>
          </div>

          {/* Full address */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">ডেলিভারি ঠিকানা (Detailed Address)</label>
            <input 
              type="text" 
              value={manAddress}
              onChange={(e) => setManAddress(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-white"
              placeholder="হাউজ নং, রোড নং, এলাকা, থানা, জেলা"
              required
            />
          </div>

          <div className="flex justify-end pt-2 space-x-2">
            <button
              type="button"
              onClick={() => setShowManualForm(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-xl"
            >
              বাতিল
            </button>
            <button
              type="submit"
              id="log-order-btn-submit"
              className="px-5 py-2 bg-emerald-600 font-extrabold text-slate-950 hover:bg-emerald-500  rounded-xl text-xs flex items-center space-x-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>অর্ডার সেভ করুন</span>
            </button>
          </div>
        </form>
      )}

      {/* Table grid of orders */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="orders-table-wrapper">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              এই ফিল্টারে খাতাটিতে কোনো অর্ডার রেকর্ড নেই।
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-secondary text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">অর্ডার কোড ও ডেট</th>
                  <th className="p-4">ক্রেতার তথ্য</th>
                  <th className="p-4">পণ্যতালিকা</th>
                  <th className="p-4 text-center">হিসাবকৃত মোট বিল (সহ ডেলিভারি)</th>
                  <th className="p-4">পেমেন্ট স্ট্যাটাস</th>
                  <th className="p-4">অপ্রুভাল কন্ট্রোল</th>
                  <th className="p-4 pr-6 text-right">ম্যানেজমেন্ট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition text-xs" id={`order-row-${order.id}`}>
                    {/* ID & Date */}
                    <td className="p-4 pl-6">
                      <span className="font-extrabold text-slate-950 font-mono">#{order.id}</span>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">{order.createdAt}</p>
                    </td>

                    {/* Customer */}
                    <td className="p-4 space-y-1">
                      <div className="font-bold text-slate-800 flex items-center space-x-1">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] flex items-center space-x-1">
                        <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{order.phone}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 max-w-[200px] truncate flex items-center space-x-1" title={order.address}>
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{order.address}</span>
                      </div>
                    </td>

                    {/* Product items */}
                    <td className="p-4">
                      {order.items.map((item, id) => (
                        <div key={id} className="font-medium text-slate-700">
                          {item.productName} (x{item.quantity})
                        </div>
                      ))}
                    </td>

                    {/* Amount */}
                    <td className="p-4 text-center">
                      <span className="font-sans font-black text-emerald-800 text-sm">৳{order.totalAmount}</span>
                      <p className="text-[9px] text-slate-400 mt-0.5">কুরিয়ার ক্যাশ</p>
                    </td>

                    {/* Payment detail */}
                    <td className="p-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-0.5 text-[9px] rounded-full font-bold w-fit text-center uppercase tracking-wide ${
                          order.paymentMethod === "Cash on Delivery"
                            ? "bg-slate-100 text-slate-700 font-bold"
                            : "bg-pink-50 text-pink-700 border border-pink-100 font-bold"
                        }`}>
                          {order.paymentMethod}
                        </span>
                        {order.paymentRef && (
                          <span className="font-mono text-[10px] text-pink-600 bg-pink-500/5 border border-pink-100 px-1 py-0.2 rounded font-bold">
                            TrxID: {order.paymentRef}
                          </span>
                        )}
                        {!order.paymentRef && order.paymentMethod !== "Cash on Delivery" && (
                          <span className="text-[10px] text-amber-600 italic">TrxID pending</span>
                        )}
                      </div>
                    </td>

                    {/* Approval toggle buttons */}
                    <td className="p-4">
                      <div className="flex items-center space-x-1">
                        {order.status === "Pending" ? (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, "Confirmed")}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer transition"
                              title="অর্ডার কনফার্ম করুন"
                            >
                              কনফার্ম করুন
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, "Cancelled")}
                              className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-100 rounded-lg text-[10px] font-bold cursor-pointer transition"
                              title="অর্ডার বাতিল"
                            >
                              বাতিল
                            </button>
                          </>
                        ) : order.status === "Confirmed" ? (
                          <button
                            onClick={() => handleUpdateStatus(order.id, "Shipped")}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold cursor-pointer transition"
                          >
                            ডেলিভার্ড মার্ক করুন
                          </button>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                            order.status === "Shipped" ? "bg-blue-50 text-blue-800" : "bg-red-50 text-red-800"
                          }`}>
                            {order.status === "Shipped" ? "ডেলিভারি সম্পন্ন" : "বাতিলকৃত"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions: delete & copy courier format */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Copy courier copy button */}
                        <button
                          onClick={() => handleCopyCourierText(order)}
                          className={`p-1.5 border rounded-lg transition text-[10px] font-bold flex items-center space-x-1 ${
                            copiedOrderId === order.id
                              ? "bg-slate-900 border-slate-900 text-white"
                              : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                          title="Pathao / RedX বুকিং টেক্সট কপি করুন"
                        >
                          {copiedOrderId === order.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>কপি হয়েছে</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>কুরিয়ার কপি</span>
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 border border-slate-100 hover:border-red-200 rounded-lg transition cursor-pointer"
                          title="অর্ডারটি মুছুন"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      
      {/* Information footer */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start space-x-3 text-xs text-slate-600">
        <Info className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
        <div className="space-y-1 leading-normal">
          <p className="font-bold text-slate-800">কুরিয়ার বুকিং ফিচার টিপস ("কুরিয়ার কপি"):</p>
          <p>
            আপনার রেডেক্স (RedX), পাঠাও (Pathao) বা স্টিডফাস্ট (Steadfast) মার্চেন্ট প্যানেলে বুকিং করতে বুকিং উইজেটের পাশে "কুরিয়ার কপি" বাটনে ক্লিক করুন। এটি গ্রাহকের নাম, মোবাইল নম্বর এবং ঠিকানা একটি একক প্লেইন টেক্সট ব্লকে কপি করে নিবে, যা দিয়ে আপনি প্যানেলে ১ সেকেন্ডেই এন্ট্রি করতে পারবেন।
          </p>
        </div>
      </div>
    </div>
  );
}
