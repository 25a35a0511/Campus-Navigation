import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import MapPage        from './pages/MapPage';
import LocationsPage  from './pages/LocationsPage';
import PersonasPage   from './pages/PersonasPage';
import AdminPage      from './pages/AdminPage';
import styles         from './App.module.css';

function Nav() {
  const loc = useLocation();
  const links = [
    { to: '/',          label: '🗺️ Map',       exact: true },
    { to: '/locations', label: '🏢 Locations'              },
    { to: '/personas',  label: '👤 Personas'               },
    { to: '/admin',     label: '⚙️ Admin'                  },
  ];
  return (
    <nav className={styles.topbar}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>🧭</span>
        <div>
          <span className={styles.brandName}>CampusNav</span>
          <span className={styles.brandSub}>Smart Campus Navigation</span>
        </div>
      </div>
      <div className={styles.navLinks}>
        {links.map(l => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.exact}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.navActive : ''}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <div className={styles.navBadge}>DTI · Week 2</div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.app}>
        <Nav />
        <main className={styles.main}>
          <Routes>
            <Route path="/"          element={<MapPage />}       />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/personas"  element={<PersonasPage />}  />
            <Route path="/admin"     element={<AdminPage />}     />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
