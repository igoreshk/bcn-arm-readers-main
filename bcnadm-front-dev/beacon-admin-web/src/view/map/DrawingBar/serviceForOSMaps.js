import { withLocalize } from 'react-localize-redux';
import { shapesRender } from 'view/map/DrawingBar/DrawingBar';

export const setMapForOSM = (props) => {
  const { loadedOSMap, match, shapes, translate } = props;
  if (loadedOSMap.current) {
    try {
      shapesRender(shapes, match, loadedOSMap, translate);
    } catch (error) {
      console.error(error);
    }
  }
};

export default withLocalize(setMapForOSM);
