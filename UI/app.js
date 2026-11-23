// ═════════════ PRODUCT CONSTANTS (same for every hospital) ═════════════
const MODS={
  outreach:{label:"Outreach Clinic",icon:'<rect x="6" y="6" width="14" height="14" rx="4"/><rect x="6" y="26" width="14" height="14" rx="4"/><rect x="26" y="26" width="14" height="14" rx="4"/><path d="M33 6v14M26 13h14"/>'},
  register:{label:"Patient Registration",icon:'<circle cx="20" cy="13" r="7"/><path d="M6 40c0-7 6-11 14-11 3 0 5 .5 7 1.5"/><circle cx="34" cy="34" r="7"/><path d="M34 30v8M30 34h8"/>'},
  screening:{label:"Screening",icon:'<circle cx="20" cy="13" r="7"/><path d="M6 40c0-7 6-11 14-11 3 0 5 .5 7 1.5"/><circle cx="34" cy="34" r="7"/><path d="M30.5 34l2.5 2.5 4.5-5"/>'},
  clinical:{label:"Clinical Evaluation",icon:'<rect x="6" y="14" width="34" height="26" rx="6"/><path d="M17 14v-5h12v5"/><circle cx="23" cy="27" r="7"/><path d="M23 23.5v7M19.5 27h7"/>'},
  udm:{label:"User Data Management",icon:'<circle cx="23" cy="13" r="6"/><ellipse cx="23" cy="33" rx="11" ry="6"/><path d="M12 10c-2 1-3 3-3 3M34 10c2 1 3 3 3 3M8 32c-2 1-3 2-3 2M38 32c2 1 3 2 3 2"/>'},
  reports:{label:"Reports",icon:'<rect x="10" y="7" width="26" height="34" rx="3"/><rect x="17" y="4" width="12" height="6" rx="2"/><path d="M15 17h4M23 17h8M15 25h4M23 25h8M15 33h4M23 33h8"/>'},
  modify:{label:"Patients",icon:'<circle cx="20" cy="13" r="7"/><path d="M6 40c0-7 6-11 14-11"/><path d="M28 40l2-6 9-9 4 4-9 9z"/>'}
};
const TILES=["outreach","register","screening","clinical","udm","reports"];
const ROLES=["Program Coordinator","Outreach Clinic Coordinator","Social Worker","Nurse","Doctor"];
const PINCODES={ // sample pincode master
  "600042":{state:"Tamil Nadu",district:"Chennai",taluk:"Guindy",villages:["Adayar","Velachery"]},
  "603112":{state:"Tamil Nadu",district:"Chengalpattu",taluk:"Thiruporur",villages:["Kovalam","Muttukadu"]},
  "625020":{state:"Tamil Nadu",district:"Madurai",taluk:"Madurai East",villages:["Anna Nagar","K.K. Nagar"]},
  "631501":{state:"Tamil Nadu",district:"Kanchipuram",taluk:"Kanchipuram",villages:["Walajabad","Enathur"]}
};
// Fixed registration pages (product). Hospital questions page goes first; specialty page is added from templates.
const REG_PAGES={
  general:{name:"General Details",fields:[
    {id:"father",label:"Father Name",type:"text"},{id:"spouse",label:"Spouse Name",type:"text"},
    {id:"altmob",label:"Alternate Mobile No",type:"text"},
    {id:"income",label:"Monthly Income",type:"select",opts:["Below ₹5,000","₹5,000 – 15,000","₹15,000 – 30,000","Above ₹30,000"]},
    {id:"house",label:"Type of House",type:"pills",opts:["Owned","Rental"]}]},
  medical:{name:"Medical Details",fields:[
    {id:"medhx",label:"Medical History",type:"multi",opts:["Nil","Diabetes","Hypertension","Asthma","Tuberculosis","Stroke/Myocardial Infarction","Thyroid"]},
    {id:"surg",label:"Previous History of Surgery",type:"pills",opts:["Yes","No"]}]},
  women:{name:"Women's Health",female:true,fields:[
    {id:"menarche",label:"Age at Menarche",type:"number"},
    {id:"lmp",label:"When was Last Menstruation",type:"select",opts:["Within last month","1 – 6 months ago","Attained menopause"]},
    {id:"abb",label:"Abnormal Bleeding Per Vaginum",type:"select",opts:["No","Yes"]},
    {id:"marriage",label:"Age at Marriage",type:"number"},
    {id:"preg",label:"Total Pregnancies",type:"number"}]},
  family:{name:"Family Medical Details",fields:[
    {id:"fhx",label:"Any family member with cancer, diabetes or heart disease?",type:"select",opts:["No","Yes – cancer","Yes – diabetes","Yes – heart disease"]},
    {id:"frel",label:"Relation",type:"select",opts:["Father","Mother","Sibling","Spouse","Other"]}]}
};
const YNN=["Yes","No","Not now"];
const DEF_REASONS=["Not willing","Not eligible","Others"];

// ═════════════ DEFAULT CONFIG (data, editable in Curable admin) ═════════════
const SPECS0=[
  {id:"onco",name:"Oncology",active:true,price:40,licence:15000},
  {id:"cardio",name:"Cardiology",active:true,price:25,licence:8000},
  {id:"diab",name:"Diabetes",active:true,price:25,licence:8000},
  {id:"derm",name:"Dermatology",active:true,price:20,licence:6000},
  {id:"gw",name:"General Wellness",active:true,price:15,licence:5000},
  {id:"eye",name:"Ophthalmology",active:true,price:20,licence:6000},
  {id:"imm",name:"Immunization",active:true,price:5,licence:0}
];
const sel=(id,label,opts,req=true)=>({id,label,type:"select",opts,req});
const mul=(id,label,opts,req=true)=>({id,label,type:"multi",opts,req});
const num=(id,label,req=true)=>({id,label,type:"number",req});
const txt=(id,label,req=false)=>({id,label,type:"text",req});
const TYPES0={
  breast:{name:"Breast Screening",spec:"onco",group:"Women's cancers",v:3,gate:"Breast Examination",reasons:["Not willing","Not eligible","Others"],
    fields:[mul("sym","Symptoms",["Lump in breast","Nipple discharge","Skin changes","Pain","None"]),
      sel("rbp","Right Breast on palpation",["Normal","Lump","Thickening"]),sel("lbp","Left Breast on palpation",["Normal","Lump","Thickening"]),
      sel("nd","Nipple Discharge",["No","Yes – clear","Yes – bloody"])],
    rule:[{f:"rbp",op:"in",v:["Lump","Thickening"]},{f:"lbp",op:"in",v:["Lump","Thickening"]},{f:"nd",op:"in",v:["Yes – bloody"]},{f:"sym",op:"in",v:["Lump in breast"]}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("mam","Mammogram",["Not done","BIRADS 1–2","BIRADS 3","BIRADS 4–5"]),sel("usg","Ultrasound Breast",["Not done","Normal","Abnormal"]),sel("cyt","Cytology",["Not done","Benign","Suspicious","Malignant"]),sel("bx","Biopsy",["Not done","Benign","Malignant"]),sel("plan","Treatment Plan",["Follow-up","Surgery","Chemotherapy","Radiotherapy"])]},
  oral:{name:"Oral Screening",spec:"onco",group:"Head and neck",v:3,gate:"Oral Examination",reasons:DEF_REASONS,regFields:[sel("tob","Tobacco / Alcohol habits",["None","Tobacco","Alcohol","Both"])],
    fields:[mul("sym","Symptoms",["Ulcer in the mouth","Swelling – neck/oral cavity","Difficulty in swallowing","Difficulty in mouth opening","Change in voice","None"]),
      sel("hyg","Dental Hygiene",["Good","Poor"]),sel("find","Clinical Findings",["Normal","Benign lesion","Leukoplakia","Melanoplakia","Nodule","Ulcer"])],
    rule:[{f:"find",op:"in",v:["Leukoplakia","Melanoplakia","Nodule","Ulcer"]},{f:"sym",op:"in",v:["Ulcer in the mouth","Swelling – neck/oral cavity"]}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("tc","Tobacco Counselling",["Given","Not required"]),sel("hn","Head & Neck OPD",["Referred","Not required"]),sel("oc","Oral Cytology",["Not done","Negative","Positive"]),sel("bx","Biopsy",["Not done","Benign","Malignant"])]},
  cervical:{name:"Cervical Screening",spec:"onco",group:"Women's cancers",v:4,gate:"Cervical Screening",female:true,gender:"F",ageMin:30,ageMax:65,reasons:["Pt. in periods","Not willing","Post Hysterectomy","Not Eligible","Others"],
    fields:[mul("sym","Symptoms",["Bleeding after intercourse","Abnormal discharge","Bleeding after menopause","None"]),
      sel("abpv","Abnormal bleeding per vaginum",["No","Yes"]),sel("via","Visual Inspection",["VIA negative","VIA positive","Suspicious for cancer"]),
      sel("hpv","HR-HPV DNA",["Not done","Negative","Positive"]),sel("cyt","Cytology",["Not done","NILM","ASCUS / LSIL","HSIL or worse"])],
    rule:[{f:"via",op:"in",v:["VIA positive","Suspicious for cancer"]},{f:"hpv",op:"in",v:["Positive"]},{f:"cyt",op:"in",v:["ASCUS / LSIL","HSIL or worse"]},{f:"abpv",op:"in",v:["Yes"]}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("col","Colposcopy",["Not done","Normal","Abnormal"]),sel("cgb","Colpo Guided Biopsy",["Not done","CIN 1","CIN 2+","Malignant"]),txt("cmt","Additional Comments"),sel("plan","Treatment Plan",["Follow-up","Thermal ablation","LEEP","Surgery"])]},
  symp:{name:"Symptoms based referral screening",spec:"onco",v:1,gate:"Symptoms Based Referral",reasons:DEF_REASONS,
    fields:[mul("sym","Symptoms",["Weight loss","Lump anywhere","Non-healing ulcer","Persistent cough","Change in bowel habits"]),
      sel("dur","Duration of symptoms",["Less than 2 weeks","2 – 4 weeks","More than 1 month"]),sel("known","Known cancer patient",["No","Yes"]),
      sel("inv","Investigations",["None","Blood tests","Imaging"])],
    rule:[{f:"dur",op:"in",v:["2 – 4 weeks","More than 1 month"]},{f:"known",op:"in",v:["Yes"]}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("plan","Treatment Plan",["Investigate further","Refer to oncology","Reassure and follow-up"])]},
  htn:{name:"Hypertension Screening",spec:"cardio",group:"Blood pressure",v:1,gate:"BP Measurement",reasons:DEF_REASONS,regFields:[sel("khtn","Known hypertensive",["No","Yes"])],
    fields:[num("sys","Systolic BP (mmHg)"),num("dia","Diastolic BP (mmHg)"),sel("cp","Chest pain on exertion",["No","Yes"])],
    rule:[{f:"sys",op:"gte",v:140},{f:"dia",op:"gte",v:90},{f:"cp",op:"in",v:["Yes"]}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("ecg","ECG",["Not done","Normal","Abnormal"]),sel("lip","Lipid Profile",["Not done","Normal","High"]),sel("plan","Treatment Plan",["Lifestyle advice","Start medication","Refer to cardiologist"])]},
  dm:{name:"Diabetes Screening",spec:"diab",group:"Blood sugar",v:1,gate:"Diabetes Screening",reasons:DEF_REASONS,regFields:[sel("kdm","Known diabetic",["No","Yes"])],
    fields:[sel("age","Age group",["Under 35","35 – 49","50 and above"]),sel("waist","Waist (cm)",["F < 80 / M < 90","F 80–89 / M 90–99","F ≥ 90 / M ≥ 100"]),
      sel("act","Physical activity",["Vigorous exercise or heavy work","Moderate exercise","Mild exercise","No exercise, sitting job"]),
      sel("fam","Parents with diabetes",["Neither","One parent","Both parents"]),num("rbs","Random Blood Sugar (mg/dL)")],
    score:{pts:{age:[0,20,30],waist:[0,10,20],act:[0,10,20,30],fam:[0,10,20]},min:60,label:"IDRS score"},
    rule:[{f:"rbs",op:"gte",v:200}],
    eval:[txt("uhid","UHID"),txt("opd","SCR OPD Number"),sel("a1c","HbA1c",["Not done","Below 5.7","5.7 – 6.4","6.5 and above"]),sel("plan","Treatment Plan",["Lifestyle advice","Start medication","Refer to diabetologist"])]},
  skin:{name:"Skin Lesion Screening",spec:"derm",v:1,gate:"Skin Examination",reasons:DEF_REASONS,
    fields:[sel("les","Lesion type",["None","Patch","Mole changing in size/colour","Non-healing ulcer"]),sel("sens","Loss of sensation in patch",["No","Yes"])],
    rule:[{f:"les",op:"in",v:["Mole changing in size/colour","Non-healing ulcer"]},{f:"sens",op:"in",v:["Yes"]}],
    eval:[txt("uhid","UHID"),sel("drm","Dermoscopy",["Not done","Benign","Suspicious"]),sel("plan","Treatment Plan",["Topical treatment","Skin biopsy","Refer to leprosy programme"])]},
  polio:{name:"Polio Vaccination",spec:"imm",v:1,gate:"Polio drops given today?",reasons:["Child unwell","Parent refused","Vaccine not available","Others"],gender:"all",ageMin:0,ageMax:5,clinical:false,owner:"rc",
    fields:[{id:"dose",label:"Which dose?",type:"select",opts:["Birth dose","1st dose","2nd dose","3rd dose","Booster","Pulse Polio campaign"],req:true},{id:"ok",label:"Is the baby healthy?",type:"select",opts:["Yes","No"],req:true}],rule:[],eval:[]},
  mr:{name:"Measles-Rubella Vaccination",spec:"imm",v:1,gate:"MR vaccine given today?",reasons:["Child unwell","Parent refused","Vaccine not available","Others"],gender:"all",ageMin:0,ageMax:5,clinical:false,owner:"rc",
    fields:[{id:"dose",label:"Which dose?",type:"select",opts:["1st dose (9–12 months)","2nd dose (16–24 months)"],req:true},{id:"ok",label:"Is the baby healthy?",type:"select",opts:["Yes","No"],req:true}],rule:[],eval:[]},
  thyroid:{name:"Thyroid Screening",spec:"onco",group:"Head and neck",v:1,gate:"Neck Examination",reasons:DEF_REASONS,
    fields:[sel("swell","Swelling in the neck",["No","Yes"]),sel("voice","Change in voice",["No","Yes"])],rule:[{f:"swell",op:"in",v:["Yes"]}],eval:[txt("uhid","UHID"),sel("usg","Ultrasound neck",["Not done","Normal","Nodule"]),sel("plan","Treatment Plan",["Follow-up","FNAC","Refer to surgeon"])]},
  ecg:{name:"ECG Check",spec:"cardio",group:"Heart rhythm",v:1,gate:"ECG done",reasons:DEF_REASONS,
    fields:[sel("rhy","ECG rhythm",["Normal","Irregular","Not clear"]),sel("pal","Palpitations",["No","Yes"])],rule:[{f:"rhy",op:"in",v:["Irregular"]}],eval:[txt("uhid","UHID"),sel("plan","Treatment Plan",["Follow-up","Echo","Refer to cardiologist"])]},
  lipid:{name:"Lipid Check",spec:"cardio",group:"Blood pressure",v:1,gate:"Blood sample taken",reasons:DEF_REASONS,
    fields:[num("chol","Total cholesterol (mg/dL)")],rule:[{f:"chol",op:"gte",v:240}],eval:[txt("uhid","UHID"),sel("plan","Treatment Plan",["Diet advice","Start medication"])]},
  hba1c:{name:"HbA1c Test",spec:"diab",group:"Blood sugar",v:1,gate:"Blood sample taken",reasons:DEF_REASONS,
    fields:[num("a1c","HbA1c (%)")],rule:[{f:"a1c",op:"gte",v:6.5}],eval:[txt("uhid","UHID"),sel("plan","Treatment Plan",["Lifestyle advice","Start medication"])]},
  foot:{name:"Diabetic Foot Check",spec:"diab",group:"Complications",v:1,gate:"Foot Examination",reasons:DEF_REASONS,
    fields:[sel("mono","Monofilament test",["Sensation present","Sensation lost"]),sel("ulc","Foot ulcer",["None","Present"])],rule:[{f:"mono",op:"in",v:["Sensation lost"]},{f:"ulc",op:"in",v:["Present"]}],eval:[txt("uhid","UHID"),sel("plan","Treatment Plan",["Foot care advice","Refer to podiatry"])]},
  well:{name:"General Wellness Check",spec:"gw",v:1,gate:"Wellness Check",reasons:DEF_REASONS,
    fields:[num("bmi","BMI"),sel("vis","Difficulty in vision",["No","Yes"]),sel("sleep","Sleep problems",["No","Yes"])],
    rule:[{f:"bmi",op:"gte",v:30},{f:"vis",op:"in",v:["Yes"]}],
    eval:[sel("plan","Advice",["Diet and exercise counselling","Eye check-up","Refer to physician"])]}
};

