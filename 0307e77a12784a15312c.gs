function getData() {
}
function init() {
}
function app() {
}
function showApp() {
}
function onOpen() {
}
function disableApp() {
}/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	!function() {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/data.js
const getData = () => {
  const data = PropertiesService.getUserProperties().getProperty('data');
  return data ? JSON.parse(data) : null;
};
const setData = data => {
  PropertiesService.getUserProperties().setProperty('data', JSON.stringify(data));
};
;// CONCATENATED MODULE: ./src/date.js
const getDate = (offsetDays = 0) => {
  const date = new Date();

  if (offsetDays) {
    date.setDate(date.getDate() + offsetDays);
  }

  return Utilities.formatDate(date, 'IST', 'dd-MM-yyyy');
};

const convertDate = ddmmyyyy => {
  const [dd, mm, yyyy] = ddmmyyyy.split('-');
  return new Date([mm, dd, yyyy].join('-'));
};

const compareMinDate = (apiDate, minDate) => {
  return convertDate(apiDate) >= new Date(`${minDate} 0:0:0:0`);
};
const compareMaxDate = (apiDate, maxDate) => {
  return convertDate(apiDate) <= new Date(`${maxDate} 0:0:0:0`);
};
;// CONCATENATED MODULE: ./src/centers.js
/* eslint-disable camelcase */

const findCenters = (response, formData) => {
  try {
    if (response.getResponseCode() === 200) {
      const {
        centers = []
      } = JSON.parse(response);
      return centers.map(({
        name,
        district_name,
        pincode,
        sessions
      }) => ({
        name,
        district_name,
        pincode,
        sessions: sessions.map(({
          date,
          available_capacity,
          min_age_limit,
          vaccine
        }) => {
          return {
            date,
            available_capacity,
            min_age_limit,
            vaccine
          };
        }).filter(({
          available_capacity
        }) => available_capacity !== 0 && /^\d+$/.test(String(available_capacity))).filter(({
          min_age_limit
        }) => {
          if (formData.age === '18') return min_age_limit === 18;
          if (formData.age === '45') return min_age_limit === 45;
          return true;
        }).filter(({
          vaccine
        }) => {
          if (!vaccine || formData.vaccine === 'any') return true;
          return formData.vaccine.toLowerCase() === vaccine.toLowerCase();
        }).filter(({
          date
        }) => compareMinDate(date, formData.start_date) && compareMaxDate(date, formData.end_date))
      })).filter(({
        sessions
      }) => sessions.length > 0);
    }
  } catch (f) {// do nothing
  }

  return [];
};
;// CONCATENATED MODULE: ./src/body.js
/* eslint-disable camelcase */
const getBody = centerByPincodes => {
  const body = [];
  let count = 0;
  centerByPincodes.forEach(pincodeCenter => pincodeCenter.forEach(center => {
    const {
      name,
      district_name,
      pincode,
      sessions
    } = center;
    body.push(`${name} (${district_name} ${pincode})`);
    count += 1;
    sessions.forEach(({
      date,
      available_capacity,
      min_age_limit,
      vaccine = ''
    }) => {
      body.push(`\t${available_capacity} ${vaccine} doses for ${min_age_limit}+ available on ${date}`);
    });
    body.push('');
  }));
  return {
    count,
    body: body.join('\n')
  };
};
;// CONCATENATED MODULE: ./src/footer.js
const footer = ['', 'Developed by TEAM7 (NCP)', ''].join('\n');
;// CONCATENATED MODULE: ./src/email.js


const sendEmail = (centers, email) => {
  const {
    length
  } = centers;

  if (length > 0) {
    const {
      count,
      body
    } = getBody(centers);
    const cachedBody = CacheService.getScriptCache().get('body') || '';

    if (count > 0 && cachedBody !== body) {
      MailApp.sendEmail(email, `Vaccines are available in ${count} centers`, body + footer, {
        name: 'CoWIN Vaccine Tracker',
        replyTo: 'sumeghanareddy2001@gmail.com'
      });
      CacheService.getScriptCache().put('body', body, 21600);
    }
  }
};
;// CONCATENATED MODULE: ./src/token.js
const token = 'aHR0cHM6Ly9xZmlweXBzZXZpLmV4ZWN1dGUtYXBpLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbS9jZW50ZXJz';
;// CONCATENATED MODULE: ./src/utils.js
let api = null;
const getAPI = token => {
  if (api !== null) return api;
  const decoded = Utilities.base64Decode(token, Utilities.Charset.UTF_8);
  api = Utilities.newBlob(decoded).getDataAsString();
  return api;
};
;// CONCATENATED MODULE: ./src/url.js


const getUrl = (pincode, date) => `${getAPI(token)}/${pincode}/${date}/${Date.now()}`;
;// CONCATENATED MODULE: ./src/proxy.js

const proxyRequests = (pincodes, date) => {
  const urlRequests = pincodes.map(pincode => ({
    url: getUrl(pincode, date),
    method: 'PATCH',
    muteHttpExceptions: true
  }));
  return UrlFetchApp.fetchAll(urlRequests);
};
;// CONCATENATED MODULE: ./src/requests.js
const API = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin';

const requests_getUrl = (pincode, date) => `${API}?pincode=${pincode}&date=${date}`;

const apiRequests = (pincodes, date) => {
  const urlRequests = pincodes.map(pincode => ({
    url: requests_getUrl(pincode, date),
    muteHttpExceptions: false
  }));
  return UrlFetchApp.fetchAll(urlRequests);
};
;// CONCATENATED MODULE: ./src/locations.js



const getLocations = pincode => {
  let data = [];
  const pincodes = pincode.split(/[,\s.:]/).filter(e => /^\d{6}$/.test(e)).slice(0, 5);
  if (pincodes.length === 0) return data;
  const date = getDate();

  try {
    data = apiRequests(pincodes, date);
  } catch (f) {
    data = proxyRequests(pincodes, date);
  }

  return data;
};
;// CONCATENATED MODULE: ./src/main.js
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const app = () => {
  try {
    if (MailApp.getRemainingDailyQuota() > 1) {
      const data = getData();

      if (data) {
        const {
          pincode,
          email
        } = data,
              rest = _objectWithoutPropertiesLoose(data, ["pincode", "email"]);

        const locations = getLocations(pincode).map(centers => findCenters(centers, rest)).filter(centers => centers.length > 0);

        if (locations.length > 0) {
          sendEmail(locations, email);
        }
      }
    }
  } catch (f) {//
  }
};
;// CONCATENATED MODULE: ./src/trigger.js
const removeAllTriggers = () => {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });
};

