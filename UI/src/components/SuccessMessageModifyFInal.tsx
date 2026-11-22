import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SuccessMessage.css';

const SuccessMessageModifyFInal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [registraionId, setRegistraionId] = useState<string | null>(null);
  const searchNameFromBox = location.state?.searchNameFromBox || '';
  const searchflow = location.state?.searchflow || false;
  const titleName = location.state?.titleName || '';

  const diseaseEligibilityDTO = location.state?.diseaseEligibilityDTO || null;

  const hasDiseaseDTO =
    diseaseEligibilityDTO && Object.keys(diseaseEligibilityDTO).length > 0;

  const nextStage = diseaseEligibilityDTO?.stage || 'Breast Screening';

  useEffect(() => {
    const regId =
      (location.state?.registrationId as string) ||
      localStorage.getItem('registrationId');
    if (regId) {
      setRegistraionId(regId);
    }
  }, [location.state]);

  const displayNextStage = nextStage.replace(/\s*test\s*$/i, '');

  // After a successful modify we always return to the modify search list so
  // the user can pick the next patient / stage to work on.
  const goBackToModifySearch = () => {
    navigate('/ModifyPatientSearchPage', {
      state: {
        searchName: searchNameFromBox,
        registrationId: registraionId || '',
        searchflow,
      },
    });
  };

  return (
    <div className="screening-success-page">
      {searchflow && hasDiseaseDTO ? (
        <main className="content">
          <img
            src="./Curable Icons/PNG/Group 261.png"
            alt="Success Icon"
            className="icon"
          />
          <br />

          <h1>{titleName} Completed Successfully!</h1>

          <p>
            Patient: {searchNameFromBox} (ID: {registraionId})
          </p>

          <div className="screening-success-actions">
            <button
              className="screening-next-btn"
              onClick={goBackToModifySearch}
            >
              Go to {displayNextStage} for {searchNameFromBox}
            </button>

            <button
              className="screening-home-btn"
              onClick={() => navigate('/responsive-cancer-institute')}
            >
              Go to Home
            </button>
          </div>
        </main>
      ) : (
        <main className="content">
          <img
            src="./Curable Icons/PNG/Group 261.png"
            alt="Success Icon"
            className="icon"
          />
          <br />

          <h1>Patient has been updated successfully!</h1>

          {registraionId && (
            <p className="reg-id-text">
              Registration ID: <strong>{registraionId}</strong>
            </p>
          )}

          <button className="primary-button" onClick={goBackToModifySearch}>
            Go To Modify Screening
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate('/responsive-cancer-institute')}
          >
            Back To Home
          </button>
        </main>
      )}
    </div>
  );
};

export default SuccessMessageModifyFInal;
