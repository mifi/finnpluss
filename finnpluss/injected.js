var numFiltered = 0;

function filter(cb) {
	chrome.storage.local.get(['limit', 'hideSold'], function(items) {
		//console.log(items);

		var priceLimit = items.limit;
		var hideSold = items.hideSold;
	
		if (!priceLimit) priceLimit = 0;

		function filterElems(inverse) {
			return $('.mod.mtn.mhn.mbs').filter(function(i, element) {
				var priceOk = false;

				var $matchingOtherInfo = $(this).find('[data-automation-id="other_info"] div').filter(function(i, element) {
					var elementText = $(element).text();
					return elementText.startsWith('Fellesutg.:');
				});
				
				if ($matchingOtherInfo.length == 1) {
					var elementText = $matchingOtherInfo.text();

					var parsedText = elementText.replace(/^Fellesutg.:\s+([\s0-9]+),-/, '$1').replace('\xA0', '');
					if (isNaN(parsedText)) priceOk = true;
					else priceOk = priceLimit == 0 || parseInt(parsedText) <= priceLimit;
				}
				else {
					priceOk = true;
				}
				
			 	var isSold = $(this).find('.ribbon.sold').length > 0;
			    var soldStatusOk = !hideSold || !isSold;

			    // This is an XOR:
				return inverse != (priceOk && soldStatusOk);
			});
		}
		
		var $toHide = filterElems(true);
		var $toShow = filterElems(false);
		numFiltered = $toHide.length;

		if ($toShow.length == 0 && numFiltered == 0) {
			console.log('Found no rows to filter');
		}

		console.log('Filtered ' + $toHide.length + ' rows. Showing ' + $toShow.length);
		$toHide.hide();
		$toShow.show();
		
		if (cb != null) cb();
	});
}

filter();

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch (message.message) {
		case 'getFilteredCount':
		filter(function() {
			sendResponse(numFiltered);
		});
		return true;
		break;
		
		case 'render':
		filter(function() {
			sendResponse(numFiltered);
		});
		return true;
		break;
	}
});