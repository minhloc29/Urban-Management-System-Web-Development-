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

