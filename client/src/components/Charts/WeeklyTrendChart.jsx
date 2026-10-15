// WeeklyTrendChart - Line chart (Chart.js) showing applications per week
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from 'chart.js'
import { Box, Typography } from '@mui/material'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const SERIES_COLOR = '#2a78d6' // same "blue" slot used as the default single-series hue

// data: [{ _id: '2026-37', count: 2 }, ...]  -> response.data from GET /api/dashboard/weekly-trend
// _id is "<year>-<week number>" (from Mongo's %Y-%U), already sorted oldest -> newest
export default function WeeklyTrendChart({ data = [] }) {

  const rows = useMemo(() => {
    return data.map((item) => {
      const [, week] = item._id.split('-')
      return { key: item._id, label: `Wk ${Number(week)}`, count: item.count }
    })
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
      borderColor: SERIES_COLOR,
      backgroundColor: `${SERIES_COLOR}22`, // light fill under the line
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: SERIES_COLOR,
      fill: true,
      tension: 0.3,
    }],
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }, // single series — title above the card already names it
      tooltip: {
        callbacks: {
          title: (items) => rows[items[0].dataIndex]?.key,
          label: (ctx) => ` ${ctx.parsed.y} application${ctx.parsed.y === 1 ? '' : 's'}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }, // whole applications only
        grid: { color: '#F1EFE8' },
      },
      x: {
        grid: { display: false },
      },
    },
  }

  return (
    <Box sx={{ height: 220 }}>
      <Line data={chartData} options={options} />
    </Box>
  )
}
