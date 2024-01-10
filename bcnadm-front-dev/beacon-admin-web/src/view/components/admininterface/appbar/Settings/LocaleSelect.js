import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import { LOCALE } from './LocaleConsts';

export class LocaleSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenLocale: ''
    };
  }

  componentDidMount() {
    this.props.input.onChange(this.props.curLocale);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.curLocale && (prevProps.curLocale !== this.props.curLocale || !this.state.chosenLocale)) {
      this.setState({ chosenLocale: this.props.curLocale });
    }
  };

  handleChange = (event) => {
    this.setState({ chosenLocale: event.target.value });
    this.props.input.onChange(event.target.value);
  };

  render() {
    return (
      <FormControl margin="normal" className="localeSelectFormControl">
        <InputLabel shrink>{this.props.floatingLabelText}</InputLabel>
        <Select value={this.state.chosenLocale} onChange={this.handleChange}>
          {Object.values(LOCALE).map((locale, index) => (
            <MenuItem name="locale-option" key={index} value={locale.value}>
              {locale.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
}

LocaleSelect.propTypes = {
  curLocale: PropTypes.string,
  input: PropTypes.object,
  floatingLabelText: PropTypes.string
};

export default withLocalize(LocaleSelect);
