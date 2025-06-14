import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Divider, 
  Chip, 
  CircularProgress, 
  Alert, 
  Pagination, 
  Tabs, 
  Tab, 
  TextField, 
  InputAdornment,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Refresh as RefreshIcon,
  AddTask as TaskCreatedIcon,
  Update as TaskUpdatedIcon,
  CheckCircle as TaskCompletedIcon,
  Assignment as TaskAssignedIcon,
  Event as DueDateChangedIcon,
  Cancel as TaskCancelledIcon,
  Comment as CommentAddedIcon,
  FileUpload as FileUploadedIcon,
  Person as UserActionIcon,
  Settings as SettingsChangedIcon,
  MoreHoriz as DefaultActivityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuthContext } from '../contexts/AuthContext';
import { getAllActivityLogs, activityTypes } from '../services/activityLogService';

// Helper function to get appropriate icon for each activity type
const getActivityIcon = (type) => {
  switch (type) {
    case 'task_created':
      return <TaskCreatedIcon color="primary" />;
    case 'comment_added':
      return <CommentAddedIcon color="info" />;
    case 'file_uploaded':
      return <FileUploadedIcon color="info" />;
    case 'user_action':
      return <UserActionIcon color="primary" />;
    case 'settings_changed':
      return <SettingsChangedIcon color="info" />;
    case 'task_updated':
      return <TaskUpdatedIcon color="info" />;
    case 'task_status_changed':
      return <TaskCompletedIcon color="success" />;
    case 'task_assigned':
      return <TaskAssignedIcon color="warning" />;
    case 'task_due_date_changed':
      return <DueDateChangedIcon color="info" />;
    case 'task_completed':
      return <TaskCompletedIcon color="success" />;
    case 'task_cancelled':
      return <TaskCancelledIcon color="error" />;
    default:
      return <DefaultActivityIcon color="action" />;
  }
};

const getActivityText = (activity) => {
  const { type, user, changes } = activity;
  const userName = user?.name || 'System';
  
  switch (type) {
    case 'task_created':
      return `${userName} created a task`;
    case 'task_updated':
      return `${userName} updated a task`;
    case 'task_status_changed':
      return `${userName} changed status to "${changes?.status?.to || 'unknown'}"`;
    case 'task_assigned':
      return `${userName} assigned the task to ${changes?.assignedTo?.to?.name || 'someone'}`;
    case 'task_due_date_changed':
      return `${userName} updated the due date`;
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

const ActivityLogsPage = () => {
  const auth = useAuthContext();
  const user = auth?.currentUser;
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalPages: 1,
    totalResults: 0,
  });

  const fetchActivities = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        userId: tabValue === 'my' ? user?.id : undefined,
        type: filterType !== 'all' ? filterType : undefined,
        search: searchQuery || undefined,
      };
      
      const data = await getAllActivityLogs({
        ...filters,
        page,
        limit: pagination.limit,
      });
      
      setActivities(data.results || []);
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
    fetchActivities();
  }, [tabValue, filterType, searchQuery]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
    fetchActivities(page);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      fetchActivities(1);
    }
  };

  const handleRefresh = () => {
    fetchActivities(pagination.page);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Activity Logs
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={handleRefresh} color="primary" disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All Activities" value="all" />
          <Tab label="My Activities" value="my" />
        </Tabs>
      </Paper>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Search activities..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: { minWidth: 250 }
          }}
        />
        
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon color="action" />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="activity-type-filter-label">Filter by Type</InputLabel>
            <Select
              labelId="activity-type-filter-label"
              id="activity-type-filter"
              value={filterType}
              onChange={handleFilterChange}
              label="Filter by Type"
            >
              <MenuItem value="all">All Types</MenuItem>
              {Object.entries(activityTypes).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && activities.length === 0 ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : activities.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="textSecondary">
            No activities found
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {searchQuery || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'There are no activities to display at the moment.'}
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper variant="outlined">
            <List disablePadding>
              {activities.map((activity, index) => (
                <React.Fragment key={activity._id || index}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.default' }}>
                        {getActivityIcon(activity.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} gap={1}>
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
                        <>
                          <Typography
                            variant="caption"
                            color="textSecondary"
                            component="span"
                            display="block"
                            mt={0.5}
                          >
                            {format(new Date(activity.createdAt), 'MMM d, yyyy h:mm a')}
                          </Typography>
                          {activity.changes?.text && (
                            <Typography
                              variant="body2"
                              sx={{ mt: 1, fontStyle: 'italic' }}
                            >
                              "{activity.changes.text}"
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                  {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
          
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivityLogsPage;
