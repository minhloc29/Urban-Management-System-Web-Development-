import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import NotificationList from './NotificationList';
import { useSocketContext } from '../../../../contexts/SocketContext';

// assets
import { IconBell } from '@tabler/icons-react';

// notification status options
const status = [
  {
    value: 'all',
    label: 'All Notification'
  },
  {
    value: 'new',
    label: 'New'
  },
  {
    value: 'unread',
    label: 'Unread'
  },
  {
    value: 'other',
    label: 'Other'
  }
];

// ==============================|| NOTIFICATION ||============================== //

export default function NotificationSection() {
  const theme = useTheme();
  const navigate = useNavigate();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  // Socket context for real-time notifications
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications, isConnected } = useSocketContext();

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleClearAll = () => {
    clearNotifications();
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    // Navigate based on notification type
    if (notification.type === 'NEW_INCIDENT' || notification.type === 'STATUS_UPDATE') {
      navigate(`/admin/reports/${notification.data?._id || notification.data?.incident?._id}`);
    } else if (notification.type === 'INCIDENT_ASSIGNED') {
      navigate(`/engineer/tasks/${notification.data?._id}`);
    }
    
    setOpen(false);
  };

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'new':
        // Show notifications from last 24 hours
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return new Date(notification.timestamp) > oneDayAgo;
      case 'unread':
        return !notification.read;
      case 'other':
        return notification.read;
      default:
        return true;
    }
  });

  return (
    <>
      <Box sx={{ ml: 2 }}>
        <Tooltip title={isConnected ? 'Connected' : 'Disconnected'}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            max={99}
            overlap="circular"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                color: theme.vars?.palette?.warning?.dark || theme.palette.warning.dark,
                background: theme.vars?.palette?.warning?.light || theme.palette.warning.light,
                '&:hover, &[aria-controls="menu-list-grow"]': {
                  color: theme.vars?.palette?.warning?.light || theme.palette.warning.light,
                  background: theme.vars?.palette?.warning?.dark || theme.palette.warning.dark
                },
                // Connection indicator border
                border: `2px solid ${isConnected ? theme.palette.success.main : theme.palette.error.main}`,
              }}
              ref={anchorRef}
              aria-controls={open ? 'menu-list-grow' : undefined}
              aria-haspopup="true"
              onClick={handleToggle}
            >
              <IconBell stroke={1.5} size="20px" />
            </Avatar>
          </Badge>
        </Tooltip>
      </Box>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        modifiers={[{ name: 'offset', options: { offset: [downMD ? 5 : 0, 20] } }]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{ maxWidth: 330 }}
                  >
                    <Stack sx={{ gap: 2 }}>
                      {/* Header */}
                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center', justifyContent: 'space-between', pt: 2, px: 2 }}
                      >
                        <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
                          <Typography variant="subtitle1">Notifications</Typography>
                          <Chip
                            size="small"
                            label={unreadCount}
                            variant="filled"
                            sx={{
                              color: 'background.default',
                              bgcolor: unreadCount > 0 ? 'error.main' : 'warning.dark',
                            }}
                          />
                          {/* Connection status indicator */}
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: isConnected ? 'success.main' : 'error.main',
                            }}
                          />
                        </Stack>
                        <Typography
                          component={Link}
                          to="#"
                          variant="subtitle2"
                          sx={{ color: 'primary.main', cursor: 'pointer' }}
                          onClick={handleMarkAllRead}
                        >
                          Mark all read
                        </Typography>
                      </Stack>

                      {/* Filter and Content */}
                      <Box
                        sx={{
                          height: 1,
                          maxHeight: 'calc(100vh - 205px)',
                          overflowX: 'hidden',
                          '&::-webkit-scrollbar': { width: 5 },
                        }}
                      >
                        <Box sx={{ px: 2, pt: 0.25 }}>
                          <TextField
                            id="notification-filter"
                            select
                            fullWidth
                            value={filter}
                            onChange={handleFilterChange}
                            slotProps={{ select: { native: true } }}
                          >
                            {status.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </TextField>
                        </Box>
                        <Divider sx={{ mt: 2 }} />

                        {/* Notification List */}
                        <NotificationList
                          notifications={filteredNotifications}
                          onNotificationClick={handleNotificationClick}
                        />
                      </Box>
                    </Stack>

                    {/* Actions */}
                    <CardActions sx={{ p: 1.25, justifyContent: 'space-between' }}>
                      <Button size="small" color="error" onClick={handleClearAll} disableElevation>
                        Clear All
                      </Button>
                      <Button size="small" disableElevation onClick={() => navigate('/notifications')}>
                        View All
                      </Button>
                    </CardActions>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}