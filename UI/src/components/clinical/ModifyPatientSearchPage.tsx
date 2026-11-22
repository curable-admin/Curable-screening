import React, { useState } from "react";
import axios from "axios";
import "./PatientSearchPage.css";
import Header from "../Header";
import Header1 from "../Header1";
import config from "../../config";
import { useSelector } from 'react-redux';
import { selectPrivilegeFlags } from '../../store/userSlice';
import { useNavigate, useLocation } from "react-router-dom";

import { canAll, can, Privilege } from '../../store/userSlice';
import Loader from "../common/Loader";


interface Patient {
  id: number;
  name: string;
  registraionId: string;
  age: number;
  gender: string;
  mobileNo: string;
  lastVistCompletedDate: number | string | null;
  eligibleDiseases: {
    candidateId: number;
    stage: string;
    name: string;
    diseaseTestId: number;
     candidateTestId: number; 
  }[] | null;
}

// Mirrors the response shapes consumed by DiseaseSpecificDetailsScreening
// for the `candidatehistoryForPrefil` endpoint.
interface PrefillParam {
  testName: string;
  subtestName?: string;
  selectedValues?: string[];
  value?: string;
  values?: string[];
}

interface PrefillResponse {
  testResult?: { params?: PrefillParam[] };
}

const ModifyPatientSearchPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [stageList, setStageList] = useState<string[]>([]);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  // Index of the eligible disease picked in the dropdown. Stage strings can
  // be duplicated (or contained in each other) across a patient's eligible
  // diseases, so the index is the only reliable way to tell the options apart.
  const [selectedDiseaseIndex, setSelectedDiseaseIndex] = useState<number | null>(null);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const location = useLocation();
const searchNameFromBox = location.state?.searchName || "";
const searchflow = location.state?.searchflow || "";
const registrationId = location.state?.registrationId || "";
const enrolled = location.state?.enrolled || "";
// Restored after a save round-trip from the prefill screen.
const candidateTestIdFromRoute = location.state?.candidateTestId || null;

console.log(location.state,"location.state")
const [selectedCandidateTestId, setSelectedCandidateTestId] = useState<number | null>(
  candidateTestIdFromRoute
);

