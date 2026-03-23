/* eslint-disable @typescript-eslint/no-explicit-any, prefer-const, react/no-unescaped-entities, @typescript-eslint/no-empty-object-type */
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TruckTrip, TripExpense } from '@/lib/types';
import { TripExpenseForm } from './trip-expense-form';
import {
  MapPin,
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
} from 'lucide-react';

interface TripDetailsProps {
  trip: TruckTrip;
  onAddExpense: (expense: Omit<TripExpense, 'id' | 'tripId' | 'createdBy'>) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export function TripDetails({ trip, onAddExpense, onDeleteExpense }: TripDetailsProps) {
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const handleExpenseSubmit = (data: any) => {
    onAddExpense(data);
    setShowExpenseForm(false);
  };

  const getCategoryLabel = (category: string) => {
    return category
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Trip #{trip.tripNumber}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={trip.status === 'completed' ? 'success' : 'default'}>
                  {trip.status}
                </Badge>
                <Badge variant="outline">{trip.productType}</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className={`text-2xl font-bold ${trip.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₦{trip.netProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Route */}
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium">{trip.origin}</p>
              <p className="text-xs text-gray-500">Origin</p>
            </div>
            <div className="text-gray-400">→</div>
            <div className="flex-1">
              <p className="text-sm font-medium">{trip.destination}</p>
              <p className="text-xs text-gray-500">Destination</p>
            </div>
          </div>

          {/* Trip Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div>
              <p className="text-xs text-gray-500">Distance</p>
              <p className="text-sm font-medium">{trip.distance} km</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rate/km</p>
              <p className="text-sm font-medium">₦{trip.ratePerKm}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Quantity</p>
              <p className="text-sm font-medium">
                {trip.quantity.toLocaleString()} {trip.unit}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Freight</p>
              <p className="text-sm font-medium">₦{trip.freight.toLocaleString()}</p>
            </div>
          </div>

          {/* Financials */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                <TrendingUp className="h-4 w-4" />
                <p className="text-xs font-medium">Earnings</p>
              </div>
              <p className="text-lg font-bold text-green-700">₦{trip.earnings.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <TrendingDown className="h-4 w-4" />
                <p className="text-xs font-medium">Expenses</p>
              </div>
              <p className="text-lg font-bold text-red-700">₦{trip.totalExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                <Package className="h-4 w-4" />
                <p className="text-xs font-medium">Net Profit</p>
              </div>
              <p className={`text-lg font-bold ${trip.netProfit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                ₦{trip.netProfit.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          {(trip.departureTime || trip.arrivalTime) && (
            <div className="flex items-center gap-4 pt-4 border-t text-sm">
              {trip.departureTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Departed</p>
                    <p className="font-medium">{new Date(trip.departureTime).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {trip.arrivalTime && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Arrived</p>
                    <p className="font-medium">{new Date(trip.arrivalTime).toLocaleString()}</p>
                  </div>
                </div>
              )}
              {trip.actualDuration && (
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{trip.actualDuration} hours</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expenses */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trip Expenses</CardTitle>
            {!showExpenseForm && (
              <Button size="sm" onClick={() => setShowExpenseForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showExpenseForm ? (
            <TripExpenseForm
              tripId={trip.id}
              onSubmit={handleExpenseSubmit}
              onCancel={() => setShowExpenseForm(false)}
            />
          ) : trip.expenses.length > 0 ? (
            <div className="space-y-3">
              {trip.expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{expense.description}</p>
                      <Badge variant="outline">{getCategoryLabel(expense.category)}</Badge>
                    </div>
                    <div className="flex gap-4 text-xs text-gray-500 mt-1">
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                      {expense.receiptNumber && <span>Receipt: {expense.receiptNumber}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold">₦{expense.amount.toLocaleString()}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600">
                    ₦{trip.totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No expenses recorded for this trip</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => setShowExpenseForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Expense
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
