export const
	getRoDate = (date) => {
		return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
	},
	getDaysBetween = (date1, date2) => {
		return Math.floor(
			Math.abs(
				(date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)
			)
		);
	},
	postJSON = (url, json, next) => {
		const request = new XMLHttpRequest();
		request.open('POST', url, true);
		request.setRequestHeader(
			'Content-Type', 'application/json; charset=UTF-8');

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
		request.send(JSON.stringify(json));
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