// Prefill state: mirrors the `candidatehistoryForPrefil` flow used by
// DiseaseSpecificDetailsScreening so the next screen opens pre-populated
// with the data saved for the selected disease type.
const [prefillLoading, setPrefillLoading] = useState(false);
const [prefillData, setPrefillData] = useState<PrefillResponse | null>(null);




  const navigate = useNavigate();
      const { canView, canCreate, canEdit } = useSelector(
      selectPrivilegeFlags('Modify Screening')
    );
  
    // Backend menu "Modify Screening" grants CREATE + EDIT + VIEW.
    // Gate on VIEW + EDIT so the screen also works if CREATE is not granted.
    const allowAllThree = useSelector(canAll('Modify Screening', 'VIEW', 'EDIT'));


    React.useEffect(() => {
  if (searchNameFromBox && searchNameFromBox.trim().length >= 3) {
    setSearchQuery(registrationId);
    handleSearch(registrationId);
  }
}, []);
const handleSearch = async (value?: string) => {
  const finalSearch = value ?? searchQuery;

  if (!finalSearch || finalSearch.trim().length < 3) {
    setError('Please enter a minimum of 3 characters.');
    return;
  }

  setSearchSubmitted(true);
  const hospitalId = localStorage.getItem("hospitalId");
     const roleId= localStorage.getItem('roleId');
    const token = localStorage.getItem("token");
     const userId= localStorage.getItem('userId');
    if (!hospitalId || !token) {
      setError("Hospital ID or Token missing. Please log in again.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<Patient[]>(
        `${config.appURL}/curable/getCandidatesList`,
        {
          hospitalId: Number(hospitalId),
          search: finalSearch,
          stage: 11,
          roleId: Number(roleId),
          userId: Number(userId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        const patientData = response.data.map((patient) => ({
          id: patient.id,
          name: patient.name,
          registraionId: patient.registraionId,
          age: patient.age,
          gender: patient.gender,
          mobileNo: patient.mobileNo,
          eligibleDiseases: patient.eligibleDiseases,
          lastVistCompletedDate: patient.lastVistCompletedDate,
        }));
        setPatients(patientData);
        setTimeout(() => {
          setLoading(false);
        }, 300);
        setCurrentPage(1);

        // Auto-select first patient and stage if searchflow is true
        if (searchflow && patientData.length > 0) {
          handlePatientClick(patientData[0]);
        }
      } else {
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setError("Failed to fetch patients. Please try again later.");
    } finally {
      setTimeout(() => {
              setLoading(false);

      }, 300);
    }
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);

    localStorage.setItem("candidateId", patient.id.toString());
    localStorage.setItem("ptName", patient.name.toString());
    localStorage.setItem("registrationId", patient.registraionId);

    // Keep the last known candidateTestId in sync so the prefill screen can
    // always resolve it (route state first, localStorage as fallback).
    localStorage.removeItem("candidateTestId");

    if (patient.eligibleDiseases && Array.isArray(patient.eligibleDiseases)) {
      if (patient.eligibleDiseases?.length > 0) {
  const firstCandidateTestId = patient.eligibleDiseases[0].candidateTestId;
  setSelectedCandidateTestId(firstCandidateTestId);
  if (firstCandidateTestId != null) {
    localStorage.setItem("candidateTestId", String(firstCandidateTestId));
  }
} else {
  // Do not leak the previously clicked patient's candidateTestId when
  // this patient has no eligible diseases.
  setSelectedCandidateTestId(null);
}

      // Display the stage exactly as returned by the API. The dropdown
      // selection is tracked by index, so no string normalization is
      // needed to keep the options distinguishable.
      const stages = patient.eligibleDiseases.map((disease) => disease.stage);
      const diseaseTestIds = patient.eligibleDiseases.map(
        (disease) => disease.diseaseTestId
      );

      setStageList(stages);

      if (stages.length > 0) {
        setSelectedStage(stages[0]);
        setSelectedDiseaseIndex(0);
        localStorage.setItem("diseaseTestIds", JSON.stringify(diseaseTestIds[0]));
      } else {
        setSelectedStage(null);
        setSelectedDiseaseIndex(null);
      }
    } else {
      setStageList([]);
      setSelectedStage(null);
      setSelectedDiseaseIndex(null);
    }
  };
const handleStageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  // Options are keyed by disease index so eligible diseases whose stage
  // names are identical (or contained in each other) remain distinguishable.
  const rawValue = event.target.value;
  const selectedIndex = rawValue === "" ? null : Number(rawValue);
  setSelectedDiseaseIndex(selectedIndex);

  const stageLabel =
    selectedIndex != null && stageList[selectedIndex] != null
      ? stageList[selectedIndex]
      : null;
  setSelectedStage(stageLabel);

  const eligibleDiseases = selectedPatient?.eligibleDiseases;
  if (
    eligibleDiseases &&
    selectedIndex != null &&
    selectedIndex >= 0 &&
    selectedIndex < eligibleDiseases.length
  ) {
    const selectedDisease = eligibleDiseases[selectedIndex];
    localStorage.setItem(
      "diseaseTestIds",
      JSON.stringify(selectedDisease.diseaseTestId)
    );
    setSelectedCandidateTestId(selectedDisease.candidateTestId);
    if (selectedDisease.candidateTestId != null) {
      localStorage.setItem(
        "candidateTestId",
        String(selectedDisease.candidateTestId)
      );
    }
  }
};

const formatDate = (dateValue: string | number | null) => {
  if (!dateValue) return "N/A";

  const date = new Date(dateValue);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

  /**
   * Resolves the `candidateTestId` for the currently selected disease type.
   * Falls back to the first eligible disease when the stage match fails.
   */
  const resolveCandidateTestId = (): number | null => {
    const eligible = selectedPatient?.eligibleDiseases;

    // The dropdown selection is tracked by index, so diseases sharing the
    // same (or a contained) stage name still resolve to the right entry.
    if (eligible && Array.isArray(eligible) && eligible.length > 0) {
      if (
        selectedDiseaseIndex != null &&
        selectedDiseaseIndex >= 0 &&
        selectedDiseaseIndex < eligible.length
      ) {
        return eligible[selectedDiseaseIndex].candidateTestId ?? null;
      }
    }

    if (selectedCandidateTestId) return selectedCandidateTestId;
    if (candidateTestIdFromRoute) return candidateTestIdFromRoute;

    if (!eligible || !Array.isArray(eligible) || eligible.length === 0) return null;

    return eligible[0].candidateTestId ?? null;
  };

  const handleNext = async () => {
    if (!selectedPatient) {
      setError("Please select a patient before proceeding.");
      return;
    }
    if (prefillLoading) return;

    const patientName = selectedPatient?.name || "";
    const patientgender = selectedPatient?.gender || "";
    const patientAge =
      selectedPatient?.age != null ? selectedPatient.age.toString() : "";

    // mark that the enrollment form should be opened in EDIT (prefill) mode
    localStorage.setItem("prefill", "true");
    localStorage.setItem("patientId", selectedPatient.id.toString());

    localStorage.removeItem("touchedspo2");
    localStorage.removeItem("agevalue");
    localStorage.removeItem("ageatmarriage");
    localStorage.removeItem("totalpreg");
    localStorage.removeItem("firstchild");
    localStorage.removeItem("latschild");
    localStorage.removeItem("heightval");
    localStorage.removeItem("weightval");

    if (selectedStage) {
      localStorage.setItem("selectedStage", selectedStage);
    }
    localStorage.setItem("patientgender", patientgender);
    localStorage.setItem("patientName", patientName);
    localStorage.setItem("patientAge", patientAge);

    // Candidate test id for the disease type currently selected in the dropdown.
    const candidateTestId = resolveCandidateTestId();
    if (candidateTestId != null) {
      localStorage.setItem("candidateTestId", String(candidateTestId));
    }

    // Fetch the previously saved answers for this candidate + disease type so
    // the next screen can be rendered pre-filled, exactly like
    // DiseaseSpecificDetailsScreening does on mount.
    let prefill: PrefillResponse | null = null;
    const token = localStorage.getItem("token");

    if (token && candidateTestId) {
      setPrefillLoading(true);
      setError(null);
      try {
        const prefillResponse = await axios.post<PrefillResponse>(
          `${config.appURL}/curable/candidatehistoryForPrefil`,
          {
            candidateId: selectedPatient.id,
            type: 7,
            diseaseTestId: Number(candidateTestId),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        prefill = prefillResponse.data ?? null;
        setPrefillData(prefill);
        console.log(prefill, "candidatehistoryForPrefil");
      } catch (prefillError) {
        // A missing prefill must not block the modify flow - the next screen
        // falls back to its own fetch / empty form.
        console.warn(
          "Prefill not available / failed, continuing without prefill data.",
          prefillError
        );
        prefill = null;
        setPrefillData(null);
      } finally {
        setPrefillLoading(false);
      }
    } else if (!token) {
      // Cannot fetch history without a token; still allow navigation so the
      // next screen can attempt its own fetch / show an empty form.
      console.warn("Token missing; skipping candidatehistoryForPrefil fetch.");
    }

    // Keep the disease-type id in sync for the prefill screen, which resolves
    // its field definitions from `diseaseTestIds` via getMetricsById.
    const eligibleDiseases = selectedPatient.eligibleDiseases;
    const selectedDisease =
      eligibleDiseases &&
      selectedDiseaseIndex != null &&
      selectedDiseaseIndex >= 0 &&
      selectedDiseaseIndex < eligibleDiseases.length
        ? eligibleDiseases[selectedDiseaseIndex]
        : eligibleDiseases?.find((d) => d.candidateTestId === candidateTestId);
    const diseaseTestId = selectedDisease?.diseaseTestId ?? null;
    if (diseaseTestId) {
      localStorage.setItem("diseaseTestIds", JSON.stringify(diseaseTestId));
    }

    // Navigate to the registered prefill screen. `prefillParams` is the key
    // DiseaseSpecificDetailsModifyPrefill reads to render the saved answers
    // without re-fetching them.
    navigate("/ModifyPatientPrefill", {
      state: {
        candidateId: selectedPatient.id,
        edit: true,
        prefill: "true",
        enrolledstatus: enrolled,
        registrationId: selectedPatient.registraionId,
        registraionId: selectedPatient.registraionId,
        searchName: searchNameFromBox,
        searchNameFromBox,
        searchflow,
        enrolled,
        candidateTestId: candidateTestId ?? selectedCandidateTestId,
        lastVistCompletedDate: selectedPatient?.lastVistCompletedDate,
        diseaseTestId: diseaseTestId ?? undefined,
        prefillParams: prefill?.testResult?.params || [],
        prefillData: prefill,
      },
    });
  };

  // Pagination helpers (client-side)
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(patients.length / pageSize));
  const pagedPatients = patients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goToPage = (n: number) => {
    const target = Math.max(1, Math.min(n, totalPages));
    setCurrentPage(target);
  };

  // clamp page when patients list shrinks
  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [patients.length]);

  // Page-grouping for numbered buttons (show pages in groups of 5)
  const pageGroupSize = 5;
  const currentGroupIndex = Math.floor((currentPage - 1) / pageGroupSize);
  const groupStartPage = currentGroupIndex * pageGroupSize + 1;
  const groupEndPage = Math.min(groupStartPage + pageGroupSize - 1, totalPages);
  const goToPrevGroup = () => goToPage(Math.max(1, groupStartPage - pageGroupSize));
  const goToNextGroup = () => goToPage(Math.min(totalPages, groupStartPage + pageGroupSize));

  return (
    <div className="container10">
      <Loader isLoading={loading} />
       <Header1 />
      

        <div className="title">
          
        <h1 style={{ color: 'darkblue' }}>Modify Screening Information</h1>
      </div>
  <div className="search-section_common">
        <input
                  className="search-input"

           id="search"
          type="text"
          placeholder="Search by Patient name/id/mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search patient"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();       
              handleSearch();           
            }
          }}      />
        <button
           className={`search-button_common ${!allowAllThree ? 'disabled-button' : ''}`}
 onClick={() => handleSearch()}
  disabled={!allowAllThree || loading}                >
                  {loading ? 'Searching...' : 'Search'}
         
        </button>
      </div>
  {error && <p className="error center-message">{error}</p>}

      <div className="search-container">

       
      </div>



