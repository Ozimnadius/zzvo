$('.select').selectize();

function Switches(prop) {
    this.sws = document.querySelector(prop.sws);
    this.width = this.sws.offsetWidth;
    this.swsList = document.querySelectorAll(prop.sw);
    this.line = document.querySelector(prop.line);
    this.tabs = document.querySelectorAll(prop.tab);
    this.tabSelector = prop.tab;
    this.autoWidth = prop.autoWidth || false;

    if (prop.switchActive === false) {
        this.switchActive = false
    } else {
        this.switchActive = true;
    }

    if (prop.scrollbar === false) {
        this.scrollbar = false;
    } else {
        this.scrollbar = true;
    }

    let that = this;

    this.init = function () {
        let $this = that.swsList[0],
            percent = ($this.offsetLeft / that.width) * 100,
            id = $this.dataset.id,
            tab = document.querySelector(that.tabSelector + '[data-id="' + id + '"]');


        for (let i = 0; i < that.swsList.length; i++) {
            that.swsList[i].classList.remove('active');
        }

        for (let i = 0; i < that.tabs.length; i++) {
            that.tabs[i].classList.remove('active');
        }

        tab.classList.add('active');
        $this.classList.add('active');

        if (that.scrollbar) {
            that.line.style.left = percent + '%';

            if (that.autoWidth) {
                let lineWidth = $this.offsetWidth + 'px';
                that.line.style.width = lineWidth;
            }
        }
    };

    for (let i = 0; i < that.swsList.length; i++) {
        that.swsList[i].addEventListener('click', function (e) {

            let percent = (this.offsetLeft / that.width) * 100,
                id = this.dataset.id,
                tab = document.querySelector(that.tabSelector + '[data-id="' + id + '"]');


            for (let i = 0; i < that.swsList.length; i++) {
                that.swsList[i].classList.remove('active');
            }

            for (let i = 0; i < that.tabs.length; i++) {
                that.tabs[i].classList.remove('active');
            }

            tab.classList.add('active');
            this.classList.add('active');

            if (that.scrollbar) {
                that.line.style.left = percent + '%';

                if (that.autoWidth) {
                    let lineWidth = this.offsetWidth + 'px';
                    that.line.style.width = lineWidth;
                }
            }

        });
    }
}

$(function () {
    if(document.querySelector('.sws')) {
        let switches = new Switches({
            sws: '.sws',
            sw: '.sw',
            tab: '.tab',
            autoWidth: false,
            scrollbar: false
        }).init();
    }


    let slider = new Swiper('.slider__container', {
        direction: 'horizontal',
        slidesPerView: 3,
        spaceBetween: 30,
        loop: true,
        navigation: {
            nextEl: '.slider__next',
            prevEl: '.slider__prev',
        }
    });

    let swiperAbout = new Swiper('.about__slider-container', {
        direction: 'horizontal',
        loop: true,
        // If we need pagination
        pagination: {
            el: '.about__pag',
        },
    });


    let countInput = $('.count__input');

    $('.count__down').on('click', function (e) {
        let count = getCount();
        if (count == 1) {
            return;
        }
        count--;
        countInput.val(count);
    });

    $('.count__up').on('click', function (e) {
        let count = getCount();
        count++;
        countInput.val(count);
    });

    function getCount() {
        return parseInt(countInput.val());
    }
});

/*YANDEX*/
$(function ()   {
    ymaps.ready(init);
    var myMap,
        myPlacemark;

    function init() {

        if ($('#map').length) {
            var center = [55.968176568776634,37.197528999999975];

            myMap = new ymaps.Map("map", {
                center: center,
                zoom: 17,
                controls: []
            });


            myMap.behaviors.disable(['scrollZoom']);
            // myMap.controls.remove('geolocationControl')
            //     .remove('searchControl')
            //     .remove('trafficControl')
            //     .remove('typeSelector')
            //     .remove('fullscreenControl')
            //     .remove('zoomControl')
            //     .remove('rulerControl');

            myPin = new ymaps.GeoObjectCollection({}, {
                // iconLayout: 'default#image',
                // iconImageHref: '/img/icons/map-marker.svg',
                // iconImageSize: [46, 57],
                // iconImageOffset: [-15, -55]
            });


            myPlacemark1 = new ymaps.Placemark([55.968176568776634,37.197528999999975], {
                    balloonContentHeader: "ZZVO.RU",
                    balloonContentBody: "Зеленоградский завод вентиляционного оборудования",
                    balloonContentFooter: "Россия, 124365, г.Зеленоград ул. Заводская д. 25 стр.1",
                    hintContent: "ZZVO.RU"
                },
                {
                    preset: "islands#redFactoryIcon",
                    // iconLayout: 'default#image',
                    // iconImageHref: 'images/content/map-pin.svg',
                    // iconImageSize: [75, 90],
                    // iconImageOffset: [-45, -75]
                    // preset: 'islands#redGlyphIcon'
                });



            myPin.add(myPlacemark1);
            myMap.geoObjects.add(myPin);
        }
    }
});
/*END YANDEX*/