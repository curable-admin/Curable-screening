// src/components/ResponsiveCancerInstitute.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './ResponsiveCancerInstitute.css';
import { useNavigate } from 'react-router-dom';
import Header1 from './Header1';
import { useSelector } from 'react-redux';
import { selectMenus } from '../store/userSlice';
import { toRoute, normalize } from '../utils/routeMap'; // 👈 import normalize
import SearchBox from './SearchBox';

// Menu label -> icon file name (without extension) in /HomeScreenIcons/PNG
const ICON_MAP: Record<string, string> = {
  'modify screening': 'modify screening',
  'modify screening information': 'modify screening',
  'modify patient information': 'modify patient information',
  'clinical evaluvation': 'Clinical Evaluvation',
  'clinical evaluation': 'Clinical Evaluation',
};

const DEFAULT_ICON = 'Patient Registration';

// resolve the icon file for a menu entry, with graceful fallback
const resolveIcon = (menu?: string) => {
  const raw = (menu || '').trim();
  if (!raw) return DEFAULT_ICON;
  return ICON_MAP[raw.toLowerCase()] || raw;
};

const ResponsiveCancerInstitute: React.FC = () => {
  const navigate = useNavigate();
  const menus = useSelector(selectMenus);
const [isSearchActive, setIsSearchActive] = useState(false);
  // hide the injected "Modify Patient Information" entry (/PatientEdit)
  const visibleMenus = (menus || []).filter(
    (m) =>
      m?.menu?.trim().toLowerCase() !== 'modify patient information' &&
      normalize(m?.url || '') !== normalize('/PatientEdit')
  );
                        console.log(visibleMenus,"Evaluation")

  return (
    <div  className="container10">
      <Header1  />
      

      <main className="container4-fluid">
<SearchBox onSearchActiveChange={setIsSearchActive} />
{!isSearchActive && (
  <div className="container4-box d-flex flex-wrap justify-content-center">
    {visibleMenus.map((m) => (
      <div
        key={m.menu}
        className="box"
        onClick={() => navigate(toRoute(m.url))}
        style={{ cursor: 'pointer' }}
      >
        {(() => {
          const imgKey = resolveIcon(m.menu);

          const isReports =
            typeof m.menu === 'string' &&
            m.menu.trim().toLowerCase() === 'reports';

          const imgSize = isReports ? 64 : 50;
          const isbotton = isReports ? 5 : 10;

          return (
            <img
              src={`/HomeScreenIcons/PNG/${imgKey}.png`}
              onError={(e: any) => {
                // if the specific icon is missing, fall back to a known icon
                const el = e.currentTarget;
                if (!el.dataset.fallbackApplied && el.src.indexOf(DEFAULT_ICON) === -1) {
                  el.dataset.fallbackApplied = 'true';
                  el.src = `/HomeScreenIcons/PNG/${DEFAULT_ICON}.png`;
                } else {
                  el.style.visibility = 'hidden';
                }
              }}
              alt={m.menu}
              style={{
                width: imgSize,
                height: imgSize,
                marginBottom: isbotton,
                marginTop: '-2px',
              }}
            />
          );
        })()}

        <div style={{ color: 'black' }}>{m.menu}</div>
      </div>
    ))}

    {visibleMenus.length === 0 && (
      <div style={{ color: '#666', padding: 16 }}>
        No menus available.
      </div>
    )}
  </div>
)}
        <br/>
      </main>

        <footer className="footer-container-fixed">
        <div className="footer-content">
          <p className="footer-text">Powered By</p>
          <img src="/assets/Curable logo - rectangle with black text.png" alt="Curable Logo" className="footer-logo" />
        </div>
      </footer>
    </div>
  );
};

export default ResponsiveCancerInstitute;
