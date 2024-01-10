import { HIDE_LOADING, SHOW_LOADING } from 'src/actions/session/actionTypes';

// initial value of processes fetching should be true
// cause in the core routing component (SessionFilter.js)
// at first loading screen should be displayed
// if to manually call showLoadingScreen(), redux store
// isn't fast enough to be updated before rendering
const initialState = {
  processesFetching: true
};

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        processesFetching: true
      };

    case HIDE_LOADING:
      return {
        processesFetching: false
      };

    default:
      return state;
  }
}
