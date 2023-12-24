import * as base62 from "base62/lib/ascii";

export function generateRandomStr(length: number) : string {
	let str = '';
	for(let i = 0; i < length; i++) {
		const random = Math.floor(Math.random() * 62);
		str += base62.encode(random);
	}
	return str;
}
