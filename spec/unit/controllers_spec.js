describe("Devint Controllers", function() {

	"use strict";

	beforeEach(module("DevInt"));

	var createController,
		appConfig,
		$rootScope,
		mockBackend;

	beforeEach(inject(function($controller, $injector, $httpBackend) {
		//
		appConfig = $injector.get("APPCONFIG");

		mockBackend = $httpBackend;

		$rootScope = $injector.get("$rootScope");

		createController = function(ctrl) {
			return $controller(ctrl, {"$scope" : $rootScope });
		};
	}));


	it("should be defined", function () {
		//
		var jobscontroller, cvcontroller;

		jobscontroller = createController("JobsCtrl");
		cvcontroller = createController("CvCtrl");

		expect(jobscontroller).toBeDefined();
		expect(cvcontroller).toBeDefined();
	});

	it("should fetch jobs on initialising and preload images", function () {
		//
		var controller;

		mockBackend.when("GET", appConfig.endpoints.jobs.list).respond("200", {
			data : [
				{
					alias: "foo",
					images: 2
				}
			]
		});

		controller = createController("JobsCtrl");

		spyOn(controller, "preloadImages");

		controller.getJobs();

		mockBackend.flush();

		expect($rootScope.jobs.length).toBeGreaterThan(0);
		expect(controller.preloadImages).toHaveBeenCalled();
	});
	it("should populate cv", function () {
		//
		var controller;

		mockBackend.when("GET", appConfig.endpoints.experience.list).respond("200", {
			data : [
				{
					cname: "foo",
					cdesc: "bar"
				}
			]
		});

		controller = createController("CvCtrl");

		spyOn(controller, "getCv");

		controller.getCv();

		mockBackend.flush();

		expect($rootScope.experience.length).toBeGreaterThan(0);
	});
	it("should reset user form on fail login", function () {
		//
		var controller;

		mockBackend.when("POST", appConfig.endpoints.user.login).respond({status: "fail"});

		controller = createController("AccountCtrl");

		spyOn(controller, "resetLoginForm");

		controller.postLogin();

		mockBackend.flush();

		expect(controller.resetLoginForm).toHaveBeenCalled();
	});
	it("should login user", function () {
		//
		var controller;

		mockBackend.when("POST", appConfig.endpoints.user.login).respond({status: "success"});

		controller = createController("AccountCtrl");

		controller.postLogin();

		mockBackend.flush();

		expect($rootScope.ready).toEqual(false);
	});

});