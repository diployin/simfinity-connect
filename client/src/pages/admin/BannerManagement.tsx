import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  isActive: boolean;
  position: number;
  packageId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function BannerManagement() {
  const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position: '1',
    packageId: '',
    isActive: true,
  });

  const { data: bannersResponse, isLoading } = useQuery({
    queryKey: ['/api/banner'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/banner');
      const res = await response.json();
      return res;
    },
  });

  // console.log(bannersResponse);

  const banners = bannersResponse?.data || [];

  const addBannerMutation = useMutation({
    mutationFn: async (formDataToSend: FormData) => {
      const response = await fetch('/api/banner', {
        method: 'POST',
        body: formDataToSend,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add banner');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner'] });
      resetForm();
      setShowAddDialog(false);
      toast({
        title: 'Success',
        description: 'Banner added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add banner',
        variant: 'destructive',
      });
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, formDataToSend }: { id: string; formDataToSend: FormData }) => {
      const response = await fetch(`/api/banner/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update banner');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner'] });
      resetForm();
      setEditingBanner(null);
      toast({
        title: 'Success',
        description: 'Banner updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update banner',
        variant: 'destructive',
      });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest('DELETE', `/api/banner/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner'] });
      toast({
        title: 'Success',
        description: 'Banner deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete banner',
        variant: 'destructive',
      });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const formData = new FormData();
      formData.append('isActive', isActive.toString());

      const response = await fetch(`/api/banner/${id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to update banner status');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/banner'] });
      toast({
        title: 'Success',
        description: 'Banner status updated',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update banner status',
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      position: '1',
      packageId: '',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'Image size should be less than 5MB',
          variant: 'destructive',
        });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddBanner = () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    if (!imageFile) {
      toast({
        title: 'Validation Error',
        description: 'Please upload an image',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('isActive', formData.isActive.toString());
    if (formData.packageId) {
      formDataToSend.append('packageId', formData.packageId);
    }
    formDataToSend.append('image', imageFile);

    addBannerMutation.mutate(formDataToSend);
  };

  const handleUpdateBanner = () => {
    if (!editingBanner) return;

    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('position', formData.position);
    formDataToSend.append('isActive', formData.isActive.toString());
    if (formData.packageId) {
      formDataToSend.append('packageId', formData.packageId);
    }
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    updateBannerMutation.mutate({
      id: editingBanner.id,
      formDataToSend,
    });
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      position: banner.position.toString(),
      packageId: banner.packageId || '',
      isActive: banner.isActive,
    });
    setImagePreview(banner.imageUrl);
    setImageFile(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className=" text-2xl  md:text-3xl font-bold text-foreground">Banner Management</h1>
          <p className="text-muted-foreground mt-1">Manage promotional banners for your platform</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
          className="gap-2"
          data-testid="button-add-banner"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Active Banners
          </CardTitle>
          <CardDescription>Manage banner images, titles, and display order</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !banners || banners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No banners found. Add your first banner to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Preview</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {banners.map((banner: Banner) => (
                  <TableRow key={banner.id} data-testid={`banner-row-${banner.id}`}>
                    <TableCell>
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="h-16 w-24 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-semibold">{banner.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{banner.description || '-'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{banner.position}</Badge>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={banner.isActive}
                        onCheckedChange={(checked) =>
                          toggleActiveMutation.mutate({
                            id: banner.id,
                            isActive: checked,
                          })
                        }
                        data-testid={`switch-active-${banner.id}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(banner)}
                          data-testid={`button-edit-${banner.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteBannerMutation.mutate(banner.id)}
                          disabled={deleteBannerMutation.isPending}
                          data-testid={`button-delete-${banner.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Banner Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Banner</DialogTitle>
            <DialogDescription>Create a new promotional banner for your platform</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="image">Banner Image *</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  data-testid="input-banner-image"
                />
                {imagePreview && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Upload an image (max 5MB). Recommended size: 1200x400px
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter banner title"
                maxLength={150}
                data-testid="input-banner-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter banner description"
                rows={3}
                data-testid="input-banner-description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  data-testid="input-banner-position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packageId">Package ID (Optional)</Label>
                <Input
                  id="packageId"
                  value={formData.packageId}
                  onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                  placeholder="Link to package"
                  data-testid="input-banner-package"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-banner-active"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddBanner}
              disabled={addBannerMutation.isPending}
              data-testid="button-save-banner"
            >
              {addBannerMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Banner'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Banner Dialog */}
      <Dialog open={!!editingBanner} onOpenChange={(open) => !open && setEditingBanner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Banner</DialogTitle>
            <DialogDescription>Update banner details and image</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-image">Banner Image</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  data-testid="input-edit-banner-image"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Leave empty to keep current image</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter banner title"
                  maxLength={150}
                  data-testid="input-edit-banner-title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter banner description"
                  rows={3}
                  data-testid="input-edit-banner-description"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  type="number"
                  min="1"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  data-testid="input-edit-banner-position"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-packageId">Package ID (Optional)</Label>
                <Input
                  id="edit-packageId"
                  value={formData.packageId}
                  onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                  placeholder="Link to package"
                  data-testid="input-edit-banner-package"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-edit-banner-active"
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingBanner(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdateBanner}
              disabled={updateBannerMutation.isPending}
              data-testid="button-update-banner"
            >
              {updateBannerMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Banner'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
