// return favicon
export function favicon() {
    return document.getElementById("favicon");
}

// replace favicon with original favicon
export function originalFavicon() { 
    favicon().href = "../favicon.ico";
    return "Favicon href updated";
}
  
// change favicon with a red circle bottom at left of favicon
export function addFaviconNotificationBadge() {  
    const faviconSize = 32; 

    const canvas = document.createElement("canvas");
    canvas.width = faviconSize;
    canvas.height = faviconSize;

    const context = canvas.getContext("2d");
    const img = document.createElement("img");
    img.src = favicon().href;

    img.onload = () => {
        // Draw Original Favicon as Background
        context.drawImage(img, 0, 0, faviconSize, faviconSize);

        // Draw Notification Circle
        context.beginPath();
        context.arc( canvas.width - faviconSize / 4 , canvas.height - faviconSize / 4, faviconSize / 4, 0, 2*Math.PI);
        context.fillStyle = "#e84545";
        context.fill();

        // Replace favicon
        favicon().href = canvas.toDataURL("image/png");
    };
    return "favicon notification badge added";
}
  