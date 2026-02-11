'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { driversAPI } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import ConfirmModal from '@/components/ui/ConfirmModal';
import { useModal } from '@/lib/hooks/useModal';
import type { Driver, DriverStatus } from '@/types';

export default function DriversPage() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    licenseNumber: '',
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const modal = useModal();

  const isAdmin = user?.role === 'ADMIN';

  const loadDrivers = async () => {
    try {
      const data = await driversAPI.getAll();
      setDrivers(data);
    } catch (error) {
      console.error('Failed to load drivers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await driversAPI.create(formData);
      setFormData({ fullName: '', phoneNumber: '', licenseNumber: '' });
      setShowCreateForm(false);
      loadDrivers();
      modal.showModal('Driver created successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to create driver',
        'error'
      );
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDelete(id);
  };

  const confirmDeleteDriver = async () => {
    if (!confirmDelete) return;
    try {
      await driversAPI.delete(confirmDelete);
      loadDrivers();
      modal.showModal('Driver deactivated successfully', 'success');
    } catch (error: any) {
      modal.showModal(
        error.response?.data?.message || 'Failed to delete driver',
        'error'
      );
    } finally {
      setConfirmDelete(null);
    }
  };

  const getStatusBadge = (status: DriverStatus) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: 'fullName', header: 'Full Name' },
    { key: 'phoneNumber', header: 'Phone Number' },
    { key: 'licenseNumber', header: 'License Number' },
    {
      key: 'status',
      header: 'Status',
      render: (driver: Driver) => getStatusBadge(driver.status),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (driver: Driver) =>
        isAdmin ? (
          <Button
            variant="danger"
            onClick={() => handleDelete(driver.id)}
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
        <h1 className="text-3xl font-bold text-gray-900">Drivers</h1>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(!showCreateForm)}>
            {showCreateForm ? 'Cancel' : '+ Add Driver'}
          </Button>
        )}
      </div>

      {showCreateForm && (
        <Card className="mb-6 p-6">
          <h2 className="text-xl font-semibold mb-4">Create New Driver</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />
            <Input
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              required
            />
            <Input
              label="License Number"
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({ ...formData, licenseNumber: e.target.value })
              }
              required
            />
            <Button type="submit">Create Driver</Button>
          </form>
        </Card>
      )}

      <Card>
        <Table data={drivers} columns={columns} />
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
        onConfirm={confirmDeleteDriver}
        message="Are you sure you want to deactivate this driver? This action cannot be undone."
        title="Deactivate Driver"
      />
    </div>
  );
}
