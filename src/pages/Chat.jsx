import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../utils/axios";
import { Send, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  const user = useSelector((store) => store.user);
  const { userId } = useParams();
  const location = useLocation();
  const [matchUser, setMatchUser] = useState(location.state?.matchUser || null);
  const [loading, setLoading] = useState(!location.state?.matchUser);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Future: Chat history state will go here!
  const [chatHistory, setChatHistory] = useState([]);
  const [socket, setSocket] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isConnectionSender, setIsConnectionSender] = useState(false);

  useEffect(() => {
    if (!matchUser) {
      fetchMatchUser();
    }
  }, [userId, matchUser]);

  // Handle Socket.io Connection
  useEffect(() => {
    // Wait until we have our own user data and the URL param
    if (!user || !userId) return;

    // 1. Establish the connection to the backend
    const socketConnection = createSocketConnection();
    setSocket(socketConnection);

    // 2. Generate a perfectly unique room ID for these two users
    // Sorting the IDs guarantees the string is identical for BOTH users!
    const matchId = [user._id, userId].sort().join("_");

    // 3. Tell the server to put us in this private room
    socketConnection.emit("joinChat", { matchId });

    // 4. Listen for incoming messages
    socketConnection.on("receiveMessage", (newMessage) => {
      setChatHistory((prev) => [...prev, newMessage]);
    });

    // Cleanup: Disconnect the socket when leaving the chat page
    return () => {
      socketConnection.disconnect();
    };
  }, [userId, user]);

  // Fetch Chat History when component mounts
  useEffect(() => {
    if (!user || !userId) return;
    const fetchHistory = async () => {
      try {
        const matchId = [user._id, userId].sort().join("_");
        const res = await api.get(`/chat/${matchId}`);
        if (res.data.success) {
          setChatHistory(res.data.data);
          setConnectionStatus(res.data.connectionStatus);
          setIsConnectionSender(res.data.isSender);
        }
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();
  }, [userId, user]);

  const fetchMatchUser = async () => {
    try {
      const res = await api.get(`/user/profile/${userId}`);
      setMatchUser(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendConnection = async (e) => {
    e.preventDefault();
    if (!requestMessage.trim()) return;

    try {
      setSending(true);
      await api.post(`/connection/send/${userId}`, { message: requestMessage });
      alert("Premium Connection Request Sent!");
      setShowRequestModal(false);
      setRequestMessage("");
      setConnectionStatus("pending");
      setIsConnectionSender(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;
    
    const matchId = [user._id, userId].sort().join("_");
    
    socket.emit("sendMessage", {
      matchId,
      senderId: user._id,
      text: message
    });
    
    setMessage("");
  };

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  if (!matchUser) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Match not found</h2>
      <Link to="/matches" className="btn btn-primary">Go back to Matches</Link>
    </div>
  );

  return (
    <div className="flex-grow flex justify-center w-full px-2 py-4 sm:p-6">
      <div className="w-full max-w-[1400px] bg-[#16161a] rounded-[2rem] border border-white/10 shadow-2xl flex overflow-hidden h-[calc(100vh-120px)]">

        {/* Left Side: Context Details Pane */}
        <div
          className="hidden md:flex shrink-0 border-r border-white/10 bg-[#121214] flex-col overflow-x-hidden overflow-y-auto custom-scrollbar"
          style={{ width: '550px', minWidth: '550px', maxWidth: '550px' }}
        >

          {/* Header Info (No Image) */}
          <div className="p-6 border-b border-white/5 bg-gradient-to-b from-[#1a1a20] to-[#121214] w-full">
            <h2 className="text-2xl font-black text-white tracking-tight leading-tight break-words">
              {matchUser.firstName} {matchUser.lastName}
            </h2>
            <p className="text-primary text-sm font-bold mt-1 tracking-wide break-words">
              {matchUser.username ? `@${matchUser.username}` : `${matchUser.age} years old`}
            </p>
            <p className="text-white/70 text-sm mt-3 leading-relaxed break-words">
              {matchUser.headline}
            </p>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Badges/Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Experience</span>
                <span className="text-white text-xs font-semibold capitalize">{matchUser.experienceLevel || "Not set"}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Looking For</span>
                <span className="text-white text-xs font-semibold capitalize">{matchUser.lookingFor || "Connections"}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Availability</span>
                <span className="text-white text-xs font-semibold capitalize">{matchUser.availability || "Not set"}</span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">Gender & Age</span>
                <span className="text-white text-xs font-semibold capitalize">
                  {matchUser.gender || "Unspecified"}{matchUser.age ? `, ${matchUser.age}` : ""}
                 </span>
              </div>
            </div>

            {matchUser.about && (
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">About Me</h3>
                <p className="text-white/80 text-sm leading-relaxed break-words whitespace-pre-wrap">{matchUser.about}</p>
              </div>
            )}

            {matchUser.skills?.length > 0 && (
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {matchUser.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary font-semibold text-[11px] rounded-lg border border-primary/20 break-words">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchUser.interests?.length > 0 && (
              <div className="flex flex-col gap-2 min-w-0">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {matchUser.interests.map((interest, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 text-white/80 font-semibold text-[11px] rounded-lg border border-white/10 break-words">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {matchUser.projects?.length > 0 && (
              <div className="flex flex-col gap-3 min-w-0">
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Featured Projects</h3>
                <div className="flex flex-col gap-3">
                  {matchUser.projects.map((proj, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10 transition-colors min-w-0 relative overflow-hidden group">
                      <h4 className="text-white font-bold text-sm mb-1 break-words">{proj.title}</h4>
                      <p className="text-white/60 text-xs leading-relaxed break-words whitespace-pre-wrap">{proj.description}</p>
                      {connectionStatus === "accepted" ? (
                        proj.link && (
                          <a href={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors w-fit">
                            View Project
                          </a>
                        )
                      ) : (
                        proj.link && (
                          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 rounded-lg border border-white/5 text-[10px] text-white/50 font-bold uppercase tracking-wider cursor-help w-fit" title="Send a Premium Request to unlock">
                            <Lock size={10} /> Link Locked
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 min-w-0 pb-4">
               <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest border-b border-white/10 pb-2">Social Links</h3>
               <div className="flex flex-col gap-2">
                 {connectionStatus === "accepted" ? (
                   <>
                     {matchUser.githubUrl && (
                       <a href={matchUser.githubUrl.startsWith('http') ? matchUser.githubUrl : `https://${matchUser.githubUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-xl">
                         <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                         </div>
                         <div>
                           <p className="text-white/90 text-xs font-bold">GitHub Profile</p>
                           <p className="text-emerald-400 text-[10px]">Unlocked</p>
                         </div>
                       </a>
                     )}
                     {matchUser.linkedinUrl && (
                       <a href={matchUser.linkedinUrl.startsWith('http') ? matchUser.linkedinUrl : `https://${matchUser.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-xl">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-blue-500"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                         </div>
                         <div>
                           <p className="text-white/90 text-xs font-bold">LinkedIn Profile</p>
                           <p className="text-emerald-400 text-[10px]">Unlocked</p>
                         </div>
                       </a>
                     )}
                     {matchUser.portfolioUrl && (
                       <a href={matchUser.portfolioUrl.startsWith('http') ? matchUser.portfolioUrl : `https://${matchUser.portfolioUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all rounded-xl">
                         <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                         </div>
                         <div>
                           <p className="text-white/90 text-xs font-bold">Portfolio Website</p>
                           <p className="text-emerald-400 text-[10px]">Unlocked</p>
                         </div>
                       </a>
                     )}
                   </>
                 ) : (
                   <>
                     <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed opacity-75">
                        <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center">
                           <Lock size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-bold">GitHub Profile</p>
                          <p className="text-white/40 text-[10px]">Unlock with Premium Request</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed opacity-75">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                           <Lock size={14} className="text-blue-500/60" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-bold">LinkedIn Profile</p>
                          <p className="text-white/40 text-[10px]">Unlock with Premium Request</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl cursor-not-allowed opacity-75">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                           <Lock size={14} className="text-primary/60" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-bold">Portfolio Website</p>
                          <p className="text-white/40 text-[10px]">Unlock with Premium Request</p>
                        </div>
                     </div>
                   </>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* Right Side: Chat Interface */}
        <div className="flex-1 min-w-0 flex flex-col bg-[#1e1e24] relative">

          {/* Chat Header */}
          <div className="h-[88px] border-b border-white/10 flex items-center justify-between px-6 bg-[#1e1e24] shrink-0">
            <div className="flex items-center gap-4">
              <Link to="/matches" className="md:hidden w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white mr-2 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <img src={matchUser.photourl} className="w-14 h-14 rounded-full object-cover border border-white/10" />
              <div className="overflow-hidden">
                <h3 className="font-bold text-white text-lg truncate">{matchUser.firstName} {matchUser.lastName}</h3>
                {connectionStatus === "accepted" ? (
                  <p className="text-xs text-emerald-400 font-medium truncate flex items-center gap-1">
                    <CheckCircle size={10} /> Full Access Unlocked
                  </p>
                ) : (
                  <p className="text-xs text-primary font-medium truncate flex items-center gap-1">
                    <Lock size={10} /> Limited Chat Mode
                  </p>
                )}
              </div>
            </div>
            {/* Chat Header Actions */}
            {connectionStatus !== "accepted" && (
              <button 
                onClick={() => setShowRequestModal(true)} 
                disabled={connectionStatus === "pending"}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {connectionStatus === "pending" ? "Request Pending" : "Premium Request"}
              </button>
            )}
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-[#1a1a20]">
            {connectionStatus !== "accepted" && (
              <div className="flex justify-center my-4">
                <div className="bg-primary/10 border border-primary/20 px-6 py-4 rounded-2xl text-sm text-center max-w-lg shadow-inner">
                  <p className="text-primary font-bold mb-1">It's a Match! 🎉</p>
                  <p className="text-white/70 text-xs leading-relaxed">
                    You and {matchUser.firstName} have matched. Send a Premium Connection Request below to unlock their full professional links and unlimited chat.
                  </p>
                </div>
              </div>
            )}

            {chatHistory.map((msg, index) => {
              const isAi = msg.isAi;
              const isMe = !isAi && (msg.senderId._id === user._id || msg.senderId === user._id);
              
              // Format the timestamp
              const messageTime = msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";

              if (isAi) {
                return (
                  <div key={index} className="flex gap-3 max-w-[85%] mt-6 self-start w-full">
                    <div className="flex flex-col gap-1 items-start w-full">
                      <div className="flex items-center gap-2 px-1">
                        <span className="text-[10px] bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-bold uppercase tracking-wider flex items-center gap-1">
                          ✨ AI Assistant
                        </span>
                        {messageTime && (
                          <span className="text-[9px] text-white/30 font-medium">{messageTime}</span>
                        )}
                      </div>
                      <div className="rounded-2xl px-5 py-4 text-sm shadow-[0_0_20px_rgba(16,185,129,0.1)] border border-emerald-500/30 bg-[#16161a] text-white/90 rounded-tl-sm w-full leading-relaxed whitespace-pre-wrap relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={index} className={`flex gap-3 max-w-[85%] mt-4 ${isMe ? "self-end flex-row-reverse" : "self-start"}`}>
                  <div className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] text-white/40 font-medium uppercase tracking-wider">
                        {isMe ? "You" : msg.senderId.firstName}
                      </span>
                      {messageTime && (
                        <span className="text-[9px] text-white/30 font-medium">{messageTime}</span>
                      )}
                    </div>
                    <div className={`rounded-2xl px-5 py-3 text-sm shadow-md border ${
                      isMe 
                      ? "bg-primary text-white rounded-tr-sm border-primary" 
                      : "bg-[#2a2a32] text-white/90 rounded-tl-sm border-white/5"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input Footer */}
          <div className="p-4 sm:p-6 bg-[#16161a] border-t border-white/10 shrink-0">
            {chatHistory.length >= 5 && connectionStatus !== "accepted" ? (
              <div className="bg-[#2a2a32] border border-white/10 rounded-xl p-4 text-center">
                <p className="text-white/80 text-sm mb-2">
                  You've reached the free message limit for this match.
                </p>
                {connectionStatus === "pending" ? (
                  <div className="px-4 py-2 bg-white/10 text-white/50 rounded-xl text-xs font-bold border border-white/10 inline-block">
                    {isConnectionSender ? "Waiting for them to accept your request..." : "Check your Network tab to accept their request!"}
                  </div>
                ) : (
                  <button onClick={() => setShowRequestModal(true)} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-primary/20">
                    Send Premium Request to Continue
                  </button>
                )}
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={`Message ${matchUser.firstName}...`}
                    className="flex-1 bg-[#1e1e24] text-white text-sm rounded-xl px-5 py-3 border border-white/10 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                  <button type="submit" disabled={!message.trim()} className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center shrink-0">
                    <Send size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Premium Request Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e1e24] rounded-3xl border border-white/10 p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 relative">
            <h3 className="text-xl font-black text-white mb-2">Unlock Full Profile</h3>
            <p className="text-sm text-white/60 mb-6">Send a premium connection request to {matchUser.firstName}. If accepted, you can view all their links and chat without limits!</p>

            <form onSubmit={handleSendConnection}>
              <textarea
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                placeholder="Hi! I'd love to collaborate with you on..."
                className="w-full h-32 bg-black/20 border border-white/10 rounded-xl p-4 text-white text-sm focus:border-primary focus:outline-none resize-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowRequestModal(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white/50 hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={sending || !requestMessage.trim()} className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg transition-all disabled:opacity-50">
                  {sending ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
