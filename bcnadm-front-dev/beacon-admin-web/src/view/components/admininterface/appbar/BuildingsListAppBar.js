import { BUILDING_NEW } from 'src/consts/RouteConsts';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutline';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

function BuildingsListAppBar(props) {
  const { translate, history } = props;

  return (
    <Button
      className="appBarAddButton"
      onClick={() => {
        history.push(BUILDING_NEW);
      }}
      variant="contained"
      color="secondary"
    >
      <AddIcon fontSize="small" />
      <span className="text">{translate('buildings.create')}</span>
    </Button>
  );
}

BuildingsListAppBar.propTypes = {
  translate: PropTypes.func,
  history: PropTypes.object
};

export default withRouter(withLocalize(BuildingsListAppBar));
