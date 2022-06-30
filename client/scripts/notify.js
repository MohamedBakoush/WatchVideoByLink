import * as basic from "../scripts/basics.js";
import * as favicon from "../scripts/favicon.js";

export function message(type,message){
    try {
        if (typeof message === "string") { 
            let notification_area;
            if(!document.getElementById("notification-area")){ // create notification_area if not available
                notification_area = basic.createElement(basic.websiteContentContainer(), "section", {
                    id : "notification-area"
                }); 
            } else{
                notification_area = document.getElementById("notification-area");
            }
            // clear notification_area, one notification at a time 
            notification_area.innerHTML = "";
            // create new notification
            const id = Math.random().toString(36).substr(2,10); 
            basic.createElement(notification_area, "section", {
                classList : `notification ${type}`,
                id : id,
                textContent : message
            }); 
            if(!document.hasFocus()){ // if user is not focued on webpage change favicon
                favicon.addFaviconNotificationBadge();
            } 
            // remove notifications after 5 sec
            const timer = new Timer( () => {
                const notifications = notification_area.getElementsByClassName("notification");
                for(let i=0;i<notifications.length;i++){
                    if(notifications[i].getAttribute("id") == id){
                        notifications[i].remove();
                    }
                } 
            },5000);  
            // check if user is focued on webpage
            const checkFocus = setInterval( () => {  
                if(document.hasFocus()){
                favicon.originalFavicon();
                clearInterval(checkFocus); 
                }else{ // change timer time to 5 sec
                timer.change(5000);  
                }
            }, 1000);    
            return "successful notify";
        } else {
        return "notify message not string";
        }
    } catch (error) {
        return error;
    }
}


// Timer Class
export class Timer { 
    constructor(callback, time){ 
        this.setTimeout(callback, time);    
    }
    // set setTimeout
    setTimeout(callback, time) {
        var self = this;
        if(this.timer) {
            clearTimeout(this.timer);
        }
        this.finished = false;
        this.callback = callback;
        this.time = time;
        this.timer = setTimeout(function() {
            self.finished = true;
            callback();
        }, time);
        this.start = Date.now();
    }
    // change setTimeout time
    change(time) {
        if(!this.finished) {
            this.setTimeout(this.callback, time);
        }
    }
}
  