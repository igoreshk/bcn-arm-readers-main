import { WithSearchContext } from 'src/view/components/common/WithSearch';
import React from 'react';
import PropTypes from 'prop-types';
import Search from '@material-ui/icons/Search';
import { TextField } from '@material-ui/core';
import './searchPanel.scss';

export default function SearchPanel(props) {
  SearchPanel.propTypes = {
    containerClassName: PropTypes.string,
    name: PropTypes.string,
    searchClassName: PropTypes.string,
    textFieldClassName: PropTypes.string,
    textFieldRest: PropTypes.object
  };

  SearchPanel.defaultProps = {
    containerClassName: 'searchPanelContainer',
    name: 'search-panel-filter',
    searchClassName: 'icon',
    textFieldClassName: 'searchPanel'
  };

  return (
    <WithSearchContext.Consumer>
      {({ filter, setFilter }) => (
        <div className={`${props.containerClassName} ${props.className}`}>
          <Search className={props.searchClassName} />
          <TextField
            name={props.name}
            value={filter}
            onChange={setFilter}
            className={props.textFieldClassName}
            {...props.textFieldRest}
          />
        </div>
      )}
    </WithSearchContext.Consumer>
  );
}
