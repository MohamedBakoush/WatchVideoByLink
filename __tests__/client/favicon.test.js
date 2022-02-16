
/**
 * @jest-environment jsdom
*/
const favicon = require("../../client/scripts/favicon");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;  
window.HTMLCanvasElement.prototype.getContext = jest.fn();

let spy, mockHTML, mockHead, mockFavicon; 
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
    spy.mockReturnValue(mockHTML); 
});

describe("favicon", () =>  {    
    it("Defined", () =>  { 
        const icon = favicon.favicon();   
        expect(icon).toBeDefined();        
        expect(icon).not.toBe(null);   
    }); 
}); 

describe("originalFavicon", () =>  {  
    it("Favicon href updated", () =>  {  
        const icon = favicon.originalFavicon(); 
        expect(icon).toBeDefined();
        expect(icon).toBe("Favicon href updated"); 
    }); 
}); 

describe("addFaviconNotificationBadge", () =>  {  
    it("favicon notification badge added", () =>  {  
        const badge = favicon.addFaviconNotificationBadge(); 
        expect(badge).toBeDefined();
        expect(badge).toBe("favicon notification badge added"); 
    }); 
}); 
