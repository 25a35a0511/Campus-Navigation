import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { getLocations, getMarkers, searchLocations, seedLocations, seedMarkers } from '../utils/api';
import styles from './MapPage.module.css';

// Fix default leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TYPE_COLORS = {
  classroom: '#6c63ff', lab: '#00d4aa', office: '#ffd166',
  hall: '#ff6b6b', canteen: '#f97316', library: '#22d3ee',
  admin: '#a855f7', other: '#8888aa',
};

const TYPE_ICONS = {
  classroom:'🏫', lab:'🔬', office:'🏢', hall:'🎭',
  canteen:'🍽️', library:'📚', admin:'🏛️', other:'📍',
};

function makeIcon(emoji, color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="44" viewBox="0 0 38 44">
      <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.5)"/></filter>
      <ellipse cx="19" cy="40" rx="7" ry="3" fill="rgba(0,0,0,0.3)"/>
      <path d="M19 2 C10 2 4 9 4 17 C4 27 19 42 19 42 C19 42 34 27 34 17 C34 9 28 2 19 2Z"
            fill="${color}" filter="url(#sh)"/>
      <circle cx="19" cy="17" r="10" fill="rgba(255,255,255,0.15)"/>
      <text x="19" y="22" text-anchor="middle" font-size="13">${emoji}</text>
    </svg>`;
  return L.divIcon({
    html: svg, className: '', iconSize: [38, 44], iconAnchor: [19, 44], popupAnchor: [0, -44],
  });
}

function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => { if (position) map.flyTo(position, 18, { duration: 1.2 }); }, [position]);
  return null;
}

const CAMPUS_CENTER = [17.4485, 78.3910];

export default function MapPage() {
  const [locations, setLocations]   = useState([]);
  const [markers, setMarkers]       = useState([]);
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [selected, setSelected]     = useState(null);
  const [flyTo, setFlyTo]           = useState(null);
  const [filterType, setFilterType] = useState('');
  const [loading, setLoading]       = useState(false);
  const [seeded, setSeeded]         = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [loc, mk] = await Promise.all([getLocations(), getMarkers()]);
      setLocations(loc.data);
      setMarkers(mk.data);
    } catch {}
  }

  async function handleSeed() {
    setLoading(true);
    try {
      await Promise.all([seedLocations(), seedMarkers()]);
      await loadAll();
      setSeeded(true);
    } catch {}
    setLoading(false);
  }

  function handleSearch(val) {
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await searchLocations(val, filterType);
        setResults(res.data);
      } catch {}
    }, 280);
  }

  function selectLocation(loc) {
    setSelected(loc);
    setFlyTo([loc.coordinates.lat, loc.coordinates.lng]);
    setQuery(loc.name);
    setResults([]);
  }

  const typesList = ['','classroom','lab','office','hall','canteen','library','admin','other'];

  return (
    <div className={styles.layout}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideTop}>
          <p className={styles.sideTitle}>Find a Location</p>

          {/* Search */}
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search rooms, labs, offices…"
              value={query}
              onChange={e => handleSearch(e.target.value)}
            />
            {query && (
              <button className={styles.clearBtn} onClick={() => { setQuery(''); setResults([]); }}>✕</button>
            )}
          </div>

          {/* Filter */}
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={e => { setFilterType(e.target.value); handleSearch(query); }}
          >
            {typesList.map(t => (
              <option key={t} value={t}>{t ? `${TYPE_ICONS[t]} ${t.charAt(0).toUpperCase()+t.slice(1)}` : '🏛️ All types'}</option>
            ))}
          </select>

          {/* Search results */}
          {results.length > 0 && (
            <ul className={styles.resultsList}>
              {results.map(r => (
                <li key={r._id} className={styles.resultItem} onClick={() => selectLocation(r)}>
                  <span className={styles.resultIcon} style={{ background: TYPE_COLORS[r.type]+'33', color: TYPE_COLORS[r.type] }}>
                    {TYPE_ICONS[r.type]}
                  </span>
                  <div>
                    <div className={styles.resultName}>{r.name}</div>
                    <div className={styles.resultMeta}>Block {r.block} · Floor {r.floor} · {r.roomNumber}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Selected info panel */}
        {selected && (
          <div className={styles.infoPanel}>
            <div className={styles.infoPanelHeader} style={{ borderColor: TYPE_COLORS[selected.type] }}>
              <span className={styles.infoPanelIcon}>{TYPE_ICONS[selected.type]}</span>
              <div>
                <div className={styles.infoPanelName}>{selected.name}</div>
                <span className={styles.infoPanelType} style={{ background: TYPE_COLORS[selected.type]+'33', color: TYPE_COLORS[selected.type] }}>
                  {selected.type}
                </span>
              </div>
              <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className={styles.infoPanelBody}>
              {selected.description && <p className={styles.infoDesc}>{selected.description}</p>}
              <div className={styles.infoGrid}>
                <div className={styles.infoCell}><span>🏢</span><span>Block {selected.block}</span></div>
                <div className={styles.infoCell}><span>🪜</span><span>Floor {selected.floor}</span></div>
                <div className={styles.infoCell}><span>🔢</span><span>{selected.roomNumber}</span></div>
                {selected.capacity && <div className={styles.infoCell}><span>👥</span><span>{selected.capacity} seats</span></div>}
                {selected.isAccessible && <div className={styles.infoCell}><span>♿</span><span>Accessible</span></div>}
              </div>
              {selected.facilities?.length > 0 && (
                <div className={styles.infoFacilities}>
                  {selected.facilities.map(f => <span key={f} className={styles.facilityTag}>{f}</span>)}
                </div>
              )}
              {selected.tags?.length > 0 && (
                <div className={styles.infoTags}>
                  {selected.tags.map(t => <span key={t} className={styles.tag}>#{t}</span>)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* All locations list */}
        <div className={styles.allList}>
          <div className={styles.allListHeader}>
            <span>All Locations ({locations.length})</span>
            {!seeded && (
              <button className={styles.seedBtn} onClick={handleSeed} disabled={loading}>
                {loading ? '⏳ Seeding…' : '🌱 Load Demo Data'}
              </button>
            )}
          </div>
          {locations.map(loc => (
            <div
              key={loc._id}
              className={`${styles.locItem} ${selected?._id === loc._id ? styles.locItemActive : ''}`}
              onClick={() => selectLocation(loc)}
            >
              <span className={styles.locIcon} style={{ color: TYPE_COLORS[loc.type] }}>{TYPE_ICONS[loc.type]}</span>
              <div>
                <div className={styles.locName}>{loc.name}</div>
                <div className={styles.locMeta}>Block {loc.block} · {loc.roomNumber}</div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Map ── */}
      <div className={styles.mapWrap}>
        <MapContainer
          center={CAMPUS_CENTER}
          zoom={17}
          style={{ width: '100%', height: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {flyTo && <FlyTo position={flyTo} key={flyTo.join()} />}

          {/* Location markers */}
          {locations.map(loc => (
            <Marker
              key={loc._id}
              position={[loc.coordinates.lat, loc.coordinates.lng]}
              icon={makeIcon(TYPE_ICONS[loc.type], TYPE_COLORS[loc.type])}
              eventHandlers={{ click: () => setSelected(loc) }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{loc.name}</div>
                  <div style={{ fontSize: 11, color: '#8888aa', marginBottom: 8 }}>Block {loc.block} · Floor {loc.floor} · {loc.roomNumber}</div>
                  {loc.description && <div style={{ fontSize: 12, color: '#c4c4e0', lineHeight: 1.5 }}>{loc.description}</div>}
                  {loc.facilities?.length > 0 && (
                    <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {loc.facilities.map(f => (
                        <span key={f} style={{ background:'rgba(108,99,255,0.2)', color:'#a5a0ff', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Extra markers */}
          {markers.map(m => (
            <Marker
              key={m._id}
              position={[m.coordinates.lat, m.coordinates.lng]}
              icon={makeIcon(m.icon, '#8888aa')}
            >
              <Popup>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{m.icon} {m.title}</div>
                  <div style={{ fontSize: 12, color: '#8888aa' }}>{m.description}</div>
                  <span style={{ display:'inline-block', marginTop:6, background:'rgba(255,255,255,0.1)', fontSize:10, padding:'2px 8px', borderRadius:20 }}>{m.category}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className={styles.legend}>
          {Object.entries(TYPE_COLORS).slice(0,6).map(([t,c]) => (
            <div key={t} className={styles.legendItem}>
              <span className={styles.legendDot} style={{ background: c }} />
              <span>{TYPE_ICONS[t]} {t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
