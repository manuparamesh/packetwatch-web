import { useState, useEffect, useRef } from "react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"

const GREENS = ["#2d6a4f","#40916c","#52b788","#74c69d","#95d5b2","#b7e4c7","#d8f3dc"]
const CATS = {
  biryani:"Biryani", burger_fast_food:"Burgers & Fast Food",
  bakery_dessert:"Bakery & Desserts", south_indian:"South Indian",
  cafe_coffee:"Café & Coffee", roll_wrap_shawarma:"Rolls & Wraps",
  dhaba_northindian:"Dhaba & North Indian", healthy_bowl:"Healthy Bowls",
  sandwich_sub:"Sandwiches", pizza:"Pizza", chinese_asian:"Chinese & Asian",
  seafood:"Seafood", multicuisine:"Multi Cuisine",
  juice_beverage:"Juices & Drinks", ice_cream:"Ice Cream", breakfast:"Breakfast"
}

/* ── SVG ILLUSTRATIONS ─────────────────────────────────────────────────── */
function LeafLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#1b4332"/>
      <path d="M14 34C14 34 16 22 26 18C36 14 36 14 36 14C36 14 34 24 24 28C19 30 14 34 14 34Z" fill="#95d5b2"/>
      <path d="M14 34C14 34 18 28 24 26" stroke="#52b788" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function HeroIllustration() {
  return (
    <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:"100%",maxWidth:520}}>
      {/* Background blob */}
      <ellipse cx="260" cy="210" rx="200" ry="180" fill="#d8f3dc" opacity="0.5"/>
      {/* Delivery bag */}
      <rect x="155" y="140" width="210" height="180" rx="20" fill="#2d6a4f"/>
      <rect x="175" y="140" width="170" height="60" rx="10" fill="#40916c"/>
      <path d="M200 140 Q200 110 260 110 Q320 110 320 140" stroke="#1b4332" strokeWidth="8" strokeLinecap="round" fill="none"/>
      {/* Containers inside */}
      <rect x="175" y="215" width="80" height="60" rx="8" fill="#95d5b2"/>
      <rect x="265" y="215" width="80" height="60" rx="8" fill="#74c69d"/>
      <rect x="175" y="215" width="80" height="12" rx="4" fill="#52b788"/>
      <rect x="265" y="215" width="80" height="12" rx="4" fill="#40916c"/>
      {/* Plastic bag floating */}
      <g transform="translate(360 100) rotate(-15)">
        <path d="M0 20 Q5 0 20 0 Q35 0 40 20 L35 70 Q30 80 20 80 Q10 80 5 70 Z" fill="#b7e4c7" stroke="#52b788" strokeWidth="1.5"/>
        <path d="M12 0 Q12 -10 20 -10 Q28 -10 28 0" stroke="#40916c" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <text x="20" y="50" textAnchor="middle" fontSize="8" fill="#2d6a4f" fontFamily="serif">pickle</text>
      </g>
      {/* Sauce sachet */}
      <g transform="translate(95 180) rotate(20)">
        <rect width="35" height="18" rx="4" fill="#52b788"/>
        <rect width="35" height="6" rx="3" fill="#40916c"/>
        <text x="17" y="14" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif">sauce</text>
      </g>
      {/* Plastic straw */}
      <rect x="330" y="270" width="6" height="60" rx="3" fill="#95d5b2" transform="rotate(30 333 300)"/>
      {/* Cutlery */}
      <g transform="translate(110 260)">
        <rect x="0" y="0" width="5" height="50" rx="2" fill="#74c69d"/>
        <ellipse cx="2.5" cy="5" rx="5" ry="8" fill="#74c69d"/>
      </g>
      {/* Weight label */}
      <g transform="translate(320 330)">
        <rect width="120" height="44" rx="22" fill="#1b4332"/>
        <text x="60" y="20" textAnchor="middle" fontSize="11" fill="#95d5b2" fontFamily="sans-serif" fontWeight="500">your last order</text>
        <text x="60" y="36" textAnchor="middle" fontSize="13" fill="white" fontFamily="serif" fontWeight="600">~52g plastic</text>
      </g>
      {/* Floating particles */}
      <circle cx="80" cy="150" r="6" fill="#95d5b2" opacity="0.6"/>
      <circle cx="450" cy="200" r="10" fill="#b7e4c7" opacity="0.5"/>
      <circle cx="420" cy="130" r="5" fill="#52b788" opacity="0.4"/>
      <circle cx="70" cy="310" r="8" fill="#d8f3dc" opacity="0.7"/>
    </svg>
  )
}

