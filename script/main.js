const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';


const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal'),
    modalContent = document.querySelector('.modal__content'),
    tvShows = document.querySelector('.tv-shows'),
    tvCardImg = document.querySelector('.tv-card__img'),
    modalTitle = document.querySelector('.modal__title'),
    genresList = document.querySelector('.genres-list'),
    rating = document.querySelector('.rating'),
    description = document.querySelector('.description'),
    modalLink = document.querySelector('.modal__link'),
    searchForm = document.querySelector('.search__form'),
    searchFormInput = document.querySelector('.search__form-input'),
    preloader = document.querySelector('.preloader'),
    dropdown = document.querySelectorAll('.dropdown'),
    tvShowsHead = document.querySelector('.tv-shows__head'),
    posterWrapper = document.querySelector('.poster__wrapper');

const loading = document.createElement('div');
loading.classList.add('loading');



const DBService = class {

    constructor() {
        this.SERVER = 'https://api.themoviedb.org/3';
        this.API_KEY = '582589559e9a4e59b14234b4bf0993be';
    }

    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`Не удалось получить данные по адресу ${url}`);
        }
    }

    getTestData = () => {
        return this.getData('test.json');
    }

    getTestCard = () => {
        return this.getData('card.json');
    }

    getSearchResult = query => {
        return this.getData(`${this.SERVER}/search/tv?api_key=${this.API_KEY}&language=ru-RU&include_adult=true&query=${query}`);
    }

    getTvShow = id => {
        return this.getData(`${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=ru-RU`);
    }
}



const renderCard = responce => {
    tvShowList.textContent = '';

    if (!responce.total_results) {
        loading.remove();
        tvShowsHead.textContent = 'К сожалению по вашему запросу ничего не найдено...';
        tvShowsHead.style.cssText = 'color: red;'
        return;
    }

    tvShowsHead.textContent = 'Результат поиска:';
    tvShowsHead.style.cssText = 'color: black;'

    responce.results.forEach(item => {
        const { 
            backdrop_path: backdrop, 
            name: title, 
            poster_path: poster, 
            vote_average: vote,
            id
        } = item;

        const posterIMG = poster ? IMG_URL + poster : 'img/no-poster.jpg';
        const backdropIMG = backdrop ? IMG_URL + backdrop : '';
        const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

        const card = document.createElement('li');
        card.idTV = id;
        card.classList.add('tv-shows__item');
        card.innerHTML = `
            <a href="#" id="${id}" class="tv-card">
                ${voteElem}
                <img class="tv-card__img"
                    src="${posterIMG}"
                    data-backdrop="${backdropIMG}" 
                    alt=${title}>
                <h4 class="tv-card__head">${title}</h4>
            </a>
        `;

        loading.remove();
        tvShowList.append(card);
    });
}


searchForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = searchFormInput.value.trim();

    if (value) {
        tvShows.append(loading);
        new DBService().getSearchResult(value).then(renderCard);
    }
    searchFormInput.value = '';
});


// открытие/закрытие окна
const closeDropdown = () => {
    dropdown.forEach(item => {
        item.classList.remove('active');
    })
}


hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});


document.addEventListener('click', event => {    
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
        closeDropdown();
    }
});


// открытие модального окна
leftMenu.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if(dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }

    if (target.closest('#top-rated')) {
        console.log('top-rated')
    }
    if (target.closest('#popular')) {
        console.log('popular')
    }
    if (target.closest('#week')) {
        console.log('week')
    }
    if (target.closest('#today')) {
        console.log('today')
    }


});


tvShowList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if (card) {
        preloader.style.display = 'block';

        new DBService()
            .getTvShow(card.id)
            .then(data => {
                if (data.poster_path) {
                    tvCardImg.src = IMG_URL + data.poster_path;
                    tvCardImg.alt = data.name;
                    posterWrapper.style.display = '';
                    modalContent.style.padding = '';
                    
                } else {
                    posterWrapper.style.display = 'none';
                    modalContent.style.padding = '35px 50px';
                }

                modalTitle.textContent = data.name;
                //genresList.innerHTML = data.genres.reduce((acc, item) => `${acc} <li>${item.name}</li>`, '');
                genresList.textContent = '';
                for (const item of data.genres) {
                    genresList.innerHTML += `<li>${item.name}</li>`;
                }
                rating.textContent = data.vote_average;
                description.textContent = data.overview;
                modalLink.href = data.homepage;
            })
            .then(() => {
                document.body.style.overflow = 'hidden';
                modal.classList.remove('hide');
            })
            .finally(() => {
                preloader.style.display = '';
            })
    }
})

// закрытие
modal.addEventListener('click', event => {
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});


// смена карточки
const changeImage = event => {
    const card = event.target.closest('.tv-shows__item');

    if (card) {
        const img = card.querySelector('.tv-card__img');
        const changeImg = img.dataset.backdrop;

        if (img.dataset.backdrop) {
            [img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
        }
    }
};



tvShowList.addEventListener('mouseover', changeImage);
tvShowList.addEventListener('mouseout', changeImage);




