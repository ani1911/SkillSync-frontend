import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFeed, removeFromFeed, setFeedLoading, appendFeed } from "../store/feedSlice";
import axiosInstance from "../utils/axios";
import { X, Heart } from "lucide-react";
import UserCard, { FALLBACK_AVATAR } from "../components/UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const { users, page, hasMore, loading } = useSelector((store) => store.feed);
  const loggedInUser = useSelector((store) => store.user);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState("");
  const [sendingConnection, setSendingConnection] = useState(false);

  useEffect(() => {
    fetchFeed();
  }, [page]);

  const fetchFeed = async () => {
    if (!hasMore && page !== 1) return;
    try {
      dispatch(setFeedLoading(true));
      const endpoint = loggedInUser ? "/user/feed" : "/feed";
      const res = await axiosInstance.get(`${endpoint}?page=${page}&limit=10&t=${Date.now()}`);
      if (page === 1) {
        dispatch(setFeed({ users: res.data.feed, page, hasMore: res.data.feed.length > 0 }));
      } else {
        dispatch(appendFeed({ users: res.data.feed, hasMore: res.data.feed.length > 0 }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(setFeedLoading(false));
    }
  };

  const handleSwipe = async (action, userId) => {
    if (!loggedInUser) {

      dispatch(removeFromFeed(userId));
      setShowSignupModal(true);
      return;
    }

    const swipedUser = users.find(u => u._id === userId);

    try {
      dispatch(removeFromFeed(userId));
      const res = await axiosInstance.post(`/match/${action}/${userId}`);
      if (res.data.isMatch) {
        setMatchedUser(swipedUser);
      }
    } catch (err) {
      console.error("Swipe error:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        showSignupModal ||
        matchedUser ||
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (users.length === 0) return;
      const topUser = users[0];

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSwipe("dislike", topUser._id);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSwipe("like", topUser._id);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [users, showSignupModal, matchedUser, loggedInUser]);

  if (loading && users.length === 0 && !matchedUser) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  if (users.length === 0 && !matchedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="w-48 h-48 bg-base-200 rounded-full flex items-center justify-center mb-6 shadow-inner animate-pulse">
          <Heart size={64} className="text-base-content/20" />
        </div>
        <h2 className="text-2xl font-bold text-base-content mb-2 font-sans tracking-tight">You've caught up!</h2>
        <p className="text-base-content/60 max-w-md">There are no more developers in your area. Come back later for more connections or update your profile to increase visibility.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col justify-center items-center py-4 px-4 overflow-hidden relative">
      {/* Interactive Swipe & Keyboard Guide Pill (Shown only for guests / new users) */}
      {!loggedInUser && (
        <div className="flex items-center gap-3 px-4 py-2 mb-3 bg-[#1e1e24]/80 backdrop-blur-md rounded-full border border-white/10 text-xs text-white/70 shadow-xl select-none animate-in fade-in slide-in-from-top-2">
          <span className="flex items-center gap-1.5 text-rose-400 font-semibold">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[11px] text-white font-mono shadow-sm">←</kbd>
            Swipe Left to Pass
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            Swipe Right to Connect
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/10 text-[11px] text-white font-mono shadow-sm">→</kbd>
          </span>
        </div>
      )}

      <div className="relative w-full max-w-[800px] flex justify-center h-[75vh] max-h-[800px] min-h-[500px]">
        {users.slice(0, 3).reverse().map((user, reversedIndex) => {
          const actualIndex = Math.min(users.length, 3) - 1 - reversedIndex;
          return (
            <UserCard
              key={user._id}
              user={user}
              index={actualIndex}
              onSwipe={handleSwipe}
            />
          );
        })}
      </div>


      {showSignupModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1e1e24] p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-md w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none"></div>

            <button onClick={() => setShowSignupModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>

            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Don't lose this connection!</h2>
            <p className="text-white/60 mb-8 text-sm leading-relaxed">
              Create an account or login to connect with this developer and start collaborating on awesome projects.
            </p>

            <div className="flex flex-col gap-3">
              <a href="/signup" className="px-6 py-3.5 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 w-full">
                Create Free Account
              </a>
              <a href="/login" className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-all border border-white/10 w-full">
                Log In
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Match Modal */}
      {matchedUser && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in duration-300">
          <div className="bg-[#1e1e24] p-8 rounded-[2rem] border border-white/10 shadow-2xl max-w-lg w-full text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/20 rounded-full blur-3xl pointer-events-none"></div>

            <button onClick={() => setMatchedUser(null)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
              <X size={24} />
            </button>

            <div className="flex items-center justify-center gap-4 mb-6 relative">
              <img src={loggedInUser?.photourl || FALLBACK_AVATAR} alt="You" className="w-24 h-24 rounded-full border-4 border-success object-cover z-10 shadow-xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-[#1e1e24] rounded-full flex items-center justify-center z-20 shadow-lg border border-white/10">
                <Heart size={24} className="text-success fill-success" />
              </div>
              <img src={matchedUser.photourl || FALLBACK_AVATAR} alt={matchedUser.firstName} className="w-24 h-24 rounded-full border-4 border-success object-cover z-10 shadow-xl" />
            </div>

            <h2 className="text-4xl font-black text-white mb-2 tracking-tight drop-shadow-md">It's a Match!</h2>
            <p className="text-white/80 mb-6 text-sm font-medium">
              You and {matchedUser.firstName} have liked each other.
            </p>

            <div className="w-full text-left bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
              <label className="text-white/60 text-xs uppercase tracking-wider font-bold mb-2 block">Personalized Outreach</label>
              <textarea
                className="w-full bg-black/20 text-white rounded-lg p-3 outline-none border border-white/10 focus:border-success transition-colors resize-none"
                rows="3"
                placeholder={`Don't just say hi. Tell ${matchedUser.firstName} why you want to collaborate!`}
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={async () => {
                try {
                  setSendingConnection(true);
                  await axiosInstance.post(`/connection/send/${matchedUser._id}`, { message: connectionMessage });
                  setMatchedUser(null);
                  setConnectionMessage("");
                } catch (err) {
                  console.error(err);
                } finally {
                  setSendingConnection(false);
                }
              }}
              disabled={sendingConnection}
              className="px-8 py-4 bg-success hover:bg-success/90 text-white text-lg font-black rounded-xl transition-all shadow-lg shadow-success/20 w-full disabled:opacity-50"
            >
              {sendingConnection ? "Sending..." : "Send Connection Request"}
            </button>
            <button onClick={() => setMatchedUser(null)} className="mt-4 text-white/50 hover:text-white/80 text-sm font-semibold transition-colors">
              I'll do this later
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