// ═════════════ SAMPLE HOSPITAL DATA ═════════════
let _seq=0;
function pid16(){let s="03"+String(Date.now()).slice(-6)+String(1000000+(_seq++)).slice(-6);s+=Math.floor(Math.random()*90+10);return s.slice(0,16);}
function cid7(){return String(Math.floor(1000000+Math.random()*8999999));}
const CHILD_AGE=12;
function ageFromDob(d){const b=new Date(d),n=new Date();if(isNaN(b))return null;let m=(n.getFullYear()-b.getFullYear())*12+(n.getMonth()-b.getMonth());if(n.getDate()<b.getDate())m--;return m<0?null:m;}
function ageText(p){if(p.dob){const m=ageFromDob(p.dob);if(m!==null)return m<24?m+(m===1?" month":" months"):Math.floor(m/12)+" yrs";}return String(p.age);}
function isChild(p){return Number(p.age)<CHILD_AGE;}
function P(name,g,age,mobile,address,clinic,recs){recs=recs||[];const ds=recs.map(r=>r.date).sort();return {id:pid16(),name,g,age,mobile,address,street:"101",clinic,photo:null,reg:{},recs,regDate:ds.length?ds[0]:"2026-11-15"};}
function R(type,date,status,ans,referral,ev){return {id:"r"+(_seq++),type,date,status,ans:ans||{},referral:referral||null,ev:ev||null};}
function C(name,g,dob,guardian,mobile,address,clinic,recs){const p=P(name,g,Math.floor((ageFromDob(dob)||0)/12),mobile,address,clinic,recs);p.dob=dob;p.guardian=guardian;p.consent=true;return p;}
const H0=()=>[
  {id:"ci",name:"Cancer Institute",code:"CI",specs:["onco"],types:["breast","oral","cervical","symp"],
   hq:[{id:"hq1",label:"How did you hear about this clinic?",type:"select",opts:["Health worker","Pamphlet","Neighbour","Hospital"],req:true}],
   clinics:[{id:"0316464",name:"Velachery",pincode:"600042",state:"Tamil Nadu",district:"Chennai",taluk:"Guindy",village:"Adayar",start:"2025-12-02",end:"",types:["breast","oral","cervical"]},
            {id:"0316502",name:"Kovalam village",pincode:"603112",state:"Tamil Nadu",district:"Chengalpattu",taluk:"Thiruporur",village:"Kovalam",start:"2026-11-28",end:"2026-11-30",types:["oral","symp"]}],
   users:[{name:"Sadasiv",role:"Program Coordinator",email:"sada@curable.care",mobile:"9841245699",g:"Male",specs:["onco"],active:true},
          {name:"Marudhupandian",role:"Social Worker",email:"marudhu@curable.care",mobile:"9840011223",g:"Male",specs:["onco"],active:true},
          {name:"Dr. Priya Raman",role:"Doctor",email:"priya@curable.care",mobile:"9840099887",g:"Female",specs:["onco"],active:true}],
   patients:[P("Chitra","F",48,"9555666655","12, 2nd Street, Adayar","0316464",[R("breast","2026-10-14","done",{gate:"Yes",rbp:"Lump"},"Yes",{status:"pending",ans:{}}),R("oral","2026-10-14","done",{gate:"Yes",find:"Normal"},"No")]),
             P("Indirani","F",50,"9884456721","Velachery Main Road","0316464",[R("cervical","2026-11-02","draft",{gate:"Yes",via:"VIA negative"})]),
             P("Murugan S","M",61,"9790034512","Kovalam beach road","0316502",[R("oral","2026-11-12","done",{gate:"Yes",find:"Leukoplakia"},"Yes",{status:"done",ans:{plan:"Follow-up"}})]),
             P("Vel Murugan","M",39,"9445067812","Adayar","0316464",[])]},
  {id:"dh",name:"District Hospital (NCD)",code:"DH",specs:["onco","cardio","diab"],types:["oral","breast","cervical","thyroid","symp","htn","lipid","ecg","dm","hba1c","foot"],
   hq:[{id:"hq1",label:"Ration card type",type:"select",opts:["PHH","NPHH","AAY","None"],req:true},{id:"hq2",label:"ABHA number (if any)",type:"text",req:false}],
   clinics:[{id:"0421107",name:"Block 3 NCD camp",pincode:"631501",state:"Tamil Nadu",district:"Kanchipuram",taluk:"Kanchipuram",village:"Walajabad",start:"2026-11-20",end:"2026-11-30",types:["oral","htn","dm"]},
            {id:"0421130",name:"Women's health day",pincode:"631501",state:"Tamil Nadu",district:"Kanchipuram",taluk:"Kanchipuram",village:"Enathur",start:"2026-12-08",end:"2026-12-08",types:["breast","cervical","htn"]}],
   users:[{name:"ANM Selvi",role:"Nurse",email:"selvi@dh.in",mobile:"9361178023",g:"Female",specs:["onco","cardio","diab"],active:true},
          {name:"Dr. Kumar",role:"Doctor",email:"kumar@dh.in",mobile:"9786612340",g:"Male",specs:["cardio","diab"],active:true},
          {name:"Dr. Shanthi",role:"Doctor",email:"shanthi@dh.in",mobile:"9123345670",g:"Female",specs:["onco"],active:true}],
   patients:[P("Ramesh K","M",50,"9786612341","Walajabad","0421107",[R("htn","2026-11-20","done",{gate:"Yes",sys:"152",dia:"94",cp:"No"},"Yes",{status:"pending",ans:{}}),R("dm","2026-11-20","done",{gate:"Yes",rbs:"132"},"No")]),
             P("Anitha J","F",44,"9361178024","Enathur","0421130",[R("cervical","2026-10-28","done",{gate:"Yes",via:"VIA positive"},"Yes",{status:"pending",ans:{}})]),
             P("Gopal M","M",63,"9123345671","Walajabad","0421107",[R("oral","2026-11-21","done",{gate:"Not now",reason:"Not willing"},null)])]},
  {id:"md",name:"Madhuram Diabetes Centre",code:"MD",specs:["diab","cardio","gw"],types:["dm","htn","well"],hq:[],
   clinics:[{id:"0533018",name:"Factory health day",pincode:"625020",state:"Tamil Nadu",district:"Madurai",taluk:"Madurai East",village:"Anna Nagar",start:"2026-12-05",end:"2026-12-05",types:["dm","htn","well"]}],
   users:[{name:"Nurse Jaya",role:"Nurse",email:"jaya@madhuram.in",mobile:"9003412876",g:"Female",specs:["diab","cardio","gw"],active:true}],
   patients:[P("Kavitha N","F",47,"9003412877","Anna Nagar","0533018",[R("dm","2026-11-02","done",{gate:"Yes",age:"35 – 49",waist:"F ≥ 90 / M ≥ 100",act:"No exercise, sitting job",fam:"One parent",rbs:"168"},"Yes",{status:"pending",ans:{}})]),
             P("Suresh T","M",55,"9842267130","K.K. Nagar","0533018",[])]},
  {id:"rc",name:"Rotary Club (sample)",code:"RC",specs:["imm"],types:["polio","mr"],hq:[],
   clinics:[{id:"0644031",name:"Pulse Polio day",pincode:"603112",state:"Tamil Nadu",district:"Chengalpattu",taluk:"Thiruporur",village:"Kovalam",start:"2026-11-30",end:"2026-11-30",types:["polio","mr"]}],
   users:[{name:"Rtn. Suresh Babu",role:"Program Coordinator",email:"suresh@rotary.sample",mobile:"9840055667",g:"Male",specs:["imm"],active:true},{name:"Volunteer Meena",role:"Social Worker",email:"meena@rotary.sample",mobile:"9840055668",g:"Female",specs:["imm"],active:true}],
   patients:[C("Baby of Lakshmi","F","2026-07-10","Lakshmi R","9840012399","Kovalam","0644031",[R("polio","2026-08-21","done",{gate:"Yes",dose:"1st dose",ok:"Yes"},null),R("polio","2026-09-18","done",{gate:"Yes",dose:"2nd dose",ok:"Yes"},null),R("polio","2026-10-16","notdone",{gate:"Not now",reason:"Child unwell"},null)]),
             C("Arjun K","M","2024-03-02","Kumar S","9840012388","Muttukadu","0644031",[R("mr","2025-03-05","done",{gate:"Yes",dose:"2nd dose (16–24 months)",ok:"Yes"},null)])]}
];

// ═════════════ STATE ═════════════
const KEY="curable-ms-v17";
let S;
function fresh(){const hs=H0();hs.forEach(h=>h.licensed=h.specs.slice());
  hs.find(h=>h.id==="dh").specs=["onco","cardio","diab"];hs.find(h=>h.id==="dh").licensed=["onco","cardio","diab","gw"];
  return {specs:JSON.parse(JSON.stringify(SPECS0)),types:JSON.parse(JSON.stringify(TYPES0)),hospitals:hs,cur:"ci",role:"Program Coordinator",audit:[],requests:[]};}
function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);if(o&&o.hospitals&&o.types){S=o;S.requests=S.requests||[];S.hospitals.forEach(h=>h.licensed=h.licensed||h.specs.slice());return;}}}catch(e){}S=fresh();}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
load();
const ui0=()=>({scr:"home",menu:false,q:"",adv:false,fc:"",fg:"",fs:"",fa:"",selP:null,selT:"",
  clinicQ:"",clinicSel:null,cf:{},cErr:"",enr:{},eErr:"",step:0,regP:null,rErr:"",
  rec:null,ans:{},refManual:false,fErr:"",okMsg:"",evRec:null,evAns:{},evErr:"",cefs:"all",
  uEdit:null,uForm:{},uErr:"",rep:{clinic:"",spec:"",type:"summary",from:"2026-01-01",to:"2026-12-31",show:false},
  delOpen:false,delReason:"",profMsg:"",cfEdit:null,qErr:"",wz:null,wzErr:"",wzSaved:"",cfOpen:{}});
let ui=ui0();
const A={sec:"specs",type:"breast",hosp:"ci",msg:"",msgE:false};

// ═════════════ HELPERS ═════════════
const $=s=>document.querySelector(s);
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function H(id){return S.hospitals.find(h=>h.id===(id||S.cur));}
function spec(id){return S.specs.find(s=>s.id===id);}
function T(id){return S.types[id];}
function tname(id){return T(id)?T(id).name:id;}
function stag(tid){const t=T(tid);return t?`<span class="stag">${esc(spec(t.spec).name)}</span>`:"";}
function today(){return new Date().toISOString().slice(0,10);}
function fmtId(id){return id;}
function clinicOf(h,id){return h.clinics.find(c=>c.id===id);}
function liveTypes(h){return h.types.filter(t=>T(t)&&spec(T(t).spec)&&spec(T(t).spec).active);}
function liveSpecs(h){return [...new Set(liveTypes(h).map(t=>T(t).spec))];}
function isPC(){return S.role==="Program Coordinator";}
function opt(v,cur,lab){return `<option value="${esc(v)}" ${v===cur?"selected":""}>${esc(lab==null?v:lab)}</option>`;}
function audit(what){S.audit.unshift({when:new Date().toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}),who:S.role,hosp:H().name,what});S.audit=S.audit.slice(0,40);}

// Referral suggestion — one engine for every screening type
function suggest(t,ans){
  if(!t||ans.gate!=="Yes"||t.clinical===false)return null;
  if(!(t.rule&&t.rule.length)&&!t.score)return null;
  if(t.score){let sc=0,all=true;Object.keys(t.score.pts).forEach(f=>{const fld=t.fields.find(x=>x.id===f);if(!fld||ans[f]==null||ans[f]===""){all=false;return;}const i=fld.opts.indexOf(ans[f]);if(i>=0)sc+=t.score.pts[f][i]||0;});
    if(all&&sc>=t.score.min)return {ref:"Yes",why:t.score.label+" "+sc+" (cut-off "+t.score.min+")"};}
  for(const c of t.rule||[]){const a=ans[c.f];const f=t.fields.find(x=>x.id===c.f);if(!f)continue;
    if(c.op==="in"){const vals=Array.isArray(a)?a:[a];const hit=vals.filter(x=>c.v.includes(x));if(hit.length)return {ref:"Yes",why:f.label+": "+hit.join(", ")};}
    if(c.op==="gte"&&a!==""&&a!=null&&Number(a)>=c.v)return {ref:"Yes",why:f.label+" "+a+" (≥ "+c.v+")"};}
  return {ref:"No",why:"No referral criteria met"};
}
function ruleText(t,c){const f=t.fields.find(x=>x.id===c.f);const l=f?f.label:c.f;return c.op==="gte"?`${l} is ${c.v} or more`:`${l} is ${c.v.join(" or ")}`;}

// Shared multi-criteria search (good-to-have #3)
function matchPatients(h){
  const q=ui.q.trim().toLowerCase().replace(/\s/g,"");
  return h.patients.filter(p=>{
    if(q&&!(p.name.toLowerCase().replace(/\s/g,"").includes(q)||p.mobile.includes(q)||p.id.includes(q)))return false;
    if(ui.fc&&p.clinic!==ui.fc)return false;
    if(ui.fg&&p.g!==ui.fg)return false;
    if(ui.fs&&!p.recs.some(r=>T(r.type)&&T(r.type).spec===ui.fs))return false;
    if(ui.fa){const [lo,hi]=ui.fa.split("-").map(Number);if(p.age<lo||p.age>hi)return false;}
    return true;});
}
function searchBlock(h,ph){
  return `<div class="f"><input type="text" id="sq" data-in="q" value="${esc(ui.q)}" placeholder="${ph||"Search by name, mobile, ID..."}" aria-label="Search patients"></div>
  <button class="btn-txt" data-act="adv">${ui.adv?"Hide filters":"More filters (clinic, gender, age, specialty)"}</button>
  ${ui.adv?`<div class="adv">
   <div><label for="fc">Clinic</label><select id="fc" data-ch="fc"><option value="">All clinics</option>${h.clinics.map(c=>opt(c.id,ui.fc,c.name)).join("")}</select></div>
   <div><label for="fg">Gender</label><select id="fg" data-ch="fg"><option value="">All</option>${opt("F",ui.fg,"Female")}${opt("M",ui.fg,"Male")}</select></div>
   <div><label for="fa">Age</label><select id="fa" data-ch="fa"><option value="">Any age</option>${["18-39","40-59","60-120"].map(a=>opt(a,ui.fa,a.replace("-120","+"))).join("")}</select></div>
   <div><label for="fs">Screened for</label><select id="fs" data-ch="fs"><option value="">Any specialty</option>${liveSpecs(h).map(s=>opt(s,ui.fs,spec(s).name)).join("")}</select></div></div>`:""}`;
}
function pCard(p,act,on){
  return `<button class="pcard" data-act="${act}" data-arg="${p.id}" aria-pressed="${!!on}"><b>Name:</b> ${esc(p.name)}<br><b>ID:</b> <span class="mono">${p.id}</span><br><b>Age:</b> ${esc(ageText(p))} &nbsp; <b>Gender:</b> ${p.g==="F"?"FEMALE":p.g==="M"?"MALE":"OTHER"}<br><b>Mobile No:</b> ${esc(p.mobile)}</button>`;
}
function partHdr(p){return `<div class="part"><b>Participant:</b> ${esc(p.name)} ${esc(ageText(p))}/${p.g==="F"?"FEMALE":p.g==="M"?"MALE":"OTHER"}<br><span class="pid">ID: ${p.id}</span></div>`;}
function fieldHtml(f,val,ns){
  const id=ns+"-"+f.id, star=f.req?' <span class="req">*</span>':"";
  if(f.type==="select")return `<div class="f"><label for="${id}">${esc(f.label)}${star}</label><select id="${id}" data-fld="${ns}" data-k="${f.id}"><option value="">Select an option</option>${f.opts.map(o=>opt(o,val)).join("")}</select></div>`;
  if(f.type==="pills")return `<div class="f"><span class="lbl">${esc(f.label)}${star}</span><div class="pills">${f.opts.map(o=>`<button class="pill" data-act="pillv" data-ns="${ns}" data-k="${f.id}" data-v="${esc(o)}" aria-pressed="${val===o}">${esc(o)}</button>`).join("")}</div></div>`;
  if(f.type==="multi"){const a=Array.isArray(val)?val:[];return `<div class="f"><span class="lbl">${esc(f.label)}${star}</span><div class="chkl">${f.opts.map(o=>`<label><input type="checkbox" data-mul="${ns}" data-k="${f.id}" value="${esc(o)}" ${a.includes(o)?"checked":""}>${esc(o)}</label>`).join("")}</div></div>`;}
  if(f.type==="number")return `<div class="f"><label for="${id}">${esc(f.label)}${star}</label><input type="number" inputmode="numeric" id="${id}" data-fld="${ns}" data-k="${f.id}" value="${esc(val==null?"":val)}" placeholder="Enter value"></div>`;
  return `<div class="f"><label for="${id}">${esc(f.label)}${star}</label><input type="text" id="${id}" data-fld="${ns}" data-k="${f.id}" value="${esc(val==null?"":val)}" placeholder="Enter value"></div>`;
}
function missing(fields,ans){return fields.filter(f=>f.req&&(ans[f.id]==null||ans[f.id]===""||(Array.isArray(ans[f.id])&&!ans[f.id].length))).map(f=>f.label);}
function nsStore(ns){return ns==="scr"?ui.ans:ns==="ev"?ui.evAns:ns==="reg"?ui.regP.reg:ns==="enr"?ui.enr:ns==="cf"?ui.cf:ns==="uf"?ui.uForm:{};}

