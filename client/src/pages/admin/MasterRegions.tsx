import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Globe, Search, Package, Edit2, Check, X, Image, RefreshCw, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';

interface Region {
  id: string;
  name: string;
  slug: string;
  airaloId: string | null;
  countries: string[] | null;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  packageCounts: {
    airalo: number;
    esimAccess: number;
    esimGo: number;
    total: number;
  };
}

export default function MasterRegions() {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [editingRegion, setEditingRegion] = useState<Region | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: regionsData, isLoading } = useQuery<{
    success: boolean;
    data: Region[];
  }>({
    queryKey: ['/api/admin/master-regions', { search: debouncedSearch }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append('search', debouncedSearch);
      const res = await fetch(`/api/admin/master-regions?${params.toString()}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch regions');
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PATCH', `/api/admin/master-regions/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Region updated successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/master-regions'] });
      setEditingRegion(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update region',
        variant: 'destructive',
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/master-regions/sync', {});
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: 'Sync Complete',
        description: `Created ${data.data?.regionsCreated || 0} regions, updated ${data.data?.regionsUpdated || 0}`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/master-regions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync regions',
        variant: 'destructive',
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);

      const res = await fetch(`/api/admin/master-regions/${id}/upload-image`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Upload failed');
      }

      return res.json();
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Image uploaded successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/master-regions'] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
    },
  });

  const regions = regionsData?.data || [];
  const totalPackages = regions.reduce((sum, r) => sum + r.packageCounts.total, 0);

  const handleEditClick = (region: Region) => {
    setEditingRegion(region);
    setSelectedFile(null);
    setPreviewUrl(region.image || null);
  };

  const handleCloseDialog = () => {
    setEditingRegion(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUploadImage = () => {
    if (editingRegion && selectedFile) {
      uploadMutation.mutate({ id: editingRegion.id, file: selectedFile });
    }
  };

  const handleToggleActive = (region: Region) => {
    updateMutation.mutate({ id: region.id, data: { active: !region.active } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Regions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage multi-country regional packages
          </p>
        </div>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          data-testid="button-sync-regions"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          {syncMutation.isPending ? 'Syncing...' : 'Sync Regions'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Active Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regions.filter((r) => r.active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Packages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Regions</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search regions..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 w-full sm:w-[250px]"
                data-testid="input-search-regions"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Globe className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : regions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Globe className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No regions found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Icon</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Countries</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {regions.map((region) => (
                    <TableRow key={region.id}>
                      <TableCell>
                        {region.image ? (
                          <img
                            src={region.image}
                            alt={region.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Globe className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{region.name}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {region.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{region.countries?.length || 0} countries</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-medium">{region.packageCounts.total} total</span>
                          <span className="text-slate-500">
                            A:{region.packageCounts.airalo} E:{region.packageCounts.esimAccess} G:
                            {region.packageCounts.esimGo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={region.active}
                          onCheckedChange={() => handleToggleActive(region)}
                          data-testid={`switch-active-${region.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(region)}
                          data-testid={`button-edit-${region.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingRegion} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Region Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-32 h-32 rounded object-cover border"
                />
              ) : (
                <div className="w-32 h-32 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border">
                  <Image className="h-12 w-12 text-slate-400" />
                </div>
              )}
              <div className="w-full">
                <Label htmlFor="image-file">Upload Image</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    ref={fileInputRef}
                    id="image-file"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="flex-1"
                    data-testid="input-region-image-file"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Accepted formats: JPG, PNG, GIF, WebP, SVG (max 5MB)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadImage}
              disabled={uploadMutation.isPending || !selectedFile}
              data-testid="button-upload-region-image"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
