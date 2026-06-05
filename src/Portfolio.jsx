import React, { useState, useRef, useCallback } from "react";

// ============================================================
// Portfolio — Split Reveal (Flutter Dev / AI Engineer)
// Center info column is FIXED (never wiped). Wipe stage below.
// Flutter side = blue gradient. AI side = purple→gold gradient.
// Dark & light mode. Drag the ⇄ node to wipe.
// ============================================================

const PROFILE = {
  name: "Your Name",
  avatar: "🧑‍💻",
  experience: "2 yrs",
  age: 22,
  education: "International University – HCMIU",
  major: "Information Technology",
  talent: [
    { num: "5", label: "apps on Store" },
    { num: "4", label: "years university" },
    { num: "3", label: "international companies" },
    { num: "2", label: "MVPs built" },
    { num: "1", label: "rule: never quit once started" },
    { num: "0", label: "things impossible" },
  ],
  linkedin: "https://www.linkedin.com/in/quang-minh-tri-nguyen-a4a942275/",
  email: "quangminhtri2003@gmail.com",
};

const B = import.meta.env.BASE_URL;

const FLUTTER_APPS = [
  {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/3d/35/db/3d35dbee-6d16-cfa1-0d15-692cc702da6b/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
    name: "Cleanie", tag: "Phone Storage Cleaner",
    url: "https://apps.apple.com/vn/app/cleanie-phone-storage-cleaner/id6511237599",
    screenshots: [1,2,3,4].map(n => `${B}screenshots/cleanie/${n}.png`),
  },
  {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/7a/11/a9/7a11a99f-4cf5-7d06-899e-110c963af427/AppIcon-0-0-1x_U007emarketing-0-11-0-85-220.png/512x512bb.jpg",
    name: "Alobo", tag: "Sports facility manager",
    url: "https://apps.apple.com/us/app/alobo-qu%E1%BA%A3n-l%C3%BD-s%C3%A2n-th%E1%BB%83-thao/id6479625204",
    screenshots: [],
  },
  {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/36/c0/95/36c09570-e98a-f6a5-a528-6471be627c6b/AppIcon-0-0-1x_U007epad-0-11-0-85-220.png/512x512bb.jpg",
    name: "Vườn Tâm Bách Việt", tag: "Community & education",
    url: "https://apps.apple.com/vn/app/v%C6%B0%E1%BB%9Dn-t%C3%A2m-b%C3%A1ch-vi%E1%BB%87t/id6503827968",
    screenshots: [1,2,3,4].map(n => `${B}screenshots/vuon-tam-bach-viet/${n}.png`),
  },
  {
    icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/50/b8/fa/50b8fa99-74cf-6028-f3c5-eee08ead1dbe/AppIcon-0-0-1x_U007ephone-0-11-0-85-220.png/512x512bb.jpg",
    name: "Bửu Tòa Hoàng Cơ", tag: "Spiritual learning platform",
    url: "https://apps.apple.com/vn/app/b%E1%BB%ADu-t%C3%B2a-ho%C3%A0ng-c%C6%A1-nh%C6%B0-nhi%C3%AAn/id6736351145",
    screenshots: [],
  },
];

const AI_PROJECTS = [
  { tag: "LLM", name: "DocChat RAG", desc: "Retrieval-augmented Q&A over PDFs.", stack: ["LangChain", "FAISS", "FastAPI"] },
  { tag: "CV", name: "LeafScan", desc: "Plant disease classifier, 96% acc.", stack: ["PyTorch", "ONNX"] },
  { tag: "NLP", name: "ToneShift", desc: "Style-transfer for text rewriting.", stack: ["Transformers", "PEFT"] },
];

