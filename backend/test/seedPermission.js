const mongoose = require('mongoose');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const dotenv = require('dotenv');

dotenv.config();

const seedRolesAndPermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Define permissions
    const permissions = [
      { code: 'MANAGE_ENGINEERS', description: 'Manage engineers' },
      { code: 'VIEW_ALL_INCIDENTS', description: 'View all incidents' },
      { code: 'ASSIGN_ENGINEER', description: 'Assign engineers to incidents' },
      { code: 'UPDATE_INCIDENT_STATUS', description: 'Update incident status' },
      { code: 'VIEW_ASSIGNED_TASKS', description: 'View assigned tasks' },
      { code: 'CREATE_INCIDENT', description: 'Create new incidents' },
      { code: 'VIEW_OWN_INCIDENTS', description: 'View own incidents' },
    ];

    const permissionDocs = await Permission.insertMany(permissions);

    // Define roles
    const roles = [
      {
        name: 'authority',
        permissions: permissionDocs.filter((p) =>
          ['MANAGE_ENGINEERS', 'VIEW_ALL_INCIDENTS', 'ASSIGN_ENGINEER', 'UPDATE_INCIDENT_STATUS'].includes(p.code)
        ).map((p) => p._id),
      },
      {
        name: 'technician',
        permissions: permissionDocs.filter((p) =>
          ['VIEW_ASSIGNED_TASKS', 'UPDATE_INCIDENT_STATUS'].includes(p.code)
        ).map((p) => p._id),
      },
      {
        name: 'citizen',
        permissions: permissionDocs.filter((p) =>
          ['CREATE_INCIDENT', 'VIEW_OWN_INCIDENTS'].includes(p.code)
        ).map((p) => p._id),
      },
    ];

    await Role.insertMany(roles);

    console.log('Roles and permissions seeded successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding roles and permissions:', err);
    mongoose.connection.close();
  }
};

seedRolesAndPermissions();