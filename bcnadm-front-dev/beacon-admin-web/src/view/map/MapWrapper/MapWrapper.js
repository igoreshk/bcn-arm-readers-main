import React from 'react';
import { mapProviders } from 'src/view/map/MapConsts';
import { OSMWrapper } from './OSMWrapper';
import { GoogleWrapper } from './GoogleWrapper';

const mapWrapper = (Component) => {
  const chooseWrapper = (props) => {
    let Wrapper;

    if (props.selectedMapProviderName === mapProviders.OSM) {
      Wrapper = OSMWrapper(Component);
    } else {
      Wrapper = GoogleWrapper(Component);
    }

    return <Wrapper {...props} />;
  };

  const MapWrapper = (props) => {
    MapWrapper.displayName = 'MapWrapper';
    return chooseWrapper(props);
  };

  return MapWrapper;
};

export default mapWrapper;
