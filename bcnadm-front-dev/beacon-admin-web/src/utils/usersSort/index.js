const BY_FIRST_NAME_ASC = 'BY_FIRST_NAME_ASC';
const BY_FIRST_NAME_DESC = 'BY_FIRST_NAME_DESC';
const BY_LAST_NAME_ASC = 'BY_LAST_NAME_ASC';
const BY_LAST_NAME_DESC = 'BY_LAST_NAME_DESC';
const BY_EMAIL_ASC = 'BY_EMAIL_ASC';
const BY_EMAIL_DESC = 'BY_EMAIL_DESC';

export const SORTED = {
  'firstName': {
    asc: BY_FIRST_NAME_ASC,
    desc: BY_FIRST_NAME_DESC
  },

  'lastName': {
    asc: BY_LAST_NAME_ASC,
    desc: BY_LAST_NAME_DESC
  },

  'email': {
    asc: BY_EMAIL_ASC,
    desc: BY_EMAIL_DESC
  }
};

const compare = (field1, field2) => {
  if (field1 > field2) {
    return 1;
  } else if (field1 < field2) {
    return -1;
  }
  return 0;
};

const sortAsc = (userEntity1, userEntity2, field) => {
  return compare(userEntity1[field].toLowerCase(), userEntity2[field].toLowerCase());
};

export const getSortType = (field, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return SORTED[field].desc;
  }
  return SORTED[field].asc;
};

export const sortUsers = (field, array, sortedBy) => {
  if (sortedBy === SORTED[field].asc) {
    return array.sort((userEntity1, userEntity2) => {
      return -sortAsc(userEntity1, userEntity2, field);
    });
  }
  return array.sort((userEntity1, userEntity2) => {
    return sortAsc(userEntity1, userEntity2, field);
  });
};
