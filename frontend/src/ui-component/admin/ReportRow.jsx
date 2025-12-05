// src/components/ReportRow.jsx
import React, { useState } from 'react';
import { Grid, Box, Collapse, Typography, IconButton, Avatar, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import StatusChip from './StatusChip';
import AssignEngineerModal from './AssignEngineerModal';

const RotIcon = styled(ExpandMoreIcon)(({ expand }) => ({
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: 'transform 0.2s ease'
}));

export default function ReportRow({ report, onAssigned }) {
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);

  // fallback thumbnail using uploaded file path
  const thumbnail = report.image || '/mnt/data/80ceffda-5a55-43b7-b582-b172350a6fa5.png';

  return (
    <>
      <Grid
        container
        alignItems="center"
        sx={{
          py: 2,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          '&:hover': { background: 'rgba(255,255,255,0.01)' },
          justifyContent: "space-around"
        }}
      >
        <Grid item xs={1.2}>
          <Typography>{report._id}</Typography>
        </Grid>

        <Grid item xs={2}>
              <Typography variant="body2" noWrap>
                {report.type_id?.name || "Unknown"}
              </Typography>
        </Grid>

        <Grid item xs={2.2}>
          <Typography variant="body2" noWrap>
            {report.location?.coordinates ? report.location.coordinates.join(', ') : 'Unknown'}
          </Typography>
        </Grid>

        <Grid item xs={2}>
              <Typography variant="body2" noWrap>
                {report.reporter_id?.fullName || "Unknown"}
              </Typography>
            </Grid>

        <Grid item xs={1.6}>
          <StatusChip status={report.status} />
        </Grid>

        <Grid item xs={2}>
              <Typography variant="body2" noWrap>
                {report.assigned_team_id ? report.assigned_team_id._id : "Unassigned"}
              </Typography>
            </Grid>

        <Grid item xs={0.8} textAlign="right">
          <IconButton size="small" onClick={() => setOpen((s) => !s)}>
            <RotIcon expand={open ? 1 : 0} />
          </IconButton>
          <Button size="small" onClick={() => setAssignOpen(true)} sx={{ ml: 1 }}>
            Assign
          </Button>
        </Grid>
      </Grid>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <Box display="flex" gap={2}>
            <Box component="img" src={thumbnail} alt="thumb" sx={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 1 }} />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Description</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>{report.description || 'No description provided'}</Typography>

              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255,255,255,0.6)' }}>
                Reported at: {new Date(report.createdAt || Date.now()).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>

      <AssignEngineerModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        reportId={report.id}
        onAssigned={() => {
          setAssignOpen(false);
          onAssigned && onAssigned();
        }}
      />
    </>
  );
}
