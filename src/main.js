import { render } from './framework/render.js';
import UserProfileView from './view/user-profile-view.js';
import StatisticsView from './view/statistics-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import FilmsApiService from './films-api-service.js';

const AUTHORIZATION = 'Basic k78j9uot5na';
const END_POINT = 'https://17.ecmascript.pages.academy/cinemaddict';

const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
const filmsModel = new FilmsModel(new FilmsApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteMainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);

render(new UserProfileView(), siteHeaderElement);
render(new StatisticsView(filmsModel.films), siteFooterStatisticsElement);

filterPresenter.init();
contentPresenter.init();
