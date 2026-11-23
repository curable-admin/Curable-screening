import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../config';
import './PatientView.css';

export interface PatientHistorySheetPatient {
  id: number;
  name: string;
  registraionId?: string;
  registrationId?: string;
  age?: number | string;
  gender?: string;
  createdDate?: string | null;
}

interface PatientHistorySheetProps {
  /** The patient whose journey is shown. */
  patient: PatientHistorySheetPatient | null;
  /** Whether the bottom sheet is visible. */
  open: boolean;
  /** Called when the user closes the sheet (backdrop click or Close button). */
  onClose: () => void;
}

/**
 * Reusable half-popup (bottom sheet) that shows a patient's journey/history.
 * Mirrors the "sheet" in the Screening prototype and reuses the timeline
 * styles from PatientView.css. Fetches the history itself so callers only
 * need to pass the patient and an open/close state.
 */
const PatientHistorySheet: React.FC<PatientHistorySheetProps> = ({
  patient,
  open,
  onClose,
}) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !patient) return;

    let cancelled = false;
    const fetchHistory = async () => {
      setLoading(true);
      setHistory([]);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await axios.get(
            `${config.appURL}/curable/candidateCustomHistory/${patient.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const rd: any = res.data;
          if (!cancelled) {
            setHistory(Array.isArray(rd) ? rd : rd?.data || []);
          }
        }
      } catch (e) {
        console.error('Error fetching candidate history:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHistory();
    return () => {
      cancelled = true;
    };
  }, [open, patient]);

  if (!open || !patient) return null;

  const registrationId =
    patient.registrationId || patient.registraionId || '';

  return (
    <>
      <div className="pv-sheet-bg" onClick={onClose} />
      <div className="pv-sheet" role="dialog" aria-label="Patient history">
        <div className="pv-sheet-header">
          <b>Patient history</b>
          <button className="pv-sheet-close" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="participant-container">
          <p className="participant-info-text">
            <strong>Participant: </strong> {patient.name} {patient.age}/{patient.gender}
          </p>
          <p className="participant-info-text">
            <strong>ID:</strong> {registrationId || 'N/A'}
          </p>
        </div>

        {loading ? (
          <div className="pv-sheet-loading">Loading...</div>
        ) : (
          <div className="pv-timeline">
            <div className="pv-line" />
            <div className="pv-event">
              <div className="pv-circle" />
              <div className="pv-event-content">
                <div className="pv-date-row">
                  <span className="pv-date">{patient.createdDate}</span>
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
                      <span
                        className={`pv-badge ${
                          String(h.status).toLowerCase() === 'completed'
                            ? 'pv-completed'
                            : 'pv-pending'
                        }`}
                      >
                        {h.status}
                      </span>
                    )}
                  </div>
                  <div className="pv-event-title">
                    {h.title || h.screeningName || h.name}
                  </div>
                  {h.referral && (
                    <div className="pv-referral">Referral: {h.referral}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PatientHistorySheet;