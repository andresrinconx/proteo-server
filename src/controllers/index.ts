import { auth } from './user/auth';
import { logOut } from './user/logOut';
import { newPermission } from './permissions/newPermission';
import { validateToken } from './user/validateToken';
import { profile } from './user/profile';
import { monthBirthdays } from './birthdays/monthBirthdays';
import { nextBirthdays } from './birthdays/nextBirthdays';
import { payroll } from './payroll/payroll';
import { approvePermission } from './permissions/approvePermission';
import { rejectPermission } from './permissions/rejectPermission';
import { editPermission } from './permissions/editPermission';

export {
  auth,
  logOut,
  newPermission,
  validateToken,
  profile,
  monthBirthdays,
  nextBirthdays,
  payroll,
  approvePermission,
  rejectPermission,
  editPermission,
};