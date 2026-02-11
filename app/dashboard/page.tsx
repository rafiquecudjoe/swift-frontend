'use client';

import { useEffect, useState } from 'react';
import { driversAPI, vehiclesAPI, assignmentsAPI } from '@/lib/api';
import Card from '@/components/ui/Card';
import type { Driver, Vehicle, Assignment } from '@/types';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalDrivers: 0,
    totalVehicles: 0,
    activeAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [drivers, vehicles, assignments] = await Promise.all([
          driversAPI.getAll(),
          vehiclesAPI.getAll(),
          assignmentsAPI.getAll(),
        ]);

        setStats({
          totalDrivers: drivers.length,
          totalVehicles: vehicles.length,
          activeAssignments: assignments.filter(a => !a.unassignedAt).length,
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600">Total Drivers</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalDrivers}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600">Total Vehicles</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.totalVehicles}
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600">Active Assignments</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.activeAssignments}
            </p>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <a
            href="/dashboard/drivers"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Manage Drivers →
          </a>
          <a
            href="/dashboard/vehicles"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Manage Vehicles →
          </a>
          <a
            href="/dashboard/assignments"
            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Manage Assignments →
          </a>
        </div>
      </Card>
    </div>
  );
}
