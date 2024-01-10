import ImageDropzone from 'src/view/components/common/ImageDropzone';
import { maxFileSize } from 'src/view/FileConsts';
import React from 'react';
import { Field } from 'redux-form';
import { Button } from '@material-ui/core';
import { FaBuilding as BuildingIcon } from 'react-icons/fa';
import PropTypes from 'prop-types';

import BuildingInfoTextField from '../BuildingInfoTextField';
import Logo from '../../styles/Logo';
import BuildingPickerMap from '../BuildingPickerMap/BuildingPickerMap';

import './buildingInfoForm.scss';

const buildingInfoForm = ({ next, allowedToProceed, imageLink, translate, isNew, closeDialog }) => (
  <div className="buildingInfoForm">
    <div className="firstBlock">
      <div>
        <Logo
          title={translate(isNew ? 'building.create.title' : 'building.update.title')}
          icon={<BuildingIcon className="logo" />}
        />
        <Field name="name" component={BuildingInfoTextField} label={translate('building.name')} maxLength={70} />
      </div>
      <Field
        component={ImageDropzone}
        name="mapImage"
        imageLink={imageLink}
        maxSize={maxFileSize}
        translate={translate}
      />
    </div>

    <div className="secondBlock">
      <Field name="address" component={BuildingInfoTextField} label={translate('building.address')} maxLength={256} />
      <div className="row">
        <Field name="phoneNumber" component={BuildingInfoTextField} label={translate('building.phoneNumber')} />
        <Field name="workingHours" component={BuildingInfoTextField} label={translate('building.workingHours')} />
      </div>
      <div className="row">
        <Field name="latitude" type="number" component={BuildingInfoTextField} label={translate('building.lat')} />
        <Field name="longitude" type="number" component={BuildingInfoTextField} label={translate('building.lng')} />
      </div>
      <div className="row">
        <Field name="height" type="number" component={BuildingInfoTextField} label={translate('building.height')} />
        <Field name="width" type="number" component={BuildingInfoTextField} label={translate('building.width')} />
      </div>
    </div>
    <div className="thirdBlock">
      <div className="row">
        <div className="map">
          <BuildingPickerMap />
        </div>
      </div>
    </div>

    <div className="buttonsContainer">
      <Button onClick={closeDialog}>{translate('building.cancel')}</Button>
      <Button onClick={next} disabled={!allowedToProceed} variant="contained" color="primary" className="nextButton">
        {translate('building.next')}
      </Button>
    </div>
  </div>
);

buildingInfoForm.propTypes = {
  translate: PropTypes.func.isRequired,
  next: PropTypes.func.isRequired,
  allowedToProceed: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  imageLink: PropTypes.string,
  isNew: PropTypes.bool
};

export default buildingInfoForm;
