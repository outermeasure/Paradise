export const
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