// ═════════════ STAFF APP SCREENS ═════════════
function sHome(){
  return `<div class="ph-search">🔍<input type="text" data-act="homeq" id="homeq" placeholder="Search by name, mobile, ID..." aria-label="Search patients"></div>
  <div class="tiles">${TILES.map(k=>`<button class="tile" data-act="tile" data-arg="${k}"><svg viewBox="0 0 46 46" aria-hidden="true">${MODS[k].icon}</svg>${MODS[k].label}</button>`).join("")}</div>`;
}
function drawer(){
  return `<div class="drawer-bg" data-act="menuX"></div><nav class="drawer" aria-label="Menu"><div class="drawer-top"><button class="ph-btn" data-act="menuX">‹ Back</button><b>Menu</b></div>
  ${Object.keys(MODS).map(k=>`<button class="mi" data-act="tile" data-arg="${k}"><svg viewBox="0 0 46 46" aria-hidden="true">${MODS[k].icon}</svg>${MODS[k].label}</button>`).join("")}</nav>`;
}
// Outreach Clinic — creation (live fields) + NEW specialties offered
function clinicCards(h,act){
  return h.clinics.map(c=>`<${act?"button":"div"} class="ccard" ${act?`data-act="${act}" data-arg="${c.id}" style="width:100%;text-align:left;display:block"`:""}><div class="row" style="margin-bottom:4px"><b style="font-size:14px">${esc(c.name)}</b><span class="mono">${c.id}</span></div>
   <div class="meta">${esc(c.village)}, ${esc(c.taluk)}, ${esc(c.district)} · ${c.start}${c.end?" to "+c.end:""}</div>
   <div style="margin-top:6px">${c.types.map(t=>`<span class="stag">${esc(tname(t))}</span>`).join("")}</div></${act?"button":"div"}>`).join("")||'<p class="meta">No clinics yet.</p>';
}
function sOutreach(h){
  if(!isPC())return `<div class="pg-h">Outreach Clinics</div><p class="sub">Clinic setup is done by the Program Coordinator. You can view the clinics.</p>${clinicCards(h)}`;
  const pend=0;
  return `<div class="pg-h">Outreach Clinic</div>
  <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
   <button class="btn-p" data-act="cNew">Create Outreach Clinic</button>
   <button class="btn-o" data-act="cEditList">Edit Outreach Clinic</button>
   <button class="btn-o" data-act="qSetup">Set up Questionnaire <span class="stag">New</span></button></div>
  ${pend?`<p class="meta" style="margin-bottom:10px">${pend} request(s) waiting for Curable.</p>`:""}
`;
}
function sClinicEditList(h){
  return `<div class="pg-h">Edit Outreach Clinic</div><p class="sub">${h.clinics.length} clinics. Tap one to change it.</p>${clinicCards(h,"cEdit")}
  <button class="btn-o" data-act="tile" data-arg="outreach">Back</button>`;
}
// ── Set up Questionnaire: simple step-by-step wizard (Program Coordinator only)
const KINDS=[["yn","Yes / No"],["one","Choose one"],["many","Choose many"],["num","Number"],["text","Text"]];
function fieldToQ(f){let kind=f.type==="multi"?"many":f.type==="number"?"num":f.type==="text"?"text":(f.opts&&f.opts.length===2&&f.opts[0]==="Yes"&&f.opts[1]==="No")?"yn":"one";
  return {id:f.id,label:f.label,kind,opts:kind==="one"||kind==="many"?(f.opts||[]).join("\n"):""};}
function qToField(q,i,pre){const id=q.id||pre+(i+1)+Date.now().toString(36).slice(-3);const o=q.opts.split("\n").map(x=>x.trim()).filter(Boolean);
  if(q.kind==="yn")return {id,label:q.label.trim(),type:"select",opts:["Yes","No"],req:true};
  if(q.kind==="one")return {id,label:q.label.trim(),type:"select",opts:o,req:true};
  if(q.kind==="many")return {id,label:q.label.trim(),type:"multi",opts:o,req:true};
  if(q.kind==="num")return {id,label:q.label.trim(),type:"number",req:true};
  return {id,label:q.label.trim(),type:"text",req:false};}
function wzSteps(){const w=ui.wz;return ["spec","sub","q","clin"].concat(w.clinical==="Yes"?["cq"]:[]).concat(["review"]);}
const WZ_NAMES={spec:"Specialty",sub:"Screening",q:"Questions",clin:"Clinical level",cq:"Clinical questions",review:"Review"};
function sQSetup(h){
  const mine=liveTypes(h);const by={};mine.forEach(t=>{(by[T(t).spec]=by[T(t).spec]||[]).push(t);});
  return `<div class="pg-h">Set up Questionnaire</div><p class="sub">Questionnaires your staff use at screening.</p>
  ${Object.keys(by).map(s=>`<div class="meta" style="font-weight:700;margin:10px 0 6px">${esc(spec(s).name)}</div>${by[s].map(k=>`<div class="lcard"><div class="row"><b>${esc(tname(k))}</b><button class="btn-txt" data-act="wzEdit" data-arg="${k}">Edit</button></div><div class="meta">${esc(forText(T(k)))} · ${T(k).fields.length} questions · Clinical level: ${T(k).clinical===false?"No":"Yes"}${T(k).clinical===false?"":" · "+T(k).eval.length+" clinical questions"}</div></div>`).join("")}`).join("")||'<p class="meta">None yet.</p>'}
  <div style="height:8px"></div><button class="btn-p" data-act="wzNew">+ Create new questionnaire</button>
  <div style="height:8px"></div><button class="btn-o" data-act="tile" data-arg="outreach">Back</button>`;
}
function qEditor(ns){
  const list=ui.wz[ns];
  return list.map((q,i)=>`<div class="ccard" style="background:#FAFBFC"><div class="row" style="margin-bottom:6px"><b style="font-size:14px">Question ${i+1}</b><span>${i?`<button class="btn-txt" data-act="wqUp" data-ns="${ns}" data-arg="${i}" aria-label="Move up">↑ Up</button> `:""}${list.length>1?`<button class="btn-txt" data-act="wqDel" data-ns="${ns}" data-arg="${i}">Remove</button>`:""}</span></div>
    <div class="f"><input type="text" data-wq="${ns}" data-i="${i}" data-k="label" value="${esc(q.label)}" placeholder="Type the question" aria-label="Question ${i+1}"></div>
    <div class="lbl meta" style="margin-bottom:5px">Answer type</div><div class="pills" style="margin-bottom:8px">${KINDS.map(k=>`<button class="pill" style="padding:6px 11px;font-size:13px" data-act="wqKind" data-ns="${ns}" data-arg="${i}" data-v="${k[0]}" aria-pressed="${q.kind===k[0]}">${k[1]}</button>`).join("")}</div>
    ${q.kind==="one"||q.kind==="many"?`<div class="f"><label for="wqo-${ns}-${i}">Answer options, one per line</label><textarea id="wqo-${ns}-${i}" rows="3" data-wq="${ns}" data-i="${i}" data-k="opts" placeholder="Option 1&#10;Option 2">${esc(q.opts)}</textarea></div>`:""}</div>`).join("")
  +`<button class="btn-o" data-act="wqAdd" data-arg="${ns}">+ Add question</button>`;
}
function previewField(f){const star=f.req?' <span class="req">*</span>':"";
  if(f.type==="multi")return `<div class="f"><span class="lbl">${esc(f.label)}${star}</span><div class="chkl">${f.opts.map(o=>`<label><input type="checkbox" disabled>${esc(o)}</label>`).join("")}</div></div>`;
  if(f.type==="select")return `<div class="f"><label>${esc(f.label)}${star}</label><select disabled><option>Select an option</option></select><div class="meta">${esc(f.opts.join(" / "))}</div></div>`;
  return `<div class="f"><label>${esc(f.label)}${star}</label><input type="text" disabled placeholder="Enter value"></div>`;}
