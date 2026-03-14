const map = {
  done:     { cls:'bg-green-100 text-green-800',   label:'Done'     },
  ready:    { cls:'bg-amber-100 text-amber-800',   label:'Ready'    },
  transit:  { cls:'bg-blue-100  text-blue-800',    label:'In Transit'},
  draft:    { cls:'bg-gray-100  text-gray-600',    label:'Draft'    },
  urgent:   { cls:'bg-red-100   text-red-700',     label:'Urgent'   },
  critical: { cls:'bg-red-100   text-red-700',     label:'Critical' },
  low:      { cls:'bg-amber-100 text-amber-700',   label:'Low Stock'},
  pending:  { cls:'bg-gray-100  text-gray-500',    label:'Pending'  },
  upcoming: { cls:'bg-blue-50   text-blue-700',    label:'Upcoming' },
  scheduled:{ cls:'bg-purple-50 text-purple-700',  label:'Scheduled'},
}

export default function Badge({ status, children }) {
  const cfg = map[status] || { cls:'bg-gray-100 text-gray-500', label: status }
  return (
    <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-lg ${cfg.cls}`}>
      {children || cfg.label}
    </span>
  )
}
