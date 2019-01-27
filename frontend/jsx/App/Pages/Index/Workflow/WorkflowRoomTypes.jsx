export const RoomTypes = {
	SINGLE_ROOM: 0,
	DOUBLE_ROOM: 1,
	FAMILY_ROOM: 2,
};

export const PriceTypes = {
	FULL_MEALS: 100,
	HALF_MEALS: 101,
	TULCEA_TRANSPORTATION: 102,
	LAKE_TRIP: 103,
	STIPOC_TRIP: 104,
	LETEA_TRIP: 105,
	SULINA_TRIP: 106,
	BOAT_GUIDE: 107,
	FISHING_BOAT: 108,
};

export const Data = {
	[PriceTypes.TULCEA_TRANSPORTATION]: {
		priceLei: 250,
		persons: 1,
	},
	[PriceTypes.FULL_MEALS]: {
		priceLei: 180,
		persons: 1,
	},
	[PriceTypes.HALF_MEALS]: {
		priceLei: 90,
		persons: 1,
	},
	[PriceTypes.LAKE_TRIP]: {
		priceLei: 150,
		persons: 1,
	},
	[PriceTypes.STIPOC_TRIP]: {
		priceLei: 200,
		persons: 1,
	},
	[PriceTypes.LETEA_TRIP]: {
		priceLei: 220,
		persons: 1,
	},
	[PriceTypes.SULINA_TRIP]: {
		priceLei: 220,
		persons: 1,
	},
	[PriceTypes.BOAT_GUIDE]: {
		priceLei: 250,
		persons: 1,
	},
	[PriceTypes.FISHING_BOAT]: {
		priceLei: 400,
		persons: 1,
	},
	[RoomTypes.SINGLE_ROOM]: {
		label: "Single",
		labelRo: "Single",
		persons: 1,
		priceLei: 260,
		priceLeiSeason: 360,
		singleBeds: 1,
		doubleBeds: 0,
		sofas: 0,
	},
	[RoomTypes.DOUBLE_ROOM]: {
		label: "Double",
		labelRo: "Dubla",
		persons: 2,
		priceLei: 320,
		priceLeiSeason: 400,
		singleBeds: 0,
		doubleBeds: 1,
		sofas: 0,
	},
	[RoomTypes.FAMILY_ROOM]: {
		label: "Family",
		labelRo: "Familiala",
		persons: 3,
		priceLei: 400,
		priceLeiSeason: 500,
		singleBeds: 0,
		doubleBeds: 1,
		sofas: 1,
	},
};
