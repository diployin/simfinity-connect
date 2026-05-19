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
  bannerImage: string | null;
  active: boolean;
  isPopular: boolean;
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

  // Icon Upload State
  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Banner Upload State
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const iconInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

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
    mutationFn: async ({ id, file, type }: { id: string; file: File; type: 'image' | 'bannerImage' }) => {
      const formData = new FormData();
      formData.append('image', file);

      const endpoint = type === 'image'
        ? `/api/admin/master-regions/${id}/upload-image`
        : `/api/admin/master-regions/${id}/upload-banner`;

      const res = await fetch(endpoint, {
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
    onSuccess: (_, variables) => {
      toast({
        title: 'Success',
        description: `${variables.type === 'image' ? 'Icon' : 'Banner'} uploaded successfully`
      });
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
    setSelectedIcon(null);
    setIconPreview(region.image || null);
    setSelectedBanner(null);
    setBannerPreview(region.bannerImage || null);
  };

  const handleCloseDialog = () => {
    setEditingRegion(null);
    setSelectedIcon(null);
    setIconPreview(null);
    setSelectedBanner(null);
    setBannerPreview(null);
    if (iconInputRef.current) iconInputRef.current.value = '';
    if (bannerInputRef.current) bannerInputRef.current.value = '';
  };

  const handleIconSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedIcon(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedBanner(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadImages = () => {
    if (!editingRegion) return;

    if (selectedIcon) {
      uploadMutation.mutate({ id: editingRegion.id, file: selectedIcon, type: 'image' });
    }

    if (selectedBanner) {
      uploadMutation.mutate({ id: editingRegion.id, file: selectedBanner, type: 'bannerImage' });
    }
  };

  const handleToggleActive = (region: Region) => {
    updateMutation.mutate({ id: region.id, data: { active: !region.active } });
  };

  const handleTogglePopular = (region: Region) => {
    updateMutation.mutate({ id: region.id, data: { isPopular: !region.isPopular } });
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
                    <TableHead>Banner</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Countries</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popular</TableHead>
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
                        {region.bannerImage ? (
                          <img
                            src={region.bannerImage}
                            alt={`${region.name} banner`}
                            className="w-20 h-10 rounded object-cover border"
                          />
                        ) : (
                          <div className="w-20 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300">
                            <Image className="h-4 w-4 text-slate-400" />
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
                        <Switch
                          checked={region.isPopular}
                          onCheckedChange={() => handleTogglePopular(region)}
                          data-testid={`switch-popular-${region.id}`}
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
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Icon Section */}
              <div className="space-y-3">
                <Label>Icon / Image</Label>
                <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon Preview"
                      className="w-24 h-24 rounded object-cover border shadow-sm"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300">
                      <Image className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  <Input
                    ref={iconInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleIconSelect}
                    className="text-xs"
                    data-testid="input-region-icon-file"
                  />
                </div>
              </div>

              {/* Banner Section */}
              <div className="space-y-3">
                <Label>Banner Image</Label>
                <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner Preview"
                      className="w-full h-24 rounded object-cover border shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-24 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300">
                      <Image className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  <Input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleBannerSelect}
                    className="text-xs"
                    data-testid="input-region-banner-file"
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              Accepted formats: JPG, PNG, GIF, WebP, SVG (max 5MB)
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadImages}
              disabled={uploadMutation.isPending || (!selectedIcon && !selectedBanner)}
              data-testid="button-upload-region-images"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? 'Uploading...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
