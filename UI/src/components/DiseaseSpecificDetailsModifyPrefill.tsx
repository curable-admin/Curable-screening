import React, { useEffect, useState } from "react";
import axios from "axios";
import Header1 from "./Header1";
import Select, { MultiValue } from "react-select";
import { Calendar } from "primereact/calendar";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import config from "../config";
import "./Common.css";
import "./disease.css";
import Loader from "./common/Loader";
import { useNavigate, useLocation } from "react-router-dom";

/* ------------------------------------------------------------------ *
 * Types
 * ------------------------------------------------------------------ */
interface Condition {
  enabledField: string;
  triggerValue: string;
}

interface Field {
  testName: string;
  subtestName: string;
  condition?: Condition[];
  // "SingleSelect" | "Multi Select" | "Input" | "Date" | "SingleSelectButton"
  valueType: string;
  values: string[];
  isMandatory?: boolean;
}

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

interface ApiResponse {
  id?: number;
  stage?: string;
  testMetrics?: { params?: Field[] };
}

interface ColourOption {
  value: string;
  label: string;
}

interface DiseaseEligibilityDTO {
  candidateId: number;
  stage: string;
  name: string;
  diseaseTestId: number;
  candidateTestId: number;
}

interface CandidateHistoryResponse {
  diseaseEligibilityDTO?: DiseaseEligibilityDTO;
}

/* ------------------------------------------------------------------ *
 * Component
 * ------------------------------------------------------------------ */
