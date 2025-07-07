'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Plus, Edit, Trash2, Mail, Calendar, UserCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser, UserData } from '@/lib/data';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'peserta' as 'peserta' | 'pengajar' | 'admin'
  });

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
  }, [user, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsersList(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'ADMIN') {
      fetchUsers();
    }
  }, [user]);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'peserta'
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsCreating(true);
    try {
      const newUser = await createUser(formData);
      setUsersList([...usersList, newUser]);
      setIsCreateDialogOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: 'User created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create user',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleEdit = (userData: UserData) => {
    setEditingUser(userData);
    setFormData({
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    setIsUpdating(true);
    try {
      const updatedUser = await updateUser(editingUser.id, formData);
      setUsersList(usersList.map(u => u.id === editingUser.id ? updatedUser : u));
      setIsEditDialogOpen(false);
      setEditingUser(null);
      resetForm();
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update user',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    
    try {
      await deleteUser(id);
      setUsersList(usersList.filter(u => u.id !== id));
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-500 text-white';
      case 'PENGAJAR':
        return 'bg-blue-500 text-white';
      case 'PESERTA':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Admin';
      case 'PENGAJAR':
        return 'Teacher';
      case 'PESERTA':
        return 'Student';
      default:
        return role;
    }
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  // Don't render if not admin
  if (user?.role !== 'ADMIN') {
    return null;
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600 mt-2">Manage system users and their roles</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Full Name</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'peserta' | 'pengajar' | 'admin' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peserta">Student (Peserta)</SelectItem>
                    <SelectItem value="pengajar">Teacher (Pengajar)</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
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
                    'Create User'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Users</p>
                <p className="text-3xl font-bold">{usersList.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Students</p>
                <p className="text-3xl font-bold">{usersList.filter(u => u.role === 'peserta').length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Teachers</p>
                <p className="text-3xl font-bold">{usersList.filter(u => u.role === 'pengajar').length}</p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value as 'peserta' | 'pengajar' | 'admin' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="peserta">Student (Peserta)</SelectItem>
                  <SelectItem value="pengajar">Teacher (Pengajar)</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
                  'Update User'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Users Table */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
          <CardDescription>
            Manage all system users and their permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {usersList.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">Create your first user to get started</p>
              <Button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersList.map((userData) => (
                    <TableRow key={userData.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {userData.name.charAt(0).toUpperCase()}
                          </div>
                          {userData.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          {userData.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(userData.role)}>
                          {getRoleLabel(userData.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }) : '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(userData)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(userData.id, userData.name)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}