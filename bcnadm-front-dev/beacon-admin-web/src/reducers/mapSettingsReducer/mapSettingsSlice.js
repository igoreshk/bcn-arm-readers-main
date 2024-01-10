import { createSlice } from '@reduxjs/toolkit';
import { mapProviders } from 'src/view/map/MapConsts';

const mapSettingsSlice = createSlice({
  name: 'mapSettings',
  initialState: {
    selectedMapProviderName: localStorage.getItem('mapProvider') || mapProviders.GOOGLE,
    selectedMapProvider: null,
    selectedMap: null,
    isMapRendered: false
  },
  reducers: {
    setMapProviderName(state, action) {
      state.selectedMapProviderName = action.payload.selectedMapProviderName;
      state.isMapRendered = false;
      state.selectedMapProvider = null;
      state.selectedMap = null;
    },
    setMapProvider(state, action) {
      state.selectedMapProvider = action.payload.selectedMapProvider;
    },
    saveMap(state, action) {
      state.selectedMap = action.payload.selectedMap;
    },
    setMapRenderedStatus(state, action) {
      state.isMapRendered = action.payload.isMapRendered;
    }
  }
});

export const { setMapProviderName, setMapProvider, saveMap, setMapRenderedStatus } = mapSettingsSlice.actions;

export default mapSettingsSlice.reducer;
