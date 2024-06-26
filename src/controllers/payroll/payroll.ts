import { UserRequest } from '../../types/user';
import { Response } from 'express';
import { query } from '../../utils/queries';
import { Payroll } from '../../types/payroll';

export const payroll = async (req: UserRequest, res: Response) => {
  const { date } = req.body;

  try {
    const payrolls = await query<Payroll>(`
      SELECT 
        DATE_FORMAT(fecha, '%d-%m-%Y') AS 'date',
        numero AS number, 
        SUM(IF(valor < 0, 0, valor)) AS assignment,
        SUM(IF(valor < 0, valor, 0)) AS deduction,
        SUM(valor) AS paid
      FROM nomina
      WHERE 
        concepto NOT IN ('900', '910', '920', '930')
        AND YEAR(fecha) = YEAR(?) 
        AND MONTH(fecha) = MONTH(?)
        AND codigo = ?
      GROUP BY numero
      ORDER BY numero DESC;
    `, [date, date, req.user.code]);
    
    const payrollsWithItems = await Promise.all(payrolls.map(async (payroll) => {
      payroll.items = await query(`
        SELECT 
          descrip AS concept,
          IF(valor < 0, 0, valor) AS assignment,
          IF(valor < 0, valor, 0) AS deduction,
          valor AS paid
        FROM nomina
        WHERE
          numero = ?
          AND codigo = ?
      `, [payroll.number, req.user.code]);
  
      return payroll;
    }));

    res.json(payrollsWithItems);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};