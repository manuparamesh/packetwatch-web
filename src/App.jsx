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

function LeafIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
    </svg>
  )
}

function Stat({ label, value, unit }) {
  return (
    <div style={{background:"var(--color-background-secondary)",borderRadius:10,padding:"1rem 1.25rem",flex:1,minWidth:0}}>
      <div style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.05em"}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:4}}>
        <span style={{fontSize:28,fontWeight:500,color:"var(--color-text-primary)",fontFamily:"'DM Serif Display',serif"}}>{value}</span>
        {unit && <span style={{fontSize:13,color:"var(--color-text-secondary)"}}>{unit}</span>}
      </div>
    </div>
  )
}

function InsightCard({ icon, text, accent }) {
  return (
    <div style={{display:"flex",gap:12,alignItems:"flex-start",padding:"0.85rem 1rem",background:"var(--color-background-secondary)",borderRadius:10,borderLeft:`3px solid ${accent}`}}>
      <span style={{fontSize:18,lineHeight:1.4}}>{icon}</span>
      <span style={{fontSize:14,color:"var(--color-text-primary)",lineHeight:1.6}}>{text}</span>
    </div>
  )
}

function Landing({ onConnect }) {
  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"3rem 1.5rem",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"2.5rem"}}>
        <LeafIcon/>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"var(--color-text-primary)"}}>PacketWatch</span>
      </div>

      <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:38,fontWeight:400,lineHeight:1.2,color:"var(--color-text-primary)",margin:"0 0 1rem"}}>
        How much plastic does your food delivery habit generate?
      </h1>
      <p style={{fontSize:16,color:"var(--color-text-secondary)",lineHeight:1.7,margin:"0 0 2.5rem"}}>
        Connect your Gmail and PacketWatch will analyse your Zomato and Swiggy order history — estimating the real plastic footprint of every delivery, every container, every sachet.
      </p>

      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:"2.5rem"}}>
        {[["Your data stays yours","Gmail access is read-only. We never store your emails."],
          ["AI-powered estimation","GPT analyses each dish and applies Indian food packaging rules."],
          ["Actionable insights","See which restaurants and cuisines drive your plastic use."]
        ].map(([title, desc]) => (
          <div key={title} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,borderRadius:"50%",background:"#d8f3dc",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#2d6a4f" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",marginBottom:2}}>{title}</div>
              <div style={{fontSize:13,color:"var(--color-text-secondary)",lineHeight:1.5}}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onConnect} style={{width:"100%",padding:"13px 0",background:"#2d6a4f",color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",letterSpacing:"0.01em"}}>
        Connect Gmail &amp; analyse my orders
      </button>
      <p style={{fontSize:12,color:"var(--color-text-tertiary)",textAlign:"center",marginTop:12}}>
        Currently supports Zomato order confirmation emails
      </p>
    </div>
  )
}

function AppSelector({ onStart }) {
  const [apps, setApps] = useState(["zomato"])
  const toggle = (a) => setApps(p => p.includes(a) ? p.filter(x=>x!==a) : [...p,a])
  const opts = [
    {id:"zomato",label:"Zomato",color:"#e23744"},
    {id:"swiggy",label:"Swiggy",color:"#fc8019",note:"coming soon"},
    {id:"uber_eats",label:"Uber Eats",color:"#06C167",note:"coming soon"},
  ]
  return (
    <div style={{maxWidth:560,margin:"0 auto",padding:"3rem 1.5rem",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"2rem"}}>
        <LeafIcon/>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:22,color:"var(--color-text-primary)"}}>PacketWatch</span>
      </div>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:26,fontWeight:400,margin:"0 0 0.5rem"}}>Which apps do you order from?</h2>
      <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:"0 0 1.5rem"}}>We'll search your Gmail for order confirmation emails from these platforms.</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"2rem"}}>
        {opts.map(o => (
          <div key={o.id} onClick={()=>!o.note&&toggle(o.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:10,border:`1.5px solid ${apps.includes(o.id)?"#2d6a4f":"var(--color-border-tertiary)"}`,background:apps.includes(o.id)?"#f0faf4":"var(--color-background-primary)",cursor:o.note?"default":"pointer",opacity:o.note?0.5:1}}>
            <div style={{width:18,height:18,borderRadius:4,border:`1.5px solid ${apps.includes(o.id)?"#2d6a4f":"var(--color-border-secondary)"}`,background:apps.includes(o.id)?"#2d6a4f":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              {apps.includes(o.id)&&<svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <span style={{fontSize:15,fontWeight:500,color:o.color}}>{o.label}</span>
            {o.note&&<span style={{fontSize:11,color:"var(--color-text-tertiary)",marginLeft:"auto"}}>{o.note}</span>}
          </div>
        ))}
      </div>
      <button onClick={()=>onStart(apps)} disabled={!apps.length} style={{width:"100%",padding:"13px 0",background:apps.length?"#2d6a4f":"var(--color-background-secondary)",color:apps.length?"#fff":"var(--color-text-tertiary)",border:"none",borderRadius:10,fontSize:15,fontWeight:500,cursor:apps.length?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>
        Analyse my orders
      </button>
    </div>
  )
}

function Loading({ progress, message }) {
  return (
    <div style={{maxWidth:400,margin:"0 auto",padding:"5rem 1.5rem",textAlign:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&display=swap" rel="stylesheet"/>
      <LeafIcon/>
      <h2 style={{fontFamily:"'DM Serif Display',serif",fontSize:24,fontWeight:400,margin:"1.5rem 0 0.5rem"}}>Analysing your orders</h2>
      <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:"0 0 2rem"}}>{message || "This takes about a minute..."}</p>
      <div style={{height:4,background:"var(--color-background-secondary)",borderRadius:4,overflow:"hidden",marginBottom:12}}>
        <div style={{height:"100%",width:`${progress}%`,background:"#2d6a4f",borderRadius:4,transition:"width 0.5s ease"}}/>
      </div>
      <div style={{fontSize:13,color:"var(--color-text-tertiary)"}}>{progress}%</div>
    </div>
  )
}

function Dashboard({ data }) {
  const s = data.summary
  const monthly = data.monthly_trend || []
  const byType = (data.by_restaurant_type || []).map(r=>({...r,name:CATS[r.restaurant_type]||r.restaurant_type}))
  const topRests = data.top_restaurants || []
  const ins = data.insights || {}

  return (
    <div style={{maxWidth:720,margin:"0 auto",padding:"2rem 1.5rem",fontFamily:"'DM Sans',sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=DM+Serif+Display&display=swap" rel="stylesheet"/>

      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"1.5rem"}}>
        <LeafIcon/>
        <span style={{fontFamily:"'DM Serif Display',serif",fontSize:20,color:"var(--color-text-primary)"}}>PacketWatch</span>
        <span style={{marginLeft:"auto",fontSize:13,color:"var(--color-text-tertiary)"}}>{s.date_from} → {s.date_to}</span>
      </div>

      <h1 style={{fontFamily:"'DM Serif Display',serif",fontSize:32,fontWeight:400,margin:"0 0 0.25rem",color:"var(--color-text-primary)"}}>
        Your plastic footprint
      </h1>
      <p style={{fontSize:14,color:"var(--color-text-secondary)",margin:"0 0 1.5rem"}}>Based on {s.total_orders} orders from Zomato</p>

      <div style={{display:"flex",gap:10,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        <Stat label="Total plastic" value={s.total_kg} unit="kg"/>
        <Stat label="Total orders" value={s.total_orders}/>
        <Stat label="Avg per order" value={`${s.avg_grams_per_order}g`}/>
      </div>

      <h3 style={{fontSize:14,fontWeight:500,margin:"1.5rem 0 0.75rem",color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Monthly trend</h3>
      <div style={{height:180,marginBottom:"1.5rem"}}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthly} margin={{top:4,right:4,left:-20,bottom:0}}>
            <XAxis dataKey="month" tick={{fontSize:11,fill:"var(--color-text-tertiary)"}} tickLine={false} axisLine={false}/>
            <YAxis tick={{fontSize:11,fill:"var(--color-text-tertiary)"}} tickLine={false} axisLine={false}/>
            <Tooltip formatter={v=>[`${Math.round(v)}g`,"Plastic"]} contentStyle={{fontSize:12,borderRadius:8,border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)"}} labelStyle={{color:"var(--color-text-secondary)"}}/>
            <Line type="monotone" dataKey="plastic_grams" stroke="#2d6a4f" strokeWidth={2} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{fontSize:14,fontWeight:500,margin:"1.5rem 0 0.75rem",color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Plastic by cuisine type</h3>
      <div style={{height:220,marginBottom:"1.5rem"}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={byType.slice(0,8)} layout="vertical" margin={{top:0,right:8,left:100,bottom:0}}>
            <XAxis type="number" tick={{fontSize:11,fill:"var(--color-text-tertiary)"}} tickLine={false} axisLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:12,fill:"var(--color-text-primary)"}} tickLine={false} axisLine={false} width={100}/>
            <Tooltip formatter={v=>[`${Math.round(v)}g`,"Total plastic"]} contentStyle={{fontSize:12,borderRadius:8,border:"0.5px solid var(--color-border-tertiary)",background:"var(--color-background-primary)"}}/>
            <Bar dataKey="total_grams" radius={[0,4,4,0]}>
              {byType.slice(0,8).map((_, i) => <Cell key={i} fill={GREENS[i % GREENS.length]}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{fontSize:14,fontWeight:500,margin:"1.5rem 0 0.75rem",color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Top offending restaurants</h3>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:"1.5rem"}}>
        {topRests.map((r,i) => (
          <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"var(--color-background-secondary)",borderRadius:8}}>
            <span style={{fontSize:12,fontWeight:500,color:"var(--color-text-tertiary)",minWidth:18}}>{i+1}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:500,color:"var(--color-text-primary)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.restaurant}</div>
              <div style={{fontSize:11,color:"var(--color-text-tertiary)"}}>{CATS[r.restaurant_type]||r.restaurant_type} · {r.order_count} orders</div>
            </div>
            <span style={{fontSize:13,fontWeight:500,color:"#2d6a4f",flexShrink:0}}>{Math.round(r.total_grams)}g</span>
          </div>
        ))}
      </div>

      <h3 style={{fontSize:14,fontWeight:500,margin:"1.5rem 0 0.75rem",color:"var(--color-text-secondary)",textTransform:"uppercase",letterSpacing:"0.05em"}}>Where you can improve</h3>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:"2rem"}}>
        {ins.worst_category && <InsightCard icon="📦" accent="#e23744" text={`Your ${CATS[ins.worst_category]||ins.worst_category} orders average ${Math.round(ins.worst_category_avg_g)}g of plastic each — the highest of any category.`}/>}
        {ins.potential_saving_g > 0 && <InsightCard icon="♻" accent="#2d6a4f" text={`Switching ${CATS[ins.worst_category]||ins.worst_category} orders to lower-plastic alternatives could save ~${Math.round(ins.potential_saving_g/1000*10)/10}kg of plastic.`}/>}
        {ins.best_category && <InsightCard icon="✓" accent="#52b788" text={`${CATS[ins.best_category]||ins.best_category} orders are your cleanest at just ${Math.round(ins.best_category_avg_g)}g avg — order more of these!`}/>}
      </div>

      <div style={{borderTop:"0.5px solid var(--color-border-tertiary)",paddingTop:"1.5rem",display:"flex",gap:16,justifyContent:"center"}}>
        <a href={`${API}/docs`} target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--color-text-secondary)"}}>API docs</a>
        <a href="https://github.com/yourusername/packetwatch" target="_blank" rel="noreferrer" style={{fontSize:13,color:"var(--color-text-secondary)"}}>GitHub</a>
      </div>
    </div>
  )
}

export default function App() {
  const [screen, setScreen] = useState("landing")
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
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [jobId])

  const handleConnect = async () => {
    const res = await fetch(`${API}/auth/url?redirect_uri=${encodeURIComponent(window.location.origin + "/")}`)
    const { auth_url, state } = await res.json()
    sessionStorage.setItem("pw_state", state)
    window.location.href = auth_url
  }

  const startJob = async (code, state, apps) => {
    setScreen("loading")
    const res = await fetch(`${API}/auth/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, state, apps, redirect_uri: window.location.origin + "/" })
    })
    const { job_id } = await res.json()
    setJobId(job_id)
  }

  const handleAppStart = (apps) => {
    sessionStorage.setItem("pw_apps", JSON.stringify(apps))
    handleConnect()
  }

  if (screen === "landing") return <Landing onConnect={() => setScreen("apps")}/>
  if (screen === "apps") return <AppSelector onStart={handleAppStart}/>
  if (screen === "loading") return <Loading progress={progress} message={message}/>
  if (screen === "dashboard" && result) return <Dashboard data={result}/>
  return <Loading progress={0} message="Starting up..."/>
}
