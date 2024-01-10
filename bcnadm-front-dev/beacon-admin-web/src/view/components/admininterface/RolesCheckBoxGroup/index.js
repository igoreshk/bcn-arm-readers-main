import React from 'react';
import { Radio, RadioGroup, FormControlLabel, Avatar, FormControl } from '@material-ui/core';
import PropTypes from 'prop-types';
import './rolesCheckBoxGroup.scss';
import images from 'src/view/images';

export const RolesCheckBoxGroup = (props) => {
  const { roles, input } = props;

  return (
    <div className="rolesCheckBoxGroup">
      <FormControl>
        <RadioGroup value={input.value} onChange={(event, value) => input.onChange(value)}>
          {roles.map((alias, index) => {
            return (
              <FormControlLabel
                key={index}
                value={alias}
                control={<Radio checked={input.value === alias} />}
                label={
                  <div className="role">
                    <Avatar className="avatar" key={`${alias}-${index}`} src={images.role} />
                    <span className="roleAliasText">{alias}</span>
                  </div>
                }
                classes={{ root: 'formControl', label: 'label' }}
              />
            );
          })}
        </RadioGroup>{' '}
      </FormControl>
    </div>
  );
};

RolesCheckBoxGroup.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
  input: PropTypes.shape(
    {
      value: PropTypes.array.isRequired,
      onChange: PropTypes.func.isRequired
    }.isRequired
  )
};
