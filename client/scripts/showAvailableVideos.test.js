const showAvailableVideos = require("./showAvailableVideos");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   

describe("pageLoaded", () =>  {   
    it("pageLoaded", () =>  { 
        const pageLoaded = showAvailableVideos.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("pageLoaded");     
    });   
}); 
