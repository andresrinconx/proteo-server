import { PermissionToBoss } from '../types/permissions';
import { queryOne } from '../utils/queries';

interface PermissionNumber {
	number: string
}

export const getPermissionToBoss = async (permissionId: string): Promise<PermissionToBoss> => {
  const permissionToBoss = await queryOne<PermissionToBoss>(`
    SELECT
      n.numero AS id,
      DATE_FORMAT(n.fsolicita, '%d-%m-%Y') AS 'date',
      CONCAT(p.nombre, ' ', p.apellido) AS name,
      'Por aprobar' AS status,
      (
        SELECT 
          IF(a.estatus IN('A', 'R'), NULL,
            IF(a.supervisor IS NULL AND a.tipomot='M', d.codigo, 
              IF(a.supervisor = 'SM', b.evaluador, 
                IF(a.supervisor = 'SMA', e.codigo,  
                  IF(a.supervisor IS NULL AND a.tipomot = 'O', b.evaluador, 
                    IF(a.supervisor = 'SO', e.codigo, 'A')
                  )
                )
              )
            )
          ) AS bossId
        FROM noper a
        JOIN pers b ON a.codigo = b.codigo
        LEFT JOIN pers d ON d.cargo = '113'
        LEFT JOIN pers e ON e.cargo = '132'
        WHERE a.numero = ?
      ) AS bossId
    FROM noper n
    JOIN pers p ON n.codigo = p.codigo
    WHERE
      numero = ?;
  `, [permissionId, permissionId]);

  return permissionToBoss;
};

export const newSerialization = async (): Promise<string> => {
	const lastRow = await queryOne<PermissionNumber>(`SELECT numero AS number FROM noper ORDER BY numero DESC LIMIT 1;`);

	const incrementedNumber = parseInt(lastRow.number, 10) + 1;
	const serialization = incrementedNumber.toString().padStart(lastRow.number.length, '0');
	return serialization;
};