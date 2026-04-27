import React, { useState } from 'react';
import styles from './PersonasPage.module.css';

const personas = [
  {
    id: 1,
    name: 'Arjun Reddy',
    role: '1st Year B.Tech CSE · 18 yrs · Hyderabad',
    avatar: '👨‍💻',
    theme: 'blue',
    tags: ['New Student', 'Android User', 'Tech Savvy'],
    quote: '"I\'ve been late to 3 classes already because I can\'t find the labs. The campus is huge and all the blocks look the same!"',
    goals: [
      'Find any classroom or lab within 2 minutes',
      'Learn the campus layout quickly in first semester',
      'Never be late to class due to navigation issues',
    ],
    pains: [
      'All buildings look the same — no clear signage',
      'Google Maps doesn\'t work for indoor navigation',
      'Embarrassed to keep asking seniors for directions',
    ],
    tech: { Smartphone: 95, Apps: 90, Maps: 80 },
    needs: [
      { icon: '🔍', label: 'Fast room search' },
      { icon: '🧭', label: 'Step-by-step directions' },
      { icon: '📶', label: 'Offline mode' },
      { icon: '🗺️', label: 'Full campus map' },
    ],
  },
  {
    id: 2,
    name: 'Lakshmi Devi',
    role: 'Parent · 44 yrs · Vijayawada',
    avatar: '👩‍👧',
    theme: 'emerald',
    tags: ['Visitor', 'Low Tech', 'Telugu Speaker'],
    quote: '"I came to meet my son\'s HOD during parent\'s day. I wandered for 30 minutes and had to call my son to come find me near the gate."',
    goals: [
      'Find specific faculty office or admin block easily',
      'Use the app in Telugu language',
      'Navigate independently without troubling students',
    ],
    pains: [
      'Campus is very large and unfamiliar for visitors',
      'No staff or volunteers to guide visitors',
      'English-only signboards — hard to read',
    ],
    tech: { Smartphone: 40, Apps: 30, Maps: 20 },
    needs: [
      { icon: '🌐', label: 'Telugu language option' },
      { icon: '🖼️', label: 'Simple visual UI' },
      { icon: '📺', label: 'Kiosk at entrance' },
      { icon: '📞', label: 'Contact directory' },
    ],
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    role: 'Asst. Professor · ECE Dept · 32 yrs',
    avatar: '👩‍🏫',
    theme: 'purple',
    tags: ['Faculty', 'New Joiner', 'iPhone User'],
    quote: '"I joined 2 months ago. I still get confused between Block A and Block B. I search for seminar halls every time there\'s an event."',
    goals: [
      'Find seminar halls and conference rooms quickly',
      'Know which floor a specific lab or department is on',
      'Share exact location links with students easily',
    ],
    pains: [
      'New to campus — still learning building layout',
      'Room numbers don\'t follow a logical pattern',
      'Wastes class time when students can\'t find her room',
    ],
    tech: { Smartphone: 85, Apps: 80, Maps: 75 },
    needs: [
      { icon: '🔗', label: 'Share location link' },
      { icon: '🏢', label: 'Floor-wise map view' },
      { icon: '📅', label: 'Event room finder' },
      { icon: '⭐', label: 'Save favourite rooms' },
    ],
  },
];

const THEME = {
  blue:    { grad: 'linear-gradient(135deg,#1e3a8a,#1e40af)', dot: '#60a5fa', bar: 'linear-gradient(90deg,#3b82f6,#06b6d4)', tag: 'rgba(59,130,246,0.2)', tagTxt: '#93c5fd' },
  emerald: { grad: 'linear-gradient(135deg,#064e3b,#065f46)', dot: '#34d399', bar: 'linear-gradient(90deg,#10b981,#06b6d4)', tag: 'rgba(16,185,129,0.2)', tagTxt: '#6ee7b7' },
  purple:  { grad: 'linear-gradient(135deg,#3b0764,#4c1d95)', dot: '#c084fc', bar: 'linear-gradient(90deg,#8b5cf6,#ec4899)', tag: 'rgba(139,92,246,0.2)', tagTxt: '#d8b4fe' },
};

function PersonaCard({ persona }) {
  const [tab, setTab] = useState('goals');
  const th = THEME[persona.theme];

  return (
    <div className={styles.card}>
      {/* Hero */}
      <div className={styles.hero} style={{ background: th.grad }}>
        <div className={styles.avatar}>{persona.avatar}</div>
        <div className={styles.heroInfo}>
          <h2 className={styles.name}>{persona.name}</h2>
          <p className={styles.role}>{persona.role}</p>
          <div className={styles.tags}>
            {persona.tags.map(t => (
              <span key={t} className={styles.heroTag} style={{ background: th.tag, color: th.tagTxt }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className={styles.quote} style={{ borderColor: th.dot }}>
        {persona.quote}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {['goals','pains','tech','needs'].map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            style={tab === t ? { borderColor: th.dot, color: th.dot } : {}}
            onClick={() => setTab(t)}
          >
            {{ goals:'🎯 Goals', pains:'😤 Pains', tech:'📊 Tech', needs:'💡 Needs' }[t]}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className={styles.tabBody}>
        {tab === 'goals' && persona.goals.map((g, i) => (
          <div key={i} className={styles.listItem}>
            <span className={styles.dot} style={{ background: th.dot }} />
            <span>{g}</span>
          </div>
        ))}

        {tab === 'pains' && persona.pains.map((p, i) => (
          <div key={i} className={styles.listItem}>
            <span className={styles.crossIcon}>✕</span>
            <span>{p}</span>
          </div>
        ))}

        {tab === 'tech' && Object.entries(persona.tech).map(([label, val]) => (
          <div key={label} className={styles.techRow}>
            <span className={styles.techLabel}>{label}</span>
            <div className={styles.techBar}>
              <div className={styles.techFill} style={{ width: `${val}%`, background: th.bar }} />
            </div>
            <span className={styles.techPct}>{val}%</span>
          </div>
        ))}

        {tab === 'needs' && (
          <div className={styles.needsGrid}>
            {persona.needs.map(n => (
              <div key={n.label} className={styles.needItem}>
                <span className={styles.needIcon}>{n.icon}</span>
                <span className={styles.needLabel}>{n.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PersonasPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>User Personas</h1>
          <p className={styles.sub}>Three key users identified through DTI empathy research</p>
        </div>
        <span className={styles.badge}>DTI · Week 2</span>
      </div>
      <div className={styles.grid}>
        {personas.map(p => <PersonaCard key={p.id} persona={p} />)}
      </div>
    </div>
  );
}
