'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Edit, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getJadwalAbsensi, createJadwalAbsensi, updateJadwalAbsensi, deleteJadwalAbsensi, JadwalAbsensi } from '@/lib/data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    const fetchJadwal = async () => {
      try {
        const data = await getJadwalAbsensi();
        setJadwalList(data);
      } catch (error) {
        console.error('Error fetching jadwal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJadwal();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      tanggal: ''
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsCreating(true);
    try {
      const newJadwal = await createJadwalAbsensi({
        ...formData,
        createdBy: user.id
      });
      setJadwalList([...jadwalList, newJadwal]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Schedule created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create schedule',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (jadwal: JadwalAbsensi) => {
    setEditingJadwal(jadwal);
    setFormData({
      title: jadwal.title,
      description: jadwal.description,
      tanggal: jadwal.tanggal
    });
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
      toast({
        title: 'Success',
        description: 'Schedule updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    try {
      await deleteJadwalAbsensi(id);
      setJadwalList(jadwalList.filter(j => j.id !== id));
      toast({
        title: 'Success',
        description: 'Schedule deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete schedule',
        variant: 'destructive',
      });
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Jadwal Absensi</h1>
          <p className="text-gray-600 mt-2">Manage attendance schedules</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeCreateDialog}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    'Create Schedule'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
              <Button
                type="button"
                variant="outline"
                onClick={closeEditDialog}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <LoadingSpinner className="mr-2 h-4 w-4" />
                    Updating...
                  </>
                ) : (
                  'Update Schedule'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Jadwal List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jadwalList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No schedules available</p>
          </div>
        ) : (
          jadwalList.map((jadwal) => (
            <Card key={jadwal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{jadwal.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{jadwal.description}</p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleEdit(jadwal)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(jadwal.id)}
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}