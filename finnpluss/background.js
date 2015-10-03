// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
    // Replace all rules ...
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
	    // With a new rule ...
	    chrome.declarativeContent.onPageChanged.addRules([
	      {
	        // That fires when a page's URL contains a 'g' ...
	        conditions: [
  	          new chrome.declarativeContent.PageStateMatcher({
  	            pageUrl: { urlPrefix: 'http://www.finn.no/finn/realestate/homes/result' },
  	          }),
	          new chrome.declarativeContent.PageStateMatcher({
	            pageUrl: { urlPrefix: 'https://www.finn.no/finn/realestate/homes/result' },
	          })
	        ],
	        // And shows the extension's page action.
	        actions: [ new chrome.declarativeContent.ShowPageAction() ]
	      }
	    ]);
  });
});

// Called when the user clicks on the browser action.
/*chrome.pageAction.onClicked.addListener(function(tab) {
});*/