const EXPERIENCE = [
  {
    company: "Carrots",
    location: "Barcelona, Spain",
    role: "Project Owner · Junior Developer",
    desc: "Productions company based in Barcelona. Responsible for owning the full application — selecting tools, technologies, and architecture independently. Operated as a junior developer with full project ownership.",
    tags: ["Flutter", "Dart", "Firebase", "Project Management"],
    cover: `${B}experience/carrots/cover.jpg`,
    accent: "#FF6B35",
  },
  {
    company: "Alobo",
    location: "Ho Chi Minh City, Vietnam",
    role: "Junior Developer",
    desc: "Vietnamese sports facility booking platform with 300,000+ users across Vietnam. Worked under high pressure with 2-week Agile sprints and demanding Story Point targets.",
    tags: ["Flutter", "Dart", "Agile", "Scrum", "Firebase"],
    cover: `${B}experience/alobo/cover.jpg`,
    accent: "#22C55E",
  },
  {
    company: "SmartOSC",
    location: "Ho Chi Minh City, Vietnam",
    role: "Flutter & AI Intern Developer",
    desc: "Interned on an AI RAG website project built with Flutter Web. Built both backend services and the AI pipeline end-to-end, then deployed the full MVP for the company.",
    tags: ["Flutter Web", "Python", "RAG", "FastAPI", "LangChain"],
    cover: `${B}experience/smartosc/cover.jpg`,
    accent: "#2E8BFF",
  },
];

const BLUE = "linear-gradient(135deg,#2E8BFF 0%,#6FB1FF 50%,#00D4FF 100%)";
const PURPLE = "linear-gradient(135deg,#7C3AED 0%,#A855F7 45%,#FACC15 100%)";
const MIX = "linear-gradient(135deg,#2E8BFF 0%,#A855F7 60%,#FACC15 100%)";

