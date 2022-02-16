/**
 * @jest-environment jsdom
 */
 const notify = require("../../client/scripts/notify");
 const jsdom = require("jsdom");
 const { JSDOM } = jsdom;
 const dom = new JSDOM();
 global.window = dom.window; 
 global.document = dom.window.document;  
 window.HTMLCanvasElement.prototype.getContext = jest.fn();
 
 let spy, mockHTML, mockHead, mockFavicon, mockArticle; 
 beforeAll(() => {
     spy = jest.spyOn(document, "getElementById");
     mockHTML = document.createElement("html"); 
     mockHead = document.createElement("head"); 
     mockHTML.appendChild(mockHead);
     mockFavicon = document.createElement("link");
     mockFavicon.id = "favicon";
     mockFavicon.rel = "icon";
     mockFavicon.href = "../favicon.ico";
     mockFavicon.type = "image/png"; 
     mockHead.appendChild(mockFavicon);
     mockArticle = document.createElement("article");
     mockArticle.id = "websiteContentContainer"; 
     mockHTML.appendChild(mockArticle);
     spy.mockReturnValue(mockHTML); 
 });

describe("message", () =>  {   
    beforeAll(() => { 
        window.HTMLDocument.prototype.hasFocus  = jest.fn().mockImplementation(() =>
            Promise.resolve(true)
        );
    });

    it("type, message", () =>  {  
        const notification = notify.message("success", "test message"); 
        expect(notification).toBeDefined();    
        expect(document.getElementById("notification-area").textContent).toBe("test message");
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[0]).toBe("notification"); 
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[1]).toBe("success");        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].innerHTML).toBe("test message");
        expect(notification).toBe("successful notify");  
    });  

    it("no type, message", () =>  {  
        const notification = notify.message( undefined , "test message"); 
        expect(notification).toBeDefined();    
        expect(document.getElementById("notification-area").textContent).toBe("test message");
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[0]).toBe("notification"); 
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[1]).toBe("undefined");        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].innerHTML).toBe("test message");
        expect(notification).toBe("successful notify");  
    });  

    it("type, no message", () =>  {  
        const notification = notify.message(); 
        expect(notification).toBeDefined();     
        expect(notification).toBe("notify message not string");  
    }); 

    it("no type, no message", () =>  {  
        const notification = notify.message(); 
        expect(notification).toBeDefined();     
        expect(notification).toBe("notify message not string");  
    });  
}); 

describe("Timer", () =>  {
    function callBackFunction() {
        return "callBackFunction";
    } 
    
    it("set setTimeout", () =>  {   
        const Timer = new notify.Timer(callBackFunction(), 5000); 
        expect(Timer).toBeDefined();
        expect(Timer.time).toBe(5000); 
        expect(Timer.callback).toBe(callBackFunction());  
        expect(Timer.finished).toBe(false);  
    });   

    it("change setTimeout time", () =>  {   
        const Timer = new notify.Timer(callBackFunction(), 5000); 
        Timer.change(10000);
        expect(Timer).toBeDefined(); 
        expect(Timer.time).toBe(10000); 
        expect(Timer.callback).toBe(callBackFunction());   
    });  
}); 
