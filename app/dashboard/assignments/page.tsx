'use client';

import { useEffect, useState } from 'react';
import { assignmentsAPI, driversAPI, vehiclesAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useModal } from '@/lib/hooks/useModal';
import type { Assignment, Driver, Vehicle } from '@/types';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    driverId: '',
    vehicleId: '',
  });
  const [confirmUnassign, setConfirmUnassign] = useState<string | null>(null);
  const modal = useModal();

  const loadData = async () => {
    try {
      const [assignmentsData, driversData, vehiclesData] = await Promise.all([
        assignmentsAPI.getAll(),
        driversAPI.getAll({ status: 'ACTIVE' }),
        vehiclesAPI.getAll(),
      ]);
      setAssignments(assignmentsData);
      setDrivers(driversData);
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await assignmentsAPI.create(formData);
      setFormData({ driverId: '', vehicleId: '' });
      setShowCreateForm(false);
      loadData();
      modal.showModal('Assignment created successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to create assignment',
        'error'
      );
    }
  };

  const handleUnassign = async (id: string) => {
    setConfirmUnassign(id);
  };

  const confirmUnassignDriver = async () => {
    if (!confirmUnassign) return;
    // Simple confirmation - could be enhanced with a custom confirmation modal
    try {
      await assignmentsAPI.delete(confirmUnassign);
      loadData();
      modal.showModal('Driver unassigned successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to unassign',
        'error'
      );
    } finally {
      setConfirmUnassign(null);
    }
  };

  const getDriverName = (driverId: string) => {
    return drivers.find((d) => d.id === driverId)?.fullName || 'Unknown';
  };

  const getVehicleReg = (vehicleId: string) => {
    return (
      vehicles.find((v) => v.id === vehicleId)?.registrationNumber || 'Unknown'
    );
  };

  const columns = [
    {
      key: 'driver',
      header: 'Driver',
      render: (assignment: Assignment) => getDriverName(assignment.driverId),
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (assignment: Assignment) => getVehicleReg(assignment.vehicleId),
    },
    {
      key: 'assignedAt',
      header: 'Assigned',
      render: (assignment: Assignment) =>
        new Date(assignment.assignedAt).toLocaleDateString(),
    },
    {
      key: 'status',
      header: 'Status',
      render: (assignment: Assignment) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            assignment.unassignedAt
              ? 'bg-gray-100 text-gray-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {assignment.unassignedAt ? 'Inactive' : 'Active'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (assignment: Assignment) =>
        !assignment.unassignedAt ? (
          <Button
            variant="danger"
            onClick={() => handleUnassign(assignment.id)}
            className="text-xs"
          >
            Unassign
          </Button>
        ) : (
          <span className="text-gray-400">-</span>
        ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : '+ New Assignment'}
        </Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Assignment</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Driver
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.driverId}
                onChange={(e) =>
                  setFormData({ ...formData, driverId: e.target.value })
                }
                required
              >
                <option value="">Select a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={formData.vehicleId}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleId: e.target.value })
                }
                required
              >
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.registrationNumber}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit">Create Assignment</Button>
          </form>
        </Card>
      )}

      <Card>
        <Table data={assignments} columns={columns} />
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        message={modal.message}
        variant={modal.variant}
        title={modal.title}
      />

      <ConfirmModal
        isOpen={!!confirmUnassign}
        onClose={() => setConfirmUnassign(null)}
        onConfirm={confirmUnassignDriver}
        message="Are you sure you want to unassign this driver? The driver will be available for new assignments."
        title="Unassign Driver"
      />
    </div>
  );
}
