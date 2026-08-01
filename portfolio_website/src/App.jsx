import React, { useEffect, useRef, useState } from "react";

const TERMINAL_LINES = [
  { text: "> running test_suite.rafeh", cls: "cmd" },
  { text: "  ✓ backend.build(go, django, react) ...... PASS", cls: "ok" },
  { text: "  ✓ ai.integrate(langchain, rag, nlp) ...... PASS", cls: "ok" },
  { text: "  ✓ qa.test_cases(functional, regression) .. PASS", cls: "ok" },
  { text: "  • ace_money_transfer.onboarding() ......... IN PROGRESS", cls: "pending" },
  { text: "> 3 passed, 1 pending in 0.38s", cls: "cmd" },
];
const TERMINAL_PAUSES = [350, 260, 260, 260, 350, 0];

function useTypedTerminal() {
  const [shown, setShown] = useState([]);
  const [done, setDone] = useState(false);
  const reduceMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const nextIndex = useRef(0);

  useEffect(() => {
    if (reduceMotion.current) {
      setShown(TERMINAL_LINES);
      setDone(true);
      return;
    }
    let timer;
    const step = () => {
      const line = TERMINAL_LINES[nextIndex.current];
      if (!line) {
        setDone(true);
        return;
      }
      setShown((prev) => [...prev, line]);
      const pause = TERMINAL_PAUSES[nextIndex.current];
      nextIndex.current += 1;
      if (nextIndex.current < TERMINAL_LINES.length) {
        timer = setTimeout(step, pause);
      } else {
        setDone(true);
      }
    };
    timer = setTimeout(step, 300);
    return () => clearTimeout(timer);
  }, []);

  return { shown, done };
}

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, visible];
}

function Card({ children, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div ref={ref} className={`card ${visible ? "card--in" : ""} ${className}`}>
      <span className="card__corner card__corner--tl" />
      <span className="card__corner card__corner--tr" />
      <span className="card__corner card__corner--bl" />
      <span className="card__corner card__corner--br" />
      {children}
    </div>
  );
}

function Status({ kind, children }) {
  return (
    <span className={`status status--${kind}`}>
      <span className="status__dot" />
      {children}
    </span>
  );
}

function SectionHead({ children }) {
  return (
    <div className="section__head">
      <h2 className="section__title">{children}</h2>
      <span className="section__rule" />
    </div>
  );
}

function Tag({ children, learning }) {
  return <span className={`tag ${learning ? "tag--learning" : ""}`}>{children}</span>;
}