{!loading && searchSubmitted && patients.length === 0 && (
  <p className="error center-message">No patient found</p>
)}



       



      {patients.length > 0 && (
        <>
          <div className="patient-list">
            <label className="select-label">Select Patient</label>
            <div>
              {pagedPatients.map((patient) => (
                <div
                  key={patient.id}
                  className={`patient-item ${
                    selectedPatient?.id === patient.id ? "selected" : ""
                  }`}
                  onClick={() => handlePatientClick(patient)}
                >
                  <div className="patient-box">
                    <div>
                      <strong>Name:</strong> {patient.name}
                    </div>
                    <div>
                      <strong>ID:</strong> {patient.registraionId || "N/A"}
                    </div>
                    <div>
                      <strong>Age:</strong> {patient.age || "N/A"}
                    </div>
                   <div className="revisit-date">
  <strong>Revisit Date:</strong> {formatDate(patient.lastVistCompletedDate)}
</div>
                    <div>
                      <strong>Gender:</strong> {patient.gender || "N/A"}
                    </div>
                    <div>
                      <strong>Mobile No:</strong> {patient.mobileNo || "N/A"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

            {patients.length > pageSize && (
              <div className="pagination-container">
                <div className="pagination-center">
                  <div className="pagination-summary">
                    Showing {(patients.length === 0) ? 0 : ((currentPage - 1) * pageSize + 1)} - {Math.min(currentPage * pageSize, patients.length)} of {patients.length}
                  </div>

                  <div className="pagination-prev">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="page-btn"
                      aria-label="Previous page"
                    >
                      Prev
                    </button>
                  </div>

                  <div className="pagination-pages">
                    {/* Desktop: show current group. Mobile: CSS will show pages 1..5 via JS below */}
                    {(() => {
                      // On small screens we want to show first 5 pages; otherwise show current group
                      const isMobileApprox = typeof window !== 'undefined' && window.innerWidth <= 600;
                      const start = isMobileApprox ? 1 : groupStartPage;
                      const end = isMobileApprox ? Math.min(5, totalPages) : groupEndPage;
                      return Array.from({ length: end - start + 1 }, (_, i) => start + i).map(p => (
                        <button key={p} onClick={() => goToPage(p)} className={`page-btn ${p === currentPage ? 'active' : ''}`}>{p}</button>
                      ));
                    })()}
                  </div>

                  <div className="pagination-next">
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </div>

                {/* On mobile we show the summary below the controls */}
                <div className="pagination-summary-mobile">
                  Showing {(patients.length === 0) ? 0 : ((currentPage - 1) * pageSize + 1)} - {Math.min(currentPage * pageSize, patients.length)} of {patients.length}
                </div>
              </div>
            )}

          <div className="stage-dropdown">
            <label className="select-label">Modify Information</label>
            <select
              value={selectedDiseaseIndex ?? ""}
              onChange={handleStageChange}
              aria-label="Select Stage"
            >
              <option value="">Select Stage</option>
              {stageList.map((stage, index) => (
                <option key={index} value={index}>
                  {stage}
                </option>
              ))}
            </select>

            <button
              disabled={!allowAllThree || prefillLoading }
              onClick={handleNext}
              aria-label="Next"
              className={`next-button ${!allowAllThree || prefillLoading ? 'disabled-button' : ''}`}
            >
              {prefillLoading ? 'Loading...' : 'Next'}
            </button>
          </div>
          <br/>
        </>
      )}
      {/* {patients.length === 0 && !loading && <p>No patients found.</p>} */}
      <footer className="footer-container-fixed">
        <div className="footer-content">
          <p className="footer-text">Powered By</p>
          <img src="/assets/Curable logo - rectangle with black text.png" alt="Curable Logo" className="footer-logo" />
        </div>
      </footer>
    </div>
  );
};

export default ModifyPatientSearchPage;