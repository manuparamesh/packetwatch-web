import { useState, useEffect, useRef } from "react"
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts"

const API = import.meta.env.VITE_API_URL || "http://localhost:8000"
const GREENS = ["#1b4332","#2d6a4f","#40916c","#52b788","#74c69d","#95d5b2","#b7e4c7"]

const CATS = {
  biryani:"Biryani", burger_fast_food:"Burgers & Fast Food", bakery_dessert:"Bakery",
  south_indian:"South Indian", cafe_coffee:"Cafe & Coffee", roll_wrap_shawarma:"Rolls & Wraps",
  dhaba_northindian:"Dhaba & North Indian", healthy_bowl:"Healthy Bowls", sandwich_sub:"Sandwiches",
  pizza:"Pizza", chinese_asian:"Chinese & Asian", seafood:"Seafood", multicuisine:"Multi Cuisine",
  juice_beverage:"Juices", ice_cream:"Ice Cream", breakfast:"Breakfast",
  middle_eastern:"Middle Eastern", western_casual:"Western Casual",
  electronics:"Electronics", clothing_fashion:"Clothing & Fashion", books_stationery:"Books",
  home_appliances:"Home Appliances", kitchen:"Kitchen", beauty_personal:"Beauty",
  toys_games:"Toys & Games", sports_fitness:"Sports & Fitness", grocery_food:"Grocery",
  furniture:"Furniture", jewellery:"Jewellery", mobile_accessories:"Mobile Accessories", mixed:"Mixed"
}

const PLATFORMS_BY_COUNTRY = {
  "IN": { label:"🇮🇳 India", food:[
    {id:"zomato",label:"Zomato",color:"#e23744",icon:"🍽️"},
    {id:"swiggy",label:"Swiggy",color:"#fc8019",icon:"🧡"},
  ], ecommerce:[
    {id:"amazon_in",label:"Amazon India",color:"#FF9900",icon:"📦"},
    {id:"flipkart",label:"Flipkart",color:"#2874F0",icon:"🛒"},
  ]},
  "US": { label:"🇺🇸 United States", food:[
    {id:"doordash",label:"DoorDash",color:"#ff3008",icon:"🚪"},
    {id:"uber_eats",label:"Uber Eats",color:"#06C167",icon:"🚗"},
  ], ecommerce:[
    {id:"amazon_us",label:"Amazon US",color:"#FF9900",icon:"📦"},
    {id:"walmart",label:"Walmart",color:"#0071CE",icon:"🛒"},
  ]},
  "GB": { label:"🇬🇧 United Kingdom", food:[
    {id:"deliveroo",label:"Deliveroo",color:"#00CCBC",icon:"🦘"},
    {id:"uber_eats_gb",label:"Uber Eats",color:"#06C167",icon:"🚗"},
  ], ecommerce:[
    {id:"amazon_uk",label:"Amazon UK",color:"#FF9900",icon:"📦"},
    {id:"asos",label:"ASOS",color:"#000000",icon:"👗"},
  ]},
  "EU": { label:"🇪🇺 Europe", food:[
    {id:"bolt_food",label:"Bolt Food",color:"#34D186",icon:"⚡"},
    {id:"deliveroo_eu",label:"Deliveroo",color:"#00CCBC",icon:"🦘"},
  ], ecommerce:[
    {id:"amazon_eu",label:"Amazon EU",color:"#FF9900",icon:"📦"},
    {id:"zalando",label:"Zalando",color:"#FF6900",icon:"👟"},
  ]},
  "AE": { label:"🇦🇪 Middle East", food:[
    {id:"talabat",label:"Talabat",color:"#FF6B00",icon:"🥙"},
    {id:"uber_eats_ae",label:"Uber Eats",color:"#06C167",icon:"🚗"},
  ], ecommerce:[
    {id:"amazon_ae",label:"Amazon AE",color:"#FF9900",icon:"📦"},
    {id:"noon",label:"Noon",color:"#FFEE00",icon:"🛍️"},
  ]},
  "SG": { label:"🇸🇬 Southeast Asia", food:[
    {id:"grab_food",label:"GrabFood",color:"#00B14F",icon:"🟢"},
    {id:"uber_eats_sg",label:"Uber Eats",color:"#06C167",icon:"🚗"},
  ], ecommerce:[
    {id:"shopee",label:"Shopee",color:"#EE4D2D",icon:"🛒"},
    {id:"lazada",label:"Lazada",color:"#0F146D",icon:"📱"},
  ]},
}

/* ── CSS ──────────────────────────────────────────────────────────────────── */
const GlobalStyle = () => (
  <style>{`
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'DM Sans', sans-serif; }
    @media (max-width: 768px) {
      .hero-grid { grid-template-columns: 1fr !important; }
      .photo-grid { grid-template-columns: 1fr !important; }
      .photo-grid > div:first-child { min-height: 280px !important; }
      .hide-mobile { display: none !important; }
      .nav-links { display: none !important; }
      .dashboard-grid { grid-template-columns: 1fr !important; }
      .kpi-grid { grid-template-columns: 1fr 1fr !important; }
      .feedback-banner { grid-template-columns: 1fr !important; }
      .hero-padding { padding: 6rem 1.25rem 2.5rem !important; }
      .section-padding { padding: 3.5rem 1.25rem !important; }
      .chart-height { height: 200px !important; }
      .modal-padding { padding: 1.5rem !important; }
    }
    @media (max-width: 480px) {
      .kpi-grid { grid-template-columns: 1fr !important; }
    }
  `}</style>
)

