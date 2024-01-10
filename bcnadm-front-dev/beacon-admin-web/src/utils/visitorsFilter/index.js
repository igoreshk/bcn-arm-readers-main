export const filterVisitors = (filter, visitorsArray) => {
  return visitorsArray.filter((visitorAggregate) => visitorAggregate.name.toLowerCase().indexOf(filter.name) > -1);
};
