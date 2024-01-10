const AreasSorter = {};

const BY_NAME_ASC = 'BY_NAME_ASC';
const BY_NAME_DESC = 'BY_NAME_DESC';
const BY_DESCRIPTION_ASC = 'BY_DESCRIPTION_ASC';
const BY_DESCRIPTION_DESC = 'BY_DESCRIPTION_DESC';

const SORTED = {
  BY_NAME_ASC,
  BY_NAME_DESC,
  BY_DESCRIPTION_ASC,
  BY_DESCRIPTION_DESC
};

AreasSorter.sortAsc = (areaEntity1, areaEntity2, field) => {
  return compare(areaEntity1[field], areaEntity2[field]);
};

AreasSorter.sortDesc = (areaEntity1, areaEntity2, field) => {
  return -compare(areaEntity1[field], areaEntity2[field]);
};

AreasSorter.mapFieldToOrder = new Map();

AreasSorter.mapFieldToOrder.set('name', {
  asc: SORTED.BY_NAME_ASC,
  desc: SORTED.BY_NAME_DESC
});

AreasSorter.mapFieldToOrder.set('description', {
  asc: SORTED.BY_DESCRIPTION_ASC,
  desc: SORTED.BY_DESCRIPTION_DESC
});

function compare(field1, field2) {
  if (field1 > field2) {
    return 1;
  } else if (field1 < field2) {
    return -1;
  }
  return 0;
}

export default AreasSorter;
