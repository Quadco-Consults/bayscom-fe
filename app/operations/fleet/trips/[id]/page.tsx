'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, MapPin, Calendar, Truck, DollarSign, Receipt } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ExpenseCategory {
  id: string;
  value: string;
  label: string;
  color: string;
  description?: string;
  isActive: boolean;
  isDefault: boolean;
}

interface TripExpense {
  id: string;
  tripId: string;
  category: string;
  description: string;
  amount: number;
  receiptNumber?: string;
  date: string;
  createdBy?: string;
}

interface TruckTrip {
  id: string;
  tripNumber: string;
  truckId: string;
  truckRegistration?: string;
  driverId: string;
  origin: string;
  destination: string;
  productType: 'PMS' | 'AGO' | 'DPK' | 'LPG';
  quantity: number;
  unit: 'liters' | 'kg';
  distance: number;
  ratePerKm: number;
  freight: number;
  earnings: number;
  expenses: TripExpense[];
  totalExpenses: number;
  netProfit: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  departureTime?: string;
  arrivalTime?: string;
  estimatedArrivalTime?: string;
  actualDuration?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<TruckTrip | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: '',
    description: '',
    amount: '',
    receiptNumber: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    loadExpenseCategories();
    loadTrip();
  }, [tripId]);

  const loadExpenseCategories = () => {
    const stored = localStorage.getItem('fleet_expense_categories');
    if (stored) {
      const categories: ExpenseCategory[] = JSON.parse(stored);
      setExpenseCategories(categories.filter(cat => cat.isActive));
      // Set default category
      const activeCategories = categories.filter(cat => cat.isActive);
      if (activeCategories.length > 0) {
        setExpenseForm(prev => ({ ...prev, category: activeCategories[0].value }));
      }
    } else {
      // Initialize default categories if none exist
      const defaultCategories: ExpenseCategory[] = [
        { id: '1', value: 'fuel', label: 'Fuel', color: 'bg-orange-100 text-orange-800 border-orange-200', isActive: true, isDefault: true },
        { id: '2', value: 'toll', label: 'Toll Fee', color: 'bg-blue-100 text-blue-800 border-blue-200', isActive: true, isDefault: true },
        { id: '3', value: 'maintenance', label: 'Maintenance', color: 'bg-red-100 text-red-800 border-red-200', isActive: true, isDefault: true },
        { id: '4', value: 'driver-allowance', label: 'Driver Allowance', color: 'bg-green-100 text-green-800 border-green-200', isActive: true, isDefault: true },
        { id: '5', value: 'parking', label: 'Parking', color: 'bg-purple-100 text-purple-800 border-purple-200', isActive: true, isDefault: true },
        { id: '6', value: 'loading-fee', label: 'Loading Fee', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', isActive: true, isDefault: true },
        { id: '7', value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800 border-gray-200', isActive: true, isDefault: true },
      ];
      localStorage.setItem('fleet_expense_categories', JSON.stringify(defaultCategories));
      setExpenseCategories(defaultCategories);
      setExpenseForm(prev => ({ ...prev, category: 'fuel' }));
    }
  };

  const loadTrip = () => {
    const stored = localStorage.getItem('fleet_trips');
    if (stored) {
      const trips: TruckTrip[] = JSON.parse(stored);
      const foundTrip = trips.find(t => t.id === tripId);
      if (foundTrip) {
        setTrip(foundTrip);
      }
    }
  };

  const saveTrip = (updatedTrip: TruckTrip) => {
    const stored = localStorage.getItem('fleet_trips');
    if (stored) {
      const trips: TruckTrip[] = JSON.parse(stored);
      const updatedTrips = trips.map(t => t.id === tripId ? updatedTrip : t);
      localStorage.setItem('fleet_trips', JSON.stringify(updatedTrips));
      setTrip(updatedTrip);
    }
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip) return;

    const newExpense: TripExpense = {
      id: Date.now().toString(),
      tripId: trip.id,
      category: expenseForm.category,
      description: expenseForm.description,
      amount: parseFloat(expenseForm.amount),
      receiptNumber: expenseForm.receiptNumber || undefined,
      date: expenseForm.date,
    };

    const updatedExpenses = [...(trip.expenses || []), newExpense];
    const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = trip.earnings - totalExpenses;

    const updatedTrip = {
      ...trip,
      expenses: updatedExpenses,
      totalExpenses,
      netProfit,
    };

    saveTrip(updatedTrip);
    setShowAddExpense(false);
    setExpenseForm({
      category: expenseCategories.length > 0 ? expenseCategories[0].value : '',
      description: '',
      amount: '',
      receiptNumber: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (!trip) return;
    if (!confirm('Are you sure you want to delete this expense?')) return;

    const updatedExpenses = trip.expenses.filter(exp => exp.id !== expenseId);
    const totalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const netProfit = trip.earnings - totalExpenses;

    const updatedTrip = {
      ...trip,
      expenses: updatedExpenses,
      totalExpenses,
      netProfit,
    };

    saveTrip(updatedTrip);
  };

  const getCategoryColor = (category: string) => {
    return expenseCategories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryLabel = (category: string) => {
    return expenseCategories.find(c => c.value === category)?.label || category;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!trip) {
    return (
      <div className="p-6 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">Trip not found</p>
          <Link
            href="/operations/fleet"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Fleet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/operations/fleet"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Trip Details - {trip.tripNumber}</h1>
            <p className="text-gray-600">View and manage trip information and expenses</p>
          </div>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="bg-white rounded-lg border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Trip Overview</h2>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(trip.status)}`}>
              {trip.status}
            </span>
            <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">
              {trip.productType}
            </span>
          </div>
        </div>
        <div className="p-6">
          {/* Net Profit Display */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-6 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Net Profit</p>
              <p className={`text-4xl font-bold ${trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{trip.netProfit.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Margin: {((trip.netProfit / trip.earnings) * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          {/* Route Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Route Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Origin</p>
                    <p className="font-medium text-gray-900">{trip.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Destination</p>
                    <p className="font-medium text-gray-900">{trip.destination}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Truck</p>
                    <p className="font-medium text-gray-900">{trip.truckRegistration || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Trip Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="text-sm font-medium text-gray-900">{trip.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Rate per KM</span>
                  <span className="text-sm font-medium text-gray-900">₦{trip.ratePerKm.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quantity</span>
                  <span className="text-sm font-medium text-gray-900">
                    {trip.quantity.toLocaleString()} {trip.unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Freight</span>
                  <span className="text-sm font-medium text-blue-600">₦{trip.freight.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-3">Financial Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-2xl font-bold text-green-600">₦{trip.earnings.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">₦{trip.totalExpenses.toLocaleString()}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600">Net Profit</p>
                <p className={`text-2xl font-bold ${trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₦{trip.netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          {(trip.departureTime || trip.arrivalTime) && (
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Timing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {trip.departureTime && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Departure</p>
                      <p className="font-medium text-gray-900">{new Date(trip.departureTime).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {trip.arrivalTime && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Arrival</p>
                      <p className="font-medium text-gray-900">{new Date(trip.arrivalTime).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {trip.actualDuration && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-600">Duration</p>
                      <p className="font-medium text-gray-900">{trip.actualDuration} hours</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trip Expenses */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Trip Expenses</h2>
            <p className="text-sm text-gray-600">Total: ₦{trip.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/operations/fleet/expense-categories"
              className="text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Manage Categories
            </Link>
            <button
              onClick={() => setShowAddExpense(true)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Expense
            </button>
          </div>
        </div>
        <div className="p-6">
          {trip.expenses && trip.expenses.length > 0 ? (
            <div className="space-y-3">
              {trip.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getCategoryColor(expense.category)}`}>
                        {getCategoryLabel(expense.category)}
                      </span>
                      <p className="font-medium text-gray-900">{expense.description}</p>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      {expense.receiptNumber && (
                        <span className="flex items-center gap-1">
                          <Receipt className="h-4 w-4" />
                          {expense.receiptNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-gray-900">₦{expense.amount.toLocaleString()}</p>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p>No expenses recorded yet</p>
              <p className="text-sm">Click "Add Expense" to start tracking costs</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Add Trip Expense</h2>
              <form onSubmit={handleAddExpense} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    required
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {expenseCategories.length === 0 && (
                      <option value="">No categories available</option>
                    )}
                    {expenseCategories.map(cat => (
                      <option key={cat.id} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {expenseCategories.length === 0 && (
                    <p className="text-xs text-red-600 mt-1">
                      No active expense categories found. Please add categories first.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <input
                    type="text"
                    required
                    minLength={3}
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    placeholder="e.g., Diesel for trip"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₦) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
                  <input
                    type="text"
                    value={expenseForm.receiptNumber}
                    onChange={(e) => setExpenseForm({ ...expenseForm, receiptNumber: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
