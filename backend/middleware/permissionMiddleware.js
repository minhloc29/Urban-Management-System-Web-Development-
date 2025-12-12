const Role = require('../models/Role');

const permissionMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      const userRole = req.user.role; // Assuming `req.user.role` contains the user's role ID

      console.log(userRole)

      const role = await Role.findOne({ name: userRole }).populate('permissions');

      console.log(role)
      if (!role) {
        return res.status(403).json({ success: false, message: 'Role not found' });
      }

      const userPermissions = role.permissions.map((perm) => perm.code);

      console.log(userPermissions)

      const hasPermission = requiredPermissions.every((perm) => userPermissions.includes(perm));

      console.log(hasPermission)
      
      if (!hasPermission) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  };
};

module.exports = permissionMiddleware;