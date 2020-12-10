import React from 'react';
import cx from 'classnames';
import { Switch, Route, Redirect } from 'react-router-dom';
// creates a beautiful scrollbar
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// core components
import AdminNavbar from 'components/Navbars/AdminNavbar.js';
import Footer from 'components/Footer/Footer.js';
import Sidebar from 'components/Sidebar/Sidebar.js';
import FixedPlugin from 'components/FixedPlugin/FixedPlugin.js';

import routes from '../routes.js';

import styles from 'assets/jss/material-dashboard-pro-react/layouts/adminStyle.js';

var ps;

const useStyles = makeStyles(styles);

export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [miniActive, setMiniActive] = React.useState(false);
  const [image, setImage] = React.useState(require('assets/img/sidebar-2.jpg'));
  const [color, setColor] = React.useState('blue');
  const [bgColor, setBgColor] = React.useState('black');

  const [currentLoginToken, setCurrentLoginToken] = React.useState('');

  // const [hasImage, setHasImage] = React.useState(true);
  const [fixedClasses, setFixedClasses] = React.useState('dropdown');
  const [logo, setLogo] = React.useState(require('assets/img/serenia_logo.png'));
  // styles
  const classes = useStyles();
  const mainPanelClasses =
    classes.mainPanel +
    ' ' +
    cx({
      [classes.mainPanelSidebarMini]: miniActive,
      [classes.mainPanelWithPerfectScrollbar]:
        navigator.platform.indexOf('Win') > -1,
    });
  // ref for main panel div
  const mainPanel = React.createRef();
  // effect instead of componentDidMount, componentDidUpdate and componentWillUnmount
  React.useEffect(() => {
    if (navigator.platform.indexOf('Win') > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = 'hidden';
    }
    window.addEventListener('resize', resizeFunction);

    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf('Win') > -1) {
        ps.destroy();
      }
      window.removeEventListener('resize', resizeFunction);
    };
  });
  // functions for changeing the states from components
  const handleImageClick = (image) => {
    setImage(image);
  };
  const handleColorClick = (color) => {
    setColor(color);
  };
  const handleBgColorClick = (bgColor) => {
    switch (bgColor) {
      case 'white':
        setLogo(require('assets/img/serenia_logo.png'));
        break;
      default:
        setLogo(require('assets/img/serenia_logo.png'));
        break;
    }
    setBgColor(bgColor);
  };
  const handleFixedClick = () => {
    if (fixedClasses === 'dropdown') {
      setFixedClasses('dropdown show');
    } else {
      setFixedClasses('dropdown');
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== '/admin/full-screen-maps';
  };

  // Get available routes based user role and login token
  const getAvailableRoute = (route) => {
    const newRoute = [];
    let newRouteId = 0;
    let userRole = localStorage.getItem("UserRole");
    let loginToken = localStorage.getItem("LoginToken");

    if (loginToken === 'failed') {
      setCurrentLoginToken('failed');
    }

    for (let i = 0; i < route.length; i++) {
      let collapseActiveRouteRole = route[i].role;

      if (userRole === 'admin') {
        if (route[i].role != 'failed') {
          newRoute[newRouteId] = route[i];
          newRouteId = newRouteId + 1;
        }
      } else if (userRole === 'doctor') {
        if (userRole == collapseActiveRouteRole) {
          newRoute[newRouteId] = route[i];
          newRouteId = newRouteId + 1;
        }
      }
    }

    return newRoute;
  }

  const newRoutes = getAvailableRoute(routes);


  const getActiveRoute = (routes) => {
    let activeRoute = 'Default Brand Text';

    let loginToken = localStorage.getItem("LoginToken");
    let userRole = localStorage.getItem("UserRole");

    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {

        let collapseActiveRouteRole = newRoutes[i].role;

        // if (userRole == collapseActiveRouteRole) {
        let collapseActiveRoute = getActiveRoute(routes[i].views);

        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
        // }
      } else {
        let collapseActiveRouteRole = routes[i].role;

        // if (userRole == collapseActiveRouteRole) {

        if (
          window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
        ) {
          return routes[i].name;
        }
        // }
      }
    }
    return activeRoute;
  };
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === '/admin') {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const sidebarMinimize = () => {
    setMiniActive(!miniActive);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };



  return (
    <div className={classes.wrapper}>

      {(currentLoginToken === 'failed') && (
        <Switch>
          <Redirect to='/auth/login'></Redirect>
        </Switch>
      )}

      <Sidebar
        routes={newRoutes}
        logoText={'Serenia'}
        logo={logo}
        image={image}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        bgColor={bgColor}
        miniActive={miniActive}
        {...rest}
      />
      <div className={mainPanelClasses} ref={mainPanel}>
        <AdminNavbar
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
          brandText={getActiveRoute(newRoutes)}
          handleDrawerToggle={handleDrawerToggle}
          {...rest}
        />
        {/* On the /maps/full-screen-maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
        {getRoute() ? (
          <div className={classes.content}>
            <div className={classes.container}>
              <Switch>
                {getRoutes(newRoutes)}
                <Redirect from="/admin" to="/admin/consultation" />
              </Switch>
            </div>
          </div>
        ) : (
            <div className={classes.map}>
              <Switch>
                {getRoutes(newRoutes)}
                <Redirect from="/admin" to="/admin/consultation" />
              </Switch>
            </div>
          )}
        {getRoute() ? <Footer fluid /> : null}
        <FixedPlugin
          handleImageClick={handleImageClick}
          handleColorClick={handleColorClick}
          handleBgColorClick={handleBgColorClick}
          color={color}
          bgColor={bgColor}
          bgImage={image}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
          sidebarMinimize={sidebarMinimize.bind(this)}
          miniActive={miniActive}
        />
      </div>
    </div>
  );
}
