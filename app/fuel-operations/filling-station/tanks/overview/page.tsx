'use client'
export const dynamic = 'force-dynamic'


import { useState } from 'react'
import Link from 'next/link'
import { Droplet, AlertTriangle, TrendingDown, Gauge, Plus, ArrowRight } from 'lucide-react'
import { tankFormat } from '@/utils/tank-calcs'

interface UndergroundTank {
  id: string
  label: string
  product: 'PMS' | 'AGO' | 'DPK'
  capacityLitres: number
  currentLitres: number
  bookLitres: number
  lastDipTime: string
  connectedPumps: string[]
}

interface RecentDischarge {
  id: string
  date: string
  waybillNo: string
  truckRegNo: string
  product: 'PMS' | 'AGO' | 'DPK'
  truckTotal: number
  tankReceived: number
  shortage: number
  status: 'excess_loss' | 'within_tolerance' | 'overage'
}

export default function TankOverviewPage() {
  // Mock tank data
  const tanks: UndergroundTank[] = [
    {
      id: 'PMS-T1',
      label: 'PMS Tank 1',
      product: 'PMS',
      capacityLitres: 45000,
      currentLitres: 32500,
      bookLitres: 32650,
      lastDipTime: '2026-03-23T06:00:00Z',
      connectedPumps: ['P-001', 'P-002', 'P-003'],
    },
    {
      id: 'AGO-T1',
      label: 'AGO Tank 1',
      product: 'AGO',
      capacityLitres: 33000,
      currentLitres: 7200,
      bookLitres: 7350,
      lastDipTime: '2026-03-23T06:00:00Z',
      connectedPumps: ['P-004', 'P-005'],
    },
    {
      id: 'DPK-T1',
      label: 'DPK Tank 1',
      product: 'DPK',
      capacityLitres: 20000,
      currentLitres: 14800,
      bookLitres: 14900,
      lastDipTime: '2026-03-23T06:00:00Z',
      connectedPumps: ['P-006'],
    },
  ]

  // Mock recent discharges
  const recentDischarges: RecentDischarge[] = [
    {
      id: 'dis-001',
      date: '2026-03-22',
      waybillNo: 'WB-2026-0322',
      truckRegNo: 'KN-456-ABC',
      product: 'PMS',
      truckTotal: 33000,
      tankReceived: 32850,
      shortage: 150,
      status: 'within_tolerance',
    },
    {
      id: 'dis-002',
      date: '2026-03-20',
      waybillNo: 'WB-2026-0320',
      truckRegNo: 'KN-789-XYZ',
      product: 'AGO',
      truckTotal: 33000,
      tankReceived: 32200,
      shortage: 800,
      status: 'excess_loss',
    },
  ]

  // Calculate KPIs
  const totalStock = tanks.reduce((sum, tank) => sum + tank.currentLitres, 0)
  const dischargesThisMonth = 12
  const totalDischargedLitres = 396000
  const totalShortage = 2450
  const shortageValue = 2450 * 700 // Approx ₦700/L
  const tanksBelow20Percent = tanks.filter((tank) => (tank.currentLitres / tank.capacityLitres) * 100 < 20).length

  const getProductColor = (product: 'PMS' | 'AGO' | 'DPK') => {
    switch (product) {
      case 'PMS':
        return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', fill: 'bg-amber-500' }
      case 'AGO':
        return { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-200', fill: 'bg-teal-500' }
      case 'DPK':
        return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', fill: 'bg-purple-500' }
    }
  }

  const getStatusBadge = (status: RecentDischarge['status']) => {
    switch (status) {
      case 'excess_loss':
        return { bg: 'bg-red-100', text: 'text-red-800', label: 'Excess Loss' }
      case 'within_tolerance':
        return { bg: 'bg-green-100', text: 'text-green-800', label: 'Within Tolerance' }
      case 'overage':
        return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Overage' }
    }
  }

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Underground Tanks Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live tank levels and discharge management</p>
        </div>
        <Link
          href="/fuel-operations/filling-station/tanks/discharge/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Log Discharge
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Droplet className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Stock (All Products)</p>
          <p className="text-2xl font-bold text-gray-900">{tankFormat.litres(totalStock)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Discharges This Month</p>
          <p className="text-2xl font-bold text-gray-900">{dischargesThisMonth}</p>
          <p className="text-xs text-gray-500 mt-1">{tankFormat.litres(totalDischargedLitres)} total</p>
        </div>

        <div className={`bg-white border rounded-lg p-6 ${totalShortage > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg ${totalShortage > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
              <AlertTriangle className={`h-6 w-6 ${totalShortage > 0 ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Total Shortage MTD</p>
          <p className={`text-2xl font-bold ${totalShortage > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {tankFormat.litres(totalShortage)}
          </p>
          <p className="text-xs text-gray-500 mt-1">{formatNaira(shortageValue)} value</p>
        </div>

        <div className={`bg-white border rounded-lg p-6 ${tanksBelow20Percent > 0 ? 'border-amber-200 bg-amber-50' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg ${tanksBelow20Percent > 0 ? 'bg-amber-100' : 'bg-gray-100'}`}>
              <Gauge className={`h-6 w-6 ${tanksBelow20Percent > 0 ? 'text-amber-600' : 'text-gray-400'}`} />
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-1">Tanks Below 20%</p>
          <p className={`text-2xl font-bold ${tanksBelow20Percent > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {tanksBelow20Percent}
          </p>
          {tanksBelow20Percent > 0 && <p className="text-xs text-amber-700 mt-1">Reorder required</p>}
        </div>
      </div>

      {/* Tank Cards */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Underground Tanks</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {tanks.map((tank) => {
            const fillPercentage = (tank.currentLitres / tank.capacityLitres) * 100
            const variance = tank.currentLitres - tank.bookLitres
            const productColor = getProductColor(tank.product)
            const isLow = fillPercentage < 20

            return (
              <div
                key={tank.id}
                className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md ${
                  isLow ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              >
                {/* Tank Header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{tank.label}</h3>
                    <span className={`inline-block mt-1 px-2 py-1 text-xs font-medium border rounded ${productColor.bg} ${productColor.text} ${productColor.border}`}>
                      {tank.product}
                    </span>
                  </div>
                  <Droplet className={`h-8 w-8 ${productColor.text}`} />
                </div>

                {/* Capacity Info */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Capacity</span>
                    <span className="font-medium text-gray-900">{tankFormat.litres(tank.capacityLitres)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Connected Pumps</span>
                    <span className="font-medium text-gray-900">{tank.connectedPumps.length} pumps</span>
                  </div>
                </div>

                {/* Fill Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-semibold text-gray-900">Current Level</span>
                    <span className={`font-bold ${isLow ? 'text-red-600' : productColor.text}`}>
                      {fillPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        fillPercentage < 20 ? 'bg-red-500' : fillPercentage < 50 ? 'bg-amber-500' : productColor.fill
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                  {isLow && (
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-red-700 font-medium">Reorder level - schedule refill</p>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Book Stock</p>
                    <p className="text-sm font-semibold text-gray-900">{tankFormat.litres(tank.bookLitres)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Dip Reading</p>
                    <p className="text-sm font-semibold text-gray-900">{tankFormat.litres(tank.currentLitres)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time of Last Dip</p>
                    <p className="text-sm text-gray-700">
                      {new Date(tank.lastDipTime).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Book vs Physical</p>
                    <p className={`text-sm font-semibold ${variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {variance > 0 ? '+' : ''}{tankFormat.litres(Math.abs(variance))}
                    </p>
                  </div>
                </div>

                {/* Connected Pumps Tags */}
                <div className="pt-3 border-t border-gray-200 mt-3">
                  <p className="text-xs text-gray-500 mb-2">Connected Pumps</p>
                  <div className="flex flex-wrap gap-1">
                    {tank.connectedPumps.map((pump) => (
                      <span key={pump} className="px-2 py-1 text-xs font-mono bg-gray-100 text-gray-700 rounded">
                        {pump}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Discharges */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Discharges</h2>
          <Link
            href="/fuel-operations/filling-station/tanks/history"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waybill No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck Chart Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tank Received</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shortage</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentDischarges.map((discharge) => {
                const productColor = getProductColor(discharge.product)
                const statusBadge = getStatusBadge(discharge.status)

                return (
                  <tr key={discharge.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(discharge.date).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/fuel-operations/filling-station/tanks/discharge/${discharge.id}`}
                        className="text-sm font-mono font-medium text-blue-600 hover:text-blue-800"
                      >
                        {discharge.waybillNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-900">{discharge.truckRegNo}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium border rounded ${productColor.bg} ${productColor.text} ${productColor.border}`}>
                        {discharge.product}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tankFormat.litres(discharge.truckTotal)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{tankFormat.litres(discharge.tankReceived)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-red-600">{tankFormat.litres(discharge.shortage)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${statusBadge.bg} ${statusBadge.text}`}>
                        {statusBadge.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/fuel-operations/filling-station/tanks/dipping"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Gauge className="h-6 w-6 text-blue-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Daily Dipping</h3>
          <p className="text-sm text-gray-500">Record morning and evening tank dip readings</p>
        </Link>

        <Link
          href="/fuel-operations/filling-station/tanks/variances"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Variance Summary</h3>
          <p className="text-sm text-gray-500">Review discharge variances by period</p>
        </Link>

        <Link
          href="/fuel-operations/filling-station/tanks/config/tanks"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="p-3 bg-gray-100 rounded-lg">
              <Droplet className="h-6 w-6 text-gray-600" />
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-2">Tank Configuration</h3>
          <p className="text-sm text-gray-500">Manage tanks, pumps, and calibration charts</p>
        </Link>
      </div>
    </div>
  )
}
