import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { addUser } from "../store/userSlice";
import { X, Heart, Calendar, GitBranch, Link, GraduationCap, Users, Briefcase, Code2, Trash2, Plus } from "lucide-react";

const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face";

const EXPERIENCE_BADGE = {
  beginner: { label: "Beginner", cls: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" },
  intermediate: { label: "Intermediate", cls: "bg-amber-500/20 text-amber-400 border border-amber-500/30" },
  advanced: { label: "Advanced", cls: "bg-rose-500/20 text-rose-400 border border-rose-500/30" },
};

const getLookingForIcon = (type) => {
  switch(type) {
    case 'mentor': return <GraduationCap size={20} className="text-primary" />;
    case 'collaborator': return <Users size={20} className="text-secondary" />;
    case 'project': return <Briefcase size={20} className="text-accent" />;
    case 'internship': return <Code2 size={20} className="text-info" />;
    default: return <Users size={20} className="text-primary" />;
  }
};

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

export const ProfileCard = ({ data, previewMode = 'desktop' }) => {
  const skills = typeof data.skills === "string"
    ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
    : data.skills || [];

  const interests = typeof data.interests === "string"
    ? data.interests.split(",").map((s) => s.trim()).filter(Boolean)
    : data.interests || [];

  const projects = data.projects || [];

  const expBadge = EXPERIENCE_BADGE[data.experienceLevel];

  const isMobile = previewMode === 'mobile';

  return (
    <div className={`w-full mx-auto select-none ${isMobile ? 'max-w-[380px]' : 'max-w-[800px]'}`}>
      <div className={`w-full bg-[#1e1e24] shadow-2xl overflow-hidden rounded-[2rem] border border-white/5 flex flex-col relative ${isMobile ? 'h-[700px]' : 'xl:flex-row h-[75vh] max-h-[800px] min-h-[500px]'}`}>
        {/* Left Side: Image Banner */}
        <div className={`relative shrink-0 bg-base-300 ${isMobile ? 'h-[350px] w-full' : 'h-[250px] xl:h-auto xl:w-[35%]'}`}>
          <img
            src={data.photourl || FALLBACK_AVATAR}
            alt="profile"
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t xl:bg-gradient-to-r from-[#1e1e24] via-[#1e1e24]/20 to-transparent pointer-events-none" />
          
          <div className="absolute top-5 left-5 right-5 flex flex-col gap-2 items-start pointer-events-none">
            {expBadge && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${expBadge.cls}`}>
                {expBadge.label}
              </span>
            )}
            {data.availability && (
              <span className="px-3 py-1 bg-black/40 text-white/90 backdrop-blur-md rounded-full text-xs font-semibold flex items-center gap-1.5">
                <Calendar size={12} />
                {data.availability.charAt(0).toUpperCase() + data.availability.slice(1)}
              </span>
            )}
          </div>
        </div>
        
        {/* Right Side: Scrollable Content Area */}
        <div className={`flex-1 p-6 relative overflow-y-auto ${!isMobile ? 'xl:p-8 z-10' : ''}`}>
          <div className="mb-4">
            <h2 className="text-3xl font-bold text-white font-sans tracking-tight drop-shadow-md">
              {data.firstName || "Your Name"} {data.lastName} <span className="text-2xl text-white/50 font-normal"> {data.age || ""}</span>
            </h2>
            {data.username && <p className="text-primary font-medium text-sm">@{data.username}</p>}
            <p className="text-white/80 font-medium mt-1 leading-snug">
              {data.headline || "Software Developer"}
            </p>
          </div>

          {data.lookingFor && (
            <div className="mb-6 p-4 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10">
              <div className="p-2 bg-black/20 rounded-lg">
                {getLookingForIcon(data.lookingFor)}
              </div>
              <p className="text-white/80 text-sm font-medium">
                Looking for a <span className="text-white font-bold capitalize">{data.lookingFor}</span>
              </p>
            </div>
          )}

          {data.about && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">About</h3>
              <p className="text-white/80 text-sm leading-relaxed">{data.about}</p>
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-3">Projects</h3>
              <div className="grid grid-cols-1 gap-3">
                {projects.map((project, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
                    <h4 className="text-white font-bold text-sm flex items-center gap-2 pr-6">
                      {project.title}
                    </h4>
                    <p className="text-white/60 text-xs mt-1.5 leading-relaxed">{project.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-6">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 bg-base-300 text-white/90 rounded-lg font-mono text-xs font-semibold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests.length > 0 && (
            <div className="mb-8">
              <h3 className="text-white/50 text-xs uppercase tracking-wider font-bold mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            {data.githubUrl && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-xl text-sm font-medium border border-white/10">
                <GitBranch size={16} /> GitHub
              </div>
            )}
            {data.linkedinUrl && (
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white/80 rounded-xl text-sm font-medium border border-white/10">
                <Link size={16} /> LinkedIn
              </div>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-white/15 mt-3 tracking-wide">Live Preview (Horizontal Card)</p>
    </div>
  );
};

const Profile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [previewMode, setPreviewMode] = useState('mobile');

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", username: "", age: "", gender: "",
    headline: "", about: "", skills: "", interests: "", photourl: "",
    experienceLevel: "", lookingFor: "", availability: "",
    githubUrl: "", linkedinUrl: "", portfolioUrl: "",
    projects: []
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
        projects: user.projects || []
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setFormData(prev => ({ ...prev, projects: [...prev.projects, { title: "", description: "", link: "" }] }));
  };

  const removeProject = (index) => {
    const updatedProjects = formData.projects.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, projects: updatedProjects }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const toArray = (val) =>
        typeof val === "string" ? val.split(",").map((s) => s.trim()).filter(Boolean) : val || [];

      // Filter out empty projects
      const validProjects = formData.projects.filter(p => p.title.trim());

      const payload = { ...formData, skills: toArray(formData.skills), interests: toArray(formData.interests), projects: validProjects };

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
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className="text-[28px] font-bold text-white tracking-tight">Profile Settings</h1>
          <p className="text-[13px] text-white/35 mt-1 mb-6">This is how you appear to others on SkillSync</p>
          
          <div className="flex bg-[#111113] border border-white/10 rounded-full p-1">
            <button 
              onClick={() => setPreviewMode('mobile')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${previewMode === 'mobile' ? 'bg-primary/20 text-primary' : 'text-white/50 hover:text-white'}`}
            >
              Mobile Preview
            </button>
            <button 
              onClick={() => setPreviewMode('desktop')}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${previewMode === 'desktop' ? 'bg-primary/20 text-primary' : 'text-white/50 hover:text-white'}`}
            >
              Desktop Preview
            </button>
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start">
          <div className="w-full xl:w-[45%] shrink-0 rounded-2xl bg-[#111113] border border-white/8 shadow-2xl overflow-visible">
            {(error || success) && (
              <div className={`px-6 py-3 text-[13px] font-medium rounded-t-2xl ${error
                ? "bg-rose-500/10 text-rose-400 border-b border-rose-500/15"
                : "bg-emerald-500/10 text-emerald-400 border-b border-emerald-500/15"}`}>
                {error || "✓ Profile saved successfully"}
              </div>
            )}

            <form onSubmit={handleSubmit} className="p-6 space-y-7 h-full">
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
                <SectionTitle>Projects</SectionTitle>
                <div className="space-y-4">
                  {formData.projects.map((project, index) => (
                    <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl relative group">
                      <button type="button" onClick={() => removeProject(index)} className="absolute top-2 right-2 p-1.5 text-white/30 hover:text-error hover:bg-error/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                      <div className="space-y-3 mt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-white/50 mb-1.5">Project Title</label>
                          <input type="text" className={inputCls} value={project.title} onChange={(e) => handleProjectChange(index, "title", e.target.value)} placeholder="e.g. My Awesome App" />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/50 mb-1.5">Description</label>
                          <textarea className={`${inputCls} h-16 py-2 resize-none`} value={project.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} placeholder="Briefly describe what it does..." />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-white/50 mb-1.5">Link (Optional)</label>
                          <input type="text" className={inputCls} value={project.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} placeholder="https://github.com/..." />
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.projects.length < 3 && (
                    <button type="button" onClick={addProject} className="w-full py-3 rounded-xl border border-dashed border-white/20 text-white/50 text-[13px] font-medium hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                      <Plus size={16} /> Add a Project
                    </button>
                  )}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><GitBranch size={14}/></span>
                      <input name="githubUrl" type="text" className={`${inputCls} pl-9`} value={formData.githubUrl} onChange={handleChange} placeholder="github.com/user" />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none"><Link size={14}/></span>
                      <input name="linkedinUrl" type="text" className={`${inputCls} pl-9`} value={formData.linkedinUrl} onChange={handleChange} placeholder="linkedin.com/in/user" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 pb-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 px-8 rounded-xl text-[14px] font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all disabled:opacity-40 flex items-center gap-2"
                >
                  {loading && <span className="loading loading-spinner loading-xs" />}
                  {loading ? "Saving…" : "Save Profile"}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full xl:flex-1 xl:sticky xl:top-24 mt-8 xl:mt-0 flex justify-center">
            <div className="w-full flex justify-center">
              <ProfileCard data={formData} previewMode={previewMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
