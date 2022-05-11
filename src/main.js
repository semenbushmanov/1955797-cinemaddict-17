import { render } from './render.js';
import UserProfileView from './view/user-profile-view.js';
import NavigationView from './view/navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const contentPresenter = new ContentPresenter();

render(new UserProfileView(), siteHeaderElement);
render(new NavigationView(), siteMainElement);
render(new StatisticsView(), siteFooterStatisticsElement);

contentPresenter.init(siteMainElement);
