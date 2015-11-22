angular.module("DevInt.directives", [])
.directive("devintImageCaro", ["$timeout", function ($timeout) {
	"use strict";
	//
	return {
		restrict: "A",
		scope: false,
		link: function (scope, element, attrs) {

			var img,
				imgbase,
				imgset,
				currImage;

			currImage = 1;

			function changeImage() {
				//
				img.removeClass("curr");

				$timeout(function () {
					img.attr("src", imgbase + currImage + ".png");
				}, 250);

				$timeout(function () {
					img.addClass("curr");
				}, 500);
			}
			element.find("i.fa-angle-left").bind("click", function (ev) {
				//
				if (currImage - 1 === 0) {
					currImage = imgset;
				} else {
					currImage = currImage - 1;
				}
				changeImage();
			});
			element.find("i.fa-angle-right").bind("click", function (ev) {
				//
				if (currImage + 1 > imgset) {
					currImage = 1;
				} else {
					currImage = currImage + 1;
				}
				changeImage();
			});
			scope.$watch("isloading", function () {
				//
				if (scope.isloading === false) {
					imgbase = element.data("imgbase");
					imgset = element.data("imgset");
					img = element.find(".work-img-set img");
				}
			});
		}
	};
}])
.directive("devintImageLoad", function () {
	//
	"use strict";
	
	return {
		scope: false,
		link: function (scope, element, attrs) {
			//
			scope.calcImageLoadingStep(element.width());
			scope.$watch("loaderw", function (val) {
				//
				element.find("#img-load-prog").width(val);
			});
		}
	};
})
.directive("devintScrollPosition", ["$window", function ($window) {
	//
	"use strict";
	
	return {
		
		link: function (scope, element, attrs) {
			var windowEl = angular.element($window),
				height = 0,
				scroll = 0;

			var handler = function () {

				scroll = windowEl.scrollTop();
				height = windowEl.height();

				element.addClass("scrolled-nop");

				if (scroll > height) {

					element.addClass("scrolled-a");
				} else {
					element.removeClass("scrolled-a");
				}

				element.removeClass("scrolled-nop");
			};

			windowEl.on("scroll", handler);
			handler();
		}
	};
}])
.directive("devintAffix", ["$window", function ($window) {
	//
	"use strict";
	
	return {
		
		link: function (scope, element, attrs) {
			//
			var windowEl = angular.element($window),
				scroll = 0,
				height = 0;

			var handler = function () {
				
				scroll = windowEl.scrollTop();
				height = windowEl.height() / 2;

				if (scope.lastscroll > scroll) {
					element.removeClass("affix");
				} else {
					if (scroll > height) {
						element.addClass("affix");
					} else {
						element.removeClass("affix");
					}
				}

				scope.lastscroll = scroll;
			};
			windowEl.bind("scroll", handler);
			handler();
		}
	};
}])
.directive("devintEllipsis", function () {
	//
	"use strict";
	
	return {
		restrict: "A",
		template: "<h4>{{}}</h4>",
		scope : {
			data: "="
		},
		link: function (scope, element, attrs) {
			//
			var elTxt = scope.data;
				
			if (elTxt.length > 100) {
				//
				element.html(elTxt.substring(0, 100) + " ...");
			} else {
				element.html(elTxt);
			}
			
		}
	};
})
.directive("a", function () {
	//
	"use strict";
	
	return {
		restrict: "E",
		link: function (scope, elem, attrs) {
			if (attrs.href === "#_") {

				elem.on("click", function (e) {
					e.preventDefault();
				});
			}
		}
	};
})
.directive("devintSuggest", ["$window", "$timeout", function ($window, $timeout) {
	//
	"use strict";
	
	var toClear = false;

	return {
		replace: true,
		link: function (scope, element, attrs) {
			//
			var box = element.find("span"),
				orient = box.data("orient"),
				tip = box.data("tip");

			box.html(tip);
			box.addClass("orient-" + orient);

			element.bind("mouseenter", function () {
				box.addClass("d-reveal");
				if (toClear) {
					clearTimeout(toClear);
					toClear = false;
				}
				toClear = setTimeout(function () {
					box.removeClass("d-reveal");
				}, 1500);

			});
			element.bind("mouseleave", function () {
				//
				box.removeClass("d-reveal");
			});
		}
	};
}]);