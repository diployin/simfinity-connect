import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { MapPin, Search, Edit2, Image, Flag, RefreshCw, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ReactCountryFlag from "react-country-flag";

interface Destination {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  airaloId: string | null;
  flagEmoji: string | null;
  image: string | null;
  bannerImage: string | null;
  isTerritory: boolean;
  parentCountryCode: string | null;
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

interface CountriesResponse {
  success: boolean;
  data: {
    destinations: Destination[];
    stats: {
      total: number;
      countries: number;
      territories: number;
    };
  };
}

export default function MasterCountries() {
  const { toast } = useToast();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [editingDestination, setEditingDestination] = useState<Destination | null>(null);

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

  const { data: countriesData, isLoading } = useQuery<CountriesResponse>({
    queryKey: ["/api/admin/master-countries", { search: debouncedSearch, type: typeFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (typeFilter !== "all") params.append("type", typeFilter);
      const res = await fetch(`/api/admin/master-countries?${params.toString()}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/admin/master-countries/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Country updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/master-countries"] });
      setEditingDestination(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update country",
        variant: "destructive",
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/master-countries/sync", {});
      return res.json();
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sync Complete",
        description: `Created ${data.data?.destinationsCreated || 0} countries, updated ${data.data?.destinationsUpdated || 0}`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/master-countries"] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync countries",
        variant: "destructive",
      });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ id, file, type }: { id: string; file: File; type: 'image' | 'bannerImage' }) => {
      const formData = new FormData();
      formData.append("image", file);

      const endpoint = type === 'image'
        ? `/api/admin/master-countries/${id}/upload-image`
        : `/api/admin/master-countries/${id}/upload-banner`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Upload failed");
      }

      return res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `${variables.type === 'image' ? 'Icon' : 'Banner'} uploaded successfully`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/master-countries"] });
      handleCloseDialog();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    },
  });

  const destinations = countriesData?.data?.destinations || [];
  const stats = countriesData?.data?.stats || { total: 0, countries: 0, territories: 0 };
  const totalPackages = destinations.reduce((sum, d) => sum + d.packageCounts.total, 0);

  const handleEditClick = (dest: Destination) => {
    setEditingDestination(dest);
    setSelectedIcon(null);
    setIconPreview(dest.image || null);
    setSelectedBanner(null);
    setBannerPreview(dest.bannerImage || null);
  };

  const handleCloseDialog = () => {
    setEditingDestination(null);
    setSelectedIcon(null);
    setIconPreview(null);
    setSelectedBanner(null);
    setBannerPreview(null);
    if (iconInputRef.current) iconInputRef.current.value = "";
    if (bannerInputRef.current) bannerInputRef.current.value = "";
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
    if (!editingDestination) return;

    if (selectedIcon) {
      uploadMutation.mutate({ id: editingDestination.id, file: selectedIcon, type: 'image' });
    }

    if (selectedBanner) {
      uploadMutation.mutate({ id: editingDestination.id, file: selectedBanner, type: 'bannerImage' });
    }
  };

  const handleToggleActive = (dest: Destination) => {
    updateMutation.mutate({ id: dest.id, data: { active: !dest.active } });
  };

  const handleTogglePopular = (dest: Destination) => {
    updateMutation.mutate({ id: dest.id, data: { isPopular: !dest.isPopular } });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="h-6 w-6" />
            Countries & Territories
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage destination countries and territories
          </p>
        </div>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
          data-testid="button-sync-countries"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          {syncMutation.isPending ? "Syncing..." : "Sync Countries"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Destinations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.countries}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Territories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.territories}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Countries</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search countries..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 w-full sm:w-[200px]"
                  data-testid="input-search-countries"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[150px]" data-testid="select-type">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="country">Countries</SelectItem>
                  <SelectItem value="territory">Territories</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <MapPin className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          ) : destinations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>No countries found.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flag</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Banner</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Packages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((dest) => (
                    <TableRow key={dest.id}>
                      <TableCell>
                        <ReactCountryFlag
                          countryCode={dest.countryCode}
                          svg
                          style={{ width: "24px", height: "18px" }}
                          title={dest.name}
                        />
                      </TableCell>
                      <TableCell>
                        {dest.image ? (
                          <img
                            src={dest.image}
                            alt={dest.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <Flag className="h-5 w-5 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {dest.bannerImage ? (
                          <img
                            src={dest.bannerImage}
                            alt={`${dest.name} banner`}
                            className="w-20 h-10 rounded object-cover border"
                          />
                        ) : (
                          <div className="w-20 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-dashed border-slate-300">
                            <Image className="h-4 w-4 text-slate-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{dest.name}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {dest.countryCode}
                        </code>
                      </TableCell>
                      <TableCell>
                        {dest.isTerritory ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                            Territory
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-primary/10 text-[var(--primary-dark)] dark:bg-[var(--primary-dark)] dark:text-primary/10">
                            Country
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-medium">
                            {dest.packageCounts.total} total
                          </span>
                          <span className="text-slate-500">
                            A:{dest.packageCounts.airalo} E:{dest.packageCounts.esimAccess} G:{dest.packageCounts.esimGo}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={dest.active}
                          onCheckedChange={() => handleToggleActive(dest)}
                          data-testid={`switch-active-${dest.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={dest.isPopular}
                          onCheckedChange={() => handleTogglePopular(dest)}
                          data-testid={`switch-popular-${dest.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEditClick(dest)}
                          data-testid={`button-edit-${dest.id}`}
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

      <Dialog open={!!editingDestination} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Country Image</DialogTitle>
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
                    data-testid="input-country-icon-file"
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
                    data-testid="input-country-banner-file"
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
              data-testid="button-upload-country-images"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploadMutation.isPending ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
