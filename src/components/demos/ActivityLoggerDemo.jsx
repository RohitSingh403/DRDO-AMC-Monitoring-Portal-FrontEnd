import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  TextField, 
  MenuItem, 
  Divider, 
  Snackbar, 
  Alert,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Task as TaskIcon, 
  CheckCircle as CheckCircleIcon,
  Comment as CommentIcon,
  AddPhotoAlternate as AddPhotoIcon,
  AttachFile as AttachFileIcon,
  AssignmentInd as AssignmentIndIcon,
  Schedule as ScheduleIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import useActivityLogger, { activityTypes } from '../../hooks/useActivityLogger';

// Sample task data
const sampleTask = {
  id: 'sample-task-123',
  title: 'Sample Task',
  status: 'pending',
  assignedTo: 'user-456',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
};

const ActivityLoggerDemo = () => {
  const { logActivity } = useActivityLogger();
  const [activityType, setActivityType] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [activities, setActivities] = useState([]);

  const handleLogActivity = async (type, changes = {}) => {
    try {
      const activity = await logActivity({
        type,
        taskId: sampleTask.id,
        changes,
        metadata: {
          customMessage: customMessage || undefined,
        },
      });

      if (activity) {
        setActivities(prev => [{
          ...activity,
          id: `demo-${Date.now()}`,
          type,
          changes,
          createdAt: new Date().toISOString(),
          user: { name: 'Current User' },
        }, ...prev]);
        
        setSnackbar({
          open: true,
          message: 'Activity logged successfully!',
          severity: 'success',
        });
      }
    } catch (error) {
      console.error('Error logging activity:', error);
      setSnackbar({
        open: true,
        message: 'Failed to log activity',
        severity: 'error',
      });
    }
  };

  const handleCustomActivity = () => {
    if (!activityType) {
      setSnackbar({
        open: true,
        message: 'Please select an activity type',
        severity: 'warning',
      });
      return;
    }
    
    handleLogActivity(activityType, {
      custom: customMessage || 'Custom activity logged',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const activityButtons = [
    {
      type: activityTypes.TASK_STATUS_CHANGED,
      label: 'Change Status',
      icon: <CheckCircleIcon />,
      changes: { 
        status: { 
          from: sampleTask.status, 
          to: sampleTask.status === 'completed' ? 'in_progress' : 'completed' 
        } 
      },
    },
    {
      type: activityTypes.TASK_ASSIGNED,
      label: 'Reassign Task',
      icon: <AssignmentIndIcon />,
      changes: { 
        assignedTo: { 
          from: sampleTask.assignedTo, 
          to: `user-${Math.floor(Math.random() * 1000)}` 
        } 
      },
    },
    {
      type: activityTypes.TASK_DUE_DATE_CHANGED,
      label: 'Update Due Date',
      icon: <ScheduleIcon />,
      changes: { 
        dueDate: { 
          from: sampleTask.dueDate, 
          to: new Date(sampleTask.dueDate.getTime() + 3 * 24 * 60 * 60 * 1000) 
        } 
      },
    },
    {
      type: activityTypes.TASK_REMARK_ADDED,
      label: 'Add Remark',
      icon: <CommentIcon />,
      changes: { 
        text: 'This is a sample remark',
        hasPhoto: false,
      },
    },
    {
      type: activityTypes.TASK_PHOTO_ADDED,
      label: 'Add Photo',
      icon: <AddPhotoIcon />,
      changes: { 
        fileCount: 1,
        fileNames: ['sample-photo.jpg'],
      },
    },
    {
      type: activityTypes.TASK_ATTACHMENT_ADDED,
      label: 'Add Attachment',
      icon: <AttachFileIcon />,
      changes: { 
        fileCount: 1,
        fileNames: ['document.pdf'],
      },
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Activity Logger Demo
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardHeader 
              title="Log Activities" 
              subheader="Click buttons to log different types of activities"
              avatar={
                <Avatar>
                  <TaskIcon />
                </Avatar>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {activityButtons.map((button, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={button.icon}
                      onClick={() => handleLogActivity(button.type, button.changes)}
                      sx={{ height: '100%', minHeight: '80px' }}
                    >
                      {button.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              
              <Box mt={4}>
                <Typography variant="subtitle1" gutterBottom>
                  Or log a custom activity:
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <TextField
                      select
                      fullWidth
                      label="Activity Type"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      variant="outlined"
                      size="small"
                    >
                      {Object.entries(activityTypes).map(([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {value.replace(/_/g, ' ')}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      label="Custom Message (Optional)"
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      variant="outlined"
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleCustomActivity}
                      disabled={!activityType}
                    >
                      Log
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardHeader 
              title="Recent Activities" 
              subheader={`Showing ${activities.length} activities`}
            />
            <Divider />
            <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
              {activities.length > 0 ? (
                <List dense>
                  {activities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <ListItem 
                        secondaryAction={
                          <Tooltip title="Remove">
                            <IconButton 
                              edge="end" 
                              size="small"
                              onClick={() => {
                                setActivities(prev => prev.filter(a => a.id !== activity.id));
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: 'action.hover' }}>
                            {activity.icon || <TaskIcon fontSize="small" />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" noWrap>
                              {activity.type.replace(/_/g, ' ')}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="caption" color="textSecondary" noWrap>
                              {new Date(activity.createdAt).toLocaleString()}
                            </Typography>
                          }
                        />
                      </ListItem>
                      {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box p={2} textAlign="center">
                  <Typography variant="body2" color="textSecondary">
                    No activities logged yet. Use the buttons to log some activities.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ActivityLoggerDemo;
