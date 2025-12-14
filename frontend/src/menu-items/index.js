import adminMenu from './admin';
import managerMenu from './engineer';
import accountantMenu from './user';

export function getMenuByRole(role) {
  switch (role) {
    case 'authority':
      return adminMenu;
    case 'technician':
      return managerMenu;
    case 'citizen':
      return accountantMenu;
    default:
      return { items: [] };
  }
}
