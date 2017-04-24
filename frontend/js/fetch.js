import {
	getJSON,
} from './utils';

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const encode = encodeURIComponent;

export const
	Photos = {
		all: (page, onReceive) =>
			getJSON(`/api/photo?${limit(20, page)}`, onReceive),
	};
