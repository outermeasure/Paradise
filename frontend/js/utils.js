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
    isInSeason = (date) => {
        const month = date.getMonth();
        const seasonMonths = [
            5,
            6,
            7,
            8,
        ];
        return !!seasonMonths.find((seasonMonth) => seasonMonth === month);
    },
    computePrice = (dateStart, dateEnd, price, priceSeason, isPriceFormatted) => {
        const numberOfNights = getDaysBetween(
			dateStart,
            dateEnd
        );

        let full = 0, shouldFormatPrice = isPriceFormatted || false;
        for (let i = 0; i < numberOfNights; i++) {
            const aux = new Date(dateStart.getTime() + i * 24 * 60 * 60 * 1000);

            if (isInSeason(aux)) {
                full += priceSeason;
            } else {
                full += price;
            }
        }
		return shouldFormatPrice ? formatPrice(full) : full;
    },
	formatPrice = (price) => {
		const stringWithoutDecimals = price.toString().split(',')[0];
  		return stringWithoutDecimals.replace(/\./g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	},
	putJSON = (url, json, next) => {
		const request = new XMLHttpRequest();
		request.open('PUT', url, true);

		if (window.localStorage &&
			window.localStorage.getItem("XAUTHORIZATION")) {
			request.setRequestHeader(
				'X-Authorization',
				window.localStorage.getItem("XAUTHORIZATION"));
		}

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
	deleteJSON = (url, next) => {
		const request = new XMLHttpRequest();
		request.open('DELETE', url, true);

		if (window.localStorage &&
			window.localStorage.getItem("XAUTHORIZATION")) {
			request.setRequestHeader(
				'X-Authorization',
				window.localStorage.getItem("XAUTHORIZATION"));
		}

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
