try {
    window.$ = window.jQuery = require('jquery');
} catch (e) {
	console.log('connect error: '+e);
}

import Dropzone from '../libs/dropzone/dropzone.js'
import LazyLoad from '../libs/lazyload.js'
require('../libs/animate/animate-css.js')
require('../libs/waypoint.js')
require('../libs/Magnific-Popup-master/jquery.magnific-popup.js')
// require('../libs/lazyload.js')
require('./map.js')
// require('../libs/jquery.mb.YTPlayer.min.js')

jQuery(function($) {

	$('.rand').each(function(){
		var $divs = $(this).children('div');
		var arr = [];
		$divs.each(function(){
			arr.push($(this).detach());
		});
		arr.sort(function(a, b){
			return Math.random() - 0.5;
		});
		for (var index in arr) {
			$(this).append(arr[index]);
		}
	});

	var dropzone = new Dropzone('#file-upload', {
		url: 'upload.php',
		addRemoveLinks: true,
		parallelUploads: 1,
		//thumbnailHeight: 120,
		//thumbnailWidth: 120,
		//filesizeBase: 1000,
    	//uploadMultiple: true,
    	acceptedFiles: '.jpg,.jpeg,.png',
		maxFiles: 10,
		maxFilesize: 10,

		
		/**
         * The text used before any files are dropped.
         */
		dictDefaultMessage: '<div class="dz-message needsclick">Вы можете приложить фотографию</div>',

        /**
         * The text that replaces the default message text it the browser is not supported.
         */
        dictFallbackMessage: "Ваш браузер не поддерживает загрузку перетаскиванием",

        /**
         * The text that will be added before the fallback form.
         * If you provide a  fallback element yourself, or if this option is `null` this will
         * be ignored.
         */
        dictFallbackText: "Пожалуйста, используйте резервную форму ниже, чтобы загрузить свои файлы, как в старые добрые времена)",

        /**
         * If the filesize is too big.
         * `{{filesize}}` and `{{maxFilesize}}` will be replaced with the respective configuration values.
         */
        dictFileTooBig: "Слишком большой файл ({{filesize}}Мб). Максимальный размер: {{maxFilesize}}Мб.",

        /**
         * If the file doesn't match the file type.
         */
        dictInvalidFileType: "Вы не можете загрузить файлы этого типа.",

        /**
         * If the server response was invalid.
         * `{{statusCode}}` will be replaced with the servers status code.
         */
        dictResponseError: "Сервер вернул ответ {{statusCode}}.",

        /**
         * If `addRemoveLinks` is true, the text to be used for the cancel upload link.
         */
        dictCancelUpload: "Отменить загрузку",

        /**
         * The text that is displayed if an upload was manually canceled
         */
        dictUploadCanceled: "Загрузка завершена.",

        /**
         * If `addRemoveLinks` is true, the text to be used for confirmation when cancelling upload.
         */
        dictCancelUploadConfirmation: "Вы уверены, что хотите отменить?",

        /**
         * If `addRemoveLinks` is true, the text to be used to remove a file.
         */
        dictRemoveFile: "Удалить файл",

        /**
         * If this is not null, then the user will be prompted before removing a file.
         */
        dictRemoveFileConfirmation: "Хотите удалить файл?",

        /**
         * Displayed if `maxFiles` is st and exceeded.
         * The string `{{maxFiles}}` will be replaced by the configuration value.
         */
		dictMaxFilesExceeded: 'Привышен лимит изображений',

        /**
         * Allows you to translate the different units. Starting with `tb` for terabytes and going down to
         * `b` for bytes.
         */
        dictFileSizeUnits: {
          tb: "Тб",
          gb: "Гб",
          mb: "Мб",
          kb: "Кб",
          b: "байт"
        },



		init: function(){
			$(this.element).html(this.options.dictDefaultMessage);
		},
    	thumbnail: function(file, dataUrl) {
    		if (file.previewElement) {
    			file.previewElement.classList.remove("dz-file-preview");
    			var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
    			for (var i = 0; i < images.length; i++) {
    				var thumbnailElement = images[i];
    				thumbnailElement.alt = file.name;
    				thumbnailElement.src = dataUrl;
    				url = dataUrl;
    			}
    			setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
    		}
    	},
    	success: function(file, response){
    		var res = JSON.parse(response);
    		if (res.answer == 'error') {
    			$('.error-message').append(res.error);
    		}else{
    			this.defaultOptions.success(file);
    		}
    		console.log(res.answer);
    	}
	});

	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		var btnSubmit = th.find('button[type="submit"]');
		btnSubmit.attr("disabled", true);
		var url = window.location.href;
		var replUrl = url.replace('?', '&');
		$.ajax({
			type: "POST",
			url: "/mail.php", //Change
			data: th.serialize() +'&referer=' + replUrl
		}).done(function( data ) {
			// console.log( "success data:", data );
			var res = JSON.parse(data);
			if(res.error) 
				$('.error-message').html(res.error);
			else
				$('.error-message').html("");
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: (res.answer == 'OK') ? '.thanks' : '.error',
						type: 'inline'
					}
				});
				if(res.answer == 'OK') {
					dropzone.removeAllFiles(true);
					th.trigger("reset");
				}
				btnSubmit.removeAttr("disabled");
			}, 100);
		}).fail(function( jqXHR, textStatus ) {
			$('.error-message').html("Request failed: " + textStatus);
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: '.error',
						type: 'inline'
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 100);
		});
		return false;
	});

	// $('.services-item__title').append('<span class="arrow"></span>');

	$("section h2, h2+.descr, .offer-form, .benefit, .replacement-form").animated("fadeInUp", "fadeInUp");
	$("h1, .subtitle, .maps .dealer:nth-child(odd) .dealer-info").animated("fadeInLeft", "fadeInLeft");
	$(".hero-form, .maps .dealer:nth-child(even) .dealer-info").animated("fadeInRight", "fadeInRight");

	// if ($(window).width() > 768) {
	// 	$('.player').mb_YTPlayer();
	// }

	$('.top').click(function() {
		$('html, body').stop().animate({scrollTop: 0}, 'slow', 'swing');
	});
	$(window).scroll(function() {
		if ($(this).scrollTop() > $(window).height()) {
			$('.top').addClass("active");
		} else {
			$('.top').removeClass("active");
		};
	});

	$('.modal-link').magnificPopup({
		type: 'inline',
		fixedContentPos: true,
		preloader: false,
	});

	$('a[href="#popup"]').on('click', function(){
		$('.overlay').show();
		$('.privacy-wrap').show();
		$('html').css({
			'margin-right': '17px',
			'overflow': 'hidden'
		});
		return false;
	});
	$('.overlay, .privacy-close').on('click', function(){
		$('.overlay').hide();
		$('.privacy-wrap').hide();
		$('html').removeAttr('style');
	});

	let images = document.querySelectorAll(".lazyload");
	new LazyLoad(images);

	// jQuery('.lazyload').lazyload();

	//при клике на заголовок ТО
	/* */
	$('.services-item__title').on('click', function() {
		var th = $(this);
		var id = th.prev().attr('id');
		var parent = th.parent();
		// th.closest('.services-item').find('.services-item__car').removeClass('active');
		th.closest('.services-item').find('.serv-table').slideUp(100);

		if (parent.hasClass('active')) {
			parent.removeClass('active');
			th.closest('.services-item').find('.serv-table').removeClass('active');
			th.next().slideUp(100);
		}else{
			th.closest('.services-item').find('.services-item').removeClass('active');
			// th.closest('.services-item').find('.services-item__car--list').slideUp(100);
			parent.addClass('active');
			th.next().slideDown(300);
		}
	});
	/**/

	if(window.location.hash != '') {
		switch(window.location.hash){
			case "#kuzovnoy":
			case "#mehanicheskiy":
			case "#diagnostika":
				$(window.location.hash + ' + .services-item__title').click();
				break
			default:
		}
	}

	//при клике на заголовок модели
	/* * /
	$('.services-item__title').on('click', function(){
		var th = $(this);
		var id = th.attr('id');

		th.closest('.services-item').find('.serv-table').slideUp(100);

		if (th.hasClass('active')) {
			th.removeClass('active');
			// th.closest('.services-item').find('.services-item__car').removeClass('active');
			th.closest('.services-item').find('.serv-table').slideUp(100);
		}else{
			// th.closest('.services-item').find('.services-item__car').removeClass('active');
			th.closest('.services-item').find('.serv-table').slideUp(100);
			th.addClass('active');
			th.closest('.services-item').find('.serv-table[data-id="'+ id +'"]').slideDown(300);
		}

	});
	/**/

	$('a[href="#cheaper"]').on('click', function() {
		var servName = $(this).data('title');
		if(servName) {
			$('#cheaper').find('h3').text(servName);
			$('#cheaper').find('.the-service').val(servName);
		} else {
			$('#cheaper').find('h3').text($(this).text());
			$('#cheaper').find('.the-service').val($(this).text());
		}

	});

	$('a[href="#callbackForm"]').on('click', function(){
		var title = $(this).data('title');
		if(title) 
			$('#callbackForm').find('h2').text(title);
		else
			$('#callbackForm').find('h2').text($(this).text());

	});

	function words (){
		if($(window).width() < 600){
			var eco = 'Эко-<br>ном',
			stndr = 'Стан-<br>дарт',
			stndr2 = 'Стан-<br>дарт+';
		}else{
			var eco = 'Эконом',
			stndr = 'Стандарт',
			stndr2 = 'Стандарт+';
		}
		$('.serv-table-head .serv-table-td:nth-child(2)').html(eco);
		$('.serv-table-head .serv-table-td:nth-child(3)').html(stndr);
		$('.serv-table-head .serv-table-td:nth-child(4)').html(stndr2);
	}
	words();
	$(window).on('resize', function(){
		words();
	});
});