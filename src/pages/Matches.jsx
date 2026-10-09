import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { Send, Lock } from "lucide-react";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className="flex justify-center items-center h-[70vh]"><span className="loading loading-spinner text-primary loading-lg"></span></div>;

  return (
    <div className="flex-grow py-10 px-4 max-w-[800px] mx-auto w-full relative z-10">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Messages</h1>
          <p className="text-sm text-white/50 mt-1">Connect with your matches and collaborators.</p>
        </div>
      </div>

      <div className="bg-[#16161a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden">
        {matches.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/50">You don't have any matches yet. Keep swiping!</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {matches.map((match, idx) => (
              <Link 
                key={match._id} 
                to={`/chat/${match._id}`}
                state={{ matchUser: match }}
                className={`p-5 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer ${idx !== matches.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={match.photourl} className="w-14 h-14 rounded-full object-cover border border-white/10" />
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#16161a] rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{match.firstName} {match.lastName}</h3>
                    <p className="text-sm text-primary font-medium">New Match! Tap to connect</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 group-hover:bg-primary group-hover:text-white transition-colors">
                    <Send size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
