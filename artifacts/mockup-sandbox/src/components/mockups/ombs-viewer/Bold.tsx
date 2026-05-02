import React, { useState } from "react";
import { Search, Info, Layout, Layers, FileText, ChevronRight, Hash } from "lucide-react";

const DOMAINS = [
  { id: "S", name: "Shared Practices", desc: "Practices common to both making and building. Every project worth assessing exercises at least three.", color: "blue", dimensions: ["Define", "Draft", "Test", "Iterate", "Reflect", "Collaborate"] },
  { id: "M", name: "Making", desc: "Practices specific to making — craft, materials, and tangible artifact creation.", color: "orange", dimensions: ["Material", "Process", "Tool", "Fabricate"] },
  { id: "B", name: "Building", desc: "Practices specific to building — systems, structures, and engineered solutions.", color: "green", dimensions: ["System", "Structure", "Safety"] },
];

const GRADE_BANDS = ["K–2", "3–5", "6–8", "9–12"];

const SAMPLE_DESCRIPTORS = [
  { code: "OMBS.S.DF.K2.1", grade: "K–2", text: "With prompting, the learner states what they will make or build and names at least one person who will see or use it." },
  { code: "OMBS.S.DF.35.1", grade: "3–5", text: "The learner records, before substantial work begins, a written or spoken statement naming (a) the artifact, (b) the intended audience or user, and (c) at least one criterion for success." },
  { code: "OMBS.S.DF.68.1", grade: "6–8", text: "The learner produces a written intent statement with two or more success criteria, and revises that statement at least once during the project, with the revision dated or otherwise traceable." },
  { code: "OMBS.S.DF.912.1", grade: "9–12", text: "The learner frames the intent in tension with stated constraints (time, budget, materials, audience access) and defends scope choices in writing or in conversation against at least one feasible alternative scope considered and rejected." },
];

const CROSSWALKS = [
  { ombs: "OMBS.S.DF (Define)", target: "NGSS", code: "K-2-ETS1-1", desc: "Ask questions, make observations, and gather information about a situation people want to change..." },
  { ombs: "OMBS.S.DF (Define)", target: "CCSS-ELA", code: "W.K.8", desc: "With guidance and support from adults, recall information from experiences or gather information from provided sources to answer a question." },
  { ombs: "OMBS.M.MA (Material)", target: "NGSS", code: "2-PS1-2", desc: "Analyze data obtained from testing different materials to determine which materials have the properties that are best suited for an intended purpose." }
];

