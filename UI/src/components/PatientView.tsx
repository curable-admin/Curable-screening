import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/PatientView.css';
import Header1 from './Header1';
import config from '../config';

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
        setHistory(Array.isArray(rd) ? rd : (rd?.data || []));
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
  const mobileNo = candidate?.mobileNo || '';
  const registrationId = candidate?.registrationId || candidate.registraionId || '';
  const createdDate = candidate?.createdDate || (history.length ? history[0]?.createdDate : '');

  return (
    <div className="pv-screen">
      <Header1 />
      <main className="pv-content">
        <div className="pv-patient">
          <div className="pv-name">{name}</div>
          <div className="pv-details">{age} · {gender} · {mobileNo}</div>
          <div className="pv-id">{registrationId}</div>
        </div>

        <div className="pv-journey-heading">Patient journey</div>

        <div className="pv-timeline">
          <div className="pv-line" />
          <div className="pv-event">
            <div className="pv-circle" />
            <div className="pv-event-content">
              <div className="pv-date-row">
                <span className="pv-date">{createdDate}</span>
              </div>
              <div className="pv-event-title">Registered</div>
            </div>
          </div>
          {history.map((h, i) => (
            <div className="pv-event" key={i}>
              <div className="pv-circle" />
              <div className="pv-event-content">
                <div className="pv-date-row">
                  <span className="pv-date">{h.createdDate || h.date}</span>
                  {h.status && (
                    <span className={`pv-badge ${String(h.status).toLowerCase() === 'completed' ? 'pv-completed' : 'pv-pending'}`}>
                      {h.status}
                    </span>
                  )}
                </div>
                <div className="pv-event-title">{h.title || h.screeningName || h.name}</div>
                {h.referral && <div className="pv-referral">Referral: {h.referral}</div>}
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className="pv-buttons">
        <button className="pv-btn pv-edit" onClick={() => navigate('/PatientEdit', { state: { searchName: searchNameFromBox, searchflow, enrolled } })}>Back</button>
        <button className="pv-btn pv-start">Start screening</button>
      </div>
    </div>
  );
};

export default PatientView;