function sWz(h){
  const w=ui.wz;const steps=wzSteps();const key=steps[w.step];let body="";
  const specName=w.specNew?w.specNewName:(spec(w.spec)?spec(w.spec).name:"");
  if(key==="spec"){
    body=`<div class="pg-h">Which specialty?</div><div style="display:flex;flex-direction:column;gap:8px">
    ${S.specs.filter(s=>s.active).map(s=>`<button class="pill" style="text-align:left;padding:12px 14px;border-radius:10px" data-act="wzSpec" data-arg="${s.id}" aria-pressed="${!w.specNew&&w.spec===s.id}">${esc(s.name)}</button>`).join("")}
    <button class="pill" style="text-align:left;padding:12px 14px;border-radius:10px" data-act="wzSpecNew" aria-pressed="${!!w.specNew}">Other specialty</button></div>
    ${w.specNew?`<div class="f" style="margin-top:10px"><label for="wz-sn">Specialty name</label><input type="text" id="wz-sn" data-wzk="specNewName" value="${esc(w.specNewName||"")}" placeholder="e.g. ENT"></div>`:""}`;
  }
  if(key==="sub"){
    const existing=Object.keys(S.types).filter(k=>S.types[k].spec===w.spec&&(!S.types[k].owner||S.types[k].owner===h.id));
    body=`<div class="pg-h">${esc(specName)}: which screening?</div>
    ${!w.specNew&&existing.length?`<p class="sub">Pick one to change its questions, or type a new one.</p><div style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">${existing.map(k=>`<button class="pill" style="text-align:left;padding:11px 14px;border-radius:10px" data-act="wzBase" data-arg="${k}" aria-pressed="${w.base===k}">${esc(S.types[k].name)}</button>`).join("")}</div>`:""}
    <div class="f"><label for="wz-sub">New screening name</label><input type="text" id="wz-sub" data-wzk="sub" value="${esc(w.base?"":w.sub||"")}" placeholder="e.g. Glaucoma"></div>
    <div class="f"><span class="lbl">Who is this screening for? <span class="stag">New</span></span><div class="pills" style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">${[["all","Everyone"],["F","Women only"],["M","Men only"]].map(g=>`<button class="pill" style="border-radius:8px;padding:9px 4px" data-act="wzGender" data-v="${g[0]}" aria-pressed="${w.gender===g[0]}">${g[1]}</button>`).join("")}</div></div>
    <div class="f"><span class="lbl">Age (optional)</span><div style="display:flex;gap:8px;align-items:center"><input type="number" id="wz-amin" data-wzk="ageMin" value="${esc(w.ageMin||"")}" placeholder="From" aria-label="Age from" style="flex:1"><span class="meta">to</span><input type="number" id="wz-amax" data-wzk="ageMax" value="${esc(w.ageMax||"")}" placeholder="To" aria-label="Age to" style="flex:1"></div><div class="meta" style="margin-top:4px">Leave empty for all ages.</div></div>`;
  }
  if(key==="q"){
    body=`<div class="pg-h">${esc(w.title())}: screening questions</div>
    <div class="ccard" style="background:#F6F7F9"><div class="f"><label for="wz-gate">First question, asked to everyone <span class="stag">New</span></label><input type="text" id="wz-gate" data-wzk="gateLabel" value="${esc(w.gateLabel)}"><div class="meta" style="margin-top:4px">Answers: Yes / No / Not now. If Yes, staff see the questions below.</div></div>
     <div class="f" style="margin-bottom:0"><label for="wz-rs">Reasons to choose from if No or Not now, one per line</label><textarea id="wz-rs" rows="3" data-wzk="reasons">${esc(w.reasons)}</textarea></div></div>
    <div class="meta" style="font-weight:700;margin:4px 0 8px">Then ask</div>${qEditor("q")}`;
  }
  if(key==="clin"){
    body=`<div class="pg-h">Is a clinical level needed?</div><p class="sub">Clinical level means a doctor checks referred patients in Clinical Evaluation.</p>
    <div class="btn-row2">${["Yes","No"].map(v=>`<button class="pill" style="padding:14px;border-radius:10px;font-size:16px" data-act="wzClin" data-v="${v}" aria-pressed="${w.clinical===v}">${v}</button>`).join("")}</div>
    <p class="meta" style="margin-top:10px">${w.clinical==="Yes"?"Staff will mark Referral Yes or No at the end of screening. Referral Yes patients go to Clinical Evaluation.":w.clinical==="No"?"Screening ends after the questions. No referral step.":""}</p>`;
  }
  if(key==="cq"){
    body=`<div class="pg-h">${esc(w.title())}: clinical questions</div><p class="sub">What the doctor fills in Clinical Evaluation.</p>${qEditor("cq")}`;
  }
  if(key==="review"){
    const f=w.q.map((q,i)=>qToField(q,i,"x"));const cf=w.clinical==="Yes"?w.cq.map((q,i)=>qToField(q,i,"y")):[];
    body=`<div class="pg-h">Review</div><p class="sub">This is what staff will see.</p>
    <div class="ccard"><b style="font-size:14px">${esc(w.title())}</b> <span class="stag">${esc(specName)}</span><div class="meta" style="margin-top:2px">For: ${esc(forText(whoFor(w)))}</div>
     <div class="f" style="margin-top:10px"><label>${esc(w.finalGate())} <span class="req">*</span></label><select disabled><option>Yes / No / Not now</option></select><div class="meta">If No / Not now: ${esc(w.finalReasons().join(", "))}</div></div>
     ${f.map(previewField).join("")}
     ${w.clinical==="Yes"?'<div class="f"><label>Referral <span class="req">*</span></label><select disabled><option>Yes / No</option></select></div>':""}</div>
    ${w.clinical==="Yes"?`<div class="ccard"><b style="font-size:14px">${esc(w.title().replace(/ Screening$/,""))} Clinical Evaluation</b>${cf.map(previewField).join("")}</div>`:'<p class="meta">No clinical level.</p>'}`;
  }
  if(key==="done"){}
  const last=w.step===steps.length-1;
  return `<div class="steps">${steps.map((k,i)=>`<span class="step ${i===w.step?"on":i<w.step?"done":""}">${i+1}. ${WZ_NAMES[k]}</span>`).join("")}</div>${body}
  ${ui.wzErr?`<div class="err">${esc(ui.wzErr)}</div>`:""}
  <div class="btn-row2" style="margin-top:14px"><button class="btn-o" data-act="wzBack">${w.step?"Back":"Cancel"}</button><button class="btn-p" data-act="${last?"wzSave":"wzNext"}">${last?"Save":"Next"}</button></div>`;
}
function sWzDone(h){
  return `<div style="border-radius:12px;padding:16px;margin-bottom:12px;background:#E3F4EC;color:#145238"><b>${esc(ui.wzSaved)} saved</b><br><span style="font-size:13.5px">Add it to a clinic so staff can use it.</span></div>
  <button class="btn-p" data-act="cEditList">Add to a clinic</button><div style="height:8px"></div><button class="btn-o" data-act="qSetup">Back to questionnaires</button>`;
}
function newWz(){const w={gateLabel:"",reasons:DEF_REASONS.join("\n"),step:0,spec:"",specNew:false,specNewName:"",base:null,sub:"",gender:"all",ageMin:"",ageMax:"",q:[{label:"",kind:"yn",opts:""}],clinical:"",cq:[{label:"",kind:"one",opts:""}]};
  w.title=function(){if(this.base)return T(this.base).name;const s=(this.sub||"").trim();return /screen|vaccin|immuni|check|test|camp/i.test(s)||this.spec==="imm"?s:s+" Screening";};
  w.gate=function(){return this.base?T(this.base).gate:(this.sub||"").trim().replace(/ screening$/i,"")+" Examination";};w.finalGate=function(){return (this.gateLabel||"").trim()||this.gate();};w.finalReasons=function(){const r=(this.reasons||"").split("\n").map(x=>x.trim()).filter(Boolean);return r.length?r:DEF_REASONS.slice();};return w;}
function wzLoad(k){const w=newWz();const t=T(k);w.spec=t.spec;w.base=k;w.group=t.group||"";w.gateLabel=t.gate;w.reasons=(t.reasons||DEF_REASONS).join("\n");w.gender=tGender(t);w.ageMin=t.ageMin||"";w.ageMax=t.ageMax||"";w.q=t.fields.map(fieldToQ);w.clinical=t.clinical===false?"No":"Yes";w.cq=(t.eval||[]).map(fieldToQ);if(!w.cq.length)w.cq=[{label:"",kind:"one",opts:""}];w.step=1;return w;}
function whoFor(w){return {group:(w.group||"").trim()||undefined,gender:w.gender||"all",female:w.gender==="F",ageMin:w.ageMin===""?null:Number(w.ageMin),ageMax:w.ageMax===""?null:Number(w.ageMax)};}
function wzCheck(list){if(!list.length)return "Add at least one question.";for(let i=0;i<list.length;i++){const q=list[i];if(!q.label.trim())return "Question "+(i+1)+" is empty.";
  if((q.kind==="one"||q.kind==="many")&&q.opts.split("\n").map(x=>x.trim()).filter(Boolean).length<2)return "Question "+(i+1)+": give at least two answer options.";}return "";}
function treeData(h){const out={};liveTypes(h).forEach(t=>{const x=T(t);const g=(x.group||"").trim();((out[x.spec]=out[x.spec]||{})[g]=out[x.spec][g]||[]).push(t);});return out;}
function treeRow(lv,key,label,ids,sel,kids){const k=ids.filter(x=>sel.includes(x)).length;const st=k===0?0:k===ids.length?2:1;const o=!!ui.cfOpen[key];
  return `<div class="tr tr${lv}">${kids?`<button class="tr-tg" data-act="treeTog" data-arg="${esc(key)}" aria-expanded="${o}" aria-label="${o?"Close":"Open"} ${esc(label)}">${o?"▾":"▸"}</button>`:'<span class="tr-sp"></span>'}<label class="tr-l"><input type="checkbox" data-tree="${ids.join("|")}" ${st===2?"checked":""} data-ind="${st===1?1:0}"><span>${esc(label)}</span></label></div>`;}
function treeHtml(h,sel){const d={};liveTypes(h).forEach(t=>{(d[T(t).spec]=d[T(t).spec]||[]).push(t);});let out="";
  Object.keys(d).forEach(s=>{out+=treeRow(1,s,spec(s).name,d[s],sel,true);if(ui.cfOpen[s])d[s].forEach(t=>out+=treeRow(2,t,tname(t),[t],sel,false));});
  return out||'<p class="meta">No questionnaires yet. Create one in Set up Questionnaire.</p>';}
function sClinicNew(h){
  const c=ui.cf, pin=PINCODES[c.pincode];
  const byS={};liveTypes(h).forEach(t=>{(byS[T(t).spec]=byS[T(t).spec]||[]).push(t);});
  return `<div class="pg-h">${ui.cfEdit?"Edit Outreach Clinic":"Outreach Clinic Creation"}</div>${ui.cfEdit?`<p class="sub">Clinic ID <span class="mono">${ui.cfEdit}</span></p>`:""}
  ${fieldHtml({id:"name",label:"Outreach Clinic Name",type:"text",req:true},c.name,"cf")}
  <div class="f"><label for="cf-pin">Pincode <span class="req">*</span></label><input type="text" id="cf-pin" maxlength="6" data-in="pin" value="${esc(c.pincode||"")}" placeholder="Enter Pincode (try 600042, 603112, 625020, 631501)"></div>
  <div id="pinbox">${pinFields(c,pin)}</div>
  ${fieldHtml({id:"start",label:"Outreach Clinic Start Date",type:"text",req:true},c.start,"cf")}
  ${fieldHtml({id:"end",label:"Outreach Clinic End Date",type:"text"},c.end,"cf")}
  <div class="f"><span class="lbl">Screenings offered at this clinic <span class="req">*</span> <span class="stag">New</span></span>
   <div class="meta" style="margin-bottom:6px">${(c.types||[]).length} chosen${(c.types||[]).length?": "+esc((c.types||[]).map(tname).join(", ")):""}</div>
   <div class="tree">${treeHtml(h,c.types||[])}</div></div>
  ${ui.cErr?`<div class="err">${esc(ui.cErr)}</div>`:""}
  <div class="btn-row2"><button class="btn-o" data-act="tile" data-arg="outreach">Cancel</button><button class="btn-p" data-act="cSave">${ui.cfEdit?"Update":"Submit"}</button></div>
  <p class="meta" style="margin-top:10px">${ui.cfEdit?"Resource allocation can be changed the same way as today.":"Resource planning and allocation follow as today."}</p>`;
}
function pinFields(c,pin){
  if(!pin)return `<div class="f"><label>State Name <span class="req">*</span></label><select disabled><option>Select State</option></select></div><div class="f"><label>District Name <span class="req">*</span></label><select disabled><option>Select District</option></select></div><div class="f"><label>Taluk/Block Name <span class="req">*</span></label><select disabled><option>Select Taluk</option></select></div>`;
  return `<div class="f"><label>State Name</label><select disabled><option>${pin.state}</option></select></div><div class="f"><label>District Name</label><select disabled><option>${pin.district}</option></select></div><div class="f"><label>Taluk/Block Name</label><select disabled><option>${pin.taluk}</option></select></div>
  <div class="f"><label for="cf-village">Panchayat/Village Name <span class="req">*</span></label><select id="cf-village" data-fld="cf" data-k="village"><option value="">Select Panchayat/Village</option>${pin.villages.map(v=>opt(v,c.village)).join("")}</select></div>`;
}
// Patient Registration — clinic selection → enrollment → pages
function sRegClinic(h){
  const q=ui.clinicQ.toLowerCase();const list=q?h.clinics.filter(c=>c.id.includes(q)||c.name.toLowerCase().includes(q)):h.clinics;
  const c=ui.clinicSel?clinicOf(h,ui.clinicSel):null;
  return `<div class="pg-h">Patient Registration</div>
  <div class="f"><input type="text" data-in="clinicQ" id="clinicQ" value="${esc(ui.clinicQ)}" placeholder="Search by Clinic ID or Clinic Name" aria-label="Search clinic"></div>
  <div id="clist">${clinicList(list)}</div>
  ${c?`<div class="ccard" style="margin-top:6px">${[["Outreach Clinic ID",c.id],["Outreach Clinic Name",c.name],["Pincode",c.pincode],["State Name",c.state.toUpperCase()],["District Name",c.district.toUpperCase()],["Taluk/Block Name",c.taluk.toUpperCase()],["Panchayat/Village Name",c.village.toUpperCase()],["Start Date",c.start],["End Date",c.end||""]].map(r=>`<div class="r"><span>${r[0]}:</span><span>${esc(r[1])}</span></div>`).join("")}
   <div class="r"><span>Screenings:</span><span style="text-align:right">${c.types.map(tname).join(", ")}</span></div>
   <div style="text-align:center;margin-top:10px"><button class="btn-p" style="width:auto;padding:8px 22px" data-act="startReg">Start Registration</button></div></div>`:""}`;
}
function clinicList(list){return list.map(c=>`<button class="lcard" data-act="pickClinic" data-arg="${c.id}" ${ui.clinicSel===c.id?'style="border-color:#C2449A"':""}><b>${esc(c.name)}</b> <span class="mono">${c.id}</span><div class="meta">${esc(c.village)} · ${c.start}</div></button>`).join("")||'<p class="meta">No clinic found.</p>';}
function enrAge(e){if(e.dob){const m=ageFromDob(e.dob);if(m!==null)return Math.floor(m/12);}return e.age===undefined||e.age===""?null:Number(e.age);}
function sEnroll(h){
  const e=ui.enr;const ag=enrAge(e);const child=ag!==null&&ag<CHILD_AGE;
  return `<div class="pg-h">New Screening Enrollment</div>
  ${fieldHtml({id:"name",label:"Name",type:"text",req:true},e.name,"enr")}
  ${fieldHtml({id:"mobile",label:child?"Parent's Mobile Number":"Mobile Number",type:"text",req:true},e.mobile,"enr")}
  ${fieldHtml({id:"g",label:"Gender",type:"pills",opts:["Male","Female","Other"],req:true},e.g,"enr")}
  <div class="f"><label for="enr-age">Age <span class="req">*</span></label><div style="display:flex;gap:8px;align-items:center"><input type="number" id="enr-age" data-fld="enr" data-k="age" value="${esc(e.dob&&ag!==null?ag:(e.age||""))}" placeholder="Years" style="flex:1" ${e.dob?"disabled":""}><span class="meta">or</span><input type="date" id="enr-dob" data-fld="enr" data-k="dob" value="${esc(e.dob||"")}" aria-label="Date of birth" style="flex:1.3"></div><div class="meta" style="margin-top:4px">For babies and children, enter date of birth. <span class="stag">New</span></div></div>
  ${child?`<div class="ccard" style="background:#F6F7F9"><div class="meta" style="font-weight:700;margin-bottom:8px">Child under ${CHILD_AGE} <span class="stag">New</span></div>
   ${fieldHtml({id:"guardian",label:"Parent / Guardian Name",type:"text",req:true},e.guardian,"enr")}
   <label class="toggle" style="align-items:flex-start"><input type="checkbox" id="enr-consent" data-act="enrConsent" ${e.consent?"checked":""}><span style="font-size:13.5px">Parent or guardian agrees to record this child's health details <span class="req">*</span></span></label>
   <div class="meta" style="margin-top:6px">Adult pages (women's health, income, habits) are skipped for children.</div></div>`:""}
  ${fieldHtml({id:"address",label:"Address",type:"text"},e.address,"enr")}
  ${fieldHtml({id:"street",label:"Street ID",type:"text"},e.street,"enr")}
  ${ui.eErr?`<div class="err">${esc(ui.eErr)}</div>`:""}
  <button class="btn-p" data-act="enrSave">Next</button>`;
}
function regPages(h,p){
  const pages=[];
  if(h.hq.length)pages.push({key:"hq",name:"Hospital Questions",fields:h.hq,isNew:true});
  if(isChild(p))return pages;
  ["general","medical","women","family"].forEach(k=>{if(REG_PAGES[k].female&&p.g!=="F")return;pages.push({key:k,...REG_PAGES[k]});});
  const sp=[];liveTypes(h).forEach(t=>(T(t).regFields||[]).forEach(f=>{if(!sp.find(x=>x.id===f.id))sp.push({...f,req:false});}));
  if(sp.length)pages.push({key:"spec",name:"Specialty Details",fields:sp,isNew:true});
  return pages;
}
function sRegPage(h){
  const p=ui.regP;const pages=regPages(h,p);const pg=pages[ui.step];
  return partHdr(p)+`<div class="steps">${pages.map((x,i)=>`<span class="step ${i===ui.step?"on":i<ui.step?"done":""}">${esc(x.name)}</span>`).join("")}</div>
  <div class="pg-h">${esc(pg.name)} ${pg.isNew?'<span class="stag">New</span>':""}</div>
  ${pg.key==="hq"?'<p class="sub">Set by this hospital. Asked first.</p>':pg.key==="spec"?'<p class="sub">Added from the screenings this hospital runs.</p>':""}
  ${pg.fields.map(f=>fieldHtml(f,p.reg[f.id],"reg")).join("")}
  ${ui.rErr?`<div class="err">${esc(ui.rErr)}</div>`:""}
  <div class="btn-row2"><button class="btn-o" data-act="regBack">${ui.step?"Back":"Save & exit"}</button><button class="btn-p" data-act="regNext">${ui.step===pages.length-1?"Finish":"Next"}</button></div>`;
}
function sRegDone(h){
  const p=ui.regP;
  return partHdr(p)+`<div class="result-box" style="background:#E3F4EC;border-radius:12px;padding:16px;color:#145238;margin-bottom:12px"><b>Registration complete</b><br><span style="font-size:13.5px">16 digit ID generated. Clinic ${esc(clinicOf(h,p.clinic).name)}.${isChild(p)?" Child registration: adult pages skipped.":""}</span></div>
  <button class="btn-p" data-act="goScreen" data-arg="${p.id}">Start screening</button><div style="height:8px"></div><button class="btn-o" data-act="home">Back to home</button>`;
}
// Screening selection (live) — dropdown now grouped by specialty, filtered by clinic
function tGender(t){return t.gender||(t.female?"F":"all");}
function fitsPatient(t,p){const g=tGender(t);if(g!=="all"&&p.g!==g)return false;if(t.ageMin&&p.age<t.ageMin)return false;if(t.ageMax&&p.age>t.ageMax)return false;return true;}
function forText(t){const g=tGender(t);const a=t.ageMin||t.ageMax?`, age ${t.ageMin||0}–${t.ageMax||"any"}`:"";return (g==="F"?"Women only":g==="M"?"Men only":"Everyone")+a;}
function clinicTypes(h,p){const c=clinicOf(h,p.clinic);let ts=liveTypes(h);if(c)ts=ts.filter(t=>c.types.includes(t));return ts;}
function availTypes(h,p){return clinicTypes(h,p).filter(t=>fitsPatient(T(t),p));}
function recBadge(r){
  if(r.status==="draft")return '<span class="badge b-draft">Active (saved)</span>';
  if(r.status==="notdone")return '<span class="badge b-nd">Not done</span>';
  if(r.referral==="Yes")return `<span class="badge b-ref">Referred${r.ev&&r.ev.status==="done"?" · Evaluated":""}</span>`;
  return '<span class="badge b-ok">Completed</span>';
}
function historyBlock(h,p){
  if(!p.recs.length)return '<p class="meta">No screenings yet.</p>';
  const by={};p.recs.forEach(r=>{const s=T(r.type)?T(r.type).spec:"x";(by[s]=by[s]||[]).push(r);});
  return Object.keys(by).map(s=>`<div class="meta" style="font-weight:700;margin:8px 0 4px">${esc(spec(s)?spec(s).name:"Other")}</div>${by[s].map(r=>`<div class="lcard"><div class="row"><span>${esc(tname(r.type))}</span>${recBadge(r)}</div><div class="meta">${r.date}${r.ans.gate&&r.ans.gate!=="Yes"?" · "+esc(r.ans.gate+(r.ans.reason?" – "+r.ans.reason:"")):""}</div></div>`).join("")}`).join("");
}
function sScreenSel(h){
  const list=matchPatients(h);const p=ui.selP?h.patients.find(x=>x.id===ui.selP):null;
  let tail="";
  if(p){
    const ts=availTypes(h,p);const by={};ts.forEach(t=>{(by[T(t).spec]=by[T(t).spec]||[]).push(t);});
    tail=`<div class="f" style="margin-top:4px"><label for="selT">Screening</label><select id="selT" data-ch="selT"><option value="">Select screening</option>${Object.keys(by).map(s=>by[s].map(t=>opt(t,ui.selT,tname(t)+" · "+spec(s).name)).join("")).join("")}</select></div>
    ${(()=>{const hid=clinicTypes(h,p).filter(t=>!fitsPatient(T(t),p));return hid.length?`<p class="meta" style="margin:-6px 0 10px">Not shown for this patient: ${hid.map(t=>esc(tname(t))+" ("+esc(forText(T(t)))+")").join(", ")}</p>`:"";})()}
    ${ui.fErr?`<div class="err">${esc(ui.fErr)}</div>`:""}
    <button class="btn-p" data-act="scrNext">Next</button>`;
  }
  return `<div class="pg-h">Screening</div>${searchBlock(h)}
  <div class="lbl meta" style="margin-bottom:6px">Select Patient</div><div id="plist">${list.map(x=>pCard(x,"selP",x.id===ui.selP)).join("")||'<p class="meta">No patient found in this hospital.</p>'}</div>${tail}`;
}
function sScrForm(h){
  const p=h.patients.find(x=>x.id===ui.rec.pid);const t=T(ui.rec.type);const a=ui.ans;
  let body=`<div class="f"><label for="scr-gate">${esc(t.gate)} <span class="req">*</span></label><select class="gate" id="scr-gate" data-fld="scr" data-k="gate"><option value="">Select</option>${YNN.map(o=>opt(o,a.gate)).join("")}</select></div>`;
  if(a.gate&&a.gate!=="Yes")body+=fieldHtml({id:"reason",label:"Reason",type:"select",opts:t.reasons||DEF_REASONS,req:true},a.reason,"scr");
  if(a.gate==="Yes"){
    body+=t.fields.map(f=>fieldHtml(f,a[f.id],"scr")).join("");
    const sg=suggest(t,a);
    if(t.clinical!==false)body+=`<div class="f"><label for="scr-ref">Referral <span class="req">*</span></label><select id="scr-ref" data-fld="scr" data-k="referral"><option value="">Select an option</option>${opt("Yes",a.referral)}${opt("No",a.referral)}</select>
     ${sg?`<div class="hint-s ${sg.ref==="Yes"?"ref":"clr"}">System suggests <b>${sg.ref}</b>: ${esc(sg.why)} <span class="stag">New</span></div>`:""}</div>`;
  }
  return partHdrTap(p)+`<div class="pg-h">${esc(t.name)}</div><p class="sub">${esc(spec(t.spec).name)} · form v${t.v}</p>${body}
  ${ui.fErr?`<div class="err">${esc(ui.fErr)}</div>`:""}
  <div class="btn-row2"><button class="btn-o" data-act="scrSave">Save</button><button class="btn-p" data-act="scrFinish">Finish</button></div>`;
}
function sScrDone(h){
  const r=ui.rec;const t=T(r.type);
  const ref=r.referral==="Yes";
  return `<div style="border-radius:12px;padding:16px;margin-bottom:12px;background:${ref?"#FDF0DC":"#E3F4EC"};color:${ref?"#7A3A05":"#145238"}"><b>${esc(t.name)} ${r.status==="draft"?"saved":"completed"}</b><br><span style="font-size:13.5px">${r.status==="draft"?"You can come back and finish it. Only one active screening per type.":r.status==="notdone"?"Recorded as not done: "+esc(r.reason||""):ref?"Referral Yes. Sent to the "+esc(spec(t.spec).name)+" queue in Clinical Evaluation.":t.clinical===false?"Screening complete. No clinical level for this screening.":"No referral."}</span></div>
  <button class="btn-p" data-act="goScreen" data-arg="${r.pid}">Another screening for this patient</button><div style="height:8px"></div><button class="btn-o" data-act="home">Back to home</button>`;
}
// Clinical Evaluation — same queue, specialty filter
function evQueue(h){const out=[];h.patients.forEach(p=>p.recs.forEach(r=>{if(r.status==="done"&&r.referral==="Yes"&&r.ev)out.push({p,r});}));return out;}
function sClinical(h){
  const specs=liveSpecs(h);
  const q=matchPatients(h).map(p=>p.id);
  const all=evQueue(h).filter(x=>q.includes(x.p.id)&&(ui.cefs==="all"||T(x.r.type).spec===ui.cefs));
  const wait=all.filter(x=>x.r.ev.status!=="done"),done=all.filter(x=>x.r.ev.status==="done");
  return `<div class="pg-h">Clinical Evaluation</div>
  ${specs.length>1?`<div class="fchips">${["all",...specs].map(s=>`<button class="fchip" data-act="cefs" data-arg="${s}" aria-pressed="${ui.cefs===s}">${s==="all"?"All specialties":esc(spec(s).name)}</button>`).join("")}</div>`:""}
  ${searchBlock(h)}
  <p class="sub" style="margin-top:6px">Referral Yes patients come here. ${wait.length} waiting · ${done.length} completed</p>
  ${wait.map(x=>`<button class="lcard" data-act="evOpen" data-arg="${x.p.id}" data-r="${x.r.id}"><div class="row"><b>${esc(x.p.name)}</b><span class="badge ${x.r.ev.status==="draft"?"b-draft":"b-ref"}">${x.r.ev.status==="draft"?"In progress":"Waiting"}</span></div><div class="meta">${stag(x.r.type)}${esc(tname(x.r.type))} · ${x.r.date}</div><div class="meta mono">${x.p.id}</div></button>`).join("")||'<div class="lcard meta">No patients waiting.</div>'}
  ${done.length?`<div class="meta" style="font-weight:700;margin:10px 0 6px">Completed</div>${done.map(x=>`<div class="lcard"><div class="row"><span>${esc(x.p.name)}</span><span class="badge b-ok">Done</span></div><div class="meta">${stag(x.r.type)}${esc(tname(x.r.type))}${x.r.ev.ans.plan?" · "+esc(x.r.ev.ans.plan):""}</div></div>`).join("")}`:""}`;
}
function sEvForm(h){
  const {pid,rid}=ui.evRec;const p=h.patients.find(x=>x.id===pid);const r=p.recs.find(x=>x.id===rid);const t=T(r.type);
  const sg=suggest(t,r.ans);
  const title=t.name.replace(/ Screening$/,"").replace(/ screening$/,"");
  return partHdrTap(p)+`<div class="pg-h">${esc(title)} Clinical Evaluation</div>
  <div class="ccard" style="background:#F6F7F9"><b style="font-size:13px">Screening finding</b><div class="meta">${r.date} · ${sg?esc(sg.why):"—"}</div></div>
  ${fieldHtml({id:"exam",label:title+" Clinical Examination",type:"select",opts:["Yes","No"],req:true},ui.evAns.exam,"ev")}
  ${t.eval.map(f=>fieldHtml(f,ui.evAns[f.id],"ev")).join("")}
  ${ui.evErr?`<div class="err">${esc(ui.evErr)}</div>`:""}
  <div class="btn-row2"><button class="btn-o" data-act="evSave">Save</button><button class="btn-p" data-act="evFinish">Finish</button></div>
  <p class="meta" style="margin-top:8px">Cannot finish until all * questions are answered. Once finished, the screening is complete.</p>`;
}
// User Data Management — live screens + specialties
function sUdm(h){
  return `<div class="pg-h">User Management</div>
  <button class="btn-p" data-act="uNew">Create New User</button>
  <div class="meta" style="font-weight:700;margin:14px 0 6px">Edit Existing User</div>
  ${h.users.map((u,i)=>`<button class="lcard" data-act="uEdit" data-arg="${i}"><div class="row"><b>${esc(u.name)}</b><span class="badge ${u.active?"b-ok":"b-nd"}">${u.active?"Active":"Inactive"}</span></div><div class="meta">${esc(u.role)} · ${esc(u.email)}</div><div>${u.specs.map(s=>`<span class="stag">${esc(spec(s)?spec(s).name:s)}</span>`).join("")}</div></button>`).join("")}`;
}
function sUForm(h){
  const u=ui.uForm;const isNew=ui.uEdit==="new";
  return `<div class="pg-h">${isNew?"Create New User":"Edit User"}</div>
  ${fieldHtml({id:"name",label:"Name",type:"text",req:true},u.name,"uf")}
  ${fieldHtml({id:"role",label:"Role",type:"select",opts:ROLES,req:true},u.role,"uf")}
  ${fieldHtml({id:"email",label:"Email ID",type:"text",req:true},u.email,"uf")}
  ${fieldHtml({id:"mobile",label:"Mobile",type:"text",req:true},u.mobile,"uf")}
  ${fieldHtml({id:"g",label:"Gender",type:"pills",opts:["Male","Female","Other"],req:true},u.g,"uf")}
  <div class="f"><span class="lbl">Specialties <span class="req">*</span> <span class="stag">New</span></span><div class="chkl">${liveSpecs(h).map(s=>`<label><input type="checkbox" data-mul="uf" data-k="specs" value="${s}" ${(u.specs||[]).includes(s)?"checked":""}>${esc(spec(s).name)}</label>`).join("")}</div></div>
  ${isNew?fieldHtml({id:"pw",label:"Password",type:"text",req:true},u.pw,"uf"):""}
  <div class="f"><span class="lbl">Status</span><label class="toggle"><input type="checkbox" data-act="uActive" ${u.active!==false?"checked":""}>Active</label></div>
  ${ui.uErr?`<div class="err">${esc(ui.uErr)}</div>`:""}
  <div class="btn-row2"><button class="btn-o" data-act="tile" data-arg="udm">Cancel</button><button class="btn-p" data-act="uSave">Submit</button></div>`;
}
// Reports — coordinator dashboard + download form with specialty filter
function repData(h,rp){
  const rows={};const inC=p=>!rp.clinic||p.clinic===rp.clinic;
  const pts=h.patients.filter(inC);
  liveTypes(h).filter(t=>!rp.spec||T(t).spec===rp.spec).forEach(t=>rows[t]={sc:0,ref:0,pend:0,evd:0,nd:0});
  pts.forEach(p=>p.recs.forEach(r=>{const x=rows[r.type];if(!x)return;if(r.date<rp.from||r.date>rp.to)return;
    if(r.status==="draft"){x.pend++;return;}if(r.status==="notdone"){x.nd++;return;}x.sc++;if(r.referral==="Yes"){x.ref++;if(r.ev&&r.ev.status==="done")x.evd++;}}));
  return {pts,rows};
}
function sReports(h){
  const rp=ui.rep;const {pts,rows}=repData(h,rp);
  const tot=Object.values(rows).reduce((a,x)=>({sc:a.sc+x.sc,ref:a.ref+x.ref,pend:a.pend+x.pend+(x.ref-x.evd)}),{sc:0,ref:0,pend:0});
  return `<div class="pg-h">Reports</div>
  <div class="adv" style="margin:0 0 12px">
   <div><label for="rp-clinic">Outreach Clinic</label><select id="rp-clinic" data-rp="clinic"><option value="">All clinics</option>${h.clinics.map(c=>opt(c.id,rp.clinic,c.name)).join("")}</select></div>
   <div><label for="rp-spec">Specialty <span class="stag">New</span></label><select id="rp-spec" data-rp="spec"><option value="">All specialties</option>${liveSpecs(h).map(s=>opt(s,rp.spec,spec(s).name)).join("")}</select></div></div>
  <div class="kpis"><div class="kpi"><b>${pts.length}</b><span>Registered</span></div><div class="kpi"><b>${tot.sc}</b><span>Screened</span></div><div class="kpi"><b>${tot.ref}</b><span>Referred</span></div><div class="kpi"><b>${tot.pend}</b><span>Pending (saved screenings + evaluations)</span></div></div>
  <table class="mtab"><thead><tr><th>Screening</th><th class="n">Done</th><th class="n">Ref.</th><th class="n">Eval</th><th class="n">Not done</th></tr></thead><tbody>
  ${Object.keys(rows).map(t=>`<tr><td>${stag(t)}${esc(tname(t))}</td><td class="n">${rows[t].sc}</td><td class="n">${rows[t].ref}</td><td class="n">${rows[t].evd}</td><td class="n">${rows[t].nd}</td></tr>`).join("")}</tbody></table>
  <div class="pg-h" style="margin-top:6px">Download report</div>
  <div class="f"><label for="rp-from">Start Date <span class="req">*</span></label><input type="date" id="rp-from" data-rp="from" value="${rp.from}"></div>
  <div class="f"><label for="rp-to">End Date <span class="req">*</span></label><input type="date" id="rp-to" data-rp="to" value="${rp.to}"></div>
  <div class="f"><label for="rp-type">Report Type <span class="req">*</span></label><select id="rp-type" data-rp="type">${opt("summary",rp.type,"Screening summary")}${opt("referral",rp.type,"Referral list")}${opt("patient",rp.type,"Patient-wise all specialties")}</select></div>
  <button class="btn-p" data-act="repShow">Download</button>
  ${rp.show?repPreview(h,rp):""}`;
}
function repPreview(h,rp){
  const {pts}=repData(h,rp);let rows=[];
  pts.forEach(p=>p.recs.forEach(r=>{if(!T(r.type))return;if(rp.spec&&T(r.type).spec!==rp.spec)return;if(r.date<rp.from||r.date>rp.to)return;
    if(rp.type==="referral"&&r.referral!=="Yes")return;rows.push([p.name,p.id,spec(T(r.type).spec).name,tname(r.type),r.date,r.status==="draft"?"Saved":r.status==="notdone"?"Not done":(r.referral||"—")]);}));
  return `<p class="meta" style="margin:10px 0 6px">Preview of the file (${rows.length} rows). The live app downloads it as Excel.</p>
  <table class="mtab"><thead><tr><th>Patient</th><th>Specialty</th><th>Screening</th><th>Referral</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r[0])}<div class="meta mono">${r[1]}</div></td><td>${esc(r[2])}</td><td>${esc(r[3])}<div class="meta">${r[4]}</div></td><td>${esc(r[5])}</td></tr>`).join("")}</tbody></table>`;
}
// Modify Patient Information — multi-criteria search, photo, delete
function sModify(h){
  const list=matchPatients(h);
  return `<div class="pg-h">Patients</div>${searchBlock(h)}<div id="plist">${patientsList(list)}</div>`;
}
function patientsList(list){
  return list.map(p=>pCard(p,"patPick",p.id===ui.selP)+(p.id===ui.selP?`<div class="btn-row2" style="margin:-4px 0 14px"><button class="btn-p" data-act="patView" data-arg="${p.id}">View journey</button><button class="btn-o" data-act="patEdit" data-arg="${p.id}">Edit</button></div>`:"")).join("")||'<p class="meta">No patient found.</p>';
}
function recResult(r){
  if(r.status==="draft")return {txt:"Saved, not finished",cls:"b-draft"};
  if(r.status==="notdone")return {txt:"Not done"+(r.ans.reason?": "+r.ans.reason:""),cls:"b-nd"};
  if(r.referral==="Yes")return {txt:"Referred",cls:"b-ref"};
  if(r.referral==="No")return {txt:"No referral",cls:"b-ok"};
  return {txt:"Completed",cls:"b-ok"};
}
function recDetail(r){const t=T(r.type);if(!t||r.status!=="done")return "";if(r.ans.imported)return "Imported from past data";const sg=suggest(t,r.ans);
  if(sg&&sg.ref==="Yes")return sg.why;
  const shown=t.fields.filter(f=>r.ans[f.id]!=null&&r.ans[f.id]!==""&&!(Array.isArray(r.ans[f.id])&&!r.ans[f.id].length)).slice(0,2).map(f=>f.label+": "+(Array.isArray(r.ans[f.id])?r.ans[f.id].join(", "):r.ans[f.id]));
  return shown.join(" · ");}
