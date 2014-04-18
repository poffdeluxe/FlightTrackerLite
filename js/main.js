function handleFlight(flight) {
	if(flight.actualArrTime == '') {
		//He hasn't landed yet
		$('.answer').text('NO');

		if(flight.actualDepTime == '') {
			$('.detail').text('(Flight has not departed)');
		} else {
			$('.detail').text('(Flight is en route)');

			//Pull timezone info
			$.getJSON("http://geoquo.poff.sexy/time/" + flight.depcity, function(depTz) {
				$.getJSON("http://geoquo.poff.sexy/time/" + flight.arrcity, function(arrTz) {
						//Calculate flight time
						var startDate = moment.tz(flight.schduleDepTime, depTz.timezone);
						var endDate = moment.tz(flight.scheduleArrTime, arrTz.timezone);
						var estDuration = endDate.diff(startDate, 'hours');

						var actualStartDate = moment.tz(flight.actualDepTime, depTz.timezone);
						var curDate = moment();

						var actDuration = curDate.diff(actualStartDate, 'hours');
						var percentComplete = (actDuration/estDuration)*100;

						//Show the plane & plane trail
						$('.status').show();
						$('.plane-trail').width(percentComplete + '%');
				});
			});
		}
	} else {
		$('.answer').text('YES');
		$('.answer').addClass('tremble');
	}
}

function parserData(data) {
	var flight = data[0].flightstaus[0];
	handleFlight(flight);
}

$(document).ready(function() {
	$('.status').hide();

	var configDate = moment(config.date);

	var day = configDate.date();
	var month = configDate.month()+1;
	var year = configDate.year();

	//Might need to pad day + month
	var dayStr = day + "";
	if (dayStr.length == 1) {
		dayStr = "0" + day;
	}

	var monStr = month + "";
	if (monStr.length == 1) {
		monStr = "0" + month;
	}

	$.getScript("http://ots.airchina.com.cn/website/FlightServiceServlet_en.do?departCity=&arrivedCity=&day="+ dayStr + "&month=" + monStr + "&year=" + year + "&flightNO=" + config.number)
	.done(function(script, textStatus) {
		console.log("Received response");
	})
	.fail(function() {
		console.log("Failed to load flight status");
	});

	/* Used for testing */
	/*
	var testFlight = {isShare:'N',flightno:'CA995',depcity:'Beijing',arrcity:'Houston',schduleDepTime:'2014-04-03 15:00',scheduleArrTime:'2014-04-03 14:40',actualDepTime:'2014-04-03 15:12',actualArrTime:'2014-04-03 14:40',remark:'0'};
	handleFlight(testFlight);
	*/
});
