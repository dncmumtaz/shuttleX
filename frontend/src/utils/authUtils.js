export function getHomeRouteByRole(role) {
  switch (role) {
    case 'CUSTOMER':
      return '/customer/search';
    case 'DRIVER':
      return '/driver/requests';
    case 'ADMIN':
      return '/unauthorized';
    default:
      return '/login';
  }
}
