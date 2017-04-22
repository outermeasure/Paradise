export const
	getNights = (startDate, endDate) => {
		startDate = new Date(startDate.getYear(), startDate.getMonth(), startDate.getDate());
		endDate = new Date(endDate.getYear(), endDate.getMonth(), endDate.getDate());
		return (endDate.getTime() - startDate.getTime()) / 24 / 3600 / 1000
	},
	getJSON = (url, next) => {
		const request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.onload = function () {
			if (request.status >= 200 && request.status < 400) {
				const data = JSON.parse(request.responseText);
				next(data, null);
			} else {
				next(null, [
					`Server error (${request.status})`,
				]);
			}
		};

		request.onerror = function () {
			next(null, [
				"Service unavailable",
			]);
		};
		request.send();
	};
