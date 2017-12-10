/*
	Snapshot by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

(function($) {

	skel.breakpoints({
		xlarge: '(max-width: 1680px)',
		large: '(max-width: 1280px)',
		medium: '(max-width: 980px)',
		small: '(max-width: 736px)',
		xsmall: '(max-width: 480px)'
	});

	$(function() {

		var	$window = $(window),
			$body = $('body');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading'); 
					
					$.get( "cookie_statement.html", function( cookie_statement ) {
						$("#main").prepend( cookie_statement );
					});
				
				}, 1000); // to be 100% sure everything is done 
			});

		// Fix: Placeholder polyfill.
			$('form').placeholder();

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Scrolly.
			$('.scrolly').scrolly();

		// Gallery.
			$('.gallery').each(function() {

				var	$gallery = $(this),
					$content = $gallery.find('.content');

				// Poptrox.
				/*
					$content.poptrox({
						usePopupCaption: true
					});
				*/

				// Tabs.
					$gallery.each( function() {

						var $this = $(this),
							$tabs = $this.find('.tabs a'),
							$media = $this.find('.media');

						$tabs.on('click', function(e) {

							var $this = $(this),
								tag = $this.data('tag');

							// Prevent default.
							 	e.preventDefault();

							// Remove active class from all tabs.
								$tabs.removeClass('active');

							// Reapply active class to current tab.
								$this.addClass('active');

							// Hide media that do not have the same class as the clicked tab.
								$media
									.fadeOut('fast')
									.each(function() {

										var $this = $(this);

										if ($this.hasClass(tag))
											$this
												.fadeOut('fast')
												.delay(200)
												.queue(function(next) {
													$this.fadeIn();
													next();
												});

									});

						});

					});


			});
		
			if( window.location.href.indexOf("index.html") >= 0 ){
				$.get( "images.json", function( fullImages ) {
					
					var thumbnailsLink = fullImages["thumbnails"];
					
					$.get( thumbnailsLink, function( thumbnails ) {
						
						_.forOwn(fullImages, function(value, key) {
							
							if( key == "thumbnails" )
								return;
							
							var container = $("#contentContainer");
							
							var thumbnail = thumbnails[key];
							if( !thumbnail )
								thumbnail = value.img;
							else
								thumbnail = thumbnail.img; 
							
							var media = "";
							media += '<div class="media">';
							
								media += '<a href="'+ value.img +'">';
									media += '<img src="'+ thumbnail +'" alt="" title="'+ value.text +'" />';
								media += '</a>';
								
								media += '<a data-poptrox="ignore" class="closeupLink" href="closeup.html?closeupID='+ key +'"><span class="icon fa-external-link-square"></span></a>';
							
							media += '</div>';
							
							container.append(media);
						});
						
						$content = $('.gallery').find('.content');

						// Poptrox.
						$content.poptrox({
							usePopupCaption: true
						});
					});
				});
			}
			else{ // closeup
			
				$.get( "images.json", function( fullImages ) {
					
					var urlParams = new URLSearchParams(window.location.search);
					var currentImageID = urlParams.get("closeupID");
					
					if( !currentImageID )
						currentImageID = "01";
					
					var img = fullImages[ currentImageID ];
					if( !img ){
						currentImageID = Object.keys(fullImages)[0]; 
						img = fullImages[ currentImageID ];
					}
					
					var prevID = undefined;
					var nextID = undefined;
					var keys = Object.keys(fullImages); 
					keys.splice( keys.indexOf("thumbnails"), 1 );
					
					for( var i = 0; i < keys.length; ++i ){
						if( keys[i] == currentImageID ){
							if( i > 0 )
								prevID = keys[i - 1];
							if( i < (keys.length - 1) )
								nextID = keys[i + 1];
						}
					}
					
					$($(".gallery").find(".special").find("h2")[0]).html("" + img.text);
					
					var container = $("#contentContainer");
					var media = "";
					media += '<div class="closeup">';
					
						//media += "<h3>" + img.text + "</h3>";
						media += '<img src="'+ img.img +'" alt="" title="'+ img.text +'" />';
					
					media += '</div>';
					
					container.append(media);
					
					if( prevID ){
						$("#prevCloseup").attr("href", "closeup.html?closeupID=" + prevID);
						$("#prevCloseup").show();
					}
					if( nextID ){
						$("#nextCloseup").attr("href", "closeup.html?closeupID=" + nextID);
						$("#nextCloseup").show();
					}
				});
			}
		
		
		
		
		
		$("#nav-right a").click(function(evt){
			evt.preventDefault();
			
			var equate = function(parentContainer, fontSize){
				
				parentContainer.find("li").each( function(i){
					
					var maxWidth = 10 * fontSize; // 10em
					var offsetWidth = parentContainer[0].offsetWidth;
					var currenWidth = maxWidth - offsetWidth;
					
					$(this).css("margin-left", "-" + currenWidth + "px");
				});
			};
			
			var expand = function(){
				var navleft = $("#nav-left");
				navleft.attr("expanding", true);
				
				$("#hamburger").addClass("active");
				
				var fontSize = parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
				var currentWidth = navleft[0].offsetWidth / fontSize; // in em 
				
				if( currentWidth > 10 ){
					navleft.attr("expanding", false);
					navleft.attr("expanded", true);
					return;
				}
				
				navleft.css("width", (currentWidth + 0.35) + "em");
				
				equate(navleft, fontSize);
				
				setTimeout( expand, 3 );
			};
			
			var contract = function(){
				var navleft = $("#nav-left");
				navleft.attr("expanding", false); // shouldn't be needed, but just to be sure 
				navleft.attr("expanded", false);
				
				var fontSize = parseFloat(getComputedStyle(document.querySelector('body'))['font-size']);
				var currentWidth = navleft[0].offsetWidth / fontSize; // in em 
				
				if( currentWidth < 1 ){
					navleft.css("width", "0px");
					equate(navleft, fontSize);
					return;
				}
				
				$("#hamburger").removeClass("active");
				
				navleft.css("width", (currentWidth - 0.35) + "em");
				
				equate(navleft, fontSize);
				
				setTimeout( contract, 3 );
				
			};
			
			if( $("#nav-left").attr("expanded") == "true" )
				contract();
			else if( $("#nav-left").attr("expanding") != "true" )
				expand();
		});

	});
	
	window.onscroll = function () {
		$("#nav").css("padding-top", document.documentElement.scrollTop + "px");
	};

})(jQuery);