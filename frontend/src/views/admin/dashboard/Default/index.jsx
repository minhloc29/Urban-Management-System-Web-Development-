import { useEffect, useState } from 'react';
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Grid, useMediaQuery, useTheme } from '@mui/material';
// material-ui
import Box from '@mui/material/Box';

// project imports (new cards & charts for Ban Quản Lý)
import TotalReportsCard from './cards/TotalReportsCard';
import InProgressReportsCard from './cards/InProgressReportsCard';
import ResolvedReportsCard from './cards/ResolvedReportsCard';
import UrgentReportsCard from './cards/UrgentReportsCard';

import ReportsByCategoryChart from './charts/ReportsByCategoryChart';
import ReportStatusBarChart from './charts/ReportStatusBarChart';
import ReportsOverTimeChart from './charts/ReportsOverTimeChart';
import TeamPerformanceChart from './charts/TeamPerformanceChart';

import { gridSpacing } from 'store/constant';

const renderMobileLayout = (isLoading) => (
  <Grid container spacing={2} direction="column">
    {/* --- Group 1: All Cards First --- */}
    <Grid item xs={12}><TotalReportsCard isLoading={isLoading} /></Grid>
    <Grid item xs={12}><InProgressReportsCard isLoading={isLoading} /></Grid>
    <Grid item xs={12}><ResolvedReportsCard isLoading={isLoading} /></Grid>
    <Grid item xs={12}><UrgentReportsCard isLoading={isLoading} /></Grid>

    {/* --- Group 2: All Charts Follow --- */}
    <Grid item xs={12}><ReportsByCategoryChart /></Grid>
    <Grid item xs={12}><ReportsOverTimeChart /></Grid>
    <Grid item xs={12}><ReportStatusBarChart /></Grid>
    <Grid item xs={12}><TeamPerformanceChart /></Grid>
  </Grid>
);

export default function Dashboard() {
  const [isLoading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      {isMobile ? (
        renderMobileLayout(isLoading)
      ) : (
        /* --- DESKTOP STRUCTURE --- */
        <Grid container spacing={gridSpacing} direction="column">
          {/* ======== TOP METRIC CARDS & TOP CHARTS ======== */}
          <Grid item>
            <Grid container direction="row" spacing={gridSpacing}>
              {/* Left Column: Metrics Group */}
              <Grid item>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <TotalReportsCard isLoading={isLoading} />
                  </Grid>
                  <Grid item>
                    <InProgressReportsCard isLoading={isLoading} />
                  </Grid>
                  <Grid item>
                    <ResolvedReportsCard isLoading={isLoading} />
                  </Grid>
                  <Grid item>
                    <UrgentReportsCard isLoading={isLoading} />
                  </Grid>
                </Grid>
              </Grid>

              {/* Middle: Category Chart */}
              <Grid item size={3}>
                <ReportsByCategoryChart />
              </Grid>

              {/* Right: Over Time Chart */}
              <Grid item size="grow">
                <ReportsOverTimeChart />
              </Grid>
            </Grid>
          </Grid>

          {/* ======== BOTTOM CHARTS & ANALYTICS ======== */}
          <Grid item xs={12}>
            <Grid container spacing={3} justifyContent="space-evenly">
              <Grid item size={6}>
                <ReportStatusBarChart />
              </Grid>
              <Grid item size="grow">
                <TeamPerformanceChart />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}