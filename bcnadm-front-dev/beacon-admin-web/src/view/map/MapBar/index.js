import React from 'react';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';
import ModeButtonGroup from '../ModeButtonGroup';
import SecondButtonGroup from '../SecondButtonGroup';
import ActionButtonsGroup from '../ActionButtonsGroup';
import BuildingSizeLegend from '../BuildingSizeLegend';

import './mapBar.scss';

export function MapBar({
  changeEditMode,
  buildingSizeForScaleMode: sizes,
  translate,
  levelNumber,
  selectedMapProviderName,
  handleRemoveMarkers
}) {
  return (
    <div>
      <div className="actions">
        <div className="firstGroup">
          <span className="levelNumber">{translate('building.level', { value: levelNumber })}</span>
          <ModeButtonGroup />
        </div>

        <div className="secondGroup">
          <SecondButtonGroup
            levelNumber={levelNumber}
            selectedMapProviderName={selectedMapProviderName}
            translate={translate}
          />
          <ActionButtonsGroup toEdit={changeEditMode} clear={handleRemoveMarkers} translate={translate} />
        </div>
      </div>
      {sizes && <BuildingSizeLegend height={sizes.height} width={sizes.width} />}
    </div>
  );
}

MapBar.propTypes = {
  levelNumber: PropTypes.number,
  translate: PropTypes.func.isRequired,
  handleRemoveMarkers: PropTypes.func.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  selectedMapProviderName: PropTypes.string.isRequired,
  buildingSizeForScaleMode: PropTypes.object
};

export default withLocalize(MapBar);
