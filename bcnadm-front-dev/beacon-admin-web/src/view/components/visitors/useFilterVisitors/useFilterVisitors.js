import { useState, useEffect } from 'react';

export function useFilterVisitors({ visitors, changeListVisitorIds }) {
  const [selectedVisitors, setSelectedVisitors] = useState([]);
  const changeSelectedVisitors = (idsSelectedVisitors) => {
    const listSelectedVisitors = visitors.filter((visitor) => idsSelectedVisitors.includes(visitor.entityId));
    setSelectedVisitors(listSelectedVisitors);
    changeListVisitorIds(listSelectedVisitors);
  };

  useEffect(() => {
    const idsSelectedVsisitors = selectedVisitors.map((visitor) => visitor.entityId);
    changeSelectedVisitors(idsSelectedVsisitors);
  }, [visitors]);

  const changeVisitors = (event) => {
    const value = event.target.value.filter((val) => Boolean(val));
    const isClickAll = Boolean(event.currentTarget.getAttribute('data-button-all'));
    if (isClickAll) {
      setSelectedVisitors(selectedVisitors.length === visitors.length ? [] : visitors);
      changeListVisitorIds(selectedVisitors.length === visitors.length ? [] : visitors);
      return;
    }
    setSelectedVisitors(value);
    changeListVisitorIds(value);
  };

  return {
    selectedVisitors,
    changeVisitors
  };
}
