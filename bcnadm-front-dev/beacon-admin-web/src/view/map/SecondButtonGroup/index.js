import React from 'react';
import { withLocalize } from 'react-localize-redux';
import PropTypes from 'prop-types';
import MapPicker from '../MapPicker';
import BackgroundToggleButton from '../BackgroundToggleButton';
import AreasListButton from '../Area/AreasListButton';
import { mapProviders } from '../MapConsts';

export function SecondButtonGroup({ translate, levelNumber, selectedMapProviderName }) {
  return (
    <>
      <MapPicker />
      {selectedMapProviderName === mapProviders.GOOGLE && <BackgroundToggleButton />}
      <AreasListButton levelNumber={levelNumber} translate={translate} />
    </>
  );
}

SecondButtonGroup.propTypes = {
  translate: PropTypes.func.isRequired,
  levelNumber: PropTypes.number,
  selectedMapProviderName: PropTypes.string.isRequired
};

export default withLocalize(SecondButtonGroup);