function journeyTimeline(h,p){
  const ev=[{date:p.regDate,title:"Registered"}];
  p.recs.forEach(r=>{const t=T(r.type);
    let ref="";if(r.referral==="Yes")ref="Referral: Yes";else if(r.referral==="No")ref="Referral: No";else if(t&&t.clinical!==false)ref=r.status==="notdone"?"Referral: —":"Referral: Pending";
    ev.push({date:r.date,title:tname(r.type),ref,st:r.status==="draft"?"Pending":r.status==="notdone"?"Not done":"Completed"});
    if(r.ev)ev.push({date:r.ev.date||r.date,seq:1,title:tname(r.type)+" – Clinical evaluation",st:r.ev.status==="done"?"Completed":"Pending"});});
  ev.sort((a,b)=>a.date<b.date?-1:a.date>b.date?1:(a.seq||0)-(b.seq||0));
  return `<ol class="tl">${ev.map(e=>`<li><div class="row"><span class="meta">${e.date}</span>${e.st?`<span class="badge ${e.st==="Completed"?"b-ok":e.st==="Pending"?"b-ref":"b-nd"}">${e.st}</span>`:""}</div><b>${esc(e.title)}</b>${e.ref?`<div class="meta">${e.ref}</div>`:""}</li>`).join("")}</ol>`;}
function sPatView(h){
  const p=h.patients.find(x=>x.id===ui.selP);if(!p)return sModify(h);
  const scr=p.recs.filter(r=>r.status==="done").length,ref=p.recs.filter(r=>r.referral==="Yes").length,wait=p.recs.filter(r=>r.ev&&r.ev.status!=="done").length,open=p.recs.filter(r=>r.status==="draft").length;
  const specs=[...new Set(p.recs.map(r=>T(r.type)&&T(r.type).spec).filter(Boolean))];
  return `<div style="display:flex;gap:14px;align-items:center;margin-bottom:12px"><div><b style="font-size:16px">${esc(p.name)}</b><div class="meta">${esc(ageText(p))} · ${p.g==="F"?"Female":p.g==="M"?"Male":"Other"} · ${esc(p.mobile)}</div><div class="meta mono">${p.id}</div>${p.guardian?`<div class="meta">Parent / guardian: ${esc(p.guardian)}</div>`:""}</div></div>
  <div class="pg-h" style="margin:4px 0 8px">Patient journey</div>
  ${journeyTimeline(h,p)}
  <div class="btn-row2" style="margin-top:12px"><button class="btn-o" data-act="patEdit" data-arg="${p.id}">Edit</button><button class="btn-p" data-act="goScreen" data-arg="${p.id}">Start screening</button></div>`;
}
function partHdrTap(p){return `<button class="part part-tap" data-act="histOpen" data-arg="${p.id}" aria-label="View history of ${esc(p.name)}"><b>Participant:</b> ${esc(p.name)} ${esc(ageText(p))}/${p.g==="F"?"FEMALE":p.g==="M"?"MALE":"OTHER"}<br><span class="pid">ID: ${p.id}</span></button>`;}
function histSheet(h){const p=h.patients.find(x=>x.id===ui.hist);if(!p)return "";
  const done=p.recs.filter(r=>r.status==="done").length,wait=p.recs.filter(r=>r.ev&&r.ev.status!=="done").length;
  return `<div class="sheet-bg" data-act="histClose"></div><div class="sheet" role="dialog" aria-label="Patient history"><div class="row" style="margin-bottom:6px"><b style="font-size:16px;color:#0B3B6F">Patient history</b><button class="ph-btn" data-act="histClose">Close</button></div>
  <div style="margin-bottom:4px"><b>${esc(p.name)}</b> · ${esc(ageText(p))} · ${p.g==="F"?"Female":p.g==="M"?"Male":"Other"}</div><div class="meta mono">${p.id}</div>
  <div class="meta" style="margin:6px 0 12px">${esc(p.mobile)}${p.guardian?" · Parent / guardian: "+esc(p.guardian):""} · ${done} screenings done${wait?" · "+wait+" waiting for doctor":""}</div>
  ${journeyTimeline(h,p)}</div>`;}
function sProfile(h){
  const p=h.patients.find(x=>x.id===ui.selP);if(!p)return sModify(h);
  const canDel=S.role==="Program Coordinator";
  return `<div class="pg-h">Edit patient</div><div style="display:flex;gap:14px;align-items:center;margin-bottom:14px"><div class="photo">${p.photo?`<img src="${p.photo}" alt="Photo of ${esc(p.name)}">`:"No photo"}</div>
  <div><b>${esc(p.name)}</b><div class="meta mono">${p.id}</div><label class="btn-txt" style="cursor:pointer">Update photo <span class="stag">New</span><input type="file" accept="image/*" data-act="photo" style="display:none"></label></div></div>
  ${fieldHtml({id:"name",label:"Name",type:"text",req:true},p.name,"prof")}
  ${fieldHtml({id:"mobile",label:"Mobile Number",type:"text",req:true},p.mobile,"prof")}
  ${fieldHtml({id:"age",label:"Age",type:"number",req:true},p.age,"prof")}
  ${fieldHtml({id:"address",label:"Address",type:"text"},p.address,"prof")}
  ${ui.profMsg?`<div class="okm">${esc(ui.profMsg)}</div>`:""}
  <button class="btn-p" data-act="profSave">Save changes</button>
  <button class="btn-txt" data-act="patView" data-arg="${p.id}" style="margin-top:8px">View journey</button>
  ${canDel?`<div class="danger"><b style="font-size:14px">Delete patient record</b> <span class="stag">New</span><p class="meta" style="margin:4px 0 8px">Only for records registered by mistake. Kept in the audit log.</p>
   ${ui.delOpen?`<div class="f"><label for="delr">Reason <span class="req">*</span></label><select id="delr" data-ch="delReason"><option value="">Select</option>${["Registered by mistake","Duplicate record","Incorrect data"].map(o=>opt(o,ui.delReason)).join("")}</select></div>
    <div class="btn-row2"><button class="btn-o" data-act="delX">Cancel</button><button class="btn-d" data-act="delGo">Delete permanently</button></div>`:`<button class="btn-d" data-act="delOpen">Delete record</button>`}</div>`
  :`<p class="meta" style="margin-top:14px">Delete is available to Program Coordinators only.</p>`}`;
}

const SCREENS={patView:sPatView,home:sHome,outreach:sOutreach,clinicNew:sClinicNew,clinicEdit:sClinicEditList,qSetup:sQSetup,wz:sWz,wzDone:sWzDone,register:sRegClinic,enroll:sEnroll,regPage:sRegPage,regDone:sRegDone,
  screening:sScreenSel,scrForm:sScrForm,scrDone:sScrDone,clinical:sClinical,evForm:sEvForm,udm:sUdm,uForm:sUForm,reports:sReports,modify:sModify,profile:sProfile};
function renderPhone(){
  const h=H();const el=$("#phone");const st=el.querySelector(".ph-body");const keep=st&&ui._keepScroll?st.scrollTop:0;
  el.innerHTML=`<div class="ph-top">${ui.scr!=="home"?'<button class="ph-btn" data-act="home">‹ Home</button>':'<button class="ph-btn" data-act="menu" aria-label="Open menu" style="font-size:22px">☰</button>'}<div class="ph-title">${esc(h.name)}</div><span class="ph-av" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z"/></svg></span></div>
  <div class="ph-body">${(SCREENS[ui.scr]||sHome)(h)}</div><div class="ph-foot">Powered by <b>Curable</b></div>${ui.menu?drawer():""}${ui.hist?histSheet(h):""}`;
  el.querySelectorAll('input[data-ind="1"]').forEach(i=>i.indeterminate=true);
  if(ui._keepScroll){el.querySelector(".ph-body").scrollTop=keep;ui._keepScroll=false;}
  renderSide();
}
function rerender(){ui._keepScroll=true;renderPhone();}

