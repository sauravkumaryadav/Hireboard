// SourceChart - Bar chart showing applications by source
import { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Box, Typography } from '@mui/material'
import { SOURCE_LABELS, SOURCE_COLORS } from '../../constants/boardConfig'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip)

// data: [{ _id: 'referral', count: 2 }, ...]  -> response.data from GET /api/dashboard/by-source
export default function SourceChart({ data = [] }) {

  // Highest count first (nicer to read), but each source always keeps its
  // own fixed color regardless of where it lands in the sort.
  const rows = useMemo(() => {
    return data
      .map((item) => ({
        id: item._id,
        label: SOURCE_LABELS[item._id] || item._id,
        color: SOURCE_COLORS[item._id] || '#999999',
        count: item.count,
      }))
      .sort((a, b) => b.count - a.count)
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
      backgroundColor: rows.map((row) => row.color),
      borderRadius: 4,
      barThickness: 16,
    }],
  }

  const options = {
    indexAxis: 'y',               // horizontal bars — reads better with word labels
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // y-axis labels already give identity, text-first
      tooltip: {
        callbacks: {
          label: (ctx) =>
            ` ${ctx.parsed.x} application${ctx.parsed.x === 1 ? '' : 's'} (${((ctx.parsed.x / total) * 100).toFixed(0)}%)`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0 },   // whole applications only, no "1.5"
        grid: { color: '#F1EFE8' },
      },
      y: {
        grid: { display: false },
      },
    },
  }

  return (
    <Box sx={{ height: rows.length * 36 + 24 }}>
      <Bar data={chartData} options={options} />
    </Box>
  )
}
