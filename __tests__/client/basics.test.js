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

describe("searchableVideoDataArray", () =>  {    
    it("Expect Array", () =>  { 
        const searchableVideoDataArray = basic.searchableVideoDataArray;   
        expect(searchableVideoDataArray).toBeDefined();     
        expect(searchableVideoDataArray).toEqual(expect.arrayContaining([]));
        expect(searchableVideoDataArray).toEqual([]);  
    }); 
}); 

describe("websiteContentContainer", () =>  {    
    it("Defined", () =>  { 
        const websiteContentContainer = basic.websiteContentContainer();   
        expect(websiteContentContainer).toBeDefined();     
        expect(websiteContentContainer).not.toBe(null);    
    }); 
}); 

describe("favicon", () =>  {    
    it("Defined", () =>  { 
        const favicon = basic.favicon();   
        expect(favicon).toBeDefined();        
        expect(favicon).not.toBe(null);   
    }); 
}); 

describe("pushDataToSearchableVideoDataArray", () =>  {    
    afterAll(() => {   
        basic.resetSearchableVideoDataArray(); 
    });

    it("push", () =>  { 
        const updated = basic.pushDataToSearchableVideoDataArray({
            "info": {
                "title": "e615e458-855d-44d3-b686-d82f82a43f27",
                "videoLink": {
                    "src": "/video/e615e458-855d-44d3-b686-d82f82a43f27",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/1",
                    "2": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/2",
                    "3": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/3",
                    "4": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/4",
                    "5": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/5",
                    "6": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/6",
                    "7": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/7",
                    "8": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/8"
                },
                "id": "e615e458-855d-44d3-b686-d82f82a43f27"
            }
        });   
        expect(updated).toBe("updated SearchableVideoDataArray");    
        const searchableVideoDataArray = basic.searchableVideoDataArray;   
        expect(searchableVideoDataArray).toBeDefined();     
        expect(searchableVideoDataArray.length).toEqual(1);  
        expect(searchableVideoDataArray[0].info.title).toEqual("e615e458-855d-44d3-b686-d82f82a43f27");  
        expect(searchableVideoDataArray[0].info.videoLink.src).toEqual("/video/e615e458-855d-44d3-b686-d82f82a43f27");    
        expect(searchableVideoDataArray[0].info.videoLink.type).toEqual("video/mp4");    
        expect(Object.keys(searchableVideoDataArray[0]["info"]["thumbnailLink"]).length).toEqual(8);    
        expect(searchableVideoDataArray[0].info.id).toEqual("e615e458-855d-44d3-b686-d82f82a43f27");   
    }); 
}); 

describe("resetSearchableVideoDataArray", () =>  {    
    it("reset", () =>  { 
        const reset = basic.resetSearchableVideoDataArray();     
        expect(reset).toBe("reset SearchableVideoDataArray");    
        const searchableVideoDataArray = basic.searchableVideoDataArray;   
        expect(searchableVideoDataArray).toBeDefined();     
        expect(searchableVideoDataArray).toEqual(expect.arrayContaining([]));
        expect(searchableVideoDataArray).toEqual([]);   
    }); 
}); 

describe("searchableVideoDataArray_move_before", () =>  {   
    const from_id = "id1";
    const to_id = "id2";
    
    beforeAll(() => {     
        basic.pushDataToSearchableVideoDataArray({
            "info": {
                "title": "We the best",
                "videoLink": {
                    "src": "/video/e615e458-855d-44d3-b686-d82f82a43f27",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/1",
                    "2": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/2",
                    "3": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/3",
                    "4": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/4",
                    "5": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/5",
                    "6": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/6",
                    "7": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/7",
                    "8": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/8"
                },
                "id": `${from_id}`
            }
        });
        basic.pushDataToSearchableVideoDataArray({ 
            "info": {
                "title": "2",
                "videoLink": {
                    "src": "/video/77645385-e704-4c16-948a-f9284503dee9",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/1",
                    "2": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/2",
                    "3": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/3",
                    "4": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/4",
                    "5": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/5",
                    "6": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/6",
                    "7": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/7",
                    "8": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/8"
                },
                "id": `${to_id}`
            } 
        });
     
    });

    afterAll(() => {   
        basic.resetSearchableVideoDataArray(); 
    });

    it("from_id && to_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before(undefined, undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id && to_id undefined");   
    }); 
    
    it("from_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before(undefined, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id undefined");   
    });  

    it("to_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before("invaldID1", undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("to_id undefined");   
    });

    it("from_id && to_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before("invaldID1", "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 && invaldID2 index not found");   
    }); 

    it("from_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before("invaldID1", to_id);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 index not found");   
    }); 

    it("to_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before(from_id, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID2 index not found");   
    });
    
    it("searchableVideoDataArray updated successfully", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_before("id1", "id2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("searchableVideoDataArray updated successfully");   
    }); 
}); 

