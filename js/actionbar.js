
function showTab(id) {
	if (id == 'buttons') {
		document.getElementById('buttons').style.display = 'inline';
		document.getElementById('tabs').style.display = 'none';
		document.getElementById('tabOverflow').style.display = 'none';
	} else if (id == 'tabs') {
		document.getElementById('tabs').style.display = 'inline';
		document.getElementById('buttons').style.display = 'none';
		document.getElementById('tabOverflow').style.display = 'none';
	} else {
		document.getElementById('tabs').style.display = 'none';
		document.getElementById('buttons').style.display = 'none';
		document.getElementById('tabOverflow').style.display = 'inline';
	}
}