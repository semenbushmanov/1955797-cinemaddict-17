import { render } from './framework/render.js';
import UserProfileView from './view/user-profile-view.js';
import NavigationView from './view/navigation-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilmsModel from './model/films-model.js';
import { CommentsModel } from './model/films-model.js';
import { generateFilter } from './mock/filter.js';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const contentPresenter = new ContentPresenter(siteMainElement, filmsModel, commentsModel);

const filters = generateFilter(filmsModel.films);

render(new UserProfileView(), siteHeaderElement);
render(new NavigationView(filters), siteMainElement);
render(new StatisticsView(), siteFooterStatisticsElement);

contentPresenter.init();
