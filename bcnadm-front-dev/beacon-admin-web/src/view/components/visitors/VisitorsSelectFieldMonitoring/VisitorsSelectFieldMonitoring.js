import React from 'react';
import { FormControl, Select, MenuItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import PropTypes from 'prop-types';
import { useFilterVisitors } from '../useFilterVisitors';
import TitleSelect from '../TitleSelect';

import './visitorsSelectFieldMonitoring.scss';

const VisitorsSelectFieldMonitoring = ({ translate, visitors, changeListVisitorIds }) => {
  const { selectedVisitors, changeVisitors } = useFilterVisitors({ visitors, changeListVisitorIds });
  return (
    <FormControl className="visitorSelectFormControl">
      <Select
        multiple
        value={selectedVisitors}
        onChange={changeVisitors}
        renderValue={(value) => <TitleSelect listOfVisitors={value} translate={translate} />}
        disableUnderline
        displayEmpty
        classes={{
          root: 'visitorsSelect',
          select: 'select',
          icon: 'selectIcon'
        }}
      >
        <MenuItem value="" disabled>
          <span>{translate('monitoring.selectVisitors')}</span>
        </MenuItem>
        {visitors.length !== 0 ? (
          <MenuItem data-button-all>
            <ListItemIcon>
              <Checkbox
                checked={visitors.length > 0 && selectedVisitors.length === visitors.length}
                indeterminate={selectedVisitors.length > 0 && selectedVisitors.length < visitors.length}
              />
            </ListItemIcon>
            <ListItemText primary={translate('monitoring.allVisitors')} />
          </MenuItem>
        ) : (
          ''
        )}
        {visitors.map((visitor) => (
          <MenuItem name="visitor" key={visitor.entityId} value={visitor} className="visitorItem">
            {visitor.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

VisitorsSelectFieldMonitoring.propTypes = {
  visitors: PropTypes.arrayOf(
    PropTypes.shape({
      entityId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired
  ).isRequired,
  changeListVisitorIds: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
};

export default VisitorsSelectFieldMonitoring;
