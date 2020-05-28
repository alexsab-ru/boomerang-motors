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

	$('#file-upload').dropzone({
		url: 'upload.php',
		//parallelUploads: 1,
		//thumbnailHeight: 120,
		//thumbnailWidth: 120,
		maxFiles: 1,
		maxFilesize: 1,
		dictMaxFilesExceeded: 'Привышен лимит изображений',
		init: function(){
			$(this.element).html(this.options.dictDefaultMessage);
		},
		dictDefaultMessage: 'Кликните или перетащите файл сюда',
		//filesizeBase: 1000,
    	//uploadMultiple: true,
    	acceptedFiles: '.jpg,.jpeg,.png',
    	success: function(file, response){
    		// console.log(file);
    		console.log(response);
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
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: (data == 'OK') ? '.thanks' : '.error',
						type: 'inline'
					}
				});
				if(data == 'OK'){
					th.trigger("reset");
				}
				btnSubmit.removeAttr("disabled");
			}, 1000);
		}).fail(function() {
			setTimeout(function() {
				$.magnificPopup.close();
				$.magnificPopup.open({
					items: {
						src: '.error',
						type: 'inline'
					}
				});
				btnSubmit.removeAttr("disabled");
			}, 1000);
		});
		return false;
	});

	$("section h2, h2+.descr, .offer-form, .benefit, .replacement-form").animated("fadeInUp", "fadeInUp");
	$("h1, .subtitle, .maps .dealer:nth-child(odd) .dealer-info").animated("fadeInLeft", "fadeInLeft");
	$(".hero-form, .maps .dealer:nth-child(even) .dealer-info").animated("fadeInRight", "fadeInRight");

	if ($(window).width() > 768) {
		$('.player').mb_YTPlayer();
	}

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

	$('.lazyload').lazyload();

	//при клике на заголовок ТО
	/* */
	$('.services-item__title').on('click', function(){
		var th = $(this);
		var id = th.attr('id');
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

	$('a[href="#cheaper"]').on('click', function(){
		var servName = $(this).data('title');
		if(servName) 
			$('#cheaper').find('h3').text(servName);
		else
			$('#cheaper').find('h3').text($(this).text());

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