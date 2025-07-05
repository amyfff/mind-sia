'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Edit, Trash2, User, Star, TrendingUp, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMateri, createMateri, updateMateri, deleteMateri, Materi } from '@/lib/data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';

export default function MateriPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [materiList, setMateriList] = useState<Materi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<Materi | null>(null);
  const [formData, setFormData] = useState({
    judul: '',
    deskripsi: '',
    category: '',
    subject: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low'
  });

  useEffect(() => {
    const fetchMateri = async () => {
      try {
        const data = await getMateri();
        setMateriList(data);
      } catch (error) {
        console.error('Error fetching materi:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMateri();
  }, []);

  const resetForm = () => {
    setFormData({
      judul: '',
      deskripsi: '',
      category: '',
      subject: '',
      priority: 'Medium'
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsCreating(true);
    try {
      const newMateri = await createMateri({
        ...formData,
        createdBy: user.id
      });
      setMateriList([...materiList, newMateri]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'Materi created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create materi',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (materi: Materi) => {
    setEditingMateri(materi);
    setFormData({
      judul: materi.judul,
      deskripsi: materi.deskripsi,
      category: materi.category,
      subject: materi.subject,
      priority: materi.priority
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMateri) return;
    
    setIsUpdating(true);
    try {
      const updatedMateri = await updateMateri(editingMateri.id, formData);
      setMateriList(materiList.map(m => m.id === editingMateri.id ? updatedMateri : m));
      setIsEditDialogOpen(false);
      setEditingMateri(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'Materi updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update materi',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this materi?')) return;
    
    try {
      await deleteMateri(id);
      setMateriList(materiList.filter(m => m.id !== id));
      toast({
        title: 'Success',
        description: 'Materi deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete materi',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500 text-white';
      case 'Medium':
        return 'bg-yellow-500 text-white';
      case 'Low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'High':
        return <TrendingUp className="h-3 w-3" />;
      case 'Medium':
        return <Target className="h-3 w-3" />;
      case 'Low':
        return <Star className="h-3 w-3" />;
      default:
        return <Star className="h-3 w-3" />;
    }
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingMateri(null);
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
          <h1 className="text-3xl font-bold text-gray-900">Modul Pembelajaran</h1>
          <p className="text-gray-600 mt-2">Manage learning materials and educational content</p>
        </div>
        
        {(user?.role === 'pengajar' || user?.role === 'admin') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Create Materi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Materi</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="create-judul">Judul</Label>
                  <Input
                    id="create-judul"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    placeholder="Enter materi title"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-deskripsi">Deskripsi</Label>
                  <Textarea
                    id="create-deskripsi"
                    value={formData.deskripsi}
                    onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                    placeholder="Enter materi description"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-category">Category</Label>
                  <Input
                    id="create-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Basic, Advanced"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-subject">Subject</Label>
                  <Input
                    id="create-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Mathematics, Programming"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="create-priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as 'High' | 'Medium' | 'Low' })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
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
                      'Create Materi'
                    )}
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
            <DialogTitle>Edit Materi</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-judul">Judul</Label>
              <Input
                id="edit-judul"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                placeholder="Enter materi title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-deskripsi">Deskripsi</Label>
              <Textarea
                id="edit-deskripsi"
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                placeholder="Enter materi description"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Basic, Advanced"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-subject">Subject</Label>
              <Input
                id="edit-subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g., Mathematics, Programming"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as 'High' | 'Medium' | 'Low' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
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
                  'Update Materi'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Materials</p>
                <p className="text-3xl font-bold">{materiList.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">High Priority</p>
                <p className="text-3xl font-bold">{materiList.filter(m => m.priority === 'High').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Subjects</p>
                <p className="text-3xl font-bold">{new Set(materiList.map(m => m.subject)).size}</p>
              </div>
              <Target className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Categories</p>
                <p className="text-3xl font-bold">{new Set(materiList.map(m => m.category)).size}</p>
              </div>
              <Star className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Materi List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materiList.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials available</h3>
            <p className="text-gray-500">Create your first learning material to get started</p>
            {(user?.role === 'pengajar' || user?.role === 'admin') && (
              <Button 
                className="mt-4 bg-green-500 hover:bg-green-600"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Materi
              </Button>
            )}
          </div>
        ) : (
          materiList.map((materi) => (
            <Card key={materi.id} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">{materi.judul}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                        {materi.subject}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {materi.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`${getPriorityColor(materi.priority)} flex items-center gap-1`}>
                    {getPriorityIcon(materi.priority)}
                    {materi.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{materi.deskripsi}</p>
                
                {materi.createdByName && (
                  <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                    <div className="bg-green-500 p-1 rounded-full">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">Created by {materi.createdByName}</span>
                  </div>
                )}
                
                {(user?.role === 'pengajar' || user?.role === 'admin') && (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 hover:bg-blue-50 hover:border-blue-200"
                      onClick={() => handleEdit(materi)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(materi.id)}
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
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