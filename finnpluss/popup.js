// http://stackoverflow.com/questions/17567624/pass-parameter-using-executescript-chrome

function withCurrentTab(cb) {
	chrome.tabs.query(
		{ currentWindow: true, active: true },
		function (tabArray) {
			var tab = tabArray[0];
	  	    cb(tab);
		}
	);
}

$(function() {
	var loaded = false;

	function notifyContentScript() {
		withCurrentTab(function(tab) {
		  	chrome.tabs.sendMessage(tab.id, {message: 'render'});
		});
	}
	
	function setNumRows(numRows) {
		withCurrentTab(function(tab) {
			var newUrl = URI(tab.url).setSearch('rows', numRows).toString();
			console.log(newUrl);
			chrome.tabs.update(tab.id, {url: newUrl});
		});
	}
	
	notifyContentScript();

	chrome.storage.local.get(['limit', 'hideSold'], function(items) {
		//console.log('Limit ' + items.limit);
		$('#limit').val(items.limit);
		$('#hideSold').prop('checked', items.hideSold);
	});

	withCurrentTab(function(tab) {
		var rows = URI(tab.url).search(true).rows;
		if (rows == null) rows = 30; // default value
		$('#numRows').val(rows);
		loaded = true;
	});


	
	$('#numRows').change(function() {
		if (!loaded) return;

		var numRows = $(this).val();
		setNumRows(numRows);
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
	
	
	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
		switch (message.message) {
			case 'filteredCountUpdated':
			$('#numFiltered').text(message.value);
			break;
		}
	});
});