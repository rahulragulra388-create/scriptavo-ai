import { useState, useRef, useEffect, useCallback } from "react";

// ─── BRAND ────────────────────────────────────────────────────────────────────
const C = {
  bg:"#07070f", surface:"#0d0d1a", card:"#111120",
  border:"#1c1c30", accent:"#e8b84b", text:"#e0e0f0",
  muted:"#52527a", green:"#4ec994", red:"#e85070",
  orange:"#e88040", blue:"#5090f0", purple:"#9060f0",
};

// ─── 15 BEATS with page targets ───────────────────────────────────────────────
const BEATS = [
  {id:1,  name:"Opening Image",      page:1,   range:[1,2],    color:"#5090f0", tip:"Hook the audience in the first 60 seconds."},
  {id:2,  name:"Theme Stated",       page:5,   range:[4,6],    color:"#9060f0", tip:"Someone (not hero) hints at the theme."},
  {id:3,  name:"Set-Up",             page:5,   range:[1,10],   color:"#5090f0", tip:"Introduce hero's world, flaw, and what's missing."},
  {id:4,  name:"Catalyst",           page:12,  range:[10,14],  color:"#e88040", tip:"The inciting incident. Hero's life changes forever."},
  {id:5,  name:"Debate",             page:18,  range:[14,25],  color:"#e88040", tip:"Should the hero accept the challenge?"},
  {id:6,  name:"Break into Two",     page:25,  range:[24,26],  color:"#e85070", tip:"Hero leaves old world. No going back."},
  {id:7,  name:"B Story",            page:30,  range:[28,32],  color:"#4ec994", tip:"The love story or relationship that teaches the theme."},
  {id:8,  name:"Fun and Games",      page:45,  range:[30,55],  color:"#4ec994", tip:"The 'promise of the premise'. Deliver what the poster promised."},
  {id:9,  name:"Midpoint",           page:55,  range:[53,57],  color:"#e8b84b", tip:"False victory or false defeat. Stakes double."},
  {id:10, name:"Bad Guys Close In",  page:65,  range:[55,75],  color:"#e85070", tip:"External and internal pressure mounts. Team breaks down."},
  {id:11, name:"All Is Lost",        page:75,  range:[73,77],  color:"#e85070", tip:"The opposite of the Midpoint. Worst moment."},
  {id:12, name:"Dark Night of Soul", page:80,  range:[75,85],  color:"#9060f0", tip:"Hero reflects on what went wrong. The whiff of death."},
  {id:13, name:"Break into Three",   page:85,  range:[83,87],  color:"#e88040", tip:"A-story and B-story combine. Hero finds the solution."},
  {id:14, name:"Finale",             page:95,  range:[85,110], color:"#4ec994", tip:"Dig down, execute the new plan, and win."},
  {id:15, name:"Final Image",        page:110, range:[108,110],color:"#5090f0", tip:"Mirror of Opening Image — shows how much has changed."},
];

// ─── 22 STRUCTURES ────────────────────────────────────────────────────────────
const STRUCTURES = ["Three-Act Structure","Hero's Journey","Dan Harmon Story Circle","Five-Act Structure","Seven-Point Story Structure","Eight-Sequence Structure","Kishōtenketsu","Freytag's Pyramid","Fichtean Curve","In Medias Res","Nonlinear Structure","Parallel Narrative","Anthology Structure","Circular Narrative","Episodic Structure","Frame Narrative","Rashomon Structure","Reverse Chronology","Tragedy Structure","Survival Structure","Coming-of-Age Structure","Real-Time Structure"];

// ─── ALL 47 TOOLS ─────────────────────────────────────────────────────────────
const TOOLS = [
  {id:"logline",   icon:"💡",label:"Logline Generator",     cat:"Structure"},
  {id:"premise",   icon:"❓",label:"Premise Builder",       cat:"Structure"},
  {id:"treatment", icon:"📄",label:"Treatment Writer",      cat:"Structure"},
  {id:"theme",     icon:"🎭",label:"Theme Analyzer",        cat:"Structure"},
  {id:"dram_q",    icon:"🎯",label:"Dramatic Question",     cat:"Structure"},
  {id:"beatsheet", icon:"📊",label:"Beat Sheet (15 Beats)", cat:"Structure"},
  {id:"structure", icon:"🏗️",label:"Story Structure",       cat:"Structure"},
  {id:"scene_hd",  icon:"🎬",label:"Scene Heading",         cat:"Formatting"},
  {id:"action",    icon:"✍️",label:"Action Lines",          cat:"Formatting"},
  {id:"dialogue",  icon:"💬",label:"Dialogue Coach",        cat:"Formatting"},
  {id:"transition",icon:"⚡",label:"Transitions",           cat:"Formatting"},
  {id:"subtext",   icon:"🔮",label:"Subtext Detector",      cat:"Dialogue"},
  {id:"on_nose",   icon:"🚫",label:"On-the-Nose Fixer",     cat:"Dialogue"},
  {id:"exposition",icon:"⚠️",label:"Exposition Fixer",      cat:"Dialogue"},
  {id:"speech",    icon:"🗣️",label:"Speech Rhythms",        cat:"Dialogue"},
  {id:"want_need", icon:"💔",label:"Want vs Need",          cat:"Character"},
  {id:"ghost",     icon:"👻",label:"The Ghost (Wound)",     cat:"Character"},
  {id:"char_lie",  icon:"🎭",label:"Character Lie",         cat:"Character"},
  {id:"char_arc",  icon:"📈",label:"Character Arc",         cat:"Character"},
  {id:"antagonist",icon:"⚔️",label:"Antagonist Builder",    cat:"Character"},
  {id:"visual_hk", icon:"👁️",label:"Visual Hook",          cat:"Scene"},
  {id:"plant_pay", icon:"🌱",label:"Plant & Payoff",        cat:"Scene"},
  {id:"micro_arc", icon:"🔄",label:"Micro-Arc",             cat:"Scene"},
  {id:"incisive",  icon:"✂️",label:"Incisive Moment",       cat:"Scene"},
  {id:"intercut",  icon:"🔀",label:"Intercutting",          cat:"Scene"},
  {id:"dram_irony",icon:"😶",label:"Dramatic Irony",        cat:"Scene"},
  {id:"macguffin", icon:"💼",label:"MacGuffin",             cat:"Scene"},
  {id:"cold_open", icon:"❄️",label:"Cold Open Builder",     cat:"Scene"},
  {id:"breakdown", icon:"📋",label:"Script Breakdown Sheet",cat:"Production"},
  {id:"eighths",   icon:"📏",label:"1/8th Page Rule",       cat:"Production"},
  {id:"dood",      icon:"📅",label:"Day Out of Days",       cat:"Production"},
  {id:"stripboard",icon:"🗂️",label:"Stripboard/Schedule",  cat:"Production"},
  {id:"lining",    icon:"📝",label:"Script Lining",         cat:"Production"},
  {id:"shot_div",  icon:"🎥",label:"Shot Division",         cat:"Cinematography"},
  {id:"rule180",   icon:"📐",label:"180-Degree Rule",       cat:"Cinematography"},
  {id:"floor_plan",icon:"🗺️",label:"Floor Plans/Blocking", cat:"Cinematography"},
  {id:"cam_move",  icon:"🎞️",label:"Camera Movement",      cat:"Cinematography"},
  {id:"aspect",    icon:"📺",label:"Aspect Ratio Strategy", cat:"Cinematography"},
  {id:"storyboard",icon:"🖼️",label:"Storyboard",           cat:"Visual"},
  {id:"keyframes", icon:"🔑",label:"Keyframes",             cat:"Visual"},
  {id:"comp_frame",icon:"⬛",label:"Compositional Framing", cat:"Visual"},
  {id:"pitch_deck",icon:"📊",label:"Pitch Deck (Lookbook)", cat:"Business"},
  {id:"grammar",   icon:"✅",label:"Grammar & Continuity",  cat:"Polish"},
  {id:"wr_block",  icon:"💡",label:"Writer's Block Solver", cat:"Coach"},
  {id:"time_mgr",  icon:"⏱️",label:"Time Manager",         cat:"Coach"},
  {id:"char_psych",icon:"🧠",label:"Character Psychology",  cat:"Character"},
  {id:"general",   icon:"🤖",label:"General Assistant",     cat:"Coach"},
];

