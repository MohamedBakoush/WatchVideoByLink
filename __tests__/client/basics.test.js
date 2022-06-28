/**
 * @jest-environment jsdom
 */
const basic = require("../../client/scripts/basics");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;  
window.HTMLCanvasElement.prototype.getContext = jest.fn();
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

describe("getAvailablevideoDetails", () =>  {    
    beforeEach(() => {     
        basic.setNewAvailablevideoDetails(undefined);   
    });  

    it("undefined", () =>  { 
        const getAvailablevideoDetails = basic.getAvailablevideoDetails();   
        expect(getAvailablevideoDetails).toBe(undefined);    
    });  

    it("Defined", () =>  { 
        basic.setNewAvailablevideoDetails("Defined");   
        const getAvailablevideoDetails = basic.getAvailablevideoDetails();   
        expect(getAvailablevideoDetails).toBe("Defined");  
    }); 
}); 

describe("setNewAvailablevideoDetails", () =>  {    
    beforeEach(() => {     
        basic.setNewAvailablevideoDetails(undefined);   
    });  

    it("undefined", () =>  { 
        const setNewAvailablevideoDetails = basic.setNewAvailablevideoDetails();   
        expect(setNewAvailablevideoDetails).toBe(undefined);    
    }); 

    it("Defined", () =>  { 
        const setNewAvailablevideoDetails = basic.setNewAvailablevideoDetails("Defined");   
        expect(setNewAvailablevideoDetails).toBeDefined();     
        expect(setNewAvailablevideoDetails).toBe("Defined");    
    }); 
}); 

describe("websiteContentContainer", () =>  {    
    it("Defined", () =>  { 
        const websiteContentContainer = basic.websiteContentContainer();   
        expect(websiteContentContainer).toBeDefined();     
        expect(websiteContentContainer).not.toBe(null);    
    }); 
}); 

describe("isElement", () =>  {    
    it("no input", () =>  { 
        const isElement = basic.isElement();   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    });   

    it("undefined", () =>  { 
        const isElement = basic.isElement(undefined);   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    });  

    it("null", () =>  { 
        const isElement = basic.isElement(null);   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    }); 

    it("string", () =>  { 
        const isElement = basic.isElement("string");   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    }); 
    
    it("number", () =>  { 
        const isElement = basic.isElement(123);   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    }); 

    it("object", () =>  { 
        const isElement = basic.isElement({});   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    }); 

    it("array", () =>  { 
        const isElement = basic.isElement([]);   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(false);     
    }); 

    it("vaild element", () =>  { 
        const isElement = basic.isElement(container);   
        expect(isElement).toBeDefined();  
        expect(isElement).toBe(true);     
    }); 
}); 

