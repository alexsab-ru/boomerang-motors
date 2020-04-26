		scripts: {
			src: [
				base.newstreetpunk_service_avtobum + '/libs/jquery/dist/jquery.min.js',
				base.newstreetpunk_service_avtobum + '/libs/Magnific-Popup-master/jquery.magnific-popup.js',
				base.newstreetpunk_service_avtobum + '/libs/animate/animate-css.js',
				base.newstreetpunk_service_avtobum + '/libs/jquery.mb.YTPlayer.min.js',
				base.newstreetpunk_service_avtobum + '/libs/lazyload.min.js',
				base.newstreetpunk_service_avtobum + '/libs/waypoint.js',
				base.newstreetpunk_service_avtobum + '/js/map.js',
				base.newstreetpunk_service_avtobum + '/js/service-common.js', // Custom scripts. Always at the end
			],
			dest:       base.newstreetpunk_service_avtobum + '/js',
			output:     'scripts.min.js',
		},
