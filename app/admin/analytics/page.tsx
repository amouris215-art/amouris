'use client'

import { useState, useEffect } from 'react'
import { getAnalyticsData } from '@/lib/actions/analytics'
import { TrendingUp, BarChart3, PieChart, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell
} from 'recharts'

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const result = await getAnalyticsData()
        setData(result)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-900" size={48} />
      </div>
    )
  }

  // Mock data fallback if nothing returned from action
  const revenueData = data?.revenueByDay || [
    { day: 'Lun', amount: 45000 },
    { day: 'Mar', amount: 52000 },
    { day: 'Mer', amount: 48000 },
    { day: 'Jeu', amount: 61000 },
    { day: 'Ven', amount: 55000 },
    { day: 'Sam', amount: 67000 },
    { day: 'Dim', amount: 72000 },
  ]

  const categoryData = data?.salesByCategory || [
    { name: 'Parfums', value: 65 },
    { name: 'Flacons', value: 35 },
  ]

  const COLORS = ['#064e3b', '#c2410c']

  return (
    <div className="space-y-8 p-4 md:p-0">
      <div>
        <h1 className="text-3xl font-bold font-serif text-emerald-950 flex items-center gap-3">
          <TrendingUp size={32} />
          Analytiques & Rapports
        </h1>
        <p className="text-emerald-950/40 text-sm mt-1">Performance commerciale et insights sur vos clients</p>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Panier Moyen', value: '12,450 DZD', change: '+8%', positive: true },
          { label: 'Taux de Conversion', value: '3.2%', change: '-1.5%', positive: false },
          { label: 'Clients Actifs (30j)', value: '1,240', change: '+12%', positive: true },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-emerald-50 shadow-sm">
            <div className="text-[10px] uppercase font-black tracking-widest text-emerald-950/20 mb-1">{kpi.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-black text-emerald-950">{kpi.value}</div>
              <div className={`flex items-center text-xs font-bold ${kpi.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {kpi.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {kpi.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-emerald-950 font-serif">Revenu Hebdomadaire</h2>
            <div className="text-xs bg-emerald-50 text-emerald-900 px-3 py-1 rounded-full font-bold">DZD</div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#064e3b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#064e3b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#064e3b40' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#064e3b40' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  itemStyle={{ fontWeight: 800, color: '#064e3b' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#064e3b" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-50 shadow-sm">
          <h2 className="text-xl font-bold text-emerald-950 font-serif mb-8">Part des Ventes par Type</h2>
          <div className="h-[300px] flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="space-y-4 pr-8">
               {categoryData.map((cat: any, i: number) => (
                 <div key={i} className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <div className="flex flex-col">
                     <span className="text-xs font-bold text-emerald-950">{cat.name}</span>
                     <span className="text-[10px] text-emerald-950/40 font-black uppercase tracking-widest">{cat.value}%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
