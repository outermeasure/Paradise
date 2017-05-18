export const
	addPadding = (maxItemsPerRow, itemsCount) => {
		const gcd = (a, b) => {
			if (a % b === 0) {
				return b;
			}
			return gcd(b, a % b);
		};
		let p = 1;
		for (let i = 1; i <= maxItemsPerRow; i++) {
			p = i * p / gcd(i, p);
		}

		const rItems = [];
		for (let i = itemsCount; i % p !== 0; i++) {
			rItems.push(0);
		}
		return rItems;
	};
