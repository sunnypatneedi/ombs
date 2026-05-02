import React, { useState } from 'react';
import './_group.css';
import { BookOpen, Search, Grid, GitMerge, Info, ChevronRight, FileText } from 'lucide-react';

const DOMAINS = [
  { id: "S", name: "Shared Practices", desc: "Practices common to both making and building. Every project worth assessing exercises at least three.", color: "var(--domain-s)", dimensions: ["Define","Draft","Test","Iterate","Reflect","Collaborate"] },
  { id: "M", name: "Making", desc: "Practices specific to making — craft, materials, and tangible artifact creation.", color: "var(--domain-m)", dimensions: ["Material","Process","Tool","Fabricate"] },
  { id: "B", name: "Building", desc: "Practices specific to building — systems, structures, and engineered solutions.", color: "var(--domain-b)", dimensions: ["System","Structure","Safety"] },
];

const GRADE_BANDS = ["K–2", "3–5", "6–8", "9–12"];

const SAMPLE_DESCRIPTORS = [
  { code:"OMBS.S.DF.K2.1", grade:"K–2", text:"With prompting, the learner states what they will make or build and names at least one person who will see or use it." },
  { code:"OMBS.S.DF.35.1", grade:"3–5", text:"The learner records, before substantial work begins, a written or spoken statement naming (a) the artifact, (b) the intended audience or user, and (c) at least one criterion for success." },
  { code:"OMBS.S.DF.68.1", grade:"6–8", text:"The learner produces a written intent statement with two or more success criteria, and revises that statement at least once during the project, with the revision dated or otherwise traceable." },
  { code:"OMBS.S.DF.912.1", grade:"9–12", text:"The learner frames the intent in tension with stated constraints (time, budget, materials, audience access) and defends scope choices in writing or in conversation against at least one feasible alternative scope considered and rejected." },
];

