export const RoomTypes = {
	SINGLE_ROOM: 0,
	DOUBLE_ROOM: 1,
	FAMILY_ROOM: 2,
};

export const Data = {
	[RoomTypes.SINGLE_ROOM]: {
		label: "Single",
		labelRo: "Single",
		persons: 1,
		priceLei: 220,
		singleBeds: 1,
		doubleBeds: 0,
		sofas: 0,
	},
	[RoomTypes.DOUBLE_ROOM]: {
		label: "Double",
		labelRo: "Dubla",
		persons: 2,
		priceLei: 260,
		singleBeds: 0,
		doubleBeds: 1,
		sofas: 0,
	},
	[RoomTypes.FAMILY_ROOM]: {
		label: "Family",
		labelRo: "Familiala",
		persons: 3,
		priceLei: 380,
		singleBeds: 0,
		doubleBeds: 1,
		sofas: 1,
	},
};