export function Bold() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDomain, setActiveDomain] = useState("S");
  const [searchQuery, setSearchQuery] = useState("");

  const domainColors: Record<string, string> = {
    blue: "bg-[#2563EB] text-white border-[#1E40AF]",
    orange: "bg-[#EA580C] text-white border-[#C2410C]",
    green: "bg-[#16A34A] text-white border-[#15803D]",
  };

  const domainLightColors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-900 border-blue-200",
    orange: "bg-orange-100 text-orange-900 border-orange-200",
    green: "bg-green-100 text-green-900 border-green-200",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="bg-white border-b-4 border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
              OMBS
            </div>
            <div>
              <h1 className="font-extrabold text-2xl tracking-tight">Open Making & Building Standard</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">v0.1.0</span>
                <span className="text-slate-500 text-sm font-medium">K–12 Cross-Domain Framework</span>
              </div>
            </div>
          </div>
          
          <nav className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: "overview", label: "Overview", icon: <Layout size={18} /> },
              { id: "browser", label: "Standards", icon: <Layers size={18} /> },
              { id: "search", label: "Search", icon: <Search size={18} /> },
              { id: "crosswalks", label: "Crosswalks", icon: <Hash size={18} /> },
              { id: "about", label: "About", icon: <Info size={18} /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? "bg-white text-slate-900 shadow-[0_2px_10px_rgba(0,0,0,0.05)]" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto space-y-6">
              <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                Assess <span className="text-[#2563EB]">making</span> and <span className="text-[#16A34A]">building</span> with confidence.
              </h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">
                A common language for K-12 educators to evaluate craft, systems, and shared practices in project-based learning.
              </p>
              <button 
                onClick={() => setActiveTab("browser")}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-transform hover:-translate-y-1 shadow-[0_8px_0_rgb(15,23,42)] hover:shadow-[0_4px_0_rgb(15,23,42)] active:translate-y-2 active:shadow-none"
              >
                Browse Standards <ChevronRight size={20} />
              </button>
            </div>

            {/* Domains Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {DOMAINS.map(domain => (
                <div 
                  key={domain.id}
                  className={`relative p-8 rounded-[32px] border-4 flex flex-col h-full shadow-[8px_8px_0px_rgba(0,0,0,0.1)] transition-transform hover:-translate-y-2 hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)] ${domainColors[domain.color]}`}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black mb-6 border-2 border-white/20">
                    {domain.id}
                  </div>
                  <h3 className="text-2xl font-extrabold mb-4">{domain.name}</h3>
                  <p className="text-white/90 font-medium leading-relaxed flex-grow">
                    {domain.desc}
                  </p>
                  
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <div className="text-sm font-bold text-white/80 mb-3 uppercase tracking-wider">Dimensions</div>
                    <div className="flex flex-wrap gap-2">
                      {domain.dimensions.map(dim => (
                        <span key={dim} className="bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-lg text-sm font-bold">
                          {dim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "browser" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-80 flex-shrink-0">
              <div className="bg-white rounded-[24px] p-6 shadow-sm border-2 border-slate-200 sticky top-28">
                <h3 className="font-extrabold text-xl mb-6">Filter Domains</h3>
                <div className="space-y-3">
                  {DOMAINS.map(domain => (
                    <button
                      key={domain.id}
                      onClick={() => setActiveDomain(domain.id)}
                      className={`w-full text-left p-4 rounded-2xl transition-all border-2 flex items-center justify-between font-bold ${
                        activeDomain === domain.id 
                          ? domainLightColors[domain.color] + ' shadow-[4px_4px_0_rgba(0,0,0,0.05)]' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${
                          activeDomain === domain.id ? domainColors[domain.color] : 'bg-slate-100 text-slate-500'
                        }`}>
                          {domain.id}
                        </span>
                        {domain.name}
                      </div>
                      <ChevronRight size={18} className={activeDomain === domain.id ? "opacity-100" : "opacity-0"} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow space-y-8">
              <div className="flex items-center justify-between pb-6 border-b-2 border-slate-200">
                <div>
                  <h2 className="text-3xl font-extrabold flex items-center gap-3">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl shadow-sm ${domainColors[DOMAINS.find(d => d.id === activeDomain)?.color || 'blue'].split(' ')[0]}`}>
                      {activeDomain}
                    </span>
                    {DOMAINS.find(d => d.id === activeDomain)?.name}
                  </h2>
                  <p className="text-slate-500 font-medium mt-2">{DOMAINS.find(d => d.id === activeDomain)?.desc}</p>
                </div>
              </div>

              {/* Detailed Dimension */}
              <div className="bg-white rounded-[32px] p-8 shadow-sm border-2 border-slate-200">
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Dimension</div>
                    <h3 className="text-3xl font-black">Define</h3>
                    <p className="text-slate-500 font-medium mt-2 max-w-2xl">
                      Articulating purpose, intent, and audience before and during the creation process.
                    </p>
                  </div>
                  <div className="bg-slate-100 px-4 py-2 rounded-xl text-slate-500 font-bold font-mono text-sm">
                    OMBS.S.DF
                  </div>
                </div>

                <div className="space-y-6">
                  {SAMPLE_DESCRIPTORS.map((desc, i) => (
                    <div key={desc.code} className="group relative bg-slate-50 rounded-2xl p-6 border-2 border-slate-100 hover:border-[#2563EB] hover:bg-blue-50/50 transition-colors">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-20">
                          <div className={`text-center py-2 rounded-xl font-bold text-sm ${
                            i === 0 ? 'bg-purple-100 text-purple-700' :
                            i === 1 ? 'bg-emerald-100 text-emerald-700' :
                            i === 2 ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {desc.grade}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <div className="font-mono text-xs font-bold text-slate-400 mb-2">
                            {desc.code}
                          </div>
                          <p className="text-slate-700 font-medium leading-relaxed text-lg">
                            {desc.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "search" && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-8 text-center">Look up a Code</h2>
            
            <div className="relative mb-12">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="e.g. OMBS.S.DF.K2.1"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-white border-4 border-slate-200 rounded-3xl text-2xl font-bold font-mono shadow-[4px_4px_0_rgba(0,0,0,0.05)] focus:border-[#2563EB] focus:outline-none transition-colors"
              />
            </div>

            {searchQuery && (
              <div className="bg-white rounded-[32px] p-8 border-4 border-[#2563EB] shadow-[8px_8px_0_rgba(37,99,235,0.2)]">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-[#2563EB] text-white px-3 py-1.5 rounded-lg font-bold">S</span>
                  <span className="text-slate-400 font-bold">Shared Practices</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 font-bold">Define</span>
                  <span className="text-slate-300">•</span>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold text-sm">K–2</span>
                </div>
                
                <h3 className="font-mono text-2xl font-black text-[#2563EB] mb-4">OMBS.S.DF.K2.1</h3>
                <p className="text-2xl text-slate-800 font-medium leading-relaxed">
                  "With prompting, the learner states what they will make or build and names at least one person who will see or use it."
                </p>
              </div>
            )}
            
            {!searchQuery && (
              <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-[32px] p-12 text-center">
                <Hash className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 font-bold text-lg">Enter a full or partial OMBS code to see its details.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "crosswalks" && (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold mb-4">Crosswalk Mappings</h2>
            <p className="text-slate-500 font-medium text-lg mb-8">Alignments between OMBS domains and other national standards.</p>

            <div className="bg-white rounded-[24px] overflow-hidden border-2 border-slate-200 shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b-2 border-slate-200">
                  <tr>
                    <th className="p-5 font-extrabold text-slate-600 uppercase tracking-wider text-xs w-1/4">OMBS Dimension</th>
                    <th className="p-5 font-extrabold text-slate-600 uppercase tracking-wider text-xs w-1/6">Target</th>
                    <th className="p-5 font-extrabold text-slate-600 uppercase tracking-wider text-xs w-1/6">Code</th>
                    <th className="p-5 font-extrabold text-slate-600 uppercase tracking-wider text-xs w-5/12">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-slate-100">
                  {CROSSWALKS.map((cw, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="p-5 font-bold text-slate-900">{cw.ombs}</td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          cw.target === 'NGSS' ? 'bg-teal-100 text-teal-800' : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {cw.target}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-sm font-bold text-slate-500">{cw.code}</td>
                      <td className="p-5 text-sm font-medium text-slate-700 leading-relaxed">{cw.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-[32px] p-12 border-2 border-slate-200 shadow-sm text-center">
              <div className="w-24 h-24 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center font-bold text-4xl mx-auto mb-8 shadow-[8px_8px_0_rgba(0,0,0,0.1)] -rotate-3 hover:rotate-0 transition-transform cursor-default">
                O
              </div>
              <h2 className="text-4xl font-extrabold mb-4">About OMBS</h2>
              <p className="text-xl text-slate-600 font-medium mb-12 max-w-xl mx-auto">
                The Open Making and Building Standard (OMBS) is a framework to assess making and building across K-12 education.
              </p>
              
              <div className="grid grid-cols-2 gap-6 text-left">
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Version</div>
                  <div className="font-mono text-xl font-black text-slate-900">v0.1.0 (Draft)</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-100">
                  <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">License</div>
                  <div className="font-bold text-xl text-slate-900 flex items-center gap-2">
                    CC BY-SA 4.0
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t-2 border-slate-100 text-left">
                <h3 className="font-extrabold text-xl mb-4">Authors & Contributors</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Developed by a consortium of educators, makers, and learning scientists dedicated to formalizing assessment in project-based and hands-on learning environments.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
