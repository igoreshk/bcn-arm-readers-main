import React, { Component } from 'react';

import { FormControl, FormControlLabel, Avatar, Checkbox, FormLabel } from '@material-ui/core';

import PropTypes from 'prop-types';

import './visitorsSelectField.scss';

export class VisitorsSelectField extends Component {
  constructor(props) {
    super(props);
    const objWithIds = {};
    const visitorsIds = this.props.watcher ? this.props.watcher.visitorIds : [];
    if (visitorsIds.length) {
      visitorsIds.slice().forEach((id) => {
        objWithIds[id] = true;
      });
    }
    this.state = {
      selectedVisitors: { ...objWithIds }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.selectedVisitors !== prevState.selectedVisitors) {
      const arrayOfCheckedVisitors = this.makeArrayOfCheckedVisitors(this.state.selectedVisitors);
      this.props.selectVisitorsIds(arrayOfCheckedVisitors);
    }
  }

  makeArrayOfCheckedVisitors = (obj) => {
    return Object.entries(obj)
      .filter((value) => (value[1] ? value[0] : null))
      .map((id) => id[0]);
  };

  handleChangeVisitors = (event) => {
    const selected = { [event.target.value]: event.target.checked };
    this.setState((prevState) => ({
      selectedVisitors: {
        ...prevState.selectedVisitors,
        ...selected
      }
    }));
  };

  renderValue = (values) => {
    const { translate, visitors } = this.props;
    const checkedVisitorsIds = this.makeArrayOfCheckedVisitors(values);
    const checkedVisitors = visitors.filter((item) => checkedVisitorsIds.includes(item.entityId));
    const numberIsGreaterThanTwentyAndLastDigitIsOne = /(0|[2-9])1$/;
    const numberBetweenTwoAndFour = /^[2-4]$/;
    const numberIsGreaterThanTenAndlastDigitBetweenTwoAndFour = /(0|[2-9])[2-4]$/;

    if (checkedVisitors.length === 0) {
      return <span className="placeholder">{translate('monitoring.selectVisitors')}</span>;
    }

    if (checkedVisitors.length === 1) {
      return <span className="placeholder">{checkedVisitors[0].name}</span>;
    }

    if (checkedVisitors.length.toString().match(numberIsGreaterThanTwentyAndLastDigitIsOne)) {
      return (
        <span className="placeholder">
          {translate('monitoring.numberOfSelectedVisitorsFirstVariant', {
            number: checkedVisitors.length
          })}
        </span>
      );
    }

    if (
      checkedVisitors.length.toString().match(numberBetweenTwoAndFour) ||
      checkedVisitors.length.toString().match(numberIsGreaterThanTenAndlastDigitBetweenTwoAndFour)
    ) {
      return (
        <span className="placeholder">
          {translate('monitoring.numberOfSelectedVisitorsSecondVariant', {
            number: checkedVisitors.length
          })}
        </span>
      );
    }

    return (
      <span className="placeholder">
        {translate('monitoring.numberOfSelectedVisitorsThirdVariant', {
          number: checkedVisitors.length
        })}
      </span>
    );
  };

  render() {
    const { selectedVisitors } = this.state;
    const { visitors, isLoading } = this.props;

    return (
      <FormControl className="visitorSelectFormControl">
        <FormLabel disabled>{this.renderValue(selectedVisitors)}</FormLabel>
        {visitors.map((visitor) => (
          <FormControlLabel
            classes={{
              root: 'visitorItem',
              label: 'select'
            }}
            key={visitor.entityId}
            control={
              <Checkbox
                disabled={isLoading}
                className="visitorItem"
                value={visitor.entityId}
                checked={selectedVisitors[visitor.entityId] || false}
                onChange={this.handleChangeVisitors}
              />
            }
            label={
              <>
                <Avatar src={visitor.image} className="avatar" />
                {visitor.name}
              </>
            }
          />
        ))}
      </FormControl>
    );
  }
}

VisitorsSelectField.propTypes = {
  translate: PropTypes.func,
  selectVisitorsIds: PropTypes.func,
  visitors: PropTypes.arrayOf(PropTypes.object),
  watcher: PropTypes.object,
  isLoading: PropTypes.bool
};

export default VisitorsSelectField;