// ─── AI SYSTEM PROMPTS ────────────────────────────────────────────────────────
const SYS = {
  default:`You are Scriptavo.AI — a professional AI screenwriting assistant like JARVIS from Iron Man. You help writers from A to Z: loglines, premises, treatments, structure, formatting, dialogue, character psychology, visual storytelling, pre-production, storyboards, shot division, pitch decks. Be specific, cinematic, and professional. Always give concrete examples.`,
  logline:`You are Scriptavo.AI's Logline Generator. Create 3-5 compelling loglines in the format: "[PROTAGONIST with flaw] must [GOAL] before/when [STAKES]." Rate each 1-10 and explain why. Make them irresistible to producers.`,
  premise:`You are Scriptavo.AI's Premise Builder. Craft the foundational "What if?" question. Give 3 premise variations, explain the narrative world each creates, and show how the premise drives every story decision.`,
  treatment:`You are Scriptavo.AI's Treatment Writer. Write a present-tense narrative prose summary (5-20 pages equivalent). Format: TITLE | LOGLINE | MAIN CHARACTERS | ACT 1 | ACT 2 | ACT 3.`,
  theme:`You are Scriptavo.AI's Theme Analyzer. Find the deeper emotional/moral argument (e.g. "Greed destroys family"). Give 3 thematic statement options and show how each should manifest in scenes, character choices, and the arc.`,
  beatsheet:`You are Scriptavo.AI's Beat Sheet expert (Save the Cat 15 beats). Map all 15 beats with page numbers. Analyze the script and identify which beats are present (✅), which are missing (⬜), and what exactly should happen at each beat.`,
  structure:`You are Scriptavo.AI's Story Structure expert for all 22 structures. Analyze, recommend the best structure, map it out beat-by-beat, and correct structural mistakes.`,
  dialogue:`You are Scriptavo.AI's Dialogue Coach. Detect: 🔴 On-the-Nose, 🟡 Exposition Dump, 🟢 Strong Subtext. Always show BEFORE/AFTER rewrites. Rate subtext 1-10.`,
  subtext:`You are Scriptavo.AI's Subtext Detector. Mark: 🔴 ON-THE-NOSE (say exactly what they mean), 🟡 EXPOSITION DUMP, 🟢 STRONG SUBTEXT. For each 🔴 provide a rewrite.`,
  on_nose:`You are Scriptavo.AI's On-the-Nose Dialogue Fixer. Format: ❌ ORIGINAL → ✅ REWRITE → 💭 HIDDEN MEANING. Characters rarely say what they mean.`,
  want_need:`You are Scriptavo.AI's Want vs Need analyst. WANT = external goal they chase. NEED = internal lesson they must learn. Map how the story challenges the Want to reveal the Need.`,
  ghost:`You are Scriptavo.AI's Character Ghost (Wound) expert. Define the painful past that shapes current behavior. Show how it manifests subtly in dialogue and decisions.`,
  char_arc:`You are Scriptavo.AI's Character Arc expert. Map: Starting Lie → Ghost → Misbelief → Challenges → Moment of Truth → Transformation. Show which scenes trigger each phase.`,
  antagonist:`You are Scriptavo.AI's Antagonist expert. A great antagonist is the physical manifestation of the protagonist's deepest fears. Design their goal, method, justification, and mirror relationship to the hero.`,
  storyboard:`You are Scriptavo.AI's Storyboard generator. Format: SHOT #: [SIZE] [ANGLE] — [Description] | MOVE: [movement] | ⭐ KEYFRAME. Suggest aspect ratio. Give multiple tone options.`,
  shot_div:`You are Scriptavo.AI's Shot Division expert. For each shot: TYPE (ECU/CU/MCU/MS/MLS/LS/ELS), ANGLE (Eye Level/High/Low/Dutch/Bird's Eye), MOVEMENT, 180° STATUS.`,
  floor_plan:`You are Scriptavo.AI's Floor Plan creator. Create ASCII overhead diagrams showing character positions (A,B,C), camera positions (CAM1,CAM2), 180° axis line, movement arrows.`,
  cam_move:`You are Scriptavo.AI's Camera Movement expert. Every move must be triggered by emotional/psychological shift. Format: MOVE → TRIGGER → EFFECT ON AUDIENCE.`,
  pitch_deck:`You are Scriptavo.AI's Pitch Deck creator. Generate: 1.Cover 2.Logline 3.Genre/Tone 4.Premise 5.Characters 6.Theme 7.Comps 8.Target Audience 9.Why Now 10.Visual Style 11.Director's Vision.`,
  breakdown:`You are Scriptavo.AI's Script Breakdown Sheet generator. For any scene produce: SCENE # · INT/EXT · LOCATION · TIME · CAST · PROPS · COSTUMES · SFX · VFX · VEHICLES · SOUND · NOTES.`,
  grammar:`You are Scriptavo.AI's Grammar and Continuity Checker. Check: 🔴 Spelling errors, 🔴 Grammar mistakes, 🟡 Continuity errors, 🟡 Formatting violations, 🟢 Improvement suggestions.`,
  wr_block:`You are Scriptavo.AI's Writer's Block Solver — like JARVIS detecting creative paralysis. Give: 5 "What if..." alternatives linked to THEIR existing story, 3 scene entry/exit options, 2 character decision alternatives, 1 wild-card twist.`,
  time_mgr:`You are Scriptavo.AI's Time Manager. Calculate a personalized schedule: total pages target, daily goals, milestone deadlines. Help complete the script within the deadline.`,
  char_psych:`You are Scriptavo.AI's Character Psychology expert. Analyze characters using: Maslow's hierarchy, attachment theory, trauma response patterns, defense mechanisms. Show how psychology drives behavior in every scene.`,
};

// ─── REAL-TIME BEAT DETECTOR ──────────────────────────────────────────────────
function detectCurrentBeat(scriptLength) {
  const pages = scriptLength / 1500;
  if (pages <= 0.5) return 1;
  for (let i = BEATS.length - 1; i >= 0; i--) {
    if (pages >= BEATS[i].range[0]) return BEATS[i].id;
  }
  return 1;
}

