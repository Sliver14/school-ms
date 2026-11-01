'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


/* Placeholder student illustration used inside hero pills.
   To use real photos, set `img` on any item in `heroCols` (e.g. '/images/students/robotics.jpg'). */
function Student({ skin, hair, shirt }) {
  return (
    <svg className="rh-student" viewBox="0 0 120 160" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <path d="M8 160c0-36 23-54 52-54s52 18 52 54z" fill={shirt} />
      <rect x="52" y="84" width="16" height="28" rx="8" fill={skin} />
      <circle cx="60" cy="62" r="28" fill={skin} />
      <path d="M30 62c-2-26 13-38 30-38s32 12 30 38c-8-13-18-18-30-18s-22 5-30 18z" fill={hair} />
      <circle cx="50" cy="65" r="2.6" fill="#2a1b17" />
      <circle cx="70" cy="65" r="2.6" fill="#2a1b17" />
      <path d="M51 77q9 9 18 0" stroke="#2a1b17" strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap');
.rh{--bg:#15121c;--bg2:#1b1725;--card:#221d2e;--line:rgba(255,255,255,.1);--text:#f6f3fa;--muted:#aaa4ba;--yellow:#ffc21a;--sky:#3aa4f7;--coral:#ff5c5c;--mint:#3dc46a;--lilac:#a08de0;--orange:#ff7a1a;--teal:#7fd8d3;--blue:#2f5bd6;--disp:'Bricolage Grotesque','Figtree',system-ui,sans-serif;--body:'Figtree',system-ui,sans-serif;background:var(--bg);color:var(--text);font:400 16px/1.6 var(--body);min-height:100vh;overflow-x:hidden}
.rh *,.rh *::before,.rh *::after{box-sizing:border-box}
.rh h1,.rh h2,.rh h3,.rh h4,.rh p,.rh ul{margin:0;padding:0}
.rh a{color:inherit;text-decoration:none}
.rh button{font:inherit;color:inherit;cursor:pointer;border:0;background:none}
.rh :focus-visible{outline:3px solid var(--yellow);outline-offset:3px}
.rh-wrap{max-width:1240px;margin:0 auto;padding:0 28px}

/* buttons */
.rh-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;padding:12px 26px;font-weight:700;font-size:15px;line-height:1.2;transition:transform .15s,filter .15s}
.rh-btn:hover{transform:translateY(-1px);filter:brightness(1.08)}
.rh-btn.sky{background:var(--sky);color:#08192b}
.rh-btn.yellow{background:var(--yellow);color:#201600}
.rh-btn.white{background:#fff;color:#15121c}
.rh-btn.dark{background:#2b2536;color:var(--text);border:1px solid var(--line)}
.rh-btn.sm{padding:9px 18px;font-size:14px}
.rh-btn.lg{padding:15px 32px;font-size:16px}

/* header */
.rh-head{position:sticky;top:0;z-index:50;background:rgba(21,18,28,.88);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--line);box-shadow:0 4px 20px rgba(0,0,0,.35)}
.rh-head .rh-wrap{display:flex;align-items:center;gap:24px;padding-top:12px;padding-bottom:12px}
.rh-brand{display:flex;align-items:center;gap:12px}
.rh-badge{width:42px;height:42px;border-radius:50%;background:var(--yellow);color:#201600;font:800 16px var(--disp);display:grid;place-items:center;flex:none;box-shadow:0 2px 10px rgba(255,194,26,.3)}
.rh-brand strong{display:block;font:700 18px/1.1 var(--disp);color:#fff}
.rh-brand small{color:var(--muted);font-size:12px}
.rh-menu{display:flex;gap:6px;margin-left:auto;align-items:center}
.rh-menu a{padding:8px 14px;border-radius:999px;font-size:14px;font-weight:600;color:#d6d1e2;transition:all .18s ease;text-decoration:none}
.rh-menu a:hover{background:rgba(255,255,255,.08);color:#fff}
.rh-actions{display:flex;gap:10px;align-items:center}

/* hero */
.rh-hero{position:relative;overflow:hidden;background:radial-gradient(900px 520px at 0% 0%,rgba(120,92,165,.55),transparent 62%),radial-gradient(700px 460px at 100% 100%,rgba(70,50,110,.5),transparent 65%),var(--bg)}
.rh-hero .rh-wrap{display:grid;grid-template-columns:1.08fr 1fr;gap:32px;align-items:center;min-height:700px}
.rh-hero-copy{position:relative;padding:56px 0;z-index:2}
.rh-hero h1{font:800 clamp(40px,5.4vw,70px)/1.04 var(--disp);letter-spacing:-.02em;max-width:13ch}
.rh-hero-copy>p{margin-top:22px;color:#d6d1e2;font-size:18px;max-width:46ch}
.rh-cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:32px}
.rh-path{margin-top:48px}
.rh-path h3{font:700 19px var(--disp)}
.rh-path>p{color:var(--muted);font-size:14px;margin-top:2px}
.rh-chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
.rh-chip{border:1px solid var(--line);border-radius:999px;padding:10px 18px;font-weight:600;font-size:15px;background:rgba(255,255,255,.04);transition:background .15s,color .15s}
.rh-chip span{color:var(--muted);font-weight:500;margin-left:6px;font-size:13px}
.rh-chip:hover{background:var(--yellow);color:#201600;border-color:var(--yellow)}
.rh-chip:hover span{color:#4a3600}
.rh-proof{display:flex;flex-wrap:wrap;gap:10px 24px;margin-top:30px;color:var(--muted);font-size:14px}
.rh-proof div{display:flex;align-items:center;gap:8px}
.rh-proof svg{color:var(--yellow);flex:none}
.rh-dot{position:absolute;border-radius:50%;z-index:1}
.rh-cols{--tall:340px;--short:224px;position:relative;display:grid;grid-template-columns:repeat(3,1fr);gap:16px;height:660px;overflow:hidden;align-self:stretch;padding:0 4px}
.rh-col{display:flex;flex-direction:column;gap:16px}
.rh-col:nth-child(1){margin-top:48px}
.rh-col:nth-child(2){margin-top:-72px}
.rh-col:nth-child(3){margin-top:96px}
.rh-pill{position:relative;border-radius:999px;overflow:hidden;opacity:0;animation:rh-rise .9s cubic-bezier(.2,.7,.2,1) forwards;flex:none}
.rh-pill.tall{height:var(--tall)}
.rh-pill.short{height:var(--short)}
.rh-pill img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.rh-student{position:absolute;left:0;bottom:0;width:100%;height:78%}
.rh-tag{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);background:rgba(21,18,28,.88);backdrop-filter:blur(6px);color:var(--text);border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;white-space:nowrap}
@keyframes rh-rise{from{opacity:0;transform:translateY(48px)}to{opacity:1;transform:none}}

/* sections */
.rh-sec{padding:96px 0}
.rh-sec.alt{background:var(--bg2)}
.rh-sec-head{margin-bottom:40px}
.rh-sec-head h2{font:800 clamp(30px,4vw,46px)/1.1 var(--disp);letter-spacing:-.015em;max-width:20ch}
.rh-sec-head p{color:var(--muted);margin-top:14px;max-width:60ch;font-size:17px}

/* stats */
.rh-stats{background:var(--bg2);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:56px 0}
.rh-stats .rh-wrap{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:36px}
.rh-stat b{display:block;font:800 clamp(38px,4.4vw,56px)/1 var(--disp);letter-spacing:-.02em}
.rh-stat h4{font-size:16px;margin-top:10px}
.rh-stat p{color:var(--muted);font-size:14px;margin-top:4px}

/* filters */
.rh-filters{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:28px}
.rh-filter{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:999px;padding:9px 18px;font-weight:600;font-size:14px;color:#d9d4e4}
.rh-filter i{width:9px;height:9px;border-radius:50%;background:var(--c,#fff)}
.rh-filter.on{background:var(--yellow);color:#201600;border-color:var(--yellow)}

/* activities */
.rh-acts{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px}
.rh-act{background:var(--card);border:1px solid var(--line);border-radius:28px;padding:24px;display:flex;flex-direction:column;justify-content:space-between;gap:22px}
.rh-act-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px}
.rh-act-icon{width:58px;height:84px;border-radius:999px;display:grid;place-items:center;font-size:26px;background:var(--c)}
.rh-act-when{text-align:right;font-size:13px;color:var(--muted)}
.rh-act-when b{display:inline-block;background:rgba(255,255,255,.08);color:var(--text);border-radius:999px;padding:4px 12px;font-size:13px;margin-bottom:4px}
.rh-act h4{font:700 20px/1.25 var(--disp);margin:18px 0 8px}
.rh-act p{color:var(--muted);font-size:14.5px}
.rh-act-foot{display:flex;flex-direction:column;gap:10px;font-size:13.5px;border-top:1px solid var(--line);padding-top:16px}
.rh-award{align-self:flex-start;border-radius:999px;padding:4px 12px;font-size:12.5px;font-weight:700;background:var(--c);color:#14110a}

/* event banner */
.rh-event{margin-top:36px;background:var(--yellow);color:#1c1400;border-radius:40px;padding:36px 40px;display:flex;justify-content:space-between;gap:28px;flex-wrap:wrap;align-items:center}
.rh-event-chips{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.rh-event-chips span{background:rgba(28,20,0,.12);border-radius:999px;padding:4px 14px;font-size:13px;font-weight:700}
.rh-event h3{font:800 clamp(24px,3vw,32px)/1.15 var(--disp);max-width:26ch}
.rh-event p{margin-top:10px;max-width:60ch;font-size:15px}
.rh-event .rh-btn.dark{background:#1c1400;color:#fff;border:0}

/* facilities */
.rh-fac{display:grid;grid-template-columns:minmax(280px,1fr) 2fr;gap:24px}
.rh-fac-tabs{display:flex;flex-direction:column;gap:10px}
.rh-fac-tab{display:flex;align-items:center;gap:14px;text-align:left;border:1px solid var(--line);border-radius:999px;padding:12px 22px 12px 14px;font-weight:600;font-size:15px;line-height:1.3;background:rgba(255,255,255,.03)}
.rh-fac-tab em{font-style:normal;width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.08);display:grid;place-items:center;font-size:18px;flex:none}
.rh-fac-tab.on{background:var(--yellow);border-color:var(--yellow);color:#201600}
.rh-fac-tab.on em{background:rgba(32,22,0,.14)}
.rh-fac-box{background:var(--card);border:1px solid var(--line);border-radius:36px;padding:34px;display:flex;flex-direction:column;justify-content:space-between;gap:26px}
.rh-fac-top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:18px}
.rh-fac-icon{width:64px;height:92px;border-radius:999px;background:var(--lilac);display:grid;place-items:center;font-size:30px}
.rh-fac-top .rh-award{background:rgba(255,255,255,.1);color:var(--text)}
.rh-fac-box h3{font:700 clamp(21px,2.4vw,27px)/1.2 var(--disp)}
.rh-fac-box>div>p{color:var(--muted);margin:8px 0 22px}
.rh-specs{list-style:none;display:grid;gap:12px}
.rh-specs li{display:flex;gap:12px;font-size:15px}
.rh-specs li::before{content:"";width:10px;height:10px;border-radius:50%;background:var(--mint);margin-top:8px;flex:none}
.rh-fac-foot{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:20px;color:var(--muted);font-size:14px}

/* calculator */
.rh-calc{background:var(--card);border:1px solid var(--line);border-radius:40px;padding:36px;display:grid;grid-template-columns:1.2fr 1fr;gap:36px;max-width:960px}
.rh-field{margin-bottom:24px}
.rh-field label{display:block;font-weight:700;font-size:15px;margin-bottom:10px}
.rh-opts{display:flex;flex-wrap:wrap;gap:8px}
.rh-opt{border:1px solid var(--line);border-radius:999px;padding:9px 18px;font-weight:600;font-size:14px;color:#d9d4e4}
.rh-opt.on{background:var(--sky);border-color:var(--sky);color:#08192b}
.rh-bill{background:var(--bg);border:1px solid var(--line);border-radius:28px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;gap:22px}
.rh-bill small{color:var(--muted);font-size:14px}
.rh-total{font:800 clamp(34px,4vw,44px)/1.1 var(--disp);margin:6px 0 18px;letter-spacing:-.02em}
.rh-lines{display:grid;gap:9px;font-size:14px;color:var(--muted)}
.rh-lines div{display:flex;justify-content:space-between;gap:12px}
.rh-lines strong{color:var(--text)}
.rh-lines .x,.rh-lines .x strong{color:var(--sky)}

/* portals */
.rh-portals{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:20px}
.rh-portal{background:var(--card);border:1px solid var(--line);border-radius:32px;padding:26px;display:flex;flex-direction:column;gap:14px}
.rh-portal.star{background:var(--yellow);color:#1c1400;border-color:var(--yellow)}
.rh-portal-top{display:flex;justify-content:space-between;align-items:center}
.rh-portal-icon{width:48px;height:72px;border-radius:999px;display:grid;place-items:center;background:var(--c);color:#14110a}
.rh-portal-top span{font-size:13px;font-weight:700;border-radius:999px;padding:4px 12px;background:rgba(255,255,255,.1)}
.rh-portal.star .rh-portal-top span{background:rgba(28,20,0,.14)}
.rh-portal h4{font:700 22px var(--disp)}
.rh-portal>p{color:var(--muted);font-size:14.5px;flex:1}
.rh-portal.star>p{color:#4a3600}
.rh-tags{display:flex;flex-wrap:wrap;gap:6px}
.rh-tags span{font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:3px 11px;color:var(--muted)}
.rh-portal.star .rh-tags span{border-color:rgba(28,20,0,.25);color:#4a3600}
.rh-portal .rh-btn{margin-top:6px}
.rh-portal.star .rh-btn{background:#1c1400;color:#fff}

/* principal */
.rh-principal{background:var(--card);border:1px solid var(--line);border-radius:44px;padding:44px;display:grid;grid-template-columns:auto 1fr;gap:40px;align-items:center}
.rh-p-avatar{width:130px;height:200px;border-radius:999px;background:var(--lilac);color:#1a1230;font:800 38px var(--disp);display:grid;place-items:center}
.rh-principal h3{font:700 clamp(24px,3vw,32px)/1.2 var(--disp);margin-bottom:14px}
.rh-principal p{color:var(--muted);max-width:62ch;margin-bottom:18px}
.rh-principal small{display:block;color:var(--yellow);font-weight:600;margin-top:2px}

/* footer */
.rh-foot{background:#0e0c13;padding:64px 0 28px}
.rh-foot-grid{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:40px}
.rh-foot h5{font:700 16px var(--disp);color:var(--yellow);margin:0 0 14px}
.rh-foot p,.rh-foot li{color:#bdb7cc;font-size:14px;line-height:1.8}
.rh-foot ul{list-style:none}
.rh-foot a:hover{color:var(--yellow)}
.rh-copy{margin-top:44px;padding-top:22px;border-top:1px solid var(--line);color:var(--muted);font-size:13px;text-align:center}

.rh-burger-btn{display:none;width:40px;height:40px;border-radius:12px;background:var(--card);border:1px solid var(--line);color:var(--text);align-items:center;justify-content:center;cursor:pointer;transition:all .15s}
.rh-burger-btn:hover{background:rgba(255,255,255,.1);border-color:var(--yellow)}
.rh-mobile-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:998;animation:rh-fade .2s ease forwards}
.rh-mobile-drawer{position:fixed;top:0;right:0;bottom:0;width:min(340px,86vw);background:#171322;border-left:1px solid var(--line);z-index:999;display:flex;flex-direction:column;padding:24px 20px;transform:translateX(100%);transition:transform .28s cubic-bezier(.16,1,.3,1);box-shadow:-12px 0 45px rgba(0,0,0,.8);overflow-y:auto}
.rh-mobile-drawer.open{transform:translateX(0)}
.rh-mobile-drawer-head{display:flex;align-items:center;justify-content:space-between;padding-bottom:18px;border-bottom:1px solid var(--line);margin-bottom:18px}
.rh-mobile-close-btn{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.08);border:1px solid var(--line);color:var(--muted);display:grid;place-items:center;cursor:pointer}
.rh-mobile-close-btn:hover{color:#ff5c5c;background:rgba(255,92,92,.18);border-color:#ff5c5c}
.rh-mobile-nav{display:flex;flex-direction:column;gap:8px;flex:1}
.rh-mobile-nav-link{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.03);border:1px solid transparent;transition:all .15s}
.rh-mobile-nav-link:hover{background:rgba(255,194,26,.08);border-color:var(--yellow)}
.rh-mobile-nav-link strong{display:block;font-size:14.5px;font-weight:600;color:var(--text)}
.rh-mobile-nav-link small{display:block;font-size:11.5px;color:var(--muted);margin-top:2px}
.rh-mobile-nav-link span{color:var(--yellow);font-size:16px;font-weight:700}
.rh-mobile-drawer-actions{display:grid;gap:10px;margin-top:20px;padding-top:18px;border-top:1px solid var(--line)}
.rh-mobile-drawer-footer{margin-top:16px;display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted)}
@keyframes rh-fade{from{opacity:0}to{opacity:1}}

@media (max-width:980px){
  .rh-wrap{padding:0 20px}
  .rh-head .rh-wrap{display:flex;align-items:center;justify-content:space-between;flex-wrap:nowrap;gap:12px;padding-top:10px;padding-bottom:10px}
  .rh-hero .rh-wrap{grid-template-columns:1fr;min-height:0;gap:24px}
  .rh-hero-copy{padding-bottom:8px}
  .rh-hero h1{max-width:16ch}
  .rh-cols{height:520px;--tall:270px;--short:180px}
  .rh-menu{display:none}
  .rh-burger-btn{display:inline-flex}
  .rh-actions{margin-left:auto;gap:8px}
  .rh-fac,.rh-calc{grid-template-columns:1fr}
  .rh-principal{grid-template-columns:1fr;padding:32px}
  .rh-foot-grid{grid-template-columns:1fr}
}
@media (max-width:768px){
  .rh-wrap{padding:0 16px}
  .rh-head .rh-brand-text{display:none}
}
@media (max-width:600px){
  .rh-wrap{padding:0 14px}
  .rh-head .rh-wrap{padding-top:8px;padding-bottom:8px;gap:8px}
  .rh-sec{padding:54px 0}
  .rh-cols{gap:10px;height:430px;--tall:220px;--short:150px}
  .rh-col{gap:10px}
  .rh-tag .t{display:none}
  .rh-event{padding:24px 18px;border-radius:24px}
  .rh-calc{padding:20px;border-radius:24px}
  .rh-fac-box{padding:20px;border-radius:24px}
  .rh-btn.sm{padding:7px 12px;font-size:13px}
  .rh-burger-btn{width:36px;height:36px}
}
@media (max-width:400px){
  .rh-wrap{padding:0 10px}
  .rh-head .rh-wrap{gap:6px}
  .rh-actions{gap:6px}
  .rh-btn.sm{padding:6px 10px;font-size:12px}
}
@media (prefers-reduced-motion:reduce){
  .rh-pill{animation:none;opacity:1}
  .rh-btn{transition:none}
}
`;

export default function LandingPage({ onOpenFastAdmission, onOpenResultChecker }) {
  const router = useRouter();

  // Interactive Activity Category Filter State
  const [activeActivityCat, setActiveActivityCat] = useState('all');

  // Interactive Facility Tab State
  const [activeFacility, setActiveFacility] = useState('labs');

  // Interactive Tuition Calculator State
  const [calcClass, setCalcClass] = useState('SS2');
  const [calcBoarding, setCalcBoarding] = useState('day');
  const [calcBus, setCalcBus] = useState(false);

  // Mobile Navigation Drawer State
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -76;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // School Activities Data
  const activitiesData = [
    {
      id: 'act-1',
      title: 'Advanced Robotics & AI Competition Lab',
      category: 'stem',
      categoryLabel: 'STEM & Robotics',
      iconStyle: 'icon-3d-indigo',
      iconChar: '🤖',
      duration: '4h 30m / wk',
      schedule: 'Thursdays 3:30 PM',
      desc: 'Python programming, Arduino microcontrollers, autonomous sensor navigation, and international FIRST LEGO League championship preparation.',
      enrolled: '28 / 32 Enrolled',
      lead: 'Ms. Esther Eze (Lead Robotics Faculty)',
      badge: 'National STEM Finalist',
    },
    {
      id: 'act-2',
      title: 'Olympic Swimming & Aquatics Academy',
      category: 'sports',
      categoryLabel: 'Sports & Athletics',
      iconStyle: 'icon-3d-blue',
      iconChar: '🏊',
      duration: '6h / wk',
      schedule: 'Tue & Fri 6:30 AM',
      desc: 'Olympic 50-meter heated pool, stroke hydrodynamic biomechanics, water polo tactical play, and competitive national inter-school galas.',
      enrolled: '42 / 50 Enrolled',
      lead: 'Coach Segun Adeleke (Head of Athletics)',
      badge: 'State Champions 2026',
    },
    {
      id: 'act-3',
      title: 'Model United Nations & Diplomatic Debate',
      category: 'leadership',
      categoryLabel: 'Leadership & Civic',
      iconStyle: 'icon-3d-gold',
      iconChar: '🌐',
      duration: '3h 15m / wk',
      schedule: 'Wednesdays 4:00 PM',
      desc: 'Parliamentary procedures, geopolitical crisis simulations, treaty drafting, and delegations to annual Harvard and The Hague conferences.',
      enrolled: '35 / 40 Enrolled',
      lead: 'Mrs. Folake Balogun (Humanities Lead)',
      badge: 'Harvard MUN Delegation',
    },
    {
      id: 'act-4',
      title: 'Royal Symphony Orchestra & Chamber Choir',
      category: 'arts',
      categoryLabel: 'Performing Arts',
      iconStyle: 'icon-3d-purple',
      iconChar: '🎻',
      duration: '5h / wk',
      schedule: 'Mon & Thu 3:45 PM',
      desc: 'Symphonic score reading, classical string ensemble, brass choir, vocal pedagogy, and the annual Gala Symphony at the Civic Centre.',
      enrolled: '54 Enrolled',
      lead: 'Mr. Babatunde Lawal (Creative Arts Lead)',
      badge: 'ABRSM London Certified',
    },
    {
      id: 'act-5',
      title: 'Elite Football Academy & Athletics Pavilion',
      category: 'sports',
      categoryLabel: 'Sports & Athletics',
      iconStyle: 'icon-3d-green',
      iconChar: '⚽',
      duration: '5h 30m / wk',
      schedule: 'Mon, Wed, Sat 4:00 PM',
      desc: 'FIFA-standard natural turf pitch, GPS player movement tracking, speed conditioning, and matches against top academies in West Africa.',
      enrolled: '48 Enrolled',
      lead: 'Coach Segun Adeleke',
      badge: 'Lagos Schools Cup Winners',
    },
    {
      id: 'act-6',
      title: 'Aeronautics, Drone Flight & Space Science',
      category: 'stem',
      categoryLabel: 'STEM & Robotics',
      iconStyle: 'icon-3d-pink',
      iconChar: '🚀',
      duration: '3h 45m / wk',
      schedule: 'Saturdays 10:00 AM',
      desc: 'Fixed-wing aerodynamic design, aerial drone avionics, telemetry sensors, and deep-sky observational astronomy using our rooftop telescope.',
      enrolled: '24 / 25 Enrolled',
      lead: 'Dr. Kelechi Nwosu (Senior Specialist)',
      badge: 'NASA Space Apps Partner',
    },
    {
      id: 'act-7',
      title: 'Dramatic Stagecraft & Film Production',
      category: 'arts',
      categoryLabel: 'Performing Arts',
      iconStyle: 'icon-3d-orange',
      iconChar: '🎭',
      duration: '4h / wk',
      schedule: 'Fridays 3:30 PM',
      desc: 'Method acting, stage lighting engineering, sound design, screenwriting, and annual theater showcases at the National Theatre.',
      enrolled: '30 Enrolled',
      lead: 'Mrs. Grace James (Head of Languages)',
      badge: 'Best Drama Production 2025',
    },
    {
      id: 'act-8',
      title: 'French & Mandarin Bilingual Immersion Salon',
      category: 'languages',
      categoryLabel: 'Global Languages',
      iconStyle: 'icon-3d-blue',
      iconChar: '🗣️',
      duration: '3h / wk',
      schedule: 'Tuesdays 3:45 PM',
      desc: 'Conversational fluency, cultural etiquette salons, DELF Junior & HSK preparation, and bi-annual student exchange tours to Paris and Beijing.',
      enrolled: '38 Enrolled',
      lead: 'Mme. Claire Dupont (Bilingual Faculty)',
      badge: 'Alliance Française Accredited',
    },
  ];

  const filteredActivities = activeActivityCat === 'all'
    ? activitiesData
    : activitiesData.filter((a) => a.category === activeActivityCat);

  // Campus Facilities Data
  const facilitiesData = {
    labs: {
      name: 'Advanced Science, Robotics & Computing Workstations',
      subtitle: 'Four dedicated university-grade laboratories for Physics, Chemistry, Biology & Artificial Intelligence.',
      specs: [
        '36 High-Performance GPU Workstations with Python, MATLAB & CAD',
        'Fume hoods, automated spectrophotometers & digital microscopes',
        'MakerBot 3D Printers and CNC Laser Cutters for engineering prototyping',
        'Fiber-optic gigabit LAN dedicated to digital examinations (CBT)',
      ],
      stats: '4 Laboratories · 140 Concurrent Capacity',
      icon: '🔬',
    },
    sports: {
      name: 'Olympic Aquatics & Athletics Arena',
      subtitle: 'World-class sporting facilities certified for state, national, and international youth trials.',
      specs: [
        '50-meter 8-lane Olympic competition swimming pool with timing pads',
        'FIFA-grade natural grass football pitch with floodlights',
        '400m synthetic tartan all-weather athletics running track',
        'Multi-sport indoor pavilion for basketball, volleyball, and badminton',
      ],
      stats: '12 Sports Disciplines · 1,500 Spectator Stands',
      icon: '🏊',
    },
    library: {
      name: 'Sir Ahmadu Bello Digital Research Library',
      subtitle: 'A serene intellectual sanctuary bridging timeless literature with cutting-edge academic journals.',
      specs: [
        'Over 25,000 curated volumes across Cambridge, WAEC, and global curricula',
        'Direct institutional subscription to JSTOR, EBSCOhost & Britannica Online',
        'Silent individual study carrels and collaborative glass conference pods',
        'Dedicated archival reading room for African literature and history',
      ],
      stats: '25,000+ Volumes · 200 Study Desks',
      icon: '📚',
    },
    auditorium: {
      name: '1,200-Seat Multi-Tier Performing Arts Amphitheatre',
      subtitle: 'Acoustically tuned grand hall hosting school assemblies, theatrical galas, and Model UN debates.',
      specs: [
        'Full digital stage lighting rig with DMX programmable spotlights',
        'Line-array Dolby surround acoustic system and wireless studio microphones',
        'Hydraulic orchestral orchestra pit and Steinway concert grand piano',
        'Backstage dressing suites, green rooms, and prop fabrication studio',
      ],
      stats: '1,200 Auditorium Capacity · Dual Tier Seating',
      icon: '🎭',
    },
    wellness: {
      name: 'Campus Wellness & Pediatric Infirmary',
      subtitle: 'Round-the-clock professional medical and psychological wellness care for all day and boarding scholars.',
      specs: [
        'Resident Medical Officer and three licensed registered pediatric nurses',
        '6-bed sterile observation ward and isolation clinic',
        'Fully equipped emergency oxygen, defibrillator, and on-call ambulance',
        'Licensed adolescent counsellor providing confidential emotional pastoral care',
      ],
      stats: '24/7 Coverage · Registered Medical Team',
      icon: '🏥',
    },
  };

  const activeFac = facilitiesData[activeFacility];

  // Dynamic Tuition Calculation
  const calculateTuition = () => {
    let baseTuition = 120000;
    if (calcClass.startsWith('JSS')) baseTuition = 105000;
    if (calcClass === 'SS3') baseTuition = 135000;

    let devLevy = 25000;
    let labFee = calcClass.startsWith('SS') ? 20000 : 15000;
    let ptaClinic = 20000;
    let boardingFee = calcBoarding === 'boarding' ? 180000 : 0;
    let busFee = calcBus ? 50000 : 0;

    const total = baseTuition + devLevy + labFee + ptaClinic + boardingFee + busFee;
    return {
      baseTuition,
      devLevy,
      labFee,
      ptaClinic,
      boardingFee,
      busFee,
      total,
    };
  };

  const tuitionEst = calculateTuition();


  // ---- Visual-layer data (design only; logic above is unchanged) ----
  const tones = { stem: '#3aa4f7', sports: '#3dc46a', arts: '#a08de0', leadership: '#ffc21a', languages: '#ff6b6b' };

  const heroCols = [
    [
      { bg: '#ffc21a', skin: '#f1c6a0', hair: '#5a2d1a', shirt: '#e5483b', tag: '🤖', label: 'Robotics lab', size: 'tall' },
      { bg: '#ff5c5c', skin: '#e8b48d', hair: '#2b1a14', shirt: '#f4f0ea', tag: '🎻', label: 'Orchestra', size: 'short' },
    ],
    [
      { bg: '#a08de0', skin: '#f3cfae', hair: '#8a4b22', shirt: '#2a2536', tag: '🌐', label: 'Model UN', size: 'short' },
      { bg: '#2f5bd6', skin: '#8d5a3b', hair: '#1c120d', shirt: '#2f8f5a', tag: '🔬', label: 'Science labs', size: 'tall' },
    ],
    [
      { bg: '#7fd8d3', skin: '#e9b78f', hair: '#3a2418', shirt: '#ff8a1f', tag: '🏊', label: 'Aquatics', size: 'tall' },
      { bg: '#3dc46a', skin: '#c98d62', hair: '#17100c', shirt: '#f4f0ea', tag: '🚀', label: 'Aeronautics', size: 'short' },
    ],
  ];

  const paths = [
    { label: 'Junior Secondary', sub: 'JSS1–3', run: () => setCalcClass('JSS1') },
    { label: 'Senior Secondary', sub: 'SS1–3', run: () => setCalcClass('SS1') },
    { label: 'Boarding', sub: 'Full boarding', run: () => setCalcBoarding('boarding') },
  ];

  const actFilters = [
    { key: 'all', label: 'All activities (36+)', c: '#ffffff' },
    { key: 'stem', label: 'STEM & Robotics', c: tones.stem },
    { key: 'sports', label: 'Sports & Athletics', c: tones.sports },
    { key: 'arts', label: 'Performing Arts', c: tones.arts },
    { key: 'leadership', label: 'Leadership & Debate', c: tones.leadership },
    { key: 'languages', label: 'Global Languages', c: tones.languages },
  ];

  const facTabs = [
    { key: 'labs', label: 'Science & Robotics Workstations', icon: '🔬' },
    { key: 'sports', label: 'Olympic Aquatics & Athletics Arena', icon: '🏊' },
    { key: 'library', label: 'Digital Research Library (25k Volumes)', icon: '📚' },
    { key: 'auditorium', label: '1,200-Seat Performing Arts Theatre', icon: '🎭' },
    { key: 'wellness', label: '24/7 Wellness & Pediatric Infirmary', icon: '🏥' },
  ];

  const stats = [
    { n: '99.6%', c: 'var(--yellow)', t: 'WAEC & IGCSE Pass Rate', d: 'Consistently ranked in the national top percentile for distinction grades.' },
    { n: '1 : 10', c: 'var(--sky)', t: 'Faculty-to-Student Ratio', d: 'Intensive personal mentoring, scholastic tracking, and pastoral care.' },
    { n: '36+', c: 'var(--mint)', t: 'Innovation & Sports Clubs', d: 'From Robotics, AI and Model UN to Olympic Swimming and Fencing.' },
    { n: '28 yrs', c: 'var(--coral)', t: 'Legacy of Academic Rigour', d: 'Graduating ethical pioneers excelling at Ivy League and top global institutions.' },
  ];

  const portals = [
    {
      role: 'admin', c: 'var(--sky)', badge: 'Governance', title: 'Administrator', cta: 'Sign in to Admin portal',
      desc: 'Complete control over school registers, staff subject assignments, admissions workflow, results publication, and system security.',
      count: 12, tags: ['Dashboard', 'Students', 'Academics', 'Fees', 'Staff Matrix', 'Settings'],
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
    {
      role: 'teacher', c: 'var(--lilac)', badge: 'Academic Faculty', title: 'Teacher Workspace', cta: 'Sign in to Faculty portal',
      desc: 'Gradebook score entry for assigned classes, daily roll calls, teaching periods, lesson remarks, and departmental submissions.',
      count: 7, tags: ['Dashboard', 'Score Entry', 'Teaching Schedule', 'Attendance'],
      icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
    },
    {
      role: 'student', c: '#ffffff', badge: 'Scholar', title: 'Student Portal', cta: 'Sign in to Scholar portal', star: true,
      desc: 'View published term assessments, personal grade trends, digital report card generation, class schedules, and school bulletins.',
      count: 5, tags: ['My Learning', 'Report Card', 'Timetable', 'Attendance'],
      icon: <><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>,
    },
    {
      role: 'parent', c: 'var(--mint)', badge: 'Guardian Care', title: 'Parent & Guardian', cta: 'Sign in to Parent portal',
      desc: 'Monitor your child’s academic progress, download validated term report cards, check attendance punctuality, and settle term invoices.',
      count: 6, tags: ['Child Progress', 'Report Cards', 'Fee Invoices', 'Receipts'],
      icon: <><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" /><circle cx="19" cy="11" r="3" /><path d="M22 21v-1a3 3 0 0 0-3-3h-1" /></>,
    },
    {
      role: 'bursar', c: 'var(--coral)', badge: 'Finance Office', title: 'Bursar & Accounts', cta: 'Sign in to Bursary desk',
      desc: 'Institutional revenue tracking, termly invoice dispatch, bank payment reconciliation, and audit receipts generation.',
      count: 6, tags: ['Financial Ledger', 'Fee Tariffs', 'Receipts', 'Audits'],
      icon: <><rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" /></>,
    },
  ];

  const naira = (n) => `₦${n.toLocaleString('en-NG')}`;

  return (
    <div className="rh" id="landingView">
      <style>{CSS}</style>

      {/* Header */}
      <header className="rh-head">
        <div className="rh-wrap">
          <a href="#" className="rh-brand" title="Royal Heights Secondary School">
            <div className="rh-badge">RH</div>
            <div className="rh-brand-text">
              <strong>Royal Heights</strong>
              <small>Secondary School · Lagos</small>
            </div>
          </a>
          <nav className="rh-menu" aria-label="Main">
            {[
              ['about', 'About'], ['activities', 'School Activities'], ['academics', 'Academics'],
              ['facilities', 'Campus & Life'], ['calculator', 'Tuition Estimator'], ['portalHub', 'Portals'],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id); }}>{label}</a>
            ))}
          </nav>
          <div className="rh-actions">
            <button
              className="rh-btn sm"
              style={{
                background: 'rgba(234, 179, 8, 0.15)',
                color: '#eab308',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                fontWeight: 700,
              }}
              onClick={onOpenResultChecker}
            >
              🎫 Check Result
            </button>
            <button className="rh-btn dark sm" onClick={onOpenFastAdmission}>Apply</button>
            <button className="rh-btn yellow sm" onClick={() => router.push('/login')}>Sign in</button>
            <button
              className="rh-burger-btn"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMobileNavOpen ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer & Backdrop */}
      {isMobileNavOpen && (
        <div className="rh-mobile-backdrop" onClick={() => setIsMobileNavOpen(false)} aria-hidden="true" />
      )}
      <div className={`rh-mobile-drawer ${isMobileNavOpen ? 'open' : ''}`} aria-hidden={!isMobileNavOpen}>
        <div className="rh-mobile-drawer-head">
          <div className="rh-brand">
            <div className="rh-badge">RH</div>
            <div>
              <strong>Royal Heights</strong>
              <small>Secondary School · Lagos</small>
            </div>
          </div>
          <button
            className="rh-mobile-close-btn"
            onClick={() => setIsMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <nav className="rh-mobile-nav">
          {[
            ['about', 'About Royal Heights', 'Prestigious Citadel of Excellence', '🏛️'],
            ['activities', 'School Activities', 'Robotics, Aquatics & 36+ Clubs', '🤖'],
            ['academics', 'Academic Curriculum', 'Dual Cambridge & WAEC Pathways', '🎓'],
            ['facilities', 'Campus & Life', 'Olympic Arena & Digital Library', '🏟️'],
            ['calculator', 'Tuition Estimator', 'Itemized Fees Calculator', '🧮'],
            ['portalHub', 'Stakeholder Portals', 'Admin, Teacher, Scholar & Parent', '🛡️'],
          ].map(([id, title, desc, icon]) => (
            <a
              key={id}
              href={`#${id}`}
              className="rh-mobile-nav-link"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileNavOpen(false);
                scrollToId(id);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{desc}</small>
                </div>
              </div>
              <span style={{ color: 'var(--yellow)', fontWeight: 700 }}>→</span>
            </a>
          ))}
        </nav>

        <div className="rh-mobile-drawer-actions">
          <button
            className="rh-btn lg"
            style={{
              width: '100%',
              background: 'rgba(234, 179, 8, 0.15)',
              color: '#eab308',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              fontWeight: 700,
            }}
            onClick={() => {
              setIsMobileNavOpen(false);
              if (onOpenResultChecker) onOpenResultChecker();
            }}
          >
            🎫 Check Terminal Result (Scratch Card)
          </button>
          <button
            className="rh-btn sky lg"
            style={{ width: '100%' }}
            onClick={() => {
              setIsMobileNavOpen(false);
              onOpenFastAdmission();
            }}
          >
            Apply for 2026/2027 Enrolment
          </button>
          <button
            className="rh-btn yellow lg"
            style={{ width: '100%' }}
            onClick={() => {
              setIsMobileNavOpen(false);
              router.push('/login');
            }}
          >
            Stakeholder Portal Sign In →
          </button>
        </div>

        <div className="rh-mobile-drawer-footer">
          <span>☎ +234 1 800-ROYAL</span>
          <span>Victoria Island, Lagos</span>
        </div>
      </div>

      {/* Hero */}
      <section className="rh-hero" id="about">
        <span className="rh-dot" style={{ width: 22, height: 22, background: 'var(--orange)', left: '3%', top: 110 }} />
        <span className="rh-dot" style={{ width: 24, height: 24, background: 'var(--coral)', left: '44%', bottom: 90 }} />
        <span className="rh-dot" style={{ width: 20, height: 20, background: 'var(--yellow)', left: '47%', top: 70 }} />
        <span className="rh-dot" style={{ width: 22, height: 22, background: 'var(--mint)', right: '3%', top: '54%' }} />

        <div className="rh-wrap">
          <div className="rh-hero-copy">
            <h1>Nurturing visionaries, refining character, inspiring global leaders.</h1>
            <p>
              A co-educational school combining British and Nigerian academic excellence with STEM robotics, Olympic-level sport and values-led mentorship.
            </p>
            <div className="rh-cta">
              <button className="rh-btn sky lg" onClick={onOpenFastAdmission}>Start 2026/2027 application</button>
              <button className="rh-btn dark lg" onClick={() => scrollToId('activities')}>Explore activities</button>
            </div>

            <div className="rh-path">
              <h3>Choose your path</h3>
              <p>Pick one to see an itemized Term 1 estimate.</p>
              <div className="rh-chips">
                {paths.map((p) => (
                  <button key={p.label} className="rh-chip" onClick={() => { p.run(); scrollToId('calculator'); }}>
                    {p.label}<span>{p.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rh-proof">
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                Cambridge International Centre
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                WAEC & NECO accredited
              </div>
              <div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" /></svg>
                100% university placement
              </div>
            </div>
          </div>

          <div className="rh-cols" aria-hidden="true">
            {heroCols.map((col, ci) => (
              <div key={ci} className="rh-col">
                {col.map((p, pi) => (
                  <div
                    key={p.label}
                    className={`rh-pill ${p.size}`}
                    style={{ background: p.bg, animationDelay: `${ci * 0.14 + pi * 0.1}s` }}
                  >
                    {p.img ? <img src={p.img} alt="" /> : <Student skin={p.skin} hair={p.hair} shirt={p.shirt} />}
                    <span className="rh-tag">{p.tag} <span className="t">{p.label}</span></span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="rh-stats" id="academics">
        <div className="rh-wrap">
          {stats.map((s) => (
            <div key={s.t} className="rh-stat">
              <b style={{ color: s.c }}>{s.n}</b>
              <h4>{s.t}</h4>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <section className="rh-sec" id="activities">
        <div className="rh-wrap">
          <div className="rh-sec-head">
            <h2>Enriching passions beyond the classroom</h2>
            <p>Every scholar joins our ecosystem of 36+ innovation labs, sports academies and performing arts guilds.</p>
          </div>

          <div className="rh-filters" role="group" aria-label="Filter activities">
            {actFilters.map((f) => (
              <button
                key={f.key}
                className={`rh-filter ${activeActivityCat === f.key ? 'on' : ''}`}
                style={{ '--c': f.c }}
                onClick={() => setActiveActivityCat(f.key)}
              >
                <i />{f.label}
              </button>
            ))}
          </div>

          <div className="rh-acts">
            {filteredActivities.map((act) => (
              <article key={act.id} className="rh-act" style={{ '--c': tones[act.category] }}>
                <div>
                  <div className="rh-act-top">
                    <div className="rh-act-icon">{act.iconChar}</div>
                    <div className="rh-act-when">
                      <b>{act.duration}</b><br />{act.schedule}
                    </div>
                  </div>
                  <h4>{act.title}</h4>
                  <p>{act.desc}</p>
                </div>
                <div className="rh-act-foot">
                  <span>{act.lead}</span>
                  <span className="rh-award">{act.badge}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="rh-event">
            <div>
              <div className="rh-event-chips">
                <span>2-day grand festival</span>
                <span>28–29 October 2026</span>
                <span>Main Campus Arena</span>
              </div>
              <h3>Annual Inter-House STEM, Robotics & Athletic Olympiad 2026</h3>
              <p>Over 36 competitive tracks across autonomous drones, aquatics, track & field, Model UN crisis and Academic Decathlon. Parents, alumni and university scouts attend.</p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="rh-btn white"
                onClick={() => alert('Event Schedule: 28 Oct (STEM & Academic Decathlon), 29 Oct (Athletics & Gala). Venue: Main Sports Complex.')}
              >
                View event schedule
              </button>
              <button className="rh-btn dark" onClick={onOpenFastAdmission}>Register applicant</button>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="rh-sec alt" id="facilities">
        <div className="rh-wrap">
          <div className="rh-sec-head">
            <h2>Designed for holistic excellence</h2>
            <p>Explore our learning environments, athletic complexes, digital library and wellness centre.</p>
          </div>
          <div className="rh-fac">
            <div className="rh-fac-tabs">
              {facTabs.map((f) => (
                <button key={f.key} className={`rh-fac-tab ${activeFacility === f.key ? 'on' : ''}`} onClick={() => setActiveFacility(f.key)}>
                  <em>{f.icon}</em><span>{f.label}</span>
                </button>
              ))}
            </div>
            <div className="rh-fac-box">
              <div>
                <div className="rh-fac-top">
                  <div className="rh-fac-icon">{activeFac.icon}</div>
                  <span className="rh-award">{activeFac.stats}</span>
                </div>
                <h3>{activeFac.name}</h3>
                <p>{activeFac.subtitle}</p>
                <ul className="rh-specs">
                  {activeFac.specs.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="rh-fac-foot">
                <span>Campus visits every Tuesday and Thursday.</span>
                <button className="rh-btn yellow sm" onClick={onOpenFastAdmission}>Book a campus tour</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tuition estimator */}
      <section className="rh-sec" id="calculator">
        <div className="rh-wrap">
          <div className="rh-sec-head">
            <h2>Tuition & enrolment estimator</h2>
            <p>Choose an entry class and options to see an itemized estimate for Term 1.</p>
          </div>
          <div className="rh-calc">
            <div>
              <div className="rh-field">
                <label>Target class level</label>
                <div className="rh-opts">
                  {['JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3'].map((cls) => (
                    <button key={cls} className={`rh-opt ${calcClass === cls ? 'on' : ''}`} onClick={() => setCalcClass(cls)}>{cls}</button>
                  ))}
                </div>
              </div>
              <div className="rh-field">
                <label>Boarding or day scholar</label>
                <div className="rh-opts">
                  <button className={`rh-opt ${calcBoarding === 'day' ? 'on' : ''}`} onClick={() => setCalcBoarding('day')}>Day scholar (Mon–Fri)</button>
                  <button className={`rh-opt ${calcBoarding === 'boarding' ? 'on' : ''}`} onClick={() => setCalcBoarding('boarding')}>Full boarding (+₦180k)</button>
                </div>
              </div>
              <div className="rh-field" style={{ marginBottom: 0 }}>
                <label>School bus service</label>
                <div className="rh-opts">
                  <button className={`rh-opt ${!calcBus ? 'on' : ''}`} onClick={() => setCalcBus(false)}>Self drop-off</button>
                  <button className={`rh-opt ${calcBus ? 'on' : ''}`} onClick={() => setCalcBus(true)}>Daily AC shuttle (+₦50k)</button>
                </div>
              </div>
            </div>

            <div className="rh-bill">
              <div>
                <small>Estimated Term 1 billing for {calcClass}</small>
                <div className="rh-total">{naira(tuitionEst.total)}</div>
                <div className="rh-lines">
                  <div><span>Academic tuition</span><strong>{naira(tuitionEst.baseTuition)}</strong></div>
                  <div><span>Development & facility levy</span><strong>{naira(tuitionEst.devLevy)}</strong></div>
                  <div><span>STEM & robotics practical kit</span><strong>{naira(tuitionEst.labFee)}</strong></div>
                  <div><span>PTA dues & wellness care</span><strong>{naira(tuitionEst.ptaClinic)}</strong></div>
                  {tuitionEst.boardingFee > 0 && <div className="x"><span>Boarding house accommodation</span><strong>{naira(tuitionEst.boardingFee)}</strong></div>}
                  {tuitionEst.busFee > 0 && <div className="x"><span>Air-conditioned transit</span><strong>{naira(tuitionEst.busFee)}</strong></div>}
                </div>
              </div>
              <button className="rh-btn yellow" onClick={onOpenFastAdmission}>Apply for {calcClass} enrolment</button>
            </div>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="rh-sec alt" id="portalHub">
        <div className="rh-wrap">
          <div className="rh-sec-head">
            <h2>One secure workspace for every role</h2>
            <p>Each member of the Royal Heights community signs in to a private workspace with its own set of tools.</p>
          </div>
          <div className="rh-portals">
            {portals.map((p) => (
              <div key={p.role} className={`rh-portal ${p.star ? 'star' : ''}`}>
                <div className="rh-portal-top">
                  <div className="rh-portal-icon" style={{ '--c': p.c }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{p.icon}</svg>
                  </div>
                  <span>{p.badge}</span>
                </div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
                <div>
                  <small style={{ opacity: 0.7 }}>{p.count} tools available</small>
                  <div className="rh-tags" style={{ marginTop: 8 }}>
                    {p.tags.map((t) => <span key={t}>{t}</span>)}
                  </div>
                </div>
                <button className={`rh-btn ${p.star ? '' : 'sky'}`} onClick={() => router.push(`/login?role=${p.role}`)}>{p.cta}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal */}
      <section className="rh-sec" id="principal">
        <div className="rh-wrap">
          <div className="rh-principal">
            <div className="rh-p-avatar">VA</div>
            <div>
              <h3>{'“We educate not for school, but for life.”'}</h3>
              <p>
                At Royal Heights, our mission goes beyond examination success. We are dedicated to igniting intellectual curiosity, developing moral fortitude, and preparing exceptional young men and women who will make transformative contributions to our nation and the global community.
              </p>
              <strong>Dr. (Mrs.) Victoria Adeleke, Ph.D. (Oxon), M.Ed. (Harvard)</strong>
              <small>Principal & Head of School · Royal Heights Secondary School</small>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="rh-foot" id="contact">
        <div className="rh-wrap">
          <div className="rh-foot-grid">
            <div>
              <div className="rh-brand" style={{ marginBottom: 14 }}>
                <div className="rh-badge">RH</div>
                <div>
                  <strong>Royal Heights</strong>
                  <small>Secondary School</small>
                </div>
              </div>
              <p style={{ maxWidth: 320 }}>Committed to academic pre-eminence, technological innovation, moral leadership, and character formation.</p>
            </div>
            <div>
              <h5>Admissions desk</h5>
              <p>
                Plot 12, Royal Palm Boulevard,<br />
                Victoria Island Annex, Lagos, Nigeria<br />
                Hotlines: +234 1 800-ROYAL / 0803-RH-ADMIT<br />
                Email: admissions@royalheights.edu.ng
              </p>
            </div>
            <div>
              <h5>Portal access</h5>
              <ul>
                <li><a href="/login?role=admin">Administrator login</a></li>
                <li><a href="/login?role=teacher">Teacher gradebook</a></li>
                <li><a href="/login?role=student">Student portal</a></li>
                <li><a href="/login?role=parent">Parent & guardian hub</a></li>
                <li><a href="/login?role=bursar">Bursary office</a></li>
              </ul>
            </div>
          </div>
          <div className="rh-copy">
            © 2026 Royal Heights Secondary School. Cambridge International Registration NG-482. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}