// Side panel: what's new on the screen being shown
const SIDE={
  home:["Same home screen, tiles, icons and menu for every hospital and specialty.","Only the hospital name in the header comes from the database."],
  outreach:["<b>Program Coordinator</b> sees only three options: Create Outreach Clinic, Edit Outreach Clinic, Set up Questionnaire. The clinic list is inside Edit Outreach Clinic.","Other roles see the clinic list only. Switch 'Logged in as' above to compare.","<b>Roadmap B.</b> A clinic can offer more than one specialty."],
  clinicEdit:["<b>New:</b> edit an existing clinic: name, place, dates and screenings offered.","A screening cannot be removed while unfinished (saved) screenings of that type exist at the clinic."],
  qSetup:["<b>Program Coordinator only.</b> A plain list of the questionnaires the hospital uses, with Edit and Create new.","Covers roadmap A1, A2 and A3 at hospital level in one place."],
  wz:["Step by step, one decision per screen: <b>Specialty → Screening → Questions → Clinical level Yes/No → Clinical questions → Review</b>.","<b>New in step 2:</b> Who is this screening for? Everyone, Women only or Men only, plus an optional age range. Screenings that don't fit a patient are hidden in the Screening dropdown.","Answer types are buttons, not jargon: Yes/No, Choose one, Choose many, Number, Text.","Every screening still starts with 'Examination: Yes / No / Not now', and Referral is added on its own when clinical level is Yes.","Editing a Curable library form makes the hospital's own copy; other hospitals are not affected."],
  wzDone:["New questionnaires are added to a clinic through Edit Outreach Clinic."],
  clinicNew:["Same Outreach Clinic Creation form with pincode master.","<b>Option D, one level:</b> Specialty → Screening. Tick a specialty to pick all its screenings; open it with the arrow to pick single ones. A dash means part-picked.","Try it at <b>District Hospital (NCD)</b>, which has 11 screenings."],
  register:["Same clinic search and clinic card. The card now shows the screenings offered."],
  enroll:["Same enrollment fields and validations: mandatory *, 10-digit mobile, 3-digit street ID.","<b>New:</b> Age or Date of birth. Babies get an exact age in months.","<b>New:</b> under 12, Parent / Guardian name and a consent tick box appear, and adult pages are skipped. Try it at Rotary Club."],
  regPage:["<b>Roadmap E.</b> The hospital's own questions come first, set in Curable admin.","General, Medical, Women's Health (female only) and Family pages unchanged.","<b>New:</b> Specialty Details page appears only if the hospital's screenings need it (for example Known diabetic)."],
  regDone:["16 digit ID as today."],
  screening:["<b>Roadmap A.</b> Screening dropdown is dynamic: filtered by the clinic, gender and age. <b>New:</b> a plain list, each screening followed by its specialty (e.g. Oral Screening · Oncology), so no headings look tappable.","Kept clean: pick the patient and the screening, then Next.","<b>New:</b> one tap on a patient selects them and shows the screening choice. <b>Double tap</b> opens their history.","<b>Good to have 3.</b> More filters for multi-criteria search."],
  scrForm:["Same layout as the live form: participant header, 'Examination Yes / No / Not now', Save and Finish.","Tap the patient name at the top to see their history across all specialties. No hint text on screen; staff learn it in training.","Questions come from the screening template set in Curable admin.","<b>Roadmap A.</b> Referral rules: the system suggests Yes or No and why. Staff still choose the final referral."],
  scrDone:["One active (saved) screening per screening type. A patient can have active records in several specialties at once."],
  clinical:["Same queue: only Referral Yes patients come here.","<b>Roadmap C.</b> Specialty filter at the top, plus multi-criteria search."],
  evForm:["<b>Roadmap A.</b> Evaluation criteria per specialty, set in Curable admin.","Doctors can also tap the patient name to see the full history before deciding.","UHID and SCR OPD Number kept. Cannot finish until all * questions are done."],
  udm:["Same Create New User and Edit Existing User.","<b>New:</b> each user has specialties."],
  uForm:["Same fields and Active toggle. <b>New:</b> specialties checklist."],
  reports:["<b>Roadmap C.</b> Coordinator dashboard: registered, screened, referred, pending, by clinic and specialty.","Same download form with a specialty filter and a patient-wise all-specialties report."],
  modify:["<b>Renamed:</b> Modify Patient Information is now <b>Patients</b>.","Tap a patient to see two buttons: <b>View journey</b> and <b>Edit</b>.","Multi-criteria search stays (good to have 3)."],
  patView:["<b>New: the whole patient journey in one place.</b> Registration, every screening with its result, referral and clinical evaluation, in date order, across all specialties.","<b>v15:</b> 'View journey' (was View profile). No photo, no count boxes. After the ID: date and Registered; each screening with its referral status (Yes / No / Pending); each 'Screening name – Clinical evaluation'. Pending (amber) or Completed (green) on the right; timeline circles all blue.","<b>Start screening</b> goes straight to Screening for this patient."],
  profile:["Edit details and photo (good to have 1).","Delete record, Program Coordinator only, with reason and audit log (good to have 2).","The journey is in View journey, so Edit stays short."]
};
const PARENT={clinicNew:"outreach",clinicEdit:"outreach",qSetup:"outreach",wz:"outreach",wzDone:"outreach",enroll:"register",regPage:"register",regDone:"register",scrForm:"screening",scrDone:"screening",evForm:"clinical",uForm:"udm",profile:"modify",patView:"modify"};
const SUBNAME={patView:"View journey",profile:"Edit",clinicNew:"Create / edit clinic",clinicEdit:"Edit clinic",qSetup:"Set up Questionnaire",wz:"Set up Questionnaire",wzDone:"Set up Questionnaire"};
function renderSide(){
  const items=SIDE[ui.scr]||SIDE.home;const par=PARENT[ui.scr]||ui.scr;
  const title=(MODS[par]?MODS[par].label:"Home")+(SUBNAME[ui.scr]?" › "+SUBNAME[ui.scr]:"");
  $("#side").innerHTML=`<h2>${esc(title)}: what changes on this screen</h2>
  <p class="lead">Built on your live screens. Layout stays. Specialty fits inside.</p>
  <ul class="newlist">${items.map(x=>`<li>${x}</li>`).join("")}</ul>
  <div class="callout"><b>Try this:</b> as <b>Program Coordinator</b>, open Outreach Clinic › Set up Questionnaire › Create new. Ophthalmology › Glaucoma › add 3 questions › Clinical level Yes › add clinical questions › Save. Add it to a clinic, then screen a patient with it.</div>`;
}
function renderDemo(){
  $("#demo").innerHTML=`<span><label for="d-h">Hospital</label><select id="d-h" data-demo="h">${S.hospitals.map(h=>opt(h.id,S.cur,h.name)).join("")}</select></span>
  <span><label for="d-r">Logged in as</label><select id="d-r" data-demo="r">${ROLES.map(r=>opt(r,S.role)).join("")}</select></span>`;
}

// ═════════════ CURABLE ADMIN CONSOLE ═════════════
const ASECS=[["specs","Specialties","Add, edit, retire, pricing"],["forms","Screening forms","Questions, referral rules, evaluation"],["hosp","Hospitals","Questionnaires, registration, import"],["dash","Program dashboard","Coverage across all clinics"],["audit","Audit log","Edits and deletions"]];
function renderAdmin(){
  $("#anav").innerHTML=ASECS.map(s=>`<button data-act="asec" data-arg="${s[0]}" aria-pressed="${A.sec===s[0]}">${s[1]}<small>${s[2]}</small></button>`).join("");
  const f={specs:aSpecs,forms:aForms,hosp:aHosp,dash:aDash,audit:aAudit}[A.sec];
  $("#apanel").innerHTML=f()+(A.msg?"":"");
}
function msgHtml(){return A.msg?`<div class="msg ${A.msgE?"e":""}">${esc(A.msg)}</div>`:"";}
function aSpecs(){
  return `<div class="card"><h3>Specialties</h3><p class="hint">Roadmap D. A retired specialty disappears from new screenings everywhere. Past records stay. Prices are sample figures for planning.</p>
  <div class="tbl-wrap"><table class="t"><thead><tr><th>Specialty</th><th>Status</th><th class="n">Screening types</th><th class="n">Hospitals</th><th>₹ per screening</th><th>₹ licence / month</th><th></th></tr></thead><tbody>
  ${S.specs.map(s=>`<tr><td><input type="text" data-sp="${s.id}" data-k="name" value="${esc(s.name)}" aria-label="Name"></td><td><span class="st ${s.active?"on":"off"}">${s.active?"Active":"Retired"}</span></td>
   <td class="n">${Object.values(S.types).filter(t=>t.spec===s.id).length}</td><td class="n">${S.hospitals.filter(h=>liveSpecs(h).includes(s.id)).length}</td>
   <td><input type="number" data-sp="${s.id}" data-k="price" value="${s.price}" aria-label="Price per screening"></td><td><input type="number" data-sp="${s.id}" data-k="licence" value="${s.licence}" aria-label="Licence per month"></td>
   <td><button class="btn sm" data-act="spToggle" data-arg="${s.id}">${s.active?"Retire":"Restore"}</button></td></tr>`).join("")}</tbody></table></div>
  <div class="frow" style="margin-top:12px"><div class="in"><label for="ns-name">New specialty</label><input id="ns-name" type="text" placeholder="e.g. Ophthalmology"></div><div class="in"><label for="ns-price">₹ per screening</label><input id="ns-price" type="number" value="20"></div><div class="in"><label for="ns-lic">₹ licence / month</label><input id="ns-lic" type="number" value="5000"></div><div><button class="btn pri" data-act="spAdd">Add specialty</button></div></div>${msgHtml()}</div>`;
}
function aForms(){
  const t=T(A.type);if(!t){A.type=Object.keys(S.types)[0];return aForms();}
  const groups={};Object.keys(S.types).forEach(k=>{(groups[S.types[k].spec]=groups[S.types[k].spec]||[]).push(k);});
  const fl=(arr,kind)=>`<ul class="flist">${arr.map((f,i)=>`<li><span>${esc(f.label)}${f.req?' <span class="req">*</span>':""}<br><small>${f.type}${f.opts?" · "+esc(f.opts.join(", ")):""}</small></span><button class="btn sm" data-act="fDel" data-k="${kind}" data-arg="${i}">Remove</button></li>`).join("")}</ul>`;
  const addF=kind=>`<div class="frow"><div class="in"><label for="af-${kind}-l">Question</label><input id="af-${kind}-l" type="text" placeholder="e.g. Weight loss in last 3 months"></div>
   <div class="in"><label for="af-${kind}-t">Answer type</label><select id="af-${kind}-t"><option value="select">Dropdown</option><option value="multi">Multi-select</option><option value="number">Number</option><option value="text">Text</option></select></div>
   <div class="in"><label for="af-${kind}-o">Options (comma separated)</label><input id="af-${kind}-o" type="text" placeholder="No, Yes"></div>
   <div><button class="btn pri" data-act="fAdd" data-k="${kind}">Add</button></div></div>`;
  const rf=t.fields.filter(f=>f.type!=="text");
  return `<div class="card"><h3>Screening forms</h3><p class="hint">Roadmap A and D. One template per screening type. The same form engine draws it in the Screening and Clinical Evaluation screens for every hospital. Changes create a new version; old records keep theirs.</p>
   <div class="frow"><div class="in"><label for="tsel">Screening type</label><select id="tsel" data-ach="type">${Object.keys(groups).map(s=>`<optgroup label="${esc(spec(s).name)}">${groups[s].map(k=>opt(k,A.type,S.types[k].name+" · v"+S.types[k].v)).join("")}</optgroup>`).join("")}</select></div>
   <div class="in"><label for="nt-name">New screening type</label><input id="nt-name" type="text" placeholder="e.g. Thyroid Screening"></div>
   <div class="in"><label for="nt-spec">In specialty</label><select id="nt-spec">${S.specs.filter(s=>s.active).map(s=>opt(s.id,"",s.name)).join("")}</select></div>
   <div><button class="btn" data-act="tAdd">Create</button></div></div>${msgHtml()}</div>
  <div class="card"><h3>${esc(t.name)} · screening questions <span class="st on">v${t.v}</span></h3><p class="hint">Asked after "${esc(t.gate)}: Yes". Reasons if No or Not now: ${esc((t.reasons||DEF_REASONS).join(", "))}.</p>${fl(t.fields,"fields")}${addF("fields")}</div>
  <div class="card"><h3>Referral rules</h3><p class="hint">The system suggests Referral = Yes when any rule is met${t.score?`, or when the ${esc(t.score.label)} reaches ${t.score.min}`:""}. Needs clinical panel sign-off.</p>
   <ul class="flist">${(t.rule||[]).map((c,i)=>`<li><span>Refer if ${esc(ruleText(t,c))}</span><button class="btn sm" data-act="rDel" data-arg="${i}">Remove</button></li>`).join("")||"<li><small>No rules yet</small></li>"}</ul>
   <div class="frow"><div class="in"><label for="rr-f">Question</label><select id="rr-f">${rf.map(f=>opt(f.id,"",f.label)).join("")}</select></div>
   <div class="in"><label for="rr-v">Refer if answer is (comma separated) or number at least</label><input id="rr-v" type="text" placeholder="e.g. Yes  or  140"></div>
   <div><button class="btn pri" data-act="rAdd">Add rule</button></div></div></div>
  <div class="card"><h3>Clinical evaluation criteria</h3><p class="hint">What the doctor records for ${esc(t.name)} in Clinical Evaluation.</p>${fl(t.eval,"eval")}${addF("eval")}</div>
  <div class="card"><details><summary>View template as stored (for the tech team)</summary><pre class="json">${esc(JSON.stringify(t,null,2))}</pre></details></div>`;
}
function aHosp(){
  const h=H(A.hosp)||S.hospitals[0];A.hosp=h.id;
  return `<div class="card"><h3>Hospitals</h3><div class="checks">${S.hospitals.map(x=>`<button class="btn ${x.id===h.id?"pri":""}" data-act="ahs" data-arg="${x.id}">${esc(x.name)}</button>`).join("")}</div>
   <div class="frow" style="margin-top:12px"><div class="in"><label for="nh-name">New hospital name</label><input id="nh-name" type="text" placeholder="e.g. Sunrise Women's Clinic"></div><div class="in"><label for="nh-code">Code</label><input id="nh-code" type="text" maxlength="4" placeholder="SW"></div><div><button class="btn" data-act="hAdd">Add hospital</button></div></div>${msgHtml()}</div>
  <div class="card"><h3>${esc(h.name)} · questionnaires in use</h3><p class="hint">Made by the hospital's Program Coordinator in Outreach Clinic › Set up Questionnaire, or taken from Curable's library. Review new ones with the clinical panel.</p>
   <ul class="flist">${liveTypes(h).map(k=>`<li><span>${esc(tname(k))} <small>· ${esc(spec(T(k).spec).name)}</small><br><small>${T(k).owner?"Made by hospital":"Curable library"} · v${T(k).v} · ${T(k).fields.length} questions · clinical level ${T(k).clinical===false?"No":"Yes"}</small></span></li>`).join("")||"<li><small>None yet</small></li>"}</ul></div>
  <div class="card"><h3>Registration questions</h3><p class="hint">Roadmap E1. Asked first, before General Details.</p>
   <ul class="flist">${h.hq.map((q,i)=>`<li><span>${esc(q.label)}${q.req?' <span class="req">*</span>':""}<br><small>${q.opts?esc(q.opts.join(", ")):"Text"}</small></span><button class="btn sm" data-act="hqDel" data-arg="${i}">Remove</button></li>`).join("")||"<li><small>No hospital questions</small></li>"}</ul>
   <div class="frow"><div class="in"><label for="hq-l">Question</label><input id="hq-l" type="text" placeholder="e.g. Employee ID"></div><div class="in"><label for="hq-o">Options (blank for text answer)</label><input id="hq-o" type="text" placeholder="Option 1, Option 2"></div><div><button class="btn pri" data-act="hqAdd">Add question</button></div></div></div>
  <div class="card"><h3>Upload past data</h3><p class="hint">Roadmap E. Paste rows from Excel as CSV, or choose a .csv file. Columns: name, mobile, gender (F/M), age, address, screening, date (YYYY-MM-DD), referral (Yes/No). Patients are added under the first clinic.</p>
   <div class="in"><label for="imp">CSV</label><textarea id="imp">name,mobile,gender,age,address,screening,date,referral
Saroja P,9876501234,F,52,Adayar,${h.types[0]||""},2025-08-14,No
Kannan R,9876505678,M,58,Guindy,${h.types[1]||h.types[0]||""},2025-09-02,Yes</textarea></div>
   <div class="btn-row"><button class="btn pri" data-act="imp">Import</button><label class="btn" style="cursor:pointer">Choose .csv file<input type="file" accept=".csv,text/csv" data-act="impFile" style="display:none"></label></div><div id="impmsg"></div></div>`;
}
function aDash(){
  const act=S.specs.filter(s=>s.active);
  const cnt=(h,s)=>{let n=0;h.patients.forEach(p=>p.recs.forEach(r=>{if(r.status==="done"&&T(r.type)&&T(r.type).spec===s)n++;}));return n;};
  const cov=s=>{let cl=0,sc=0,rf=0,ev=0;S.hospitals.forEach(h=>{cl+=h.clinics.filter(c=>c.types.some(t=>T(t)&&T(t).spec===s)).length;h.patients.forEach(p=>p.recs.forEach(r=>{if(r.status!=="done"||!T(r.type)||T(r.type).spec!==s)return;sc++;if(r.referral==="Yes"){rf++;if(r.ev&&r.ev.status==="done")ev++;}}));});return {cl,sc,rf,ev};};
  return `<div class="card"><h3>Program dashboard · coverage by specialty</h3><p class="hint">Roadmap C. Across all hospitals and clinics. Live from the prototype's data.</p>
   <div class="tbl-wrap"><table class="t"><thead><tr><th>Specialty</th><th class="n">Clinics offering</th><th class="n">Screened</th><th class="n">Referred</th><th class="n">Evaluated</th><th class="n">Referral rate</th></tr></thead><tbody>
   ${act.map(s=>{const c=cov(s.id);return `<tr><td>${esc(s.name)}</td><td class="n">${c.cl}</td><td class="n">${c.sc}</td><td class="n">${c.rf}</td><td class="n">${c.ev}</td><td class="n">${c.sc?Math.round(c.rf/c.sc*100)+"%":"—"}</td></tr>`;}).join("")}</tbody></table></div></div>
  <div class="card"><h3>Hospitals × specialties · screenings and estimated billing</h3><p class="hint">Roadmap D pricing in action: screenings × price per screening + licence per active specialty. Sample prices.</p>
   <div class="tbl-wrap"><table class="t"><thead><tr><th>Hospital</th>${act.map(s=>`<th class="n">${esc(s.name)}</th>`).join("")}<th class="n">Est. ₹ / month</th></tr></thead><tbody>
   ${S.hospitals.map(h=>{let bill=0;const cells=act.map(s=>{const n=cnt(h,s.id);const on=liveSpecs(h).includes(s.id);if(on)bill+=s.licence+n*s.price;return `<td class="n">${on?n:"·"}</td>`;}).join("");return `<tr><td>${esc(h.name)}</td>${cells}<td class="n">${bill.toLocaleString("en-IN")}</td></tr>`;}).join("")}</tbody></table></div></div>`;
}
function aAudit(){
  return `<div class="card"><h3>Audit log</h3><p class="hint">Profile edits, photo updates and deletions made in this prototype.</p>
  <ul class="flist">${S.audit.map(a=>`<li><span>${esc(a.what)}<br><small>${esc(a.when)} · ${esc(a.who)} · ${esc(a.hosp)}</small></span></li>`).join("")||"<li><small>Nothing yet. Edit or delete a patient in Modify Patient Information.</small></li>"}</ul></div>`;
}

