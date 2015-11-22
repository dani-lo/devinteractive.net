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
	