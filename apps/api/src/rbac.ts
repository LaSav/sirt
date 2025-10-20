type Role = 'VIEWER' | 'ANALYST' | 'ADMIN'
export const can = {
  readIncident: (_: Role) => true,
  createIncident: (r: Role) => r !== 'VIEWER',
  updateIncident: (r: Role) => r === 'ANALYST' || r === 'ADMIN',
  adminOnly: (r: Role) => r === 'ADMIN',
}
