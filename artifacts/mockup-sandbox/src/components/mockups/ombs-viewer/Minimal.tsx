import React, { useState } from 'react';
import { Search, Info, AlignLeft, Layers, BookOpen, ChevronRight } from 'lucide-react';

const DOMAINS = [
  { id: "S", name: "Shared Practices", desc: "Practices common to both making and building. Every project worth assessing exercises at least three.", color: "blue", dimensions: ["Define","Draft","Test","Iterate","Reflect","Collaborate"] },
  { id: "M", name: "Making", desc: "Practices specific to making — craft, materials, and tangible artifact creation.", color: "orange", dimensions: ["Material","Process","Tool","Fabricate"] },
  { id: "B", name: "Building", desc: "Practices specific to building — systems, structures, and engineered solutions.", color: "green", dimensions: ["System","Structure","Safety"] },
];

const GRADE_BANDS = ["K–2", "3–5", "6–8", "9–12"];

const SAMPLE_DESCRIPTORS = [
  { code:"OMBS.S.DF.K2.1", grade:"K–2", text:"With prompting, the learner states what they will make or build and names at least one person who will see or use it." },
  { code:"OMBS.S.DF.35.1", grade:"3–5", text:"The learner records, before substantial work begins, a written or spoken statement naming (a) the artifact, (b) the intended audience or user, and (c) at least one criterion for success." },
  { code:"OMBS.S.DF.68.1", grade:"6–8", text:"The learner produces a written intent statement with two or more success criteria, and revises that statement at least once during the project, with the revision dated or otherwise traceable." },
  { code:"OMBS.S.DF.912.1", grade:"9–12", text:"The learner frames the intent in tension with stated constraints (time, budget, materials, audience access) and defends scope choices in writing or in conversation against at least one feasible alternative scope considered and rejected." },
];

