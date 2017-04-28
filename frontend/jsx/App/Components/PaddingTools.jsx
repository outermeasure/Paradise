export const
	addPaddingToCardCollection = (maxItemsPerPage, items) => {
		const gcd = (a, b) => {
			if (a % b === 0) {
				return b;
			}
			return gcd(b, a % b);
		};
		let p = 1;
		for (let i = 1; i <= maxItemsPerPage; i++) {
			p = i * p / gcd(i, p);
		}

		const rItems = [];
		for (let i = 0; i < items.length; i++) {
			rItems.push(items[i]);
		}

		for (let i = rItems.length; i % p !== 0; i++) {
			rItems.push({
				empty: true,
			});
		}
		return rItems;
	};
