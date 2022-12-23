import chroma from 'chroma-js';

export const getColorFromExpression = (value: any) => {
	if (value && Array.isArray(value)) {
		if (value[0] === 'rgb') {
			value = chroma(value.splice(1, 3)).css();
		} else if (value[0] === 'rgba') {
			value = chroma(value.splice(1, 4)).css();
		} else if (value[0] === 'match') {
			const values = value[value.length - 1];
			value = getColorFromExpression(values);
		}
	}
	return value;
};