export function Minimal() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
      
      <div className="max-w-7xl mx-auto flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-zinc-200 flex flex-col py-6 bg-zinc-50/50">
          <div className="px-6 mb-8">
            <h1 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase">OMBS v0.1.0</h1>
            <p className="text-xs text-zinc-500 mt-1">Open Making & Building Standard</p>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            <NavItem 
              active={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')}
              icon={<Info className="w-4 h-4" />}
              label="Overview" 
            />
            <NavItem 
              active={activeTab === 'browser'} 
              onClick={() => setActiveTab('browser')}
              icon={<Layers className="w-4 h-4" />}
              label="Standards Browser" 
            />
            <NavItem 
              active={activeTab === 'search'} 
              onClick={() => setActiveTab('search')}
              icon={<Search className="w-4 h-4" />}
              label="Search Codes" 
            />
            <NavItem 
              active={activeTab === 'crosswalks'} 
              onClick={() => setActiveTab('crosswalks')}
              icon={<AlignLeft className="w-4 h-4" />}
              label="Crosswalks" 
            />
            <NavItem 
              active={activeTab === 'about'} 
              onClick={() => setActiveTab('about')}
              icon={<BookOpen className="w-4 h-4" />}
              label="About" 
            />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-12 py-10">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'browser' && <StandardsBrowser />}
          {activeTab === 'search' && <SearchCodes />}
          {activeTab === 'crosswalks' && <Crosswalks />}
          {activeTab === 'about' && <About />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-700 font-medium' 
          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
      }`}
    >
      <span className={active ? 'text-blue-600' : 'text-zinc-400'}>{icon}</span>
      {label}
    </button>
  );
}

function Overview() {
  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 mb-4">The Standard for Making & Building</h2>
      <p className="text-zinc-500 leading-relaxed mb-12 text-lg">
        The Open Making and Building Standard (OMBS) is a cross-domain framework designed for K–12 education. It outlines practices that span from crafting tangible artifacts to engineering complex systems.
      </p>

      <div className="space-y-6">
        {DOMAINS.map(domain => (
          <div key={domain.id} className="border border-zinc-200 rounded-lg p-6 hover:border-zinc-300 transition-colors bg-white">
            <div className="flex items-center gap-3 mb-3">
              <span className={`w-8 h-8 rounded bg-zinc-100 flex items-center justify-center text-sm font-medium
                ${domain.color === 'blue' ? 'text-blue-600' : ''}
                ${domain.color === 'orange' ? 'text-orange-600' : ''}
                ${domain.color === 'green' ? 'text-emerald-600' : ''}
              `}>
                {domain.id}
              </span>
              <h3 className="text-lg font-medium text-zinc-900">{domain.name}</h3>
            </div>
            <p className="text-zinc-600 mb-6">{domain.desc}</p>
            
            <div className="flex flex-wrap gap-2">
              {domain.dimensions.map(dim => (
                <span key={dim} className="px-2.5 py-1 rounded-md bg-zinc-100 text-xs font-medium text-zinc-600 border border-zinc-200/50">
                  {dim}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StandardsBrowser() {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-1">Standards Browser</h2>
          <p className="text-zinc-500 text-sm">Explore dimensions and evidence descriptors across grade bands.</p>
        </div>
        
        <div className="flex gap-2">
          <select className="text-sm border border-zinc-200 rounded-md px-3 py-1.5 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
            <option>All Domains</option>
            <option>Shared Practices (S)</option>
            <option>Making (M)</option>
            <option>Building (B)</option>
          </select>
        </div>
      </div>

      <div className="border border-zinc-200 rounded-lg overflow-hidden bg-white">
        <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-700">S.DF</span>
            <h3 className="text-lg font-medium text-zinc-900">Define</h3>
          </div>
          <p className="text-sm text-zinc-500 mt-2">Articulating the intent, scope, and constraints of a project before or during its creation.</p>
        </div>
        
        <div className="divide-y divide-zinc-100">
          {SAMPLE_DESCRIPTORS.map(desc => (
            <div key={desc.code} className="p-6 hover:bg-zinc-50/50 transition-colors flex gap-6">
              <div className="w-24 shrink-0">
                <span className="inline-block px-2 py-1 rounded-md bg-zinc-100 text-xs font-medium text-zinc-600 border border-zinc-200">
                  {desc.grade}
                </span>
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-400 mb-2">{desc.code}</div>
                <p className="text-zinc-800 text-sm leading-relaxed">{desc.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchCodes() {
  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">Search Codes</h2>
      
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input 
          type="text" 
          placeholder="e.g. OMBS.S.DF.K2.1" 
          className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-shadow shadow-sm"
        />
      </div>

      <div className="border border-zinc-100 rounded-lg bg-zinc-50/50 p-8 text-center">
        <p className="text-sm text-zinc-500">Enter a standard code to view its details.</p>
      </div>
    </div>
  );
}

function Crosswalks() {
  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">Crosswalks</h2>
      <p className="text-zinc-500 text-sm mb-8">Alignments to NGSS, CCSS-ELA, and CCSS-Math.</p>

      <div className="border border-zinc-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
            <tr>
              <th className="px-6 py-3 font-medium">OMBS Code</th>
              <th className="px-6 py-3 font-medium">Standard Framework</th>
              <th className="px-6 py-3 font-medium">Aligned Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            <tr className="hover:bg-zinc-50/50">
              <td className="px-6 py-4 font-mono text-xs text-zinc-600">OMBS.S.DF.K2.1</td>
              <td className="px-6 py-4 text-zinc-800">NGSS</td>
              <td className="px-6 py-4 font-mono text-xs text-zinc-600">K-2-ETS1-1</td>
            </tr>
            <tr className="hover:bg-zinc-50/50">
              <td className="px-6 py-4 font-mono text-xs text-zinc-600">OMBS.S.DF.35.1</td>
              <td className="px-6 py-4 text-zinc-800">CCSS-ELA</td>
              <td className="px-6 py-4 font-mono text-xs text-zinc-600">W.4.4</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-6">About OMBS</h2>
      
      <div className="prose prose-sm prose-zinc">
        <p className="text-zinc-600 leading-relaxed mb-4">
          The Open Making and Building Standard is an open-source framework dedicated to defining high-quality making and building practices in education.
        </p>
        
        <div className="h-px w-full bg-zinc-200 my-8"></div>
        
        <h3 className="text-sm font-semibold text-zinc-900 mb-2">Version</h3>
        <p className="text-zinc-600 mb-6">v0.1.0 (Draft)</p>
        
        <h3 className="text-sm font-semibold text-zinc-900 mb-2">License</h3>
        <p className="text-zinc-600 mb-6">Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)</p>
      </div>
    </div>
  );
}
