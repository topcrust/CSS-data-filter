
/* cancelDropdownMenu.js */

;(function(i) {

if(i) {
	document.addEventListener('click', function(e) {
		if(e.target !== i && e.target !== i.nextSibling) i.checked = false;
	}, false);
	document.addEventListener('keydown', function(e) {
		if(e.keyCode == 27) i.checked = false;
	}, false);
}

})( document.getElementById('m1-inp') );

/* cloneMenu.js */

;(function(h, f) {

h && f && f.insertAdjacentHTML('afterBegin', '<li class="m3-i"><a href="/" class="m3-a">Home</a></li>' + h.innerHTML.replace(/="m1-/g, '="m3-'));

})( document.querySelector('.m1') , document.querySelector('.m3') );

/* dataFilter.js */

;(function(){

function dataFilterHelper(el) {
	var selector = el.getAttribute('data-filter-selector');
	selector = selector.split(':');
	var scheme_els = el.querySelectorAll('[data-filter-id]');
	var scheme = [];
	for(var i = scheme_els.length; i--;) {
		scheme.push(+scheme_els[i].getAttribute('data-filter-id'));
	}
	var rows = el.querySelectorAll(selector[0]);
	var items;
	for(var i = 0, l = rows.length; i<l; i++) {
		items = rows[i].querySelectorAll(selector[1]);
		if(items.length) {
			scheme.forEach(function(num) {
				rows[i].setAttribute('data-filter-v' + num, items[ num ].textContent.toLowerCase());
			});
		}
	}
}

function dataFilter(el) {

// init
	var el_style = document.createElement('style');
	el_style.appendChild(document.createTextNode("")); // webkit fix: https://davidwalsh.name/add-rules-stylesheets
	document.head.appendChild(el_style);
	var sheet = el_style.sheet;

	var el_reset = el.querySelector('.js-data-filter-reset');
	if(el_reset) el_reset.onclick = reset;

	var inps = el.querySelectorAll('input');
	var inps_len = inps.length;
	for(var i = inps_len; i--;) {
		inps[i].oninput = handle_input;
	}

	var el_css_prefix = data_filter_selector + data_filter_id;
	el.className += ' ' + el_css_prefix;
	var default_display_value = window.getComputedStyle( el.querySelector('[data-filter-v0]') ).display;

	function handle_input() {
		var str = '', i = inps_len, marker;
		for(;i--;) {
			var val = inps[i].value;
			if(val[0] === '*') {
				val = val.substr(1);
				marker = '*';
			} else {
				marker = '^';
			}
			if(val !== '') {
				str += '[data-filter-v' + inps[i].getAttribute('data-filter-id') + marker + '="' + val + '"]';
			}
		}

		if(str) {
			delete_all_css_rules();
			sheet.insertRule('.' + el_css_prefix + ' [data-filter-v0]{display:none}', 0);
			sheet.insertRule('.' + el_css_prefix + ' ' + str + '{display:' + default_display_value + '}', 1);
		} else {
			reset();
		}
	}

	function delete_all_css_rules() {
		while(sheet.cssRules.length) {
			sheet.deleteRule(0);
		}
	}

	function reset() {
		for(var i = inps_len; i--;) {
			if(inps[i].value !== '*') inps[i].value = '';
		}
		delete_all_css_rules();
	}

};

var data_filter_selector = 'js-data-filter';
var data_filter_els = document.querySelectorAll('.' + data_filter_selector);
// var data_filter_id = data_filter_els.length;
// while(data_filter_id--) {
for(var data_filter_id = 0, l = data_filter_els.length ; data_filter_id < l ; data_filter_id++) {
	dataFilterHelper(data_filter_els[ data_filter_id ]);
	dataFilter(data_filter_els[ data_filter_id ]);
}

})();
