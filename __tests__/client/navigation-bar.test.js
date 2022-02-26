/**
 * @jest-environment jsdom
 */
const navigationBar = require("../../client/scripts/navigation-bar");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   
global.history = dom.window.history;      
history.pushState = jest.fn();
const homeButton = document.createElement("section");
const savedVideosPage = document.createElement("section");

afterEach(() => {    
    jest.restoreAllMocks(); 
}); 

describe("loadNavigationBar", () =>  {  
    beforeEach(() => {    
        let spy, mockHTML, mockHead, mockArticle;
        spy = jest.spyOn(document, "getElementById"); 
        mockHTML = document.createElement("html"); 
        mockHead = document.createElement("head"); 
        mockHTML.appendChild(mockHead); 
        mockArticle = document.createElement("article");
        mockArticle.id = "websiteContentContainer"; 
        mockHTML.appendChild(mockArticle);
        spy.mockReturnValue(mockHTML);  
    });

    it("redirect to /saved/videos", () =>  { 
        const stopAvailableVideoDownloadDetails = navigationBar.loadNavigationBar("/saved/videos");   
        expect(stopAvailableVideoDownloadDetails).toBeDefined();       
        expect(stopAvailableVideoDownloadDetails).toBe("redirect to /saved/videos");     
    });   

    it("redirect to homepage", () =>  { 
        const stopAvailableVideoDownloadDetails = navigationBar.loadNavigationBar();   
        expect(stopAvailableVideoDownloadDetails).toBeDefined();       
        expect(stopAvailableVideoDownloadDetails).toBe("redirect to homepage");     
    });    
}); 

describe("onClickHomeButton", () =>  {  
    beforeEach(() => {    
        let spy, mockHTML, mockHead, mockArticle;
        spy = jest.spyOn(document, "getElementById"); 
        mockHTML = document.createElement("html"); 
        mockHead = document.createElement("head"); 
        mockHTML.appendChild(mockHead); 
        mockArticle = document.createElement("article");
        mockArticle.id = "websiteContentContainer"; 
        mockHTML.appendChild(mockArticle);
        spy.mockReturnValue(mockHTML);  
    });

    it("redirect to homepage", () =>  { 
        const onClickHomeButton = navigationBar.onClickHomeButton(homeButton, savedVideosPage);   
        expect(onClickHomeButton).toBeDefined();       
        expect(onClickHomeButton).toBe("redirect to homepage");     
    });    
}); 

describe("onClickSavedVideosPage", () =>  {  
    beforeEach(() => {    
        let spy, mockHTML, mockHead, mockArticle;
        spy = jest.spyOn(document, "getElementById"); 
        mockHTML = document.createElement("html"); 
        mockHead = document.createElement("head"); 
        mockHTML.appendChild(mockHead); 
        mockArticle = document.createElement("article");
        mockArticle.id = "websiteContentContainer"; 
        mockHTML.appendChild(mockArticle);
        spy.mockReturnValue(mockHTML);  
    });

    it("redirect to /saved/videos", () =>  { 
        const onClickSavedVideosPage = navigationBar.onClickSavedVideosPage(homeButton, savedVideosPage);   
        expect(onClickSavedVideosPage).toBeDefined();       
        expect(onClickSavedVideosPage).toBe("redirect to /saved/videos");     
    });    
}); 

describe("onClickCurrentDownloads", () =>  { 
    it("Remove current video downloads", () =>  { 
        let spy, mockHTML, mockHead, mockArticle, mockSection;
        spy = jest.spyOn(document, "getElementById"); 
        mockHTML = document.createElement("html"); 
        mockHead = document.createElement("head"); 
        mockHTML.appendChild(mockHead); 
        mockArticle = document.createElement("article");
        mockArticle.id = "websiteContentContainer"; 
        mockHTML.appendChild(mockArticle);
        mockSection = document.createElement("section");
        mockSection.id = ("download-status-container"); 
        mockArticle.appendChild(mockSection);
        spy.mockReturnValue(mockHTML);  

        const onClickCurrentDownloads = navigationBar.onClickCurrentDownloads("");   
        expect(onClickCurrentDownloads).toBeDefined();       
        expect(onClickCurrentDownloads).toBe("Remove current video downloads");     
    });   

    it("Display current video downloads", () =>  { 
        const onClickCurrentDownloads = navigationBar.onClickCurrentDownloads();   
        expect(onClickCurrentDownloads).toBeDefined();       
        expect(onClickCurrentDownloads).toBe("Display current video downloads");     
    });    
}); 
 