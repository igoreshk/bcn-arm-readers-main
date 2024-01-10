import { LocationService } from 'src/utils/LocationService';
import AreasSorter from 'src/utils/AreasSorter';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import AreasTable from '../AreasTable';

export class AreasTableContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortedBy: null,
      sortedData: props.areas
    };
  }

  toggleSortAreasByField = (field) => {
    let sorted;
    if (!Object.is(this.state.sortedBy, AreasSorter.mapFieldToOrder.get(field).asc)) {
      sorted = this.props.areas.sort((areaEntity1, areaEntity2) => {
        this.setState({ sortedBy: AreasSorter.mapFieldToOrder.get(field).asc });
        return AreasSorter.sortAsc(areaEntity1, areaEntity2, field);
      });
    } else {
      sorted = this.props.areas.sort((areaEntity1, areaEntity2) => {
        this.setState({ sortedBy: AreasSorter.mapFieldToOrder.get(field).desc });
        return AreasSorter.sortDesc(areaEntity1, areaEntity2, field);
      });
    }
    this.setState({
      sortedData: sorted
    });
  };

  editArea = (entityId) => () => {
    const { building: buildingId, level: levelId } = this.props.match.params;
    this.props.history.push(LocationService.getAreasDialogLocation(buildingId, levelId, entityId));
  };

  render() {
    const {
      editArea,
      props: { close, isAreasLoading, levelNumber, translate },
      state: { sortedBy, sortedData },
      toggleSortAreasByField
    } = this;

    return (
      <AreasTable
        close={close}
        source={sortedData}
        editArea={editArea}
        isAreasLoading={isAreasLoading}
        keys={['name', 'description']}
        levelNumber={levelNumber}
        sortedBy={sortedBy}
        toggleSortAreasByField={toggleSortAreasByField}
        translate={translate}
      />
    );
  }
}

AreasTableContainer.propTypes = {
  match: PropTypes.object,
  close: PropTypes.func.isRequired,
  isAreasLoading: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }),
  levelNumber: PropTypes.number,
  areas: PropTypes.arrayOf(PropTypes.object).isRequired,
  translate: PropTypes.func.isRequired
};

export default withRouter(AreasTableContainer);
