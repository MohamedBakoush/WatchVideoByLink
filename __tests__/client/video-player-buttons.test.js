/**
 * @jest-environment jsdom
 */
const videoPlayerButtons = require("../../client/scripts/video-payer-buttons");   
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
const container = document.createElement("section");
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

describe("updateFileNameID", () =>  {    
    beforeEach(() => {    
        videoPlayerButtons.updateFileNameID(null); 
    }); 

    afterAll(() => {    
        videoPlayerButtons.updateFileNameID(null); 
    }); 

    it("no input - expect undefined", () =>  {  
        const fileNameID = videoPlayerButtons.updateFileNameID(null);  
        expect(fileNameID).toBeUndefined();     
    });   
     
    it("undefined input - expect undefined", () =>  { 
        const fileNameID = videoPlayerButtons.updateFileNameID(undefined);  
        expect(fileNameID).toBeUndefined();     
        expect(fileNameID).toBe(undefined);  
    });  
     
    it("number input - expect undefined", () =>  { 
        const updatedFileNameID = videoPlayerButtons.updateFileNameID(123);  
        expect(updatedFileNameID).toBeUndefined();  
        expect(updatedFileNameID).toBe(undefined);     
    }); 

    it("string input - expect ccf40c5d-640b-44e8-ae3b-7e4563a44d29", () =>  { 
        const updatedFileNameID = videoPlayerButtons.updateFileNameID("ccf40c5d-640b-44e8-ae3b-7e4563a44d29");  
        expect(updatedFileNameID).toBeDefined(); 
        expect(updatedFileNameID).toBe("ccf40c5d-640b-44e8-ae3b-7e4563a44d29");      
    }); 
}); 

describe("backToHomePageButton", () =>  {    
    it("container undefined", () =>  {  
        const backToHomePageButton = videoPlayerButtons.backToHomePageButton();   
        expect(backToHomePageButton).toBeDefined();       
        expect(backToHomePageButton).toBe("container undefined");     
    });

    it("display backToHomePageButton", () =>  {  
        const backToHomePageButton = videoPlayerButtons.backToHomePageButton(container);   
        expect(backToHomePageButton).toBeDefined();       
        expect(backToHomePageButton).toBe("backToHomePageButton");     
    });  
}); 