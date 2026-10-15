// StatusChart - Doughnut chart showing distribution by status
import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Box, Typography, Stack } from '@mui/material'
import { COLUMNS } from '../../constants/boardConfig'

ChartJS.register(ArcElement, Tooltip)

// data: [{ _id: 'applied', count: 2 }, ...]  -> response.data from GET /api/dashboard/by-status
export default function StatusChart({ data = [] }) {

  // Map raw counts onto the fixed column order/colors used across the whole app,
  // so a status always has the same color here as it does on the Kanban board.
  const rows = useMemo(() => {
    const countByStatus = Object.fromEntries(
      data.map((item) => [item._id, item.count])
    )

    return COLUMNS
      .map((col) => ({ ...col, count: countByStatus[col.id] || 0 }))
      .filter((col) => col.count > 0)
  }, [data])

  const total = rows.reduce((sum, row) => sum + row.count, 0)

  if (total === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="text.secondary">
          No applications yet
        </Typography>
      </Box>
    )
  }

  const chartData = {
    labels: rows.map((row) => row.label),
    datasets: [{
      data: rows.map((row) => row.count),
      backgroundColor: rows.map((row) => row.dot),
      borderColor: '#fff',
      borderWidth: 2,
      hoverOffset: 6,
    }],
  }

  const options = {
    cutout: '72%',
    plugins: {
      legend: { display: false },   // custom legend rows below, with counts
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.label}: ${ctx.parsed} (${((ctx.parsed / total) * 100).toFixed(0)}%)`,
        },
      },
    },
  }

  return (
    <Box>
      <Box sx={{ position: 'relative', width: 180, height: 180, mx: 'auto' }}>
        <Doughnut data={chartData} options={options} />

        {/* Center label */}
        <Box sx={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <Typography variant="h5" fontWeight={700}>{total}</Typography>
          <Typography variant="caption" color="text.secondary">Total</Typography>
        </Box>
      </Box>

      {/* Legend — status + count, so identity never relies on color alone */}
      <Stack spacing={0.75} sx={{ mt: 2.5 }}>
        {rows.map((row) => (
          <Stack key={row.id} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: row.dot, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>{row.label}</Typography>
            <Typography variant="body2" fontWeight={600}>{row.count}</Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}
