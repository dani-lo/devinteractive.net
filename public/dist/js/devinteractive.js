angular.module("DevInt", [
    "ngRoute",
    "angularModalService",
    "DevInt.controllers",
    "DevInt.filters",
    "DevInt.services",
    "DevInt.directives"
])
.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {
//
    "use strict";
//
    $routeProvider
    .when("/app/home", {
        templateUrl: "partials/home",
        controller: "HomeCtrl"
    })
    .when("/app/jobs", {
        templateUrl: "partials/jobs",
        controller: "JobsCtrl"
    })
    .when("/app/experience", {
        templateUrl: "partials/cv",
        controller: "CvCtrl"
    })
    .when("/login", {})
    .otherwise({
        redirectTo: "/app/home"
    });
    //
    $locationProvider.html5Mode(true);
}])
.constant("APPCONFIG", {
    version: "0.1",
    imgBase: "/img",
    imgExtension: ".png",
    fetchTimeout: 20000,
    endpoints : {
        jobs : {
            list: "/api/jobs",
            type: "GET"
        },
        user: {
            login :  "/login/local",
            type: "POST"
        },
        images : {
            list: "/api/images",
            type: "GET"
        },
        experience : {
            list : "/api/experience",
            type: "GET"
        }
    }
});
angular.module("DevInt.controllers", [])
.controller("HomeCtrl", ["$scope",  function ($scope) {
	//
	"use strict";
	//
	$scope.isloading = true;
	$scope.isready = false;
	$scope.isdone = false;

	setTimeout(function () {
		$scope.isready = true;
		$scope.isloading = false;
		$scope.$apply();

		setTimeout(function () {
			$scope.isdone = true;
			$scope.$apply();
		}, 1000);
	}, 1000);

}])
.controller("JobsCtrl", ["$scope", "$window", "$timeout", "JobsDataService", "APPCONFIG", "JobsImagesService", "UserMsgService", function ($scope, $window, $timeout, JobsDataService, APPCONFIG, JobsImagesService, UserMsgService) {
	//
	"use strict";

	var self = this;

	this.imagesloaded = 0;
	this.totalImages = 0;
	this.loaderwidth = 0;

	$scope.jobs = [];
	$scope.isloading = true;
	$scope.loaderw = 0;
	$scope.cmsactive = false;

	$scope.calcImageLoadingStep = function (loaderWidth) {
		// 
		self.loaderwidth = loaderWidth;
	};

	this.imageloaded = function () {
		//
		self.imagesloaded++;

		$scope.loaderw = (self.loaderwidth / self.totalImages) * self.imagesloaded;
		
		if (self.imagesloaded === self.totalImages) {
			setTimeout(function () {
				//
				$scope.isloading = false;
				$scope.$apply();
				setTimeout(function () {
					//
					$scope.isdone = true;
					$scope.$apply();
				}, 1000);
			}, 500);
		}
	};

	this.getJobs = function () {
		//
		JobsDataService.getJobs().then(function (res) {
			//
			$scope.jobs = res.data;

			for (var i = 0; i < res.data.length; i++) {
				//
				self.totalImages += res.data[i].images;

				self.preloadImages(res.data[i].alias, res.data[i].images);
			}
		});
	};
	//
	this.preloadImages = function (alias, images) {
		//
		for (var i = 1; i <= images; i++) {
			JobsImagesService.preloadImage(alias, i)
						.then(self.imageloaded);
		}
	};

	this.getJobs();

	// menu functionality
	$scope.menu = false;

	$scope.showMenu = function () {
		//
		$scope.menu = true;
	};
	$scope.hideMenu = function () {
		//
		$scope.menu = false;
		$scope.cmsactive = false;
	};
	$scope.logout = function () {
		//
		UserMsgService.showMsg("You are being redirected", "Good bye!", "success", "flash-show");
		
		$timeout(function () {
			//
			$window.location.href = "/logout";
		}, 2000);
	};
	$scope.cms = function () {
		//
		$scope.cmsactive = $scope.cmsactive ? false : true;
		
		if ($scope.cmsactive === true) {
			//
			UserMsgService.showMsg("You will not be ble to add users", "Permissions error", "fail", "flash-show");
		}
	};
}])
.controller("AccountCtrl", ["$scope", "$timeout", "$window", "APPCONFIG", "UserAccountService", "UserMsgService", function ($scope, $timeout, $window, APPCONFIG, UserAccountService, UserMsgService) {
	//
	"use strict";
	
	var self = this;

	$scope.loggedin = false;
	$scope.ready = false;

	$scope.user = {
		email: "",
		password: ""
	};

	$timeout(function () {
		$scope.ready = true;
		$scope.$apply();
	}, 500);

	$scope.postLogin = function () {
		//
		self.postLogin();
	};

	this.postLogin = function () {
		//
		UserAccountService.userLogin($scope.user).then(function (res) {
			
			var d = res.data;

			if (d.status === "success") {
				//
				UserMsgService.showMsg("Login successsful, you are now being redirected", "Login Success", "success", "flash-show");

				$scope.ready = false;

				$timeout(function () {
					//
					$window.location.href = "/app/home";
				}, 2000);
			} else {
				//
				UserMsgService.showMsg(d.text, "Login Error", "fail", "flash-show");

				self.resetLoginForm();
			}
		});
	};

	this.resetLoginForm = function () {
		//
		angular.copy({}, $scope.user);
		$scope.loginlocal.$setPristine();
		$scope.loginlocal.$setUntouched();
		var phase = $scope.$root.$$phase;
        if (phase !== "$apply" && phase !== "$digest") {
			$scope.$apply();
		}
	};
}])
.controller("CvCtrl", ["$scope", "$timeout", "$window", "CvDataService", "UserMsgService", function ($scope, $timeout, $window, CvDataService, UserMsgService) {
	//
	"use strict";

	$scope.experience = [];
	$scope.isloading = true;
	$scope.cmsactive = false;

	// menu functionality
	$scope.menu = false;

	$scope.isactivepos = false;
	$scope.currpos = {
		cdesc: "",
		cname: "",
		date: "",
		description: [],
		tech: "",
		title: "",
		urls: []
	};

	$scope.showMenu = function () {
		//
		$scope.menu = true;
	};
	$scope.hideMenu = function () {
		//
		$scope.menu = false;
		$scope.cmsactive = false;
	};
	$scope.logout = function () {
		//
		UserMsgService.showMsg("You are being redirected", "Good bye!", "success", "flash-show");
		
		$timeout(function () {
			//
			$window.location.href = "/logout";
		}, 2000);
	};
	$scope.cms = function () {
		//
		$scope.cmsactive = $scope.cmsactive ? false : true;
		
		if ($scope.cmsactive === true) {
			//
			UserMsgService.showMsg("You will not be ble to add users", "Permissions error", "fail", "flash-show");
		}
	};

	$scope.showPos = function (posId) {
		//
		$scope.currpos = $scope.experience.filter(function (pos) {
			return pos._id === posId;
		})[0];

		console.log($scope.currpos);

		$scope.isactivepos = true;
	};

	$scope.hidePos = function () {
		//
		$scope.isactivepos = false;
	};

	this.getCv = function () {
		//
		CvDataService.getExperience().then(function (res) {
			//
			$scope.experience = res.data;

			$timeout(function () {
				$scope.isloading = false;
				$timeout(function () {
					$scope.uiready = true;
				}, 200);
			}, 500);
		});
	};

	this.getCv();

}]);
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
angular.module("DevInt.filters", [])
	.filter("interpolate", ["APPCONFIG", function (APPCONFIG) {
		//
		"use strict";

		return function (text) {
			return String(text).replace(/\%VERSION\%/mg, APPCONFIG.version);
		};
	}]);
