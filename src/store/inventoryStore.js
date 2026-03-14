import { create } from 'zustand'

export const useInventoryStore = create((set) => ({
  kpis: {
    totalProducts: 1842,
    lowStock: 37,
    pendingReceipts: 14,
    pendingDeliveries: 29,
    transfersToday: 8,
  },

  operations: [
    { id:'REC-0089', type:'receipt',    name:'Steel Rods 12mm',       from:'Metro Steel Co.',       qty:'+50 kg',  location:'Main Store',   status:'done',    time:'09:14 AM' },
    { id:'DEL-0412', type:'delivery',   name:'Office Chairs',          from:'Client Order #4128',    qty:'−10 pcs', location:'WH-1',         status:'ready',   time:'08:52 AM' },
    { id:'INT-0203', type:'transfer',   name:'Copper Wire Spool',      from:'WH-1 → WH-2',           qty:'200 m',   location:'In transit',   status:'transit', time:'08:30 AM' },
    { id:'ADJ-0031', type:'adjustment', name:'PVC Pipes (damaged)',    from:'Rack B4 – Physical count',qty:'−3 pcs', location:'Rack B4',      status:'draft',   time:'07:55 AM' },
    { id:'REC-0088', type:'receipt',    name:'Aluminum Sheets',        from:'Alco Metals Ltd.',       qty:'+120 kg', location:'Prod. Rack',   status:'done',    time:'07:20 AM' },
    { id:'DEL-0413', type:'delivery',   name:'M8 Bolt Sets',           from:'Client Order #4130',    qty:'−200 pcs',location:'WH-2',         status:'ready',   time:'06:50 AM' },
    { id:'INT-0204', type:'transfer',   name:'Aluminum Rods',          from:'Main WH → Production', qty:'80 kg',   location:'In transit',   status:'transit', time:'06:30 AM' },
    { id:'ADJ-0032', type:'adjustment', name:'Steel Rod 8mm (write-off)',from:'Rack A5',             qty:'−2 kg',   location:'Rack A5',      status:'done',    time:'06:00 AM' },
  ],

  receipts: [
    { id:'REC-0089', supplier:'Metro Steel Co.',  product:'Steel Rods 12mm',    qty:'+50 kg',  status:'done',    date:'14 Mar 2026', warehouse:'Main Store' },
    { id:'REC-0088', supplier:'Alco Metals Ltd.', product:'Aluminum Sheets',    qty:'+120 kg', status:'done',    date:'14 Mar 2026', warehouse:'Prod. Rack' },
    { id:'REC-0087', supplier:'PVC World',        product:'PVC Pipe 20mm',       qty:'+100 pcs',status:'ready',   date:'13 Mar 2026', warehouse:'WH-1' },
    { id:'REC-0086', supplier:'Bolt Masters',     product:'M8 Bolts',            qty:'+500 pcs',status:'transit', date:'13 Mar 2026', warehouse:'WH-2' },
    { id:'REC-0085', supplier:'CableCo',          product:'Copper Wire 2.5mm',   qty:'+300 m',  status:'draft',   date:'12 Mar 2026', warehouse:'Main Store' },
  ],

  deliveries: [
    { id:'DEL-0412', customer:'Client Order #4128', product:'Office Chairs',  qty:'−10 pcs', status:'ready',   date:'14 Mar 2026', warehouse:'WH-1' },
    { id:'DEL-0413', customer:'Client Order #4130', product:'M8 Bolt Sets',   qty:'−200 pcs',status:'ready',   date:'14 Mar 2026', warehouse:'WH-2' },
    { id:'DEL-0411', customer:'Client Order #4125', product:'Steel Rods',     qty:'−30 kg',  status:'done',    date:'13 Mar 2026', warehouse:'Main Store' },
    { id:'DEL-0410', customer:'Client Order #4120', product:'PVC Pipe 20mm',  qty:'−20 pcs', status:'done',    date:'12 Mar 2026', warehouse:'WH-1' },
    { id:'DEL-0409', customer:'Client Order #4118', product:'Aluminum Sheets',qty:'−60 kg',  status:'transit', date:'12 Mar 2026', warehouse:'WH-2' },
  ],

  transfers: [
    { id:'INT-0203', from:'WH-1',    to:'WH-2',             product:'Copper Wire Spool',qty:'200 m', status:'transit', time:'08:30 AM' },
    { id:'INT-0204', from:'Main WH', to:'Production Floor', product:'Aluminum Rods',   qty:'80 kg', status:'transit', time:'06:30 AM' },
    { id:'INT-0205', from:'Main WH', to:'Production Floor', product:'Steel Rods',      qty:'100 kg',status:'ready',   time:'10:00 AM' },
    { id:'INT-0206', from:'Rack A',  to:'Rack B',           product:'PVC Pipe',        qty:'40 pcs',status:'draft',   time:'02:00 PM' },
    { id:'INT-0207', from:'WH-2',    to:'Main WH',          product:'Aluminum Sheets', qty:'60 kg', status:'draft',   time:'05:45 PM' },
  ],

  adjustments: [
    { id:'ADJ-0031', product:'PVC Pipes',    location:'Rack B4', reason:'Damaged',      qty:'−3 pcs', status:'draft', date:'14 Mar 2026' },
    { id:'ADJ-0032', product:'Steel Rod 8mm',location:'Rack A5', reason:'Write-off',    qty:'−2 kg',  status:'done',  date:'14 Mar 2026' },
    { id:'ADJ-0030', product:'M8 Bolts',     location:'Rack F3', reason:'Count mismatch',qty:'+15 pcs',status:'done', date:'13 Mar 2026' },
    { id:'ADJ-0029', product:'Copper Wire',  location:'Rack C4', reason:'Damaged',      qty:'−5 m',   status:'done',  date:'12 Mar 2026' },
  ],

  alerts: [
    { id:1, name:'Steel Rod 8mm',      have:'3 kg',   need:'50 kg',  severity:'critical' },
    { id:2, name:'Copper Cable 2.5mm', have:'0 m',    need:'—',      severity:'critical' },
    { id:3, name:'PVC Pipe 20mm',      have:'18 pcs', need:'40 pcs', severity:'low' },
    { id:4, name:'M8 Bolts',           have:'120 pcs',need:'200 pcs',severity:'low' },
  ],

  warehouses: [
    { id:1, name:'Main Warehouse',   pct:83, color:'#6D28D9', status:'Almost full — plan ahead' },
    { id:2, name:'Production Floor', pct:61, color:'#D97706', status:'Moderate — space available' },
    { id:3, name:'Warehouse 2',      pct:42, color:'#2563EB', status:'Good — plenty of space' },
    { id:4, name:'Cold Storage',     pct:29, color:'#6D28D9', status:'Mostly empty' },
  ],

  topProducts: [
    { rank:1, name:'Steel Rods 12mm',   moved:'320 kg',  pct:100 },
    { rank:2, name:'Copper Wire 2.5mm', moved:'215 m',   pct:67  },
    { rank:3, name:'Aluminum Sheets',   moved:'180 kg',  pct:56  },
    { rank:4, name:'Office Chairs',     moved:'94 pcs',  pct:29  },
    { rank:5, name:'M8 Bolts',          moved:'850 pcs', pct:20  },
  ],

  stockHealth: [
    { label:'Healthy',     count:1538, pct:83, color:'#16A34A' },
    { label:'Running Low', count:267,  pct:14, color:'#D97706' },
    { label:'Critical',    count:25,   pct:2,  color:'#DC2626' },
    { label:'Out of Stock',count:12,   pct:1,  color:'#6D28D9' },
  ],

  staffTasks: {
    pickList: [
      { id:1, name:'Steel Rods 12mm',    location:'Rack A3 · Aisle 2 · Main WH', qty:'50 kg',  status:'done',    urgent:false },
      { id:2, name:'Aluminum Sheets',    location:'Rack B1 · Aisle 3 · Main WH', qty:'120 kg', status:'done',    urgent:false },
      { id:3, name:'Office Chairs',      location:'Rack D2 · Aisle 5 · Main WH', qty:'10 pcs', status:'pending', urgent:true  },
      { id:4, name:'Copper Wire 2.5mm',  location:'Rack C4 · Aisle 4 · Main WH', qty:'200 m',  status:'pending', urgent:true  },
      { id:5, name:'PVC Pipe 20mm',      location:'Rack E1 · Aisle 6 · Main WH', qty:'18 pcs', status:'pending', urgent:false },
      { id:6, name:'M8 Bolts',           location:'Rack F3 · Aisle 1 · Main WH', qty:'500 pcs',status:'pending', urgent:false },
    ],
    transfers: [
      { id:1, from:'Main WH',  to:'Production Floor', item:'Steel Rods',      qty:'100 kg', time:'10:00 AM' },
      { id:2, from:'WH-1',     to:'WH-2',             item:'Copper Cable',    qty:'50 m',   time:'11:30 AM' },
      { id:3, from:'Rack A',   to:'Rack B',           item:'PVC Pipe',        qty:'40 pcs', time:'02:00 PM' },
      { id:4, from:'WH-2',     to:'Main WH',          item:'Aluminum Sheets', qty:'60 kg',  time:'05:45 PM' },
    ],
    shelving: [
      { id:1, name:'Steel Rods 12mm',  location:'Rack A3 · Aisle 2', qty:'+50 kg'   },
      { id:2, name:'Aluminum Sheets',  location:'Rack B1 · Aisle 3', qty:'+120 kg'  },
      { id:3, name:'M8 Bolts (box)',   location:'Rack F3 · Aisle 1', qty:'+500 pcs' },
    ],
    counting: [
      { id:1, name:'PVC Pipes 20mm',    location:'Rack E1', systemQty:'18 pcs' },
      { id:2, name:'Copper Wire 2.5mm', location:'Rack C4', systemQty:'0 m'    },
      { id:3, name:'Steel Rod 8mm',     location:'Rack A5', systemQty:'3 kg'   },
    ],
  },

  togglePickItem: (id) => set((s) => ({
    staffTasks: {
      ...s.staffTasks,
      pickList: s.staffTasks.pickList.map((p) =>
        p.id === id ? { ...p, status: p.status === 'done' ? 'pending' : 'done' } : p
      ),
    },
  })),
}))
