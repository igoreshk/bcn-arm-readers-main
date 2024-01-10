import React, { Component } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import './watchersSelectField.scss';

class WatchersSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWatchers: []
    };
  }

  handleChangeWatchers = (event) => {
    this.props.selectWatchersIds(event.target.value);
    this.setState({ selectedWatchers: event.target.value });
  };
  renderValue = (values) => {
    if (values.length === 0) {
      return <span className="placeholder">Select Watchers</span>;
    }

    if (values.length === 1) {
      return <span className="placeholder">{values[0].name}</span>;
    }

    if (values.length.toString().match(/(0|[2-9])1$/)) {
      return <span className="placeholder">Selected {values.length} watchers</span>;
    }

    if (values.length.toString().match(/^[2-4]$/) || values.length.toString().match(/(0|[2-9])[2-4]$/)) {
      return <span className="placeholder">Selected {values.length} watchers</span>;
    }

    return <span className="placeholder">Selected {values.length} watchers</span>;
  };

  render() {
    const { selectedWatchers } = this.state;
    const { watchers } = this.props;

    return (
      <FormControl className="watcherSelectFormControl">
        <Select
          multiple
          value={selectedWatchers}
          onChange={this.handleChangeWatchers}
          renderValue={this.renderValue}
          disableUnderline
          displayEmpty
          classes={{
            root: 'visitorsSelect',
            select: 'select',
            icon: 'selectIcon'
          }}
        >
          <MenuItem value="" disabled>
            <span>Select Watchers</span>
          </MenuItem>
          {watchers.map((watcher) => (
            <MenuItem name="watcher" key={watcher.entityId} value={watcher} className="visitorItem">
              <span className="name">{watcher.name}</span>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

WatchersSelectField.propTypes = {
  watchers: PropTypes.arrayOf(
    PropTypes.shape({
      entityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      visitorIds: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
  ).isRequired,
  selectWatchersIds: PropTypes.func.isRequired
};

export default WatchersSelectField;
