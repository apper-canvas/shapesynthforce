import HomePage from '../components/pages/HomePage';

export const routes = {
  home: {
    id: 'home',
    label: 'ShapeSynth',
    path: '/',
    icon: 'Home',
    component: HomePage
  }
};

export const routeArray = Object.values(routes);