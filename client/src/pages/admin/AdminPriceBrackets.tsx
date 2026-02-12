import { useEffect, useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/contexts/TranslationContext";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PriceBracket {
    id?: string;
    minPrice: string | number;
    maxPrice: string | number;
    productId: string;
    currency: string;
    androidStatus: string;
    appleStatus: string;
    isActive: boolean;
}

export default function AdminPriceBrackets() {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [inAppPurchase, setInAppPurchase] = useState(false);
    const [currency, setCurrency] = useState("USD");
    const [priceDiff, setPriceDiff] = useState(5);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [page, setPage] = useState(1);


    // Fetch settings
    const { data: settingsResponse } = useQuery({
        queryKey: ["/api/admin/settings"],
    });

    // console.log("nsd sdfds", settingsResponse)
    // Convert array → object
    const settings = useMemo(() => {
        if (!settingsResponse) return {};
        return settingsResponse.reduce(
            (acc: Record<string, string>, s: any) => {
                acc[s.key] = s.value;
                return acc;
            },
            {}
        );
    }, [settingsResponse]);

    // console.log("sdfafasasdas", settings)

    // Load values
    useEffect(() => {
        if (!settings) return;

        setInAppPurchase(settings.in_app_purchase === "true");
    }, [settings]);


    // Mutation
    const updateSettingMutation = useMutation({
        mutationFn: async ({
            key,
            value,
            category,
        }: {
            key: string;
            value: string;
            category: string;
        }) =>
            apiRequest("PUT", `/api/admin/settings/${key}`, {
                value,
                category,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
            toast({
                title: t("admin.settings.success", "Success"),
                description: t(
                    "admin.settings.settingsUpdatedSuccess",
                    "Settings updated successfully"
                ),
            });
        },
        onError: (err: any) => {
            toast({
                title: t("admin.settings.error", "Error"),
                description:
                    err.message ||
                    t(
                        "admin.settings.failedToUpdateSettings",
                        "Failed to update settings"
                    ),
                variant: "destructive",
            });
        },
    });

    const save = async (key: string, value: string) =>
        updateSettingMutation.mutateAsync({
            key,
            value,
            category: "in_app_purchase",
        });

    const handleSave = async () => {
        await save("in_app_purchase", inAppPurchase);
    };


    const { data: resData, isLoading } = useQuery({
        queryKey: ["/api/admin/price-brackets/list", page, currency],
        queryFn: async () => {
            const res = await apiRequest("GET", `/api/admin/price-brackets/list?page=${page}&currency=${currency}`);
            return res.json();
        }
    });

    const brackets: PriceBracket[] = resData?.data?.data || [];
    const totalPages = Math.ceil((resData?.data?.total || 0) / (resData?.data?.limit || 20));

    const previewMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/admin/price-brackets/preview", { currency, priceDiff });
            return res.json();
        },
        onSuccess: () => setPreviewOpen(true),
    });

    const generateMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/admin/price-brackets/generate", { currency, priceDiff });
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/admin/price-brackets/list"] });
            toast({ title: "Success", description: "Price brackets generated successfully" });
        },
    });

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
            pending: "secondary",
            success: "default",
            error: "destructive"
        };
        return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
    };

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Price Brackets</h1>
                    <p className="text-muted-foreground">Manage and generate pricing tiers for mobile stores.</p>
                </div>
                {/* Toggle */}
                <div className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-2 transition-opacity",
                    updateSettingMutation.isPending && "opacity-60"
                )}>
                    <span className="text-sm font-medium text-foreground">
                        Allow In-App Purchase
                    </span>

                    <Switch
                        checked={inAppPurchase}
                        disabled={updateSettingMutation.isPending}
                        onCheckedChange={(checked) => {
                            setInAppPurchase(checked);
                            save("in_app_purchase", String(checked));
                        }}
                    />
                </div>

            </div>

            <Card className="border-primary/20">
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Set the currency and price interval to generate new tiers.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4 items-end flex-wrap">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="w-[120px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="INR">INR</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Price Step</label>
                        <Input
                            type="number"
                            value={priceDiff}
                            onChange={(e) => setPriceDiff(Number(e.target.value))}
                            className="w-[150px]"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => previewMutation.mutate()}
                            disabled={!inAppPurchase || previewMutation.isPending}
                        >
                            {previewMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Preview
                        </Button>
                        <Button
                            onClick={() => generateMutation.mutate()}
                            disabled={!inAppPurchase || generateMutation.isPending}
                        >
                            {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Generate & Save
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Generated Brackets ({resData?.data?.total || 0}) </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product ID</TableHead>
                                    <TableHead>Price Range</TableHead>
                                    <TableHead>Currency</TableHead>
                                    <TableHead>Android</TableHead>
                                    <TableHead>Apple</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow><TableCell colSpan={6} className="h-24 text-center">Loading...</TableCell></TableRow>
                                ) : brackets.length === 0 ? (
                                    <TableRow><TableCell colSpan={6} className="h-24 text-center">No data found.</TableCell></TableRow>
                                ) : (
                                    brackets.map((b) => (
                                        <TableRow key={b.id}>
                                            <TableCell className="font-mono text-xs">{b.productId}</TableCell>
                                            <TableCell>{b.minPrice} - {b.maxPrice}</TableCell>
                                            <TableCell>{b.currency}</TableCell>
                                            <TableCell>{getStatusBadge(b.androidStatus)}</TableCell>
                                            <TableCell>{getStatusBadge(b.appleStatus)}</TableCell>
                                            <TableCell className="text-right">
                                                <Badge variant={b.isActive ? "default" : "outline"}>
                                                    {b.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* PAGINATION CONTROLS */}
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                        </Button>
                        <div className="text-sm font-medium">
                            Page {page} of {totalPages || 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => p + 1)}
                            disabled={page >= totalPages}
                        >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* PREVIEW MODAL WITH SCROLL AREA */}
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Preview Brackets ({previewMutation.data?.data?.totalBrackets})</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                        <div className="space-y-2">
                            {previewMutation.data?.data?.data?.map((b: any, i: number) => (
                                <div key={i} className="flex justify-between items-center border-b pb-2 last:border-0">
                                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{b.productId}</code>
                                    <span className="text-sm font-medium">
                                        {b.minPrice} - {b.maxPrice} {currency}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <DialogFooter>
                        <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}