function Step1Icon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
      <circle cx="40" cy="40" r="38" fill="#d8f3dc"/>
      <rect x="20" y="25" width="40" height="32" rx="5" fill="#2d6a4f"/>
      <rect x="25" y="20" width="30" height="8" rx="3" fill="#40916c"/>
      <rect x="25" y="35" width="30" height="4" rx="2" fill="#95d5b2"/>
      <rect x="25" y="43" width="20" height="4" rx="2" fill="#95d5b2" opacity="0.6"/>
      <circle cx="56" cy="54" r="10" fill="#52b788"/>
      <path d="M52 54l2.5 2.5L59 51" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Step2Icon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
      <circle cx="40" cy="40" r="38" fill="#d8f3dc"/>
      <rect x="18" y="28" width="44" height="30" rx="6" fill="#2d6a4f"/>
      <rect x="24" y="22" width="12" height="10" rx="3" fill="#40916c"/>
      <rect x="44" y="22" width="12" height="10" rx="3" fill="#40916c"/>
      <circle cx="40" cy="44" r="8" fill="#95d5b2"/>
      <path d="M37 44l2 2 4-4" stroke="#1b4332" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function Step3Icon() {
  return (
    <svg viewBox="0 0 80 80" fill="none" width="80" height="80">
      <circle cx="40" cy="40" r="38" fill="#d8f3dc"/>
      <rect x="15" y="30" width="50" height="28" rx="6" fill="#2d6a4f"/>
      <rect x="20" y="38" width="15" height="12" rx="2" fill="#52b788"/>
      <rect x="39" y="34" width="20" height="16" rx="2" fill="#74c69d"/>
      <rect x="20" y="48" width="8" height="2" rx="1" fill="#d8f3dc"/>
      <path d="M15 36 Q40 22 65 36" stroke="#40916c" strokeWidth="2" fill="none"/>
    </svg>
  )
}

function PlasticBlobBg() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}} fill="none">
      <path d="M0 0 L800 0 L800 500 L0 500 Z" fill="#f8fdf9"/>
      <path d="M600 -50 Q750 50 780 200 Q810 350 700 420 Q590 490 450 460 Q310 430 280 320 Q250 210 350 130 Q450 50 600 -50Z" fill="#d8f3dc" opacity="0.6"/>
      <path d="M-50 300 Q50 200 150 250 Q250 300 200 400 Q150 500 50 480 Q-50 460 -50 300Z" fill="#b7e4c7" opacity="0.4"/>
      <circle cx="700" cy="80" r="60" fill="#95d5b2" opacity="0.2"/>
      <circle cx="100" cy="100" r="40" fill="#52b788" opacity="0.1"/>
    </svg>
  )
}

function ImpactBg() {
  return (
    <svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0}} fill="none">
      <rect width="800" height="300" fill="#1b4332"/>
      <circle cx="100" cy="50" r="80" fill="#2d6a4f" opacity="0.5"/>
      <circle cx="700" cy="250" r="100" fill="#2d6a4f" opacity="0.4"/>
      <path d="M0 200 Q200 150 400 180 Q600 210 800 160 L800 300 L0 300Z" fill="#2d6a4f" opacity="0.3"/>
    </svg>
  )
}

