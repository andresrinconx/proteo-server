import { queryOne } from '../utils/queries';

interface PermissionNumber {
	number: string
}

export const newSerialization = async (): Promise<string> => {
	const lastRow = await queryOne<PermissionNumber>(`SELECT numero AS number FROM noper ORDER BY numero DESC LIMIT 1;`);

	const incrementedNumber = parseInt(lastRow.number, 10) + 1;
	const serialization = incrementedNumber.toString().padStart(lastRow.number.length, '0');
	return serialization;
};