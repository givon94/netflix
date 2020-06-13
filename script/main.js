
const DBService = class {
    getData = async (url) => {
        const res = await fetch(url);
        if (res.ok) {
            return res.json();
        } else {
            throw new Error(`'Не удалось получить данные по адресу ${url}'`);
        }
    }

    getTestData = async () => {
        return await this.getData('test.json');
    }
}


new DBService().getTestData().then((data) => {
    console.log(data);
});



const leftMenu = document.querySelector('.left-menu'),
    hamburger = document.querySelector('.hamburger'),
    tvShowList = document.querySelector('.tv-shows__list'),
    modal = document.querySelector('.modal');



hamburger.addEventListener('click', () => {
    leftMenu.classList.toggle('openMenu');
    hamburger.classList.toggle('open');
});


document.addEventListener('click', event => {    
    if (!event.target.closest('.left-menu')) {
        leftMenu.classList.remove('openMenu');
        hamburger.classList.remove('open');
    }
});


leftMenu.addEventListener('click', event => {
    const target = event.target;
    const dropdown = target.closest('.dropdown');
    if(dropdown) {
        dropdown.classList.toggle('active');
        leftMenu.classList.add('openMenu');
        hamburger.classList.add('open');
    }    
});


tvShowList.addEventListener('click', event => {
    event.preventDefault();

    const target = event.target;
    const card = target.closest('.tv-card');
    
    if (card) {
        document.body.style.overflow = 'hidden';
        modal.classList.remove('hide');
    }
})


modal.addEventListener('click', event => {
    if (event.target.closest('.cross') || event.target.classList.contains('modal')) {
        document.body.style.overflow = '';
        modal.classList.add('hide');
    }
});



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