const createTrigger = frequency => {
  removeAllTriggers();
  const trigger = ScriptApp.newTrigger('app').timeBased();

  if (frequency === 'day') {
    trigger.atHour(8).everyDays(1).create();
  } else {
    const time = Number(frequency);

    if (time === 15 || time === 30) {
      trigger.everyMinutes(frequency).create();
    } else {
      trigger.everyHours(frequency).create();
    }
  }
};
const deleteTrigger = () => {
  removeAllTriggers();
  throw new Error('Email Alert Removed!');
};
;// CONCATENATED MODULE: ./src/init.js



const init = data => {
  setData(data);
  createTrigger(data.frequency);
  app();
};
;// CONCATENATED MODULE: ./src/ui.js
const onOpen = () => {
  SpreadsheetApp.getUi().createMenu('🇮🇳  Vaccine Tracker').addItem('Enable', 'showApp').addSeparator().addItem('Disable', 'disableApp').addToUi();
};
const showApp = () => {
  const html = HtmlService.createHtmlOutputFromFile('app.html').setWidth(480).setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, 'COVID-19 Vaccine Near Me 🇮🇳');
};
;// CONCATENATED MODULE: ./src/index.js





__webpack_require__.g.getData = getData;
__webpack_require__.g.init = init;
__webpack_require__.g.app = app;
__webpack_require__.g.showApp = showApp;
__webpack_require__.g.onOpen = onOpen;
__webpack_require__.g.disableApp = deleteTrigger;
/******/ })()
;