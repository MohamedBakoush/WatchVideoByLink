const basic = require("./basics");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.document = dom.window.document; 

const container = document.createElement("section");

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