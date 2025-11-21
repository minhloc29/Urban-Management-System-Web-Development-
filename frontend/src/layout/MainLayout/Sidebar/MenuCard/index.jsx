import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// icon
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }) {
  const theme = useTheme();

  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: theme.palette.primary.main
          }}
        >
          Progress
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: theme.palette.grey[100]
          }}
        >
          {`${Math.round(value)}%`}
        </Typography>
      </Stack>

      <LinearProgress
        aria-label="progress of theme"
        variant="determinate"
        value={value}
        {...others}
        sx={{
          height: 10,
          borderRadius: 30,
          [`&.${linearProgressClasses.colorPrimary}`]: {
            bgcolor: theme.palette.grey[700]
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            bgcolor: theme.palette.primary.main
          }
        }}
      />
    </Stack>
  );
}

// ==============================|| SIDEBAR - MENU CARD (NEON VERSION) ||============================== //

function MenuCard() {
  const theme = useTheme();

  return (
    <Card
      sx={{
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '20px',
        background: theme.palette.darkPaper,
        backdropFilter: 'blur(16px)',
        border: `1px solid ${theme.palette.primary800}`,
        boxShadow: `0 0 24px ${theme.palette.primaryMain}40`, // neon glow

        '&:after': {
          content: '""',
          position: 'absolute',
          width: 180,
          height: 180,
          background: theme.palette.primary200,
          opacity: 0.12,
          borderRadius: '50%',
          top: -100,
          right: -90,
          filter: 'blur(40px)'
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <List disablePadding sx={{ pb: 1 }}>
          <ListItem alignItems="flex-start" disableGutters disablePadding>
            <ListItemAvatar sx={{ mt: 0 }}>
              <Avatar
                variant="rounded"
                sx={{
                  borderRadius: 2,
                  color: theme.palette.primary.main,
                  bgcolor: theme.palette.darkBackground,
                  border: `1px solid ${theme.palette.primary.main}`,
                  boxShadow: `0 0 12px ${theme.palette.primary.main}40`
                }}
              >
                <TableChartOutlinedIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>

            <ListItemText
              sx={{ mt: 0 }}
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}
                >
                  Get Extra Space
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ color: theme.palette.grey[300] }}>
                  28/23 GB
                </Typography>
              }
            />
          </ListItem>
        </List>

        <LinearProgressWithLabel value={80} />
      </Box>
    </Card>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number,
  others: PropTypes.any
};

export default memo(MenuCard);
