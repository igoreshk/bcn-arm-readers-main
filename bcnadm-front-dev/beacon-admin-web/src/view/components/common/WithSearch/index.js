import React, { Component } from 'react';
import PropTypes from 'prop-types';

const defaultContext = {
  filter: '',
  setFilter: () => {
    throw new Error('SearchPanel component should only be used in a component wrapped with WithSearch');
  }
};

export const WithSearchContext = React.createContext(defaultContext);

const WithSearch = (WrappedComponent) =>
  class extends Component {
    static displayName = `WithSearch(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    static propTypes = {
      keys: PropTypes.arrayOf(PropTypes.string).isRequired,
      source: PropTypes.arrayOf(PropTypes.object).isRequired
    };
    constructor(props) {
      super(props);
      this.state = {
        data: this.props.source,
        filter: ''
      };
    }
    componentDidUpdate(prevProps, prevState) {
      if (prevState.data === this.state.data) {
        this.applyFilter();
      }
    }

    applyFilter() {
      const {
        state: { filter },
        props: { keys, source }
      } = this;
      this.setState({
        data: source.filter(
          (object) => keys.filter((key) => object[key].toLowerCase().includes(filter.toLowerCase())).length > 0
        )
      });
    }

    setFilter = ({ target: { value: filter } }) => {
      this.setState({ filter }, this.applyFilter);
    };

    render() {
      return (
        <WithSearchContext.Provider value={{ filter: this.state.filter, setFilter: this.setFilter }}>
          <WrappedComponent {...this.state} {...this.props} />
        </WithSearchContext.Provider>
      );
    }
  };

export default WithSearch;
