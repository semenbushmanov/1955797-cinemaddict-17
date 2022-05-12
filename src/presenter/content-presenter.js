import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
// import PopupView from '../view/popup-view.js';

export default class ContentPresenter {
  init = (contentContainer, filmsModel) => {
    this.contentContainer = contentContainer;
    this.filmsModel = filmsModel;
    this.filmCards = [...this.filmsModel.getFilms()];
    this.filmsListComponent = new FilmsListView();
    this.filmsContainerComponent = new FilmsContainerView();

    render(new SortView(),this.contentContainer);
    render(this.filmsListComponent, this.contentContainer);
    render(this.filmsContainerComponent, this.filmsListComponent.getElement());

    for (let i = 0; i < this.filmCards.length; i++) {
      render(new FilmCardView(this.filmCards[i]), this.filmsContainerComponent.getElement());
    }

    render(new ShowMoreButtonView(), this.filmsListComponent.getElement());

    // render(new PopupView(), document.body);
  };
}
