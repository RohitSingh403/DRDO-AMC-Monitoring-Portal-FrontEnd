import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Chip,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Task as TaskIcon, 
  Person as PersonIcon, 
  CheckCircle as CheckCircleIcon,
  Update as UpdateIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  PhotoCamera as PhotoCameraIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon,
  AssignmentInd as AssignmentIndIcon,
  AssignmentLate as AssignmentLateIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { getTaskActivityLogs } from '../../services/activityLogService';

const getActivityIcon = (type) => {
  switch (type) {
    case 'task_created':
      return <AssignmentIcon color="primary" />;
    case 'task_updated':
      return <UpdateIcon color="info" />;
    case 'task_status_changed':
      return <CheckCircleIcon color="success" />;
    case 'task_assigned':
      return <AssignmentIndIcon color="warning" />;
    case 'task_due_date_changed':
      return <ScheduleIcon color="info" />;
    case 'task_completed':
      return <AssignmentTurnedInIcon color="success" />;
    case 'task_cancelled':
      return <AssignmentLateIcon color="error" />;
    case 'task_remark_added':
      return <CommentIcon color="primary" />;
    case 'task_photo_added':
      return <PhotoCameraIcon color="primary" />;
    case 'task_attachment_added':
      return <AttachFileIcon color="primary" />;
    case 'task_attachment_removed':
      return <AttachFileIcon color="action" />;
    default:
      return <TaskIcon color="action" />;
  }
};

const getActivityText = (activity) => {
  const { type, user, changes } = activity;
  const userName = user?.name || 'System';
  
  switch (type) {
    case 'task_created':
      return `${userName} created this task`;
    case 'task_updated':
      return `${userName} updated the task`;
    case 'task_status_changed':
      return `${userName} changed status from "${changes?.status?.from}" to "${changes?.status?.to}"`;
    case 'task_assigned':
      return `${userName} assigned the task to ${changes?.assignedTo?.to?.name || 'someone'}`;
    case 'task_due_date_changed':
      return `${userName} changed due date from ${new Date(changes?.dueDate?.from).toLocaleDateString()} to ${new Date(changes?.dueDate?.to).toLocaleDateString()}`;
    case 'task_completed':
      return `${userName} marked the task as completed`;
    case 'task_cancelled':
      return `${userName} cancelled the task`;
    case 'task_remark_added':
      return `${userName} added a remark`;
    case 'task_photo_added':
      return `${userName} added ${changes?.fileCount || 'a'} photo${changes?.fileCount > 1 ? 's' : ''}`;
    case 'task_attachment_added':
      return `${userName} added ${changes?.fileCount || 'an'} attachment${changes?.fileCount > 1 ? 's' : ''}`;
    case 'task_attachment_removed':
      return `${userName} removed ${changes?.fileCount || 'an'} attachment${changes?.fileCount > 1 ? 's' : ''}`;
    default:
      return `${userName} performed an action`;
  }
};

const ActivityLogList = () => {
  const { taskId } = useParams();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalResults: 0,
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchActivities = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getTaskActivityLogs(taskId, {
        page,
        limit: pagination.limit,
        sortBy: 'createdAt:desc',
      });
      
      setActivities(data.results);
      setPagination({
        ...pagination,
        page: data.page,
        totalPages: data.totalPages,
        totalResults: data.totalResults,
      });
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Failed to load activity logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchActivities();
    }
  }, [taskId]);

  const handlePageChange = (event, page) => {
    fetchActivities(page);
  };

  if (loading && activities.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box p={2} textAlign="center">
        <Typography variant="body1" color="textSecondary">
          No activity logs found for this task.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Activity Logs
      </Typography>
      
      <Paper elevation={0} variant="outlined">
        <List disablePadding>
          {activities.map((activity, index) => (
            <React.Fragment key={activity._id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.default' }}>
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} alignItems={isMobile ? 'flex-start' : 'center'} gap={1}>
                      <Typography variant="subtitle2" component="span">
                        {getActivityText(activity)}
                      </Typography>
                      <Chip
                        size="small"
                        label={activity.type.replace(/_/g, ' ')}
                        color="default"
                        variant="outlined"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="span"
                    >
                      {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                    </Typography>
                  }
                />
              </ListItem>
              {index < activities.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
        
        {pagination.totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? 'small' : 'medium'}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ActivityLogList;
