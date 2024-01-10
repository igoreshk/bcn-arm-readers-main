import { mapProviders } from 'src/view/map/MapConsts';
import mapSettings, { setMapProviderName, setMapProvider, saveMap, setMapRenderedStatus } from './mapSettingsSlice';

const initialState = {
  selectedMapProviderName: mapProviders.GOOGLE,
  selectedMapProvider: null,
  selectedMap: null,
  isMapRendered: false
};

const selectedMapProvider = {};
const selectedMap = {};

const changedState = {
  selectedMapProviderName: mapProviders.GOOGLE,
  selectedMapProvider,
  selectedMap,
  isMapRendered: true
};

describe('mapSettings reducer', () => {
  it('should return the initial state', () => {
    expect(mapSettings(undefined, {})).toEqual(initialState);
  });

  it('should handle setMapProviderName properly', () => {
    expect(
      mapSettings(changedState, {
        type: setMapProviderName.type,
        payload: { selectedMapProviderName: mapProviders.OSM }
      })
    ).toEqual({
      ...initialState,
      selectedMapProviderName: mapProviders.OSM
    });
  });

  it('should handle setMapProvider properly', () => {
    expect(
      mapSettings(initialState, {
        type: setMapProvider.type,
        payload: { selectedMapProvider }
      })
    ).toEqual({
      ...initialState,
      selectedMapProvider
    });
  });

  it('should handle saveMap properly', () => {
    expect(
      mapSettings(initialState, {
        type: saveMap.type,
        payload: { selectedMap }
      })
    ).toEqual({
      ...initialState,
      selectedMap
    });
  });

  it('should handle setMapRenderedStatus properly', () => {
    expect(
      mapSettings(initialState, {
        type: setMapRenderedStatus.type,
        payload: { isMapRendered: true }
      })
    ).toEqual({
      ...initialState,
      isMapRendered: true
    });
  });
});
