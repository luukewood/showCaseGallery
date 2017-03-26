(function(){

	const ShowCase = (function(){

		function _ShowCase(element, settings) {
			this.element = element;

			this.scDefaults = {
				animationTime: 1000,
				leftBtn: 'leftBtn',
				rightBtn: 'rightBtn',
				typeBtns : '<span>',
				cssEasing: 'ease',

        		//'for jquery animation'

		        easing: 'linear',
		        speed: 600,
		        height: '100%',
		        width: '100%',
		        addClass: '',
		        startClass: 'lg-start-zoom',
		        backdropDuration: 150,
		        hideBarsDelay: 6000,
		        useLeft: false,
			};

			this.settings = $.extend({},this,this.scDefaults,settings);

			this.$el = $(element);
			this.$scItems = this.$el.children();

			this.init();
		};

		return _ShowCase;

	})();

	ShowCase.prototype.init = function() {

		if(!$('body').hasClass('sc-run')) {
			this.build();
			$('body').addClass('sc-run');
		}
	
	};

	ShowCase.prototype.build = function() {
		this.$el.urlItems = [];
		this.$el.linkItems = this.$scItems.find('a');
		this.$el.imgItems = this.$el.linkItems.find('img');
	
		this.bindEvents();
	}

	ShowCase.prototype.bindEvents = function() {
		let that = this,
			currentElem = " ";
		
		this.$scItems.on("click", function(e) {
			e.preventDefault();

			currentElemIMG = $(e.currentTarget).find("img");
			that.index = that.$scItems.index(this);
			that.startStructure(currentElemIMG);

		});
	}

	ShowCase.prototype.nextSlide = function() {
		let that = this;
		
		if(that.index < that.$slides.length - 1) {
			that.index++;
			this.initSlide(that.index, "next");
		}
		else {
			that.index = 0;
			this.initSlide(that.index, "next");
		}
	};

	ShowCase.prototype.startStructure = function(currentIMG) {
		let _this = this;
		const $body = $('body');
		
		let createControl = function(c) {
			let control = $(_this.settings.typeBtns, {
				"class" : c
			});
			return control;
		}

		this.createOverlay();

		$(".sc-overlay").addClass("is-on");

		this.$el.structureBase = {
			controls: {
				leftControl: createControl(_this.settings.leftBtn)
					.on("click", function() {
						_this.prevSlide();
					}),
				rightBtn: createControl(_this.settings.rightBtn)
					.on("click", function() {
						_this.nextSlide()
					})
			},
			scItems: '',
			toolbar: this.createToolbar(),
			mainWrapper: $("<div>", {
				"class": "sc-main_wrapper"
			}),
			wrapper: '<div class="sc-wrapper"></div>',
			itemsContainer: '<div class="sc-container"></div>'
		}
		
		for(let i = 0; i < this.$scItems.length; i++) {
			this.$el.structureBase.scItems += '<div class="sc-item"></div>';
		};

		this.$el.structureBase.mainWrapper
			.append(this.$el.structureBase.wrapper)
			.find('.sc-wrapper')
			.append(this.$el.structureBase.itemsContainer)
			.find('.sc-container')
			.append(this.$el.structureBase.scItems)
			.end().append(this.$el.structureBase.toolbar);
		
		$("body").append(this.$el.structureBase.mainWrapper);

		if($(".sc-container").length > 0) {
			$.each(this.$el.structureBase.controls, function(i, elem){
				$(".sc-wrapper").append(elem);
			});
		}

		this.currentElem();
		this.createNewImages(this.$el.structureBase.mainWrapper, currentIMG);
	}

	ShowCase.prototype.createToolbar = function() {
		let _this = this;
		let toolbar = $("<div>", {
			"class" : "sc-toolbar"
		}),
	 	closeBtn = $('<span>', {
			"class" : "close-sc",
			on: {
				"click": function() {
					_this.closeShowCase();
					_this.closeOverlay();
				}
			}
		});

	 	toolbar.append(closeBtn);
		return toolbar;
	}

	ShowCase.prototype.createNewImages = function(holderIMG, currentElemIMG) {
		let newImages = [];
		let _tempIMGholder = holderIMG.find(".sc-item");
		let _this = this;

		this.$el.imgItems.each(function(key, elem) {
			let newIMG = $("<img>", {
				"class": "test",
				"src" : $(elem).attr("src")
			});

			newIMG.on("load", function() {
				$(_tempIMGholder[key]).append(newIMG);

				let currentCreatedElem = filterForIMG();

				currentCreatedElem.find(this).show();
			});
		});

		// let getPrevAndNext = function(currentScItem) {
		// 	let next = currentScItem.next(),
		// 		prev = currentScItem.prev();
		// 					var _prevIndex = $(".sc-container").find('.current').index();
		// 	_this.$slides.eq(_prevIndex).addClass("prev-slide");
		// 	_this.$slides.eq(_this.index).addClass("next-slide");

		// 	if(next.length == 0) {
		// 		// currentScItem.find("img").end().fadeOut();
		// 		// _tempIMGholder.first().fadeIn().find("img").fadeIn();
		// 	} else if(prev.length == 0) {
		// 		// currentScItem.find("img").end().fadeOut();
		// 		// _tempIMGholder.last().fadeIn().find("img").fadeIn();
		// 	}

		// }

		let filterForIMG = function() {
			let currentIMG = _tempIMGholder.filter(function (){
					let thisIMG = $(this).find("img");
					return thisIMG.attr("src") === $(currentElemIMG).attr("src");
			});
			return currentIMG;
		}
	}

	ShowCase.prototype.currentElem = function() {
		$scContainer = $(".sc-container");

		this.$slides = $scContainer.find(".sc-item");

		this.$slides.eq(this.index).addClass("current");
	}

	ShowCase.prototype.initSlide = function(currentIndex, direction) {
		let _prevIndex = $(".sc-container").find('.current').index(),
			_this = this,
			prevSlides = this.$slides.eq(_prevIndex - 1),
			nextSlides = this.$slides.eq(_prevIndex + 1);

		if(direction == "next") {

			prevSlides.removeClass("prev-slide");
			nextSlides.removeClass("next-slide");
			
			this.$slides.eq(_prevIndex).addClass("prev-slide");
			this.$slides.eq(currentIndex + 1).addClass("next-slide");

			setTimeout(function() {
                _this.$slides.removeClass('current');
                console.log(currentIndex, "Dzialam");

                //_this.$slide.eq(_prevIndex).removeClass('lg-current');
                _this.$slides.eq(currentIndex).addClass('current');

                // reset all transitions
                // _this.$outer.removeClass('lg-no-trans');
            }, 50);
		}
	}



	ShowCase.prototype.loadContent = function() {
		

		$('.sc-overlay').addClass('is-on');
		$('body').append(this.$el.structureBase.mainWrapper);

		for(let i = 0; i < this.$scItems.length; i++) {
			$('.sc-container').children()[i].append(this.$el.imgItems[i]);
		}
	}

	ShowCase.prototype.createOverlay = function() {
			$('body')
				.append('<div class="sc-overlay"></div>')
				.css('transition-duration', this.scDefaults.backdropDuration + 'ms')
	}

	ShowCase.prototype.closeShowCase = function() {
		$(".sc-main_wrapper").remove();
	}

	ShowCase.prototype.closeOverlay = function() {
		// $(".sc-overlay").remove();
	}

	$.fn.ShowCase = function(options) {
		return this.each(function(index, el) {
			el.ShowCase = new ShowCase(el, options);
		});
	};

})();

