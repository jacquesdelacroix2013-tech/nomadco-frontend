import React, { useState, useMemo } from "react";
import { Cable, Radar, BatteryCharging, Globe2, Glasses, Moon, ShoppingBag, X, Plus, Minus, Check, ArrowRight } from "lucide-react";

const PRODUCTS = [
  { id: "hub-01", name: "Voyager hub", tag: "all-in-one charging", price: 29, icon: Cable, blurb: "One cable in, every port out. USB-C, USB-A, HDMI, all in a hub small enough to forget it's in your bag.", stamp: "BEST SELLER" },
  { id: "tracker-02", name: "Pathfinder tag", tag: "never lose it again", price: 24, icon: Radar, blurb: "Clip it to your bag, your passport pouch, your keys. Find it on a map from anywhere in the world.", stamp: "STAFF PICK" },
  { id: "battery-03", name: "Compass pack", tag: "card-sized power", price: 32, icon: BatteryCharging, blurb: "10,000mAh that slides into a back pocket. Two full phone charges before you even notice the weight.", stamp: null },
  { id: "adapter-04", name: "Atlas adapter", tag: "every outlet, covered", price: 19, icon: Globe2, blurb: "150+ countries, one plug. Built for the person who packs light and moves often.", stamp: null },
  { id: "glasses-05", name: "Horizon lenses", tag: "screen-fatigue relief", price: 28, icon: Glasses, blurb: "Blue-light filtering for the long work sessions in coffee shops and co-working spaces.", stamp: null },
  { id: "pillow-06", name: "Drift pillow", tag: "sleep anywhere", price: 27, icon: Moon, blurb: "Memory foam that folds flat. Built for overnight buses, red-eyes, and everything in between.", stamp: null },
];

const STARTER_IDS = ["hub-01", "tracker-02", "battery-03"];
const CHECKOUT_ENDPOINT = "https://nomadco-backend.onrender.com/create-checkout-session";

function formatUSD(n) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function useIsSuccessPage() {
  const [isSuccess] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.location.pathname.replace(/\/$/, "") === "/success";
  });
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search).get("session_id");
  });
  return { isSuccess, sessionId };
}

