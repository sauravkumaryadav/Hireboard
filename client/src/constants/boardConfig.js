export const COLUMNS = [
  { id: 'wishlist',     label: 'Wishlist',      bg: '#F1EFE8', text: '#444441', dot: '#888780' },
  { id: 'applied',      label: 'Applied',       bg: '#E6F1FB', text: '#0C447C', dot: '#185FA5' },
  { id: 'phone_screen', label: 'Phone screen',  bg: '#EEEDFE', text: '#3C3489', dot: '#7F77DD' },
  { id: 'interview',    label: 'Interview',     bg: '#FAEEDA', text: '#633806', dot: '#EF9F27' },
  { id: 'offer',        label: 'Offer',         bg: '#EAF3DE', text: '#27500A', dot: '#1D9E75' },
  { id: 'rejected',     label: 'Rejected',      bg: '#FCEBEB', text: '#791F1F', dot: '#E24B4A' },
]

export const SOURCE_LABELS = {
  linkedin:        'LinkedIn',
  naukri:          'Naukri',
  indeed:          'Indeed',
  company_website: 'Direct',
  referral:        'Referral',
  other:           'Other',
}

// Fixed categorical color per source — same order every time, never cycled
// based on how the data happens to come back, so a source keeps one color
// wherever it's charted.
export const SOURCE_COLORS = {
  linkedin:        '#2a78d6',
  naukri:          '#eb6834',
  indeed:          '#1baf7a',
  company_website: '#eda100',
  referral:        '#e87ba4',
  other:           '#008300',
}

export const TYPE_LABELS = {
  remote: 'Remote',
  onsite: 'Onsite',
  hybrid: 'Hybrid',
}