function getNextBeat(currentPage) {
  for (const beat of BEATS) {
    if (currentPage < beat.range[0]) return beat;
  }
  return BEATS[14];
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function ScriptavoAI() {
  const [view, setView]               = useState("welcome");
  const [user, setUser]               = useState(()=>{ try { const u=localStorage.getItem('scriptavo_user'); return u?JSON.parse(u):null; } catch { return null; } });
  const [nameInput, setNameInput]     = useState("");
  const [emailInput, setEmailInput]   = useState("");
  const [loginError, setLoginError]   = useState("");
  const [isPremium, setIsPremium]     = useState(()=>{ try { const u=localStorage.getItem('scriptavo_user'); return u?JSON.parse(u).premium||false:false; } catch { return false; } });
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeTool, setActiveTool]   = useState("general");
  const [toolCat, setToolCat]         = useState("All");
  const [messages, setMessages]       = useState([]);
  const [userInput, setUserInput]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [scriptContent, setScriptRaw] = useState("");
  const [currentBeat, setCurrentBeat] = useState(1);
  const [detectedBeat, setDetected]   = useState(1);
  const [structure, setStructure]     = useState("Three-Act Structure");
  const [autoPanel, setAutoPanel]     = useState("beats");
  const [autoResult, setAutoResult]   = useState(null);
  const [autoLoading, setAutoLoading] = useState(false);
  const [saveStatus, setSaveStatus]   = useState("saved");
  const [showNotifs, setShowNotifs]   = useState(false);
  const [wizardStep, setWizardStep]   = useState(0);
  const [deadline, setDeadline]       = useState("");
  const [dailyPages, setDailyPages]   = useState(3);
  const [writeTime, setWriteTime]     = useState("Evening");
  const [cover, setCover]             = useState({title:"",writer:"",genre:"",logline:"",desc:""});
  const [projects, setProjects]       = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [toolCatFilter, setToolCatFilter]   = useState("All");
  const saveTimer = useRef(null);
  const chatEnd   = useRef(null);
  const editorRef = useRef(null);

  // ── Load user & projects from storage on mount ──────────────────────────
  useEffect(() => {
    const loadData = async () => {
      try {
        const uRes = await window.storage.get("scriptavo_user");
        if (uRes?.value) {
          const u = JSON.parse(uRes.value);
          setUser(u);
          setIsPremium(u.premium || false);
          const pRes = await window.storage.get(`projects_${u.email}`);
          if (pRes?.value) setProjects(JSON.parse(pRes.value));
          setView("dashboard");
        }
      } catch {}
    };
    loadData();
  }, []);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  // ── Real-time beat detection ─────────────────────────────────────────────
  useEffect(() => {
    const d = detectCurrentBeat(scriptContent.length);
    setDetected(d);
  }, [scriptContent]);

  // ── Auto-save script ─────────────────────────────────────────────────────
  const setScriptContent = (val) => {
    setScriptRaw(val);
    setSaveStatus("unsaved");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      if (!user || !currentProject) return;
      setSaveStatus("saving");
      try {
        const key = `script_${user.email}_${currentProject.id}`;
        await window.storage.set(key, val);
        const updatedProjects = projects.map(p =>
          p.id === currentProject.id
            ? { ...p, pages: Math.max(0, (val.length/1500)).toFixed(1), lastEdit:"Just now" }
            : p
        );
        setProjects(updatedProjects);
        await window.storage.set(`projects_${user.email}`, JSON.stringify(updatedProjects));
        setSaveStatus("saved");
      } catch { setSaveStatus("error"); }
    }, 2000);
  };

  const pageCount = () => Math.max(0, scriptContent.length/1500).toFixed(1);
  const runtime   = () => Math.max(0, Math.round(scriptContent.length/1500));
  const currentPage = parseFloat(pageCount());

  // ── Claude API call (no user key needed) ───────────────────────────────
  const callAI = async (systemPrompt, msgs) => {
    const res = await fetch("/api/chat", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ system: systemPrompt, messages: msgs }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.text || "No response.";
  };

  // ── Send message ─────────────────────────────────────────────────────────
  const send = useCallback(async (toolId) => {
    if (!userInput.trim() || loading) return;
    const tid  = toolId || activeTool;
    const uMsg = {
      role:"user",
      content: scriptContent
        ? `[CURRENT SCRIPT — ${pageCount()} pages]\n${scriptContent.slice(0,1800)}\n\n[REQUEST]\n${userInput}`
        : userInput,
    };
    const hist = [...messages, uMsg];
    setMessages(hist);
    setUserInput("");
    setLoading(true);
    try {
      const text = await callAI(SYS[tid]||SYS.default, hist.map(m=>({role:m.role,content:m.content})));
      setMessages([...hist, {role:"assistant",content:text}]);
    } catch(e) {
      setMessages([...hist, {role:"assistant",content:`⚠️ ${e.message}`}]);
    } finally { setLoading(false); }
  }, [userInput, messages, loading, scriptContent, activeTool]);

  // ── Auto-generate panel ──────────────────────────────────────────────────
  const autoGenerate = async (type) => {
    if (!isPremium && type !== "beats") { setAutoResult({locked:true}); return; }
    if (!scriptContent.trim()) { setAutoResult({text:"Write some script content first, then click analyze."}); return; }
    setAutoLoading(true); setAutoResult(null);
    const s = scriptContent;
    const prompts = {
      beats:      "Analyze this screenplay. Map all 15 Save the Cat beats: ✅ present (quote the line), ⬜ missing. Be specific.\n\nSCRIPT:\n"+s.slice(0,1500),
      storyboard: "Create a text storyboard for the most recent scene. 4-6 shots. Format: SHOT #: [SIZE] [ANGLE] — [Description] | MOVE: [movement] | ⭐ if keyframe. Suggest aspect ratio.\n\nSCRIPT:\n"+s.slice(-600),
      shots:      "Shot division list for the most recent scene. Each shot: SHOT TYPE · ANGLE · MOVEMENT · 180° STATUS · CAMERA MOTIVATION.\n\nSCRIPT:\n"+s.slice(-600),
      analysis:   "Deep analysis. Mark: 🔴 ON-THE-NOSE dialogue, 🟡 EXPOSITION DUMP, 🟢 STRONG SUBTEXT, 🟠 PACING ISSUE. For 🔴 and 🟡 give rewrites.\n\nSCRIPT:\n"+s.slice(0,1500),
      breakdown:  "Script Breakdown Sheet for all scenes present: SCENE # · INT/EXT · LOCATION · CAST · PROPS · COSTUMES · SFX · NOTES.\n\nSCRIPT:\n"+s.slice(0,1200),
    };
    try {
      const text = await callAI("You are Scriptavo.AI, a professional screenplay analysis engine. Be concise, structured, and cinematic.", [{role:"user",content:prompts[type]||prompts.beats}]);
      setAutoResult({text});
    } catch(e) { setAutoResult({text:"⚠️ "+e.message}); }
    finally { setAutoLoading(false); }
  };

  const ins = (s) => { setScriptContent(scriptContent+s); editorRef.current?.focus(); };

  // ── Login & save user ────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!nameInput.trim()) { setLoginError("Please enter your name."); return; }
    if (!emailInput.includes("@")) { setLoginError("Please enter a valid email address."); return; }
    const u = { name: nameInput.trim(), email: emailInput.trim().toLowerCase(), premium: false, joinDate: new Date().toISOString() };
    try {
      localStorage.setItem('scriptavo_user', JSON.stringify(u));
      await window.storage.set("scriptavo_user", JSON.stringify(u));
      const pRes = await window.storage.get(`projects_${u.email}`);
      if (pRes?.value) setProjects(JSON.parse(pRes.value));
    } catch {}
    setUser(u);
    setView("dashboard");
  };

  const handleLogout = async () => {
    try { await window.storage.delete("scriptavo_user"); } catch {}
    setUser(null); setView("welcome"); setProjects([]); setCurrentProject(null);
  };

  const openProject = async (p) => {
    setCurrentProject(p);
    try {
      const res = await window.storage.get(`script_${user?.email}_${p.id}`);
      setScriptRaw(res?.value || "");
    } catch { setScriptRaw(""); }
    setSaveStatus("saved");
    setView("editor");
  };

  const createProject = async () => {
    const p = { id: Date.now(), title: cover.title||"Untitled", genre: cover.genre||"Drama", pages:"0", lastEdit:"Now", deadline, dailyPages };
    const updated = [...projects, p];
    setProjects(updated);
    try { await window.storage.set(`projects_${user?.email}`, JSON.stringify(updated)); } catch {}
    setCurrentProject(p);
    setScriptRaw("");
    setView("editor");
  };

  const activatePremium = async () => {
    setIsPremium(true);
    if (user) {
      const u = {...user, premium:true};
      setUser(u);
      try { await window.storage.set("scriptavo_user", JSON.stringify(u)); } catch {}
    }
    setView("dashboard");
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // WELCOME SCREEN
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="welcome") return (
    <div style={{background:`linear-gradient(140deg,${C.bg} 0%,#0d0d20 50%,${C.bg} 100%)`,height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",color:C.text,overflow:"hidden",position:"relative"}}>
      <div style={{position:"absolute",inset:0,background:"radial-gradient(ellipse at 25% 30%, #180f30 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, #0a1825 0%, transparent 55%)",pointerEvents:"none"}}/>
      <div style={{textAlign:"center",marginBottom:40,position:"relative"}}>
        <div style={{width:110,height:110,borderRadius:"50%",border:`2px solid ${C.accent}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",background:"rgba(232,184,75,0.07)",boxShadow:"0 0 50px rgba(232,184,75,0.25)",fontSize:46}}>🎬</div>
        <h1 style={{fontSize:58,fontWeight:"bold",margin:0,letterSpacing:"-0.02em",background:`linear-gradient(135deg,${C.accent} 0%,#f8e080 55%,${C.accent} 100%)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Scriptavo</h1>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginTop:4}}>
          <div style={{height:1,width:44,background:"rgba(232,184,75,0.35)"}}/>
          <span style={{color:C.accent,fontSize:13,letterSpacing:"0.35em"}}>AI</span>
          <div style={{height:1,width:44,background:"rgba(232,184,75,0.35)"}}/>
        </div>
        <p style={{color:C.muted,fontSize:15,marginTop:14,fontStyle:"italic"}}>Your AI co-writer. From idea to final draft.</p>
      </div>
      <div style={{background:"rgba(232,184,75,0.05)",border:"1px solid rgba(232,184,75,0.18)",borderRadius:18,padding:"26px 44px",maxWidth:480,textAlign:"center",marginBottom:36}}>
        <p style={{fontSize:18,margin:0,color:"#d0d0ee"}}>Welcome, Screenwriter. 🎭</p>
        <p style={{fontSize:14,color:C.muted,marginTop:10,lineHeight:1.7}}>Like JARVIS manages Tony Stark — Scriptavo.AI manages your entire writing process. No setup needed. Just sign in and write.</p>
      </div>
      <div style={{display:"flex",gap:14}}>
        <button onClick={()=>setView("login")} style={{background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:"14px 38px",borderRadius:50,cursor:"pointer",fontSize:15,fontWeight:"bold",fontFamily:"Georgia,serif",boxShadow:"0 4px 22px rgba(232,184,75,0.4)"}}>Start Writing →</button>
        <button onClick={()=>setView("pricing")} style={{background:"transparent",border:"1px solid rgba(232,184,75,0.4)",color:C.accent,padding:"14px 30px",borderRadius:50,cursor:"pointer",fontSize:15,fontFamily:"Georgia,serif"}}>View Plans</button>
      </div>
      <p style={{color:"#1e1e32",fontSize:11,marginTop:28,fontFamily:"sans-serif"}}>© 2026 Scriptavo.AI · All Rights Reserved</p>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // LOGIN / SIGN UP (FIX 1 — no API key, just name + email)
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="login") return (
    <div style={{background:C.bg,height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",color:C.text}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"44px 50px",width:"100%",maxWidth:460,boxShadow:"0 20px 60px rgba(0,0,0,0.7)"}}>
        <div style={{textAlign:"center",marginBottom:30}}>
          <div style={{fontSize:40,marginBottom:10}}>🎬</div>
          <h2 style={{color:C.accent,fontSize:22,margin:"0 0 6px"}}>Sign In to Scriptavo.AI</h2>
          <p style={{color:C.muted,fontSize:13,fontFamily:"sans-serif",margin:0}}>Free to use. No credit card. No API key needed.</p>
        </div>
        <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:5,fontFamily:"sans-serif"}}>Your Name</label>
        <input value={nameInput} onChange={e=>{setNameInput(e.target.value);setLoginError("");}} placeholder="e.g. John Doe" style={{width:"100%",background:C.surface,border:`1px solid ${loginError&&!nameInput?C.red:C.border}`,color:C.text,padding:"11px 14px",borderRadius:8,fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",marginBottom:14}}/>
        <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:5,fontFamily:"sans-serif"}}>Email Address</label>
        <input value={emailInput} onChange={e=>{setEmailInput(e.target.value);setLoginError("");}} placeholder="your@email.com" type="email" style={{width:"100%",background:C.surface,border:`1px solid ${loginError&&!emailInput.includes("@")?C.red:C.border}`,color:C.text,padding:"11px 14px",borderRadius:8,fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box",marginBottom:6}}/>
        {loginError && <p style={{color:C.red,fontSize:11,fontFamily:"sans-serif",margin:"0 0 12px"}}>{loginError}</p>}
        <div style={{background:"rgba(78,201,148,0.07)",border:"1px solid rgba(78,201,148,0.2)",borderRadius:8,padding:10,marginBottom:22,fontSize:11,color:C.green,fontFamily:"sans-serif",lineHeight:1.6}}>
          ✅ Your scripts are saved automatically to your account. Access them from any device.
        </div>
        <button onClick={handleLogin} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:13,borderRadius:8,cursor:"pointer",fontWeight:"bold",fontFamily:"Georgia,serif",fontSize:15}}>Enter Scriptavo.AI →</button>
        <button onClick={()=>setView("welcome")} style={{width:"100%",marginTop:10,background:"none",border:"none",color:C.muted,padding:8,cursor:"pointer",fontFamily:"sans-serif",fontSize:12}}>← Back to home</button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICING PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="pricing") return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Georgia,serif"}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 22px",height:52,display:"flex",alignItems:"center",gap:14}}>
        <button onClick={()=>setView(user?"dashboard":"welcome")} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:20}}>←</button>
        <span style={{fontWeight:"bold",color:C.accent,fontSize:18}}>🎬 Scriptavo.AI</span>
        <span style={{color:C.muted,fontSize:12,marginLeft:"auto",fontFamily:"sans-serif"}}>Subscription Plans</span>
      </div>
      <div style={{maxWidth:820,margin:"56px auto",padding:"0 22px"}}>
        <h1 style={{textAlign:"center",fontSize:34,color:C.accent,margin:"0 0 8px"}}>Simple, Honest Pricing</h1>
        <p style={{textAlign:"center",color:C.muted,marginBottom:50,fontSize:15,fontFamily:"sans-serif"}}>Start free. Upgrade for full AI power — less than a coffee.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:32}}>
            <div style={{fontSize:34,marginBottom:8}}>✍️</div>
            <h2 style={{color:C.text,fontSize:22,margin:"0 0 6px"}}>Free Basic</h2>
            <div style={{fontSize:36,fontWeight:"bold",color:C.text,margin:"18px 0"}}>$0 <span style={{fontSize:13,color:C.muted,fontFamily:"sans-serif"}}>/forever</span></div>
            {["Screenplay editor","All formatting tools","15 Beat Sheet tracker","Project saving","Script cover page","Grammar checker"].map(f=>(
              <div key={f} style={{display:"flex",gap:8,marginBottom:8,fontSize:13,color:"#a0a0c0",fontFamily:"sans-serif"}}><span style={{color:C.green}}>✓</span>{f}</div>
            ))}
            <button onClick={()=>{if(user)setView("dashboard");else setView("login");}} style={{width:"100%",marginTop:24,background:"transparent",border:`1px solid ${C.border}`,color:C.text,padding:12,borderRadius:8,cursor:"pointer",fontSize:14,fontFamily:"Georgia,serif"}}>Continue Free</button>
          </div>
          <div style={{background:"linear-gradient(140deg,#1a1430,#121020)",border:`2px solid ${C.accent}`,borderRadius:18,padding:32,position:"relative",boxShadow:"0 0 36px rgba(232,184,75,0.14)"}}>
            <div style={{position:"absolute",top:-13,left:"50%",transform:"translateX(-50%)",background:C.accent,color:"#000",padding:"3px 18px",borderRadius:20,fontSize:11,fontWeight:"bold",letterSpacing:"0.1em",fontFamily:"sans-serif"}}>MOST POPULAR</div>
            <div style={{fontSize:34,marginBottom:8}}>🤖</div>
            <h2 style={{color:C.accent,fontSize:22,margin:"0 0 6px"}}>Premium AI</h2>
            <div style={{fontSize:36,fontWeight:"bold",color:C.accent,margin:"18px 0"}}>$0.89 <span style={{fontSize:13,color:"#a8903a",fontFamily:"sans-serif"}}>/month</span></div>
            {["Everything in Free","AI Logline & Premise Generator","Auto Beat Sheet analysis","AI Dialogue Coach + Subtext","Auto-Storyboard generation","Script Breakdown Sheet (auto)","Shot Division & Floor Plans","Pitch Deck / Lookbook generator","Writer's Block Solver","All 22 Story Structures","Character Psychology analysis","Camera Movement Motivation","Time Manager & writing reminders"].map(f=>(
              <div key={f} style={{display:"flex",gap:8,marginBottom:7,fontSize:13,color:"#c8c8e0",fontFamily:"sans-serif"}}><span style={{color:C.accent}}>✦</span>{f}</div>
            ))}
            <p style={{fontSize:11,color:C.muted,margin:"16px 0 10px",lineHeight:1.6,fontFamily:"sans-serif"}}>Billed automatically at $0.89/month. Cancel anytime. Secure payment via PayPal.</p>
            <button onClick={activatePremium} style={{width:"100%",background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:14,borderRadius:8,cursor:"pointer",fontWeight:"bold",fontFamily:"Georgia,serif",fontSize:15}}>Activate Premium — $0.89/mo</button>
          </div>
        </div>
        <div style={{textAlign:"center",marginTop:44,color:"#1e1e32",fontSize:11,lineHeight:2.2,fontFamily:"sans-serif"}}>
          <p>© 2026 Scriptavo.AI · All Rights Reserved</p>
          <p>Privacy Policy · Terms of Service · Intellectual Property: Generated scripts owned by user. Platform owned by Scriptavo.AI.</p>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // DASHBOARD
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="dashboard") return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text,fontFamily:"Georgia,serif"}}>
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 22px",height:52,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:20,fontWeight:"bold",color:C.accent}}>🎬 Scriptavo.AI</span>
        {isPremium&&<span style={{background:C.accent,color:"#000",fontSize:9,padding:"1px 6px",borderRadius:3,fontWeight:"bold",fontFamily:"sans-serif"}}>PREMIUM</span>}
        <div style={{flex:1}}/>
        {user && <span style={{color:C.muted,fontSize:12,fontFamily:"sans-serif"}}>👤 {user.name}</span>}
        <button onClick={()=>setView("pricing")} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>{isPremium?"✦ Premium":"Upgrade $0.89/mo"}</button>
        <button onClick={handleLogout} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>Logout</button>
      </div>
      <div style={{maxWidth:920,margin:"0 auto",padding:"40px 22px"}}>
        <h2 style={{fontSize:26,margin:"0 0 4px"}}>Welcome back, {user?.name?.split(" ")[0]} 👋</h2>
        <p style={{color:C.muted,marginBottom:30,fontSize:13,fontFamily:"sans-serif"}}>Your scripts are saved automatically. Pick up where you left off.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14,marginBottom:36}}>
          <div onClick={()=>{setCover({title:"",writer:user?.name||"",genre:"",logline:"",desc:""});setWizardStep(0);setView("wizard");}} style={{background:"rgba(232,184,75,0.05)",border:"1px dashed rgba(232,184,75,0.28)",borderRadius:12,padding:24,cursor:"pointer",textAlign:"center"}}>
            <div style={{fontSize:36,marginBottom:10,color:C.accent}}>+</div>
            <div style={{color:C.accent,fontWeight:"bold",fontSize:14}}>New Project</div>
            <div style={{color:C.muted,fontSize:11,marginTop:4,fontFamily:"sans-serif"}}>Start a new script</div>
          </div>
          {projects.map(p=>(
            <div key={p.id} onClick={()=>openProject(p)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,cursor:"pointer"}}>
              <div style={{fontSize:26,marginBottom:8}}>📄</div>
              <div style={{fontWeight:"bold",fontSize:15,marginBottom:4}}>{p.title}</div>
              <div style={{color:C.muted,fontSize:11,marginBottom:8,fontFamily:"sans-serif"}}>{p.genre}</div>
              <div style={{display:"flex",gap:10,fontSize:10,color:C.muted,fontFamily:"sans-serif",marginBottom:10}}>
                <span>📝 {p.pages} pages</span><span>🕐 {p.lastEdit}</span>
              </div>
              <div style={{height:3,background:C.border,borderRadius:2}}>
                <div style={{height:"100%",borderRadius:2,background:C.accent,width:`${Math.min(100,(parseFloat(p.pages)/110)*100)}%`}}/>
              </div>
              <div style={{fontSize:9,color:C.muted,marginTop:3,fontFamily:"sans-serif"}}>{p.pages}/110 pages · {Math.round((parseFloat(p.pages)/110)*100)}% complete</div>
            </div>
          ))}
        </div>
        <h3 style={{fontSize:17,margin:"0 0 14px",color:"#9090b8"}}>Quick AI Tools</h3>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {[{id:"logline",icon:"💡",l:"Logline"},{id:"beatsheet",icon:"📊",l:"Beat Sheet"},{id:"storyboard",icon:"🖼️",l:"Storyboard"},{id:"pitch_deck",icon:"📋",l:"Pitch Deck"},{id:"on_nose",icon:"🚫",l:"Dialogue Fix"},{id:"wr_block",icon:"💡",l:"Idea Spark"},{id:"breakdown",icon:"📋",l:"Breakdown"},{id:"char_arc",icon:"📈",l:"Character Arc"}].map(t=>(
            <button key={t.id} onClick={()=>{setActiveTool(t.id);setMessages([]);setView("tools");}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 6px",cursor:"pointer",color:C.text,fontFamily:"Georgia,serif",fontSize:11,textAlign:"center"}}>
              <div style={{fontSize:22,marginBottom:4}}>{t.icon}</div>{t.l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // WIZARD
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="wizard") return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",color:C.text}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"44px 50px",width:"100%",maxWidth:520,boxShadow:"0 20px 60px rgba(0,0,0,0.6)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <span style={{fontSize:36}}>🎬</span>
          <h2 style={{color:C.accent,fontSize:22,margin:"8px 0 4px"}}>New Project Setup</h2>
          <p style={{color:C.muted,fontSize:12,fontFamily:"sans-serif",margin:0}}>Step {wizardStep+1} of 2</p>
        </div>
        {wizardStep===0 && <>
          {[["Script Title","title","e.g. The Last Signal"],["Genre","genre","e.g. Psychological Thriller"]].map(([lbl,k,ph])=>(
            <div key={k} style={{marginBottom:16}}>
              <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:5,fontFamily:"sans-serif"}}>{lbl}</label>
              <input value={cover[k]} onChange={e=>setCover(d=>({...d,[k]:e.target.value}))} placeholder={ph} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"10px 14px",borderRadius:8,fontSize:14,fontFamily:"Georgia,serif",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:5,fontFamily:"sans-serif"}}>Deadline — When do you want to finish? 📅</label>
          <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} style={{width:"100%",background:C.surface,border:`1px solid ${C.border}`,color:C.text,padding:"10px 14px",borderRadius:8,fontSize:14,outline:"none",marginBottom:14,boxSizing:"border-box"}}/>
          {deadline&&<div style={{background:"rgba(232,184,75,0.08)",border:"1px solid rgba(232,184,75,0.2)",borderRadius:8,padding:10,fontSize:12,color:"#c0b070",fontFamily:"sans-serif"}}>⏱️ Scriptavo.AI will calculate your daily writing schedule to hit this deadline.</div>}
        </>}
        {wizardStep===1 && <>
          <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:10,fontFamily:"sans-serif"}}>Pages per day?</label>
          <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>
            {[1,2,3,5,10].map(n=>(
              <button key={n} onClick={()=>setDailyPages(n)} style={{background:dailyPages===n?C.accent:C.surface,border:`1px solid ${C.border}`,color:dailyPages===n?"#000":C.text,padding:"8px 16px",borderRadius:8,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>{n} {n===1?"page":"pages"}</button>
            ))}
          </div>
          <label style={{display:"block",color:"#9090b8",fontSize:12,marginBottom:10,fontFamily:"sans-serif"}}>Best time to write?</label>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
            {["Morning","Afternoon","Evening","Night"].map(t=>(
              <button key={t} onClick={()=>setWriteTime(t)} style={{background:writeTime===t?C.accent:C.surface,border:`1px solid ${C.border}`,color:writeTime===t?"#000":C.text,padding:"8px 14px",borderRadius:8,cursor:"pointer",fontFamily:"Georgia,serif",fontSize:13}}>{t}</button>
            ))}
          </div>
          <div style={{background:"rgba(78,201,148,0.08)",border:"1px solid rgba(78,201,148,0.25)",borderRadius:8,padding:10,fontSize:12,color:C.green,fontFamily:"sans-serif",lineHeight:1.6}}>
            ✅ Writing reminders every {writeTime.toLowerCase()}. Daily target: {dailyPages} pages. Your script auto-saves every 2 seconds.
          </div>
        </>}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:28}}>
          {wizardStep>0?<button onClick={()=>setWizardStep(s=>s-1)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"10px 18px",borderRadius:8,cursor:"pointer",fontFamily:"Georgia,serif"}}>← Back</button>
            :<button onClick={()=>setView("dashboard")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"Georgia,serif"}}>Cancel</button>}
          <button onClick={()=>{if(wizardStep<1)setWizardStep(s=>s+1);else setView("cover");}} style={{background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:"10px 28px",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontFamily:"Georgia,serif",fontSize:14}}>
            {wizardStep<1?"Next →":"Set Up Script →"}
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // COVER PAGE
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="cover") return (
    <div style={{background:C.bg,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",color:C.text,padding:24}}>
      <div style={{textAlign:"center",marginBottom:16}}><span style={{color:C.accent,fontSize:12,letterSpacing:"0.18em",fontFamily:"sans-serif"}}>SCRIPT COVER PAGE</span></div>
      <div style={{background:"#fff",color:"#000",borderRadius:4,padding:"52px 66px",width:"100%",maxWidth:600,boxShadow:"0 24px 70px rgba(0,0,0,0.9)",fontFamily:"'Courier New',Courier,monospace"}}>
        <div style={{textAlign:"center",marginBottom:44}}>
          <input value={cover.title} onChange={e=>setCover(d=>({...d,title:e.target.value}))} placeholder="SCRIPT TITLE" style={{textAlign:"center",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid #bbb",fontFamily:"'Courier New',monospace",fontSize:22,fontWeight:"bold",textTransform:"uppercase",padding:"6px 0",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{textAlign:"center",marginBottom:28,fontSize:14}}>
          <div style={{marginBottom:4}}>Written by</div>
          <input value={cover.writer} onChange={e=>setCover(d=>({...d,writer:e.target.value}))} placeholder="Your Name" style={{textAlign:"center",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid #bbb",fontFamily:"'Courier New',monospace",fontSize:15,padding:"4px 0",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{marginBottom:18,fontSize:12}}>
          <div style={{fontWeight:"bold",marginBottom:4}}>LOGLINE:</div>
          <textarea value={cover.logline} onChange={e=>setCover(d=>({...d,logline:e.target.value}))} placeholder="A one-sentence description of your story…" rows={3} style={{width:"100%",background:"transparent",border:"1px solid #ddd",fontFamily:"'Courier New',monospace",fontSize:12,padding:8,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{fontSize:12}}>
          <div style={{fontWeight:"bold",marginBottom:4}}>DESCRIPTION:</div>
          <textarea value={cover.desc} onChange={e=>setCover(d=>({...d,desc:e.target.value}))} placeholder="Brief description of your film…" rows={4} style={{width:"100%",background:"transparent",border:"1px solid #ddd",fontFamily:"'Courier New',monospace",fontSize:12,padding:8,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{textAlign:"center",marginTop:36,fontSize:11,color:"#888"}}>© 2026 {cover.writer||"Writer"} · All Rights Reserved</div>
      </div>
      <div style={{display:"flex",gap:12,marginTop:18}}>
        <button onClick={()=>setView("wizard")} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"10px 18px",borderRadius:8,cursor:"pointer",fontFamily:"Georgia,serif"}}>← Back</button>
        <button onClick={createProject} style={{background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:"12px 34px",borderRadius:8,cursor:"pointer",fontWeight:"bold",fontFamily:"Georgia,serif",fontSize:15}}>Begin Writing →</button>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // TOOLS VIEW
  // ═══════════════════════════════════════════════════════════════════════════
  if (view==="tools") {
    const cats    = ["All",...new Set(TOOLS.map(t=>t.cat))];
    const visible = TOOLS.filter(t=>toolCatFilter==="All"||t.cat===toolCatFilter);
    const cur     = TOOLS.find(t=>t.id===activeTool)||{label:"AI Assistant",icon:"🤖"};
    return (
      <div style={{background:C.bg,height:"100vh",display:"flex",flexDirection:"column",fontFamily:"Georgia,serif",color:C.text,overflow:"hidden"}}>
        <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:50,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
          <button onClick={()=>setView("editor")} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:19}}>←</button>
          <span style={{fontWeight:"bold",color:C.accent}}>🎬 Scriptavo.AI</span>
          <span style={{color:C.muted,fontSize:12,fontFamily:"sans-serif"}}>/ {cur.icon} {cur.label}</span>
          {!isPremium&&<button onClick={()=>setView("pricing")} style={{marginLeft:"auto",background:"rgba(232,184,75,0.1)",border:"1px solid rgba(232,184,75,0.3)",color:C.accent,padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>✦ Upgrade $0.89/mo</button>}
        </div>
        <div style={{flex:1,display:"flex",overflow:"hidden"}}>
          <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,overflowY:"auto",flexShrink:0}}>
            <div style={{padding:"10px 12px 4px",fontSize:9,color:C.muted,letterSpacing:"0.15em",fontFamily:"sans-serif"}}>CATEGORIES</div>
            {cats.map(cat=>(
              <button key={cat} onClick={()=>setToolCatFilter(cat)} style={{width:"100%",textAlign:"left",background:toolCatFilter===cat?"rgba(232,184,75,0.08)":"none",border:"none",borderLeft:toolCatFilter===cat?`3px solid ${C.accent}`:"3px solid transparent",color:toolCatFilter===cat?C.accent:"#9090b8",padding:"6px 12px",cursor:"pointer",fontSize:12,fontFamily:"sans-serif"}}>{cat}</button>
            ))}
            <div style={{height:1,background:C.border,margin:"6px 0"}}/>
            {visible.map(t=>(
              <button key={t.id} onClick={()=>{setActiveTool(t.id);setMessages([]);}} style={{width:"100%",textAlign:"left",background:activeTool===t.id?"rgba(232,184,75,0.08)":"none",border:"none",borderLeft:activeTool===t.id?`3px solid ${C.accent}`:"3px solid transparent",color:activeTool===t.id?C.accent:"#b0b0d0",padding:"5px 10px",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:6}}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
            <div style={{flex:1,overflowY:"auto",padding:18,display:"flex",flexDirection:"column",gap:12}}>
              {messages.length===0&&(
                <div style={{textAlign:"center",padding:"50px 24px",color:C.muted}}>
                  <div style={{fontSize:44,marginBottom:10}}>{cur.icon}</div>
                  <div style={{fontSize:17,color:"#a0a0c0",marginBottom:6,fontFamily:"sans-serif"}}>{cur.label}</div>
                  <div style={{fontSize:12,fontFamily:"sans-serif"}}>Ask me anything. I'll analyze your script and help you improve it.</div>
                </div>
              )}
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"88%",padding:"10px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?C.accent:C.card,color:m.role==="user"?"#000":C.text,fontSize:12,lineHeight:1.75,border:m.role==="assistant"?`1px solid ${C.border}`:"none",whiteSpace:"pre-wrap",fontFamily:"sans-serif"}}>
                    {m.content}
                    {m.role==="assistant"&&(
                      <div style={{marginTop:8,display:"flex",gap:6}}>
                        <button onClick={()=>navigator.clipboard.writeText(m.content)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"2px 8px",borderRadius:3,cursor:"pointer",fontSize:10}}>Copy</button>
                        <button onClick={()=>{setScriptContent(scriptContent+"\n\n"+m.content);setView("editor");}} style={{background:"rgba(232,184,75,0.1)",border:"1px solid rgba(232,184,75,0.3)",color:C.accent,padding:"2px 8px",borderRadius:3,cursor:"pointer",fontSize:10}}>+ Add to Script</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading&&<div style={{color:C.muted,fontSize:12,fontFamily:"sans-serif"}}>✦ Scriptavo.AI is writing...</div>}
              <div ref={chatEnd}/>
            </div>
            <div style={{padding:12,borderTop:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
              <div style={{display:"flex",gap:8}}>
                <textarea value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder={`Ask ${cur.label}... (Enter to send)`} rows={2} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"8px 12px",borderRadius:8,fontSize:12,fontFamily:"sans-serif",resize:"none",outline:"none"}}/>
                <button onClick={()=>send()} disabled={loading||!userInput.trim()} style={{background:loading||!userInput.trim()?C.border:C.accent,border:"none",color:loading||!userInput.trim()?C.muted:"#000",padding:"0 18px",borderRadius:8,cursor:"pointer",fontSize:18}}>↑</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN EDITOR (FIX 2 — auto-save + FIX 3 — real-time beats)
  // ═══════════════════════════════════════════════════════════════════════════
  const nextBeat = getNextBeat(currentPage);
  const pagesLeft = nextBeat ? Math.max(0, nextBeat.range[0] - currentPage).toFixed(1) : "0";

  return (
    <div style={{background:C.bg,height:"100vh",display:"flex",flexDirection:"column",fontFamily:"Georgia,serif",color:C.text,overflow:"hidden"}}>

      {/* TOP NAV */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"0 14px",height:50,display:"flex",alignItems:"center",gap:10,flexShrink:0,zIndex:100}}>
        <button onClick={()=>setMenuOpen(!menuOpen)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:20}}>☰</button>
        <span style={{fontWeight:"bold",color:C.accent,fontSize:17}}>🎬 Scriptavo.AI</span>
        {isPremium&&<span style={{background:C.accent,color:"#000",fontSize:9,padding:"1px 5px",borderRadius:3,fontWeight:"bold",fontFamily:"sans-serif"}}>PREMIUM</span>}

        {/* FIX 2 — Save status indicator */}
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,background:saveStatus==="saved"?"rgba(78,201,148,0.1)":saveStatus==="saving"?"rgba(232,184,75,0.1)":"rgba(232,80,112,0.1)",border:`1px solid ${saveStatus==="saved"?"rgba(78,201,148,0.3)":saveStatus==="saving"?"rgba(232,184,75,0.3)":"rgba(232,80,112,0.3)"}`}}>
          <span style={{fontSize:8,color:saveStatus==="saved"?C.green:saveStatus==="saving"?C.accent:C.red}}>●</span>
          <span style={{fontSize:10,color:saveStatus==="saved"?C.green:saveStatus==="saving"?C.accent:C.red,fontFamily:"sans-serif"}}>{saveStatus==="saved"?"Saved":saveStatus==="saving"?"Saving...":"Unsaved"}</span>
        </div>

        <div style={{marginLeft:"auto",display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:11,color:C.muted,fontFamily:"sans-serif"}}>📄 {pageCount()} pages · ⏱️ ~{runtime()} min</span>
          <button onClick={()=>setShowNotifs(!showNotifs)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16,position:"relative"}}>
            🔔<span style={{position:"absolute",top:-3,right:-3,background:C.red,color:"#fff",fontSize:8,padding:"1px 3px",borderRadius:6,fontFamily:"sans-serif"}}>3</span>
          </button>
          <button onClick={()=>setView("dashboard")} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"3px 10px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>◁ Projects</button>
        </div>
      </div>

      {/* Notifications */}
      {showNotifs&&(
        <div style={{position:"fixed",top:50,right:12,zIndex:300,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,width:286,padding:12,boxShadow:"0 8px 36px rgba(0,0,0,0.7)"}}>
          <div style={{fontSize:11,color:C.accent,fontWeight:"bold",marginBottom:8,fontFamily:"sans-serif"}}>✦ AI Notifications</div>
          {["🎯 You are on Beat "+detectedBeat+": "+BEATS[detectedBeat-1]?.name,"💬 Scriptavo.AI is analyzing your script in real-time","⏱️ Daily goal: "+dailyPages+" pages · Current: "+pageCount()+" pages"].map((n,i)=>(
            <div key={i} style={{padding:"7px 10px",background:C.surface,borderRadius:6,marginBottom:6,fontSize:11,color:"#c0c0e0",fontFamily:"sans-serif",lineHeight:1.4}}>{n}</div>
          ))}
        </div>
      )}

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* HAMBURGER MENU */}
        {menuOpen&&(
          <div style={{width:246,background:"#080810",borderRight:`1px solid ${C.border}`,overflowY:"auto",flexShrink:0,zIndex:60}}>
            <div style={{padding:"12px 14px 10px",borderBottom:`1px solid ${C.border}`}}>
              <div style={{fontSize:14,fontWeight:"bold",color:C.accent}}>🎬 Scriptavo.AI</div>
              <div style={{fontSize:11,color:C.muted,fontFamily:"sans-serif",marginTop:2}}>👤 {user?.name}</div>
            </div>
            {[{label:"📁 My Projects",action:()=>{setView("dashboard");setMenuOpen(false);}},{label:"🛠️ All AI Tools",action:()=>{setView("tools");setMenuOpen(false);}},{label:"💰 Subscription",action:()=>{setView("pricing");setMenuOpen(false);}},{label:"🚪 Logout",action:()=>{handleLogout();setMenuOpen(false);}}].map(item=>(
              <button key={item.label} onClick={item.action} style={{width:"100%",textAlign:"left",background:"none",border:"none",color:"#b0b0d0",padding:"9px 14px",cursor:"pointer",fontSize:13,fontFamily:"Georgia,serif",borderBottom:"1px solid #0f0f1a"}}>{item.label}</button>
            ))}
            <div style={{padding:"8px 14px 4px",fontSize:9,color:C.muted,letterSpacing:"0.14em",fontFamily:"sans-serif",marginTop:4}}>AI TOOLS ({TOOLS.length})</div>
            {TOOLS.map(t=>(
              <button key={t.id} onClick={()=>{setActiveTool(t.id);setMessages([]);setView("tools");setMenuOpen(false);}} style={{width:"100%",textAlign:"left",background:"none",border:"none",color:"#9090b8",padding:"5px 14px",cursor:"pointer",fontSize:11,fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:6}}>
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
            <div style={{padding:"10px 14px",borderTop:`1px solid ${C.border}`,marginTop:6}}>
              <div style={{fontSize:9,color:C.muted,marginBottom:8,letterSpacing:"0.12em",fontFamily:"sans-serif"}}>STORY STRUCTURE</div>
              <select value={structure} onChange={e=>setStructure(e.target.value)} style={{width:"100%",background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"6px",borderRadius:6,fontSize:11,fontFamily:"sans-serif"}}>
                {STRUCTURES.map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* SCREENPLAY EDITOR */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>

          {/* Format toolbar */}
          <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"5px 12px",display:"flex",gap:5,flexWrap:"wrap",flexShrink:0}}>
            {[["INT.","INT. LOCATION - DAY\n\n"],["EXT.","EXT. LOCATION - NIGHT\n\n"],["I/E","INT./EXT. LOCATION - DAY\n\n"],["CHAR","\n\t\t\t\t\tCHARACTER NAME\n"],["DIAL","\n\t\t\tDialogue goes here.\n"],["(beat)","\n\t\t\t\t\t(beat)\n"],["(V.O.)","\t\t\t\t\t(V.O.)\n"],["(O.S.)","\t\t\t\t\t(O.S.)\n"],["CUT TO:","\n\t\t\t\t\t\t\t\t\t\tCUT TO:\n\n"],["SMASH CUT:","\n\t\t\t\t\t\t\tSMASH CUT:\n\n"],["DISSOLVE:","\n\t\t\t\t\t\t\tDISSOLVE TO:\n\n"],["MATCH CUT:","\n\t\t\t\t\t\t\tMATCH CUT TO:\n\n"],["FADE IN:","FADE IN:\n\n"],["FADE OUT.","\n\t\t\t\t\t\t\t\t\tFADE OUT.\n"],["INTERCUT:","\nINTERCUT WITH:\n\n"],["FLASHBACK:","\nFLASHBACK:\n\n"],["TITLE:",'\n\t\t\t\tTITLE CARD: "Text here"\n']].map(([l,s])=>(
              <button key={l} onClick={()=>ins(s)} style={{background:C.card,border:`1px solid ${C.border}`,color:C.accent,padding:"2px 6px",borderRadius:3,cursor:"pointer",fontSize:10,fontFamily:"monospace"}}>{l}</button>
            ))}
          </div>

          {/* FIX 3 — REAL-TIME BEAT TRACKER */}
          <div style={{background:"#080812",borderBottom:`1px solid ${C.border}`,padding:"5px 10px",flexShrink:0}}>
            <div style={{display:"flex",gap:3,overflowX:"auto",marginBottom:5}}>
              <span style={{fontSize:9,color:C.muted,marginRight:4,fontFamily:"sans-serif",whiteSpace:"nowrap",lineHeight:"18px"}}>BEATS:</span>
              {BEATS.map(beat=>(
                <button key={beat.id} onClick={()=>setCurrentBeat(beat.id)} title={`Page ${beat.page} — ${beat.tip}`} style={{background:detectedBeat===beat.id?beat.color:currentBeat===beat.id?beat.color+"40":"#12121e",border:`1px solid ${detectedBeat===beat.id?beat.color:currentBeat===beat.id?beat.color+"60":C.border}`,color:detectedBeat===beat.id?"#000":currentBeat===beat.id?beat.color:"#6060a0",padding:"1px 7px",borderRadius:3,cursor:"pointer",fontSize:9,fontFamily:"sans-serif",whiteSpace:"nowrap",fontWeight:detectedBeat===beat.id?"bold":"normal",position:"relative"}}>
                  {detectedBeat===beat.id&&<span style={{position:"absolute",top:-4,right:-2,fontSize:7,color:beat.color}}>▲</span>}
                  {beat.id}. {beat.name}
                </button>
              ))}
            </div>
            {/* Real-time beat status bar */}
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <div style={{background:`${BEATS[detectedBeat-1]?.color}15`,border:`1px solid ${BEATS[detectedBeat-1]?.color}40`,borderRadius:6,padding:"3px 10px",display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:9,color:BEATS[detectedBeat-1]?.color,fontFamily:"sans-serif"}}>▶ NOW WRITING:</span>
                <span style={{fontSize:10,color:BEATS[detectedBeat-1]?.color,fontWeight:"bold",fontFamily:"sans-serif"}}>Beat {detectedBeat} — {BEATS[detectedBeat-1]?.name}</span>
              </div>
              <div style={{background:"rgba(255,255,255,0.04)",borderRadius:6,padding:"3px 10px",display:"flex",gap:6,alignItems:"center"}}>
                <span style={{fontSize:9,color:C.muted,fontFamily:"sans-serif"}}>💡 TIP:</span>
                <span style={{fontSize:9,color:"#9090c0",fontFamily:"sans-serif"}}>{BEATS[detectedBeat-1]?.tip}</span>
              </div>
              {currentPage < 109 && (
                <div style={{background:"rgba(232,184,75,0.08)",borderRadius:6,padding:"3px 10px"}}>
                  <span style={{fontSize:9,color:C.accent,fontFamily:"sans-serif"}}>Next: {nextBeat?.name} in ~{pagesLeft} pages</span>
                </div>
              )}
            </div>
          </div>

          {/* SCREENPLAY TEXTAREA */}
          <textarea
            ref={editorRef}
            value={scriptContent}
            onChange={e=>setScriptContent(e.target.value)}
            placeholder={`FADE IN:\n\n                                                                  1.\n\nINT. ${(cover.title||currentProject?.title||"YOUR SCENE").toUpperCase()} - DAY\n\nBegin your screenplay here. Scriptavo.AI is watching in real-time — tracking your beats, analyzing your dialogue, and ready to help the moment you get stuck.\n\n                              ${(cover.writer||user?.name||"WRITER").toUpperCase()}\n                   The story starts now.\n\n                                                          CUT TO:\n`}
            style={{flex:1,background:"#0b0b16",color:"#dbeadb",border:"none",outline:"none",padding:"30px 80px",resize:"none",fontFamily:"'Courier New',Courier,monospace",fontSize:13.5,lineHeight:1.9,letterSpacing:"0.01em"}}
          />

          {/* AI HELPER BAR */}
          <div style={{background:C.surface,borderTop:`1px solid ${C.border}`,padding:"8px 12px",display:"flex",gap:8,alignItems:"center",flexShrink:0}}>
            <span style={{fontSize:13,color:C.accent,whiteSpace:"nowrap"}}>✦</span>
            <input value={userInput} onChange={e=>setUserInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();if(userInput.trim()){send("general");setView("tools");}}}} placeholder="Ask Scriptavo.AI anything — improve dialogue, check structure, generate ideas, get unstuck…" style={{flex:1,background:C.card,border:`1px solid ${C.border}`,color:C.text,padding:"7px 14px",borderRadius:20,fontSize:12,fontFamily:"sans-serif",outline:"none"}}/>
            <button onClick={()=>{if(userInput.trim()){send("general");setView("tools");}}} style={{background:C.accent,border:"none",color:"#000",padding:"7px 16px",borderRadius:20,cursor:"pointer",fontSize:13,fontWeight:"bold"}}>→</button>
          </div>
        </div>

        {/* RIGHT AUTO-ANALYSIS PANEL */}
        <div style={{width:296,background:"#080810",borderLeft:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden",flexShrink:0}}>
          <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            {[{id:"beats",l:"Beats"},{id:"analysis",l:"Analysis"},{id:"storyboard",l:"Board"},{id:"shots",l:"Shots"},{id:"breakdown",l:"Sheet"}].map(tab=>(
              <button key={tab.id} onClick={()=>{setAutoPanel(tab.id);setAutoResult(null);autoGenerate(tab.id);}} style={{flex:1,background:autoPanel===tab.id?C.card:"transparent",border:"none",borderBottom:autoPanel===tab.id?`2px solid ${C.accent}`:"2px solid transparent",color:autoPanel===tab.id?C.accent:C.muted,padding:"7px 2px",cursor:"pointer",fontSize:9,fontFamily:"sans-serif",fontWeight:autoPanel===tab.id?"bold":"normal"}}>{tab.l}</button>
            ))}
          </div>
          <div style={{padding:"6px 12px",background:"#0a0a14",borderBottom:`1px solid ${C.border}`,flexShrink:0}}>
            <div style={{fontSize:9,color:C.muted,fontFamily:"sans-serif"}}>AUTO-GENERATED · Updates as you write</div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12}}>
            {autoPanel==="beats"&&!autoResult&&!autoLoading&&(
              <div>
                <div style={{fontSize:10,color:C.accent,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:10}}>15 BEATS — {structure}</div>
                {BEATS.map(beat=>(
                  <div key={beat.id} onClick={()=>setCurrentBeat(beat.id)} style={{display:"flex",gap:8,padding:"5px 6px",borderRadius:4,marginBottom:3,cursor:"pointer",background:detectedBeat===beat.id?`${beat.color}14`:currentBeat===beat.id?`${beat.color}08`:"transparent",border:`1px solid ${detectedBeat===beat.id?beat.color+"35":currentBeat===beat.id?beat.color+"20":"transparent"}`}}>
                    <div style={{fontSize:9,color:beat.color,fontFamily:"sans-serif",marginTop:1,minWidth:14,fontWeight:"bold"}}>{detectedBeat===beat.id?"▶":beat.id}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:detectedBeat===beat.id?beat.color:currentBeat===beat.id?beat.color:"#c0c0de",fontFamily:"sans-serif"}}>{beat.name}</div>
                      <div style={{fontSize:9,color:C.muted,fontFamily:"sans-serif"}}>p.{beat.page} {detectedBeat===beat.id&&<span style={{color:beat.color}}>← YOU ARE HERE</span>}</div>
                    </div>
                  </div>
                ))}
                {scriptContent.length>80&&(
                  <button onClick={()=>autoGenerate("beats")} style={{width:"100%",marginTop:12,background:"rgba(232,184,75,0.08)",border:"1px solid rgba(232,184,75,0.25)",color:C.accent,padding:"8px",borderRadius:6,cursor:"pointer",fontSize:11,fontFamily:"sans-serif"}}>✦ Deep Analyze My Script</button>
                )}
              </div>
            )}
            {autoLoading&&<div style={{textAlign:"center",padding:30,color:C.muted,fontFamily:"sans-serif",fontSize:12}}><div style={{fontSize:22,marginBottom:8}}>✦</div>Analyzing your script…</div>}
            {autoResult?.locked&&(
              <div style={{textAlign:"center",padding:"28px 14px",fontFamily:"sans-serif"}}>
                <div style={{fontSize:28,marginBottom:8}}>✦</div>
                <div style={{fontSize:13,color:C.accent,marginBottom:6}}>Premium Feature</div>
                <div style={{fontSize:11,color:C.muted,marginBottom:18}}>Auto-generation requires Premium AI.</div>
                <button onClick={()=>setView("pricing")} style={{background:`linear-gradient(135deg,${C.accent},#c89830)`,border:"none",color:"#000",padding:"9px 18px",borderRadius:6,cursor:"pointer",fontSize:12,fontWeight:"bold",fontFamily:"sans-serif"}}>Unlock — $0.89/mo</button>
              </div>
            )}
            {autoResult&&!autoResult.locked&&!autoLoading&&(
              <div>
                <div style={{fontSize:9,color:C.accent,fontFamily:"sans-serif",fontWeight:"bold",marginBottom:8,letterSpacing:"0.1em",textTransform:"uppercase"}}>{autoPanel} — AI Generated</div>
                <div style={{fontSize:11,color:"#c0c0de",fontFamily:"sans-serif",lineHeight:1.75,whiteSpace:"pre-wrap"}}>{autoResult.text}</div>
                <div style={{display:"flex",gap:6,marginTop:10}}>
                  <button onClick={()=>navigator.clipboard.writeText(autoResult.text||"")} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"sans-serif"}}>Copy</button>
                  <button onClick={()=>setAutoResult(null)} style={{background:"none",border:`1px solid ${C.border}`,color:C.muted,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontSize:10,fontFamily:"sans-serif"}}>Reset</button>
                </div>
              </div>
            )}
          </div>
          <div style={{padding:"8px 10px",borderTop:`1px solid ${C.border}`,flexShrink:0}}>
            <div style={{fontSize:9,color:C.muted,fontFamily:"sans-serif",marginBottom:6}}>QUICK TOOLS</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {[{id:"logline",l:"Logline"},{id:"on_nose",l:"Fix Dialogue"},{id:"storyboard",l:"Storyboard"},{id:"wr_block",l:"Idea Spark"},{id:"breakdown",l:"Breakdown"},{id:"pitch_deck",l:"Pitch Deck"}].map(a=>(
                <button key={a.id} onClick={()=>{setActiveTool(a.id);setMessages([]);setView("tools");}} style={{background:C.card,border:`1px solid ${C.border}`,color:"#9090b8",padding:"5px 4px",borderRadius:4,cursor:"pointer",fontSize:9,fontFamily:"sans-serif"}}>{a.l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`* { box-sizing:border-box; } ::-webkit-scrollbar { width:5px; height:5px; } ::-webkit-scrollbar-track { background:${C.bg}; } ::-webkit-scrollbar-thumb { background:${C.border}; border-radius:3px; } textarea { caret-color:#e8b84b; }`}</style>
    </div>
  );
}
