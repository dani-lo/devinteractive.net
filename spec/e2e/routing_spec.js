//
describe('devint views navigation', function() {
    //
    it("should show link to jobs", function() {
        //
        browser.get('http://0.0.0.0:3000');

        browser.wait(function() { 
            return browser.driver.isElementPresent(by.id('goto-jobs-view')); 
        }, 8000);

        expect(browser.driver.isElementPresent(by.id('goto-jobs-view'))).toBeTruthy();

    });

    it("should link to jobs view", function() {
        //
        browser.get('http://0.0.0.0:3000');

        var EC = protractor.ExpectedConditions,
            button,
            isClickable;
        

        browser.driver.isElementPresent(by.id('goto-jobs-view')).then(function(isPresent){
            button = element(by.id('goto-jobs-view'));
            isClickable = EC.elementToBeClickable(button);
            browser.wait(isClickable, 10000);
            button.click();
            var urlChanged = function() {
              return browser.getCurrentUrl().then(function(url) {
                return url.indeOf("jobs") !== -1;
              });
            };
        });

    });

    it("should link back to home view", function() {
        //
        browser.get('http://0.0.0.0:3000/jobs');

        browser.driver.isElementPresent(by.id('nav-back')).then(function(isPresent){
            element(by.id('nav-back')).click();
            browser.wait(function() {
                return browser.getCurrentUrl().then(function(url) {
                    return (url.indexOf(browser.baseUrl + 'home') !== -1);
                });
            });
        });
    });
});