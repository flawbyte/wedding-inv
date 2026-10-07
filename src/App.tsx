import React, { useEffect, useRef, useState } from "react";

const WEDDING = {
  bride: "Dr. Pradna",
  groom: "Lokesh",
  formalGroom: "LLB Lokesh",
  monogram: "P & L",
  month: "April",
  year: 2026,
  weddingDate: "2026-04-15T10:30:00+05:30",
  venue: "The Anvaya",
  city: "Hyderabad, Telangana",
  events: [
    { name: "MEHENDI", date: "April 13, 2026", time: "5:30 PM", desc: "Colour, laughter & beautiful beginnings." },
    { name: "SANGEET", date: "April 14, 2026", time: "7:00 PM", desc: "An evening of music, stories & celebration." },
    { name: "WEDDING", date: "April 15, 2026", time: "10:30 AM", desc: "Two hearts. One promise. Forever." },
  ],
};

export default function App() {
  const [opened, setOpened] = useState(false);
  const [sealBroken, setSealBroken] = useState(false);
  const [envelopeExit, setEnvelopeExit] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<"accept" | "decline">("accept");
  const [nameVal, setNameVal] = useState("");
  const [guests, setGuests] = useState("1");
  const [submitted, setSubmitted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [count, setCount] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const target = new Date(WEDDING.weddingDate).getTime();
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setCount({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / (1000 * 60)) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useEffect(() => {
    if (!opened) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).dataset.reveal || "";
          setRevealed((prev) => {
            const n = new Set(prev);
            n.add(id);
            return n;
          });
        }
      });
    }, { threshold: 0.18 });
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [opened]);

  const handleOpen = () => {
    setSealBroken(true);
    setTimeout(() => setEnvelopeExit(true), 700);
    setTimeout(() => setOpened(true), 1600);
  };

  const toggleMusic = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (audioRef.current) {
      try {
        if (next) {
          const p = audioRef.current.play();
          const maybe = p as any;
          if (maybe && typeof maybe.catch === "function") maybe.catch(() => {});
        } else audioRef.current.pause();
      } catch {}
    }
  };

  return (
    <div className="root">
      <style>{`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        :root{ --ivory:#FDF8F0; --parchment:#F5EEDF; --cream:#FFFDF7; --champagne:#E8DCC6; --burgundy:#6B2D3C; --maroon:#4A1C26; --terracotta:#C67B5C; --gold:#C8A96E; --gold-dark:#8a6d3b; --sage:#A8B5A0; --ink:#2A1518; --safe-area-inset-top: env(safe-area-inset-top, 0px); }
        *{ -webkit-font-smoothing:antialiased; } html,body{ background:var(--maroon); overscroll-behavior:none; margin:0; }
        .root{ min-height:100vh; font-family:"DM Sans", ui-sans-serif, system-ui, -apple-system, sans-serif; color:var(--ink); overflow-x:hidden; padding-top: var(--safe-area-inset-top); }
        .serif{ font-family:"Cormorant Garamond", "Cormorant", Georgia, serif; }
        .ink-bleed{ text-shadow: 0 0.35px 0 rgba(42,21,24,0.18), 0 0.6px 0.4px rgba(42,21,24,0.08); }
        .paper-texture{
          background-color: var(--cream);
          background-image:
            radial-gradient(at 22% 28%, rgba(200,169,110,0.22) 0%, transparent 52%),
            radial-gradient(at 82% 18%, rgba(107,45,60,0.08) 0%, transparent 42%),
            radial-gradient(at 62% 84%, rgba(200,169,110,0.14) 0%, transparent 48%),
            radial-gradient(circle at 50% 50%, rgba(42,21,24,0.025) 0.8px, transparent 1.3px),
            linear-gradient(90deg, rgba(42,21,24,0.018) 0.5px, transparent 0.5px),
            linear-gradient(rgba(42,21,24,0.022) 0.5px, transparent 0.5px),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence baseFrequency='0.92' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 100% 100%, 100% 100%, 100% 100%, 2.6px 2.6px, 17px 17px, 21px 21px, 120px 120px;
        }
        .paper-burgundy{
          background-color: var(--maroon);
          background-image:
            radial-gradient(at 28% 22%, rgba(255,253,247,0.08) 0%, transparent 62%),
            radial-gradient(at 72% 82%, rgba(200,169,110,0.12) 0%, transparent 54%),
            radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04) 1px, transparent 1.1px),
            linear-gradient(180deg, rgba(0,0,0,0.18), rgba(0,0,0,0.38));
        }
        .paper-card{
          box-shadow:
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(74,28,38,0.06) inset,
            0 2px 4px rgba(0,0,0,0.04),
            0 12px 28px rgba(74,28,38,0.12),
            0 32px 72px rgba(74,28,38,0.13),
            0 64px 140px rgba(74,28,38,0.08);
          position:relative;
        }
        .paper-card::after{
          content:""; position:absolute; inset:0; border-radius:inherit; pointer-events:none;
          background: linear-gradient(105deg, rgba(255,255,255,0.45) 0%, transparent 28%, transparent 72%, rgba(0,0,0,0.04) 100%);
          mix-blend-mode: soft-light;
        }
        .paisley-motif{ position:absolute; pointer-events:none; opacity:0.07; }
        .gold-foil{
          background: linear-gradient(102deg, #7a5a2a 0%, #b8945a 14%, #e8d5a8 26%, #c8a96e 38%, #f5e8c8 48%, #d4b87a 58%, #b8945a 72%, #8a6d3b 88%, #6d542f 100%);
          -webkit-background-clip:text; background-clip:text; color:transparent;
          position:relative; display:inline-block;
          filter: drop-shadow(0 0.5px 0 rgba(139,107,59,0.25));
        }
        .gold-foil::before{
          content: attr(data-text); position:absolute; inset:0;
          background: linear-gradient(110deg, transparent 15%, rgba(255,255,255,0.95) 48%, transparent 78%);
          -webkit-background-clip:text; background-clip:text;
          background-size:220% 100%; animation: foilSweep1 5.2s ease-in-out infinite; opacity:0.62;
        }
        .gold-foil::after{
          content: attr(data-text); position:absolute; inset:0;
          background: linear-gradient(110deg, transparent 25%, rgba(255,250,220,0.9) 50%, transparent 68%);
          -webkit-background-clip:text; background-clip:text;
          background-size:220% 100%; animation: foilSweep2 5.2s ease-in-out infinite 0.6s; opacity:0.42;
        }
        @keyframes foilSweep1{ 0%{ background-position:-160% 0; } 50%{ background-position:160% 0; } 100%{ background-position:160% 0; } }
        @keyframes foilSweep2{ 0%{ background-position:-160% 0; } 50%{ background-position:160% 0; } 100%{ background-position:160% 0; } }
        .embossed{ text-shadow: 0 1px 0 rgba(255,255,255,0.75), 0 -0.5px 0 rgba(0,0,0,0.18), 0 0 12px rgba(200,169,110,0.15); }
        .envelope-lining{
          background:
            linear-gradient(180deg, rgba(245,238,223,0.96), rgba(253,248,240,0.98)),
            repeating-linear-gradient(44deg, rgba(200,169,110,0.09) 0 1px, transparent 1px 11px),
            radial-gradient(at 50% 50%, rgba(200,169,110,0.06), transparent 70%);
        }
        .wax-seal{ background: radial-gradient(at 34% 28%, #c13a4a, #8B2635 58%, #4f131b 100%); box-shadow: inset 0 2px 4px rgba(255,255,255,0.28), inset 0 -8px 16px rgba(0,0,0,0.42), 0 6px 16px rgba(0,0,0,0.38), 0 1px 0 rgba(255,255,255,0.18); }
        .film-grain{ position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:0.032; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
        .vignette{ position:fixed; inset:0; pointer-events:none; z-index:30; background: radial-gradient(ellipse at center, transparent 56%, rgba(18,5,8,0.24) 88%, rgba(10,2,4,0.32) 100%); }
        .vignette-soft{ position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse at 50% 20%, rgba(255,253,247,0.18) 0%, transparent 60%); }
        .ornament-border{ border:1px solid rgba(200,169,110,0.32); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.62), 0 0 18px rgba(200,169,110,0.08); }
        @keyframes fadeInUp{ from{ opacity:0; transform: translateY(34px) rotate(0.3deg);} to{ opacity:1; transform: translateY(0) rotate(0);} }
        @keyframes envelopeIn{ from{ opacity:0; transform: translateY(24px) scale(0.98);} to{ opacity:1; transform: translateY(0) scale(1);} }
        @keyframes pulseSoft{ 0%,100%{ transform:scale(1); opacity:0.85 } 50%{ transform:scale(1.42); opacity:0 } }
        @keyframes particleFloat{ 0%,100%{ transform:translateY(-6px) translateX(0); opacity:0.15 } 50%{ transform:translateY(-24px) translateX(2px); opacity:0.75 } }
        @keyframes dustFloat{ 0%{ transform: translateY(0) translateX(0) rotate(0deg); opacity:0; } 10%{ opacity:0.5; } 90%{ opacity:0.4; } 100%{ transform: translateY(-120vh) translateX(20px) rotate(180deg); opacity:0; } }
        @keyframes lightLeak{ from{ opacity:0 } to{ opacity:1 } }
        @keyframes breatheFrame{ 0%,100%{ transform: scale(1); opacity:0.92; } 50%{ transform: scale(1.015); opacity:1; } }
        .reveal{ opacity:0; transform: translateY(30px); transition: all 1s cubic-bezier(0.22,1,0.36,1); will-change: transform, opacity; }
        .reveal.is-visible{ opacity:1; transform: translateY(0); }
        .parallax-layer{ will-change: transform; transition: transform 0.6s cubic-bezier(0.22,1,0.36,1); }
      `}</style>
      <div className="film-grain" />
      <div className="vignette" />
      <div className="fixed right-[10px] md:right-6 top-0 bottom-0 w-[1px] z-[50] hidden md:block"><div className="absolute top-0 w-full bg-[var(--gold)]/20 h-full" /><div className="absolute top-0 w-full bg-[var(--gold)]" style={{ height: scrollProgress + "%", transition: "height 0.12s linear" }} /></div>
      <div className="fixed md:hidden left-0 right-0 top-0 h-[2px] z-[60] bg-[var(--gold)] origin-left" style={{ width: scrollProgress + "%", transition: "width 0.12s linear" }} />
      <audio ref={audioRef} src="/public/assets/wedding-music.mp3" loop preload="none" />
      <button onClick={toggleMusic} className="fixed bottom-5 left-5 z-[60] w-10 h-10 rounded-full bg-[#FFFDF7] paper-card flex items-center justify-center border border-[#C8A96E]/30 active:scale-[0.97] transition" aria-label="music">
        <span className={"w-2 h-2 rounded-full " + (isPlaying ? "bg-[#6B2D3C] animate-pulse" : "bg-[#C8A96E]")} />
        <span className="absolute inset-0 rounded-full border border-[#C8A96E]/20 animate-[ping_2.8s_ease-out_infinite]" />
      </button>
      {!opened ? (
        <div className="min-h-[100svh] w-full paper-burgundy flex flex-col items-center justify-center relative px-6 overflow-hidden" style={{ paddingTop: "var(--safe-area-inset-top)", animation: "envelopeIn 1s cubic-bezier(0.22,1,0.36,1)" }}>
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(22)].map((_, i) => (
              <div key={i} className="absolute w-[2px] h-[2px] rounded-full bg-[#E8DCC6]/60"
                style={{
                  left: ((i * 7.3 + 3) % 100) + "%",
                  bottom: "-10px",
                  animation: "dustFloat " + (8 + (i % 5) * 2.2) + "s linear infinite",
                  animationDelay: (i * 0.42) + "s",
                  boxShadow: "0 0 6px rgba(232,220,198,0.8)"
                } as any}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[560px] h-[560px] rounded-full blur-[92px] opacity-[0.20] bg-[#E8DCC6]" style={{ transform: "translate(" + (parallax.x * 12) + "px, " + (parallax.y * 8) + "px)" }} />
            <div className="absolute w-[320px] h-[320px] rounded-full blur-[70px] opacity-[0.10] bg-[#C8A96E]" style={{ transform: "translate(" + (parallax.x * -18) + "px, " + (parallax.y * -10) + "px)" }} />
          </div>
          <div className="relative w-full max-w-[360px] aspect-[1.28/1] select-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] parallax-layer" style={{ perspective: 1200, transform: "scale(" + (envelopeExit ? 1.12 : 1) + ") translate(" + (parallax.x * 6) + "px, " + (parallax.y * 4) + "px)" }}>
            <div className="absolute inset-0 top-[12%] bottom-0 paper-texture rounded-[14px] paper-card ornament-border overflow-hidden">
              <div className="absolute inset-[7px] rounded-[10px] border border-[#C8A96E]/25 pointer-events-none" />
              <div className="absolute inset-[9px] rounded-[8px] border border-[#C8A96E]/10 pointer-events-none" style={{ top: "10px" }} />
              <div className="absolute top-0 left-0 right-0 h-[42%] envelope-lining opacity-90" />
              <div className="absolute bottom-[8%] left-[10%] right-[10%] opacity-[0.04]"><svg viewBox="0 0 200 40" className="w-full"><path d="M0 20 Q20 5 40 20 T80 20 T120 20 T160 20 T200 20" stroke="#6B2D3C" fill="none" strokeWidth="0.6"/></svg></div>
            </div>
            <div className="absolute left-0 right-0 top-[12%] h-[58%] origin-top paper-burgundy rounded-t-[14px] overflow-hidden z-10 transition-transform duration-[850ms]" style={{ transformStyle: "preserve-3d", boxShadow: "0 10px 30px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.1)", transform: "rotateX(" + (envelopeExit ? -178 : 0) + "deg)" }}>
              <div className="absolute inset-0 paper-burgundy" />
              <div className="absolute inset-[10px] rounded-t-[10px] border border-[#C8A96E]/30 border-b-0" />
              <div className="absolute inset-[14px] rounded-t-[8px] border border-[#C8A96E]/20 border-b-0 pointer-events-none" />
              <div className="absolute bottom-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/70 to-transparent" />
              <div className="absolute bottom-[2px] left-[14%] right-[14%] h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/25 to-transparent" />
            </div>
            <div className="absolute inset-0 top-[12%] flex flex-col items-center justify-center z-20" style={{ transform: "translateY(-20px)" }}>
              <div className="text-center flex flex-col items-center justify-center" style={{ animation: "fadeInUp 0.9s 0.45s both" }}>
                <div className="serif gold-foil text-[30px] tracking-[0.18em] font-light embossed" data-text="P & L">P & L</div>
                <div className="mt-3 serif text-[#FFFDF7] text-[18px] leading-[1.12] tracking-[0.01em] flex flex-col items-center">
                  <span className="block font-light tracking-[0.02em]">{WEDDING.bride}</span>
                  <span className="block my-[1px] text-[11px] gold-foil tracking-[0.22em] leading-none py-[2px]" data-text="&">&</span>
                  <span className="block font-light tracking-[0.02em] -mt-[1px]">{WEDDING.groom}</span>
                </div>
                <div className="mt-[10px] text-[10px] tracking-[0.40em] text-[#E8DCC6]/80 font-light">APRIL 2026</div>
              </div>
            </div>
            <div className="absolute left-1/2 bottom-[-6px] -translate-x-1/2 z-30 transition-transform duration-300" style={{ transform: "translateX(-50%) scale(" + (sealBroken ? 1.08 : 1) + ")" }}>
              {envelopeExit && <div className="absolute inset-0 rounded-full bg-[#FFD27A]/60 blur-[14px] scale-[1.4] transition-all duration-500" />}
              <div className="relative w-[72px] h-[72px] rounded-full wax-seal flex items-center justify-center cursor-pointer">
                <div className="absolute top-[10px] left-[14px] w-[18px] h-[10px] rounded-full bg-white/22 blur-[1px] rotate-[-18deg]" />
                <div className="absolute inset-[3px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-500" style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)", transform: sealBroken ? "translateX(-6px) rotate(-18deg)" : "translateX(0) rotate(0)" }}><span className="serif text-[#F5EEDF] text-[14px] tracking-[0.12em] pr-[1px]">P & L</span></div>
                <div className="absolute inset-[3px] rounded-full flex items-center justify-center overflow-hidden transition-all duration-500" style={{ clipPath: "polygon(50% 0, 100% 0, 100% 100%, 50% 100%)", transform: sealBroken ? "translateX(6px) rotate(18deg)" : "translateX(0) rotate(0)" }}><span className="serif text-[#F5EEDF] text-[14px] tracking-[0.12em] pl-[1px]">P & L</span></div>
                <div className="absolute left-1/2 top-1 bottom-1 w-[1px] bg-[#3a0f16]/50 origin-center transition-transform duration-300" style={{ transform: "scaleY(" + (sealBroken ? 1 : 0) + ")" }} />
              </div>
            </div>
            {envelopeExit && <div className="absolute left-[12%] right-[12%] top-[22%] bottom-[10%] z-[5] rounded-[8px] bg-gradient-to-b from-[#FFE9A8]/70 to-[#C8A96E]/20 blur-[2px] animate-[lightLeak_0.6s]" />}
          </div>
          <div className="relative w-full max-w-[340px] mt-[-24px] z-[4] transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ transform: envelopeExit ? "translateY(0) rotate(-1deg)" : "translateY(70px) rotate(-1.2deg)", opacity: envelopeExit ? 1 : 0 }}>
            <div className="paper-texture paper-card rounded-[12px] h-[96px] border border-white/60 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]"><svg viewBox="0 0 100 20" className="w-full h-full"><path d="M0 10 Q10 2 20 10 T40 10 T60 10 T80 10 T100 10" stroke="#6B2D3C" fill="none" strokeWidth="0.4"/></svg></div>
              <div className="serif text-[13px] tracking-[0.18em] text-[#6B2D3C]/60 relative">YOU ARE INVITED</div>
            </div>
          </div>
          <button onClick={handleOpen} disabled={sealBroken} className="mt-14 group relative transition-all duration-600" style={{ opacity: sealBroken ? 0 : 1, transform: sealBroken ? "translateY(8px)" : "translateY(0)", transitionDelay: sealBroken ? "0s" : "0.9s" }}>
            <div className="flex flex-col items-center gap-3">
              <div className="w-[1px] h-[28px] bg-gradient-to-b from-[#C8A96E]/0 via-[#C8A96E]/60 to-[#C8A96E]/0" />
              <span className="text-[10px] tracking-[0.42em] text-[#E8DCC6]/80 group-active:scale-[0.97] transition">TAP TO OPEN</span>
              <div className="w-6 h-6 rounded-full border border-[#C8A96E]/40 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-[#C8A96E] animate-[pulseSoft_2.2s_infinite]" /></div>
            </div>
          </button>
          <div className="fixed inset-0 bg-[#1a0a0e] pointer-events-none z-20 transition-opacity duration-600" style={{ opacity: sealBroken ? 0.28 : 0 }} />
        </div>
      ) : (
        <div className="relative w-full flex justify-center" style={{ background: "radial-gradient(at 50% 0%, #6B2D3C 0%, #4A1C26 55%, #2e1218 100%)", animation: "fadeInUp 0.95s cubic-bezier(0.22,1,0.36,1)" }}>
          <div className="w-full max-w-[440px] px-[14px] md:px-0 py-10 md:py-16 relative" style={{ perspective: 1200 }}>
            <section className="rounded-[20px] overflow-hidden paper-texture paper-card relative">
              <div className="absolute -top-12 -right-12 w-[200px] h-[200px] bg-[#C8A96E]/12 rounded-full blur-[26px] parallax-layer" style={{ transform: "translate(" + (parallax.x * -8) + "px, " + (parallax.y * -6) + "px)" }} />
              <div className="absolute -bottom-16 -left-16 w-[240px] h-[240px] bg-[#6B2D3C]/08 rounded-full blur-[28px] parallax-layer" style={{ transform: "translate(" + (parallax.x * 10) + "px, " + (parallax.y * 8) + "px)" }} />
              <div className="paisley-motif top-6 left-6 w-[44px] h-[44px]"><svg viewBox="0 0 44 44" fill="none"><path d="M8 20 C8 8, 20 4, 28 12 C34 18, 30 28, 20 30 C12 32, 6 26, 8 20 Z M18 18 C18 14, 22 12, 26 16" stroke="#6B2D3C" strokeWidth="0.5" opacity="0.9"/><circle cx="26" cy="16" r="1" fill="#C8A96E" opacity="0.6"/></svg></div>
              <div className="paisley-motif top-6 right-6 w-[44px] h-[44px] rotate-90"><svg viewBox="0 0 44 44" fill="none"><path d="M8 20 C8 8, 20 4, 28 12 C34 18, 30 28, 20 30 C12 32, 6 26, 8 20 Z M18 18 C18 14, 22 12, 26 16" stroke="#6B2D3C" strokeWidth="0.5"/><circle cx="26" cy="16" r="1" fill="#C8A96E" opacity="0.6"/></svg></div>
              <div className="paisley-motif bottom-6 left-6 w-[44px] h-[44px] -rotate-90"><svg viewBox="0 0 44 44" fill="none"><path d="M8 20 C8 8, 20 4, 28 12 C34 18, 30 28, 20 30 C12 32, 6 26, 8 20 Z M18 18 C18 14, 22 12, 26 16" stroke="#6B2D3C" strokeWidth="0.5"/><circle cx="26" cy="16" r="1" fill="#C8A96E" opacity="0.6"/></svg></div>
              <div className="paisley-motif bottom-6 right-6 w-[44px] h-[44px] rotate-180"><svg viewBox="0 0 44 44" fill="none"><path d="M8 20 C8 8, 20 4, 28 12 C34 18, 30 28, 20 30 C12 32, 6 26, 8 20 Z M18 18 C18 14, 22 12, 26 16" stroke="#6B2D3C" strokeWidth="0.5"/><circle cx="26" cy="16" r="1" fill="#C8A96E" opacity="0.6"/></svg></div>
              <div className="absolute top-0 right-0 w-[120px] opacity-[0.09] pointer-events-none"><svg viewBox="0 0 120 200" fill="none"><path d="M60 10 Q65 30 55 60 Q50 90 60 120 Q70 150 60 190" stroke="#6B2D3C" strokeWidth="0.6"/><path d="M55 50 Q35 45 20 35 Q30 48 55 50" stroke="#6B2D3C" strokeWidth="0.4" fill="rgba(107,45,60,0.06)"/><path d="M65 80 Q85 75 100 60 Q88 78 65 80" stroke="#6B2D3C" strokeWidth="0.4" fill="rgba(107,45,60,0.06)"/><path d="M58 110 Q38 105 22 92 Q34 108 58 110" stroke="#6B2D3C" strokeWidth="0.4" fill="rgba(107,45,60,0.06)"/></svg></div>
              <div className="absolute bottom-0 left-0 w-[120px] opacity-[0.08] pointer-events-none rotate-180"><svg viewBox="0 0 120 200" fill="none"><path d="M60 10 Q65 30 55 60 Q50 90 60 120 Q70 150 60 190" stroke="#6B2D3C" strokeWidth="0.6"/><path d="M55 50 Q35 45 20 35 Q30 48 55 50" stroke="#6B2D3C" strokeWidth="0.4" fill="rgba(107,45,60,0.06)"/></svg></div>
              <div className="relative p-10 md:p-12 text-center" style={{ transform: "translateY(-30px)", marginTop: "8px" }}>
                <div className="text-[10px] tracking-[0.44em] text-[#6B2D3C]/50 font-light">TOGETHER WITH THEIR FAMILIES</div>
                <div className="mt-9 flex justify-center"><div className="w-[1px] h-9 bg-gradient-to-b from-[#C8A96E]/0 via-[#C8A96E]/55 to-[#C8A96E]/0" /></div>
                <h1 className="serif font-light text-[58px] md:text-[62px] leading-[0.88] tracking-[-0.025em] mt-8 ink-bleed flex flex-col items-center" style={{ fontWeight: 300, fontStyle: "italic" }}>
                  <span className="block">{WEDDING.bride}</span>
                  <span className="block my-[6px] text-[22px] gold-foil tracking-[0.22em] font-normal not-italic leading-none" data-text="&" style={{ lineHeight: "1" }}>&</span>
                  <span className="block">{WEDDING.groom}</span>
                </h1>
                <div className="mt-7 text-[10px] tracking-[0.42em] text-[#6B2D3C]/50 font-light">ARE GETTING MARRIED</div>
                <div className="mt-6 flex flex-col items-center gap-1">
                  <span className="text-[14px] tracking-[0.30em] gold-foil" data-text="APRIL 2026">APRIL 2026</span>
                  <span className="text-[10px] tracking-[0.18em] text-[#6B2D3C]/40 mt-1">{WEDDING.formalGroom} • formal</span>
                </div>
                <div className="mt-12 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/28 to-transparent" />
                <div className="mt-7 flex items-center justify-center gap-3 text-[12px] text-[#6B2D3C]/60">
                  <span className="tracking-[0.04em]">{WEDDING.venue}</span>
                  <span className="w-[2px] h-[2px] rounded-full bg-[#C8A96E]/70" />
                  <span className="tracking-[0.04em]">{WEDDING.city}</span>
                </div>
              </div>
              <div className="vignette-soft" />
            </section>

            <section data-reveal="events" className={"mt-[24px] paper-texture paper-card rounded-[20px] p-8 md:p-10 reveal " + (revealed.has("events") ? "is-visible" : "")}>
              <div className="text-center">
                <div className="text-[10px] tracking-[0.44em] gold-foil" data-text="THE CELEBRATION">THE CELEBRATION</div>
                <div className="mt-9 space-y-9">{WEDDING.events.map((ev, i) => (<div key={ev.name} className="relative"><div className="flex items-start gap-5 text-left"><div className="w-[38px] h-[38px] rounded-full border border-[#C8A96E]/30 flex items-center justify-center shrink-0 mt-1 bg-white/40"><span className="w-[3px] h-[3px] rounded-full bg-[#C8A96E] shadow-[0_0_6px_rgba(200,169,110,0.6)]" /></div><div className="flex-1"><div className="flex items-baseline gap-3"><span className="serif text-[18px] tracking-[0.08em] font-medium">{ev.name}</span><span className="text-[10px] tracking-[0.18em] text-[#C8A96E]">{ev.time}</span></div><div className="mt-1 text-[12px] tracking-[0.08em] text-[#6B2D3C]/60">{ev.date}</div><div className="mt-2 serif italic text-[13px] leading-[1.55] text-[#4A1C26]/70">{ev.desc}</div></div></div>{i < WEDDING.events.length - 1 && <div className="ml-[19px] mt-7 mb-1 w-[1px] h-7 bg-gradient-to-b from-[#C8A96E]/30 to-transparent" />}</div>))}</div>
              </div>
              <div className="mt-10 flex justify-center"><div className="w-12 h-[1px] bg-[#C8A96E]/30" /></div>
            </section>

            <section className="mt-[24px] rounded-[20px] overflow-hidden relative h-[88vh] paper-card">
              <div className="sticky top-0 h-[88vh] w-full overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop" alt="cinematic full" className="absolute inset-0 w-full h-full object-cover" style={{ transform: "scale(" + (1 + scrollProgress * 0.0014) + ")", transition: "transform 0.2s linear" }} />
                <div className="absolute inset-0 bg-[#4A1C26]/42 backdrop-blur-[0.5px]" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#4A1C26]/12 via-transparent to-[#2e1218]/72" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8" style={{ transform: "translateY(-18px)" }}>
                  <div className="serif text-[#FFFDF7] text-[36px] leading-[1.08] italic font-light ink-bleed max-w-[270px]" style={{ animation: "fadeInUp 1s both", fontWeight: 300 }}>The beginning of forever.</div>
                  <div className="h-[1px] bg-[#E8DCC6]/60 mt-7 w-12" />
                  <div className="mt-5 text-[10px] tracking-[0.34em] text-[#E8DCC6]/70">APRIL 2026</div>
                </div>
              </div>
            </section>

            <section data-reveal="countdown" className={"mt-[24px] paper-texture paper-card rounded-[20px] p-9 md:p-12 text-center relative overflow-hidden reveal " + (revealed.has("countdown") ? "is-visible" : "")}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[240px] h-[240px] bg-[#C8A96E]/10 rounded-full blur-[28px]" />
              <div className="absolute bottom-0 right-0 w-[180px] h-[180px] bg-[#6B2D3C]/05 rounded-full blur-[22px]" />
              <div className="text-[10px] tracking-[0.42em] gold-foil" data-text="COUNTING THE DAYS">COUNTING THE DAYS</div>
              <div className="mt-10 flex justify-center items-baseline gap-1">
                <div className="serif text-[108px] md:text-[122px] leading-none font-extralight tracking-[-0.04em] ink-bleed" style={{ fontWeight: 100 }}>{String(count.d).padStart(3, "0")}</div>
              </div>
              <div className="text-[11px] tracking-[0.38em] text-[#6B2D3C]/45 -mt-3 font-light">DAYS</div>
              <div className="mt-12 flex justify-center gap-10 md:gap-14">{[{ v: count.h, l: "HOURS" }, { v: count.m, l: "MINUTES" }, { v: count.s, l: "SECONDS" }].map((it) => (<div key={it.l} className="text-center"><div className="serif text-[32px] font-extralight tracking-[0.01em]" style={{ fontWeight: 200 }}>{String(it.v).padStart(2, "0")}</div><div className="text-[9px] tracking-[0.30em] text-[#C8A96E] mt-1">{it.l}</div></div>))}</div>
              <div className="mt-12 flex justify-center"><div className="w-[1px] h-12 bg-gradient-to-b from-[#C8A96E]/0 via-[#C8A96E]/35 to-[#C8A96E]/0" /></div>
              <div className="mt-7 serif italic text-[14px] text-[#4A1C26]/55 tracking-[0.01em]">Until we say I do</div>
            </section>

            <section data-reveal="venue" className={"mt-[24px] paper-texture paper-card rounded-[20px] p-9 md:p-12 text-center relative overflow-hidden reveal " + (revealed.has("venue") ? "is-visible" : "")}>
              <div className="absolute top-0 left-0 w-[80px] h-[80px] opacity-[0.06]"><svg viewBox="0 0 80 80" fill="none"><path d="M10 70 C10 20, 60 10, 70 30 C60 20, 20 20, 10 70" stroke="#6B2D3C" strokeWidth="0.5"/></svg></div>
              <svg viewBox="0 0 200 80" className="mx-auto w-[150px] opacity-[0.38]" fill="none"><path d="M20 70 L20 30 Q20 10 100 10 Q180 10 180 30 L180 70 M40 70 L40 35 Q40 20 100 20 Q160 20 160 35 L160 70 M70 70 L70 40 Q70 30 100 30 Q130 30 130 40 L130 70" stroke="#6B2D3C" strokeWidth="0.7" strokeLinecap="round" /><circle cx="100" cy="12" r="1" fill="#C8A96E" /></svg>
              <div className="mt-7 text-[10px] tracking-[0.42em] text-[#6B2D3C]/50">THE WEDDING</div>
              <h3 className="serif text-[44px] leading-[0.92] mt-5 gold-foil embossed font-light tracking-[-0.01em]" data-text={WEDDING.venue}>{WEDDING.venue}</h3>
              <div className="mt-4 text-[13px] tracking-[0.12em] text-[#6B2D3C]/70">{WEDDING.city}</div>
              <div className="mt-2 text-[12px] tracking-[0.18em] gold-foil" data-text="April 15, 2026 · 10:30 AM">April 15, 2026 · 10:30 AM</div>
              <div className="mt-10"><a href="https://maps.google.com/?q=Hyderabad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-7 py-[13px] rounded-full border border-[#C8A96E]/40 text-[11px] tracking-[0.28em] text-[#6B2D3C] hover:bg-[#F5EEDF] active:scale-[0.97] transition"><span className="w-1 h-1 rounded-full bg-[#C8A96E]" />VIEW LOCATION</a></div>
              <div className="mt-10 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8A96E]/20 to-transparent" />
              <div className="mt-6 serif italic text-[12px] text-[#4A1C26]/50">A celebration under open skies</div>
            </section>

            <section data-reveal="rsvp" className={"mt-[24px] paper-texture paper-card rounded-[20px] p-9 md:p-12 text-center reveal " + (revealed.has("rsvp") ? "is-visible" : "")}>
              <div className="text-[10px] tracking-[0.42em] text-[#6B2D3C]/50">WE WOULD LOVE TO HAVE YOU</div>
              <p className="serif italic text-[19px] leading-[1.6] mt-7 max-w-[310px] mx-auto text-[#4A1C26]/80 font-light">Your presence is the most precious part of our celebration.</p>
              <button onClick={() => setShowRSVP(true)} className="mt-9 px-9 py-[15px] rounded-full bg-[#4A1C26] text-[#FFFDF7] text-[11px] tracking-[0.34em] shadow-[0_8px_22px_rgba(74,28,38,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] active:scale-[0.97] transition hover:bg-[#5a2330]">RSVP</button>
              <div className="mt-9 flex justify-center gap-2"><span className="w-[3px] h-[3px] rounded-full bg-[#C8A96E]/40" /><span className="w-[3px] h-[3px] rounded-full bg-[#C8A96E]/40" /><span className="w-[3px] h-[3px] rounded-full bg-[#C8A96E]/40" /></div>
            </section>

            <section className="mt-[24px] rounded-[20px] overflow-hidden paper-burgundy paper-card relative min-h-[90vh] flex flex-col items-center justify-center p-10 text-center" data-reveal="final" style={{ animation: revealed.has("final") ? "breatheFrame 6s ease-in-out infinite" : "none" }}>
              <svg viewBox="0 0 300 440" className="absolute inset-3 w-[calc(100%-24px)] h-[calc(100%-24px)] pointer-events-none" fill="none" style={{ animation: "breatheFrame 7s ease-in-out infinite" }}>
                <rect x="10" y="10" width="280" height="420" rx="16" stroke="#C8A96E" strokeWidth="0.7" strokeOpacity="0.38" style={{ strokeDasharray: 1500, strokeDashoffset: revealed.has("final") ? 0 : 1500, transition: "stroke-dashoffset 2.6s ease" }} />
                <rect x="18" y="18" width="264" height="404" rx="12" stroke="#C8A96E" strokeWidth="0.35" strokeOpacity="0.20" />
                <path d="M36 28 Q 56 18 76 28 T 116 26 Q 146 24 176 28 T 216 26 Q 246 24 264 32" stroke="#C8A96E" strokeWidth="0.5" opacity="0.36" />
                <path d="M36 412 Q 56 422 76 412 T 116 414 Q 146 416 176 412 T 216 414 Q 246 416 264 408" stroke="#C8A96E" strokeWidth="0.5" opacity="0.26" />
                <g opacity="0.28">
                  <path d="M20 20 Q24 14 30 20 T36 26" stroke="#C8A96E" strokeWidth="0.4" fill="none"/>
                  <path d="M280 20 Q276 14 270 20 T264 26" stroke="#C8A96E" strokeWidth="0.4" fill="none"/>
                  <path d="M20 420 Q24 426 30 420 T36 414" stroke="#C8A96E" strokeWidth="0.4" fill="none"/>
                  <path d="M280 420 Q276 426 270 420 T264 414" stroke="#C8A96E" strokeWidth="0.4" fill="none"/>
                </g>
              </svg>
              <div className="relative z-10" style={{ transform: "translateY(-12px)" }}>
                <div className="text-[10px] tracking-[0.44em] text-[#E8DCC6]/70 font-light">WITH LOVE</div>
                <h4 className="serif text-[48px] leading-[0.92] mt-9 text-[#FFFDF7] font-light italic tracking-[-0.015em]" style={{ fontWeight: 300 }}>
                  {WEDDING.bride}<span className="block my-2 text-[22px] gold-foil not-italic tracking-[0.22em]" data-text="&">&</span>{WEDDING.groom}
                </h4>
                <div className="mt-9 text-[13px] tracking-[0.30em] gold-foil" data-text="APRIL 2026">APRIL 2026</div>
                <div className="mt-2 text-[10px] tracking-[0.18em] text-[#E8DCC6]/40">{WEDDING.formalGroom}</div>
                <div className="mt-8 serif italic text-[14px] text-[#E8DCC6]/70 max-w-[220px] mx-auto leading-[1.65] font-light">We can’t wait to celebrate with you.</div>
                <div className="mt-14 text-[9px] tracking-[0.40em] text-[#E8DCC6]/40">THE BEGINNING OF FOREVER</div>
              </div>
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(18)].map((_, i) => (
                  <div key={i} className="absolute w-[2px] h-[2px] rounded-full bg-[#E8DCC6] animate-[particleFloat_5s_ease-in-out_infinite]" style={{ left: (8 + i * 5.4) + "%", top: (18 + (i % 6) * 13) + "%", animationDelay: (i * 0.28) + "s", animationDuration: (4.5 + (i % 3)) + "s" } as any} />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-black/35 to-transparent pointer-events-none" />
            </section>
            <div className="h-[70px]" />
          </div>
        </div>
      )}
      {showRSVP && (
        <>
          <div className="fixed inset-0 z-[80] bg-[#2e1218]/60 backdrop-blur-[8px] animate-[fadeInUp_0.3s]" onClick={() => setShowRSVP(false)} />
          <div className="fixed z-[90] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-[380px] animate-[fadeInUp_0.5s_cubic-bezier(0.22,1,0.36,1)]">
            <div className="paper-texture paper-card rounded-[20px] p-8 md:p-9 relative overflow-hidden border border-white/60">
              <button onClick={() => setShowRSVP(false)} className="absolute top-5 right-5 w-7 h-7 rounded-full border border-[#C8A96E]/20 flex items-center justify-center text-[#6B2D3C]/60 text-[14px]">×</button>
              <div className="text-[10px] tracking-[0.38em] gold-foil" data-text="R S V P">R S V P</div>
              <h5 className="serif text-[26px] mt-3 font-light">Will you join us?</h5>
              {!submitted ? (
                <>
                  <div className="mt-8 space-y-6">
                    <div><label className="text-[10px] tracking-[0.24em] text-[#6B2D3C]/50">YOUR NAME</label><input value={nameVal} onChange={(e) => setNameVal(e.target.value)} placeholder="Handwritten here..." className="mt-2 w-full bg-transparent border-0 border-b border-[#C8A96E]/30 pb-2 text-[15px] serif italic placeholder:text-[#6B2D3C]/30 focus:outline-none focus:border-[#C8A96E] transition" /></div>
                    <div><label className="text-[10px] tracking-[0.24em] text-[#6B2D3C]/50">NUMBER OF GUESTS</label><select value={guests} onChange={(e) => setGuests(e.target.value)} className="mt-2 w-full bg-transparent border-0 border-b border-[#C8A96E]/30 pb-2 text-[14px] focus:outline-none bg-transparent"><option>1 Guest</option><option>2 Guests</option><option>3 Guests</option><option>4 Guests</option></select></div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button onClick={() => setRsvpStatus("accept")} className={"py-3 rounded-full text-[10px] tracking-[0.18em] border transition " + (rsvpStatus === "accept" ? "bg-[#4A1C26] text-[#FFFDF7] border-[#4A1C26]" : "border-[#C8A96E]/30 text-[#6B2D3C]/70")}>JOYFULLY ACCEPT</button>
                      <button onClick={() => setRsvpStatus("decline")} className={"py-3 rounded-full text-[10px] tracking-[0.18em] border transition " + (rsvpStatus === "decline" ? "bg-[#4A1C26] text-[#FFFDF7] border-[#4A1C26]" : "border-[#C8A96E]/30 text-[#6B2D3C]/70")}>REGRETFULLY DECLINE</button>
                    </div>
                  </div>
                  <button onClick={() => setSubmitted(true)} className="mt-8 w-full py-[14px] rounded-full bg-[#C8A96E] text-[#2A1518] text-[11px] tracking-[0.28em] font-medium active:scale-[0.98] transition shadow-[0_6px_16px_rgba(200,169,110,0.35)]">SEND RESPONSE</button>
                  <div className="mt-4 text-center text-[10px] tracking-[0.12em] text-[#6B2D3C]/40">Response collected locally for preview</div>
                </>
              ) : (
                <div className="mt-10 text-center py-6"><div className="w-10 h-10 mx-auto rounded-full border border-[#C8A96E]/30 flex items-center justify-center text-[#C8A96E]">✓</div><div className="serif text-[22px] mt-5 italic">Thank you, {nameVal || "dear"}.</div><div className="mt-2 text-[12px] leading-[1.6] text-[#6B2D3C]/60 max-w-[240px] mx-auto">Your response has been noted with love. We cannot wait to celebrate with you in April 2026.</div><button onClick={() => setShowRSVP(false)} className="mt-8 text-[10px] tracking-[0.3em] text-[#C8A96E]">CLOSE</button></div>
              )}
              <div className="pointer-events-none absolute -bottom-12 -right-12 w-40 h-40 bg-[#C8A96E]/10 rounded-full blur-[18px]" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