export default function Portfolio() {
  const [theme, setTheme] = useState("dark");
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const stageRef = useRef(null);
  const topRef = useRef(null);

  const isDark = theme === "dark";
  const T = isDark
    ? { bg: "#0B1220", surface: "#141C2E", text: "#F1F5FB", muted: "#94A3B8", border: "#243044" }
    : { bg: "#FFFFFF", surface: "#F4F7FB", text: "#0E1726", muted: "#5A6577", border: "#E2E8F0" };

  const move = useCallback((clientX) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(8, Math.min(92, p)));
  }, []);
  const onDown = (e) => { setDragging(true); move(e.touches ? e.touches[0].clientX : e.clientX); };
  const onMove = (e) => { if (dragging) move(e.touches ? e.touches[0].clientX : e.clientX); };
  const onUp = () => setDragging(false);
  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div ref={topRef} style={{
      width: "100%", minHeight: "100vh", background: T.bg, color: T.text,
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      transition: "background .5s ease, color .5s ease",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body { margin: 0; padding: 0; }
        @keyframes floaty { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(46,139,255,.5)} 50%{box-shadow:0 0 0 18px rgba(46,139,255,0)} }
        @keyframes riseIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { to{transform:rotate(360deg)} }
        @keyframes countPop { 0%{opacity:0;transform:scale(.7)} 60%{transform:scale(1.08)} 100%{opacity:1;transform:scale(1)} }
        .rise { animation: riseIn .7s cubic-bezier(.65,0,.35,1) both; }
        .card { transition: transform .18s ease, box-shadow .18s ease; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(124,58,237,.22); }
        .shot { transition: transform .25s ease; }
        .shot:hover { transform: scale(1.04) rotate(-1deg); }
        .iconbtn { transition: transform .18s ease, box-shadow .18s ease; }
        .iconbtn:hover { transform: translateY(-3px) scale(1.06); box-shadow: 0 10px 26px rgba(124,58,237,.35); }
        .toplink { transition: transform .2s ease, opacity .2s ease; }
        .toplink:hover { transform: translateY(-3px); }
        @keyframes breathe {
          0%,100% { box-shadow: 0 0 8px 2px rgba(124,58,237,.35), 0 0 14px 4px rgba(250,204,21,.15); }
          50%      { box-shadow: 0 0 22px 8px rgba(124,58,237,.65), 0 0 32px 12px rgba(250,204,21,.35); }
        }
        .chip-glow { animation: breathe 2.4s ease-in-out infinite; }
      `}</style>

      <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{
        position: "fixed", top: 20, right: 24, zIndex: 80, padding: "10px 16px",
        borderRadius: 999, cursor: "pointer", border: `1px solid ${T.border}`,
        background: T.surface, color: T.text, fontWeight: 600, fontSize: 14,
      }}>{isDark ? "☀ Light" : "🌙 Dark"}</button>

      {/* ===== TOP: fixed center info column ===== */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", padding: "80px 20px 40px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: MIX, filter: "blur(140px)", opacity: isDark ? .18 : .12, top: "8%" }} />

        <div className="rise" style={{ display: "flex", flexDirection: "column", alignItems: "center",
          gap: 22, textAlign: "center", zIndex: 2 }}>

          <div style={{ position: "relative", animation: "floaty 5s ease-in-out infinite" }}>
            <div style={{ position: "absolute", inset: -6, borderRadius: "50%", background: MIX,
              animation: "spinSlow 8s linear infinite" }} />
            <div style={{ position: "relative", width: 124, height: 124, borderRadius: "50%",
              background: T.surface, display: "grid", placeItems: "center", fontSize: 56,
              border: `3px solid ${T.bg}` }}>{PROFILE.avatar}</div>
          </div>

          <div>
            <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: 34, margin: 0 }}>{PROFILE.name}</h1>
            <p style={{ color: T.muted, margin: "6px 0 0" }}>Flutter Developer · AI Engineer</p>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
            <InfoChip T={T} label="Experience" value={PROFILE.experience} highlight />
            <InfoChip T={T} label="Age" value={PROFILE.age} highlight />
            <InfoChip T={T} label="Education" value={PROFILE.education} subtitle={PROFILE.major} />
          </div>

          {/* contact icons */}
          <div style={{ display: "flex", gap: 14 }}>
            <a className="iconbtn" href={PROFILE.linkedin} target="_blank" rel="noreferrer"
              title="LinkedIn" style={iconBtn("#0A66C2")}>
              <LinkedInIcon />
            </a>
            <a className="iconbtn" href={`mailto:${PROFILE.email}`} title="Gmail" style={iconBtn(MIX)}>
              <GmailIcon />
            </a>
          </div>

          {/* Talent 5..0 */}
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 12, letterSpacing: 3, fontWeight: 600, color: T.muted, marginBottom: 14 }}>
              TALENT IN NUMBERS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, maxWidth: 560 }}>
              {PROFILE.talent.map((t, i) => (
                <div key={i} style={{ animation: `countPop .6s ease both`, animationDelay: `${.3 + i * .12}s` }}>
                  <div style={{ fontFamily: "Sora,sans-serif", fontSize: 40, fontWeight: 800,
                    background: MIX, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {t.num}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, maxWidth: 150, margin: "0 auto" }}>{t.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 18, fontSize: 13, color: T.muted, animation: "floaty 3s ease-in-out infinite" }}>
            ↓ explore my two worlds
          </div>
        </div>
      </section>

      {/* ===== LOWER: wipe stage ===== */}
      <section
        ref={stageRef}
        onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
        onTouchMove={onMove} onTouchEnd={onUp}
        style={{ position: "relative", minHeight: "112vh", overflow: "hidden",
          borderTop: `1px solid ${T.border}`, userSelect: dragging ? "none" : "auto" }}
      >
        <Panel side="left" pos={pos} dragging={dragging}>
          <Hero grad={BLUE} kicker="FLUTTER DEVELOPER" title="I build" highlight="mobile apps"
            sub="Shipping clean, fast Flutter apps to the App Store." />
          <h3 style={h3(T)}>On the App Store</h3>
          <div style={{ display: "grid", gap: 16 }}>
            {FLUTTER_APPS.map((a, i) => (
              <div key={a.name} className="card rise" style={{ ...cardStyle(T), animationDelay: `${.1 + i * .08}s` }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <img src={a.icon} alt={a.name} style={{ width: 56, height: 56, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 17 }}>{a.name}</div>
                    <div style={{ color: T.muted, fontSize: 13 }}>{a.tag}</div>
                  </div>
                  <a href={a.url} target="_blank" rel="noreferrer" style={cta(BLUE)}>Get</a>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 14, overflowX: "auto", paddingBottom: 4 }}>
                  {a.screenshots.length > 0
                    ? a.screenshots.map((src, s) => (
                        <img key={s} src={src} alt={`${a.name} screenshot ${s + 1}`} className="shot"
                          style={{ minWidth: 84, height: 168, borderRadius: 16, flexShrink: 0, objectFit: "cover" }} />
                      ))
                    : Array.from({ length: 4 }).map((_, s) => (
                        <div key={s} className="shot" style={{ minWidth: 84, height: 168, borderRadius: 16, flexShrink: 0,
                          background: `linear-gradient(160deg,${T.surface},${isDark ? "#1d2942" : "#dfeaff"})`,
                          border: `1px solid ${T.border}` }} />
                      ))
                  }
                </div>
              </div>
            ))}
          </div>
          <SkillRow items={["Flutter", "Dart", "Riverpod", "Firebase"]} T={T} />
        </Panel>

        <Panel side="right" pos={pos} dragging={dragging}>
          <Hero grad={PURPLE} align="right" kicker="AI ENGINEER" title="I build" highlight="intelligent systems"
            sub="ML & LLM pipelines that turn data into product." />
          <h3 style={{ ...h3(T), textAlign: "right" }}>Selected work</h3>
          <div style={{ display: "grid", gap: 16 }}>
            {AI_PROJECTS.map((p, i) => (
              <div key={p.name} className="card rise" style={{ ...cardStyle(T), animationDelay: `${.1 + i * .08}s`, textAlign: "right",
                boxShadow: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={pill(PURPLE)}>{p.tag}</span>
                  <span style={{ fontWeight: 700, fontSize: 17 }}>{p.name}</span>
                </div>
                <p style={{ color: T.muted, fontSize: 14, margin: "10px 0" }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  {p.stack.map((s) => (
                    <span key={s} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 999,
                      border: `1px solid ${T.border}`, color: T.muted }}>{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <SkillRow align="right" items={["Python", "PyTorch", "LangChain", "FastAPI"]} T={T} />
        </Panel>

        <div style={{ position: "absolute", top: 0, bottom: 0, left: `${pos}%`, width: 2, background: MIX,
          transform: "translateX(-50%)", zIndex: 40, boxShadow: "0 0 24px 4px rgba(124,58,237,.55)",
          transition: dragging ? "none" : "left .5s cubic-bezier(.65,0,.35,1)" }} />
        <div onMouseDown={onDown} onTouchStart={onDown} style={{
          position: "absolute", top: "50%", left: `${pos}%`, zIndex: 50, transform: "translate(-50%,-50%)",
          width: 72, height: 72, borderRadius: "50%", cursor: "grab", overflow: "hidden",
          display: "flex", border: "3px solid #fff",
          animation: "pulseGlow 2.4s ease-in-out infinite",
          boxShadow: "0 8px 24px rgba(124,58,237,.4)",
          transition: dragging ? "none" : "left .5s cubic-bezier(.65,0,.35,1)" }}>
          {/* left half — Flutter */}
          <div style={{ flex: 1, background: BLUE, display: "grid", placeItems: "center", paddingRight: 4 }}>
            <FlutterIcon />
          </div>
          {/* right half — AI agent */}
          <div style={{ flex: 1, background: PURPLE, display: "grid", placeItems: "center", paddingLeft: 4 }}>
            <AgentIcon />
          </div>
        </div>

        {/* back-to-top navigator */}
        <button onClick={scrollTop} className="toplink" title="Back to intro" style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 70, width: 52, height: 52,
          borderRadius: "50%", border: "none", cursor: "pointer", color: "#fff",
          background: MIX, fontSize: 22, boxShadow: "0 10px 26px rgba(124,58,237,.4)" }}>↑</button>
      </section>

      {/* ===== PAGE 3: Experience ===== */}
      <section style={{ background: T.bg, borderTop: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 96px" }}>
          <div className="rise" style={{ textAlign: "center", marginBottom: 60 }}>
            <div style={{ fontSize: 12, letterSpacing: 4, fontWeight: 600, color: T.muted, marginBottom: 12 }}>
              WORK EXPERIENCE
            </div>
            <h2 style={{ fontFamily: "Sora,sans-serif", fontSize: "clamp(28px,4vw,46px)", margin: 0 }}>
              Where I've{" "}
              <span style={{ background: MIX, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                shipped
              </span>
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            {EXPERIENCE.map((exp, i) => <ExperienceCard key={exp.company} exp={exp} T={T} index={i} />)}
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer style={{ textAlign: "center", padding: "22px 20px 30px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 13, color: T.muted }}>
          © {new Date().getFullYear()} · Built with care by{" "}
          <span style={{ fontWeight: 700, background: MIX, WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent" }}>Minh Tri</span>
        </div>
      </footer>
    </div>
  );
}

function InfoChip({ T, label, value, highlight, logo, subtitle }) {
  return (
    <div className={highlight ? "chip-glow" : ""} style={{
      borderRadius: 14, padding: "12px 18px", minWidth: 96,
      border: "2px solid transparent",
      background: highlight
        ? `linear-gradient(${T.surface}, ${T.surface}) padding-box, linear-gradient(135deg,#7C3AED,#FACC15) border-box`
        : T.surface,
      ...(highlight ? {} : { border: `1px solid ${T.border}` }),
    }}>
      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1 }}>{label.toUpperCase()}</div>
      {logo && (
        <img src={logo} alt={value} style={{ height: 30, marginTop: 6, objectFit: "contain", display: "block" }} />
      )}
      <div style={{ fontWeight: 700, fontSize: logo ? 13 : 16, marginTop: 4 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{subtitle}</div>}
    </div>
  );
}

