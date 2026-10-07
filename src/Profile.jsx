import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "./utils/axios";
import { addUser } from "./store/userSlice";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";

const EXPERIENCE_BADGE = {
  beginner: { label: "Beginner", cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  intermediate: { label: "Intermediate", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
  advanced: { label: "Advanced", cls: "bg-rose-500/20 text-rose-400 border border-rose-500/30" },
};

const LOOKING_FOR_MAP = {
  collaborator: { icon: "🤝", label: "Collaborator" },
  mentor: { icon: "🎓", label: "Mentor" },
  project: { icon: "🚀", label: "Project Partner" },
  internship: { icon: "💼", label: "Internship" },
};

const AVAILABILITY_MAP = {
  "part-time": { icon: "⏱", label: "Part-time" },
  "full-time": { icon: "⚡", label: "Full-time" },
  weekends: { icon: "🗓", label: "Weekends" },
};

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CustomSelect = ({ label, name, value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <label className="block text-[13px] font-semibold text-white/50 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-[13px] text-left flex items-center justify-between transition-all hover:border-white/20 focus:outline-none focus:border-primary/50"
      >
        <span className={value ? "text-white" : "text-white/30"}>
          {selected ? selected.label : "Select"}
        </span>
        <span className={`text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <ChevronDown />
        </span>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-1 rounded-xl bg-[#1c1c1f] border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2
                ${value === opt.value
                  ? "bg-primary/15 text-primary font-semibold"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
            >
              {opt.icon && <span>{opt.icon}</span>}
              {opt.label}
              {value === opt.value && (
                <span className="ml-auto">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const TagInput = ({ label, value, onChange, placeholder, name, hint }) => {
  const [input, setInput] = useState("");
  const tags = typeof value === "string"
    ? value.split(",").map((s) => s.trim()).filter(Boolean)
    : value || [];

  const addTag = (raw) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) {
      onChange({ target: { name, value: [...tags, tag].join(", ") } });
    }
    setInput("");
  };

  const removeTag = (tag) => {
    onChange({ target: { name, value: tags.filter((t) => t !== tag).join(", ") } });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div>
      <label className="block text-[13px] font-semibold text-white/50 mb-2">{label}</label>
      <div className="min-h-[44px] flex flex-wrap gap-2 items-center px-3 py-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-primary/50 focus-within:bg-white/6 transition-all">
        {tags.map((tag, i) => (
          <span key={i} className="flex items-center gap-1 text-[12px] font-semibold px-2.5 py-1 rounded-lg bg-primary/15 text-primary border border-primary/20">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="opacity-50 hover:opacity-100 leading-none ml-0.5">×</button>
          </span>
        ))}
        <input
          type="text"
          className="flex-1 min-w-[100px] bg-transparent outline-none text-[13px] text-white placeholder-white/25"
          placeholder={tags.length === 0 ? placeholder : "Add more…"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => input.trim() && addTag(input)}
        />
      </div>
      {hint && <p className="text-[11px] text-white/25 mt-1.5">{hint}</p>}
    </div>
  );
};

const inputCls = "w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/10 text-[13px] text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-white/6 transition-all";

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <span className="text-[11px] font-bold uppercase tracking-widest text-white/25 shrink-0">{children}</span>
    <div className="flex-1 h-px bg-white/6" />
  </div>
);

const ProfileCard = ({ data }) => {
  const skills = typeof data.skills === "string"
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : data.skills || [];

  const interests = typeof data.interests === "string"
    ? data.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : data.interests || [];

  const expBadge = EXPERIENCE_BADGE[data.experienceLevel];
  const lookingFor = LOOKING_FOR_MAP[data.lookingFor];
  const availability = AVAILABILITY_MAP[data.availability];

  return (
    <div className="w-full max-w-[340px] mx-auto select-none">
      <div className="rounded-2xl overflow-hidden bg-[#18181b] border border-white/8 shadow-[0_32px_64px_rgba(0,0,0,0.5)]">
        <div className="relative h-60 overflow-hidden">
          <img
            src={data.photourl || FALLBACK_AVATAR}
            alt="profile"
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] via-[#18181b]/20 to-transparent" />
          {expBadge && (
            <span className={`absolute top-3 left-3 text-[11px] font-semibold px-2.5 py-1 rounded-full ${expBadge.cls}`}>
              {expBadge.label}
            </span>
          )}
          {availability && (
            <span className="absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/40 text-white/70 border border-white/10 backdrop-blur-sm">
              {availability.icon} {availability.label}
            </span>
          )}
        </div>

        <div className="p-5 space-y-3.5">
          <div>
            <h3 className="text-[18px] font-bold text-white leading-tight">
              {data.firstName || "Your Name"}{data.lastName ? ` ${data.lastName}` : ""}
              {data.age ? <span className="text-white/35 font-normal text-base ml-1.5">{data.age}</span> : null}
            </h3>
            {data.username && <p className="text-[12px] text-primary/60 font-medium mt-0.5">@{data.username}</p>}
            {data.headline && <p className="text-[12px] text-white/45 mt-1 leading-snug">{data.headline}</p>}
          </div>

          {data.about && (
            <p className="text-[12px] text-white/45 leading-relaxed line-clamp-2">{data.about}</p>
          )}

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/6 text-white/55 border border-white/8">
                  {skill}
                </span>
              ))}
              {skills.length > 5 && (
                <span className="text-[11px] px-2 py-1 text-white/25">+{skills.length - 5}</span>
              )}
            </div>
          )}

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {interests.slice(0, 4).map((interest, i) => (
                <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary/60 border border-primary/15">
                  {interest}
                </span>
              ))}
            </div>
          )}

          {lookingFor && (
            <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-white/4 border border-white/6">
              <span>{lookingFor.icon}</span>
              <span className="text-[12px] text-white/45">Looking for a <span className="text-white/70 font-semibold">{lookingFor.label}</span></span>
            </div>
          )}

          {(data.githubUrl || data.linkedinUrl) && (
            <div className="flex gap-2">
              {data.githubUrl && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/35 px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/6">
                  <GithubIcon /> GitHub
                </span>
              )}
              {data.linkedinUrl && (
                <span className="flex items-center gap-1.5 text-[11px] text-white/35 px-2.5 py-1.5 rounded-lg bg-white/4 border border-white/6">
                  <LinkedinIcon /> LinkedIn
                </span>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-0.5">
            <button type="button" className="flex-1 h-9 rounded-xl text-[13px] font-semibold bg-white/5 text-white/50 border border-white/8 hover:bg-white/8 transition-all">
              Pass
            </button>
            <button type="button" className="flex-1 h-9 rounded-xl text-[13px] font-semibold bg-primary text-white hover:bg-primary/90 transition-all">
              Connect ✦
            </button>
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-white/15 mt-3 tracking-wide">Live preview</p>
    </div>
  );
};

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", age: "", gender: "",
    headline: "", about: "", skills: "", interests: "", photourl: "",
    experienceLevel: "", lookingFor: "", availability: "",
    githubUrl: "", linkedinUrl: "", portfolioUrl: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        age: user.age || "",
        gender: user.gender || "",
        headline: user.headline || "",
        about: user.about || "",
        skills: user.skills ? user.skills.join(", ") : "",
        interests: user.interests ? user.interests.join(", ") : "",
        photourl: user.photourl || "",
        experienceLevel: user.experienceLevel || "",
        lookingFor: user.lookingFor || "",
        availability: user.availability || "",
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        portfolioUrl: user.portfolioUrl || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const toArray = (val) =>
        typeof val === "string" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val || [];

      const payload = { ...formData, skills: toArray(formData.skills), interests: toArray(formData.interests) };

      Object.keys(payload).forEach((key) => {
        if (payload[key] === "" || (Array.isArray(payload[key]) && payload[key].length === 0))
          delete payload[key];
      });

      const res = await api.patch("/profile/edit", payload);
      dispatch(addUser(res.data.data || res.data));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex-grow py-10 px-4 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-[28px] font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-[13px] text-white/35 mt-1">This is how you appear to others on SkillSync</p>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="w-full xl:w-[58%] rounded-2xl bg-[#111113] border border-white/8 shadow-2xl overflow-visible">
            {(error || success) && (
              <div className={`px-6 py-3 text-[13px] font-medium rounded-t-2xl ${error
                ? "bg-rose-500/10 text-rose-400 border-b border-rose-500/15"
                : "bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/15"}`}>
                {error || "✓ Profile saved successfully"}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-7">
              <div>
                <SectionTitle>Identity</SectionTitle>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">First Name</label>
                    <input name="firstName" type="text" className={inputCls} value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">Last Name</label>
                    <input name="lastName" type="text" className={inputCls} value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 text-[13px] pointer-events-none">@</span>
                      <input name="username" type="text" className={`${inputCls} pl-7`} value={formData.username} onChange={handleChange} placeholder="janedoe" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">Age</label>
                    <input name="age" type="number" className={inputCls} value={formData.age} onChange={handleChange} placeholder="24" min={16} />
                  </div>
                  <CustomSelect
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                      { value: "other", label: "Other" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <SectionTitle>Professional</SectionTitle>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">Headline</label>
                    <input name="headline" type="text" className={inputCls} value={formData.headline} onChange={handleChange} placeholder="Full Stack Developer · Open Source Enthusiast" maxLength={100} />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">About</label>
                    <textarea name="about" className={`${inputCls} h-24 py-3 resize-none`} value={formData.about} onChange={handleChange} placeholder="What are you building? What excites you?" maxLength={500} />
                  </div>
                  <TagInput name="skills" label="Skills — what you can do" value={formData.skills} onChange={handleChange} placeholder="React, Node.js, Python…" hint="Press Enter or comma to add · max 10" />
                  <TagInput name="interests" label="Interests — topics you love" value={formData.interests} onChange={handleChange} placeholder="AI, Web3, Open Source…" hint="Shown as coloured tags on your card" />
                </div>
              </div>

              <div>
                <SectionTitle>Preferences</SectionTitle>
                <div className="grid grid-cols-3 gap-3">
                  <CustomSelect
                    label="Experience"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    options={[
                      { value: "beginner", label: "Beginner" },
                      { value: "intermediate", label: "Intermediate" },
                      { value: "advanced", label: "Advanced" },
                    ]}
                  />
                  <CustomSelect
                    label="Looking For"
                    name="lookingFor"
                    value={formData.lookingFor}
                    onChange={handleChange}
                    options={[
                      { value: "collaborator", icon: "🤝", label: "Collaborator" },
                      { value: "mentor", icon: "🎓", label: "Mentor" },
                      { value: "project", icon: "🚀", label: "Project Partner" },
                      { value: "internship", icon: "💼", label: "Internship" },
                    ]}
                  />
                  <CustomSelect
                    label="Availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    options={[
                      { value: "part-time", icon: "⏱", label: "Part-time" },
                      { value: "full-time", icon: "⚡", label: "Full-time" },
                      { value: "weekends", icon: "🗓", label: "Weekends" },
                    ]}
                  />
                </div>
              </div>

              <div>
                <SectionTitle>Links</SectionTitle>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[13px] font-semibold text-white/50 mb-2">Photo URL</label>
                    <input name="photourl" type="text" className={inputCls} value={formData.photourl} onChange={handleChange} placeholder="https://example.com/photo.jpg" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><GithubIcon /></span>
                      <input name="githubUrl" type="text" className={`${inputCls} pl-9`} value={formData.githubUrl} onChange={handleChange} placeholder="github.com/user" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><LinkedinIcon /></span>
                      <input name="linkedinUrl" type="text" className={`${inputCls} pl-9`} value={formData.linkedinUrl} onChange={handleChange} placeholder="linkedin.com/in/user" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                      </span>
                      <input name="portfolioUrl" type="text" className={`${inputCls} pl-9`} value={formData.portfolioUrl} onChange={handleChange} placeholder="yoursite.com" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-10 px-6 rounded-xl text-[13px] font-semibold bg-primary hover:bg-primary/90 text-white transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {loading && <span className="loading loading-spinner loading-xs" />}
                  {loading ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full xl:w-[42%] xl:sticky xl:top-24 space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/20 text-center mb-3">Card Preview</p>
            <ProfileCard data={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
