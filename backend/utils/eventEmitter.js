const { getIO } = require('../config/socket');


const emitNewIncident = (incident) => {
  const io = getIO();

  console.log('=== SOCKET EMIT DEBUG ===');
  console.log('Emitting new_incident to role_authority');
  console.log('Incident:', incident.title);
  console.log('=========================');

  io.to('role_authority').emit('new_incident', {
    type: 'NEW_INCIDENT',
    message: `New incident reported: ${incident.title}`,
    data: incident,
    timestamp: new Date(),
  });
};


const emitIncidentAssigned = (engineerId, incident) => {
  const io = getIO();
  io.to(`user_${engineerId}`).emit('incident_assigned', {
    type: 'INCIDENT_ASSIGNED',
    message: `You have been assigned to: ${incident.title}`,
    data: incident,
    timestamp: new Date(),
  });
};

/**
 * Emit incident status update
 */
const emitIncidentStatusUpdate = (incident, oldStatus, newStatus) => {
  const io = getIO();

  // Notify the reporter
  io.to(`user_${incident.reporter_id}`).emit('incident_updated', {
    type: 'STATUS_UPDATE',
    message: `Your incident "${incident.title}" status changed from ${oldStatus} to ${newStatus}`,
    data: { incident, oldStatus, newStatus },
    timestamp: new Date(),
  });

  // Notify anyone watching this incident
  io.to(`incident_${incident._id}`).emit('incident_updated', {
    type: 'STATUS_UPDATE',
    data: { incident, oldStatus, newStatus },
    timestamp: new Date(),
  });

  // Notify admins
  io.to('role_authority').emit('incident_updated', {
    type: 'STATUS_UPDATE',
    data: { incident, oldStatus, newStatus },
    timestamp: new Date(),
  });
};

/**
 * Emit dashboard statistics update
 */
const emitDashboardUpdate = (stats) => {
  const io = getIO();
  io.to('role_authority').emit('dashboard_update', {
    type: 'DASHBOARD_UPDATE',
    data: stats,
    timestamp: new Date(),
  });
};

module.exports = {
  emitNewIncident,
  emitIncidentAssigned,
  emitIncidentStatusUpdate,
  emitDashboardUpdate,
};