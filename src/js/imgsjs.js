/* 
imgSjs (javascript image slider)
	author: djra
	email: rakonjac.djordje@gmail.com
	copyright: MIT License 

*/

var IMGS = IMGS || {};

if(!IMGS.$) {
	IMGS.$ = $; 
}

IMGS.createImageSlider = function(domNode) {
	'use strict';
	/* wrapper dom element */
	var wrapper,

	/* imgDiv dom element */
	imgDiv,

	/* img dom element */
	img,

	/* arrow right (ctrlForward) dom element */
	ctrlBack,

	/* arrow left (ctrlBack) dom element */
	ctrlForward,

	/* index of current image in array of images
		 we increment or decrement this counter on 
		 ctrlForward / ctrlBack callback execution 
	*/
	index = 0,

	/* timer reference */
	timer,

	/* pass true in init function to use fade effect 
		before image enters the scene */
	effects,

	/* effects fadeIn duration in miliseconds */
	fadeDuration = 300,

	/* autoPlay delay in miliseconds	*/
	delay = 5000,

	/* Array of images we want to show,
		 setImageArray function should be called to
		 populate this array. Another way is to pass array
		 in init funcition after slider creation.
		 
		 expected imageArray format: 
		[
			{ url: 'img/i1.jpg' },
			{ url: 'img/i2.jpg' },
			{ url: 'img/i3.jpg' },
			{ url: 'img/i4.jpg' }
		];
	*/
	imageArray,

	setDefaultClasses = function(arr, node) {
		IMGS.$.each(arr, function(k,v) {
			IMGS.$(node).addClass(v);
		});
	},
	createDomStructure = function() {
		imgDiv.appendChild(ctrlForward);
		imgDiv.appendChild(ctrlBack);
		wrapper.appendChild(imgDiv);
		setDefaultClasses(['imgsjs', 'wrapper'], wrapper);
		setDefaultClasses(['imgsjs', 'cursorBusy'], imgDiv);
		setDefaultClasses(['imgsjs', 'ctrlBack'], ctrlBack);
		setDefaultClasses(['imgsjs', 'ctrlForward'], ctrlForward);
	},
	showImage = function(div, img) {
		/* remove states */
		IMGS.$(div).removeClass('forward');
		IMGS.$(div).removeClass('backward');
		
		div.appendChild(img);

		/* use effects (image transitions) */
		if(effects) {
			IMGS.$(img).hide();
			IMGS.$(img).fadeIn(fadeDuration);
		}
	},
	loadImage = function() {

		img.onload = (function(div, img) {
		if(IMGS.$(imgDiv).hasClass('forward')) {
			index = (index + 1) % (imageArray.length);
		} else if(IMGS.$(imgDiv).hasClass('backward')) {
			index = (index - 1);
			if(index < 0) {
				index = imageArray.length - 1;
			}
		}

			return showImage(div, img);
		})(imgDiv, img);

		img.src = imageArray[index].url;
	},
	createImage = function() {
		
		img = document.createElement('img');
		img.onload = (function(div, img) {
			return showImage(div, img);
		})(imgDiv, img);

		setDefaultClasses(['imgsjs', 'img'], img);		
		img.src = imageArray[index].url;
	},
	autoPlay = function() {
		timer = setInterval(function() {
			if(!IMGS.$(imgDiv).hasClass('eventsDisabled')) {
				IMGS.$(ctrlForward).trigger('click');
			}
		}, delay, ctrlForward, imgDiv);
	};
	var that = {
		init: function(sliderImgs, useEffects) {
			/* initialise imageArray */
			imageArray = sliderImgs;
			effects = useEffects;

			/* initial hook to domNode and apply cursor */
			wrapper = document.createElement('div');
			imgDiv = document.createElement('div');
			ctrlBack = document.createElement('div');
			ctrlForward = document.createElement('div');
			
			createDomStructure();
			/* bind onClick callback to ctrlForward Dom element */
			IMGS.$(ctrlForward).on('click', function() {
				IMGS.$(imgDiv).addClass('forward');				
				loadImage();
			});			

			/* bind onClick callback to ctrlForward Dom element */
			IMGS.$(ctrlBack).on('click', function() {
				IMGS.$(imgDiv).addClass('backward');				
				loadImage();
			});

			/* on mouse enter, block click events */
			IMGS.$(imgDiv).on('mouseenter', function() {
				IMGS.$(imgDiv).addClass('eventsDisabled');
			});

			/* on mouse out, enable click events */
			IMGS.$(imgDiv).on('mouseleave', function() {
				IMGS.$(imgDiv).removeClass('eventsDisabled');
			});


			/* hook to domNode our structure */
			domNode.appendChild(wrapper);

			/* create image and assign callback upon download */
			createImage();
		},
		setImageArray: function(imgs) {
			imageArray = imgs;
		},
		startAutoPlay: function(msec) {
			if(msec) {
				delay = msec;
			}
			autoPlay();
		},
		stopAutoPlay: function() {
			clearInterval(timer);
		},
		setFadeDuration: function(msec) {
			if(msec) {
				fadeDuration = msec;
			}
		}
	};

	return that;
};



