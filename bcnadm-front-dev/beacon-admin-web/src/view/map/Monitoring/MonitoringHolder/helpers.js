export const updateComponentIfPropsChanged = (props, nextProps) => {
  // for re-render after loading the map
  if (!props.selectedMap && nextProps.selectedMap) {
    return true;
  }

  // For re-render after map changes
  if (props.map !== nextProps.map) {
    return true;
  }

  // For re-render after mapProvider changes
  if (props.mapProvider !== nextProps.mapProvider) {
    return true;
  }

  // For re-render after selectedMap changes
  if (props.selectedMap !== nextProps.selectedMap) {
    return true;
  }

  // For re-render after choosing another floor
  if (props.levelNumber !== nextProps.levelNumber) {
    return true;
  }

  return false;
};
