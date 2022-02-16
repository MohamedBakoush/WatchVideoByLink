const search = require("../../client/scripts/search");

describe("searchableVideoDataArray", () =>  {    
    it("Expect Array", () =>  { 
        const searchableVideoDataArray = search.searchableVideoDataArray;   
        expect(searchableVideoDataArray).toBeDefined();     
        expect(searchableVideoDataArray).toEqual(expect.arrayContaining([]));
        expect(searchableVideoDataArray).toEqual([]);  
    }); 
}); 

describe("pushDataToSearchableVideoDataArray", () =>  {    
    afterAll(() => {   
        search.resetSearchableVideoDataArray(); 
    });

    it("push", () =>  { 
        const updated = search.pushDataToSearchableVideoDataArray({
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
        const searchableVideoDataArray = search.searchableVideoDataArray;   
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
        const reset = search.resetSearchableVideoDataArray();     
        expect(reset).toBe("reset SearchableVideoDataArray");    
        const searchableVideoDataArray = search.searchableVideoDataArray;   
        expect(searchableVideoDataArray).toBeDefined();     
        expect(searchableVideoDataArray).toEqual(expect.arrayContaining([]));
        expect(searchableVideoDataArray).toEqual([]);   
    }); 
}); 

describe("searchableVideoDataArray_move_before", () =>  {   
    const from_id = "id1";
    const to_id = "id2";
    
    beforeAll(() => {     
        search.pushDataToSearchableVideoDataArray({
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
        search.pushDataToSearchableVideoDataArray({ 
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
        search.resetSearchableVideoDataArray(); 
    });

    it("from_id && to_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before(undefined, undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id && to_id undefined");   
    }); 
    
    it("from_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before(undefined, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id undefined");   
    });  

    it("to_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before("invaldID1", undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("to_id undefined");   
    });

    it("from_id && to_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before("invaldID1", "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 && invaldID2 index not found");   
    }); 

    it("from_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before("invaldID1", to_id);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 index not found");   
    }); 

    it("to_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before(from_id, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID2 index not found");   
    });
    
    it("searchableVideoDataArray updated successfully", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_before("id1", "id2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("searchableVideoDataArray updated successfully");   
    }); 
}); 

describe("searchableVideoDataArray_move_after", () =>  {   
    const from_id = "id1";
    const to_id = "id2";
    
    beforeAll(() => {     
        search.pushDataToSearchableVideoDataArray({
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
        search.pushDataToSearchableVideoDataArray({ 
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
        search.resetSearchableVideoDataArray(); 
    });

    it("from_id && to_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after(undefined, undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id && to_id undefined");   
    }); 
    
    it("from_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after(undefined, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("from_id undefined");   
    });  

    it("to_id undefined", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after("invaldID1", undefined);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("to_id undefined");   
    });

    it("from_id && to_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after("invaldID1", "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 && invaldID2 index not found");   
    }); 

    it("from_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after("invaldID1", to_id);   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID1 index not found");   
    }); 

    it("to_id index not found", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after(from_id, "invaldID2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("invaldID2 index not found");   
    });
    
    it("searchableVideoDataArray updated successfully", () =>  { 
        const moveFromTo = search.searchableVideoDataArray_move_after("id1", "id2");   
        expect(moveFromTo).toBeDefined();        
        expect(moveFromTo).toBe("searchableVideoDataArray updated successfully");   
    }); 
}); 