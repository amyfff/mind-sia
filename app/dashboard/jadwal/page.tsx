'use client';

import { useEffect, useState } from 'react';
import { getJadwalAbsensi, createJadwalAbsensi, updateJadwalAbsensi, deleteJadwalAbsensi, JadwalAbsensi } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Edit, Trash2, User, Clock } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function JadwalPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jadwalList, setJadwalList] = useState<JadwalAbsensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<JadwalAbsensi | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tanggal: ''
  });
  // Add absen state for peserta
  const [absenStatus, setAbsenStatus] = useState<{ [jadwalId: string]: string }>({});
  const [absenLoading, setAbsenLoading] = useState<{ [jadwalId: string]: boolean }>({});

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const data = await getJadwalAbsensi(user?.role);
        setJadwalList(data);
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to fetch schedules', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchJadwal();
  }, [toast, user]);

  const resetForm = () => {
    setFormData({ title: '', description: '', tanggal: '' });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsCreating(true);
    try {
      const newJadwal = await createJadwalAbsensi({ ...formData, createdBy: user.id });
      setJadwalList([...jadwalList, newJadwal]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Schedule created successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to create schedule', variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (jadwal: JadwalAbsensi) => {
    setEditingJadwal(jadwal);
    setFormData({ title: jadwal.title, description: jadwal.description, tanggal: jadwal.tanggal });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJadwal) return;
    setIsUpdating(true);
    try {
      const updatedJadwal = await updateJadwalAbsensi(editingJadwal.id, formData);
      setJadwalList(jadwalList.map(j => j.id === editingJadwal.id ? updatedJadwal : j));
      setIsEditDialogOpen(false);
      setEditingJadwal(null);
      resetForm();
      toast({ title: 'Success', description: 'Schedule updated successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update schedule', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    try {
      await deleteJadwalAbsensi(id);
      setJadwalList(jadwalList.filter(j => j.id !== id));
      toast({ title: 'Success', description: 'Schedule deleted successfully' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete schedule', variant: 'destructive' });
    }
  };

  // Function to submit absen for peserta
  const handleAbsen = async (jadwalId: string) => {
    const status = absenStatus[jadwalId];
    if (!status) {
      toast({ title: 'Error', description: 'Pilih status absen', variant: 'destructive' });
      return;
    }
    setAbsenLoading((prev) => ({ ...prev, [jadwalId]: true }));
    try {
      const res = await fetch(`/api/user/absen/${jadwalId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal absen');
      }
      toast({ title: 'Success', description: 'Absen berhasil' });
      setAbsenStatus((prev) => ({ ...prev, [jadwalId]: '' }));
      // Refetch jadwal after absen
      if (user) {
        setIsLoading(true);
        try {
          const data = await getJadwalAbsensi(user.role);
          setJadwalList(data);
        } catch (error) {
          toast({ title: 'Error', description: 'Failed to fetch schedules', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setAbsenLoading((prev) => ({ ...prev, [jadwalId]: false }));
    }
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingJadwal(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Absensi</h1>
          <p className="text-gray-600 mt-2">Manage attendance schedules and track student participation</p>
        </div>
        {(user?.role === 'PENGAJAR' || user?.role === 'ADMIN') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Schedule</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-title">Title</Label>
                  <Input
                    id="create-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Pertemuan 1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-description">Description</Label>
                  <Textarea
                    id="create-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter schedule description"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-tanggal">Date</Label>
                  <Input
                    id="create-tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={closeCreateDialog}>Cancel</Button>
                  <Button type="submit" disabled={isCreating}>
                    {isCreating ? (<><LoadingSpinner className="mr-2 h-4 w-4" />Creating...</>) : 'Create Schedule'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Pertemuan 1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter schedule description"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tanggal">Date</Label>
              <Input
                id="edit-tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeEditDialog}>Cancel</Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (<><LoadingSpinner className="mr-2 h-4 w-4" />Updating...</>) : 'Update Schedule'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-linear-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Schedules</p>
                <p className="text-3xl font-bold">{jadwalList.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">This Week</p>
                <p className="text-3xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Completed</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Attendance Rate</p>
                <p className="text-3xl font-bold">85%</p>
              </div>
              <User className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Jadwal List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jadwalList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schedules available</h3>
            <p className="text-gray-500">Create your first schedule to get started</p>
            {(user?.role === 'PENGAJAR' || user?.role === 'ADMIN') && (
              <Button className="mt-4 bg-green-500 hover:bg-green-600" onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            )}
          </div>
        ) : (
          jadwalList.map((jadwal: JadwalAbsensi) => (
            <Card key={jadwal.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{jadwal.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{jadwal.description}</p>
                {jadwal.createdByName && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="bg-green-500 p-1 rounded-full">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">Created by {jadwal.createdByName}</span>
                  </div>
                )}
                {(user?.role === 'PENGAJAR' || user?.role === 'ADMIN') && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-200" onClick={() => handleEdit(jadwal)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(jadwal.id)} className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
                {user?.role === 'PESERTA' && (
                  <div className="flex flex-col gap-2 mt-2">
                    {jadwal.alreadyAbsen === true ? (
                      <div className="text-green-600 font-semibold text-sm">
                        Sudah absen: <span className="uppercase">{jadwal.absenStatus || '-'}</span>
                      </div>
                    ) : (
                      <>
                        <RadioGroup
                          value={absenStatus[jadwal.id] || ''}
                          onValueChange={(val) => setAbsenStatus((prev) => ({ ...prev, [jadwal.id]: val }))}
                          className="flex flex-row gap-4"
                        >
                          <RadioGroupItem value="HADIR" id={`hadir-${jadwal.id}`} />
                          <Label htmlFor={`hadir-${jadwal.id}`}>Hadir</Label>
                          <RadioGroupItem value="IZIN" id={`izin-${jadwal.id}`} />
                          <Label htmlFor={`izin-${jadwal.id}`}>Izin</Label>
                          <RadioGroupItem value="SAKIT" id={`sakit-${jadwal.id}`} />
                          <Label htmlFor={`sakit-${jadwal.id}`}>Sakit</Label>
                        </RadioGroup>
                        <Button
                          size="sm"
                          className="w-fit bg-blue-500 hover:bg-blue-600 text-white"
                          disabled={absenLoading[jadwal.id]}
                          onClick={() => handleAbsen(jadwal.id)}
                        >
                          {absenLoading[jadwal.id] ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
                          Absen
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function fetchJadwal() {
  throw new Error('Function not implemented.');
}