describe("createElement", () =>  {   
    it("No input", () =>  { 
        const createdElement = basic.createElement();   
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");     
    }); 
 
    it("Undefined", () =>  { 
        const createdElement = basic.createElement(undefined);
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");       
    });  

    it("Null", () =>  { 
        const createdElement = basic.createElement(null);
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");    
    }); 

    it("String container", () =>  { 
        const createdElement = basic.createElement("string");
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");    
    }); 
    
    it("Number container", () =>  { 
        const createdElement = basic.createElement(123);
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");         
    }); 

    it("Object container", () =>  { 
        const createdElement = basic.createElement({});
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");      
    }); 

    it("Array container", () =>  { 
        const createdElement = basic.createElement([]);
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid container");      
    }); 

    it("valid container", () =>  { 
        const createdElement = basic.createElement(container);   
        expect(createdElement).toBeDefined();
        expect(createdElement).toBe("invalid elementType");     
    }); 
    
    it("valid container, Undefined elementType", () =>  { 
        const createdElement = basic.createElement(container, undefined); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid elementType");  
    });  
    
    it("valid container, Null elementType", () =>  { 
        const createdElement = basic.createElement(container, null); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid elementType");  
    });  
    
    it("valid container, String elementType", () =>  { 
        const createdElement = basic.createElement(container, "input"); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, Number elementType", () =>  { 
        const createdElement = basic.createElement(container, 123); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid elementType");  
    });  

    it("valid container, Object elementType", () =>  { 
        const createdElement = basic.createElement(container, {}); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid elementType");  
    });  
    
    it("valid container, Array elementType", () =>  { 
        const createdElement = basic.createElement(container, []); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid elementType");  
    });  

    it("valid container, elementType, Undefined fields", () =>  { 
        const createdElement = basic.createElement(container, "input", undefined); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, elementType, Null fields", () =>  { 
        const createdElement = basic.createElement(container, "input", null); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, elementType, String fields", () =>  { 
        const createdElement = basic.createElement(container, "input", "string"); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, elementType, Number fields", () =>  { 
        const createdElement = basic.createElement(container, "input", 123); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, elementType, Array fields", () =>  { 
        const createdElement = basic.createElement(container, "input", []); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement).toBe("invalid fields");  
    });  

    it("valid container, elementType, Object fields", () =>  { 
        const createdElement = basic.createElement(container, "input", {}); 
        expect(createdElement).toBeDefined(); 
        expect(createdElement.tagName).toBe("INPUT");   
    });  

    it("valid container, elementType, fields", () =>  { 
        const createdElement = basic.createElement(container, "input", {
            id : "id",
            classList : "class"
        }); 
        expect(createdElement).toBeDefined();   
        expect(createdElement.tagName).toBe("INPUT");   
        expect(createdElement.id).toBe("id");  
        expect(createdElement.classList[0]).toBe("class");   
    });  
});  

describe("createOption", () =>  {    
    it("valid tagname", () =>  { 
        const option = basic.createOption(container);   
        expect(option).toBeDefined();
        expect(option.tagName).toBe("OPTION");     
    });  

    it("valid tagname value", () =>  { 
        const option = basic.createOption(container, "value");   
        expect(option).toBeDefined();
        expect(option.tagName).toBe("OPTION");  
        expect(option.value).toBe("value");   
    }); 

    it("valid tagname value textContent", () =>  { 
        const option = basic.createOption(container, "value", "text"); 
        expect(option).toBeDefined();
        expect(option.tagName).toBe("OPTION");  
        expect(option.value).toBe("value");   
        expect(option.textContent).toBe("text");  
    }); 

    it("createOption didnt work", () =>  { 
        const option = basic.createOption(); 
        expect(option).toBeDefined();
        expect(option).toBe("createOption didnt work");  
    }); 
}); 

describe("createSection", () =>  {    
    it("valid tagname", () =>  { 
        const section = basic.createSection(container, "section");   
        expect(section).toBeDefined();
        expect(section.tagName).toBe("SECTION");     
    });     

    it("valid tagname class", () =>  { 
        const section = basic.createSection(container, "section", "class");   
        expect(section).toBeDefined();
        expect(section.tagName).toBe("SECTION");   
        expect(section.classList[0]).toBe("class");       
    });     

    it("valid tagname class id", () =>  { 
        const section = basic.createSection(container, "section", "class", "id");   
        expect(section).toBeDefined();
        expect(section.tagName).toBe("SECTION");   
        expect(section.classList[0]).toBe("class");    
        expect(section.id).toBe("id");       
    });   
 
    it("valid tagname class id textContent", () =>  { 
        const section = basic.createSection(container, "section", "class", "id", "text");   
        expect(section).toBeDefined();
        expect(section.tagName).toBe("SECTION");   
        expect(section.classList[0]).toBe("class");    
        expect(section.id).toBe("id");        
        expect(section.textContent).toBe("text");       
    });   

    it("createSection didnt work", () =>  { 
        const section = basic.createSection(); 
        expect(section).toBeDefined();
        expect(section).toBe("createSection didnt work");  
    }); 
}); 

