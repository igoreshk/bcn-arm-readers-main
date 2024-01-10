const BY_WATCHER_NAME_ASC = 'BY_WATCHER_NAME_ASC';
const BY_WATCHER_NAME_DESC = 'BY_WATCHER_NAME_DESC';
const BY_VISITORS_ASC = 'BY_VISITORS_ASC';
const BY_VISITORS_DESC = 'BY_VISITORS_DESC';
const WATCHER_NAME = 'name';
const VISITOR_IDS = 'visitorIds';
const VISITORS = 'visitors';

export const SORTED = {
  [WATCHER_NAME]: {
    asc: BY_WATCHER_NAME_ASC,
    desc: BY_WATCHER_NAME_DESC
  },
  [VISITORS]: {
    asc: BY_VISITORS_ASC,
    desc: BY_VISITORS_DESC
  }
};

const compareStr = (field1, field2) => {
  if (field1 > field2) {
    return 1;
  }
  if (field1 < field2) {
    return -1;
  }
  return 0;
};

const compareArray = (field1, field2) => {
  if (field1.length > field2.length) {
    return 1;
  }
  if (field1.length < field2.length) {
    return -1;
  }
  for (let i = 0; i < field1.length; i++) {
    const result = compareStr(field1[i], field2[i]);
    if (result !== 0) {
      return result;
    }
  }
  return 0;
};

const toLowerCaseOrDefault = (str) => (str && str.toLowerCase()) || '';

const sorter = (watcherEntity1, watcherEntity2, field) => {
  if (field === WATCHER_NAME) {
    return compareStr(toLowerCaseOrDefault(watcherEntity1[field]), toLowerCaseOrDefault(watcherEntity2[field]));
  }
  if (field === VISITORS) {
    return compareArray(watcherEntity1[VISITOR_IDS], watcherEntity2[VISITOR_IDS]);
  }
};

export const getSortType = (field, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return SORTED[field].desc;
  }
  return SORTED[field].asc;
};

export const sortWatchers = (field, array, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return array.sort((watcherEntity1, watcherEntity2) => -sorter(watcherEntity1, watcherEntity2, field));
  }
  return array.sort((watcherEntity1, watcherEntity2) => sorter(watcherEntity1, watcherEntity2, field));
};
