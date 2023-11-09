
export const strPad = (str: string, pad_length: number, pad_string: string, pad_type: string) => {
	const len = pad_length - str.length;

	if (len < 0) return str;
	
	const pad = new Array(len + 1).join(pad_string);
    
	if (pad_type == 'STR_PAD_LEFT') return pad + str;
    
	return str + pad;
};