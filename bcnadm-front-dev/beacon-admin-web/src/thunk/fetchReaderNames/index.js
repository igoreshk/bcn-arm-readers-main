import { ReadersService } from 'src/service/ReaderService';
import { setReaderNames } from 'src/actions/setReaderNamesAction';

export const fetchReaderNames = () => {
  return async (dispatch) => {
    await ReadersService.getAllReaders()
      .then((response) => {
        dispatch(setReaderNames(response));
      })
      .catch((err) => {
        throw err;
      });
  };
};
