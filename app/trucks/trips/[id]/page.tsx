'use client';
export const dynamic = 'force-dynamic'


import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { TripDetails } from '@/components/trucks/trip-details';
import { TruckTrip, TripExpense } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';

export default function TripDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;

  // Mock trip data - replace with actual API call
  const [trip, setTrip] = useState<TruckTrip>({
    id: tripId,
    tripNumber: 'TRP-2024-001',
    truckId: '1',
    driverId: '1',
    origin: 'Lagos Depot',
    destination: 'Port Harcourt Station',
    destinationStationId: '2',
    productType: 'AGO',
    quantity: 33000,
    unit: 'liters',
    distance: 650,
    ratePerKm: 450,
    freight: 292500,
    earnings: 350000,
    expenses: [
      {
        id: '1',
        tripId: tripId,
        category: 'fuel',
        description: 'Diesel for trip',
        amount: 85000,
        receiptNumber: 'REC-001',
        date: '2024-10-06',
      },
      {
        id: '2',
        tripId: tripId,
        category: 'toll',
        description: 'Highway toll fees',
        amount: 12500,
        receiptNumber: 'REC-002',
        date: '2024-10-06',
      },
      {
        id: '3',
        tripId: tripId,
        category: 'driver-allowance',
        description: 'Driver daily allowance',
        amount: 15000,
        date: '2024-10-06',
      },
    ],
    totalExpenses: 112500,
    netProfit: 237500,
    status: 'completed',
    departureTime: '2024-10-06T08:00:00',
    arrivalTime: '2024-10-07T18:30:00',
    estimatedArrivalTime: '2024-10-07T20:00:00',
    actualDuration: 34.5,
    notes: 'Smooth delivery, no issues encountered',
    createdAt: '2024-10-05',
    updatedAt: '2024-10-07',
  });

  const handleAddExpense = (expenseData: Omit<TripExpense, 'id' | 'tripId' | 'createdBy'>) => {
    const newExpense: TripExpense = {
      ...expenseData,
      id: String(trip.expenses.length + 1),
      tripId: trip.id,
    };

    const updatedExpenses = [...trip.expenses, newExpense];
    const updatedTotalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const updatedNetProfit = trip.earnings - updatedTotalExpenses;

    setTrip({
      ...trip,
      expenses: updatedExpenses,
      totalExpenses: updatedTotalExpenses,
      netProfit: updatedNetProfit,
    });
  };

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      const updatedExpenses = trip.expenses.filter((exp) => exp.id !== expenseId);
      const updatedTotalExpenses = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      const updatedNetProfit = trip.earnings - updatedTotalExpenses;

      setTrip({
        ...trip,
        expenses: updatedExpenses,
        totalExpenses: updatedTotalExpenses,
        netProfit: updatedNetProfit,
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip Details</h1>
            <p className="text-gray-500">View and manage trip earnings and expenses</p>
          </div>
        </div>

        {/* Trip Details */}
        <TripDetails
          trip={trip}
          onAddExpense={handleAddExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </div>
    </DashboardLayout>
  );
}
