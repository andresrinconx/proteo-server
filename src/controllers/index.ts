import { auth } from './user/auth';
import { logOut } from './user/logOut';
import { createPermission } from './permissions/createPermission';
import { validateToken } from './user/validateToken';
import { profile } from './user/profile';
import { monthBirthdays } from './birthdays/monthBirthdays';
import { nextBirthdays } from './birthdays/nextBirthdays';
import { payroll } from './payroll/payroll';
import { approvePermission } from './permissions/approvePermission';
import { rejectPermission } from './permissions/rejectPermission';
import { updatePermission } from './permissions/updatePermission';
import { getUserPermissions } from './permissions/getUserPermissions';
import { getBossPermissions } from './permissions/getBossPermissions';
import { getPermission } from './permissions/getPermission';

export {
  auth,
  logOut,
  createPermission,
  validateToken,
  profile,
  monthBirthdays,
  nextBirthdays,
  payroll,
  approvePermission,
  rejectPermission,
  updatePermission,
  getUserPermissions,
  getBossPermissions,
  getPermission,
};