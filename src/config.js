import tableauLinks from './tableau_links/links'

export const domain = process.env.API_URL;
export const TBALEAU_LINKS = tableauLinks[process.env.ENV_TYPE];

export const brandDetails = {
  Dysport: {
    link: TBALEAU_LINKS.PATIENT_SUMMARY.Dysport,
    height: "2600px",
  },
  Increlex: {
    link: TBALEAU_LINKS.PATIENT_SUMMARY.Increlex,
    height: "1300px",
  },
  Onivyde: {
    link: TBALEAU_LINKS.PATIENT_SUMMARY.Onivyde,
    height: "1385px",
  },
  "Somatuline ACRO": {
    link: TBALEAU_LINKS.PATIENT_SUMMARY.SomatulineACRO,
    height: "1500px",
  },
  "Somatuline NET": {
    link: TBALEAU_LINKS.PATIENT_SUMMARY.SomatulineNET,
    height: "1500px",
  },
  Tazverik:{
    link: TBALEAU_LINKS.PATIENT_SUMMARY.Tazverik,
    height: "1385px",
  }, 
  "Bylvay PFIC":{
    link: TBALEAU_LINKS.PATIENT_SUMMARY.BYLVAYPFIC,
    height: "1350px",
  }, 
  "Bylvay ALGS":{
    link: TBALEAU_LINKS.PATIENT_SUMMARY.BYLVAYALGS,
    height: "1350px",
  }, 
  Sohonos:{
    link: TBALEAU_LINKS.PATIENT_SUMMARY.SOHONOS,
    height: "1350px",
  }, 
};

export default {
  GET_BRAND_KPIS: domain + 'idea/brand/kpi/list',
  GET_BRANDS: domain + 'idea/user/brand/list',
  GET_USER_DASHBOARDS: domain + 'idea/user/dashboard',
  GET_USER_KPIS: domain + 'idea/user/kpi/list',
  SAVE_KPI_MAPPING: domain + 'idea/user/kpi/add',
  GET_USER_REPORTS: domain + "idea/data/tree",
  DOWNLOAD_REPORT: domain + "idea/file/download",
  GET_BOOKMARKS: domain + "idea/get/reports/bookmark",
  ADD_REMOVE_BOOKMARK: domain + "idea/reports/bookmark",
}
