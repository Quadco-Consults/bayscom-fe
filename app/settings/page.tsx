'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import { Save, Settings, Users, Building2, Globe, Bell, Shield, Database, Mail, Smartphone, Calendar, DollarSign, Package, Truck, MapPin, Clock, Eye, EyeOff } from 'lucide-react'

interface SystemSettings {
  general: {
    companyName: string
    companyLogo: string
    timezone: string
    dateFormat: string
    currency: string
    language: string
    businessType: string
    fiscalYearStart: string
  }
  security: {
    sessionTimeout: number
    passwordPolicy: {
      minLength: number
      requireSpecialChars: boolean
      requireNumbers: boolean
      requireUppercase: boolean
      expiryDays: number
    }
    twoFactorAuth: boolean
    loginAttempts: number
    lockoutDuration: number
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    lowStockAlerts: boolean
    maintenanceReminders: boolean
    paymentReminders: boolean
    approvalNotifications: boolean
  }
  modules: {
    finance: boolean
    inventory: boolean
    hr: boolean
    procurement: boolean
    operations: boolean
    reports: boolean
  }
  integrations: {
    bankingAPI: string
    sageIntegration: boolean
    mobileApp: boolean
    gpsTracking: boolean
    fuelCardSystem: string
    taxAPI: boolean
  }
  backup: {
    autoBackup: boolean
    backupFrequency: string
    retentionPeriod: number
    cloudBackup: boolean
    lastBackup: string
  }
  email: {
    smtpServer: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    senderEmail: string
    senderName: string
    encryption: string
  }
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [showPassword, setShowPassword] = useState(false)
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      companyName: 'Bayscom Petroleum Limited',
      companyLogo: '/logo.png',
      timezone: 'Africa/Lagos',
      dateFormat: 'DD/MM/YYYY',
      currency: 'NGN',
      language: 'English',
      businessType: 'Petroleum Distribution',
      fiscalYearStart: 'January'
    },
    security: {
      sessionTimeout: 120,
      passwordPolicy: {
        minLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true,
        expiryDays: 90
      },
      twoFactorAuth: true,
      loginAttempts: 3,
      lockoutDuration: 30
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      pushNotifications: true,
      lowStockAlerts: true,
      maintenanceReminders: true,
      paymentReminders: true,
      approvalNotifications: true
    },
    modules: {
      finance: true,
      inventory: true,
      hr: true,
      procurement: true,
      operations: true,
      reports: true
    },
    integrations: {
      bankingAPI: 'First Bank API v2.1',
      sageIntegration: true,
      mobileApp: true,
      gpsTracking: true,
      fuelCardSystem: 'Zenith Bank Fuel Card',
      taxAPI: true
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      cloudBackup: true,
      lastBackup: '2024-11-16 03:00:00'
    },
    email: {
      smtpServer: 'smtp.office365.com',
      smtpPort: 587,
      smtpUsername: 'erp@bayscom.ng',
      smtpPassword: '••••••••••',
      senderEmail: 'erp@bayscom.ng',
      senderName: 'BAYSCOM ERP System',
      encryption: 'TLS'
    }
  })

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'modules', label: 'Modules', icon: Package },
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'backup', label: 'Backup', icon: Database },
    { id: 'email', label: 'Email Config', icon: Mail }
  ]

  const handleSave = () => {
    // Save settings logic
    alert('Settings saved successfully!')
  }

  const handleTestEmail = () => {
    // Test email configuration
    alert('Test email sent to administrator!')
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.general.companyName}
                  onChange={(e) => setSettings({
                    ...settings,
                    general: { ...settings.general, companyName: e.target.value }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>Petroleum Distribution</option>
                  <option>Oil & Gas Trading</option>
                  <option>Retail Fuel Operations</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>Africa/Lagos</option>
                  <option>UTC</option>
                  <option>Africa/Johannesburg</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>NGN - Nigerian Naira</option>
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiscal Year Start</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>January</option>
                  <option>April</option>
                  <option>July</option>
                  <option>October</option>
                </select>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h4 className="font-medium text-yellow-800">Security Configuration</h4>
              <p className="text-sm text-yellow-700 mt-1">Configure security policies and access controls</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.security.sessionTimeout}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.security.loginAttempts}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lockout Duration (minutes)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.security.lockoutDuration}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="twoFactor"
                  checked={settings.security.twoFactorAuth}
                  className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                />
                <label htmlFor="twoFactor" className="text-sm font-medium text-gray-700">
                  Enable Two-Factor Authentication
                </label>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Password Policy</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Length</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    value={settings.security.passwordPolicy.minLength}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    value={settings.security.passwordPolicy.expiryDays}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  {[
                    { key: 'requireSpecialChars', label: 'Require Special Characters' },
                    { key: 'requireNumbers', label: 'Require Numbers' },
                    { key: 'requireUppercase', label: 'Require Uppercase Letters' }
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={key}
                        checked={settings.security.passwordPolicy[key as keyof typeof settings.security.passwordPolicy] as boolean}
                        className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                      />
                      <label htmlFor={key} className="text-sm text-gray-700">{label}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <h4 className="font-medium text-blue-800">Notification Settings</h4>
              <p className="text-sm text-blue-700 mt-1">Configure how the system sends alerts and notifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Communication Channels</h4>
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                  { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                  { key: 'pushNotifications', label: 'Push Notifications', icon: Bell }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">{label}</label>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Alert Types</h4>
                {[
                  { key: 'lowStockAlerts', label: 'Low Stock Alerts', icon: Package },
                  { key: 'maintenanceReminders', label: 'Maintenance Reminders', icon: Truck },
                  { key: 'paymentReminders', label: 'Payment Reminders', icon: DollarSign },
                  { key: 'approvalNotifications', label: 'Approval Notifications', icon: Users }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-700">{label}</label>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications[key as keyof typeof settings.notifications] as boolean}
                      className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'modules':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <h4 className="font-medium text-green-800">Module Management</h4>
              <p className="text-sm text-green-700 mt-1">Enable or disable ERP modules based on your business needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.modules).map(([key, enabled]) => (
                <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900 capitalize">{key}</h4>
                    <p className="text-sm text-gray-600">
                      {key === 'finance' && 'Accounting, invoicing, and financial reporting'}
                      {key === 'inventory' && 'Stock management and warehouse operations'}
                      {key === 'hr' && 'Human resources and payroll management'}
                      {key === 'procurement' && 'Purchase orders and vendor management'}
                      {key === 'operations' && 'Fleet and petroleum operations management'}
                      {key === 'reports' && 'Business intelligence and analytics'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabled}
                      className="sr-only peer"
                      onChange={() => setSettings({
                        ...settings,
                        modules: { ...settings.modules, [key]: !enabled }
                      })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#8B1538]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B1538]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <h4 className="font-medium text-purple-800">Third-Party Integrations</h4>
              <p className="text-sm text-purple-700 mt-1">Configure external system connections and APIs</p>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Financial Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banking API</label>
                    <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                      <option>First Bank API v2.1</option>
                      <option>Access Bank API</option>
                      <option>GTBank Corporate API</option>
                      <option>UBA Business API</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="sage"
                      checked={settings.integrations.sageIntegration}
                      className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                    />
                    <label htmlFor="sage" className="text-sm font-medium text-gray-700">
                      Sage Accounting Integration
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-4">Operations Integrations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Card System</label>
                    <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                      <option>Zenith Bank Fuel Card</option>
                      <option>First Bank Fleet Card</option>
                      <option>Access Bank Corporate Card</option>
                      <option>Custom Integration</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {[
                      { key: 'gpsTracking', label: 'GPS Vehicle Tracking' },
                      { key: 'mobileApp', label: 'Mobile Application' },
                      { key: 'taxAPI', label: 'Tax Authority API' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={settings.integrations[key as keyof typeof settings.integrations] as boolean}
                          className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                        />
                        <label htmlFor={key} className="text-sm font-medium text-gray-700">{label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
              <h4 className="font-medium text-red-800">Backup & Recovery</h4>
              <p className="text-sm text-red-700 mt-1">Configure data backup and disaster recovery settings</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoBackup"
                    checked={settings.backup.autoBackup}
                    className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <label htmlFor="autoBackup" className="text-sm font-medium text-gray-700">
                    Enable Automatic Backups
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Frequency</label>
                  <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retention Period (days)</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                    value={settings.backup.retentionPeriod}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cloudBackup"
                    checked={settings.backup.cloudBackup}
                    className="rounded border-gray-300 text-[#8B1538] focus:ring-[#8B1538]"
                  />
                  <label htmlFor="cloudBackup" className="text-sm font-medium text-gray-700">
                    Cloud Backup Storage
                  </label>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Last Backup</span>
                  </div>
                  <p className="text-sm text-gray-600">{settings.backup.lastBackup}</p>
                </div>

                <div className="space-y-2">
                  <button className="w-full px-4 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230]">
                    Run Manual Backup
                  </button>
                  <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                    Download Latest Backup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      case 'email':
        return (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-400">
              <h4 className="font-medium text-indigo-800">Email Configuration</h4>
              <p className="text-sm text-indigo-700 mt-1">Configure SMTP settings for system email notifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Server</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.email.smtpServer}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.email.smtpPort}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.email.smtpUsername}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent pr-10"
                    value={settings.email.smtpPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.email.senderEmail}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent"
                  value={settings.email.senderName}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Encryption</label>
                <select className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#8B1538] focus:border-transparent">
                  <option>TLS</option>
                  <option>SSL</option>
                  <option>None</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleTestEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send Test Email
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="text-gray-600">Configure system preferences and administration settings</p>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#8B1538] text-white rounded-md hover:bg-[#7A1230] flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Settings</span>
          </button>
        </div>

        {/* Settings Content */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r">
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Settings</h3>
              </div>
              <nav className="space-y-1 px-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#8B1538] text-white'
                        : 'text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}