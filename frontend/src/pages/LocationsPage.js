import React, { useState, useEffect } from 'react';
import { getLocations, deleteLocation } from '../utils/api';
import styles from './LocationsPage.module.css';

const TYPE_COLORS = {
  classroom:'#6c63ff', lab:'#00d4aa', office:'#ffd166',
  hall:'#ff6b6b', canteen:'#f97316', library:'#22d3ee',
  admin:'#a855f7', other:'#8888aa',
};
const TYPE_ICONS = {
  classroom:'🏫', lab:'🔬', office:'🏢', hall:'🎭',
  canteen:'🍽️', library:'📚', admin:'🏛️', other:'📍',
};

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [filter, setFilter]       = useState('');
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => { load(); }, [filter]);

  async function load() {
    setLoading(true);
    try {
      const res = await getLocations(filter ? { type: filter } : {});
      setLocations(res.data);
    } catch {}
    setLoading(false);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this location?')) return;
    try { await deleteLocation(id); load(); } catch {}
  }

  const displayed = locations.filter(l =>
    !search || l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.block?.toLowerCase().includes(search.toLowerCase()) ||
    l.roomNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const types = ['','classroom','lab','office','hall','canteen','library','admin','other'];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>All Locations</h1>
          <p className={styles.sub}>{locations.length} locations indexed on campus</p>
        </div>
        <div className={styles.controls}>
          <input
            className={styles.searchInput}
            placeholder="🔍 Search…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className={styles.filterSelect} value={filter} onChange={e => setFilter(e.target.value)}>
            {types.map(t => (
              <option key={t} value={t}>{t ? `${TYPE_ICONS[t]} ${t}` : 'All types'}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.empty}>⏳ Loading locations…</div>
      ) : displayed.length === 0 ? (
        <div className={styles.empty}>No locations found. Go to the Map page and click "🌱 Load Demo Data" first!</div>
      ) : (
        <div className={styles.grid}>
          {displayed.map(loc => (
            <div key={loc._id} className={styles.card}>
              <div className={styles.cardTop} style={{ borderColor: TYPE_COLORS[loc.type] }}>
                <span className={styles.cardIcon}>{TYPE_ICONS[loc.type]}</span>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>{loc.name}</h3>
                  <span className={styles.cardType} style={{ background: TYPE_COLORS[loc.type]+'22', color: TYPE_COLORS[loc.type] }}>
                    {loc.type}
                  </span>
                </div>
                <button className={styles.deleteBtn} onClick={() => handleDelete(loc._id)}>🗑️</button>
              </div>
              <div className={styles.cardBody}>
                {loc.description && <p className={styles.cardDesc}>{loc.description}</p>}
                <div className={styles.cardMeta}>
                  <span>🏢 Block {loc.block}</span>
                  <span>🪜 Floor {loc.floor}</span>
                  <span>🔢 {loc.roomNumber}</span>
                  {loc.capacity && <span>👥 {loc.capacity}</span>}
                  {loc.isAccessible && <span>♿ Accessible</span>}
                </div>
                {loc.facilities?.length > 0 && (
                  <div className={styles.chips}>
                    {loc.facilities.map(f => <span key={f} className={styles.chip}>{f}</span>)}
                  </div>
                )}
                {loc.tags?.length > 0 && (
                  <div className={styles.tags}>
                    {loc.tags.map(t => <span key={t} className={styles.tagItem}>#{t}</span>)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