function SuccessPage({ sessionId }) {
  return (
    <div style={{ background: "#F5F1E8", color: "#2B2B26", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <div className="max-w-md mx-auto px-6 pt-24 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
          <Check size={28} />
        </div>
        <h1 className="font-black text-3xl tracking-tight">Order confirmed</h1>
        <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5A564C" }}>
          Thanks — your payment went through and your order is on its way to dispatch. A confirmation has been sent to your email.
        </p>
        {sessionId && (
          <p className="mt-4 text-xs" style={{ color: "#8A8678" }}>Reference: {sessionId.slice(0, 20)}…</p>
        )}
        <a href="/" className="inline-block mt-8 px-6 py-3 rounded-full font-bold text-sm" style={{ background: "#2B2B26", color: "#F5F1E8" }}>
          Back to shop
        </a>
      </div>
    </div>
  );
}

export default function NomadShop() {
  const { isSuccess, sessionId } = useIsSuccessPage();
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [showAll, setShowAll] = useState(false);

  if (isSuccess) return <SuccessPage sessionId={sessionId} />;

  const visibleProducts = showAll ? PRODUCTS : PRODUCTS.filter((p) => STARTER_IDS.includes(p.id));

  const cartItems = useMemo(() => {
    return Object.entries(cart).filter(([, qty]) => qty > 0).map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === id), qty }));
  }, [cart]);

  const total = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const itemCount = cartItems.reduce((sum, { qty }) => sum + qty, 0);

  function addToCart(id) { setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 })); setCartOpen(true); }
  function changeQty(id, delta) { setCart((c) => { const next = Math.max(0, (c[id] || 0) + delta); return { ...c, [id]: next }; }); }

  async function handlePay() {
    if (cartItems.length === 0) return;
    setStatus("loading");
    try {
      const response = await fetch(CHECKOUT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems.map(({ product, qty }) => ({ productId: product.id, name: product.name, price: product.price, qty })), customerEmail: email || undefined }),
      });
      const data = await response.json();
      if (data.url) { window.location.href = data.url; } else { setStatus("error"); }
    } catch (err) { setStatus("error"); }
  }

  return (
    <div style={{ background: "#F5F1E8", color: "#2B2B26", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <header className="border-b" style={{ borderColor: "#DBD4C2" }}>
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm" style={{ background: "#4A5D3A", color: "#F5F1E8" }}>N</div>
            <span className="font-black tracking-tight text-lg">NOMAD/CO</span>
          </div>
          <button onClick={() => setCartOpen(true)} className="relative flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm" style={{ background: "#2B2B26", color: "#F5F1E8" }}>
            <ShoppingBag size={16} />
            Bag
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black" style={{ background: "#C1551C", color: "#F5F1E8" }}>{itemCount}</span>
            )}
          </button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="flex items-start gap-4">
          <div className="hidden sm:flex shrink-0 w-20 h-20 rounded-full border-4 items-center justify-center font-black text-xs text-center" style={{ borderColor: "#C1551C", color: "#C1551C", transform: "rotate(-8deg)" }}>
            PACKED<br />LIGHT
          </div>
          <div>
            <h1 className="font-black tracking-tight" style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: "0.95" }}>
              Gear that<br /><span style={{ color: "#4A5D3A" }}>travels</span> with you.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: "#5A564C" }}>
              Six essentials for working and living out of a bag. No clutter, no dead weight.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleProducts.map((product) => {
            const Icon = product.icon;
            return (
              <div key={product.id} className="relative bg-white rounded-2xl p-6 border flex flex-col" style={{ borderColor: "#DBD4C2" }}>
                {product.stamp && (
                  <span className="absolute top-4 right-4 font-black tracking-wider px-2 py-1 rounded-full" style={{ background: "#FAEEDA", color: "#854F0B", fontSize: "10px", transform: "rotate(6deg)" }}>
                    {product.stamp}
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
                  <Icon size={20} />
                </div>
                <h3 className="font-black text-lg tracking-tight">{product.name}</h3>
                <p className="text-xs font-bold tracking-wide uppercase mt-1" style={{ color: "#C1551C" }}>{product.tag}</p>
                <p className="text-sm mt-3 leading-relaxed flex-1" style={{ color: "#5A564C" }}>{product.blurb}</p>
                <div className="flex items-center justify-between mt-5">
                  <span className="font-black text-xl">{formatUSD(product.price)}</span>
                  <button onClick={() => addToCart(product.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm" style={{ background: "#2B2B26", color: "#F5F1E8" }}>
                    <Plus size={14} />Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {!showAll && (
          <button onClick={() => setShowAll(true)} className="mt-8 mx-auto flex items-center gap-2 text-sm font-bold underline underline-offset-4" style={{ color: "#4A5D3A" }}>
            See the full kit<ArrowRight size={14} />
          </button>
        )}
      </section>

      <section className="border-t" style={{ borderColor: "#DBD4C2", background: "#EFEADC" }}>
        <div className="max-w-5xl mx-auto px-6 py-6 flex flex-wrap gap-x-8 gap-y-2 justify-center text-xs font-bold tracking-wide uppercase" style={{ color: "#5A564C" }}>
          <span className="flex items-center gap-1.5"><Check size={14} style={{ color: "#3B6D11" }} /> Worldwide shipping</span>
          <span className="flex items-center gap-1.5"><Check size={14} style={{ color: "#3B6D11" }} /> Secure checkout</span>
          <span className="flex items-center gap-1.5"><Check size={14} style={{ color: "#3B6D11" }} /> Real reviews only</span>
        </div>
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(43,43,38,0.4)" }} onClick={() => setCartOpen(false)}>
          <div className="w-full max-w-sm h-full p-6 flex flex-col" style={{ background: "#F5F1E8" }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-black text-lg tracking-tight">Your bag</h2>
              <button onClick={() => setCartOpen(false)}><X size={20} /></button>
            </div>
            {cartItems.length === 0 ? (
              <p className="text-sm" style={{ color: "#5A564C" }}>Nothing in here yet.</p>
            ) : (
              <div className="flex-1 overflow-auto flex flex-col gap-4">
                {cartItems.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3 bg-white rounded-xl p-3 border" style={{ borderColor: "#DBD4C2" }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EAF3DE", color: "#3B6D11" }}>
                      <product.icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{product.name}</p>
                      <p className="text-xs" style={{ color: "#5A564C" }}>{formatUSD(product.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(product.id, -1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#DBD4C2" }}><Minus size={12} /></button>
                      <span className="text-sm font-bold w-4 text-center">{qty}</span>
                      <button onClick={() => changeQty(product.id, 1)} className="w-6 h-6 rounded-full border flex items-center justify-center" style={{ borderColor: "#DBD4C2" }}><Plus size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {cartItems.length > 0 && (
              <div className="pt-4 mt-4 border-t" style={{ borderColor: "#DBD4C2" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm">Total</span>
                  <span className="font-black text-xl">{formatUSD(total)}</span>
                </div>
                <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border text-sm mb-3" style={{ borderColor: "#DBD4C2", background: "white" }} />
                <button onClick={handlePay} disabled={status === "loading"} className="w-full py-3 rounded-full font-bold text-sm" style={{ background: "#C1551C", color: "#F5F1E8" }}>
                  {status === "loading" ? "Redirecting…" : "Checkout"}
                </button>
                {status === "error" && <p className="text-xs mt-2 text-center" style={{ color: "#A32D2D" }}>Connection error. Try again.</p>}
              </div>
            )}
          </div>
        </div>
      )}
      <footer className="max-w-5xl mx-auto px-6 py-10 text-center text-xs" style={{ color: "#8A8678" }}>
        NOMAD/CO — built for the road, shipped worldwide.
      </footer>
    </div>
  );
}
