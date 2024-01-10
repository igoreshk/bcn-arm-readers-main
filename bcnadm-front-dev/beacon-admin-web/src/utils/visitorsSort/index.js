const BY_NAME_ASC = 'BY_NAME_ASC';
const BY_NAME_DESC = 'BY_NAME_DESC';

export const SORTED = {
  'name': {
    asc: BY_NAME_ASC,
    desc: BY_NAME_DESC
  }
};

const sortAsc = (visitorEntity1, visitorEntity2, field) => {
  return compare(visitorEntity1[field].toLowerCase(), visitorEntity2[field].toLowerCase());
};

const sortDesc = (visitorEntity1, visitorEntity2, field) => {
  return -compare(visitorEntity1[field].toLowerCase(), visitorEntity2[field].toLowerCase());
};

export const getSortType = (field, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return SORTED[field].desc;
  }
  return SORTED[field].asc;
};

export const sortVisitors = (field, array, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return array.sort((visitorEntity1, visitorEntity2) => {
      return sortDesc(visitorEntity1, visitorEntity2, field);
    });
  }
  return array.sort((visitorEntity1, visitorEntity2) => {
    return sortAsc(visitorEntity1, visitorEntity2, field);
  });
};

function compare(field1, field2) {
  if (field1 > field2) {
    return 1;
  } else if (field1 < field2) {
    return -1;
  }
  return 0;
}
