import React from 'react';
import L from 'leaflet';

export const OSMWrapper = (Component) => {
  const OSM = (props) => {
    return <Component mapProvider={{ L }} {...props} />;
  };
  OSM.displayName = 'OSMWrapper';

  return OSM;
};
