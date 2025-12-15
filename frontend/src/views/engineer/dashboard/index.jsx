// src/pages/Engineer/index.jsx
import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";
import TaskMap from "ui-component/extended/TaskMap";
import AssignedTasksCard from "./cards/AssignedTasksCard";
import InProgressTasksCard from "./cards/InProgressTasksCard";
import CompletedTasksCard from "./cards/CompletedTasksCard";
import AvgTimeCard from "./cards/AvgTimeCard";
import { gridSpacing } from "store/constant";
import { apiGet } from "../../../utils/api";

export default function EngineerDashboard() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const response = await apiGet('/api/engineer/assigned');
        
        console.log('API Response:', response);
        
        if (response.success) {
          setTasks(response.data || []);
        } else {
          // Handle old response format (array directly)
          setTasks(Array.isArray(response) ? response : []);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  return (
    <Grid container spacing={gridSpacing} direction="column">
      {/* TOP SUMMARY CARDS */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <AssignedTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InProgressTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <CompletedTasksCard isLoading={isLoading} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AvgTimeCard isLoading={isLoading} />
          </Grid>
        </Grid>
      </Grid>

      
      {/* MAP VIEW */}
      <Grid item xs={12}>
        <TaskMap tasks={tasks} isLoading={isLoading} />
      </Grid>
    </Grid>
  );
}
