import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { ProfileCard } from "./Profile";
import { X, CheckCircle, XCircle } from "lucide-react";
import { decrementPendingCount } from "../store/requestsSlice";

const Connections = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className="flex-grow py-10 px-4 max-w-[1200px] mx-auto w-full">
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
            <div className="flex flex-col gap-4 max-w-4xl">
              {requests.map(req => (
                <div key={req._id} className="bg-[#1e1e24] rounded-2xl border border-white/10 p-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 shadow-xl hover:bg-white/5 transition-all group">
                  
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-4 w-full lg:w-1/3 min-w-[250px]">
                    <div className="relative shrink-0">
                      <img src={req.fromUserId.photourl} className="w-14 h-14 rounded-full object-cover shadow-lg border border-[#1e1e24]" />
                      <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#1e1e24]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base text-white truncate hover:text-primary cursor-pointer transition-colors" onClick={() => setSelectedMatch({...req.fromUserId, isPreviewOnly: true})}>
                        {req.fromUserId.firstName} {req.fromUserId.lastName}
                      </h3>
                      <p className="text-xs text-white/50 truncate">{req.fromUserId.headline}</p>
                    </div>
                  </div>

                  {/* Middle: Message */}
                  <div className="flex-1 w-full bg-black/20 rounded-xl p-3 border border-white/5 relative">
                    <p className="text-sm text-white/80 italic line-clamp-2">"{req.message || 'I would love to connect and collaborate!'}"</p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center justify-end gap-3 w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                    <button onClick={() => handleRequestAction(req._id, 'reject')} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-rose-500/20 text-white/40 hover:text-rose-400 transition-colors tooltip tooltip-bottom" data-tip="Decline">
                      <XCircle size={20} />
                    </button>
                    <button onClick={() => handleRequestAction(req._id, 'accept')} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-full text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                      Accept
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
            <div className="flex flex-col gap-4 max-w-4xl">
              {connections.map(conn => {
                const user = conn.user;
                return (
                  <div
                    key={conn._id}
                    onClick={() => navigate(`/chat/${user._id}`)}
                    className="bg-[#1e1e24] rounded-2xl border border-white/5 p-4 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 shadow-xl hover:bg-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group"
                  >
                    
                    {/* Left: Avatar & Info */}
                    <div className="flex items-center gap-4 w-full lg:w-1/2 min-w-[250px]">
                      <div className="relative shrink-0">
                        <img src={user.photourl} className="w-14 h-14 rounded-full object-cover shadow-lg border border-[#1e1e24]" />
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#1e1e24] shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                          <CheckCircle size={10} strokeWidth={3} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base text-white truncate group-hover:text-emerald-400 transition-colors">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-xs text-white/50 truncate">{user.headline}</p>
                      </div>
                    </div>

                    {/* Middle: Connection Date or Subtext (Optional) */}
                    <div className="flex-1 w-full lg:flex items-center justify-start hidden">
                      {user._id.length % 2 === 0 ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                          <p className="text-sm text-primary font-semibold italic">New message</p>
                        </div>
                      ) : (
                        <p className="text-sm text-white/40 italic">Connected</p>
                      )}
                    </div>

                    {/* Right: Message Action */}
                    <div className="flex items-center justify-end w-full lg:w-auto shrink-0 mt-2 lg:mt-0">
                      <div className="px-5 py-2.5 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white font-bold rounded-full text-sm transition-all flex items-center gap-2 shadow-lg group-hover:shadow-primary/20">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                        Message
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {selectedMatch && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-start p-4 bg-black/80 backdrop-blur-sm overflow-y-auto pt-28 pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full max-w-[800px] relative animate-in fade-in zoom-in duration-200 mt-2">
            {/* Profile Card */}
            <div className="relative">
              <button
                onClick={() => setSelectedMatch(null)}
                className="absolute -top-4 -right-4 md:-right-6 md:-top-6 w-12 h-12 bg-rose-500 hover:bg-rose-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all z-50 border-4 border-[#1e1e24]"
              >
                <X size={24} />
              </button>
              
              <ProfileCard
                data={selectedMatch.isConnection ? selectedMatch : { ...selectedMatch, githubUrl: null, linkedinUrl: null, portfolioUrl: null }}
                previewMode="desktop"
              />
            </div>

            {/* If it's an accepted connection -> Show Success Box */}
            {selectedMatch.isConnection && (
              <div className="mt-6 bg-[#1e1e24] rounded-2xl border border-emerald-500/30 p-6 flex flex-col sm:flex-row justify-between items-center pointer-events-auto shadow-2xl shadow-emerald-500/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10 text-center sm:text-left mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-2">
                    <CheckCircle size={20} /> Connection Unlocked!
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
