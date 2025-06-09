import Home from '../pages/Home';

export const routes = {
  home: {
    id: 'home',
    label: 'ShapeSynth',
    path: '/',
    icon: 'Home',
    component: Home
  }
};

export const routeArray = Object.values(routes);