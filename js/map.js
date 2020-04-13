$(function() {

    let maps = [
            {
                parent: '#dealer-map1',
                id: "map1",
                position: [53.193542, 50.292163],
                zoom: 17,
                balloonContentHeader: 'Сервисный центр<br>БУМЕРАНГ-АВТО',
                balloonContentBody: '<a href="tel:88469228872" class="dealer-phone">☎️ 8 (846) 922-88-72</a><br>\
                    <a href="mailto:service@avtobum63.ru" class="dealer-email">📩 service@avtobum63.ru</a><br><br> \
                    пр. Кирова, 10<br>\
                    <a href="https://yandex.ru/maps/?z=17&ll=50.292163,53.19354199999777&l=map&rtext=~53.193542,50.292163&origin=jsapi_2_1_76&from=api-maps"  target="_blank" class="dealer-phone">📍 Проложить маршрут</a><br>',
                balloonContentFooter: 'ежедневно: 8:00 — 20:00',
                hintContent: 'Сервисный центр<br>БУМЕРАНГ-АВТО'
            },
            {
                parent: '#dealer-map2',
                id: "map2",
                position: [53.249726, 50.355324],
                zoom: 17,
                balloonContentHeader: 'Сервисный центр<br>БУМЕРАНГ-АВТО',
                balloonContentBody: '<a href="tel:88469228872" class="dealer-phone">☎️ 8 (846) 922-88-72</a><br>\
                    <a href="mailto:service@avtobum63.ru" class="dealer-email">📩 service@avtobum63.ru</a><br><br> \
                    Аэропортовское шоссе, 1<br>\
                    <a href="https://yandex.ru/maps/?z=17&ll=50.35532399999995,53.24972599999765&l=map&rtext=~53.249726,50.355324&origin=jsapi_2_1_76&from=api-maps"  target="_blank" class="dealer-phone">📍 Проложить маршрут</a><br>',
                balloonContentFooter: 'ежедневно: 9:00 — 18:00',
                hintContent: 'Сервисный центр<br>БУМЕРАНГ-АВТО'
            },
        ],
        start_load_script = false, // Переменная для определения была ли хоть раз загружена Яндекс.Карта (чтобы избежать повторной загрузки при наведении)
        end_load_script = false; // Переменная для определения был ли загружен скрипт Яндекс.Карт полностью (чтобы не возникли какие-нибудь ошибки, если мы загружаем несколько карт одновременно)


    //Функция создания карты сайта и затем вставки ее в блок с идентификатором "map-yandex"
    function init() {
        var myMapTemp = new ymaps.Map(this.id, {
            center: this.position, // координаты центра на карте
            zoom: this.zoom, // коэффициент приближения карты
        });
        myMapTemp.behaviors.disable('scrollZoom');

        var myPlacemarkTemp = new ymaps.Placemark(
            this.position, {
                balloonContentHeader: this.balloonContentHeader,
                balloonContentBody: this.balloonContentBody,
                balloonContentFooter: this.balloonContentFooter,
                hintContent: this.hintContent
            }, {
                preset: 'islands#blueAutoIcon',
                iconColor: '#208fce'
            });
        myMapTemp.geoObjects.add(myPlacemarkTemp); // помещаем флажок на карту

        // Получаем первый экземпляр коллекции слоев, потом первый слой коллекции
        var layer = myMapTemp.layers.get(0).get(0),
            parent = this.parent;

        // Решение по callback-у для определния полной загрузки карты
        waitForTilesLoad(layer).then(function(value) {
            // Скрываем индикатор загрузки после полной загрузки карты
            jQuery(parent).children('.loader').removeClass('is-active');
        });
    }

    // Функция для определения полной загрузки карты (на самом деле проверяется загрузка тайлов) 
    function waitForTilesLoad(layer) {
        return new ymaps.vow.Promise(function(resolve, reject) {
            var tc = getTileContainer(layer),
                readyAll = true;
            tc.tiles.each(function(tile, number) {
                if (!tile.isReady()) {
                    readyAll = false;
                }
            });
            if (readyAll) {
                resolve();
            } else {
                tc.events.once("ready", function() {
                    resolve();
                });
            }
        });
    }

    function getTileContainer(layer) {
        for (var k in layer) {
            if (layer.hasOwnProperty(k)) {
                if (
                    layer[k] instanceof ymaps.layer.tileContainer.CanvasContainer ||
                    layer[k] instanceof ymaps.layer.tileContainer.DomContainer
                ) {
                    return layer[k];
                }
            }
        }
        return null;
    }

    // Функция загрузки API Яндекс.Карт по требованию (в нашем случае при наведении)
    function loadScript(url, callback) {
        var script = document.createElement("script");

        if (script.readyState) { // IE
            script.onreadystatechange = function() {
                if (script.readyState == "loaded" ||
                    script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { // Другие браузеры
            script.onload = function() {
                callback();
            };
        }

        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    // Основная функция, которая проверяет когда мы навели на блок с классом "ymap-container"
    function ymap(map) {
        jQuery(map.parent).one("mouseenter", function() {
            // Показываем индикатор загрузки до тех пор, пока карта не загрузится
            jQuery(map.parent).children('.loader').addClass('is-active');

            if (!start_load_script) { // проверяем первый ли раз загружается Яндекс.Карта, если да, то загружаем

                // Чтобы не было повторной загрузки карты, мы изменяем значение переменной
                start_load_script = true;

                // Загружаем API Яндекс.Карт
                loadScript("https://api-maps.yandex.ru/2.1/?lang=ru_RU&loadByRequire=1", function() {
                    end_load_script = !end_load_script;
                    // Как только API Яндекс.Карт загрузились, сразу формируем карту и помещаем в блок с идентификатором "map-yandex"
                    ymaps.load(init, map);
                });
            } else {
                var check_load = setInterval(function() {
                    if(end_load_script) {
                        clearInterval(check_load);
                        ymaps.load(init, map);
                    } 
                }, 100);
            }
        });
    }

    //Запускаем основную функцию для массива карт
    maps.forEach(function(map){
        ymap(map)
    });
});