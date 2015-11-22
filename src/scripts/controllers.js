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