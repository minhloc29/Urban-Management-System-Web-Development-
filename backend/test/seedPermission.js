const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const dotenv = require('dotenv');

dotenv.config();

const seedRolesAndPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // -----------------------------
    // 1. Define permissions
    // -----------------------------
    const permissions = [
      { code: 'MANAGE_ENGINEERS', description: 'Manage engineers' },
      { code: 'VIEW_ALL_INCIDENTS', description: 'View all incidents' },
      { code: 'ASSIGN_ENGINEER', description: 'Assign engineers to incidents' },
      { code: 'UPDATE_INCIDENT_STATUS', description: 'Update incident status' },
      { code: 'VIEW_ASSIGNED_TASKS', description: 'View assigned tasks' },
      { code: 'CREATE_INCIDENT', description: 'Create new incidents' },
      { code: 'VIEW_OWN_INCIDENTS', description: 'View own incidents' }
    ];

    // -----------------------------
    // 2. Upsert permissions
    // -----------------------------
    const permissionMap = {};

    for (const perm of permissions) {
      const doc = await Permission.findOneAndUpdate(
        { code: perm.code },
        { $setOnInsert: perm },
        { upsert: true, new: true }
      );

      permissionMap[perm.code] = doc._id;
    }

    console.log('Permissions seeded/updated');

    // -----------------------------
    // 3. Define roles
    // -----------------------------
    const roles = [
      {
        name: 'authority',
        permissions: [
          permissionMap.MANAGE_ENGINEERS,
          permissionMap.VIEW_ALL_INCIDENTS,
          permissionMap.ASSIGN_ENGINEER,
          permissionMap.UPDATE_INCIDENT_STATUS
        ]
      },
      {
        name: 'technician',
        permissions: [
          permissionMap.VIEW_ASSIGNED_TASKS,
          permissionMap.UPDATE_INCIDENT_STATUS
        ]
      },
      {
        name: 'citizen',
        permissions: [
          permissionMap.CREATE_INCIDENT,
          permissionMap.VIEW_OWN_INCIDENTS
        ]
      }
    ];

    // -----------------------------
    // 4. Upsert roles
    // -----------------------------
    for (const role of roles) {
      await Role.findOneAndUpdate(
        { name: role.name },
        { $set: { permissions: role.permissions } },
        { upsert: true }
      );
    }

    console.log('Roles seeded/updated');
    console.log('Seeding completed successfully');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedRolesAndPermissions();
