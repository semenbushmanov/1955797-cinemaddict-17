import { render } from '../render.js';
import SortView from '../view/sort-view.js';
import FilmsListView from '../view/films-list-view.js';
import FilmsContainerView from '../view/films-container-view.js';
import FilmCardView from '../view/film-card-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';

// import for popup rendering
/*
import PopupView from '../view/popup-view.js';
import PopupCommentView from '../view/popup-comment-view.js';
import PopupGenreView from '../view/popup-genre-view.js';
*/

export default class ContentPresenter {
  init = (contentContainer, filmsModel,commentsModel) => {
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

    // render popup
    this.commentsModel = commentsModel;
    /*
    this.comments = [...this.commentsModel.getComments()];

    this.popupView = new PopupView(this.filmCards[0]);
    render(this.popupView, document.body);

    this.commentList = this.popupView.getElement().querySelector('.film-details__comments-list');
    for (let i =0; i < this.comments.length; i++) {
      render(new PopupCommentView(this.comments[i]), this.commentList);
    }

    this.genres = this.filmCards[0].filmInfo.genre;
    this.genreCell = this.popupView.getElement().querySelector('#genre-cell');
    for (let i =0; i < this.genres.length; i++) {
      render(new PopupGenreView(this.genres[i]),this.genreCell);
    }
    */
  };
}