export function Scholarly() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="ombs-scholarly w-full">
      <header className="border-b" style={{ borderColor: 'var(--border-hairline)' }}>
        <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col items-center text-center">
          <div className="ombs-scholarly-pill mb-4 px-3 py-1 rounded-full border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--accent-terracotta)' }}>
            Vol. 1, Issue 0.1.0
          </div>
          <h1 className="ombs-scholarly-heading text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--text-ink)' }}>
            Open Making and Building Standard
          </h1>
          <p className="max-w-2xl text-lg italic" style={{ color: 'var(--text-dim)' }}>
            A comprehensive, cross-domain framework for K–12 education, standardizing the evaluation of making and building practices.
          </p>
        </div>

        <nav className="max-w-6xl mx-auto px-8 flex justify-center space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BookOpen },
            { id: 'browser', label: 'Standards Browser', icon: Grid },
            { id: 'search', label: 'Search Codes', icon: Search },
            { id: 'crosswalks', label: 'Crosswalks', icon: GitMerge },
            { id: 'about', label: 'About', icon: Info },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`ombs-scholarly-nav-item py-4 flex items-center gap-2 text-sm font-medium ${
                activeTab === tab.id ? 'active' : ''
              }`}
              style={{ color: activeTab !== tab.id ? 'var(--text-dim)' : undefined }}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-16">
        {activeTab === 'overview' && (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {DOMAINS.map(domain => (
                <div key={domain.id} className="ombs-scholarly-paper p-8 flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: domain.color }}></div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center ombs-scholarly-heading text-xl text-white" style={{ backgroundColor: domain.color }}>
                      {domain.id}
                    </div>
                    <h2 className="ombs-scholarly-heading text-2xl font-semibold">{domain.name}</h2>
                  </div>
                  <p className="mb-8 flex-grow" style={{ color: 'var(--text-dim)' }}>{domain.desc}</p>
                  <div>
                    <h3 className="ombs-scholarly-pill mb-3" style={{ color: 'var(--text-dim)' }}>Dimensions Included</h3>
                    <div className="flex flex-wrap gap-2">
                      {domain.dimensions.map(dim => (
                        <span key={dim} className="px-2 py-1 bg-gray-50 border rounded text-xs" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}>
                          {dim}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className="max-w-3xl mx-auto text-center">
              <h2 className="ombs-scholarly-heading text-3xl mb-6">The Structure of a Standard</h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--text-dim)' }}>
                The OMBS framework is built upon three foundational domains, each containing specific dimensions of practice. Every dimension is articulated across four grade bands (K–2, 3–5, 6–8, 9–12) through distinct evidence descriptors.
              </p>
              <button 
                onClick={() => setActiveTab('browser')}
                className="px-6 py-3 border inline-flex items-center gap-2 hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}
              >
                Browse the Standards <ChevronRight size={16} />
              </button>
            </section>
          </div>
        )}

        {activeTab === 'browser' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row gap-12">
              <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-8">
                  <h3 className="ombs-scholarly-pill mb-4" style={{ color: 'var(--text-dim)' }}>Filter by Domain</h3>
                  <div className="space-y-2">
                    {DOMAINS.map(domain => (
                      <label key={domain.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                        <input type="checkbox" className="rounded-sm border-gray-300 text-slate-600 focus:ring-slate-500" defaultChecked />
                        <span className="flex-grow">{domain.name}</span>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: domain.color }}></div>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              <div className="flex-grow space-y-12">
                <div className="ombs-scholarly-paper p-10">
                  <header className="mb-10 pb-8 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="ombs-scholarly-pill" style={{ color: 'var(--domain-s)' }}>Shared Practices</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="ombs-scholarly-pill text-gray-500">OMBS.S.DF</span>
                    </div>
                    <h2 className="ombs-scholarly-heading text-3xl mb-4">Define</h2>
                    <p className="text-lg italic" style={{ color: 'var(--text-dim)' }}>
                      The practice of establishing the scope, intent, and success criteria for a project before or during its execution.
                    </p>
                  </header>

                  <div className="space-y-8">
                    {SAMPLE_DESCRIPTORS.map((desc, idx) => (
                      <div key={idx} className="relative pl-8 pb-8 border-l border-dotted last:border-0 last:pb-0" style={{ borderColor: 'var(--border-hairline)' }}>
                        <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-white border-2 flex items-center justify-center" style={{ borderColor: 'var(--domain-s)' }}>
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--domain-s)' }}></div>
                        </div>
                        
                        <div className="flex items-baseline justify-between mb-2">
                          <h4 className="font-semibold" style={{ color: 'var(--text-ink)' }}>Grade Band {desc.grade}</h4>
                          <span className="font-mono text-xs bg-gray-50 px-2 py-1 rounded border" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-dim)' }}>{desc.code}</span>
                        </div>
                        
                        <p className="text-lg leading-relaxed" style={{ color: 'var(--text-ink)' }}>
                          {desc.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center mb-12">
              <h2 className="ombs-scholarly-heading text-3xl mb-4">Code Lookup</h2>
              <p style={{ color: 'var(--text-dim)' }}>Enter a specific OMBS standard code to retrieve its full descriptor.</p>
            </div>
            
            <div className="ombs-scholarly-paper p-2 flex mb-8">
              <div className="pl-4 flex items-center pointer-events-none" style={{ color: 'var(--text-dim)' }}>
                <Search size={20} />
              </div>
              <input 
                type="text" 
                placeholder="e.g., OMBS.S.DF.K2.1"
                className="w-full bg-transparent border-0 focus:ring-0 px-4 py-3 text-lg font-mono outline-none"
                defaultValue="OMBS.S.DF.K2.1"
              />
              <button className="px-6 py-2 bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                Search
              </button>
            </div>

            <div className="ombs-scholarly-paper p-8 border-l-4" style={{ borderLeftColor: 'var(--domain-s)' }}>
              <div className="flex justify-between items-start mb-6 pb-6 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                <div>
                  <div className="flex gap-2 items-center mb-2">
                    <span className="font-mono text-sm px-2 py-1 bg-gray-100 rounded">OMBS.S.DF.K2.1</span>
                    <span className="ombs-scholarly-pill" style={{ color: 'var(--domain-s)' }}>Shared Practices</span>
                  </div>
                  <h3 className="ombs-scholarly-heading text-2xl">Define: K–2</h3>
                </div>
              </div>
              <div className="pl-4 border-l-2 mb-6" style={{ borderColor: 'var(--accent-terracotta)' }}>
                <p className="text-xl leading-relaxed italic" style={{ color: 'var(--text-ink)' }}>
                  "{SAMPLE_DESCRIPTORS[0].text}"
                </p>
              </div>
              
              <div className="pt-6 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-hairline)' }}>
                <span className="text-sm" style={{ color: 'var(--text-dim)' }}>Dimension: Define</span>
                <button className="text-sm underline flex items-center gap-1" style={{ color: 'var(--accent-terracotta)' }}>
                  <FileText size={14} />
                  View full dimension context
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crosswalks' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12 text-center max-w-2xl mx-auto">
              <h2 className="ombs-scholarly-heading text-3xl mb-4">Alignment Crosswalks</h2>
              <p style={{ color: 'var(--text-dim)' }}>
                Correlations between the OMBS framework and established national standards, supporting integrated curriculum design.
              </p>
            </header>

            <div className="ombs-scholarly-paper overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b" style={{ borderColor: 'var(--border-hairline)' }}>
                      <th className="p-4 ombs-scholarly-pill text-gray-500 font-normal">OMBS Code</th>
                      <th className="p-4 ombs-scholarly-pill text-gray-500 font-normal">Dimension</th>
                      <th className="p-4 ombs-scholarly-pill text-gray-500 font-normal">NGSS Alignment</th>
                      <th className="p-4 ombs-scholarly-pill text-gray-500 font-normal">CCSS-ELA Alignment</th>
                      <th className="p-4 ombs-scholarly-pill text-gray-500 font-normal">CCSS-Math Alignment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: 'var(--border-hairline)' }}>
                    {[
                      { code: "OMBS.S.DF.35.1", dim: "Define", ngss: "3-5-ETS1-1", ela: "W.5.2", math: "MP.1" },
                      { code: "OMBS.S.DF.68.1", dim: "Define", ngss: "MS-ETS1-1", ela: "W.8.2", math: "MP.1, MP.2" },
                      { code: "OMBS.S.DF.912.1", dim: "Define", ngss: "HS-ETS1-1", ela: "W.11-12.2", math: "MP.1, MP.4" },
                      { code: "OMBS.S.DR.35.1", dim: "Draft", ngss: "3-5-ETS1-2", ela: "W.5.4", math: "MP.4, MP.5" },
                      { code: "OMBS.M.MA.68.1", dim: "Material", ngss: "MS-PS1-3", ela: "RST.6-8.3", math: "MP.6" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-mono text-sm">{row.code}</td>
                        <td className="p-4 font-medium">{row.dim}</td>
                        <td className="p-4"><span className="px-2 py-1 bg-green-50 text-green-800 border border-green-200 rounded text-xs">{row.ngss}</span></td>
                        <td className="p-4"><span className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs">{row.ela}</span></td>
                        <td className="p-4"><span className="px-2 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded text-xs">{row.math}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="ombs-scholarly-paper p-12 text-center prose prose-slate mx-auto">
              <h2 className="ombs-scholarly-heading text-3xl mb-6">About OMBS</h2>
              <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>
              
              <p className="mb-6">
                The Open Making and Building Standard (OMBS) is a collaborative effort to provide a rigorous, observable framework for assessing making and building practices in K–12 environments.
              </p>
              
              <p className="mb-8">
                Version: <strong>0.1.0</strong> (Draft)
              </p>
              
              <div className="p-6 bg-gray-50 border rounded-lg text-sm mb-8 text-left" style={{ borderColor: 'var(--border-hairline)' }}>
                <h3 className="ombs-scholarly-heading text-lg mb-2">License</h3>
                <p className="mb-0">
                  This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License. You are free to share and adapt the material, provided appropriate credit is given.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button className="px-6 py-2 border hover:bg-gray-50 transition-colors" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-ink)' }}>
                  Download PDF
                </button>
                <button className="px-6 py-2 bg-slate-800 text-white hover:bg-slate-700 transition-colors">
                  Contribute on GitHub
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="py-8 text-center mt-auto border-t" style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-dim)' }}>
        <p className="text-sm">
          Open Making and Building Standard v0.1.0
        </p>
      </footer>
    </div>
  );
}
