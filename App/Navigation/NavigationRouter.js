import React, { Component } from 'react';
import { Scene, Router } from 'react-native-router-flux';
import Styles from './Styles/NavigationContainerStyles';
import NavigationDrawer from './NavigationDrawer';

// screens identified by the router
import RedditHome from '../Containers/RedditHome';
import RedditWeblinks from '../Containers/RedditWebview';

/* **************************
* Documentation: https://github.com/aksonov/react-native-router-flux
***************************/

class NavigationRouter extends Component {
    render() {
        return (
          <Router>
            <Scene key="drawer" component={NavigationDrawer} open={false}>
              <Scene key="drawerChildrenWrapper" navigationBarStyle={Styles.navBar} titleStyle={Styles.title} leftButtonIconStyle={Styles.leftButton} rightButtonTextStyle={Styles.rightButton}>
                <Scene initial key="homeScreen" component={RedditHome} title="Reddit: the front page of the internet" />
                <Scene key="webView" component={RedditWeblinks} title="Link" />
              </Scene>
            </Scene>
          </Router>
        );
    }
}

export default NavigationRouter;
