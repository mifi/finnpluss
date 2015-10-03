// http://stackoverflow.com/questions/17567624/pass-parameter-using-executescript-chrome

$(function() {
	function withCurrentTab(cb) {
		chrome.tabs.query(
			{ currentWindow: true, active: true },
			function (tabArray) {
				var tab = tabArray[0];
		  	    cb(tab);
			}
		);
	}

	function notifyContentScript() {
		withCurrentTab(function(tab) {
		  	chrome.tabs.sendMessage(tab.id, {message: 'render'}, function(response) {
				console.log('hax'+response);
	  			$('#numFiltered').text(response);
	  		});
		});
	}
	
	withCurrentTab(function(tab) {
	  	chrome.tabs.sendMessage(tab.id, {message: 'getFilteredCount'}, function(response) {
			console.log('hax'+response);
  			$('#numFiltered').text(response);
	  	});
	});


	chrome.storage.local.get(['limit', 'hideSold'], function(items) {
		//console.log('Limit ' + items.limit);
		$('#limit').val(items.limit);
		$('#hideSold').prop('checked', items.hideSold);
	});
	
	$('#limit').on('input', function() {
		var valStr = $(this).val();
		var val = valStr == null || valStr.trim() == '' ? 0 : parseInt(valStr);

		if (!isNaN(val)) {
			chrome.storage.local.set({'limit': val}, function() {
				notifyContentScript();
			});
		}
	});
	
	$('#hideSold').change(function() {
		chrome.storage.local.set({'hideSold': $(this).prop('checked')}, function() {
			notifyContentScript();
		});
	});
});