const DiseaseSpecificDetailsModifyPrefill: React.FC = () => {
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string | string[];
  }>({});
  const [hiddenFields, setHiddenFields] = useState<string[]>([]);
  const [fieldData, setFieldData] = useState<Field[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [titleName, setTitleName] = useState("Disease Specific Details");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiStage, setApiStage] = useState<string | null>(null);
  const [frozenFields, setFrozenFields] = useState<string[]>([]);
  const location = useLocation();

  const searchNameFromBox =
    location.state?.searchName || location.state?.searchNameFromBox || "";
  const searchflow = location.state?.searchflow || "";
  // candidateTestId comes from the getCandidatesList response on the Modify
  // search page; route state wins, localStorage is the fallback.
  const candidateTestId =
    location.state?.candidateTestId ||
    localStorage.getItem("candidateTestId") ||
    "";
  const enrolled = location.state?.enrolled || "";
  const lastVistCompletedDate = location.state?.lastVistCompletedDate;

  // Passed in directly from the Modify search page when available;
  // otherwise fall back to localStorage (same contract as the screening screen).
  const routeDiseaseTestId = location.state?.diseaseTestId;
  const routePrefillValues = location.state?.prefillValues;
  const routePrefillParams = location.state?.prefillParams;

  const diseaseTestIds =
    routeDiseaseTestId ||
    localStorage.getItem("diseaseTestIds") ||
    "";

  /* ---------------------- visibility helpers ---------------------- */
  const isTriggered = (
    current: string | string[] | undefined,
    trigger: string
  ) => {
    if (!trigger) return false;
    const t = trigger.trim();
    if (Array.isArray(current))
      return current
        .map((c) => (typeof c === "string" ? c.trim() : c))
        .includes(t);
    return (typeof current === "string" ? current.trim() : current) === t;
  };

  // A field is considered a "referral" field when its prefill value contains
  // the word referral (case-insensitive). These values are read-only.
  const isReferralField = (field: Field, histParams: PrefillParam[]) => {
     const key = (field.testName || "").trim().toLowerCase();
     // Always freeze Referral-related fields by field name
  if (key.includes("referral")) {
    return true;
  }
    // Also freeze a field if its prefilled value contains "referral"
  const hit = histParams.find(
    (p) =>
      (p.testName || "").trim().toLowerCase() === key
  );

     if (!hit) return false;

   const arr = (
    Array.isArray(hit.selectedValues)
      ? hit.selectedValues
      : Array.isArray(hit.values)
      ? hit.values
      : typeof hit.value === "string"
      ? [hit.value]
      : []
  ) as string[];

    return arr.some(
    (v) =>
      typeof v === "string" &&
      v.trim().toLowerCase().includes("referral")
  );
  };

  const buildGraph = (fields: Field[]) => {
    const parentToChildren = new Map<
      string,
      Array<{ child: string; trigger: string }>
    >();
    const allNames = new Set<string>();
    const childNames = new Set<string>();

    fields.forEach((f) => {
      const parentName = (f.testName || "").trim();
      allNames.add(parentName);
      (f.condition || []).forEach((c) => {
        const childName = (c.enabledField || "").trim();
        const arr = parentToChildren.get(parentName) || [];
        arr.push({ child: childName, trigger: (c.triggerValue || "").trim() });
        parentToChildren.set(parentName, arr);
        childNames.add(childName);
      });
    });

    const roots: string[] = Array.from(allNames).filter(
      (n) => !childNames.has(n)
    );
    return { parentToChildren, allNames, roots };
  };

  const computeHidden = (
    fields: Field[],
    selections: { [k: string]: string | string[] }
  ) => {
    const { parentToChildren, allNames, roots } = buildGraph(fields);

    const visible = new Set<string>(roots.map((r) => r.trim()));
    const queue: string[] = roots.map((r) => r.trim());

    while (queue.length) {
      const parent = (queue.shift() as string).trim();
      const children = parentToChildren.get(parent) || [];
      for (const { child, trigger } of children) {
        if (isTriggered(selections[parent], trigger)) {
          if (!visible.has(child)) {
            visible.add(child);
            queue.push(child);
          }
        }
      }
    }

    return Array.from(allNames).filter((n) => !visible.has(n.trim()));
  };

  /* -------------------- fetch definitions then prefill -------------------- */
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 700);
  }, []);

  useEffect(() => {
    const fetchDefsAndPrefill = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1) field definitions
        const response = await axios.get<ApiResponse>(
          `${config.appURL}/curable/getMetricsById/${diseaseTestIds}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const params = response.data?.testMetrics?.params || [];
        setFieldData(params);
        setApiStage(response.data?.stage || null);

        // 2) prefill (candidate history)
        // Reuse what the search page already fetched when available; otherwise
        // call candidatehistoryForPrefil directly (same as the screening screen).
        let histParams: PrefillParam[] = [];

        if (routePrefillParams && routePrefillParams.length > 0) {
          histParams = routePrefillParams;
        } else if (routePrefillValues && Object.keys(routePrefillValues).length > 0) {
          histParams = Object.keys(routePrefillValues).map((k) => ({
            testName: k,
            selectedValues: Array.isArray(routePrefillValues[k])
              ? (routePrefillValues[k] as string[])
              : [routePrefillValues[k] as string],
          }));
        } else {
          try {
            const candidateId =
              localStorage.getItem("candidateId") ||
              localStorage.getItem("patientId");

            const prefill = await axios.post<PrefillResponse>(
              `${config.appURL}/curable/candidatehistoryForPrefil`,
              {
                candidateId,
                type: 7,
                diseaseTestId: Number(candidateTestId),
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            histParams = prefill.data?.testResult?.params || [];
          } catch (prefillErr) {
            console.warn(
              "Prefill not available / failed, continuing with empty selections.",
              prefillErr
            );
            histParams = [];
          }
        }

        // Freeze any field that carries a "referral" value coming from the
        // prefill response. These values must remain read-only on the modify
        // screen and are never editable by the user.
        const referralKeys = params
          .filter((f) => isReferralField(f, histParams))
          .map((f) => (f.testName || "").trim())
          .filter(Boolean);
        setFrozenFields(referralKeys);

        // Normalize into { testName: string | string[] } based on field.valueType
        const initial: { [k: string]: string | string[] } = {};
        params.forEach((f) => {
          const key = (f.testName || "").trim();
          if (!key) return;

          // prefer explicitly passed values from the search page
          if (routePrefillValues && routePrefillValues[key] !== undefined) {
            initial[key] = routePrefillValues[key];
            return;
          }

          const hit = histParams.find(
            (p) => (p.testName || "").trim() === key
          );
          if (!hit) return;

          const arr = (Array.isArray(hit.selectedValues)
            ? hit.selectedValues
            : Array.isArray(hit.values)
            ? hit.values
            : typeof hit.value === "string"
            ? [hit.value]
            : []) as string[];

          if (f.valueType === "Multi Select") {
            initial[key] = arr || [];
          } else {
            initial[key] = arr && arr.length > 0 ? arr[0] : "";
          }
        });

        setSelectedValues(initial);
        setHiddenFields(computeHidden(params, initial));
      } catch (error) {
        console.error("Error fetching disease test master data:", error);
        setHiddenFields(computeHidden([], {}));
      }
    };

    if (diseaseTestIds) fetchDefsAndPrefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diseaseTestIds]);

  /* ----------------------------- handlers ----------------------------- */
 const isFrozen = (testName: string) => {
  const key = (testName || "").trim().toLowerCase();

  // Referral fields are always read-only
  if (key.includes("referral")) {
    return true;
  }

  return frozenFields.some(
    (field) => field.trim().toLowerCase() === key
  );
};

  const handleSelectChange = (
    testName: string,
    value: string | string[]
  ) => {
    const key = (testName || "").trim();

    // Referral values come from the prefill response and must stay read-only.
    if (isFrozen(key)) return;

    if (testName === "Breast Examination") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }

    const nextSelected = { ...selectedValues, [key]: value };
    const nextHidden = computeHidden(fieldData, nextSelected);

    // Clear values for any fields that just became hidden
    const prevHiddenSet = new Set(hiddenFields);
    const nextHiddenSet = new Set(nextHidden);
    Object.keys(nextSelected).forEach((k) => {
      if (!prevHiddenSet.has(k) && nextHiddenSet.has(k)) {
        delete nextSelected[k];
      }
    });

    setSelectedValues(nextSelected);
    setHiddenFields(nextHidden);

    if (formErrors.includes(key)) {
      setFormErrors((errs) => errs.filter((e) => e !== key));
    }
  };

  const validateForFinish = () => {
    const missing = fieldData
      .filter(
        (f) =>
          !hiddenFields.includes((f.testName || "").trim()) && f.isMandatory
      )
      .map((f) => (f.testName || "").trim())
      .filter((name) => {
        const v = selectedValues[name];
        return (
          v === undefined ||
          v === "" ||
          (Array.isArray(v) && v.length === 0)
        );
      });

    setFormErrors(missing);
    return missing.length === 0;
  };

  /* ------------------------------ payload ------------------------------ */
  const buildPayload = (completed: 0 | 1) => {
    const candidateId = Number(localStorage.getItem("candidateId"));
    return {
      candidateId,
      diseaseTestMasterId: Number(diseaseTestIds),
      description: "Eligibility Metrics",
      diseaseTestId: 1,
      // disease-type id resolved from the getCandidatesList response for the
      // currently selected stage, sent along on every save.
      candidateTestId: candidateTestId ? Number(candidateTestId) : null,
      familyMedicalMetrics: null,
      familyMetrics: null,
      gender: localStorage.getItem("patientgender") || "FEMALE",
      genderValid: true,
      hospitalId: localStorage.getItem("hospitalId"),
      id: candidateTestId ? Number(candidateTestId) : null,
      medicalMetrics: null,
      name: "Eligibility Metrics",
      stage: apiStage || localStorage.getItem("selectedStage"),
      eligibilityMetrics: null,
      completed,
      // modify flow is always an update of an existing record
      requestType: 0,
      type: 1,
      testMetrics: {
        params: fieldData.map((field) => {
          const key = (field.testName || "").trim();
          return {
            testName: field.testName,
            subtestName: field.subtestName,
            selectedValues: selectedValues[key]
              ? Array.isArray(selectedValues[key])
                ? (selectedValues[key] as string[])
                : [selectedValues[key] as string]
              : [],
          };
        }),
      },
    };
  };

  const goBackToSearch = () => {
    navigate("/ModifyPatientSearchPage", {
      state: {
        searchName: searchNameFromBox,
        registrationId: localStorage.getItem("registrationId") || "",
        searchflow,
        enrolled,
      },
    });
  };

  const persistAndGo = (response: any) => {
    const savedCandidateTestId =
      response.data?.diseaseEligibilityDTO?.candidateTestId ??
      (candidateTestId ? Number(candidateTestId) : null);

    if (savedCandidateTestId != null) {
      localStorage.setItem("candidateTestId", String(savedCandidateTestId));
    }

    // Post API succeeded -> show the modify success screen. The screen itself
    // routes back to the modify search list / home.
    navigate("/SuccessMessageModifyFInal", {
      state: {
        searchNameFromBox,
        searchflow,
        titleName,
        enrolled,
        registrationId: localStorage.getItem("registrationId") || "",
        candidateTestId: savedCandidateTestId,
        diseaseEligibilityDTO: response.data?.diseaseEligibilityDTO || null,
      },
    });
  };

  const handleSave = async () => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post<CandidateHistoryResponse>(
        `${config.appURL}/curable/candidatehistoryUpdates`,
        buildPayload(0),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // keep the resolved candidateTestId available for the next screens
      const savedCandidateTestId =
        response.data?.diseaseEligibilityDTO?.candidateTestId ??
        (candidateTestId ? Number(candidateTestId) : null);
      if (savedCandidateTestId != null) {
        localStorage.setItem("candidateTestId", String(savedCandidateTestId));
      }

      navigate("/SuccessMessageModifyFInal", {
        state: {
          searchNameFromBox: searchNameFromBox,
          searchflow,
          titleName,
          registrationId: localStorage.getItem("registrationId") || "",
          diseaseEligibilityDTO: response.data?.diseaseEligibilityDTO || null,
        },
      });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!validateForFinish()) return;
    if (isLoading) return;

    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post<CandidateHistoryResponse>(
        `${config.appURL}/curable/candidatehistory`,
        buildPayload(1),
        { headers: { Authorization: `Bearer ${token}` } }
      );
      persistAndGo(response);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Submit failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ------------------------------- title ------------------------------- */
  useEffect(() => {
    const raw = (localStorage.getItem("selectedStage") || "")
      .toLowerCase()
      .trim();

    if (raw === "breast screening") {
      setTitleName("Breast Screening");
    } else if (raw === "oral screening") {
      setTitleName("Oral Screening");
    } else if (raw === "cervical screening") {
      setTitleName("Cervical Screening");
    } else if (raw === "general screening") {
      setTitleName("General Screening");
    } else if (raw.includes("symptoms")) {
      setTitleName("Symptoms based referral screening");
    } else {
      setTitleName("Disease Specific Details");
    }
  }, []);

  const cervicalNotNowFields = ["HR-HPV DNA", "Cytology", "Visual Test"];
  const isCervicalNotNow = cervicalNotNowFields.some(
    (name) => (selectedValues[name] as string) === "Not now"
  );

  const finishDisabled =
    isCervicalNotNow ||
    fieldData.some((f) => {
      const key = (f.testName || "").trim();
      if (hiddenFields.includes(key)) return false;
      if (!f.isMandatory) return false;
      const v = selectedValues[key];
      return (
        v === undefined ||
        v === "" ||
        (Array.isArray(v) && v.length === 0)
      );
    });

  const pName = localStorage.getItem("patientName");
  const regId = localStorage.getItem("registrationId");
  const patientAge = localStorage.getItem("patientAge");
  const patientgender = localStorage.getItem("patientgender");

  // dd-mm-yyyy or yyyy-mm-dd -> Date
  const parseToDate = (s?: string) => {
    if (!s) return null;
    const m1 = /^(\d{2})-(\d{2})-(\d{4})$/; // dd-mm-yyyy
    const m2 = /^(\d{4})-(\d{2})-(\d{2})$/; // yyyy-mm-dd
    let d: Date | null = null;

    if (m1.test(s)) {
      const [, dd, mm, yyyy] = s.match(m1)!;
      d = new Date(+yyyy, +mm - 1, +dd);
    } else if (m2.test(s)) {
      const [, yyyy, mm, dd] = s.match(m2)!;
      d = new Date(+yyyy, +mm - 1, +dd);
    }
    return d && !isNaN(d.getTime()) ? d : null;
  };

  return (
    <div className="container2">
      <Header1 />
      <div className="participant-info-container">
        <p>
          <strong>Participant: </strong>
          {pName} {patientAge}/{patientgender}
        </p>
        <p>
          <strong>ID:</strong> {regId}
        </p>
      </div>

      <div className="clinic-details-form-newscreening">
        <h1 style={{ color: "darkblue", marginTop: "15px" }}>{titleName}</h1>

        {isLoading ? (
          <Loader isLoading />
        ) : (
          <>
            {fieldData.map((field) => {
              const key = (field.testName || "").trim();
              if (hiddenFields.includes(key)) return null;
              const frozen = isFrozen(key);

              return (
                <div
                  key={field.testName}
                  className={`form-group${frozen ? " frozen-field" : ""}`}
                >
                  <label style={{ fontSize: "15px" }}>
                    {field.testName}{" "}
                    {frozen && (
                      <span className="frozen-badge">Read-only</span>
                    )}
                    {field.isMandatory && (
                      <span style={{ color: "red" }}>*</span>
                    )}
                  </label>

                  {field.valueType === "SingleSelect" && (
                    <>
                      <select
                        value={(selectedValues[key] as string) || ""}
                        onChange={(e) =>
                          handleSelectChange(field.testName, e.target.value)
                        }
                        disabled={frozen}
                      >
                        <option value="" disabled>
                          Select an option
                        </option>
                        {field.values.map((val) => (
                          <option key={val} value={val}>
                            {val}
                          </option>
                        ))}
                      </select>
                      {formErrors.includes(key) && (
                        <span className="error-message">
                          This field is required
                        </span>
                      )}
                    </>
                  )}

                  {field.valueType === "Multi Select" && (
                    <>
                      <Select
                        isMulti
                        isDisabled={frozen}
                        options={field.values.map((val) => ({
                          value: val,
                          label: val,
                        }))}
                        value={
                          Array.isArray(selectedValues[key])
                            ? (selectedValues[key] as string[]).map((v) => ({
                                value: v,
                                label: v,
                              }))
                            : []
                        }
                        onChange={(options: MultiValue<ColourOption>) =>
                          handleSelectChange(
                            field.testName,
                            (options || []).map((o) => o.value)
                          )
                        }
                      />
                      {formErrors.includes(key) && (
                        <span className="error-message">
                          This field is required
                        </span>
                      )}
                    </>
                  )}

                  {field.valueType === "Input" && (
                    <>
                      <input
                        type="text"
                        disabled={frozen}
                        value={(selectedValues[key] as string) || ""}
                        onChange={(e) =>
                          handleSelectChange(field.testName, e.target.value)
                        }
                      />
                      {formErrors.includes(key) && (
                        <span className="error-message">
                          This field is required
                        </span>
                      )}
                    </>
                  )}

                  {field.valueType === "Date" && (
                    <>
                      <div style={{ width: "100%" }}>
                        <Calendar
                          disabled={frozen}
                          value={parseToDate(selectedValues[key] as string)}
                          onChange={(e) => {
                            const date = e.value as Date | null;
                            if (date) {
                              const dd = String(date.getDate()).padStart(2, "0");
                              const mm = String(date.getMonth() + 1).padStart(2, "0");
                              const yyyy = date.getFullYear();
                              handleSelectChange(
                                field.testName,
                                `${dd}-${mm}-${yyyy}`
                              );
                            } else {
                              handleSelectChange(field.testName, "");
                            }
                          }}
                          dateFormat="dd-mm-yy"
                          placeholder="dd-mm-yyyy"
                          maxDate={new Date()}
                        />
                      </div>
                      {formErrors.includes(key) && (
                        <span className="error-message">
                          This field is required
                        </span>
                      )}
                    </>
                  )}

                  {field.valueType === "SingleSelectButton" && (
                    <>
                      <div className="gender-group">
                        {field.values.map((val) => (
                          <button
                            key={val}
                            type="button"
                            disabled={frozen}
                            className={`gender-btn ${
                              selectedValues[key] === val ? "active" : ""
                            }`}
                            onClick={() =>
                              handleSelectChange(field.testName, val)
                            }
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      {formErrors.includes(key) && (
                        <span className="error-message">
                          This field is required
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        <center>
          <div className="buttons">
            <button
              className="Next-button"
              disabled={isLoading}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </center>
        <br />
      </div>

      <br />
      <br />
      <br />
      <br />
      <footer className="footer-container-fixed">
        <div className="footer-content">
          <p className="footer-text">Powered By</p>
          <img
            src="/assets/Curable logo - rectangle with black text.png"
            alt="Curable Logo"
            className="footer-logo"
          />
        </div>
      </footer>
    </div>
  );
};

export default DiseaseSpecificDetailsModifyPrefill;