/* ── SCREENS ────────────────────────────────────────────────────────────── */
function Navbar({ onConnect }) {
  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(12px)",borderBottom:"1px solid #e9f5ee",padding:"0 2rem",height:64,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <LeafLogo size={36}/>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1b4332",letterSpacing:"-0.02em"}}>PacketWatch</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
        <a href="#how" style={{fontSize:14,color:"#2d6a4f",textDecoration:"none",fontWeight:500}}>How it works</a>
        <a href="#impact" style={{fontSize:14,color:"#2d6a4f",textDecoration:"none",fontWeight:500}}>Impact</a>
        <a href={`${API}/docs`} target="_blank" rel="noreferrer" style={{fontSize:14,color:"#2d6a4f",textDecoration:"none",fontWeight:500}}>API</a>
        <button onClick={onConnect} style={{background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"9px 20px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          Connect Gmail
        </button>
      </div>
    </nav>
  )
}

function Hero({ onConnect }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let n = 0
    const t = setInterval(() => {
      n += 173
      if (n >= 25947) { setCount(25947); clearInterval(t) }
      else setCount(n)
    }, 16)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden",paddingTop:64}}>
      <PlasticBlobBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"4rem 2rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#d8f3dc",borderRadius:100,padding:"6px 16px",marginBottom:"1.5rem"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#2d6a4f"}}/>
            <span style={{fontSize:13,fontWeight:600,color:"#1b4332",letterSpacing:"0.05em"}}>FOOD DELIVERY · PLASTIC FOOTPRINT</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(36px,5vw,58px)",fontWeight:700,lineHeight:1.1,color:"#1b4332",margin:"0 0 1.25rem",letterSpacing:"-0.02em"}}>
            How much plastic does your food delivery habit generate?
          </h1>
          <p style={{fontSize:18,color:"#40916c",lineHeight:1.7,margin:"0 0 2rem",fontWeight:400}}>
            Connect your Gmail and PacketWatch analyses every Zomato order — estimating containers, sachets, cutlery, and covers using AI trained on Indian food packaging patterns.
          </p>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:"2.5rem",flexWrap:"wrap"}}>
            <button onClick={onConnect} style={{background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"14px 32px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",letterSpacing:"-0.01em",display:"flex",alignItems:"center",gap:10}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="white"/></svg>
              Connect Gmail &amp; analyse
            </button>
            <a href="#how" style={{fontSize:14,color:"#2d6a4f",fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:4}}>
              See how it works
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div style={{display:"flex",gap:"2rem"}}>
            {[["500+","orders analysed"],["25.9kg","plastic tracked"],["157","restaurants rated"]].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,fontWeight:700,color:"#1b4332"}}>{n}</div>
                <div style={{fontSize:12,color:"#52b788",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.5rem"}}>
          <HeroIllustration/>
          <div style={{background:"white",border:"1.5px solid #b7e4c7",borderRadius:20,padding:"1.25rem 2rem",textAlign:"center",boxShadow:"0 4px 24px rgba(45,106,79,0.08)"}}>
            <div style={{fontSize:13,color:"#52b788",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>your sample data</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"#1b4332"}}>{(count/1000).toFixed(2)}<span style={{fontSize:18,color:"#40916c"}}> kg</span></div>
            <div style={{fontSize:13,color:"#40916c"}}>plastic generated · 500 orders</div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HowItWorks({ onConnect }) {
  const steps = [
    { icon: <Step1Icon/>, num:"01", title:"Connect your Gmail", desc:"Grant read-only access to your Gmail. We search only for Zomato order confirmation emails — your inbox stays private." },
    { icon: <Step2Icon/>, num:"02", title:"AI analyses each order", desc:"GPT-4 estimates plastic components per dish using 10 rules specific to Indian food delivery — containers, covers, cutlery, sachets." },
    { icon: <Step3Icon/>, num:"03", title:"See your footprint", desc:"Get a full dashboard: plastic trend over time, worst offending restaurants, cuisine breakdown, and personalised tips to reduce waste." },
  ]
  return (
    <section id="how" style={{padding:"6rem 2rem",background:"white"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"4rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#d8f3dc",borderRadius:100,padding:"6px 16px",marginBottom:"1rem"}}>
            <span style={{fontSize:12,fontWeight:700,color:"#1b4332",letterSpacing:"0.08em"}}>HOW IT WORKS</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"#1b4332",margin:"0 0 1rem",letterSpacing:"-0.02em"}}>Three steps to know your plastic truth</h2>
          <p style={{fontSize:17,color:"#52b788",maxWidth:520,margin:"0 auto",lineHeight:1.6}}>No uploads, no manual work. Just connect once and get your full history.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:"2rem"}}>
          {steps.map((s,i) => (
            <div key={i} style={{background:"#f8fdf9",borderRadius:24,padding:"2rem",border:"1px solid #d8f3dc",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:16,right:20,fontFamily:"'Playfair Display',serif",fontSize:64,fontWeight:700,color:"#d8f3dc",lineHeight:1,zIndex:0}}>{s.num}</div>
              <div style={{position:"relative",zIndex:1}}>
                {s.icon}
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#1b4332",margin:"1.25rem 0 0.75rem"}}>{s.title}</h3>
                <p style={{fontSize:15,color:"#40916c",lineHeight:1.7,margin:0}}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{textAlign:"center",marginTop:"3rem"}}>
          <button onClick={onConnect} style={{background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"14px 40px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
            Try it on your orders
          </button>
        </div>
      </div>
    </section>
  )
}

function ImpactSection() {
  const facts = [
    { num:"8M", label:"tonnes of plastic enter oceans yearly" },
    { num:"~52g", label:"plastic per average food delivery order" },
    { num:"4.2B", label:"food delivery orders placed in India yearly" },
    { num:"218K", label:"tonnes of plastic from Indian food delivery" },
  ]
  return (
    <section id="impact" style={{position:"relative",padding:"6rem 2rem",overflow:"hidden"}}>
      <ImpactBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(149,213,178,0.2)",borderRadius:100,padding:"6px 16px",marginBottom:"1rem",border:"1px solid rgba(149,213,178,0.3)"}}>
            <span style={{fontSize:12,fontWeight:700,color:"#95d5b2",letterSpacing:"0.08em"}}>THE PROBLEM</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,4vw,44px)",fontWeight:700,color:"white",margin:"0 0 1rem",letterSpacing:"-0.02em"}}>India's food delivery plastic crisis</h2>
          <p style={{fontSize:17,color:"#95d5b2",maxWidth:520,margin:"0 auto",lineHeight:1.6}}>Most of it ends up in landfill. Awareness is the first step to change.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:"1.5rem"}}>
          {facts.map((f,i) => (
            <div key={i} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(149,213,178,0.2)",borderRadius:20,padding:"2rem",textAlign:"center",backdropFilter:"blur(8px)"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"white",lineHeight:1}}>{f.num}</div>
              <div style={{fontSize:14,color:"#95d5b2",marginTop:8,lineHeight:1.5}}>{f.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrivacySection() {
  return (
    <section style={{padding:"5rem 2rem",background:"#f8fdf9"}}>
      <div style={{maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4rem",alignItems:"center"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#d8f3dc",borderRadius:100,padding:"6px 16px",marginBottom:"1rem"}}>
            <span style={{fontSize:12,fontWeight:700,color:"#1b4332",letterSpacing:"0.08em"}}>PRIVACY FIRST</span>
          </div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,3vw,36px)",fontWeight:700,color:"#1b4332",margin:"0 0 1rem",letterSpacing:"-0.02em"}}>Your data never leaves your session</h2>
          <p style={{fontSize:16,color:"#40916c",lineHeight:1.7,margin:"0 0 1.5rem"}}>We use Gmail's read-only OAuth scope. We search only for Zomato emails with the exact subject line. We never store your emails, order history, or personal data.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {["Read-only Gmail access — we can never send, delete or modify","No email content stored on our servers","Open source — inspect every line of code on GitHub","Results computed in-session and discarded after"].map((t,i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:20,height:20,borderRadius:"50%",background:"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
                  <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#2d6a4f" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span style={{fontSize:14,color:"#2d6a4f",lineHeight:1.5}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[["🔒","Read-only","Gmail OAuth with minimal scope"],["🚫","No storage","Emails never touch our DB"],["👁","Open source","All code public on GitHub"],["⚡","Real-time","Results computed live, not cached"]].map(([ic,title,desc],i) => (
            <div key={i} style={{background:"white",borderRadius:16,padding:"1.25rem",border:"1px solid #e9f5ee"}}>
              <div style={{fontSize:24,marginBottom:8}}>{ic}</div>
              <div style={{fontSize:14,fontWeight:700,color:"#1b4332",marginBottom:4}}>{title}</div>
              <div style={{fontSize:12,color:"#52b788",lineHeight:1.5}}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ConnectModal({ onClose, onStart }) {
  const [apps, setApps] = useState(["zomato"])
  const toggle = (a) => setApps(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a])
  const opts = [
    {id:"zomato",label:"Zomato",color:"#e23744",sub:"Reads order confirmation emails"},
    {id:"swiggy",label:"Swiggy",color:"#fc8019",sub:"Coming soon",disabled:true},
    {id:"uber_eats",label:"Uber Eats",color:"#06C167",sub:"Coming soon",disabled:true},
  ]
  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(27,67,50,0.6)",backdropFilter:"blur(8px)"}} onClick={onClose}>
      <div style={{background:"white",borderRadius:24,padding:"2.5rem",width:"100%",maxWidth:460,margin:"1rem",boxShadow:"0 24px 80px rgba(27,67,50,0.25)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.5rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <LeafLogo size={28}/>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"#1b4332"}}>PacketWatch</span>
            </div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#1b4332",margin:0}}>Connect your Gmail</h3>
          </div>
          <button onClick={onClose} style={{background:"#f0faf4",border:"none",borderRadius:"50%",width:36,height:36,cursor:"pointer",fontSize:18,color:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
        <div style={{background:"#f0faf4",borderRadius:12,padding:"12px 16px",marginBottom:"1.5rem",display:"flex",gap:10,alignItems:"flex-start"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#2d6a4f" style={{flexShrink:0,marginTop:2}}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
          <span style={{fontSize:13,color:"#2d6a4f",lineHeight:1.5}}>We use <strong>read-only</strong> Gmail access. We only search for order confirmation emails matching <code style={{background:"#d8f3dc",padding:"1px 4px",borderRadius:3,fontSize:11}}>subject:"Your Zomato order from"</code></span>
        </div>
        <p style={{fontSize:14,color:"#52b788",marginBottom:"1rem",fontWeight:500}}>Select which platforms to analyse:</p>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"1.5rem"}}>
          {opts.map(o => (
            <div key={o.id} onClick={()=>!o.disabled&&toggle(o.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px",borderRadius:12,border:`2px solid ${apps.includes(o.id)&&!o.disabled?"#2d6a4f":"#e9f5ee"}`,background:apps.includes(o.id)&&!o.disabled?"#f0faf4":"white",cursor:o.disabled?"default":"pointer",opacity:o.disabled?0.5:1,transition:"all 0.15s"}}>
              <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${apps.includes(o.id)&&!o.disabled?"#2d6a4f":"#b7e4c7"}`,background:apps.includes(o.id)&&!o.disabled?"#2d6a4f":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                {apps.includes(o.id)&&!o.disabled&&<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:700,color:o.color}}>{o.label}</div>
                <div style={{fontSize:12,color:"#52b788"}}>{o.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <button onClick={()=>apps.length&&onStart(apps)} style={{width:"100%",padding:"15px 0",background:apps.length?"#1b4332":"#d8f3dc",color:apps.length?"white":"#95d5b2",border:"none",borderRadius:100,fontSize:16,fontWeight:700,cursor:apps.length?"pointer":"default",fontFamily:"inherit",transition:"all 0.15s",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="currentColor"/></svg>
          Sign in with Google &amp; analyse
        </button>
        <p style={{fontSize:11,color:"#95d5b2",textAlign:"center",marginTop:12}}>By continuing you agree to our privacy policy. Your Gmail credentials are handled directly by Google.</p>
      </div>
    </div>
  )
}

function Loading({ progress, message }) {
  const tips = [
    "The average Indian food delivery order generates ~52g of plastic.",
    "Biryani orders produce the most plastic due to raita and pickle covers.",
    "Burger chains like Leon's use paper packaging — much lower footprint!",
    "Switching to healthy bowls can cut your plastic footprint by up to 60%.",
  ]
  const [tip, setTip] = useState(0)
  useEffect(() => { const t = setInterval(()=>setTip(p=>(p+1)%tips.length),3500); return ()=>clearInterval(t) }, [])

  return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fdf9",padding:"2rem"}}>
      <div style={{textAlign:"center",maxWidth:480}}>
        <div style={{marginBottom:"2rem"}}>
          <LeafLogo size={56}/>
        </div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:30,fontWeight:700,color:"#1b4332",margin:"0 0 0.5rem"}}>Analysing your orders</h2>
        <p style={{fontSize:15,color:"#52b788",margin:"0 0 2.5rem",lineHeight:1.6}}>{message || "Fetching your Zomato order history from Gmail..."}</p>
        <div style={{height:6,background:"#d8f3dc",borderRadius:100,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#40916c,#52b788)",borderRadius:100,transition:"width 0.6s ease"}}/>
        </div>
        <div style={{fontSize:13,color:"#95d5b2",marginBottom:"2.5rem"}}>{progress}% complete</div>
        <div style={{background:"white",borderRadius:16,padding:"1.25rem 1.5rem",border:"1px solid #d8f3dc",textAlign:"left",minHeight:70}}>
          <div style={{fontSize:11,fontWeight:700,color:"#95d5b2",letterSpacing:"0.08em",marginBottom:6}}>DID YOU KNOW?</div>
          <p style={{fontSize:14,color:"#2d6a4f",lineHeight:1.6,margin:0,transition:"opacity 0.3s"}}>{tips[tip]}</p>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, unit, accent }) {
  return (
    <div style={{background:"white",borderRadius:20,padding:"1.5rem",border:"1px solid #e9f5ee",borderTop:`4px solid ${accent||"#52b788"}`}}>
      <div style={{fontSize:11,color:"#95d5b2",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:6}}>
        <span style={{fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"#1b4332",lineHeight:1}}>{value}</span>
        {unit && <span style={{fontSize:14,color:"#52b788",fontWeight:500}}>{unit}</span>}
      </div>
    </div>
  )
}

function InsightCard({ icon, text, accent, title }) {
  return (
    <div style={{background:"white",borderRadius:16,padding:"1.25rem 1.5rem",border:"1px solid #e9f5ee",display:"flex",gap:14,alignItems:"flex-start"}}>
      <div style={{width:40,height:40,borderRadius:12,background:accent+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{icon}</div>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:4}}>{title}</div>
        <div style={{fontSize:13,color:"#40916c",lineHeight:1.6}}>{text}</div>
      </div>
    </div>
  )
}

function Dashboard({ data, onReset }) {
  const s = data.summary
  const monthly = data.monthly_trend || []
  const byType = (data.by_restaurant_type || []).map(r=>({...r,name:CATS[r.restaurant_type]||r.restaurant_type}))
  const topRests = data.top_restaurants || []
  const ins = data.insights || {}

  return (
    <div style={{minHeight:"100vh",background:"#f8fdf9"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      {/* Header */}
      <div style={{background:"#1b4332",padding:"1.5rem 2rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <LeafLogo size={32}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:18,fontWeight:700,color:"white"}}>PacketWatch</span>
        </div>
        <button onClick={onReset} style={{background:"rgba(255,255,255,0.1)",color:"white",border:"1px solid rgba(255,255,255,0.2)",borderRadius:100,padding:"8px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
          Analyse another account
        </button>
      </div>

      <div style={{maxWidth:1000,margin:"0 auto",padding:"2.5rem 1.5rem"}}>
        {/* Hero stat */}
        <div style={{background:"#1b4332",borderRadius:24,padding:"2.5rem",marginBottom:"1.5rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:200,height:200,borderRadius:"50%",background:"rgba(149,213,178,0.1)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:"#95d5b2",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>your total plastic footprint</div>
            <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:8}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:64,fontWeight:700,color:"white",lineHeight:1}}>{s.total_kg}</span>
              <span style={{fontSize:24,color:"#95d5b2",fontWeight:500}}>kg of plastic</span>
            </div>
            <div style={{fontSize:15,color:"#74c69d"}}>from {s.total_orders} orders between {s.date_from} and {s.date_to}</div>
            <div style={{marginTop:12,fontSize:13,color:"#52b788"}}>That's about {Math.round(s.total_kg * 200)} plastic bottles worth of waste.</div>
          </div>
        </div>

        {/* KPI grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"1rem",marginBottom:"2rem"}}>
          <Stat label="Total orders" value={s.total_orders} accent="#52b788"/>
          <Stat label="Avg per order" value={s.avg_grams_per_order} unit="grams" accent="#74c69d"/>
          <Stat label="Worst category" value={CATS[ins.worst_category]||"—"} accent="#e23744"/>
          <Stat label="Potential saving" value={ins.potential_saving_g>0?`${Math.round(ins.potential_saving_g/1000*10)/10}`:0} unit="kg" accent="#40916c"/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:"1.5rem",marginBottom:"2rem"}}>
          {/* Trend */}
          <div style={{background:"white",borderRadius:20,padding:"1.5rem",border:"1px solid #e9f5ee"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem",letterSpacing:"-0.01em"}}>Monthly plastic trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthly} margin={{top:4,right:8,left:-24,bottom:0}}>
                <XAxis dataKey="month" tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false}/>
                <Tooltip formatter={v=>[`${Math.round(v)}g`,"Plastic"]} contentStyle={{fontSize:12,borderRadius:12,border:"1px solid #e9f5ee",background:"white"}}/>
                <Line type="monotone" dataKey="plastic_grams" stroke="#2d6a4f" strokeWidth={2.5} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Component breakdown */}
          <div style={{background:"white",borderRadius:20,padding:"1.5rem",border:"1px solid #e9f5ee"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem"}}>Packaging breakdown</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  {name:"Containers",value:data.components?.containers*15||0},
                  {name:"Bags",value:data.components?.outer_bags*8||0},
                  {name:"Lids",value:data.components?.lids*5||0},
                  {name:"Sachets",value:data.components?.sauce_sachets*2||0},
                  {name:"Cutlery",value:data.components?.cutlery_pieces*3||0},
                  {name:"Covers",value:data.components?.plastic_covers*4||0},
                ]} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({name,percent})=>`${name} ${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                  {GREENS.map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${Math.round(v)}g`]} contentStyle={{fontSize:12,borderRadius:12,border:"1px solid #e9f5ee"}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* By type */}
        <div style={{background:"white",borderRadius:20,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"2rem"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem"}}>Plastic by cuisine type</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={byType.slice(0,8)} layout="vertical" margin={{top:0,right:16,left:110,bottom:0}}>
              <XAxis type="number" tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:12,fill:"#2d6a4f"}} tickLine={false} axisLine={false} width={110}/>
              <Tooltip formatter={v=>[`${Math.round(v)}g`,"Total"]} contentStyle={{fontSize:12,borderRadius:12,border:"1px solid #e9f5ee",background:"white"}}/>
              <Bar dataKey="total_grams" radius={[0,8,8,0]}>
                {byType.slice(0,8).map((_,i)=><Cell key={i} fill={GREENS[i%GREENS.length]}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top restaurants */}
        <div style={{background:"white",borderRadius:20,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"2rem"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem"}}>Top plastic-generating restaurants</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {topRests.map((r,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",background:i===0?"#f0faf4":"#f8fdf9",borderRadius:12,border:i===0?"1px solid #b7e4c7":"1px solid transparent"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:i===0?"#2d6a4f":"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"white":"#2d6a4f",flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#1b4332",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.restaurant}</div>
                  <div style={{fontSize:11,color:"#95d5b2"}}>{CATS[r.restaurant_type]||r.restaurant_type} · {r.order_count} orders</div>
                </div>
                <div style={{fontSize:15,fontWeight:700,color:"#2d6a4f",flexShrink:0}}>{Math.round(r.total_grams)}g</div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div style={{marginBottom:"2rem"}}>
          <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem",letterSpacing:"-0.01em"}}>Where you can improve</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:12}}>
            {ins.worst_category&&<InsightCard icon="📦" accent="#e23744" title="Biggest offender" text={`${CATS[ins.worst_category]||ins.worst_category} orders average ${Math.round(ins.worst_category_avg_g)}g each — highest of any category.`}/>}
            {ins.potential_saving_g>0&&<InsightCard icon="♻️" accent="#2d6a4f" title="Potential saving" text={`Switching to lower-plastic alternatives could save ~${Math.round(ins.potential_saving_g/1000*10)/10}kg of plastic over this period.`}/>}
            {ins.best_category&&<InsightCard icon="✅" accent="#52b788" title="Your greenest choice" text={`${CATS[ins.best_category]||ins.best_category} is your most sustainable at just ${Math.round(ins.best_category_avg_g)}g per order.`}/>}
          </div>
        </div>

        <div style={{borderTop:"1px solid #e9f5ee",paddingTop:"1.5rem",display:"flex",gap:"1.5rem",justifyContent:"center"}}>
          <a href={`${API}/docs`} target="_blank" rel="noreferrer" style={{fontSize:13,color:"#52b788",fontWeight:500}}>Public API docs</a>
          <a href="https://github.com/manuparamesh/packetwatch-api" target="_blank" rel="noreferrer" style={{fontSize:13,color:"#52b788",fontWeight:500}}>GitHub</a>
        </div>
      </div>
    </div>
  )
}

/* ── ROOT APP ────────────────────────────────────────────────────────────── */
export default function App() {
  const [screen, setScreen] = useState("landing")
  const [showModal, setShowModal] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [result, setResult] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const state = params.get("state")
    if (code && state) {
      const apps = JSON.parse(sessionStorage.getItem("pw_apps") || '["zomato"]')
      window.history.replaceState({}, "", "/")
      startJob(code, state, apps)
    }
  }, [])

  useEffect(() => {
    if (!jobId) return
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API}/job/${jobId}`)
        const data = await res.json()
        setProgress(data.progress || 0)
        setMessage(data.message || "")
        if (data.status === "done") {
          clearInterval(pollRef.current)
          setResult(data.result)
          setScreen("dashboard")
        }
        if (data.status === "error") {
          clearInterval(pollRef.current)
          alert("Something went wrong: " + data.message)
          setScreen("landing")
        }
      } catch(e) { console.error(e) }
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleConnect = async () => {
    try {
      const res = await fetch(`${API}/auth/url?redirect_uri=${encodeURIComponent(window.location.origin + "/")}`)
      const { auth_url } = await res.json()
      window.location.href = auth_url
    } catch(e) {
      alert("Could not connect to API. Please try again.")
    }
  }

  const startJob = async (code, state, apps) => {
    setShowModal(false)
    setScreen("loading")
    try {
      const res = await fetch(`${API}/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state, apps, redirect_uri: window.location.origin + "/" })
      })
      const { job_id } = await res.json()
      setJobId(job_id)
    } catch(e) {
      alert("Error starting analysis: " + e.message)
      setScreen("landing")
    }
  }

  const handleAppStart = (apps) => {
    sessionStorage.setItem("pw_apps", JSON.stringify(apps))
    handleConnect()
  }

  if (screen === "loading") return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Loading progress={progress} message={message}/>
    </>
  )

  if (screen === "dashboard" && result) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Dashboard data={result} onReset={()=>{setScreen("landing");setResult(null)}}/>
    </>
  )

  return (
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Navbar onConnect={()=>setShowModal(true)}/>
      <Hero onConnect={()=>setShowModal(true)}/>
      <HowItWorks onConnect={()=>setShowModal(true)}/>
      <ImpactSection/>
      <PrivacySection/>
      <footer style={{background:"#1b4332",padding:"2rem",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
          <LeafLogo size={24}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:16,color:"white"}}>PacketWatch</span>
        </div>
        <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",marginBottom:8}}>
          <a href={`${API}/docs`} target="_blank" rel="noreferrer" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}}>API docs</a>
          <a href="https://github.com/manuparamesh/packetwatch-api" target="_blank" rel="noreferrer" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}}>GitHub</a>
        </div>
        <p style={{fontSize:12,color:"#52b788",margin:0}}>Open source · Built to raise awareness about food delivery plastic waste in India</p>
      </footer>
      {showModal && <ConnectModal onClose={()=>setShowModal(false)} onStart={handleAppStart}/>}
    </div>
  )
}
