import { Box, Paper, Typography } from '@mui/material';
import { useStats, useWeeklyTrend, useByStatus, useBySource, useResponseTime } from '../hooks/useDashboard';
import StatusChart from '../components/Charts/StatusChart';
import SourceChart from '../components/Charts/SourceChart';
import WeeklyTrendChart from '../components/Charts/WeeklyTrendChart';

function StatCard({ label, value }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', width: 160 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
    </Paper>
  );
}

export default function Dashboard() {
  const { data: stats,        isLoading: statsLoading        } = useStats();
  const { data: weeklyTrend,  isLoading: weeklyLoading        } = useWeeklyTrend();
  const { data: byStatus,     isLoading: statusLoading        } = useByStatus();
  const { data: bySource,     isLoading: sourceLoading        } = useBySource();
  const { data: responseTime, isLoading: responseTimeLoading  } = useResponseTime();

  if (statsLoading) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <StatCard label="Total applications" value={stats?.data?.totalApplications ?? 0} />
        <StatCard label="This week"           value={stats?.data?.thisWeek ?? 0} />
        <StatCard label="Response rate"       value={`${stats?.data?.responseRate ?? 0}%`} />
        <StatCard label="Offers"              value={stats?.data?.offer ?? 0} />
      </Box>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', width: 280 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          By status
        </Typography>

        {statusLoading
          ? <Typography variant="body2" color="text.secondary">Loading...</Typography>
          : <StatusChart data={byStatus?.data || []} />
        }
      </Paper>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', width: 320 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          By source
        </Typography>

        {sourceLoading
          ? <Typography variant="body2" color="text.secondary">Loading...</Typography>
          : <SourceChart data={bySource?.data || []} />
        }
      </Paper>

      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', width: '100%' }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          Weekly trend
        </Typography>

        {weeklyLoading
          ? <Typography variant="body2" color="text.secondary">Loading...</Typography>
          : <WeeklyTrendChart data={weeklyTrend?.data || []} />
        }
      </Paper>



      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', width: 240 }}>
        <Typography variant="body2" fontWeight={600} sx={{ mb: 2 }}>
          Avg. response time
        </Typography>

        {responseTimeLoading ? (
          <Typography variant="body2" color="text.secondary">Loading...</Typography>
        ) : responseTime?.data?.avgResponseDays != null ? (
          <>
            <Typography variant="h4" fontWeight={700}>
              {responseTime.data.avgResponseDays}
              <Typography component="span" variant="body2" color="text.secondary"> days</Typography>
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Based on {responseTime.data.basedOn} application{responseTime.data.basedOn === 1 ? '' : 's'}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="text.secondary">Not enough data yet</Typography>
        )}
      </Paper>
    </Box>
  );
}
