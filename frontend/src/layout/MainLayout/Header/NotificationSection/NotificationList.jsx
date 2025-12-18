import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// assets
import {
  IconAlertCircle,
  IconUserPlus,
  IconRefresh,
  IconBell,
} from '@tabler/icons-react';

// Get icon based on notification type
const getNotificationIcon = (type) => {
  switch (type) {
    case 'NEW_INCIDENT':
      return <IconAlertCircle stroke={1.5} size="20px" />;
    case 'INCIDENT_ASSIGNED':
      return <IconUserPlus stroke={1.5} size="20px" />;
    case 'STATUS_UPDATE':
      return <IconRefresh stroke={1.5} size="20px" />;
    default:
      return <IconBell stroke={1.5} size="20px" />;
  }
};

// Get chip color based on notification type
const getChipColor = (type) => {
  switch (type) {
    case 'NEW_INCIDENT':
      return 'error';
    case 'INCIDENT_ASSIGNED':
      return 'primary';
    case 'STATUS_UPDATE':
      return 'warning';
    default:
      return 'default';
  }
};

// Get chip label based on notification type
const getChipLabel = (type) => {
  switch (type) {
    case 'NEW_INCIDENT':
      return 'New';
    case 'INCIDENT_ASSIGNED':
      return 'Assigned';
    case 'STATUS_UPDATE':
      return 'Update';
    default:
      return 'Info';
  }
};

// Format timestamp
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

// ==============================|| NOTIFICATION LIST ||============================== //

export default function NotificationList({ notifications = [], onNotificationClick }) {
  const theme = useTheme();

  if (notifications.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <IconBell size={40} stroke={1} color={theme.palette.grey[400]} />
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          No notifications
        </Typography>
      </Box>
    );
  }

  return (
    <List
      sx={{
        width: '100%',
        maxWidth: 330,
        py: 0,
        borderRadius: '10px',
        '& .MuiListItem-root': {
          py: 1.5,
          px: 2,
        },
      }}
    >
      {notifications.map((notification, index) => (
        <React.Fragment key={notification.id}>
          <ListItem
            alignItems="flex-start"
            onClick={() => onNotificationClick(notification)}
            sx={{
              cursor: 'pointer',
              bgcolor: notification.read ? 'transparent' : 'action.hover',
              '&:hover': {
                bgcolor: 'action.selected',
              },
            }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  color: theme.palette[getChipColor(notification.type)]?.main || theme.palette.primary.main,
                  bgcolor: theme.palette[getChipColor(notification.type)]?.light || theme.palette.primary.light,
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: notification.read ? 400 : 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 180,
                  }}
                >
                  {notification.message || 'New notification'}
                </Typography>
              }
              secondary={
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatTime(notification.timestamp)}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Chip
                label={getChipLabel(notification.type)}
                size="small"
                color={getChipColor(notification.type)}
                sx={{ fontSize: '0.65rem', height: 20 }}
              />
            </ListItemSecondaryAction>
          </ListItem>
          {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
}