function Panel({ side, pos, dragging, children }) {
  const isLeft = side === "left";
  const clip = isLeft
    ? `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)`
    : `polygon(${pos}% 0, 100% 0, 100% 100%, ${pos}% 100%)`;
  return (
    <div style={{ position: "absolute", inset: 0, clipPath: clip, display: "flex", justifyContent: "center",
      overflowY: "auto", padding: "80px 6% 220px",
      transition: dragging ? "none" : "clip-path .5s cubic-bezier(.65,0,.35,1)" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>{children}</div>
    </div>
  );
}

function Hero({ kicker, title, highlight, sub, grad, align = "left" }) {
  return (
    <div className="rise" style={{ textAlign: align, marginBottom: 36 }}>
      <div style={{ fontSize: 13, letterSpacing: 3, fontWeight: 600, opacity: .7 }}>{kicker}</div>
      <h1 style={{ fontFamily: "Sora,sans-serif", fontSize: "clamp(26px,3.2vw,40px)", lineHeight: 1.1,
        margin: "10px 0", whiteSpace: "nowrap" }}>
        {title}{" "}
        <span style={{ background: grad, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{highlight}</span>
      </h1>
      <p style={{ opacity: .7, fontSize: 15, maxWidth: 420, marginLeft: align === "right" ? "auto" : 0 }}>{sub}</p>
    </div>
  );
}

function SkillRow({ items, T, align = "left" }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "50px 0",
      justifyContent: align === "right" ? "flex-end" : "flex-start" }}>
      {items.map((s) => (
        <span key={s} style={{ padding: "8px 14px", borderRadius: 999, fontSize: 13, fontWeight: 600,
          border: `1px solid ${T.border}`, background: T.surface }}>{s}</span>
      ))}
    </div>
  );
}

function ExperienceCard({ exp, T, index }) {
  return (
    <div className="rise card" style={{
      display: "grid", gridTemplateColumns: "1fr 1fr",
      borderRadius: 24, overflow: "hidden",
      border: `1px solid ${T.border}`,
      minHeight: 320,
      animationDelay: `${index * 0.15}s`,
    }}>
      {/* Left — company image */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: `linear-gradient(135deg, ${exp.accent}44 0%, ${exp.accent}11 100%)`,
        minHeight: 280,
      }}>
        <img src={exp.cover} alt={exp.company}
          onError={(e) => { e.currentTarget.style.display = "none"; }}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${exp.accent}33 0%, transparent 60%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: 20, left: 20,
          fontSize: 28, fontFamily: "Sora,sans-serif", fontWeight: 800,
          color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.4)",
          letterSpacing: -1,
        }}>{exp.company}</div>
      </div>

      {/* Right — info */}
      <div style={{
        padding: "36px 32px", background: T.surface,
        display: "flex", flexDirection: "column", justifyContent: "center", gap: 12,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 600, color: T.muted }}>
          {exp.location}
        </div>
        <div style={{
          fontFamily: "Sora,sans-serif", fontSize: "clamp(18px,2vw,26px)", fontWeight: 700,
          background: `linear-gradient(135deg,${exp.accent},#fff)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          {exp.role}
        </div>
        <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.75, margin: 0 }}>
          {exp.desc}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
          {exp.tags.map(tag => (
            <span key={tag} style={{
              fontSize: 12, padding: "4px 12px", borderRadius: 999, fontWeight: 600,
              border: `1px solid ${exp.accent}66`,
              color: exp.accent, background: `${exp.accent}18`,
            }}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function FlutterIcon() {
  // simple stylized Flutter chevron mark
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
      <path d="M14.3 2L4 12.3l3.2 3.2L20.7 2zM14.3 11.6l-5.1 5.1 5.1 5.1h6.4l-5.1-5.1 5.1-5.1z"/>
    </svg>
  );
}
function AgentIcon() {
  // simple robot/agent head
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="8" width="14" height="11" rx="3"/>
      <path d="M12 4v4"/>
      <circle cx="12" cy="4" r="1.4" fill="#fff"/>
      <circle cx="9.5" cy="13" r="1.1" fill="#fff" stroke="none"/>
      <circle cx="14.5" cy="13" r="1.1" fill="#fff" stroke="none"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3 0-2.95-1.8-2.95s-2.08 1.4-2.08 2.85V21H9z"/>
    </svg>
  );
}
function GmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff">
      <path d="M2 5.5A1.5 1.5 0 0 1 3.5 4h17A1.5 1.5 0 0 1 22 5.5v13a1.5 1.5 0 0 1-1.5 1.5H3.5A1.5 1.5 0 0 1 2 18.5zM4 7.2v11h16v-11l-8 5.3z"/>
    </svg>
  );
}

const h3 = (T) => ({ fontFamily: "Sora,sans-serif", fontSize: 20, margin: "8px 0 18px", color: T.text });
const cardStyle = (T) => ({ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 18 });
const cta = (grad) => ({ padding: "8px 18px", borderRadius: 999, border: "none", color: "#fff", background: grad, fontWeight: 700, cursor: "pointer", fontSize: 13 });
const pill = (grad) => ({ fontSize: 11, fontWeight: 700, color: "#fff", padding: "4px 10px", borderRadius: 999, background: grad });
const iconBtn = (bg) => ({ width: 46, height: 46, borderRadius: 14, background: bg, display: "grid",
  placeItems: "center", textDecoration: "none", cursor: "pointer" });