function LeafLogo({ size=32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="24" r="24" fill="#1b4332"/>
      <path d="M14 34C14 34 16 22 26 18C36 14 36 14 36 14C36 14 34 24 24 28C19 30 14 34 14 34Z" fill="#95d5b2"/>
      <path d="M14 34C14 34 18 28 24 26" stroke="#52b788" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

/* ── NAVBAR ──────────────────────────────────────────────────────────────── */
function Navbar({ onConnect, onPrivacy, onTerms }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", fn)
    return () => window.removeEventListener("scroll", fn)
  }, [])
  const bg = scrolled ? "rgba(255,255,255,0.96)" : "transparent"
  const textColor = scrolled ? "#1b4332" : "white"
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:100,background:bg,
        backdropFilter:scrolled?"blur(12px)":"none",borderBottom:scrolled?"1px solid #e9f5ee":"none",
        padding:"0 1.5rem",height:64,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <LeafLogo size={34}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:textColor,transition:"color 0.3s"}}>PacketWatch</span>
        </div>
        <div className="nav-links" style={{display:"flex",alignItems:"center",gap:"1.5rem"}}>
          {[["#how","How it works"],["#impact","Impact"],["#globe","Global"],["#about","About"]].map(([href,label])=>(
            <a key={href} href={href} style={{fontSize:14,color:textColor,textDecoration:"none",fontWeight:500,opacity:0.85,transition:"color 0.3s"}}>{label}</a>
          ))}
          <button onClick={onConnect} style={{background:"#52b788",color:"white",border:"none",borderRadius:100,padding:"9px 20px",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            Connect Gmail
          </button>
        </div>
        <button className="hide-desktop" onClick={()=>setMenuOpen(!menuOpen)}
          style={{background:"none",border:"none",cursor:"pointer",padding:8,display:"flex",flexDirection:"column",gap:5}}>
          {[0,1,2].map(i=><div key={i} style={{width:22,height:2,background:textColor,borderRadius:2,transition:"all 0.3s"}}/>)}
        </button>
      </nav>
      {menuOpen && (
        <div style={{position:"fixed",top:64,left:0,right:0,zIndex:99,background:"white",borderBottom:"1px solid #e9f5ee",padding:"1.5rem",display:"flex",flexDirection:"column",gap:16}}>
          {[["#how","How it works"],["#impact","Impact"],["#globe","Global"],["#about","About"]].map(([href,label])=>(
            <a key={href} href={href} onClick={()=>setMenuOpen(false)}
              style={{fontSize:16,color:"#1b4332",textDecoration:"none",fontWeight:500}}>{label}</a>
          ))}
          <button onClick={()=>{setMenuOpen(false);onConnect()}}
            style={{background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"12px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
            Connect Gmail and analyse
          </button>
        </div>
      )}
    </>
  )
}

/* ── HERO ─────────────────────────────────────────────────────────────────── */
function Hero({ onConnect, globalStats }) {
  return (
    <section style={{position:"relative",minHeight:"100vh",display:"flex",alignItems:"center",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <img src="/hero-bg.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(27,67,50,0.92) 0%,rgba(27,67,50,0.75) 55%,rgba(27,67,50,0.5) 100%)"}}/>
      </div>
      <div className="hero-grid hero-padding" style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"8rem 2rem 4rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3rem",alignItems:"center",width:"100%"}}>
        <div>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(149,213,178,0.15)",border:"1px solid rgba(149,213,178,0.3)",borderRadius:100,padding:"6px 16px",marginBottom:"1.25rem"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#95d5b2"}}/>
            <span style={{fontSize:12,fontWeight:700,color:"#95d5b2",letterSpacing:"0.08em"}}>FOOD DELIVERY AND ECOMMERCE PLASTIC TRACKER</span>
          </div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(32px,5vw,54px)",fontWeight:700,lineHeight:1.1,color:"white",margin:"0 0 1.25rem",letterSpacing:"-0.02em"}}>
            How much plastic does your online shopping generate?
          </h1>
          <p style={{fontSize:17,color:"rgba(255,255,255,0.8)",lineHeight:1.75,margin:"0 0 2rem"}}>
            From Zomato biryanis to Amazon parcels, every order comes wrapped in plastic. Connect your Gmail and find out exactly how much you are generating.
          </p>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:"2.5rem",flexWrap:"wrap"}}>
            <button onClick={onConnect} style={{background:"#52b788",color:"white",border:"none",borderRadius:100,padding:"14px 28px",fontSize:16,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:10,boxShadow:"0 8px 32px rgba(82,183,136,0.35)"}}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="white"/></svg>
              Connect Gmail and analyse
            </button>
            <a href="#how" style={{fontSize:14,color:"rgba(255,255,255,0.75)",fontWeight:500,textDecoration:"none"}}>See how it works</a>
          </div>
          <div style={{display:"flex",gap:"2rem",flexWrap:"wrap"}}>
            {[
              [globalStats.total_users > 0 ? `${globalStats.total_users}` : "Growing", "footprints tracked"],
              [globalStats.total_kg > 0 ? `${globalStats.total_kg}kg` : "Real data", "plastic mapped"],
              ["12","platforms supported"],
            ].map(([n,l])=>(
              <div key={l}>
                <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"white"}}>{n}</div>
                <div style={{fontSize:11,color:"#95d5b2",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hide-mobile" style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
          <div style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(20px)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:24,padding:"2rem",textAlign:"center"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#95d5b2",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>
              {globalStats.total_users > 0 ? `${globalStats.total_users} users tracked` : "connect to see yours"}
            </div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:56,fontWeight:700,color:"white",lineHeight:1}}>
              {globalStats.total_kg > 0 ? globalStats.total_kg.toFixed(2) : "??.??"}
              <span style={{fontSize:20,color:"#95d5b2"}}> kg</span>
            </div>
            <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginTop:8}}>total plastic tracked globally</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.75rem"}}>
            {[["Food orders","Zomato, Swiggy, DoorDash and more"],["Ecommerce","Amazon, Flipkart, ASOS and more"],["Read-only","Gmail access, nothing stored"],["Free","Always and forever"]].map(([v,l])=>(
              <div key={v} style={{background:"rgba(255,255,255,0.06)",backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"1rem",textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:"white",marginBottom:4}}>{v}</div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── PHOTO / IMPACT ───────────────────────────────────────────────────────── */
function PhotoSection() {
  return (
    <section id="impact" className="photo-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
      <div style={{position:"relative",overflow:"hidden",minHeight:400}}>
        <img src="/impact-bg.jpg" alt="plastic packaging waste" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",display:"block"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(27,67,50,0.88) 0%,rgba(27,67,50,0.2) 55%)",display:"flex",alignItems:"flex-end",padding:"2.5rem"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(20px,3vw,28px)",fontWeight:700,color:"white",marginBottom:10,lineHeight:1.2}}>Every order.<br/>Every wrapper.</div>
            <div style={{fontSize:14,color:"rgba(255,255,255,0.75)",lineHeight:1.6,maxWidth:300}}>The average online order generates 50 to 150g of plastic. Most of it is in landfill within hours of delivery.</div>
          </div>
        </div>
      </div>
      <div style={{background:"#1b4332",padding:"3.5rem 2.5rem",display:"flex",flexDirection:"column",justifyContent:"center"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#52b788",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"1.25rem"}}>The problem</div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(22px,3vw,34px)",fontWeight:700,color:"white",margin:"0 0 1.25rem",lineHeight:1.2}}>Most people have no idea how much plastic their shopping generates</h2>
        <p style={{fontSize:15,color:"rgba(255,255,255,0.65)",lineHeight:1.8,margin:"0 0 1.75rem"}}>It is not just food delivery. Every Amazon parcel, every Flipkart shipment, every fashion order comes wrapped in plastic film, bubble wrap and poly bags. PacketWatch tracks all of it.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {[["4.2B","food delivery orders in India yearly"],["2.5B","ecommerce parcels shipped in India"],["less than 5%","of this plastic actually gets recycled"]].map(([n,l])=>(
            <div key={l} style={{display:"flex",alignItems:"center",gap:16,padding:"12px 16px",background:"rgba(255,255,255,0.05)",borderRadius:12}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#52b788",flexShrink:0,minWidth:70}}>{n}</div>
              <div style={{fontSize:14,color:"rgba(255,255,255,0.6)"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── HOW IT WORKS ─────────────────────────────────────────────────────────── */
function GmailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 48 48" fill="none">
      <path d="M44 8H4C1.8 8 0 9.8 0 12v24c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4z" fill="white"/>
      <path d="M4 8h40L24 26 4 8z" fill="#EA4335"/>
      <path d="M0 12v24l16-12L0 12z" fill="#34A853"/>
      <path d="M48 12v24L32 24l16-12z" fill="#FBBC05"/>
      <path d="M4 36h40L32 24 24 30l-8-6L0 36h4z" fill="#4285F4"/>
    </svg>
  )
}

function HowItWorks({ onConnect }) {
  const steps = [
    {num:"01",icon:<GmailIcon/>,iconBg:"#fce8e6",title:"Connect your Gmail",desc:"Connecting your Gmail takes one click. We search only for order confirmation emails and nothing else is ever read, stored, or shared."},
    {num:"02",icon:"🔬",iconBg:"#d8f3dc",title:"Validated on 100+ real orders",desc:"Packaging rules were built from 100+ validated orders covering food delivery and ecommerce across multiple regions. Every new user makes the model more accurate.",link:{label:"Read how we built it",url:"#"}},
    {num:"03",icon:"📊",iconBg:"#e8f4fd",title:"See your full footprint",desc:"Get a personal plastic report covering food orders, ecommerce parcels, trend over time, worst offenders, and exactly where you can cut down."},
  ]
  return (
    <section id="how" className="section-padding" style={{padding:"5rem 2rem",background:"#f8fdf9"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#40916c",letterSpacing:"0.1em",textTransform:"uppercase"}}>HOW IT WORKS</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,42px)",fontWeight:700,color:"#1b4332",margin:"0.75rem 0 1rem",letterSpacing:"-0.02em"}}>Three steps to know your plastic truth</h2>
          <p style={{fontSize:16,color:"#52b788",maxWidth:480,margin:"0 auto",lineHeight:1.6}}>Takes less than 2 minutes with no uploads and no manual work.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"1.5rem",marginBottom:"2.5rem"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{background:"white",borderRadius:20,padding:"2rem 1.75rem",border:"1px solid #e9f5ee",position:"relative",overflow:"hidden",boxShadow:"0 2px 20px rgba(27,67,50,0.04)"}}>
              <div style={{position:"absolute",top:8,right:14,fontFamily:"'Playfair Display',serif",fontSize:72,fontWeight:700,color:"#f0faf4",lineHeight:1}}>{s.num}</div>
              <div style={{position:"relative",zIndex:1}}>
                <div style={{width:52,height:52,borderRadius:14,background:s.iconBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:"1rem",flexShrink:0}}>{s.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1b4332",margin:"0 0 0.65rem"}}>{s.title}</h3>
                <p style={{fontSize:14,color:"#40916c",lineHeight:1.7,margin:"0 0 0.75rem"}}>{s.desc}</p>
                {s.link && <a href={s.link.url} style={{fontSize:13,fontWeight:600,color:"#2d6a4f",textDecoration:"none",borderBottom:"1px solid #b7e4c7",paddingBottom:1}}>{s.link.label}</a>}
              </div>
            </div>
          ))}
        </div>
        <div className="feedback-banner" style={{background:"#1b4332",borderRadius:20,padding:"2rem 2.5rem",display:"grid",gridTemplateColumns:"1fr auto",gap:"2rem",alignItems:"center"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.875rem"}}>
              <div style={{width:40,height:40,borderRadius:10,background:"rgba(149,213,178,0.15)",border:"1px solid rgba(149,213,178,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🌱</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"white",margin:0}}>Why your feedback matters</h3>
            </div>
            <p style={{fontSize:15,color:"#95d5b2",lineHeight:1.75,margin:"0 0 1rem",maxWidth:560}}>
              Our model improves with every piece of feedback. If we got something wrong, tell us and your correction shapes the next version. Right now we are validated on <strong style={{color:"white"}}>100 plus orders</strong>. With your help we can reach <strong style={{color:"white"}}>10,000</strong>.
            </p>
            <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
              {[["100+","orders validated"],["10,000","our next target"],["Every user","improves accuracy"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#52b788"}}>{n}</div>
                  <div style={{fontSize:11,color:"#74c69d",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onConnect} style={{background:"#52b788",color:"white",border:"none",borderRadius:100,padding:"13px 24px",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",flexShrink:0}}>
            Contribute now
          </button>
        </div>
      </div>
    </section>
  )
}

/* ── GLOBAL SECTION ───────────────────────────────────────────────────────── */
function GlobalSection({ globalStats }) {
  const dots = [
    {code:"IN",x:390,y:190,label:"India"},
    {code:"US",x:145,y:165,label:"USA"},
    {code:"GB",x:255,y:120,label:"UK"},
    {code:"EU",x:278,y:128,label:"Europe"},
    {code:"AE",x:352,y:192,label:"Middle East"},
    {code:"SG",x:428,y:218,label:"SE Asia"},
  ]
  const byCountry = (globalStats.by_country || []).reduce((a,r)=>({...a,[r.country]:r}),{})
  return (
    <section id="globe" className="section-padding" style={{padding:"5rem 2rem",background:"#1b4332"}}>
      <div style={{maxWidth:1100,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#52b788",letterSpacing:"0.1em",textTransform:"uppercase"}}>GLOBAL IMPACT</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:"white",margin:"0.75rem 0 1rem",letterSpacing:"-0.02em"}}>Plastic footprints tracked worldwide</h2>
          <p style={{fontSize:15,color:"#74c69d",maxWidth:460,margin:"0 auto",lineHeight:1.6}}>Every analysis adds to our anonymous global dataset.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"2rem",maxWidth:560,margin:"0 auto 2rem"}}>
          {[[globalStats.total_users||0,"footprints tracked"],[`${(globalStats.total_kg||0).toFixed(1)}kg`,"plastic mapped"],[globalStats.total_orders||0,"orders analysed"]].map(([v,l])=>(
            <div key={l} style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"1.25rem",textAlign:"center"}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"white"}}>{v}</div>
              <div style={{fontSize:11,color:"#74c69d",marginTop:4}}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{background:"rgba(255,255,255,0.03)",borderRadius:20,padding:"1.5rem",border:"1px solid rgba(255,255,255,0.06)",marginBottom:"2rem"}}>
          <svg viewBox="0 0 560 290" style={{width:"100%",maxHeight:240}}>
            <path d="M80 80 Q120 60 160 80 Q180 100 170 140 Q160 170 140 180 Q120 190 100 170 Q70 150 60 120 Q50 100 80 80Z" fill="#2d6a4f" opacity="0.5"/>
            <path d="M120 200 Q145 190 160 210 Q170 240 155 268 Q140 288 120 278 Q100 263 105 238 Q108 213 120 200Z" fill="#2d6a4f" opacity="0.5"/>
            <path d="M240 78 Q270 68 292 84 Q307 100 297 120 Q282 130 262 125 Q241 115 236 100 Q233 87 240 78Z" fill="#2d6a4f" opacity="0.5"/>
            <path d="M256 144 Q286 134 302 154 Q317 180 312 220 Q302 250 282 254 Q261 254 249 229 Q239 204 241 179 Q244 157 256 144Z" fill="#2d6a4f" opacity="0.5"/>
            <path d="M302 68 Q382 53 432 78 Q472 98 467 138 Q457 168 422 178 Q382 183 342 168 Q307 153 297 128 Q287 103 302 68Z" fill="#2d6a4f" opacity="0.5"/>
            <path d="M422 218 Q452 208 467 224 Q477 244 462 258 Q442 266 422 253 Q409 240 422 218Z" fill="#2d6a4f" opacity="0.5"/>
            {dots.map(d=>{
              const active = byCountry[d.code]
              return (
                <g key={d.code}>
                  {active && <circle cx={d.x} cy={d.y} r="16" fill="#52b788" opacity="0.15"><animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite"/></circle>}
                  <circle cx={d.x} cy={d.y} r={active?6:4} fill={active?"#52b788":"#40916c"} opacity={active?1:0.4}/>
                  <text x={d.x} y={d.y-10} textAnchor="middle" fontSize="8" fill={active?"#95d5b2":"#40916c"} fontFamily="sans-serif">
                    {d.label}{active?` (${active.users})`:""}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"1rem"}}>
          {Object.entries(PLATFORMS_BY_COUNTRY).map(([code,{label,food,ecommerce}])=>(
            <div key={code} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:14,padding:"1.25rem"}}>
              <div style={{fontSize:14,fontWeight:600,color:"white",marginBottom:10}}>{label}</div>
              <div style={{fontSize:11,color:"#52b788",fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.05em"}}>Food</div>
              {food.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:13}}>{p.icon}</span><span style={{fontSize:12,color:"#74c69d"}}>{p.label}</span></div>)}
              <div style={{fontSize:11,color:"#FF9900",fontWeight:600,margin:"8px 0 6px",textTransform:"uppercase",letterSpacing:"0.05em"}}>Ecommerce</div>
              {ecommerce.map(p=><div key={p.id} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:13}}>{p.icon}</span><span style={{fontSize:12,color:"#74c69d"}}>{p.label}</span></div>)}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── ABOUT ────────────────────────────────────────────────────────────────── */
function AboutSection() {
  const team = [
    {name:"Manu Paramesh",photo:"/manu.jpg",role:"Co-founder, ML Engineer",bio:"Manu is passionate about applying machine learning to real sustainability challenges. He built PacketWatch to make the plastic cost of online shopping visible and actionable.",tags:["ML Engineering","Sustainability Tech","Data Pipelines"],linkedin:"manuparamesh"},
    {name:"Roopa Narayanan",photo:"/roopa.jpg",role:"Co-founder, Sustainability Expert",bio:"Roopa is a sustainability expert and impact consultant with deep expertise in environmental policy and consumer behaviour. She shapes PacketWatch's estimation methodology.",tags:["Sustainability","Impact Consulting","Environmental Policy"],linkedin:"roopanarayanan"},
  ]
  return (
    <section id="about" className="section-padding" style={{padding:"5rem 2rem",background:"#f8fdf9"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"3.5rem"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#40916c",letterSpacing:"0.1em",textTransform:"uppercase"}}>THE TEAM</span>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(26px,4vw,40px)",fontWeight:700,color:"#1b4332",margin:"0.75rem 0 1rem",letterSpacing:"-0.02em"}}>Built by people who care</h2>
          <p style={{fontSize:16,color:"#52b788",maxWidth:460,margin:"0 auto",lineHeight:1.6}}>PacketWatch started as a personal frustration. Now it is a public tool for anyone who wants to understand their real plastic footprint.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:"2rem"}}>
          {team.map((p,i)=>(
            <div key={i} style={{background:"white",borderRadius:20,overflow:"hidden",border:"1px solid #e9f5ee",boxShadow:"0 4px 20px rgba(27,67,50,0.06)"}}>
              <div style={{height:260,overflow:"hidden",position:"relative"}}>
                <img src={p.photo} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(27,67,50,0.65) 0%,transparent 50%)",display:"flex",alignItems:"flex-end",padding:"1.5rem"}}>
                  <div>
                    <div style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"white"}}>{p.name}</div>
                    <div style={{fontSize:13,color:"#95d5b2"}}>{p.role}</div>
                  </div>
                </div>
              </div>
              <div style={{padding:"1.5rem"}}>
                <p style={{fontSize:14,color:"#40916c",lineHeight:1.75,margin:"0 0 1rem"}}>{p.bio}</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:"1rem"}}>
                  {p.tags.map(t=><span key={t} style={{fontSize:11,fontWeight:600,color:"#2d6a4f",background:"#d8f3dc",borderRadius:100,padding:"3px 10px"}}>{t}</span>)}
                </div>
                <a href={`https://linkedin.com/in/${p.linkedin}`} target="_blank" rel="noreferrer"
                  style={{display:"inline-flex",alignItems:"center",gap:6,fontSize:13,color:"#2d6a4f",textDecoration:"none",fontWeight:600,border:"1px solid #d8f3dc",borderRadius:100,padding:"7px 14px"}}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#2d6a4f"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CONNECT MODAL ────────────────────────────────────────────────────────── */
function ConnectModal({ onClose, onStart }) {
  const [country, setCountry] = useState("IN")
  const [tab, setTab] = useState("food")
  const [apps, setApps] = useState(["zomato"])
  const countryData = PLATFORMS_BY_COUNTRY[country]
  const currentPlatforms = tab === "food" ? countryData.food : countryData.ecommerce

  const handleCountryChange = (c) => {
    setCountry(c)
    setTab("food")
    setApps([PLATFORMS_BY_COUNTRY[c].food[0]?.id].filter(Boolean))
  }
  const toggle = (id) => setApps(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id])

  return (
    <div style={{position:"fixed",inset:0,zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(27,67,50,0.7)",backdropFilter:"blur(12px)",padding:"1rem"}} onClick={onClose}>
      <div className="modal-padding" style={{background:"white",borderRadius:24,padding:"2.5rem",width:"100%",maxWidth:480,boxShadow:"0 32px 100px rgba(27,67,50,0.3)",maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"1.25rem"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><LeafLogo size={26}/><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#1b4332"}}>PacketWatch</span></div>
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#1b4332",margin:0}}>Analyse your orders</h3>
          </div>
          <button onClick={onClose} style={{background:"#f0faf4",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",fontSize:19,color:"#2d6a4f",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>

        <div style={{background:"#f0faf4",borderRadius:10,padding:"10px 14px",marginBottom:"1.25rem",display:"flex",gap:10,alignItems:"flex-start"}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#2d6a4f" style={{flexShrink:0,marginTop:2}}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/></svg>
          <span style={{fontSize:13,color:"#2d6a4f",lineHeight:1.5}}><strong>Read-only</strong> Gmail access. We never store your emails and only analyse them live in your session.</span>
        </div>

        <div style={{marginBottom:"1.25rem"}}>
          <label style={{fontSize:13,fontWeight:600,color:"#40916c",display:"block",marginBottom:8}}>Your country</label>
          <select value={country} onChange={e=>handleCountryChange(e.target.value)}
            style={{width:"100%",padding:"11px 14px",borderRadius:10,border:"1.5px solid #d8f3dc",fontSize:15,color:"#1b4332",background:"white",cursor:"pointer",fontFamily:"inherit"}}>
            {Object.entries(PLATFORMS_BY_COUNTRY).map(([code,{label}])=><option key={code} value={code}>{label}</option>)}
          </select>
        </div>

        <div style={{marginBottom:"1rem"}}>
          <div style={{display:"flex",gap:8,marginBottom:"1rem"}}>
            {["food","ecommerce"].map(t=>(
              <button key={t} onClick={()=>{setTab(t);setApps([])}}
                style={{flex:1,padding:"9px",borderRadius:10,border:`2px solid ${tab===t?"#1b4332":"#e9f5ee"}`,background:tab===t?"#1b4332":"white",color:tab===t?"white":"#40916c",fontSize:14,fontWeight:600,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>
                {t === "food" ? "🍽️ Food delivery" : "📦 Ecommerce"}
              </button>
            ))}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {currentPlatforms.map(p=>(
              <div key={p.id} onClick={()=>toggle(p.id)}
                style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`2px solid ${apps.includes(p.id)?"#2d6a4f":"#e9f5ee"}`,background:apps.includes(p.id)?"#f0faf4":"white",cursor:"pointer",transition:"all 0.15s"}}>
                <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${apps.includes(p.id)?"#2d6a4f":"#b7e4c7"}`,background:apps.includes(p.id)?"#2d6a4f":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {apps.includes(p.id)&&<svg width="11" height="11" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span style={{fontSize:16}}>{p.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:700,color:p.color}}>{p.label}</div>
                  <div style={{fontSize:11,color:"#95d5b2"}}>Order confirmation emails</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={()=>apps.length&&onStart(apps,country)}
          style={{width:"100%",padding:"14px",background:apps.length?"#1b4332":"#d8f3dc",color:apps.length?"white":"#95d5b2",border:"none",borderRadius:100,fontSize:15,fontWeight:700,cursor:apps.length?"pointer":"default",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" fill="currentColor"/></svg>
          Sign in with Google and analyse
        </button>
        <p style={{fontSize:11,color:"#95d5b2",textAlign:"center",margin:0}}>Your Gmail credentials are handled directly by Google.</p>
      </div>
    </div>
  )
}

/* ── LOADING ──────────────────────────────────────────────────────────────── */
function Loading({ progress, message }) {
  const tips = [
    "The average food delivery order generates around 52g of plastic.",
    "An Amazon parcel with bubble wrap can generate 80 to 150g of plastic.",
    "Burger chains often use paper packaging, so they generate far less plastic than most.",
    "Fashion platforms like ASOS and Zalando ship in poly mailer bags, around 20g each.",
    "Switching to eco-packaging restaurants could cut your food plastic footprint by 60 percent.",
  ]
  const [tip, setTip] = useState(0)
  const [plasticSoFar, setPlasticSoFar] = useState(0)
  useEffect(()=>{const t=setInterval(()=>setTip(p=>(p+1)%tips.length),3500);return()=>clearInterval(t)},[])
  useEffect(()=>{setPlasticSoFar(prev=>Math.max(prev,progress*0.6))},[progress])

  return (
    <div style={{minHeight:"100vh",background:"#1b4332",display:"flex",alignItems:"center",justifyContent:"center",padding:"2rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,zIndex:0}}>
        <img src="/loading-bg.jpg" alt="" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",opacity:0.12}}/>
        <div style={{position:"absolute",inset:0,background:"rgba(27,67,50,0.88)"}}/>
      </div>
      <div style={{textAlign:"center",maxWidth:500,width:"100%",position:"relative",zIndex:1}}>
        <div style={{animation:"spin 3s linear infinite",display:"inline-block",marginBottom:"1.5rem"}}>
          <LeafLogo size={60}/>
        </div>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(24px,5vw,32px)",fontWeight:700,color:"white",margin:"0 0 0.5rem"}}>Analysing your orders</h2>
        <p style={{fontSize:15,color:"#74c69d",margin:"0 0 2rem",lineHeight:1.6}}>{message || "Fetching your order history from Gmail..."}</p>
        {plasticSoFar > 0 && (
          <div style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:18,padding:"1.5rem",marginBottom:"1.5rem"}}>
            <div style={{fontSize:11,fontWeight:700,color:"#74c69d",letterSpacing:"0.1em",marginBottom:8}}>PLASTIC FOUND SO FAR</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:44,fontWeight:700,color:"white",lineHeight:1}}>{plasticSoFar.toFixed(1)}<span style={{fontSize:18,color:"#95d5b2"}}>g</span></div>
          </div>
        )}
        <div style={{height:5,background:"rgba(255,255,255,0.1)",borderRadius:100,overflow:"hidden",marginBottom:8}}>
          <div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#40916c,#74c69d)",borderRadius:100,transition:"width 0.6s ease"}}/>
        </div>
        <div style={{fontSize:13,color:"#52b788",marginBottom:"2rem"}}>{progress}% complete</div>
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"1.25rem 1.5rem",textAlign:"left"}}>
          <div style={{fontSize:10,fontWeight:700,color:"#52b788",letterSpacing:"0.1em",marginBottom:6}}>DID YOU KNOW?</div>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.7)",lineHeight:1.6,margin:0}}>{tips[tip]}</p>
        </div>
      </div>
      <style>{`@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

/* ── ANIMATED ORDER REVEAL ────────────────────────────────────────────────── */
function AnimatedOrderList({ orders }) {
  const [visible, setVisible] = useState([])
  const [running, setRunning] = useState(false)
  const [total, setTotal] = useState(0)
  const EMOJI = ["🍛","📦","🛒","🍔","☕","👗","📱","🥗","🎁","🍕"]
  const run = () => {
    if(running) return
    setRunning(true); setVisible([]); setTotal(0)
    let i=0
    const interval = setInterval(()=>{
      if(i>=orders.length){clearInterval(interval);setRunning(false);return}
      const order=orders[i]
      setVisible(p=>[...p,{...order,idx:i}])
      setTotal(p=>+(p+order.total_grams).toFixed(1))
      i++
    },700)
  }
  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.875rem",flexWrap:"wrap",gap:8}}>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:"#1b4332"}}>Order by order plastic reveal</div>
          <div style={{fontSize:11,color:"#95d5b2",marginTop:2}}>Watch your plastic footprint build up</div>
        </div>
        <button onClick={run} disabled={running}
          style={{background:running?"#f0faf4":"#1b4332",color:running?"#95d5b2":"white",border:"none",borderRadius:100,padding:"8px 18px",fontSize:13,fontWeight:600,cursor:running?"default":"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
          {running ? "Revealing..." : "Reveal orders"}
        </button>
      </div>
      {total > 0 && (
        <div style={{background:"#f0faf4",borderRadius:10,padding:"10px 14px",marginBottom:"0.875rem",display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #d8f3dc"}}>
          <span style={{fontSize:13,color:"#40916c",fontWeight:500}}>Running total</span>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1b4332"}}>{total}g</span>
        </div>
      )}
      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:300,overflowY:"auto"}}>
        {visible.map((o,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"white",borderRadius:10,border:"1px solid #e9f5ee",animation:"slideIn 0.35s ease"}}>
            <div style={{width:32,height:32,borderRadius:8,background:o.platform_type==="ecommerce"?"#fff3e0":"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
              {EMOJI[o.idx%EMOJI.length]}
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,color:"#1b4332",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.restaurant}</div>
              <div style={{fontSize:11,color:"#95d5b2"}}>{o.date} · {o.platform_type==="ecommerce"?"Ecommerce":"Food delivery"}</div>
            </div>
            <div style={{fontSize:13,fontWeight:700,color:"#2d6a4f",background:"#f0faf4",padding:"3px 10px",borderRadius:100,flexShrink:0}}>{o.total_grams}g</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}

/* ── FEEDBACK BOX ─────────────────────────────────────────────────────────── */
function FeedbackBox({ country, totalKg }) {
  const [message, setMessage] = useState("")
  const [rating, setRating] = useState(null)
  const [status, setStatus] = useState("idle")
  const submit = async () => {
    if (!message.trim() || message.trim().length < 3) return
    setStatus("sending")
    try {
      const res = await fetch(`${API}/feedback`, {
        method: "POST", headers: {"Content-Type":"application/json"},
        body: JSON.stringify({message, country, total_kg: totalKg, rating})
      })
      setStatus(res.ok ? "done" : "error")
    } catch { setStatus("error") }
  }
  return (
    <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"1.5rem"}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:"1.25rem"}}>
        <div style={{width:38,height:38,borderRadius:10,background:"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>💬</div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:"#1b4332",marginBottom:3}}>How accurate were these estimates?</div>
          <div style={{fontSize:13,color:"#52b788",lineHeight:1.5}}>Your feedback improves the model. Did we get anything wrong or miss something?</div>
        </div>
      </div>
      {status === "done" ? (
        <div style={{background:"#f0faf4",borderRadius:10,padding:"1rem",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>✅</span>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#1b4332"}}>Thanks for the feedback!</div>
            <div style={{fontSize:12,color:"#52b788"}}>It goes directly into improving PacketWatch's accuracy.</div>
          </div>
        </div>
      ) : (
        <>
          <div style={{marginBottom:"1rem"}}>
            <div style={{fontSize:12,fontWeight:600,color:"#40916c",marginBottom:8}}>How accurate overall? (optional)</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} onClick={()=>setRating(n===rating?null:n)}
                  style={{width:34,height:34,borderRadius:8,border:`1.5px solid ${rating&&n<=rating?"#2d6a4f":"#e9f5ee"}`,background:rating&&n<=rating?"#f0faf4":"white",cursor:"pointer",fontSize:16}}>
                  {n<=(rating||0)?"⭐":"☆"}
                </button>
              ))}
              {rating && <span style={{fontSize:12,color:"#52b788",alignSelf:"center",marginLeft:4}}>{["","Very inaccurate","Inaccurate","OK","Accurate","Very accurate"][rating]}</span>}
            </div>
          </div>
          <textarea value={message} onChange={e=>setMessage(e.target.value)} rows={3}
            placeholder="e.g. The biryani estimate felt too high, or you missed the bubble wrap on my Amazon order"
            style={{width:"100%",padding:"11px 13px",borderRadius:10,border:"1.5px solid #e9f5ee",fontSize:14,color:"#1b4332",fontFamily:"'DM Sans',sans-serif",lineHeight:1.6,resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:"0.75rem"}}/>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:11,color:"#95d5b2"}}>{message.length}/500</span>
            <button onClick={submit} disabled={status==="sending"||message.trim().length<3}
              style={{background:message.trim().length>=3?"#1b4332":"#d8f3dc",color:message.trim().length>=3?"white":"#95d5b2",border:"none",borderRadius:100,padding:"9px 22px",fontSize:14,fontWeight:600,cursor:message.trim().length>=3?"pointer":"default",fontFamily:"inherit"}}>
              {status==="sending" ? "Sending..." : "Send feedback"}
            </button>
          </div>
          {status==="error" && <div style={{fontSize:12,color:"#e23744",marginTop:8}}>Something went wrong. Please try again.</div>}
        </>
      )}
    </div>
  )
}

/* ── DASHBOARD ────────────────────────────────────────────────────────────── */
function Dashboard({ data, onReset, selectedApps=[] }) {
  const s = data.summary || {}
  const byType = (data.by_restaurant_type||[]).map(r=>({...r,name:CATS[r.restaurant_type]||r.restaurant_type}))
  const topRests = data.top_restaurants || []
  const ins = data.insights || {}
  const perOrder = data.per_order || []
  const comp = data.components || {}
  const perOrderBar = perOrder.map((o,i)=>({name:`#${i+1}`,grams:o.total_grams,restaurant:o.restaurant}))

  const platformNames = selectedApps.map(id=>{
    for(const c of Object.values(PLATFORMS_BY_COUNTRY)){
      const p=[...c.food,...c.ecommerce].find(p=>p.id===id)
      if(p) return p.label
    }
    return id
  }).join(", ")

  if(s.total_orders===0) return (
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f8fdf9",flexDirection:"column",gap:"1rem",padding:"2rem",textAlign:"center"}}>
      <LeafLogo size={52}/>
      <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:"#1b4332"}}>No orders found</h2>
      <p style={{fontSize:15,color:"#52b788",maxWidth:420,lineHeight:1.7}}>
        We searched your Gmail for {platformNames||"the selected platforms"} order confirmation emails but did not find any. Check that you have order emails in your inbox and try again.
      </p>
      <button onClick={onReset} style={{background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"12px 28px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Try again</button>
    </div>
  )

  return (
    <div style={{minHeight:"100vh",background:"#f8fdf9",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{background:"#1b4332",padding:"1.25rem 1.5rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><LeafLogo size={26}/><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"white"}}>PacketWatch</span></div>
        <button onClick={onReset} style={{background:"rgba(255,255,255,0.1)",color:"white",border:"1px solid rgba(255,255,255,0.2)",borderRadius:100,padding:"7px 16px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>New analysis</button>
      </div>

      <div style={{maxWidth:900,margin:"0 auto",padding:"1.5rem"}}>
        <div style={{background:"#1b4332",borderRadius:20,padding:"2rem",marginBottom:"1.25rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",right:-20,top:-20,width:180,height:180,borderRadius:"50%",background:"rgba(82,183,136,0.08)"}}/>
          <div style={{position:"relative",zIndex:1}}>
            <div style={{fontSize:11,fontWeight:700,color:"#74c69d",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{s.total_orders} orders analysed from {s.date_from} to {s.date_to}</div>
            <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:8,flexWrap:"wrap"}}>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(44px,8vw,60px)",fontWeight:700,color:"white",lineHeight:1}}>{s.total_kg}</span>
              <span style={{fontSize:20,color:"#95d5b2"}}>kg of plastic</span>
            </div>
            <div style={{fontSize:14,color:"#74c69d"}}>Average of {s.avg_grams_per_order}g per order. That is roughly {Math.round(s.total_kg*200)} plastic bottles worth of waste.</div>
            {s.food_orders > 0 && s.ecom_orders > 0 && (
              <div style={{marginTop:12,display:"flex",gap:16,flexWrap:"wrap"}}>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 14px"}}>
                  <span style={{fontSize:12,color:"#95d5b2"}}>Food orders: <strong style={{color:"white"}}>{s.food_orders}</strong></span>
                </div>
                <div style={{background:"rgba(255,255,255,0.08)",borderRadius:10,padding:"8px 14px"}}>
                  <span style={{fontSize:12,color:"#95d5b2"}}>Ecommerce orders: <strong style={{color:"white"}}>{s.ecom_orders}</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="kpi-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:"0.875rem",marginBottom:"1.25rem"}}>
          {[["Orders",s.total_orders,"","#52b788"],["Avg per order",s.avg_grams_per_order,"g","#40916c"],["Worst type",CATS[ins.worst_category]||"—","","#e23744"],["Could save",ins.potential_saving_g>0?`${Math.round(ins.potential_saving_g/1000*10)/10}`:0,"kg","#2d6a4f"]].map(([label,value,unit,accent])=>(
            <div key={label} style={{background:"white",borderRadius:14,padding:"1.1rem",border:"1px solid #e9f5ee",borderTop:`3px solid ${accent}`}}>
              <div style={{fontSize:10,color:"#95d5b2",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
              <div style={{display:"flex",alignItems:"baseline",gap:3}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#1b4332",lineHeight:1}}>{value}</span>
                {unit&&<span style={{fontSize:12,color:"#52b788"}}>{unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {perOrder.length>0&&(
          <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"1.25rem"}}>
            <AnimatedOrderList orders={perOrder}/>
          </div>
        )}

        {perOrderBar.length>0&&(
          <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:4}}>Plastic per order in grams</div>
            <div style={{fontSize:11,color:"#95d5b2",marginBottom:"1rem"}}>Each bar is one order</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={perOrderBar} margin={{top:16,right:8,left:-20,bottom:0}}>
                <XAxis dataKey="name" tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false}/>
                <YAxis tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false} unit="g"/>
                <Tooltip formatter={(v,n,p)=>[`${v}g`,p.payload.restaurant]} contentStyle={{fontSize:12,borderRadius:10,border:"1px solid #e9f5ee",background:"white"}}/>
                <Bar dataKey="grams" radius={[5,5,0,0]} fill="#52b788">
                  <LabelList dataKey="grams" position="top" formatter={v=>`${v}g`} style={{fontSize:9,fill:"#40916c"}}/>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="dashboard-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",marginBottom:"1.25rem"}}>
          {byType.length>0&&(
            <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee"}}>
              <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:4}}>By category</div>
              <div style={{fontSize:11,color:"#95d5b2",marginBottom:"1rem"}}>Total plastic in grams</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={byType.slice(0,6)} layout="vertical" margin={{top:0,right:40,left:80,bottom:0}}>
                  <XAxis type="number" tick={{fontSize:10,fill:"#95d5b2"}} tickLine={false} axisLine={false} unit="g"/>
                  <YAxis type="category" dataKey="name" tick={{fontSize:11,fill:"#2d6a4f"}} tickLine={false} axisLine={false} width={80}/>
                  <Tooltip formatter={v=>[`${Math.round(v)}g`,"Total"]} contentStyle={{fontSize:12,borderRadius:10,border:"1px solid #e9f5ee",background:"white"}}/>
                  <Bar dataKey="total_grams" radius={[0,6,6,0]}>
                    <LabelList dataKey="total_grams" position="right" formatter={v=>`${Math.round(v)}g`} style={{fontSize:10,fill:"#40916c"}}/>
                    {byType.slice(0,6).map((_,i)=><Cell key={i} fill={GREENS[i%GREENS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:4}}>Packaging breakdown</div>
            <div style={{fontSize:11,color:"#95d5b2",marginBottom:"1rem"}}>By component type</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={[
                  {name:"Containers",value:(comp.containers||0)*15},
                  {name:"Bags",value:((comp.outer_bags||0)+(comp.plastic_bags||0))*10},
                  {name:"Bubble wrap",value:(comp.bubble_wrap_sheets||0)*8},
                  {name:"Film/covers",value:((comp.plastic_covers||0)+(comp.plastic_film_wraps||0))*5},
                  {name:"Sachets",value:(comp.sauce_sachets||0)*2},
                  {name:"Cutlery",value:(comp.cutlery_pieces||0)*3},
                ].filter(d=>d.value>0)} cx="50%" cy="50%" outerRadius={70} innerRadius={28} dataKey="value"
                  label={({name,percent})=>percent>0.06?`${(percent*100).toFixed(0)}%`:""} labelLine={false} fontSize={10}>
                  {GREENS.map((c,i)=><Cell key={i} fill={c}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${Math.round(v)}g`]} contentStyle={{fontSize:12,borderRadius:10,border:"1px solid #e9f5ee"}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {topRests.length>0&&(
          <div style={{background:"white",borderRadius:18,padding:"1.5rem",border:"1px solid #e9f5ee",marginBottom:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"1rem"}}>Top plastic generating sources</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {topRests.map((r,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:i===0?"#f0faf4":"#f8fdf9",borderRadius:10,border:i===0?"1px solid #b7e4c7":"1px solid transparent"}}>
                  <div style={{width:26,height:26,borderRadius:"50%",background:i===0?"#2d6a4f":"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:i===0?"white":"#2d6a4f",flexShrink:0}}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:"#1b4332",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.restaurant}</div>
                    <div style={{fontSize:11,color:"#95d5b2"}}>{r.order_count} order{r.order_count!==1?"s":""}</div>
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:"#2d6a4f",background:"#f0faf4",padding:"3px 10px",borderRadius:100,flexShrink:0}}>{Math.round(r.total_grams)}g</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {[ins.worst_category&&{icon:"📦",accent:"#e23744",title:"Biggest offender",text:`${CATS[ins.worst_category]||ins.worst_category} orders average ${Math.round(ins.worst_category_avg_g)}g each, the highest of any category.`},
          ins.potential_saving_g>0&&{icon:"♻️",accent:"#2d6a4f",title:"Potential saving",text:`Reducing ${CATS[ins.worst_category]||ins.worst_category} orders could save around ${Math.round(ins.potential_saving_g/1000*10)/10}kg of plastic.`},
          ins.best_category&&{icon:"✅",accent:"#52b788",title:"Your greenest choice",text:`${CATS[ins.best_category]||ins.best_category} is your most sustainable option at just ${Math.round(ins.best_category_avg_g)}g per order.`},
        ].filter(Boolean).length>0&&(
          <div style={{marginBottom:"1.25rem"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:"0.875rem"}}>Where you can improve</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:10}}>
              {[ins.worst_category&&{icon:"📦",accent:"#e23744",title:"Biggest offender",text:`${CATS[ins.worst_category]||ins.worst_category} orders average ${Math.round(ins.worst_category_avg_g)}g each, the highest of any category.`},
                ins.potential_saving_g>0&&{icon:"♻️",accent:"#2d6a4f",title:"Potential saving",text:`Reducing ${CATS[ins.worst_category]||ins.worst_category} orders could save around ${Math.round(ins.potential_saving_g/1000*10)/10}kg of plastic.`},
                ins.best_category&&{icon:"✅",accent:"#52b788",title:"Your greenest choice",text:`${CATS[ins.best_category]||ins.best_category} is your most sustainable option at just ${Math.round(ins.best_category_avg_g)}g per order.`},
              ].filter(Boolean).map((card,i)=>(
                <div key={i} style={{background:"white",borderRadius:14,padding:"1.1rem 1.25rem",border:"1px solid #e9f5ee",display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:36,height:36,borderRadius:10,background:card.accent+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{card.icon}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:700,color:"#1b4332",marginBottom:3}}>{card.title}</div>
                    <div style={{fontSize:13,color:"#40916c",lineHeight:1.6}}>{card.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <FeedbackBox country={s.country} totalKg={s.total_kg}/>
        <div style={{borderTop:"1px solid #e9f5ee",paddingTop:"1.5rem",textAlign:"center"}}>
          <p style={{fontSize:12,color:"#95d5b2",margin:0}}>Open source. Built by Manu Paramesh and Roopa Narayanan.</p>
        </div>
      </div>
    </div>
  )
}

/* ── PRIVACY PAGE ─────────────────────────────────────────────────────────── */
function PrivacyPage({ onBack }) {
  useEffect(()=>{window.history.pushState({},"Privacy Policy - PacketWatch","/privacy")},[])
  const sections = [
    {title:"Overview",content:"PacketWatch is an open source tool that estimates the plastic waste generated by your food delivery and ecommerce orders. We access the minimum data necessary, process it in your session, and store nothing personal."},
    {title:"What we access",content:"When you connect your Gmail account, we request read-only OAuth 2.0 access to search your inbox for food delivery and ecommerce order confirmation emails. We do not access, read, or store any other emails. We never request write, send, delete, or modify permissions."},
    {title:"What we do with your email data",content:"Your email content is processed live in your session only. We extract the restaurant or platform name, order date, items ordered, and total amount. This data is used solely to estimate plastic packaging waste. We never store, share, sell, or transmit your email content or personal order data to any third party."},
    {title:"What we store",content:"We store only fully anonymised, aggregate statistics including your country, total plastic estimated in kg, and number of orders analysed. This contains no personally identifiable information and is used only to power the global impact map. We also store optional feedback you choose to submit."},
    {title:"What we never do",content:"We never store your Gmail credentials or OAuth tokens beyond your active session. We never read emails outside of order confirmations. We never sell, share, or monetise any user data. We never use your data for advertising or profiling. We never send you marketing emails."},
    {title:"Google API usage",content:"Our use of Google APIs complies with the Google API Services User Data Policy including the Limited Use requirements. We use Gmail read-only scope exclusively to identify order confirmation emails for plastic waste estimation as described at the time of authorisation."},
    {title:"Data retention",content:"Email content and personal order data is not retained at all and is processed in-session and discarded. Anonymised aggregate statistics are retained indefinitely to power the global map. User feedback is retained to improve our estimation model."},
    {title:"Your rights",content:"You may revoke PacketWatch's Gmail access at any time by visiting myaccount.google.com/permissions. For data deletion requests contact manuparameshi3@gmail.com."},
    {title:"Changes to this policy",content:"We may update this policy as the product evolves. Continued use of PacketWatch after changes constitutes acceptance of the updated policy."},
  ]
  return (
    <div style={{minHeight:"100vh",background:"#f8fdf9",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{background:"#1b4332",padding:"1.5rem",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:100,padding:"7px 16px",color:"white",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Back</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><LeafLogo size={26}/><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"white"}}>PacketWatch</span></div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"3rem 1.5rem"}}>
        <div style={{marginBottom:"2.5rem"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#40916c",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.75rem"}}>LEGAL</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:"#1b4332",margin:"0 0 0.75rem",letterSpacing:"-0.02em"}}>Privacy Policy</h1>
          <p style={{fontSize:14,color:"#52b788",margin:"0 0 0.5rem"}}>Last updated: April 2026</p>
          <p style={{fontSize:15,color:"#40916c",lineHeight:1.7,margin:0}}>We access the minimum data necessary, process it in your session, and store nothing personal. This document explains exactly how.</p>
        </div>
        <div style={{background:"#1b4332",borderRadius:16,padding:"1.25rem 1.75rem",marginBottom:"2.5rem",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:"1rem"}}>
          {[["🔒","Read-only","We can never modify or delete"],["🚫","No storage","Emails never touch our DB"],["👁","Open source","All code publicly available"],["✅","Google compliant","Follows Limited Use policy"]].map(([icon,title,desc])=>(
            <div key={title} style={{textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:5}}>{icon}</div>
              <div style={{fontSize:13,fontWeight:600,color:"white",marginBottom:3}}>{title}</div>
              <div style={{fontSize:11,color:"#74c69d",lineHeight:1.4}}>{desc}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1.75rem"}}>
          {sections.map((s,i)=>(
            <div key={i} style={{borderBottom:"1px solid #e9f5ee",paddingBottom:"1.75rem"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1b4332",margin:"0 0 0.65rem"}}>{i+1}. {s.title}</h2>
              <p style={{fontSize:15,color:"#40916c",lineHeight:1.8,margin:0}}>{s.content}</p>
            </div>
          ))}
        </div>
        <div style={{marginTop:"2.5rem",background:"#d8f3dc",borderRadius:14,padding:"1.25rem",textAlign:"center"}}>
          <div style={{fontSize:14,color:"#1b4332",fontWeight:600,marginBottom:5}}>This privacy policy is publicly available at packetwatch.space/privacy</div>
          <div style={{fontSize:13,color:"#2d6a4f",lineHeight:1.6}}>Required for Google OAuth verification. PacketWatch complies with Google API Services User Data Policy and the Limited Use requirements.</div>
        </div>
        <button onClick={onBack} style={{display:"block",margin:"2rem auto 0",background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"12px 30px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Back to PacketWatch</button>
      </div>
    </div>
  )
}

/* ── TERMS PAGE ───────────────────────────────────────────────────────────── */
function TermsPage({ onBack }) {
  useEffect(()=>{window.history.pushState({},"Terms of Service - PacketWatch","/terms")},[])
  const sections = [
    {title:"Acceptance of terms",content:"By using PacketWatch you agree to these Terms of Service. PacketWatch is provided free of charge as an open source tool for personal use."},
    {title:"Description of service",content:"PacketWatch is a free open source tool that estimates the plastic waste generated by your food delivery and ecommerce orders by connecting to your Gmail account in read-only mode."},
    {title:"Use of Google account data",content:"You authorise PacketWatch to access your Gmail account in read-only mode solely to identify order confirmation emails. This authorisation can be revoked at any time via myaccount.google.com/permissions. We comply fully with Google API Services User Data Policy."},
    {title:"Acceptable use",content:"You agree to use PacketWatch only for its intended purpose of estimating personal plastic waste from online orders. You must not attempt to reverse engineer, scrape, or misuse the Service."},
    {title:"No warranties",content:"PacketWatch is provided as is without warranties of any kind. Plastic estimates are approximations based on industry averages and may not reflect actual packaging used by specific restaurants or retailers."},
    {title:"Limitation of liability",content:"To the fullest extent permitted by law, PacketWatch and its creators shall not be liable for any indirect, incidental, or consequential damages. The Service is provided free of charge."},
    {title:"Open source",content:"PacketWatch is open source software licensed under the MIT License. The source code is available at github.com/manuparamesh."},
    {title:"Contact",content:"For questions about these Terms contact manuparameshi3@gmail.com. PacketWatch is maintained by Manu Paramesh and Roopa Narayanan."},
  ]
  return (
    <div style={{minHeight:"100vh",background:"#f8fdf9",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <div style={{background:"#1b4332",padding:"1.5rem",display:"flex",alignItems:"center",gap:14}}>
        <button onClick={onBack} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",borderRadius:100,padding:"7px 16px",color:"white",fontSize:13,fontWeight:500,cursor:"pointer",fontFamily:"inherit"}}>Back</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><LeafLogo size={26}/><span style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"white"}}>PacketWatch</span></div>
      </div>
      <div style={{maxWidth:720,margin:"0 auto",padding:"3rem 1.5rem"}}>
        <div style={{marginBottom:"2.5rem"}}>
          <div style={{fontSize:11,fontWeight:700,color:"#40916c",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"0.75rem"}}>LEGAL</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:"clamp(28px,5vw,44px)",fontWeight:700,color:"#1b4332",margin:"0 0 0.75rem",letterSpacing:"-0.02em"}}>Terms of Service</h1>
          <p style={{fontSize:14,color:"#52b788",margin:"0 0 0.5rem"}}>Last updated: April 2026</p>
          <p style={{fontSize:15,color:"#40916c",lineHeight:1.7,margin:0}}>PacketWatch is a free open source tool. These terms are intentionally simple.</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"1.75rem"}}>
          {sections.map((s,i)=>(
            <div key={i} style={{borderBottom:"1px solid #e9f5ee",paddingBottom:"1.75rem"}}>
              <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:20,fontWeight:700,color:"#1b4332",margin:"0 0 0.65rem"}}>{i+1}. {s.title}</h2>
              <p style={{fontSize:15,color:"#40916c",lineHeight:1.8,margin:0}}>{s.content}</p>
            </div>
          ))}
        </div>
        <button onClick={onBack} style={{display:"block",margin:"2rem auto 0",background:"#1b4332",color:"white",border:"none",borderRadius:100,padding:"12px 30px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Back to PacketWatch</button>
      </div>
    </div>
  )
}

/* ── ROOT APP ─────────────────────────────────────────────────────────────── */
export default function App() {
  const getInitialScreen = () => {
    const path = window.location.pathname
    if(path==="/privacy") return "privacy"
    if(path==="/terms") return "terms"
    return "landing"
  }
  const [screen, setScreen] = useState(getInitialScreen)
  const [showModal, setShowModal] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState("")
  const [result, setResult] = useState(null)
  const [globalStats, setGlobalStats] = useState({total_users:0,total_kg:0,total_orders:0,by_country:[]})
  const pollRef = useRef(null)

  useEffect(()=>{
    const load=()=>fetch(`${API}/global-stats`).then(r=>r.json()).then(setGlobalStats).catch(()=>{})
    load()
    const t=setInterval(load,30000)
    return()=>clearInterval(t)
  },[])

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    const code=params.get("code"),state=params.get("state")
    if(code&&state){
      const apps=JSON.parse(sessionStorage.getItem("pw_apps")||'["zomato"]')
      const country=sessionStorage.getItem("pw_country")||"IN"
      window.history.replaceState({},"","/")
      startJob(code,state,apps,country)
    }
  },[])

  useEffect(()=>{
    if(!jobId) return
    pollRef.current=setInterval(async()=>{
      try{
        const res=await fetch(`${API}/job/${jobId}`)
        const data=await res.json()
        setProgress(data.progress||0)
        setMessage(data.message||"")
        if(data.status==="done"){clearInterval(pollRef.current);setResult(data.result);setScreen("dashboard")}
        if(data.status==="error"){clearInterval(pollRef.current);alert("Error: "+data.message);setScreen("landing")}
      }catch(e){console.error(e)}
    },2000)
    return()=>clearInterval(pollRef.current)
  },[jobId])

  const handleConnect=async()=>{
    try{
      const res=await fetch(`${API}/auth/url?redirect_uri=${encodeURIComponent(window.location.origin+"/")}`)
      const{auth_url}=await res.json()
      window.location.href=auth_url
    }catch(e){alert("Could not connect to API.")}
  }

  const startJob=async(code,state,apps,country)=>{
    setShowModal(false);setScreen("loading")
    try{
      const res=await fetch(`${API}/auth/callback`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({code,state,apps,country,max_orders:10,redirect_uri:window.location.origin+"/"})
      })
      const{job_id}=await res.json()
      setJobId(job_id)
    }catch(e){alert("Error: "+e.message);setScreen("landing")}
  }

  const handleAppStart=(apps,country)=>{
    sessionStorage.setItem("pw_apps",JSON.stringify(apps))
    sessionStorage.setItem("pw_country",country)
    handleConnect()
  }

  if(screen==="loading") return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Loading progress={progress} message={message}/>
    </>
  )

  if(screen==="dashboard"&&result) return(
    <Dashboard data={result} onReset={()=>{setScreen("landing");setResult(null);setJobId(null)}}
      selectedApps={JSON.parse(sessionStorage.getItem("pw_apps")||'[]')}/>
  )

  if(screen==="privacy") return <PrivacyPage onBack={()=>setScreen("landing")}/>
  if(screen==="terms") return <TermsPage onBack={()=>setScreen("landing")}/>

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif"}}>
      <GlobalStyle/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
      <Navbar onConnect={()=>setShowModal(true)} onPrivacy={()=>setScreen("privacy")} onTerms={()=>setScreen("terms")}/>
      <Hero onConnect={()=>setShowModal(true)} globalStats={globalStats}/>
      <PhotoSection/>
      <HowItWorks onConnect={()=>setShowModal(true)}/>
      <GlobalSection globalStats={globalStats}/>
      <AboutSection/>
      <footer style={{background:"#1b4332",padding:"2rem 1.5rem",textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:10}}>
          <LeafLogo size={22}/>
          <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:"white"}}>PacketWatch</span>
        </div>
        <div style={{display:"flex",gap:"1.5rem",justifyContent:"center",marginBottom:10,flexWrap:"wrap"}}>
          <a href="#about" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}}>About</a>
          <a href="#how" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}}>How it works</a>
          <a href="/privacy" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}} onClick={e=>{e.preventDefault();setScreen("privacy")}}>Privacy Policy</a>
          <a href="/terms" style={{fontSize:13,color:"#74c69d",textDecoration:"none"}} onClick={e=>{e.preventDefault();setScreen("terms")}}>Terms of Service</a>
        </div>
        <p style={{fontSize:12,color:"#52b788",margin:0}}>Built by Manu Paramesh and Roopa Narayanan. Making online shopping plastic visible.</p>
      </footer>
      {showModal&&<ConnectModal onClose={()=>setShowModal(false)} onStart={handleAppStart}/>}
    </div>
  )
}
