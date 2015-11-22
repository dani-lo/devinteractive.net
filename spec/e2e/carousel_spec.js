//

describe('devint jobs image carousel', function() {
    //
    it("should browse images", function() {
        //
        browser.get('http://0.0.0.0:3000/jobs');
        
        browser.wait(function(){
            return browser.driver.isElementPresent( by.css('header.isdone') );
        },30000);

        element(by.css('i.browse')).click();

        element(by.css('img.grab')).getAttribute('src').then(function(attr) {
            expect(attr.indexOf("1.png")).toEqual(-1);
        });
    });
});
