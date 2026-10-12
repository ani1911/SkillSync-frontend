import React from "react";
import { X, Bot, Zap, ShieldCheck, Sparkles, Server, ArrowRight, Heart, Users, MessageSquareCode, CheckCircle2, Compass } from "lucide-react";

const workflowSteps = [
  {
    step: "1",
    title: "1. Discover",
    color: "text-primary bg-primary/20",
    desc: "Browse developer cards filtered by tech stack, or press [→] to swipe right.",
  },
  {
    step: "2",
    title: "2. Mutual Match",
    color: "text-rose-400 bg-rose-500/20",
    desc: "When two developers like each other, they instantly unlock in the Matches tab.",
  },
  {
    step: "3",
    title: "3. Connect",
    color: "text-sky-400 bg-sky-500/20",
    desc: "Send personalized pitches with invites; review & accept pending requests in Network.",
  },
  {
    step: "4",
    title: "4. Chat & @ai",
    color: "text-purple-400 bg-purple-500/20",
    desc: "Collaborate via real-time WebSockets & ask @ai for live architecture & debugging advice.",
  },
];

const technicalFeatures = [
  {
    icon: Bot,
    title: "Google Gemini AI Pair Programmer",
    tag: "AI Architecture",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    desc: "Type @ai in any private chat to receive context-aware debugging, architectural reviews, and code refactoring powered by Google Gemini LLM.",
  },
  {
    icon: Zap,
    title: "Real-Time WebSockets Engine",
    tag: "Socket.io",
    tagColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    desc: "Low-latency bidirectional private chat, real-time typing indicators, and instant notification dispatch without HTTP polling.",
  },
  {
    icon: ShieldCheck,
    title: "Razorpay Pro Monetization",
    tag: "Fintech Security",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    desc: "Integrated developer pass checkout with server-side HMAC-SHA256 cryptographic verification (crypto.timingSafeEqual) preventing timing & replay attacks.",
  },
  {
    icon: Server,
    title: "AWS EC2 & Nginx Reverse Proxy",
    tag: "Production DevOps",
    tagColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    desc: "Production Linux architecture featuring Nginx reverse proxy, HTTP/1.1 WebSocket protocol upgrades, same-origin cookie auth, and PM2 process management.",
  },
];

const FeaturesModal = ({ isOpen, onClose, onDemoClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#121215] border border-white/10 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-md">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>SkillSync Architecture Tour</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/50">Developer Collaboration Lifecycle & Technical Highlights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto space-y-4 py-4 pr-1 relative z-10 custom-scroll">
          {/* Section 1: The Collaboration Lifecycle */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 mb-3 flex items-center gap-1.5">
              <Compass size={13} /> The Developer Collaboration Lifecycle
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              {workflowSteps.map((s, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${s.color}`}>
                        {s.step}
                      </span>
                      {s.title}
                    </span>
                    <p className="text-[11px] text-white/60 leading-snug">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Technical Highlights */}
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2 px-1">
              Engineering Highlights
            </p>
            <div className="space-y-2.5">
              {technicalFeatures.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#1a1a20]/60 hover:bg-[#1a1a20] border border-white/5 hover:border-white/15 transition-all flex items-start gap-3.5"
                  >
                    <div className="p-2 rounded-xl bg-white/5 text-white/90 shrink-0 mt-0.5 border border-white/10">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-bold text-white">{f.title}</h3>
                        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${f.tagColor}`}>
                          {f.tag}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <p className="text-xs text-white/40 text-center sm:text-left">
            Built with React, Express, MongoDB Atlas, Socket.io & AWS EC2
          </p>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onDemoClick && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDemoClick();
                }}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-90 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Zap size={14} /> Try Demo Account <ArrowRight size={14} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs transition-colors"
            >
              Close Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesModal;
