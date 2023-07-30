export const distinct = (value: never, index: never, self: string | never[]) => {
	return self.indexOf(value) === index;
};
