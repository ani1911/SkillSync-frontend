import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../utils/axios";
import { ProfileCard } from "./Profile";
import { X, CheckCircle, XCircle } from "lucide-react";
import { decrementPendingCount } from "../store/requestsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("connections"); // 'requests', 'connections'
  
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    fetchTab(activeTab);
  }, [activeTab]);

  const fetchTab = async (tab) => {
    setLoading(true);
    try {
      if (tab === "requests") {
        const res = await api.get("/user/requests/pending");
        setRequests(res.data.data);
      } else if (tab === "connections") {
        const res = await api.get("/user/connectionlist");
        setConnections(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await api.patch(`/connection/${action}/${requestId}`);
      setRequests(requests.filter(r => r._id !== requestId));
      dispatch(decrementPendingCount());
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed action");
    }
  };

  return (
    <div className="flex-grow py-10 px-4 relative z-10 max-w-[1200px] mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-white tracking-tight">Your Network</h1>
        <p className="text-[14px] text-white/50 mt-1">Manage your active connections and premium requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-white/10 mb-8 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('connections')} 
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'connections' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
        >
          My Connections
        </button>
        <button 
          onClick={() => setActiveTab('requests')} 
          className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'requests' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'}`}
        >
          Pending Requests
          {activeTab !== 'requests' && requests.length > 0 && <span className="ml-2 w-2 h-2 bg-error rounded-full inline-block"></span>}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner text-primary loading-lg"></span>
        </div>
      )}

      {!loading && activeTab === 'requests' && (
        <>
          {requests.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/50">You have no pending premium requests.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requests.map(req => (
                <div key={req._id} className="bg-[#1e1e24] rounded-2xl border border-white/10 p-6 flex flex-col gap-5 shadow-xl hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={req.fromUserId.photourl} className="w-16 h-16 rounded-full object-cover shadow-lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-white truncate">{req.fromUserId.firstName} {req.fromUserId.lastName}</h3>
                      <p className="text-xs text-white/60 truncate">{req.fromUserId.headline}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedMatch({...req.fromUserId, isPreviewOnly: true})}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-semibold transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 relative">
                     <div className="absolute top-0 left-4 -translate-y-1/2 px-2 bg-[#1e1e24] text-[10px] font-bold text-primary uppercase tracking-widest">Premium Request Message</div>
                     <p className="text-sm text-white/90 italic leading-relaxed">"{req.message || 'I would love to connect and collaborate!'}"</p>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-2">
                     <button onClick={() => handleRequestAction(req._id, 'reject')} className="px-5 py-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-white/60 font-semibold rounded-xl text-sm transition-all flex items-center gap-2">
                       <XCircle size={16} /> Decline
                     </button>
                     <button onClick={() => handleRequestAction(req._id, 'accept')} className="px-5 py-2 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                       <CheckCircle size={16} /> Accept Request
                     </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && activeTab === 'connections' && (
        <>
          {connections.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-white/50">You don't have any connections yet. Accept a request to unlock full profiles!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {connections.map(conn => {
                const user = conn.user;
                return (
                  <div 
                    key={conn._id} 
                    onClick={() => setSelectedMatch({...user, isConnection: true})} 
                    className="bg-[#1e1e24] rounded-2xl border border-emerald-500/30 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all hover:-translate-y-1 shadow-[0_0_30px_rgba(16,185,129,0.1)] group flex flex-col"
                  >
                    <div className="h-48 overflow-hidden relative shrink-0">
                      <img src={user.photourl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e24] to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-white/70 line-clamp-1">{user.headline}</p>
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex items-center justify-center bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                      <span className="text-xs font-bold text-emerald-400">View Full Profile</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
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

            {/* Profile Card */}
            <div className={selectedMatch.isConnection ? "pointer-events-auto" : "pointer-events-none"}>
              <ProfileCard 
                data={selectedMatch.isConnection ? selectedMatch : {...selectedMatch, githubUrl: null, linkedinUrl: null, portfolioUrl: null}} 
                previewMode="desktop" 
              />
            </div>

            {/* If it's an accepted connection -> Show Success Box */}
            {selectedMatch.isConnection && (
              <div className="mt-6 bg-[#1e1e24] rounded-2xl border border-emerald-500/30 p-6 flex flex-col sm:flex-row justify-between items-center pointer-events-auto shadow-2xl shadow-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-2">
                    <CheckCircle size={20}/> Connection Unlocked!
                  </h3>
                  <p className="text-sm text-white/60 mt-1">You have full access to their professional links. Chat coming soon!</p>
                </div>
                <button onClick={() => setSelectedMatch(null)} className="relative z-10 px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all">Close Profile</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Connections;
