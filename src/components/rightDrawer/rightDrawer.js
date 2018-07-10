import React, {Component} from 'react';
import {connect} from 'react-redux'
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import {toggleRightDrawer, setTabValue, toggleLeftDrawer} from "../../redux/actions";
import './rightDrawer.css';
import turfCenter from "@turf/center";
import {drawerWidth} from "../../redux/constants";

const styles = theme => ({
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72
  }
});

const filters = [
  "All",
  "Food",
  "A/C",
  "Amusement",
  "Non-Profit",
  "Police",
  "Restroom",
  "Sponsor"
]

class RightMenu extends Component {

  // Update global state with tab index & selection
  handleTabChange = (event, value) => {
    setTabValue({index:value, name: filters[value]})
  };

  zoomToVendor = (vendor) => {

    const { map, width } = this.props;
    const bbox = turfCenter(vendor);

    map.flyTo({
      center: bbox.geometry.coordinates,
      zoom: 19.5
    });

    // If we're in mobile mode, close the left drawer
    if (width === 'xs' || width === 'sm') {
      toggleRightDrawer(false);
    }
  }

  componentDidUpdate() {
  }

  componentDidMount() {
  }

  render() {

    const { rightDrawerOptions, polygonData, classes } = this.props;
    const { open, anchor, tabs } = rightDrawerOptions;

    let activeItems = polygonData.features.filter((item) => {
      return tabs.index !== 0 ? filters.indexOf(item.properties.type) === tabs.index : true;
    })

    return (
      <div className="RightMenu">
        <SwipeableDrawer
          classes={{
            paper: classes.drawerPaper
          }}
          className="RightMenuDrawer"
          anchor={anchor}
          open={open}
          onClose={() => toggleRightDrawer(false)}
          onOpen={() => toggleRightDrawer(true)}
        >

          <Tabs
            value={tabs.index}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            classes={{root: classes.tabsRoot}}
            textColor="primary"
            fullWidth
          >
            <Tab classes={{root: classes.tabRoot}} label="All" />
            <Tab classes={{root: classes.tabRoot}} label="Food" />
            <Tab classes={{root: classes.tabRoot}} label="A/C" />
            <Tab classes={{root: classes.tabRoot}} label="Entertainment" />
          </Tabs>

          <List
            className="ListWrapper"
            role="button"
            onClick={() => toggleRightDrawer(false)}
            onKeyDown={() => toggleRightDrawer(false)}
          >
            {activeItems.map((item) => {
              return (
                <ListItem onClick={() => this.zoomToVendor(item)} button key={item.properties.id}>
                  <ListItemText primary={item.properties.name}/>
                </ListItem>
              );
            })}
          </List>
        </SwipeableDrawer>
      </div>
    );
  }

}

RightMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    polygonData: state.polygonData,
    active: state.active,
    leftDrawerOptions: state.leftDrawerOptions,
    rightDrawerOptions: state.rightDrawerOptions,
    map: state.map
  };
}

export default connect(mapStateToProps)(withStyles(styles)(RightMenu));