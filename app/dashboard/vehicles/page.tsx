'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { vehiclesAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useModal } from '@/lib/hooks/useModal';
import type { Vehicle } from '@/types';

export default function VehiclesPage() {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    registrationNumber: '',
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const modal = useModal();

  const isAdmin = user?.role === 'ADMIN';

  const loadVehicles = async () => {
    try {
      const data = await vehiclesAPI.getAll();
      setVehicles(data);
    } catch (error) {
      console.error('Failed to load vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vehiclesAPI.create(formData);
      setFormData({ registrationNumber: '' });
      setShowCreateForm(false);
      loadVehicles();
      modal.showModal('Vehicle created successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to create vehicle',
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteVehicle = async () => {
    if (!confirmDelete) return;
    try {
      await vehiclesAPI.delete(confirmDelete);
      loadVehicles();
      modal.showModal('Vehicle deactivated successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to delete vehicle',
        'error'
      );
    } finally {
      setConfirmDelete(null);
    }
  };

  const columns = [
    { key: 'registrationNumber', header: 'Registration Number' },
    {
      key: 'createdAt',
      header: 'Created',
      render: (vehicle: Vehicle) =>
        new Date(vehicle.createdAt).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (vehicle: Vehicle) =>
        isAdmin ? (
          <Button
            variant="danger"
            onClick={() => handleDelete(vehicle.id)}
            className="text-xs"
          >
            Deactivate
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
        <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : '+ Add Vehicle'}
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Vehicle</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) =>
                setFormData({ ...formData, registrationNumber: e.target.value })
              }
              placeholder="e.g., ABC-1234"
              required
            />
            <Button type="submit">Create Vehicle</Button>
          </form>
        </Card>
      )}

      <Card>
        <Table data={vehicles} columns={columns} />
      </Card>

      <Modal
        isOpen={modal.isOpen}
        onClose={modal.closeModal}
        message={modal.message}
        variant={modal.variant}
        title={modal.title}
      />

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmDeleteVehicle}
        message="Are you sure you want to deactivate this vehicle? This action cannot be undone."
        title="Deactivate Vehicle"
      />
    </div>
  );
}