angular.module("DevInt.services", [])
	.factory("JobsDataService", ["$http", "APPCONFIG", "ModalService", function ($http, APPCONFIG, ModalService) {
		//
		"use strict";

		return {
			getJobs: function () {
				return $http.get(APPCONFIG.endpoints.jobs.list);
			}
		};
	}])

	.factory("CvDataService", ["$http", "APPCONFIG", function ($http, APPCONFIG) {
		//
		"use strict";

		return {
			getExperience: function () {
				return $http.get(APPCONFIG.endpoints.experience.list);
			}
		};
	}])
	.factory("JobsImagesService", ["$q", "APPCONFIG", function ($q, APPCONFIG) {
		//
		"use strict";

		return {
			preloadImage: function (alias, i) {
				//
				var img;

				return $q(function (resolve, reject) {
					//
					img = new Image();
					img.src = APPCONFIG.imgBase + "/" + alias + "/" + i + APPCONFIG.imgExtension;
					img.onload = function () {
						resolve();
					};

					setTimeout(function () {
						//
						reject();
					}, APPCONFIG.fetchTimeout);
				});
			}
		};
	}])
	.service("UserMsgService", ["$window", "ModalService", "$timeout", function ($window, ModalService, $timeout) {
		//
		"use strict";

		return {
			showMsg: function (message, title, status, animCname, cb, cbscope) {
				if (title) {
					ModalService.showModal({
						template: "<div class='flash-msg {{msg.status}}'><div><h2>{{msg.title}}</h2><p>{{msg.message}}</p></div></div>",
						controller: ["close", function (close) {
							this.title = title;
							this.message = message;
							this.status = status || "success";
							$timeout(function () {
								close("ok");
								if (cb && cb.scope) {
									cb.call(cbscope);
								}
							}, 2000);
						}],
						controllerAs : "msg"
					}).then(function (modal) {
						if (animCname) {
							$timeout(function () {
								modal.element.addClass(animCname);
							}, 250);
						}
					});
				} else {
					$window.alert(message);
				}
			}
		};
	}])
	.service("UserAccountService", ["$http", "APPCONFIG", function ($http, APPCONFIG) {
		//
		"use strict";

		return {
			userLogin: function (user) {
				return $http.post(APPCONFIG.endpoints.user.login, user);
			},
			userAdd: function (user) {
				return $http.post(APPCONFIG.endpoints.users.add, user);
			}
		};
	}]);
	