describe("searchableVideoDataArray_move_after", () =>  {   
    const from_id = "id1";
    const to_id = "id2";
    
    beforeAll(() => {     
        basic.pushDataToSearchableVideoDataArray({
            "info": {
                "title": "We the best",
                "videoLink": {
                    "src": "/video/e615e458-855d-44d3-b686-d82f82a43f27",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/1",
                    "2": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/2",
                    "3": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/3",
                    "4": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/4",
                    "5": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/5",
                    "6": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/6",
                    "7": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/7",
                    "8": "/thumbnail/e615e458-855d-44d3-b686-d82f82a43f27/8"
                },
                "id": `${from_id}`
            }
        });
        basic.pushDataToSearchableVideoDataArray({ 
            "info": {
                "title": "2",
                "videoLink": {
                    "src": "/video/77645385-e704-4c16-948a-f9284503dee9",
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/1",
                    "2": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/2",
                    "3": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/3",
                    "4": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/4",
                    "5": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/5",
                    "6": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/6",
                    "7": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/7",
                    "8": "/thumbnail/77645385-e704-4c16-948a-f9284503dee9/8"
                },
                "id": `${to_id}`
            } 
        });
     
    });

    afterAll(() => {   
        basic.resetSearchableVideoDataArray(); 
    });

    it("from_id && to_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after(undefined, undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id && to_id undefined");   
    }); 
    
    it("from_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after(undefined, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id undefined");   
    });  

    it("to_id undefined", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after("invaldID1", undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("to_id undefined");   
    });

    it("from_id && to_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after("invaldID1", "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 && invaldID2 index not found");   
    }); 

    it("from_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after("invaldID1", to_id);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 index not found");   
    }); 

    it("to_id index not found", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after(from_id, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID2 index not found");   
    });
    
    it("searchableVideoDataArray updated successfully", () =>  { 
        const moveFromTo = basic.searchableVideoDataArray_move_after("id1", "id2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("searchableVideoDataArray updated successfully");   
    }); 
}); 

describe("inputType", () =>  {    
    it("valid tagname", () =>  { 
        const input = basic.inputType(container);   
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");     
    }); 
    
    it("valid tagname type", () =>  { 
        const input = basic.inputType(container, "text"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
    }); 
    
    it("valid tagname type id", () =>  { 
        const input = basic.inputType(container, "text", "id"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.id).toBe("id");  
    }); 
    
    it("valid tagname type id class", () =>  { 
        const input = basic.inputType(container, "text", "id", "class"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.classList[0]).toBe("class");  
    }); 
    
    it("valid tagname type id class required", () =>  { 
        const input = basic.inputType(container, "text", "id", "class", true); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.classList[0]).toBe("class");  
        expect(input.required).toBe(true);  
    }); 

    it("inputType didnt work", () =>  { 
        const input = basic.inputType(); 
        expect(input).toBeDefined();
        expect(input).toBe("inputType didnt work");  
    }); 
}); 