// ═════════════ ROUTING ═════════════
const VIEWS=["staff","admin","roadmap"];
function route(){let v=(location.hash||"").replace("#","");if(!VIEWS.includes(v))v="staff";
  VIEWS.forEach(x=>{$("#v-"+x).classList.toggle("on",x===v);$("#tab-"+x).setAttribute("aria-selected",x===v);});
  if(v==="staff"){renderDemo();renderPhone();}if(v==="admin"){A.msg="";renderAdmin();}}
function go(v){if(location.hash!=="#"+v)location.hash=v;else route();window.scrollTo(0,0);}
window.addEventListener("hashchange",route);

// ═════════════ ACTIONS ═════════════
function nav(scr){Object.assign(ui,{scr,menu:false,hist:null,fErr:"",okMsg:""});renderPhone();const b=$("#phone .ph-body");if(b)b.scrollTop=0;}
function startRec(h,pid,type){
  const p=h.patients.find(x=>x.id===pid);const draft=p.recs.find(r=>r.type===type&&r.status==="draft");
  ui.rec={pid,type,rid:draft?draft.id:null};ui.ans=draft?JSON.parse(JSON.stringify(draft.ans)):{};
  if(draft&&draft.referral)ui.ans.referral=draft.referral;ui.refManual=!!(draft&&draft.referral);nav("scrForm");
}
function saveRec(h,status){
  const p=h.patients.find(x=>x.id===ui.rec.pid);const t=T(ui.rec.type);
  const ans=Object.assign({},ui.ans);const referral=ans.referral||null;delete ans.referral;
  let r=ui.rec.rid?p.recs.find(x=>x.id===ui.rec.rid):null;
  if(!r){r={id:"r"+Date.now().toString(36),type:ui.rec.type,date:today(),v:t.v};p.recs.push(r);ui.rec.rid=r.id;}
  r.ans=ans;r.status=status;r.referral=status==="done"?referral:(referral||null);r.v=t.v;
  if(status==="done"&&referral==="Yes")r.ev={status:"pending",ans:{}};
  save();ui.rec.status=status;ui.rec.referral=r.referral;Object.assign(ui.rec,{status:r.status,referral:r.referral,reason:ans.reason||""});
}
function parseCSV(text){return text.trim().split(/\r?\n/).map(l=>l.split(",").map(x=>x.trim()));}
function doImport(text){
  const h=H(A.hosp);const rows=parseCSV(text);if(rows.length<2)return {ok:0,bad:["No data rows found."]};
  const hd=rows[0].map(x=>x.toLowerCase());const need=["name","mobile","gender","age"];
  const miss=need.filter(n=>!hd.includes(n));if(miss.length)return {ok:0,bad:["Missing columns: "+miss.join(", ")]};
  const ix=n=>hd.indexOf(n);let ok=0;const bad=[];
  rows.slice(1).forEach((r,i)=>{const g=(r[ix("gender")]||"").toUpperCase();const mob=r[ix("mobile")]||"";const age=Number(r[ix("age")]);
    if(!r[ix("name")]||!/^[6-9]\d{9}$/.test(mob)||!["F","M"].includes(g)||!age){bad.push("Row "+(i+2)+": check name, mobile, gender or age");return;}
    if(h.patients.some(p=>p.mobile===mob&&p.name.toLowerCase()===r[ix("name")].toLowerCase())){bad.push("Row "+(i+2)+": already exists, skipped");return;}
    const p=P(r[ix("name")],g,age,mob,ix("address")>=0?r[ix("address")]:"",h.clinics[0]?h.clinics[0].id:"",[]);
    const tp=ix("screening")>=0?r[ix("screening")]:"";
    if(tp&&T(tp)){const ref=ix("referral")>=0&&/^y/i.test(r[ix("referral")]||"")?"Yes":"No";p.recs.push(R(tp,(ix("date")>=0&&r[ix("date")])||today(),"done",{gate:"Yes",imported:"Yes"},ref,ref==="Yes"?{status:"pending",ans:{}}:null));}
    if(p.recs.length)p.regDate=p.recs[0].date;h.patients.push(p);ok++;});
  save();return {ok,bad};
}
function shrinkPhoto(file,cb){const rd=new FileReader();rd.onload=()=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");const s=160;c.width=s;c.height=s;const x=c.getContext("2d");const m=Math.min(img.width,img.height);x.drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,s,s);cb(c.toDataURL("image/jpeg",.8));};img.src=rd.result;};rd.readAsDataURL(file);}

document.addEventListener("click",e=>{
  const t=e.target.closest("[data-act]");if(!t)return;
  const act=t.dataset.act,arg=t.dataset.arg,h=H();
  if(["homeq","photo","impFile","uActive","enrConsent"].includes(act))return;
  if(t.tagName==="A")e.preventDefault();
  switch(act){
    case "go":go(arg);break;
    case "menu":ui.menu=true;renderPhone();break;
    case "menuX":ui.menu=false;renderPhone();break;
    case "histOpen":ui.hist=arg;rerender();break;
    case "histClose":ui.hist=null;rerender();break;
    case "home":ui=ui0();renderPhone();break;
    case "tile":{const keepRep=ui.rep;ui=ui0();ui.rep=keepRep;
      if(arg==="udm"){nav("udm");break;}nav(arg);break;}
    case "adv":ui.adv=!ui.adv;rerender();break;
    // outreach
    case "cNew":ui.cf={start:today(),types:[]};ui.cfOpen={};ui.cfEdit=null;ui.cErr="";nav("clinicNew");break;
    case "cEditList":nav("clinicEdit");break;
    case "treeTog":ui.cfOpen[arg]=!ui.cfOpen[arg];rerender();break;
    case "cEdit":{const c=clinicOf(h,arg);ui.cf=JSON.parse(JSON.stringify(c));ui.cfOpen={};c.types.forEach(t=>{if(T(t))ui.cfOpen[T(t).spec]=1;});ui.cfEdit=c.id;ui.cErr="";nav("clinicNew");break;}
    case "wzNew":ui.wz=newWz();ui.wzErr="";nav("wz");break;
    case "wzEdit":ui.wz=wzLoad(arg);ui.wzErr="";nav("wz");break;
    case "wzSpec":Object.assign(ui.wz,{spec:arg,specNew:false,base:null});ui.wzErr="";rerender();break;
    case "wzSpecNew":Object.assign(ui.wz,{specNew:true,spec:"",base:null});ui.wzErr="";rerender();setTimeout(()=>{const i=$("#wz-sn");if(i)i.focus();},0);break;
    case "wzBase":{const t2=T(arg);const w=ui.wz;w.base=arg;w.sub="";w.group=t2.group||"";w.gateLabel=t2.gate;w.reasons=(t2.reasons||DEF_REASONS).join("\n");w.gender=tGender(t2);w.ageMin=t2.ageMin||"";w.ageMax=t2.ageMax||"";w.q=t2.fields.map(fieldToQ);w.clinical=t2.clinical===false?"No":"Yes";w.cq=(t2.eval||[]).map(fieldToQ);if(!w.cq.length)w.cq=[{label:"",kind:"one",opts:""}];ui.wzErr="";rerender();break;}
    case "wzGender":ui.wz.gender=t.dataset.v;rerender();break;
    case "wzClin":ui.wz.clinical=t.dataset.v;ui.wzErr="";rerender();break;
    case "wqAdd":ui.wz[arg].push({label:"",kind:arg==="q"?"yn":"one",opts:""});rerender();break;
    case "wqDel":ui.wz[t.dataset.ns].splice(Number(arg),1);rerender();break;
    case "wqUp":{const l=ui.wz[t.dataset.ns];const i=Number(arg);l.splice(i-1,0,l.splice(i,1)[0]);rerender();break;}
    case "wqKind":ui.wz[t.dataset.ns][Number(arg)].kind=t.dataset.v;rerender();break;
    case "wzBack":if(ui.wz.step){ui.wz.step--;ui.wzErr="";nav("wz");}else nav("qSetup");break;
    case "wzNext":{const w=ui.wz;const key=wzSteps()[w.step];let err="";
      if(key==="spec"){if(w.specNew){const n=(w.specNewName||"").trim();if(!n)err="Type the specialty name.";else if(S.specs.some(x=>x.name.toLowerCase()===n.toLowerCase()&&x.active)){const ex=S.specs.find(x=>x.name.toLowerCase()===n.toLowerCase());w.specNew=false;w.spec=ex.id;}}else if(!w.spec)err="Pick a specialty.";}
      if(key==="sub"&&!w.base&&!(w.sub||"").trim())err="Pick a screening or type a new name.";
      if(key==="sub"&&!err){const a1=w.ageMin===""?null:Number(w.ageMin),a2=w.ageMax===""?null:Number(w.ageMax);
        if((a1!==null&&(isNaN(a1)||a1<0||a1>120))||(a2!==null&&(isNaN(a2)||a2<0||a2>120)))err="Age must be between 0 and 120.";
        else if(a1!==null&&a2!==null&&a1>a2)err="'From' age must be less than 'To' age.";}
      if(key==="sub"&&!w.base&&Object.values(S.types).some(x=>x.name.toLowerCase()===w.title().toLowerCase()&&(!x.owner||x.owner===h.id)))err="That screening already exists. Pick it from the list to change it.";
      if(key==="q")err=!(w.gateLabel||"").trim()?"Type the first question.":wzCheck(w.q);
      if(key==="clin"&&!w.clinical)err="Choose Yes or No.";
      if(key==="cq")err=wzCheck(w.cq);
      if(err){ui.wzErr=err;rerender();break;}ui.wzErr="";w.step++;if(wzSteps()[w.step]==="q"&&!w.gateLabel)w.gateLabel=w.gate();nav("wz");break;}
    case "wzSave":{const w=ui.wz;let sp=w.spec;
      if(w.specNew){sp="s"+Date.now().toString(36);S.specs.push({id:sp,name:w.specNewName.trim(),active:true,price:20,licence:0,by:h.name});}
      const fields=w.q.map((q,i)=>qToField(q,i,"q"));const ev=w.clinical==="Yes"?w.cq.map((q,i)=>qToField(q,i,"c")):[];
      let id;
      if(w.base&&T(w.base).owner===h.id){id=w.base;const t2=T(id);t2.fields=fields;t2.eval=ev;t2.gate=w.finalGate();t2.reasons=w.finalReasons();t2.clinical=w.clinical==="Yes";Object.assign(t2,whoFor(w));t2.rule=(t2.rule||[]).filter(c=>fields.some(f=>f.id===c.f));t2.v++;}
      else{id="h"+Date.now().toString(36);const b=w.base?T(w.base):null;
        S.types[id]={name:w.title(),spec:sp,v:b?b.v+1:1,gate:w.finalGate(),reasons:w.finalReasons(),regFields:b&&b.regFields?b.regFields.slice():undefined,
          fields,...whoFor(w),rule:b?(b.rule||[]).filter(c=>fields.some(f=>f.id===c.f)):[],score:b&&b.score&&Object.keys(b.score.pts).every(k=>fields.some(f=>f.id===k))?b.score:undefined,clinical:w.clinical==="Yes",eval:ev,owner:h.id,from:w.base||undefined};
        if(w.base){h.types=h.types.map(k=>k===w.base?id:k);h.clinics.forEach(c=>c.types=c.types.map(k=>k===w.base?id:k));}
        if(!h.types.includes(id))h.types.push(id);}
      if(!h.specs.includes(sp))h.specs.push(sp);
      audit("Saved questionnaire "+T(id).name+" (v"+T(id).v+")");save();ui.wzSaved=T(id).name;ui.wz=null;nav("wzDone");break;}
    case "qSetup":ui.okMsg="";ui.qErr="";nav("qSetup");break;
    case "reqSpec":S.requests.push({id:"q"+Date.now().toString(36),hosp:h.id,kind:"spec",spec:arg,text:"Activate "+spec(arg).name,by:S.role,when:today(),status:"pending"});save();ui.okMsg="Request sent to Curable.";rerender();break;
    case "reqForm":{const x=$("#fr-x").value.trim(),k=$("#fr-t").value;if(!x||!k){ui.okMsg="";break;}S.requests.push({id:"q"+Date.now().toString(36),hosp:h.id,kind:"form",type:k,text:x,by:S.role,when:today(),status:"pending"});save();ui.okMsg="Suggestion sent to Curable's clinical panel.";rerender();break;}
    case "hqAddP":{const l=$("#nq-l").value.trim(),ty=$("#nq-t").value,o=$("#nq-o").value.split(",").map(x=>x.trim()).filter(Boolean),rq=$("#nq-r").checked;
      if(!l){ui.qErr="Enter the question.";rerender();break;}if(ty==="select"&&o.length<2){ui.qErr="Give at least two options for a dropdown.";rerender();break;}
      h.hq.push(ty==="select"?{id:"hq"+Date.now().toString(36),label:l,type:"select",opts:o,req:rq}:{id:"hq"+Date.now().toString(36),label:l,type:ty,req:rq});ui.qErr="";ui.okMsg="";audit("Added registration question: "+l);save();rerender();break;}
    case "hqDelP":{const q=h.hq.splice(Number(arg),1)[0];audit("Removed registration question: "+q.label);save();rerender();break;}
    case "hqUp":{const i=Number(arg);const q=h.hq.splice(i,1)[0];h.hq.splice(i-1,0,q);save();rerender();break;}
    case "cSave":{const c=ui.cf;const pin=PINCODES[c.pincode];
      if(!c.name||!pin||!c.village||!c.start){ui.cErr=!pin&&c.pincode?"Pincode not in the master. Try 600042, 603112, 625020 or 631501.":"Fill all * fields.";rerender();break;}
      if(!(c.types||[]).length){ui.cErr="Pick at least one screening.";rerender();break;}
      if(ui.cfEdit){const cl=clinicOf(h,ui.cfEdit);const removed=cl.types.filter(k=>!c.types.includes(k));
        const busy=removed.filter(k=>h.patients.some(p=>p.clinic===cl.id&&p.recs.some(r=>r.type===k&&r.status==="draft")));
        if(busy.length){ui.cErr="Cannot remove "+busy.map(tname).join(", ")+": unfinished screenings saved at this clinic. Finish them first.";rerender();break;}
        Object.assign(cl,{name:c.name,pincode:c.pincode,state:pin.state,district:pin.district,taluk:pin.taluk,village:c.village,start:c.start,end:c.end||"",types:c.types.slice()});audit("Edited clinic "+cl.name+" ("+cl.id+")");}
      else h.clinics.push({id:cid7(),name:c.name,pincode:c.pincode,state:pin.state,district:pin.district,taluk:pin.taluk,village:c.village,start:c.start,end:c.end||"",types:c.types.slice()});
      ui.cfEdit=null;save();nav("outreach");break;}
    // registration
    case "pickClinic":ui.clinicSel=arg;rerender();break;
    case "startReg":ui.enr={};ui.eErr="";nav("enroll");break;
    case "enrSave":{const e2=ui.enr;
      const ag=enrAge(e2);if(e2.dob&&ag===null){ui.eErr="Date of birth can't be in the future.";rerender();break;}
      if(!e2.name||!e2.mobile||!e2.g||ag===null){ui.eErr="All * are mandatory fields.";rerender();break;}
      if(ag>120){ui.eErr="Check the age.";rerender();break;}
      if(ag<CHILD_AGE&&!(e2.guardian||"").trim()){ui.eErr="Enter the parent or guardian name.";rerender();break;}
      if(ag<CHILD_AGE&&!e2.consent){ui.eErr="Parent or guardian consent is needed for a child.";rerender();break;}
      if(!/^[6-9]\d{9}$/.test(e2.mobile)){ui.eErr="Mobile number must be 10 digits starting with 6 to 9.";rerender();break;}
      if(e2.street&&!/^\d{3}$/.test(e2.street)){ui.eErr="Street ID must be a 3 digit number.";rerender();break;}
      const p=P(e2.name.trim(),e2.g[0],ag,e2.mobile,e2.address||"",ui.clinicSel,[]);p.street=e2.street||"";p.regDate=today();
      if(e2.dob)p.dob=e2.dob;if(ag<CHILD_AGE){p.guardian=e2.guardian.trim();p.consent=true;}
      h.patients.push(p);save();ui.regP=p;ui.step=0;ui.rErr="";if(regPages(h,p).length)nav("regPage");else nav("regDone");break;}
    case "regNext":{const pages=regPages(h,ui.regP);const pg=pages[ui.step];const m=missing(pg.fields,ui.regP.reg);
      if(m.length){ui.rErr="Please fill: "+m.join(", ");rerender();break;}
      if(pg.key==="women"){const mg=Number(ui.regP.reg.marriage);if(mg&&mg>=ui.regP.age){ui.rErr="Age at marriage must be less than age.";rerender();break;}}
      save();ui.rErr="";if(ui.step<pages.length-1){ui.step++;nav("regPage");}else nav("regDone");break;}
    case "regBack":if(ui.step){ui.step--;ui.rErr="";nav("regPage");}else{save();ui=ui0();renderPhone();}break;
    case "goScreen":{const pid=arg;ui=ui0();ui.selP=pid;ui.q=h.patients.find(x=>x.id===pid).name;nav("screening");break;}
    // screening
    case "selP":{const now=Date.now();
      if(ui.lastTap&&ui.lastTap.id===arg&&now-ui.lastTap.t<400){ui.lastTap=null;ui.hist=arg;rerender();break;}
      ui.lastTap={id:arg,t:now};if(ui.selP!==arg){ui.selP=arg;ui.selT="";ui.fErr="";}rerender();break;}
    case "scrNext":{if(!ui.selT){ui.fErr="Select a screening.";rerender();break;}
      const p=h.patients.find(x=>x.id===ui.selP);ui.fErr="";startRec(h,p.id,ui.selT);break;}
    case "scrSave":if(!ui.ans.gate){ui.fErr="Select "+T(ui.rec.type).gate+" first.";rerender();break;}saveRec(h,"draft");nav("scrDone");break;
    case "scrFinish":{const tt=T(ui.rec.type);const a=ui.ans;
      if(!a.gate){ui.fErr="Select "+tt.gate+".";rerender();break;}
      if(a.gate!=="Yes"){if(!a.reason){ui.fErr="Select a reason.";rerender();break;}saveRec(h,"notdone");nav("scrDone");break;}
      const m=missing(tt.fields,a);if(tt.clinical!==false&&!a.referral)m.push("Referral");
      if(m.length){ui.fErr="Please fill: "+m.join(", ");rerender();break;}
      saveRec(h,"done");nav("scrDone");break;}
    case "pillv":{const st=t.dataset.ns==="prof"?{}:nsStore(t.dataset.ns);st[t.dataset.k]=t.dataset.v;if(t.dataset.ns==="enr"&&t.dataset.k==="g")st.g=t.dataset.v;rerender();break;}
    // clinical
    case "cefs":ui.cefs=arg;rerender();break;
    case "evOpen":{const p=h.patients.find(x=>x.id===arg);const r=p.recs.find(x=>x.id===t.dataset.r);ui.evRec={pid:arg,rid:r.id};ui.evAns=JSON.parse(JSON.stringify(r.ev.ans||{}));ui.evErr="";nav("evForm");break;}
    case "evSave":case "evFinish":{const p=h.patients.find(x=>x.id===ui.evRec.pid);const r=p.recs.find(x=>x.id===ui.evRec.rid);const tt=T(r.type);
      if(act==="evFinish"){const m=missing([{id:"exam",label:"Clinical Examination",req:true},...tt.eval],ui.evAns);if(m.length){ui.evErr="Cannot finish. Please fill: "+m.join(", ");rerender();break;}}
      r.ev={status:act==="evFinish"?"done":"draft",ans:JSON.parse(JSON.stringify(ui.evAns)),date:today()};save();ui.evRec=null;nav("clinical");break;}
    // users
    case "uNew":ui.uEdit="new";ui.uForm={specs:liveSpecs(h).slice(),active:true};ui.uErr="";nav("uForm");break;
    case "uEdit":ui.uEdit=Number(arg);ui.uForm=JSON.parse(JSON.stringify(h.users[ui.uEdit]));ui.uErr="";nav("uForm");break;
    case "uSave":{const u=ui.uForm;const m=missing([{id:"name",label:"Name",req:1},{id:"role",label:"Role",req:1},{id:"email",label:"Email ID",req:1},{id:"mobile",label:"Mobile",req:1},{id:"g",label:"Gender",req:1}],u);
      if(m.length){ui.uErr="Please fill: "+m.join(", ");rerender();break;}if(!(u.specs||[]).length){ui.uErr="Assign at least one specialty.";rerender();break;}
      if(!/^[6-9]\d{9}$/.test(u.mobile)){ui.uErr="Mobile number must be 10 digits.";rerender();break;}
      const rec={name:u.name,role:u.role,email:u.email,mobile:u.mobile,g:u.g,specs:u.specs.slice(),active:u.active!==false};
      if(ui.uEdit==="new")h.users.push(rec);else h.users[ui.uEdit]=rec;save();nav("udm");break;}
    // reports
    case "repShow":ui.rep.show=true;rerender();break;
    // modify
    case "modOpen":case "patEdit":ui.selP=arg;ui.delOpen=false;ui.profMsg="";nav("profile");break;
    case "patPick":ui.selP=ui.selP===arg?null:arg;rerender();break;
    case "patView":ui.selP=arg;nav("patView");break;
    case "profSave":{const p=h.patients.find(x=>x.id===ui.selP);const vals={};["name","mobile","age","address"].forEach(k=>{const el=$("#prof-"+k);if(el)vals[k]=el.value.trim();});
      if(!vals.name||!/^[6-9]\d{9}$/.test(vals.mobile)||!Number(vals.age)){ui.profMsg="";alertPhone("Check name, 10-digit mobile and age.");break;}
      const ch=Object.keys(vals).filter(k=>String(p[k])!==vals[k]);ch.forEach(k=>p[k]=k==="age"?Number(vals[k]):vals[k]);
      if(ch.length)audit("Edited "+ch.join(", ")+" for "+p.name+" ("+p.id+")");save();ui.profMsg=ch.length?"Saved. Change recorded in audit log.":"No changes.";rerender();break;}
    case "delOpen":ui.delOpen=true;ui.delReason="";rerender();break;
    case "delX":ui.delOpen=false;rerender();break;
    case "delGo":{if(!ui.delReason){alertPhone("Select a reason.");break;}const i=h.patients.findIndex(x=>x.id===ui.selP);const p=h.patients[i];
      audit("Deleted "+p.name+" ("+p.id+"). Reason: "+ui.delReason);h.patients.splice(i,1);save();ui=ui0();nav("modify");break;}
    // admin
    case "asec":A.sec=arg;A.msg="";renderAdmin();break;
    case "spToggle":{const s=spec(arg);s.active=!s.active;save();A.msg=s.name+(s.active?" restored.":" retired. Hidden from new screenings; past records kept.");A.msgE=false;renderAdmin();break;}
    case "spAdd":{const n=$("#ns-name").value.trim();if(!n){A.msg="Enter a specialty name.";A.msgE=true;renderAdmin();break;}
      if(S.specs.some(s=>s.name.toLowerCase()===n.toLowerCase())){A.msg="That specialty already exists.";A.msgE=true;renderAdmin();break;}
      S.specs.push({id:"s"+Date.now().toString(36),name:n,active:true,price:Number($("#ns-price").value)||0,licence:Number($("#ns-lic").value)||0});save();A.msg=n+" added. Next: create its screening forms.";A.msgE=false;renderAdmin();break;}
    case "tAdd":{const n=$("#nt-name").value.trim();const sp=$("#nt-spec").value;if(!n){A.msg="Enter a name for the screening type.";A.msgE=true;renderAdmin();break;}
      const id="t"+Date.now().toString(36);S.types[id]={name:n,spec:sp,v:1,gate:n.replace(/ Screening$/i,"")+" Examination",reasons:DEF_REASONS.slice(),fields:[],rule:[],eval:[txt("uhid","UHID"),sel("plan","Treatment Plan",["Follow-up","Treat","Refer"])]};
      A.type=id;save();A.msg=n+" created. Add its questions below.";A.msgE=false;renderAdmin();break;}
    case "fAdd":{const k=t.dataset.k;const l=$("#af-"+k+"-l").value.trim(),ty=$("#af-"+k+"-t").value,o=$("#af-"+k+"-o").value.split(",").map(x=>x.trim()).filter(Boolean);
      if(!l){A.msg="Enter the question.";A.msgE=true;renderAdmin();break;}if((ty==="select"||ty==="multi")&&o.length<2){A.msg="Give at least two options.";A.msgE=true;renderAdmin();break;}
      const tt=T(A.type);const f={id:"q"+Date.now().toString(36),label:l,type:ty,req:ty!=="text"};if(o.length&&(ty==="select"||ty==="multi"))f.opts=o;tt[k].push(f);tt.v++;save();A.msg="Added. "+tt.name+" is now v"+tt.v+".";A.msgE=false;renderAdmin();break;}
    case "fDel":{const tt=T(A.type);const k=t.dataset.k;const f=tt[k][Number(arg)];tt[k].splice(Number(arg),1);if(k==="fields")tt.rule=(tt.rule||[]).filter(c=>c.f!==f.id);tt.v++;save();A.msg="Removed. "+tt.name+" is now v"+tt.v+".";A.msgE=false;renderAdmin();break;}
    case "rAdd":{const tt=T(A.type);const fid=$("#rr-f").value;const f=tt.fields.find(x=>x.id===fid);const raw=$("#rr-v").value.trim();if(!f||!raw){A.msg="Pick a question and a value.";A.msgE=true;renderAdmin();break;}
      let c;if(f.type==="number"){if(isNaN(Number(raw))){A.msg="Enter a number for this question.";A.msgE=true;renderAdmin();break;}c={f:fid,op:"gte",v:Number(raw)};}
      else{const vals=raw.split(",").map(x=>x.trim()).filter(x=>f.opts.includes(x));if(!vals.length){A.msg="Value must match an option: "+f.opts.join(", ");A.msgE=true;renderAdmin();break;}c={f:fid,op:"in",v:vals};}
      tt.rule=tt.rule||[];tt.rule.push(c);tt.v++;save();A.msg="Rule added. "+tt.name+" is now v"+tt.v+".";A.msgE=false;renderAdmin();break;}
    case "rDel":{const tt=T(A.type);tt.rule.splice(Number(arg),1);tt.v++;save();A.msg="Rule removed.";A.msgE=false;renderAdmin();break;}
    case "ahs":A.hosp=arg;A.msg="";renderAdmin();break;
    case "hAdd":{const n=$("#nh-name").value.trim(),c=$("#nh-code").value.trim().toUpperCase();if(!n||!/^[A-Z]{2,4}$/.test(c)){A.msg="Enter a name and a 2 to 4 letter code.";A.msgE=true;renderAdmin();break;}
      if(S.hospitals.some(x=>x.code===c)){A.msg="Code already used.";A.msgE=true;renderAdmin();break;}
      const id=c.toLowerCase()+Date.now().toString(36).slice(-3);S.hospitals.push({id,name:n,code:c,specs:[],licensed:[],types:[],hq:[],clinics:[],users:[],patients:[]});A.hosp=id;save();A.msg=n+" added. Its Program Coordinator sets up questionnaires.";A.msgE=false;renderAdmin();break;}
    case "hqAdd":{const h2=H(A.hosp);const l=$("#hq-l").value.trim();const o=$("#hq-o").value.split(",").map(x=>x.trim()).filter(Boolean);if(!l)break;
      h2.hq.push(o.length>=2?{id:"hq"+Date.now().toString(36),label:l,type:"select",opts:o,req:true}:{id:"hq"+Date.now().toString(36),label:l,type:"text",req:false});save();renderAdmin();break;}
    case "hqDel":H(A.hosp).hq.splice(Number(arg),1);save();renderAdmin();break;
    case "rqOk":case "rqNo":{const r=S.requests.find(x=>x.id===arg);r.status=act==="rqOk"?(r.kind==="spec"?"approved":"accepted"):"declined";
      if(act==="rqOk"&&r.kind==="spec"){const h2=H(r.hosp);if(!h2.licensed.includes(r.spec))h2.licensed.push(r.spec);}
      save();A.msg=r.kind==="spec"&&act==="rqOk"?"Approved. The coordinator can now switch it on.":"Updated.";A.msgE=false;renderAdmin();break;}
    case "imp":{const r=doImport($("#imp").value);$("#impmsg").innerHTML=`<div class="msg ${r.ok?"":"e"}">${r.ok} patient(s) imported into ${esc(H(A.hosp).name)}.${r.bad.length?" "+esc(r.bad.join(". ")):""}</div>`;break;}
  }
});
function alertPhone(m){const b=$("#phone .ph-body");if(!b)return;let el=b.querySelector(".err.tmp");if(!el){el=document.createElement("div");el.className="err tmp";b.prepend(el);}el.textContent=m;b.scrollTop=0;}

document.addEventListener("input",e=>{
  const t=e.target,d=t.dataset;
  if(d.act==="homeq"){ui=ui0();ui.q=t.value;nav("screening");const i=$("#sq");if(i){i.focus();i.setSelectionRange(i.value.length,i.value.length);}return;}
  if(d.in==="q"){ui.q=t.value;const l=$("#plist");if(l){if(ui.scr==="modify")l.innerHTML=patientsList(matchPatients(H()));else if(ui.scr==="screening")l.innerHTML=matchPatients(H()).map(x=>pCard(x,"selP",x.id===ui.selP)).join("")||'<p class="meta">No patient found in this hospital.</p>';}
    if(ui.scr==="clinical"){rerender();const i=$("#sq");i.focus();i.setSelectionRange(i.value.length,i.value.length);}return;}
  if(d.in==="clinicQ"){ui.clinicQ=t.value;const q=t.value.toLowerCase();const h=H();$("#clist").innerHTML=clinicList(q?h.clinics.filter(c=>c.id.includes(q)||c.name.toLowerCase().includes(q)):h.clinics);return;}
  if(d.in==="pin"){ui.cf.pincode=t.value.trim();if(ui.cf.village&&!(PINCODES[ui.cf.pincode]||{villages:[]}).villages.includes(ui.cf.village))ui.cf.village="";$("#pinbox").innerHTML=pinFields(ui.cf,PINCODES[ui.cf.pincode]);return;}
  if(d.fld&&t.tagName==="INPUT"){nsStore(d.fld)[d.k]=t.value;if(d.fld==="scr")liveSuggest();return;}
  if(d.wq){ui.wz[d.wq][Number(d.i)][d.k]=t.value;return;}
  if(d.wzk){ui.wz[d.wzk]=t.value;if(d.wzk==="sub")ui.wz.base=null;return;}
  if(d.sp){const s=spec(d.sp);s[d.k]=d.k==="name"?t.value:Number(t.value)||0;save();return;}
});
function liveSuggest(){const h=H();if(ui.scr!=="scrForm")return;const t=T(ui.rec.type);const sg=suggest(t,ui.ans);
  if(sg&&!ui.refManual)ui.ans.referral=sg.ref;}
document.addEventListener("change",e=>{
  const t=e.target,d=t.dataset;const h=H();
  if(d.demo==="h"){S.cur=t.value;ui=ui0();save();renderPhone();return;}
  if(d.demo==="r"){S.role=t.value;save();renderPhone();return;}
  if(d.ch){ui[d.ch]=t.value;if(d.ch==="selT")ui.fErr="";rerender();return;}
  if(d.rp){ui.rep[d.rp]=t.value;rerender();return;}
  if(d.fld&&t.tagName==="SELECT"){const st=nsStore(d.fld);st[d.k]=t.value;
    if(d.fld==="scr"){if(d.k==="referral")ui.refManual=true;else liveSuggest();}
    rerender();return;}
  if(d.fld&&t.tagName==="INPUT"&&d.fld==="scr"){liveSuggest();rerender();return;}
  if(d.tree){const ids=d.tree.split("|");const cur=ui.cf.types||[];const all=ids.every(x=>cur.includes(x));ui.cf.types=all?cur.filter(x=>!ids.includes(x)):[...new Set(cur.concat(ids))];rerender();return;}
  if(d.fld==="enr"&&(d.k==="age"||d.k==="dob")){ui.enr[d.k]=t.value;rerender();return;}
  if(d.act==="enrConsent"){ui.enr.consent=t.checked;return;}
  if(d.mul){const st=nsStore(d.mul);let a=Array.isArray(st[d.k])?st[d.k]:[];
    if(t.checked){if(!a.includes(t.value))a.push(t.value);if(t.value==="None")a=["None"];else a=a.filter(x=>x!=="None");}else a=a.filter(x=>x!==t.value);
    st[d.k]=a;if(d.mul==="scr")liveSuggest();rerender();return;}
  if(d.act==="uActive"){ui.uForm.active=t.checked;return;}
  if(d.act==="photo"&&t.files&&t.files[0]){const p=h.patients.find(x=>x.id===ui.selP);shrinkPhoto(t.files[0],url=>{p.photo=url;audit("Updated photo for "+p.name+" ("+p.id+")");save();ui.profMsg="Photo updated.";rerender();});return;}
  if(d.act==="impFile"&&t.files&&t.files[0]){const rd=new FileReader();rd.onload=()=>{$("#imp").value=rd.result;};rd.readAsText(t.files[0]);return;}
  if(d.ach==="type"){A.type=t.value;A.msg="";renderAdmin();return;}
  if(d.pss){const s=d.pss;if(t.checked){if(!h.specs.includes(s))h.specs.push(s);Object.keys(S.types).filter(k=>S.types[k].spec===s).forEach(k=>{if(!h.types.includes(k))h.types.push(k);});ui.okMsg=spec(s).name+" switched on.";}
    else{h.specs=h.specs.filter(x=>x!==s);h.types=h.types.filter(k=>S.types[k].spec!==s);h.clinics.forEach(c=>c.types=c.types.filter(k=>h.types.includes(k)));ui.okMsg=spec(s).name+" switched off. Removed from clinics; past records kept.";}
    audit((t.checked?"Switched on ":"Switched off ")+spec(s).name);save();rerender();return;}
  if(d.pst){const k=d.pst;if(t.checked){if(!h.types.includes(k))h.types.push(k);}else{h.types=h.types.filter(x=>x!==k);h.clinics.forEach(c=>c.types=c.types.filter(x=>x!==k));}ui.okMsg="Saved.";save();rerender();return;}
  if(d.hl){const h2=H(A.hosp);const s=d.hl;if(t.checked){if(!h2.licensed.includes(s))h2.licensed.push(s);}else{h2.licensed=h2.licensed.filter(x=>x!==s);h2.specs=h2.specs.filter(x=>x!==s);h2.types=h2.types.filter(k=>S.types[k].spec!==s);h2.clinics.forEach(c=>c.types=c.types.filter(k=>h2.types.includes(k)));}save();renderAdmin();return;}
  if(d.hs){const h2=H(A.hosp);const s=d.hs;if(t.checked){if(!h2.specs.includes(s))h2.specs.push(s);Object.keys(S.types).filter(k=>S.types[k].spec===s).forEach(k=>{if(!h2.types.includes(k))h2.types.push(k);});}
    else{h2.specs=h2.specs.filter(x=>x!==s);h2.types=h2.types.filter(k=>S.types[k].spec!==s);h2.clinics.forEach(c=>c.types=c.types.filter(k=>h2.types.includes(k)));}save();renderAdmin();return;}
  if(d.ht){const h2=H(A.hosp);if(t.checked){if(!h2.types.includes(d.ht))h2.types.push(d.ht);}else{h2.types=h2.types.filter(k=>k!==d.ht);h2.clinics.forEach(c=>c.types=c.types.filter(k=>k!==d.ht));}save();return;}
});
// reset helper on roadmap page footer
window.resetDemo=function(){S=fresh();ui=ui0();save();route();};
route();
