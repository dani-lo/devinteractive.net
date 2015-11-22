describe("Modal Service", function() {
	//
	"use strict";

	var windowMock, modalService, userMsgObj;

	beforeEach(function(){
		module(function($provide){

			$provide.service("$window", function(){
				this.alert = jasmine.createSpy("alert");
			});

			$provide.service("ModalService", function(){
				this.showModal = jasmine.createSpy("showModal").andReturn({
					then: function(foo){
						return foo;
					}
				});
			});
		});

		module("DevInt.services");
	});

	beforeEach(inject(function($window, ModalService, UserMsgService){

		windowMock = $window;
		modalService = ModalService;
		userMsgObj = UserMsgService;
	}));

	it("should show alert when title is not passed into showDialog", function(){
		
		var message="Some message";
		var title = "Some Title";
		var status = "success";
		var animClass = "show-flash";
		
		userMsgObj.showMsg(message, title, status, animClass);
		
		expect(modalService.showModal).toHaveBeenCalled();
	});

	it("should show modal when title is passed into showDialog", function(){
	
		userMsgObj.showMsg("Some Message");

		expect(modalService.showModal).not.toHaveBeenCalled();
		
		expect(windowMock.alert).toHaveBeenCalled();
	});

});

describe("Data Services", function() {
	//
	"use strict";

	var jobsDataService, cvDataService, mockBackend, appConfig;

	beforeEach(function () {
		//
		module("DevInt");
	});

	beforeEach(inject(function(JobsDataService, CvDataService, $httpBackend, $injector){

		jobsDataService = JobsDataService;
		cvDataService = CvDataService;

		appConfig = $injector.get("APPCONFIG");

		mockBackend = $httpBackend;
	}));

	it("should invoke jobs endpoint", function () {
		//
		mockBackend.when("GET", appConfig.endpoints.jobs.list).respond({
			data : [
				{
					cname: "foo",
					cdesc: "bar"
				}
			]
		});

		jobsDataService.getJobs().then(function(d) {
			//
			expect(d.data).toBeDefined(0);
		});

		mockBackend.flush();
	});

	it("should invoke experience endpoint", function () {
		//
		mockBackend.when("GET", appConfig.endpoints.experience.list).respond({
			data : [
				{
					cname: "foo",
					cdesc: "bar"
				}
			]
		});

		cvDataService.getExperience().then(function(d) {
			//
			expect(d.data).toBeDefined(0);
		});

		mockBackend.flush();
	});
});