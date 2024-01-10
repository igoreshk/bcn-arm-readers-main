export const getSortedObjectsbyProperty = (arr, property) => {
  const sortedArr = [...arr];
  sortedArr.sort((left, right) => {
    if (left[property] > right[property]) {
      return 1;
    } else if (right[property] > left[property]) {
      return -1;
    }
    return 0;
  });
  return sortedArr;
};
