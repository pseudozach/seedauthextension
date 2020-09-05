// chrome.extension.sendMessage({}, function(response) {
// 	var readyStateCheckInterval = setInterval(function() {
// 	if (document.readyState === "complete") {
// 		clearInterval(readyStateCheckInterval);

// 		// ----------------------------------------------------------
// 		// This part of the script triggers when page is done loading
// 		console.log("Hello. This message was sent from scripts/inject.js");
// 		// ----------------------------------------------------------

// 	}
// 	}, 10);
// });

// console.log("inject.js!!");

document.addEventListener('click', function(event) {
    event = event || window.event;
    var target = event.target || event.srcElement;

    while (target) {
      if (target instanceof HTMLAnchorElement) {
        console.log(target.getAttribute('href'));
        var clicked = target.getAttribute('href');
        if(clicked && clicked != null && clicked.toLowerCase().includes("lightning:")){
        	var lnurl = clicked.split("lightning:")[1];
        	//send it over!
        	console.log("pushing this link to bg.js: ", lnurl);
            if(chrome && chrome != null){
                //chrome extension
                chrome.extension.sendMessage({greeting: "hello", lnurl: lnurl}, function(response) {
                  // console.log(response.status);
                  console.log("whatevs");
                });
            } else {
                //firefox extension
                 var sending = browser.runtime.sendMessage({
                    greeting: "Greeting from the content script",
                    lnurl: lnurl
                 });                
            }
        }
        break;
      }

      target = target.parentNode;
    }
}, true);