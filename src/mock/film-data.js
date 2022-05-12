import { getRandomItem } from '../util.js';

const FILMS_DESCRIPTIONS = [
  {
    'id': '1',
    'comments': [
      '1', '2'
    ],
    'filmInfo': {
      'title': 'A Little Pony Without The Carpet',
      'alternativeTitle': 'Laziness Who Sold Themselves',
      'totalRating': 5.3,
      'poster': 'images/posters/sagebrush-trail.jpg',
      'ageRating': 0,
      'director': 'Tom Ford',
      'writers': [
        'Takeshi Kitano'
      ],
      'actors': [
        'Morgan Freeman'
      ],
      'release': {
        'date': '2019-05-11T00:00:00.000Z',
        'releaseCountry': 'Finland'
      },
      'runtime': 77,
      'genre': [
        'Comedy'
      ],
      'description': 'Oscar-winning film, a war drama about two young people, from the creators of timeless classic "Nu, Pogodi!" and "Alice in Wonderland", with the best fight scenes since Bruce Lee.'
    },
    'userDetails': {
      'watchlist': false,
      'alreadyWatched': true,
      'watchingDate': '2019-04-12T16:12:32.554Z',
      'favorite': false
    }
  },
  {
    'id': '2',
    'comments': [
      '1', '2', '3', '4'
    ],
    'filmInfo': {
      'title': 'Made for each other',
      'alternativeTitle': 'Love',
      'totalRating': 8.3,
      'poster': 'images/posters/made-for-each-other.png',
      'ageRating': 16,
      'director': 'Bob Cord',
      'writers': [
        'Silvester Jackson'
      ],
      'actors': [
        'Tom Cruz'
      ],
      'release': {
        'date': '2017-01-13T00:00:00.000Z',
        'releaseCountry': 'USA'
      },
      'runtime': 77,
      'genre': [
        'Romance'
      ],
      'description': 'Abbati, medico, patrono que intima pande. Abyssus abyssum invocat. Aegroto dum anima est, spes est. Difficile est longum subito deponere amorem.'
    },
    'userDetails': {
      'watchlist': true,
      'alreadyWatched': true,
      'watchingDate': '2021-02-12T13:14:12.554Z',
      'favorite': false
    }
  },
  {
    'id': '3',
    'comments': [
      '1', '2', '3', '4'
    ],
    'filmInfo': {
      'title': 'Santa Claus conquers the martians',
      'alternativeTitle': 'Santa',
      'totalRating': 4.7,
      'poster': 'images/posters/santa-claus-conquers-the-martians.jpg',
      'ageRating': 0,
      'director': 'Larry Bennet',
      'writers': [
        'Eddy Jonson', 'Michael Evans'
      ],
      'actors': [
        'Rob Might', 'Sally Good'
      ],
      'release': {
        'date': '2015-11-12T00:00:00.000Z',
        'releaseCountry': 'Estonia'
      },
      'runtime': 77,
      'genre': [
        'Comedy'
      ],
      'description': 'Dii facientes adiuvant. Dum spiro, spero. Dum vita est, spes est. Gutta cavat lapidem non vi, sed saepe cadendo.'
    },
    'userDetails': {
      'watchlist': false,
      'alreadyWatched': true,
      'watchingDate': '2020-09-12T11:11:52.554Z',
      'favorite': false
    }
  }
];

const FILMS_COMMENTS = [
  {
    'id': '42',
    'author': 'Ilya O\'Reilly',
    'comment': 'a film that changed my life, a true masterpiece, post-credit scene was just amazing omg.',
    'date': '2019-05-11T16:12:32.554Z',
    'emotion': 'smile'
  },
  {
    'id': '48',
    'author': 'Bobby',
    'comment': 'Ignavum fortuna repugnat.',
    'date': '2017-12-11T13:09:22.554Z',
    'emotion': 'angry'
  },
  {
    'id': '55',
    'author': 'Tom Smith',
    'comment': 'Intemperans adulescentia effetum corpus tradit senectuti.',
    'date': '2022-01-11T15:10:15.554Z',
    'emotion': 'puke'
  },
  {
    'id': '67',
    'author': 'Robert Stone',
    'comment': 'Iter per praecepta longum, per exempla, breve et efficax.',
    'date': '2021-09-11T18:32:57.554Z',
    'emotion': 'sleeping'
  }
];


export const generateFilmDescription = () => getRandomItem(FILMS_DESCRIPTIONS);
export const generateComment = () => getRandomItem(FILMS_COMMENTS);