export default function RafehPortfolio() {
  const { shown, done } = useTypedTerminal();

  return (
    <div className="rp">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

        .rp, .rp *, .rp *::before, .rp *::after{ box-sizing:border-box; }

        .rp{
          --text: #9ca3af;
          --text-h: #f8fafc;
          --bg: #081124;
          --bg-panel: #0f1c38;
          --bg-panel-2: #142650;
          --surface: rgba(255, 255, 255, 0.05);
          --surface-strong: rgba(255, 255, 255, 0.09);
          --border: rgba(255, 255, 255, 0.14);
          --shadow: rgba(0, 0, 0, 0.4) 0 25px 70px -30px;
          --accent: #ffb627;
          --accent-soft: rgba(255, 182, 39, 0.14);
          --accent-border: rgba(255, 182, 39, 0.3);
          --mint: #4fd1ae;
          --coral: #ff6b5e;

          --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
          --mono: 'IBM Plex Mono', ui-monospace, Consolas, monospace;

          background: var(--bg);
          color: var(--text);
          font: 16px/1.75 var(--sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .rp::before{
          content:'';
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image:
            radial-gradient(circle at 12% 8%, rgba(255,182,39,0.10), transparent 32%),
            radial-gradient(circle at 88% 92%, rgba(79,209,174,0.09), transparent 30%),
            repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 34px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 34px);
        }

        .rp a{ color:inherit; text-decoration:none; }
        .rp ::selection{ background: var(--accent); color: var(--bg); }

        .rp__inner{ position:relative; z-index:1; }
        .container{ width:min(1080px, 100%); max-width:100%; margin:0 auto; padding:0 24px; }

        /* NAV */
        .nav{
          position:fixed; top:0; left:0; right:0; z-index:50;
          background: rgba(8,17,36,0.82);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid var(--border);
        }
        .nav__inner{
          width:min(1080px, 100%); max-width:100%; margin:0 auto; padding:16px 24px;
          display:flex; align-items:center; justify-content:space-between; gap:16px;
        }
        .nav__logo{ font-family: var(--mono); font-weight:700; font-size:14px; letter-spacing:0.03em; color:var(--text-h); }
        .nav__logo span{ color:var(--accent); }
        .nav__links{ display:flex; gap:26px; flex-wrap:wrap; }
        .nav__links a{
          font-family: var(--mono); font-size:11.5px; letter-spacing:0.08em; text-transform:uppercase;
          color:var(--text); transition: color .2s ease;
        }
        .nav__links a:hover{ color: var(--accent); }
        .nav__cta{
          font-family: var(--mono); font-size:12px; letter-spacing:0.04em;
          border:1px solid var(--mint); color:var(--mint); padding:8px 16px; border-radius:999px;
          transition: all .2s ease; white-space:nowrap;
        }
        .nav__cta:hover{ background: var(--mint); color: var(--bg); }

        /* HERO */
        .hero{ padding:158px 0 88px; }
        .eyebrow{
          font-family: var(--mono); font-size:11.5px; letter-spacing:0.14em; text-transform:uppercase;
          color: var(--mint); display:flex; align-items:center; gap:10px; margin-bottom:22px;
        }
        .eyebrow__dot{
          width:8px; height:8px; border-radius:50%; background:var(--mint); flex-shrink:0;
          box-shadow: 0 0 0 4px rgba(79,209,174,0.16);
        }
        .hero h1{
          font-family: var(--mono); font-weight:700; color: var(--text-h);
          font-size: clamp(38px, 6.4vw, 76px); letter-spacing:-0.02em; line-height:1.04; margin:0 0 20px;
        }
        .hero__lead{
          font-size: clamp(16px, 2.1vw, 20px); color: var(--text); max-width:680px; margin:0 0 8px;
        }
        .hero__lead b{ color: var(--accent); font-weight:600; }
        .hero__objective{
          font-family: var(--mono); font-size:13px; line-height:1.85; color: var(--text);
          max-width:600px; border-left:2px solid var(--border); padding-left:18px; margin:34px 0 38px;
        }
        .hero__objective b{ color: var(--accent); font-weight:600; }
        .hero__ctas{ display:flex; gap:14px; flex-wrap:wrap; margin-bottom:56px; }

        .btn{
          font-family: var(--mono); font-size:13px; letter-spacing:0.03em;
          padding:14px 26px; border-radius:999px; border:1px solid transparent;
          transition: all .2s ease; display:inline-flex; align-items:center;
        }
        .btn--primary{ background: var(--accent); color: var(--bg); font-weight:600; }
        .btn--primary:hover{ background:#ffc55c; transform: translateY(-1px); }
        .btn--ghost{ border-color: var(--border); color: var(--text-h); }
        .btn--ghost:hover{ border-color: var(--text); transform: translateY(-1px); }

        /* TERMINAL */
        .terminal{
          max-width:600px; font-family: var(--mono); font-size:13px;
          background: var(--bg-panel); border:1px solid var(--border); border-radius:16px;
          box-shadow: var(--shadow); overflow:hidden;
        }
        .terminal__bar{
          display:flex; align-items:center; gap:7px; padding:12px 16px;
          background: var(--bg-panel-2); border-bottom:1px solid var(--border);
        }
        .terminal__dot{ width:9px; height:9px; border-radius:50%; }
        .terminal__title{ margin-left:8px; color: var(--text); font-size:11px; }
        .terminal__body{ padding:20px; min-height:168px; color: var(--text); }
        .terminal__body div{ margin-bottom:6px; white-space:pre; overflow-x:auto; }
        .term-ok{ color: var(--mint); }
        .term-pending{ color: var(--accent); }
        .term-cmd{ color: var(--text-h); }
        .caret{
          display:inline-block; width:7px; height:14px; background: var(--accent);
          vertical-align:middle; animation: blink 1s steps(1) infinite;
        }
        @keyframes blink{ 50%{ opacity:0; } }

        /* SECTIONS */
        section{ padding:64px 0; }
        .section__head{ display:flex; align-items:baseline; gap:16px; margin-bottom:36px; }
        .section__title{
          font-family: var(--mono); font-weight:700; font-size: clamp(20px, 3vw, 27px);
          text-transform:uppercase; letter-spacing:0.03em; color: var(--text-h); margin:0;
        }
        .section__rule{ flex:1; height:1px; background: var(--border); }

        /* CARD */
        .card{
          position:relative; background: var(--surface); border:1px solid var(--border);
          border-radius:18px; padding:28px 30px; margin-bottom:18px; box-shadow: var(--shadow);
          opacity:0; transform: translateY(14px); transition: opacity .5s ease, transform .5s ease, border-color .2s ease;
        }
        .card--in{ opacity:1; transform: translateY(0); }
        .card:hover{ border-color: rgba(255,255,255,0.24); }
        .card__corner{ position:absolute; width:14px; height:14px; pointer-events:none; }
        .card__corner--tl{ top:-1px; left:-1px; border-top:2px solid var(--accent); border-left:2px solid var(--accent); border-top-left-radius:8px; }
        .card__corner--tr{ top:-1px; right:-1px; border-top:2px solid var(--accent); border-right:2px solid var(--accent); border-top-right-radius:8px; }
        .card__corner--bl{ bottom:-1px; left:-1px; border-bottom:2px solid var(--accent); border-left:2px solid var(--accent); border-bottom-left-radius:8px; }
        .card__corner--br{ bottom:-1px; right:-1px; border-bottom:2px solid var(--accent); border-right:2px solid var(--accent); border-bottom-right-radius:8px; }

        .field{ font-family: var(--mono); font-size:11px; letter-spacing:0.08em; text-transform:uppercase; color: var(--text); margin-bottom:12px; }
        .field b{ color: var(--mint); font-weight:600; }

        /* GRIDS */
        .grid-3{ display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; }
        .grid-2{ display:grid; grid-template-columns: repeat(2, 1fr); gap:18px; }
        @media (max-width: 860px){ .grid-3, .grid-2{ grid-template-columns: 1fr; } }

        /* PILLARS */
        .pillar__num{ font-family: var(--mono); font-size:11px; letter-spacing:0.1em; color: var(--mint); margin-bottom:12px; }
        .pillar__title{ font-family: var(--mono); font-weight:700; font-size:19px; color: var(--text-h); margin:0 0 12px; }
        .pillar__body{ font-size:14px; color: var(--text); margin:0 0 18px; }

        /* PROFILE */
        .profile__body{ font-size:16px; color: var(--text); max-width:720px; margin:0; }
        .profile__body b{ color: var(--text-h); font-weight:600; }

        /* SKILLS */
        .skill__title{ font-family: var(--mono); font-size:12px; color: var(--accent); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:14px; }
        .tag-row{ display:flex; flex-wrap:wrap; gap:9px; }
        .tag{
          font-family: var(--mono); font-size:12px; color: var(--text-h); border:1px solid var(--border);
          padding:6px 12px; border-radius:8px; background: var(--surface);
        }
        .tag--learning{ color: var(--text); border-style:dashed; background:transparent; }
        .tag--learning::after{ content:'learning'; font-size:9px; color: var(--accent); margin-left:6px; }

        /* STATUS */
        .status{
          display:inline-flex; align-items:center; gap:6px; font-family: var(--mono); font-size:11px;
          letter-spacing:0.06em; padding:5px 12px; text-transform:uppercase; font-weight:600;
          border-radius:999px; white-space:nowrap;
        }
        .status--pass{ color: var(--mint); border:1px solid var(--mint); background: rgba(79,209,174,0.08); }
        .status--progress{ color: var(--accent); border:1px solid var(--accent); background: var(--accent-soft); }
        .status--starting{ color: var(--coral); border:1px solid var(--coral); background: rgba(255,107,94,0.08); }
        .status__dot{ width:6px; height:6px; border-radius:50%; background: currentColor; flex-shrink:0; }

        /* EXPERIENCE */
        .exp__row{ display:flex; justify-content:space-between; align-items:flex-start; gap:16px; flex-wrap:wrap; margin-bottom:10px; }
        .exp__role{ font-family: var(--mono); font-weight:700; font-size:16px; color: var(--text-h); }
        .exp__org{ color: var(--accent); font-weight:600; }
        .exp__date{ font-family: var(--mono); font-size:11px; color: var(--text); margin-bottom:14px; }
        .bullets{ list-style:none; margin:0; padding:0; }
        .bullets li{ position:relative; padding-left:20px; margin-bottom:8px; color: var(--text); font-size:14.5px; }
        .bullets li::before{ content:'›'; position:absolute; left:0; color: var(--mint); font-family: var(--mono); }

        /* PROJECTS */
        .proj__head{ display:flex; justify-content:space-between; align-items:flex-start; gap:14px; flex-wrap:wrap; margin-bottom:8px; }
        .proj__title{ font-family: var(--mono); font-weight:700; font-size:17px; color: var(--text-h); }
        .proj__stack{ font-family: var(--mono); font-size:11px; color: var(--text); margin-bottom:16px; }
        .qa-note{
          background: var(--accent-soft); border-left:2px solid var(--accent); border-radius:0 10px 10px 0;
          padding:14px 18px; margin-top:16px; font-size:13.5px; color: var(--text);
        }
        .qa-note__label{ font-family: var(--mono); font-size:11px; color: var(--accent); text-transform:uppercase; letter-spacing:0.06em; display:block; margin-bottom:6px; }

        /* EDUCATION */
        .edu__row{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; }
        .edu__title{ font-family: var(--mono); font-weight:700; font-size:16px; color: var(--text-h); }
        .edu__sub{ color: var(--text); font-size:14px; margin-top:6px; }
        .gpa{ font-family: var(--mono); font-size:13px; color: var(--mint); border:1px solid var(--mint); padding:7px 16px; border-radius:999px; white-space:nowrap; }

        /* CONTACT */
        .contact-item{ display:block; }
        .contact-k{ font-family: var(--mono); font-size:11px; color: var(--mint); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:8px; }
        .contact-v{ font-size:15px; color: var(--text-h); transition: color .2s ease; }
        .contact-item:hover .contact-v{ color: var(--accent); }

        footer{ padding:48px 0 64px; text-align:center; }
        footer p{ font-family: var(--mono); font-size:11px; color: var(--text); letter-spacing:0.04em; margin:0; }

        @media (max-width: 760px){
          .nav__links{ display:none; }
          .exp__row, .proj__head, .edu__row{ flex-direction:column; align-items:flex-start; }
        }
        @media (prefers-reduced-motion: reduce){
          html{ scroll-behavior:auto; }
          .card{ transition:none; }
          .caret{ animation:none; }
        }
      `}</style>

      <div className="rp__inner">
        <header className="nav">
          <div className="nav__inner">
            <div className="nav__logo">RAFEH<span>.DEV</span></div>
            <nav className="nav__links">
              {["Focus", "Profile", "Skills", "Experience", "Projects", "Education"].map((l) => (
                <a key={l} href={`#${l.toLowerCase()}`}>{l}</a>
              ))}
            </nav>
            <a className="nav__cta" href="#contact">Contact</a>
          </div>
        </header>

        <div className="container">
          {/* HERO */}
          <section className="hero">
            <div className="eyebrow">
              <span className="eyebrow__dot" />
              open to work · QA · full-stack · AI/ML
            </div>
            <h1>Muhammad Rafeh</h1>
            <p className="hero__lead">
              Software Engineering graduate who builds full-stack apps in <b>Go, Python and React</b>, wires up{" "}
              <b>AI/LLM</b> features with LangChain and RAG, and tests all of it as an incoming{" "}
              <b>SQA Engineer Intern at Ace Money Transfer</b>.
            </p>

            <div className="hero__objective">
              <b>OBJECTIVE —</b> ship software that works, and be able to prove it works. Comfortable across the
              full loop: building the feature, wiring up the AI behavior behind it, and then breaking both on
              purpose with structured test cases, regression passes and tracked defects in Jira.
            </div>

            <div className="hero__ctas">
              <a className="btn btn--primary" href="#contact">Get in touch</a>
              <a className="btn btn--ghost" href="#projects">See the work</a>
            </div>

            <div className="terminal">
              <div className="terminal__bar">
                <span className="terminal__dot" style={{ background: "var(--coral)" }} />
                <span className="terminal__dot" style={{ background: "var(--accent)" }} />
                <span className="terminal__dot" style={{ background: "var(--mint)" }} />
                <span className="terminal__title">run — test_suite.rafeh</span>
              </div>
              <div className="terminal__body">
                {shown.map((line, idx) => (
                  <div key={idx} className={`term-${line.cls}`}>{line.text}</div>
                ))}
                {done && <span className="caret" />}
              </div>
            </div>
          </section>

          {/* CORE FOCUS */}
          <section id="focus">
            <SectionHead>Core Focus</SectionHead>
            <div className="grid-3">
              <Card>
                <div className="pillar__num">01</div>
                <h3 className="pillar__title">Development</h3>
                <p className="pillar__body">Go and Django on the backend, React and React Native on the front. Full-stack apps built end to end — auth, APIs, data, UI.</p>
                <div className="tag-row"><Tag>Go</Tag><Tag>Django</Tag><Tag>React</Tag></div>
              </Card>
              <Card>
                <div className="pillar__num">02</div>
                <h3 className="pillar__title">AI / LLM</h3>
                <p className="pillar__body">Conversational and recommendation systems built with LangChain, RAG and NLP — chatbots, moderation models, transcript-aware assistants.</p>
                <div className="tag-row"><Tag>LangChain</Tag><Tag>RAG</Tag><Tag>NLP</Tag></div>
              </Card>
              <Card>
                <div className="pillar__num">03</div>
                <h3 className="pillar__title">QA Engineering</h3>
                <p className="pillar__body">Manual test case design, functional and regression testing, and defect tracking through Jira — now applied at Ace Money Transfer.</p>
                <div className="tag-row"><Tag>Test Design</Tag><Tag>Regression</Tag><Tag>Jira</Tag></div>
              </Card>
            </div>
          </section>

          {/* PROFILE */}
          <section id="profile">
            <SectionHead>Profile</SectionHead>
            <Card>
              <div className="field"><b>OBJECTIVE</b> / who this is</div>
              <p className="profile__body">
                Fresh <b>Software Engineering</b> graduate from NUML (GPA 3.7/4.0), about to start as an{" "}
                <b>SQA Engineer Intern at Ace Money Transfer</b>. My project history runs across three lanes at
                once — Go and Django backends, React and React Native frontends, and a run of AI/LLM projects
                using LangChain and RAG — and I test all of it the same way: structured test cases, functional
                and regression passes, and defects tracked through Jira. Looking to bring that build-and-verify
                habit to a fast-growing fintech product team.
              </p>
            </Card>
          </section>

          {/* SKILLS */}
          <section id="skills">
            <SectionHead>Skills</SectionHead>
            <div className="grid-2">
              <Card>
                <div className="skill__title">Languages &amp; Backend</div>
                <div className="tag-row">
                  <Tag>Go</Tag><Tag>Python</Tag><Tag>JavaScript</Tag><Tag>SQL</Tag>
                  <Tag>Gin</Tag><Tag>Django</Tag><Tag>REST APIs</Tag><Tag>Swagger / OpenAPI</Tag>
                </div>
              </Card>
              <Card>
                <div className="skill__title">Frontend &amp; Data</div>
                <div className="tag-row">
                  <Tag>React</Tag><Tag>React Native</Tag><Tag>MongoDB</Tag><Tag>MySQL</Tag>
                </div>
              </Card>
              <Card>
                <div className="skill__title">AI / ML</div>
                <div className="tag-row">
                  <Tag>LangChain</Tag><Tag>RAG</Tag><Tag>NLP</Tag><Tag>LLM Integration</Tag><Tag>HF Inference Pipelines</Tag>
                </div>
              </Card>
              <Card>
                <div className="skill__title">Testing &amp; QA</div>
                <div className="tag-row">
                  <Tag>SDLC</Tag><Tag>STLC</Tag><Tag>Test Case Design</Tag><Tag>Functional Testing</Tag>
                  <Tag>Regression Testing</Tag><Tag>Smoke Testing</Tag><Tag>Bug Life Cycle</Tag><Tag>Jira</Tag><Tag>Git</Tag>
                  <Tag learning>TestRail</Tag><Tag learning>Katalon Studio</Tag><Tag learning>Appium</Tag>
                </div>
              </Card>
            </div>
          </section>

          {/* EXPERIENCE */}
          <section id="experience">
            <SectionHead>Experience</SectionHead>

            <Card>
              <div className="exp__row">
                <div className="exp__role">SQA Engineer Intern — <span className="exp__org">Ace Money Transfer</span></div>
                <Status kind="starting">starting soon</Status>
              </div>
              <div className="exp__date">Fintech product team</div>
              <ul className="bullets">
                <li>Bringing a quality-first perspective to a fintech product, backed by hands-on manual testing and full-stack build experience.</li>
              </ul>
            </Card>

            <Card>
              <div className="exp__row">
                <div className="exp__role">Full-Stack (MERN) Trainee — <span className="exp__org">Dev Weekend Fellowship</span></div>
                <Status kind="pass">completed</Status>
              </div>
              <div className="exp__date">06/2025 – 09/2025 · Remote / Islamabad</div>
              <ul className="bullets">
                <li>Completed an intensive full-stack program covering MongoDB, Express, React and Node.js.</li>
                <li>Built and deployed full-stack applications from scratch, applying Git-based version control in a team workflow.</li>
              </ul>
            </Card>

            <Card>
              <div className="exp__row">
                <div className="exp__role">Internship Assignment — <span className="exp__org">"Sentinel" AI Content Moderation Platform</span></div>
                <Status kind="pass">completed</Status>
              </div>
              <div className="exp__date">3-day build · Go, MongoDB, React</div>
              <ul className="bullets">
                <li>Built a full-stack AI content moderation platform in a compressed 3-day window.</li>
                <li>Debugged Hugging Face inference pipelines and integrated a multimodal vision LLM.</li>
              </ul>
            </Card>

            <Card>
              <div className="exp__row">
                <div className="exp__role">Manual QA — <span className="exp__org">Fintech app (Flutter)</span></div>
                <Status kind="progress">ongoing</Status>
              </div>
              <div className="exp__date">Team project</div>
              <ul className="bullets">
                <li>Performing manual testing on a live Flutter-based fintech application alongside the development team.</li>
              </ul>
            </Card>
          </section>

          {/* PROJECTS */}
          <section id="projects">
            <SectionHead>Projects</SectionHead>

            <Card>
              <div className="proj__head">
                <div className="proj__title">AdWiseGPT — AI Recommendation Chatbot</div>
                <Status kind="progress">in progress</Status>
              </div>
              <div className="proj__stack">Python · LangChain · NLP · Final Year Project · 09/2025 – 04/2026</div>
              <ul className="bullets">
                <li>Designing a conversational AI chatbot integrated with a contextual recommendation engine for personalized ad and content delivery.</li>
                <li>Implementing NLP-based intent processing and a dynamic suggestion engine for real-time recommendations.</li>
                <li>Architecting a scalable backend to support concurrent real-time user interactions.</li>
              </ul>
              <div className="qa-note">
                <span className="qa-note__label">QA pass</span>
                Wrote and executed manual test cases for response accuracy, recommendation logic and edge-case inputs; ran functional and regression testing each dev cycle; logged and tracked defects in Jira.
              </div>
            </Card>

            <Card>
              <div className="proj__head">
                <div className="proj__title">Sentinel — AI Content Moderation Platform</div>
                <Status kind="pass">shipped</Status>
              </div>
              <div className="proj__stack">Go · Gin · React · MongoDB · AI Models</div>
              <ul className="bullets">
                <li>Built an AI-powered platform to automatically detect and classify inappropriate image content.</li>
                <li>Implemented classification across categories such as graphic violence, hate symbols, self-harm imagery, extremist content, weapons and harassment, using pre-trained AI models.</li>
                <li>Go (Gin) backend with a React frontend, integrated AI inference for automated moderation workflows.</li>
              </ul>
              <div className="qa-note">
                <span className="qa-note__label">QA pass</span>
                Functional and exploratory testing of uploads, classification, API responses and error handling; documented defects with full repro steps.
              </div>
            </Card>

            <Card>
              <div className="proj__head">
                <div className="proj__title">E-Commerce Platform</div>
                <Status kind="progress">in progress</Status>
              </div>
              <div className="proj__stack">Go · REST APIs · Swagger · 12/2025 – Present</div>
              <ul className="bullets">
                <li>Full-stack e-commerce app with secure authentication, product management, cart and order handling.</li>
                <li>RESTful APIs documented with Swagger for streamlined testing and integration.</li>
              </ul>
              <div className="qa-note">
                <span className="qa-note__label">QA pass</span>
                Manual test cases across auth, cart, checkout and order flows; functional, smoke and regression testing before and after each release; validated API responses against the Swagger spec.
              </div>
            </Card>

            <Card>
              <div className="proj__head">
                <div className="proj__title">YouTube Video Assistant Bot</div>
                <Status kind="pass">shipped</Status>
              </div>
              <div className="proj__stack">Python · LLMs · Browser Extension · 05/2026 – 06/2026</div>
              <ul className="bullets">
                <li>AI-powered chatbot that lets users converse with YouTube video content using LLMs.</li>
                <li>Extracts and processes video transcripts to generate accurate, context-aware responses.</li>
                <li>Browser extension for in-page access — real-time interaction without leaving the video.</li>
              </ul>
            </Card>

            <Card>
              <div className="proj__head">
                <div className="proj__title">Emergency Incident Management Platform</div>
                <Status kind="progress">in progress</Status>
              </div>
              <div className="proj__stack">Go · MongoDB · React Native · Concept build</div>
              <ul className="bullets">
                <li>Connects bystanders, hospitals, ambulances, police and rescue services through one system, sharing a single incident ID.</li>
                <li>Voice-to-incident AI reporting and real-time GPS tracking.</li>
                <li>Auth module complete (register, login, refresh, update, delete); incident module complete (create, get, update status, MLC auto-generation, PK-YYYY-XXXXXX incident codes); hospital module next.</li>
              </ul>
            </Card>
          </section>

          {/* EDUCATION */}
          <section id="education">
            <SectionHead>Education</SectionHead>
            <Card>
              <div className="edu__row">
                <div>
                  <div className="edu__title">Bachelor of Software Engineering</div>
                  <div className="edu__sub">National University of Modern Languages (NUML) · 06/2026</div>
                </div>
                <span className="gpa">GPA 3.7 / 4.0</span>
              </div>
            </Card>
          </section>

          {/* CONTACT */}
          <section id="contact">
            <SectionHead>Contact</SectionHead>
            <Card>
              <div className="grid-3">
                <a className="contact-item" href="mailto:rafehm41@gmail.com">
                  <div className="contact-k">Email</div>
                  <div className="contact-v">rafehm41@gmail.com</div>
                </a>
                <a className="contact-item" href="tel:+923425720578">
                  <div className="contact-k">Phone</div>
                  <div className="contact-v">0342-5720578</div>
                </a>
                <a className="contact-item" href="https://linkedin.com/in/rafeh-malik" target="_blank" rel="noopener noreferrer">
                  <div className="contact-k">LinkedIn</div>
                  <div className="contact-v">linkedin.com/in/rafeh-malik</div>
                </a>
                <a className="contact-item" href="https://github.com/RafehMalik" target="_blank" rel="noopener noreferrer">
                  <div className="contact-k">GitHub</div>
                  <div className="contact-v">github.com/RafehMalik</div>
                </a>
                <div className="contact-item">
                  <div className="contact-k">Location</div>
                  <div className="contact-v">Islamabad, Pakistan</div>
                </div>
              </div>
            </Card>
          </section>

          <footer>
            <p>// built &amp; verified by Muhammad Rafeh — every section above passed review</p>
          </footer>
        </div>
      </div>
    </div>
  );
}