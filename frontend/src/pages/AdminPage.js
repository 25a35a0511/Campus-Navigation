import React, { useState, useEffect } from 'react';
import { getLocations, createLocation, deleteLocation, seedLocations, seedMarkers, getMarkers, deleteMarker } from '../utils/api';
import styles from './AdminPage.module.css';

const EMPTY_FORM = {
  name: '', type: 'classroom', block: '', floor: 0,
  roomNumber: '', description: '',
  lat: '17.4485', lng: '78.3910',
  facilities: '', tags: '', capacity: '', isAccessible: false,
};

const TYPE_ICONS = {
  classroom:'🏫', lab:'🔬', office:'🏢', hall:'🎭',
  canteen:'🍽️', library:'📚', admin:'🏛️', other:'📍',
};

export default function AdminPage() {
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers]     = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [toast, setToast]         = useState('');
  const [tab, setTab]             = useState('locations');
  const [seeding, setSeeding]     = useState(false);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [loc, mk] = await Promise.all([getLocations(), getMarkers()]);
      setLocations(loc.data);
      setMarkers(mk.data);
    } catch {}
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function handleChange(e) {
    const { name, value, type: t, checked } = e.target;
    setForm(f => ({ ...f, [name]: t === 'checkbox' ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        type: form.type,
        block: form.block,
        floor: Number(form.floor),
        roomNumber: form.roomNumber,
        description: form.description,
        coordinates: { lat: parseFloat(form.lat), lng: parseFloat(form.lng) },
        facilities: form.facilities ? form.facilities.split(',').map(s => s.trim()).filter(Boolean) : [],
        tags:       form.tags       ? form.tags.split(',').map(s => s.trim()).filter(Boolean) : [],
        capacity:   form.capacity ? Number(form.capacity) : undefined,
        isAccessible: form.isAccessible,
      };
      await createLocation(payload);
      setForm(EMPTY_FORM);
      await loadAll();
      showToast('✅ Location added successfully!');
    } catch (err) {
      showToast('❌ Failed to add location');
    }
    setSaving(false);
  }

  async function handleDeleteLoc(id) {
    if (!window.confirm('Delete this location?')) return;
    try { await deleteLocation(id); await loadAll(); showToast('🗑️ Location deleted'); } catch {}
  }

  async function handleDeleteMk(id) {
    if (!window.confirm('Delete this marker?')) return;
    try { await deleteMarker(id); await loadAll(); showToast('🗑️ Marker deleted'); } catch {}
  }

  async function handleSeed() {
    setSeeding(true);
    try {
      await Promise.all([seedLocations(), seedMarkers()]);
      await loadAll();
      showToast('🌱 Demo data loaded — 12 locations + 6 markers!');
    } catch { showToast('❌ Seed failed'); }
    setSeeding(false);
  }

  const types = ['classroom','lab','office','hall','canteen','library','admin','other'];

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Admin Panel</h1>
          <p className={styles.sub}>Manage campus locations and map markers</p>
        </div>
        <button className={styles.seedBtn} onClick={handleSeed} disabled={seeding}>
          {seeding ? '⏳ Loading…' : '🌱 Load Demo Data'}
        </button>
      </div>

      <div className={styles.layout}>
        {/* ── Add Form ── */}
        <section className={styles.formSection}>
          <h2 className={styles.sectionTitle}>➕ Add New Location</h2>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <label className={styles.label}>Location Name *</label>
              <input name="name" required className={styles.input} placeholder="e.g. CSE Lab 3" value={form.name} onChange={handleChange} />
            </div>

            <div className={styles.formRow2}>
              <div className={styles.formRow}>
                <label className={styles.label}>Type *</label>
                <select name="type" className={styles.input} value={form.type} onChange={handleChange}>
                  {types.map(t => <option key={t} value={t}>{TYPE_ICONS[t]} {t}</option>)}
                </select>
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Block</label>
                <input name="block" className={styles.input} placeholder="A / B / C…" value={form.block} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.formRow2}>
              <div className={styles.formRow}>
                <label className={styles.label}>Floor</label>
                <input name="floor" type="number" className={styles.input} value={form.floor} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Room Number</label>
                <input name="roomNumber" className={styles.input} placeholder="e.g. A301" value={form.roomNumber} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Description</label>
              <textarea name="description" className={styles.textarea} rows={3} placeholder="Brief description…" value={form.description} onChange={handleChange} />
            </div>

            <div className={styles.formRow2}>
              <div className={styles.formRow}>
                <label className={styles.label}>Latitude *</label>
                <input name="lat" required className={styles.input} placeholder="17.4485" value={form.lat} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label className={styles.label}>Longitude *</label>
                <input name="lng" required className={styles.input} placeholder="78.3910" value={form.lng} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Facilities <span className={styles.hint}>(comma-separated)</span></label>
              <input name="facilities" className={styles.input} placeholder="AC, Projector, WiFi" value={form.facilities} onChange={handleChange} />
            </div>

            <div className={styles.formRow}>
              <label className={styles.label}>Tags <span className={styles.hint}>(comma-separated)</span></label>
              <input name="tags" className={styles.input} placeholder="cse, lab, computers" value={form.tags} onChange={handleChange} />
            </div>

            <div className={styles.formRow2}>
              <div className={styles.formRow}>
                <label className={styles.label}>Capacity</label>
                <input name="capacity" type="number" className={styles.input} placeholder="60" value={form.capacity} onChange={handleChange} />
              </div>
              <div className={styles.formRowCheck}>
                <input name="isAccessible" id="accessible" type="checkbox" checked={form.isAccessible} onChange={handleChange} className={styles.checkbox} />
                <label htmlFor="accessible" className={styles.checkLabel}>♿ Wheelchair accessible</label>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? '⏳ Saving…' : '➕ Add Location'}
            </button>
          </form>
        </section>

        {/* ── Data Tables ── */}
        <section className={styles.tableSection}>
          <div className={styles.tableTabs}>
            <button className={`${styles.tableTab} ${tab==='locations'?styles.tableTabActive:''}`} onClick={() => setTab('locations')}>
              🏢 Locations ({locations.length})
            </button>
            <button className={`${styles.tableTab} ${tab==='markers'?styles.tableTabActive:''}`} onClick={() => setTab('markers')}>
              📍 Markers ({markers.length})
            </button>
          </div>

          {tab === 'locations' && (
            <div className={styles.tableWrap}>
              {locations.length === 0
                ? <div className={styles.empty}>No locations yet. Add one or load demo data.</div>
                : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th><th>Type</th><th>Block</th><th>Floor</th><th>Room</th><th>Coordinates</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {locations.map(l => (
                      <tr key={l._id}>
                        <td className={styles.tdName}>{TYPE_ICONS[l.type]} {l.name}</td>
                        <td><span className={styles.typePill}>{l.type}</span></td>
                        <td>{l.block}</td>
                        <td>{l.floor}</td>
                        <td>{l.roomNumber}</td>
                        <td className={styles.tdCoords}>{l.coordinates.lat.toFixed(4)}, {l.coordinates.lng.toFixed(4)}</td>
                        <td>
                          <button className={styles.delBtn} onClick={() => handleDeleteLoc(l._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'markers' && (
            <div className={styles.tableWrap}>
              {markers.length === 0
                ? <div className={styles.empty}>No markers yet. Load demo data to populate.</div>
                : (
                <table className={styles.table}>
                  <thead>
                    <tr><th>Title</th><th>Category</th><th>Icon</th><th>Coordinates</th><th></th></tr>
                  </thead>
                  <tbody>
                    {markers.map(m => (
                      <tr key={m._id}>
                        <td className={styles.tdName}>{m.title}</td>
                        <td><span className={styles.typePill}>{m.category}</span></td>
                        <td style={{ fontSize: 20 }}>{m.icon}</td>
                        <td className={styles.tdCoords}>{m.coordinates.lat.toFixed(4)}, {m.coordinates.lng.toFixed(4)}</td>
                        <td>
                          <button className={styles.delBtn} onClick={() => handleDeleteMk(m._id)}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
