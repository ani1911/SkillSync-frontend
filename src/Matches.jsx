import React, { useEffect, useState } from "react";
import api from "./utils/axios";
import { ProfileCard } from "./Profile";
import { X, Send, Lock } from "lucide-react";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await api.get("/user/matches");
      setMatches(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendConnection = async (userId) => {
    try {
      setSending(true);
      await api.post(`/connection/send/${userId}`, { message });
      setMatches(matches.filter(m => m._id !== userId));
      setSelectedMatch(null);
      setMessage("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  return (
    <div className="flex-grow py-10 px-4 relative z-10 max-w-[1200px] mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-white tracking-tight">Your Matches</h1>
        <p className="text-[14px] text-white/50 mt-1">Send a premium connection request to unlock their full profile and start collaborating.</p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-white/50">You don't have any new matches. Keep swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.map((match) => (
            <div 
              key={match._id} 
              onClick={() => setSelectedMatch(match)}
              className="bg-[#1e1e24] rounded-2xl border border-white/10 overflow-hidden cursor-pointer hover:border-primary/50 transition-all hover:-translate-y-1 shadow-xl group flex flex-col"
            >
              <div className="h-48 overflow-hidden relative shrink-0">
                <img src={match.photourl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e24] via-[#1e1e24]/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {match.firstName} {match.lastName}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1">{match.headline}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-4 bg-white/5 group-hover:bg-white/10 transition-colors">
                <div className="text-[11px] text-white/60">
                   Mutual match! Click to view limited profile and send a premium request.
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-primary/80 flex items-center gap-1"><Lock size={12}/> Locked</span>
                  <button className="px-4 py-1.5 bg-primary/20 hover:bg-primary text-primary hover:text-white rounded-full text-[11px] font-bold transition-colors">
                    View & Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-start p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-10 pb-20">
          <div className="w-full max-w-[800px] relative animate-in fade-in zoom-in duration-200 mt-10">
            <button 
              onClick={() => setSelectedMatch(null)}
              className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-50"
            >
              <X size={20} />
            </button>

            {/* Render the profile card inside the modal. We lock the private links. */}
            <div className="pointer-events-none">
              <ProfileCard data={{...selectedMatch, githubUrl: null, linkedinUrl: null, portfolioUrl: null}} previewMode="desktop" />
            </div>

            {/* Premium Request Box */}
            <div className="mt-6 bg-[#1e1e24] rounded-2xl border border-primary/30 p-6 shadow-2xl relative overflow-hidden pointer-events-auto">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
               <h3 className="text-lg font-bold text-white mb-2">Send Premium Connection Request</h3>
               <p className="text-sm text-white/60 mb-4">Introduce yourself and explain why you want to collaborate. If accepted, you will unlock their professional links and unlimited chat.</p>
               
               <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 mb-4 resize-none relative z-10"
                  placeholder="Hey! I loved your React projects. I'm building a startup and need a frontend wizard..."
               />
               
               <div className="flex justify-end gap-3 relative z-10">
                 <button onClick={() => setSelectedMatch(null)} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white/50 hover:text-white hover:bg-white/5 transition-colors">
                   Cancel
                 </button>
                 <button 
                   onClick={() => handleSendConnection(selectedMatch._id)}
                   disabled={sending || !message.trim()}
                   className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
                 >
                   {sending ? "Sending..." : <><Send size={16} /> Send Request</>}
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