describe("createLabel", () =>  {    
    it("valid tagname", () =>  { 
        const label = basic.createLabel(container);   
        expect(label).toBeDefined();
        expect(label.tagName).toBe("LABEL");     
    }); 
    
    it("valid tagname textContent", () =>  { 
        const label = basic.createLabel(container, "text"); 
        expect(label).toBeDefined();
        expect(label.tagName).toBe("LABEL");  
        expect(label.textContent).toBe("text");  
    });  
    it("createLabel didnt work", () =>  { 
        const label = basic.createLabel(); 
        expect(label).toBeDefined();
        expect(label).toBe("createLabel didnt work");  
    }); 
}); 

describe("createInput", () =>  {    
    it("valid tagname", () =>  { 
        const input = basic.createInput(container);   
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");     
    }); 
    
    it("valid tagname type", () =>  { 
        const input = basic.createInput(container, "text"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
    });  
    
    it("valid tagname type value", () =>  { 
        const input = basic.createInput(container, "text", "value"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
        expect(input.value).toBe("value");     
    });  
    
    it("valid tagname type value id", () =>  { 
        const input = basic.createInput(container, "text", "value", "id"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
        expect(input.value).toBe("value"); 
        expect(input.id).toBe("id");  
    });  

    it("valid tagname type value id class", () =>  { 
        const input = basic.createInput(container, "text", "value", "id", "class"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
        expect(input.value).toBe("value"); 
        expect(input.id).toBe("id");  
        expect(input.classList[0]).toBe("class");  
    });  

    it("createInput didnt work", () =>  { 
        const input = basic.createInput(); 
        expect(input).toBeDefined();
        expect(input).toBe("createInput didnt work");  
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

describe("notify", () =>  {   
    beforeAll(() => { 
        window.HTMLDocument.prototype.hasFocus  = jest.fn().mockImplementation(() =>
            Promise.resolve(true)
        );
    });

    it("type, message", () =>  {  
        const notify = basic.notify("success", "test message"); 
        expect(notify).toBeDefined();    
        expect(document.getElementById("notification-area").textContent).toBe("test message");
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[0]).toBe("notification"); 
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[1]).toBe("success");        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].innerHTML).toBe("test message");
        expect(notify).toBe("successful notify");  
    });  

    it("no type, message", () =>  {  
        const notify = basic.notify( undefined , "test message"); 
        expect(notify).toBeDefined();    
        expect(document.getElementById("notification-area").textContent).toBe("test message");
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[0]).toBe("notification"); 
        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].classList[1]).toBe("undefined");        expect(document.getElementById("notification-area").getElementsByClassName("notification")[0].innerHTML).toBe("test message");
        expect(notify).toBe("successful notify");  
    });  

    it("type, no message", () =>  {  
        const notify = basic.notify(); 
        expect(notify).toBeDefined();     
        expect(notify).toBe("notify message not string");  
    }); 

    it("no type, no message", () =>  {  
        const notify = basic.notify(); 
        expect(notify).toBeDefined();     
        expect(notify).toBe("notify message not string");  
    });  
}); 

describe("Timer", () =>  {
    function callBackFunction() {
        return "callBackFunction";
    } 
    
    it("set setTimeout", () =>  {   
        const Timer = new basic.Timer(callBackFunction(), 5000); 
        expect(Timer).toBeDefined();
        expect(Timer.time).toBe(5000); 
        expect(Timer.callback).toBe(callBackFunction());  
        expect(Timer.finished).toBe(false);  
    });   

    it("change setTimeout time", () =>  {   
        const Timer = new basic.Timer(callBackFunction(), 5000); 
        Timer.change(10000);
        expect(Timer).toBeDefined(); 
        expect(Timer.time).toBe(10000); 
        expect(Timer.callback).toBe(callBackFunction());   
    });  
}); 

describe("originalFavicon", () =>  {  
    it("Favicon href updated", () =>  {  
        const favicon = basic.originalFavicon(); 
        expect(favicon).toBeDefined();
        expect(favicon).toBe("Favicon href updated"); 
    }); 
}); 

describe("addFaviconNotificationBadge", () =>  {  
    it("favicon notification badge added", () =>  {  
        const badge = basic.addFaviconNotificationBadge(); 
        expect(badge).toBeDefined();
        expect(badge).toBe("favicon notification badge added"); 
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