describe("createLink", () =>  {    
    it("valid tagname", () =>  { 
        const link = basic.createLink(container);   
        expect(link).toBeDefined();
        expect(link.tagName).toBe("A");     
    });      

    it("valid tagname href", () =>  { 
        const link = basic.createLink(container, "http://localhost:8080/");   
        expect(link).toBeDefined();
        expect(link.tagName).toBe("A");  
        expect(link.href).toBe("http://localhost:8080/");    
    });   

    it("valid tagname href id", () =>  { 
        const link = basic.createLink(container, "http://localhost:8080/", "id");   
        expect(link).toBeDefined();
        expect(link.tagName).toBe("A");  
        expect(link.href).toBe("http://localhost:8080/");    
        expect(link.id).toBe("id"); 
    });   

    it("valid tagname href id class", () =>  { 
        const link = basic.createLink(container, "http://localhost:8080/", "id", "class");   
        expect(link).toBeDefined();
        expect(link.tagName).toBe("A");  
        expect(link.href).toBe("http://localhost:8080/");    
        expect(link.id).toBe("id"); 
        expect(link.classList[0]).toBe("class"); 
    });   

    it("valid tagname href id class textContent", () =>  { 
        const link = basic.createLink(container, "http://localhost:8080/", "id", "class", "text");   
        expect(link).toBeDefined();
        expect(link.tagName).toBe("A");  
        expect(link.href).toBe("http://localhost:8080/");    
        expect(link.id).toBe("id"); 
        expect(link.classList[0]).toBe("class"); 
        expect(link.textContent).toBe("text"); 
    });  

    it("createLink didnt work", () =>  { 
        const link = basic.createLink(); 
        expect(link).toBeDefined();
        expect(link).toBe("createLink didnt work");  
    }); 
}); 

describe("appendImg", () =>  {     
    it("valid tagname", () =>  { 
        const appendImg = basic.appendImg(container); 
        expect(appendImg).toBeDefined(); 
        expect(appendImg.tagName).toBe("IMG"); 
    }); 

    it("valid tagname src", () =>  { 
        const appendImg = basic.appendImg(container, "http://localhost:8080/image.png");   
        expect(appendImg).toBeDefined();
        expect(appendImg.tagName).toBe("IMG");  
        expect(appendImg.src).toBe("http://localhost:8080/image.png");    
    });  

    it("valid tagname src width", () =>  { 
        const appendImg = basic.appendImg(container, "http://localhost:8080/image.png", 20);   
        expect(appendImg).toBeDefined();
        expect(appendImg.tagName).toBe("IMG");  
        expect(appendImg.src).toBe("http://localhost:8080/image.png");    
        expect(appendImg.width).toBe(20);  
    });    

    it("valid tagname src width height", () =>  { 
        const appendImg = basic.appendImg(container, "http://localhost:8080/image.png", 20, 20);   
        expect(appendImg).toBeDefined();
        expect(appendImg.tagName).toBe("IMG");  
        expect(appendImg.src).toBe("http://localhost:8080/image.png");    
        expect(appendImg.width).toBe(20);  
        expect(appendImg.height).toBe(20);  
    }); 

    it("valid tagname src width height, id", () =>  { 
        const appendImg = basic.appendImg(container, "http://localhost:8080/image.png", 20, 20, "test_image");   
        expect(appendImg).toBeDefined();
        expect(appendImg.tagName).toBe("IMG");  
        expect(appendImg.src).toBe("http://localhost:8080/image.png");    
        expect(appendImg.width).toBe(20);  
        expect(appendImg.height).toBe(20);  
        expect(appendImg.id).toBe("test_image");  
    }); 

    it("valid tagname src width height, id, calss", () =>  { 
        const appendImg = basic.appendImg(container, "http://localhost:8080/image.png", 20, 20, "test_image", "class_image");   
        expect(appendImg).toBeDefined();
        expect(appendImg.tagName).toBe("IMG");  
        expect(appendImg.src).toBe("http://localhost:8080/image.png");    
        expect(appendImg.width).toBe(20);  
        expect(appendImg.height).toBe(20);  
        expect(appendImg.id).toBe("test_image");
        expect(appendImg.classList[0]).toBe("class_image");  
    }); 
}); 

