import {
  checkNumberEndsTwoThreeFour,
  checkNumberMoreTwentyEndsOne,
  checkNumberVisitorsOne
} from 'view/components/visitors/TitleSelect/helpers';

// marks of the slider
export const marks = [
  {
    value: 0,
    label: '00:00'
  },
  {
    value: 7200,
    label: '02:00'
  },
  {
    value: 14400,
    label: '04:00'
  },
  {
    value: 21600,
    label: '06:00'
  },
  {
    value: 28800,
    label: '08:00'
  },
  {
    value: 36000,
    label: '10:00'
  },
  {
    value: 43200,
    label: '12:00'
  },
  {
    value: 50400,
    label: '14:00'
  },
  {
    value: 57600,
    label: '16:00'
  },
  {
    value: 64800,
    label: '18:00'
  },
  {
    value: 72000,
    label: '20:00'
  },
  {
    value: 79200,
    label: '22:00'
  },
  {
    value: 86400,
    label: '00:00'
  }
];

export const checkIsCurrentDay = (date) => {
  const currentDay = new Date(Date.now());
  if (
    date.getFullYear() === currentDay.getFullYear() &&
    date.getMonth() === currentDay.getMonth() &&
    date.getDate() === currentDay.getDate()
  ) {
    return true;
  }
  return false;
};

export const changeMarksLength = (mark) => {
  const multiplier = 2;
  const hours = new Date().getHours();
  const newAr = JSON.parse(JSON.stringify(mark));
  newAr.length = Math.round(hours / multiplier);
  return newAr;
};

export const changeDateView = (date) => {
  const res = date.split(' ');
  return `${res[2]} ${res[1]}`;
};

export const getTranslate = (visitorsNumber, translate) => {
  if (visitorsNumber.length === 0) {
    return translate('monitoring.noVisitorsToMonitor');
  }
  if (checkNumberVisitorsOne(visitorsNumber)) {
    return translate('monitoring.oneVisitorToMonitor');
  } else if (checkNumberMoreTwentyEndsOne(visitorsNumber)) {
    return translate('monitoring.visitorsMoreTwentyEndOne');
  } else if (checkNumberEndsTwoThreeFour(visitorsNumber)) {
    return translate('monitoring.visitorsNumberEndsTwoThreeFour');
  }
  return translate('monitoring.visitorsPluralDefaultNumber');
};

export const dateToISOString = (date) => {
  const begin = 0;
  const end = -5;
  return date.toISOString().replace('T', ' ').slice(begin, end);
};

export const dateToZeroTime = (date) => {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
};
