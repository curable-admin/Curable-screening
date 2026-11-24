import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PatientView.css';
import Header1 from './Header1';
import config from '../config';
import Loader from './common/Loader';

const PatientView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const candidate = location.state?.candidate || {};
  const candidateId = location.state?.candidateId || candidate?.id;
  const searchNameFromBox = location.state?.searchNameFromBox || "";
  const searchflow = location.state?.searchflow || "";
  const enrolled = location.state?.enrolled || "";

  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentStage, setCurrentStage] = useState<string>('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!candidateId) return;
      const token = localStorage.getItem('token');
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${config.appURL}/curable/candidateCustomHistory/${candidateId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rd: any = res.data;
        // New response shape: { historyDTOS: [...], currentStage: "..." }
        // Fallbacks kept for backward compatibility (array or { data: [...] })
        if (Array.isArray(rd)) {
          setHistory(rd);
        } else if (Array.isArray(rd?.historyDTOS)) {
          setHistory(rd.historyDTOS);
          setCurrentStage(rd?.currentStage || '');
        } else {
          setHistory(rd?.data || []);
          setCurrentStage(rd?.currentStage || '');
        }
      } catch (e) {
        console.error('Error fetching candidate history:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [candidateId]);

  const name = candidate?.name || '';
  const gender = candidate?.gender || '';
  const age = candidate?.age || '';
  const registrationId = candidate?.registrationId || candidate.registraionId || '';
  const createdDate = candidate?.createdDate || (history.length ? history[0]?.createdDate : '');

  // Handles the dynamic stage button click based on currentStage from the API.
  // - "Go to screening" -> Screening page with registrationId as search text
  // - "Go to clinical"  -> Clinical page with registrationId as search text
  // - "Go to patient"   -> behaves like the Back button
  const handleStageButtonClick = () => {
    const stage = (currentStage || '').trim().toLowerCase();

    if (stage === 'go to screening') {
      navigate('/PatientSearchPage', {
        state: {
          searchName: registrationId,
          registrationId,
          searchflow,
          enrolled,
        },
      });
    } else if (stage === 'go to clinical') {
      navigate('/ClinicSearchPage', {
        state: {
          searchName: registrationId,
          registrationId,
          searchflow,
          enrolled,
        },
      });
    } else if (stage === 'go to patient' || stage === 'go to patients') {
      // Back button functionality (supports both singular and plural)
      navigate('/PatientEdit', {
        state: { searchName: searchNameFromBox, searchflow, enrolled, registrationId },
      });
    }
  };

  return (
    <div className="container21">
      <Header1 />
      {loading && <Loader isLoading={loading} />}
      <div className="pv-scroll-area">
      <div className="participant-container">
        <p className="participant-info-text"><strong>Participant: </strong> {name} {age}/{gender}</p>
        <p className="participant-info-text"><strong>ID:</strong> {registrationId}</p>
      </div>
      <h1 className="pv-heading" style={{ color: 'darkblue' }}>Patient history</h1>
      <div className="pv-timeline">
        <div className="pv-line" />
        <div className="pv-event">
          <div className="pv-circle" />
          <div className="pv-event-content">
            <div className="pv-date-row">
              <span className="pv-date" style={{ fontSize: '16px', color: 'black' }}>{createdDate}</span>
            </div>
            <div className="pv-event-title" style={{ fontSize: '17px', color: 'black', fontWeight: '700' }}>Registered</div>
          </div>
        </div>
        {history.map((h, i) => (
          <div className="pv-event" key={i}>
            <div className="pv-circle" />
            <div className="pv-event-content">
              <div className="pv-date-row">
                <span className="pv-date" style={{ fontSize: '16px', color: 'black' }}>{h.createdDate || h.date}</span>
                {h.status && (
                  <span className="pv-badge-slot">
                    <span className={`pv-badge ${String(h.status).toLowerCase() === 'completed' ? 'pv-completed' : 'pv-pending'}`} style={{ fontSize: '15px', fontWeight: '600', color: String(h.status).toLowerCase() === 'completed' ? '#087A55' : '#A85A00' }}>
                      {h.status}
                    </span>
                  </span>
                )}
              </div>
              <div className="pv-event-title" style={{ fontSize: '17px', color: 'black', fontWeight: '700' }}>{h.title || h.screeningName || h.name}</div>
              {h.referral && <div className="pv-referral" style={{ fontSize: '16px', color: 'black' }}>Referral: {h.referral}</div>}
            </div>
          </div>
        ))}
      </div>
      </div>
      <div className="pv-buttons">
        <button className="pv-btn pv-edit" style={{ fontSize: '16px', fontWeight: '600' }} onClick={() => navigate('/PatientEdit', { state: { searchName: searchNameFromBox, searchflow, enrolled, registrationId: registrationId } })}>Back</button>
        <button className="pv-btn pv-start" style={{ fontSize: '16px', fontWeight: '700' }} onClick={handleStageButtonClick}>{currentStage || 'Start screening'}</button>
      </div>
      <footer className="footer-container-fixed">
        <div className="footer-content">
          <p className="footer-text">Powered By</p>
          <img src="/assets/Curable logo - rectangle with black text.png" alt="Curable Logo" className="footer-logo" />
        </div>
      </footer>
    </div>
  );
};

export default PatientView;