describe("checkForPercentEncoding", () =>  { 
    it("Input %3A%2F%3F%23%5B%5D%40%21%24%26%27%28%29%2A%2B%2C%3B%3D -> :/?#[]@!$&'()*+,;=", () =>  {  
        const encode = basic.checkForPercentEncoding("%3A%2F%3F%23%5B%5D%40%21%24%26%27%28%29%2A%2B%2C%3B%3D"); 
        expect(encode).toBeDefined();
        expect(encode).toBe(":/?#[]@!$&'()*+,;="); 
    });   

    it("Input http%3A%2F%2Flocalhost%3A8080%2Fvideo%2Ftest -> http://localhost:8080/video/test", () =>  {  
        const encode = basic.checkForPercentEncoding("http%3A%2F%2Flocalhost%3A8080%2Fvideo%2Ftest"); 
        expect(encode).toBeDefined();
        expect(encode).toBe("http://localhost:8080/video/test"); 
    });   

    it("No Input", () =>  {  
        const encode = basic.checkForPercentEncoding(); 
        expect(encode).toBeDefined();
        expect(encode).toBe("Encoding Failed"); 
    }); 
}); 

describe("percent_encoding_to_reserved_character", () =>  { 
    it("Input string checkFor replaceby", () =>  {  
        const encode = basic.percent_encoding_to_reserved_character("3*3%3D9", "%3D", "="); 
        expect(encode).toBeDefined();
        expect(encode).toBe("3*3=9"); 
    }); 

    it("Input string checkFor ", () =>  {  
        const encode = basic.percent_encoding_to_reserved_character("3*3%3D9", "%3D"); 
        expect(encode).toBeDefined();
        expect(encode).toBe("3*3undefined9"); 
    }); 

    it("Input string ", () =>  {  
        const encode = basic.percent_encoding_to_reserved_character("3*3%3D9"); 
        expect(encode).toBeDefined();
        expect(encode).toBe("3*3%3D9"); 
    }); 
    
    it("No Input", () =>  {  
        const encode = basic.percent_encoding_to_reserved_character(); 
        expect(encode).toBeDefined();
        expect(encode).toBe("Encoding Failed"); 
    }); 
}); 

describe("secondsToHms", () =>  {    
    it("Sec Invalid", () =>  {  
        const secondsToHms = basic.secondsToHms();   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("Sec Invalid");     
    });  

    it("354354 -> 98:25:54, HMS false", () =>  {  
        const secondsToHms = basic.secondsToHms(354354);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("98:25:54");     
    });  

    it("354354 -> 98:25:54, HMS true", () =>  {  
        const secondsToHms = basic.secondsToHms(354354, true);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("98:25:54");     
    });  

    it("213213 -> 59:13:33, HMS false", () =>  {  
        const secondsToHms = basic.secondsToHms(213213);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("59:13:33");     
    });  

    it("213213 -> 59:13:33, HMS true", () =>  {  
        const secondsToHms = basic.secondsToHms(213213, true);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("59:13:33");     
    });  

    it("323 -> 5:23, HMS false", () =>  {  
        const secondsToHms = basic.secondsToHms(323);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("5:23");     
    });  

    it("323 -> 00:05:23", () =>  {  
        const secondsToHms = basic.secondsToHms(323, true);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("00:05:23");     
    });  

    it("23 -> 0:23, HMS false", () =>  {  
        const secondsToHms = basic.secondsToHms(23);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("0:23");     
    });  

    it("23 -> 0:23, HMS false", () =>  {  
        const secondsToHms = basic.secondsToHms(23, true);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("00:00:23");     
    });  

    it("negative nuber -> 00:00:00", () =>  {  
        const secondsToHms = basic.secondsToHms(-456);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("0:00");     
    });  

    it("negative nuber -> 00:00:00", () =>  {  
        const secondsToHms = basic.secondsToHms(-456, true);   
        expect(secondsToHms).toBeDefined();       
        expect(secondsToHms).toBe("00:00:00");     
    });  
}); 