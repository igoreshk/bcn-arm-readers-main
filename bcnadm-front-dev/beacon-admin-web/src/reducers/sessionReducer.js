import { CHECK_SESSION } from 'src/actions/session/actionTypes';

const initialState = {
  status: false
};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case CHECK_SESSION:
      return {
        ...state,
        status: true
      };
    default:
      return state;
  }
}
