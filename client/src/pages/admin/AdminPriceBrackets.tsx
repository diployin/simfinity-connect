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
        <div className="min-h-screen bg-background dark:bg-slate-950 py-6 md:py-8 px-4 md:px-8 space-y-6 md:space-y-8">
            <div className="container mx-auto space-y-6 md:space-y-8">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Price Brackets</h1>
                        <p className="text-sm md:text-base text-muted-foreground">Manage and generate pricing tiers for mobile stores.</p>
                    </div>
                    {/* Toggle */}
                    <div className={cn(
                        "flex items-center justify-between md:justify-start gap-3 rounded-lg border bg-card px-4 py-2 transition-opacity w-full md:w-auto",
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

                <Card className="border-primary/20 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-xl">Configuration</CardTitle>
                        <CardDescription>Set the currency and price interval to generate new tiers.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row gap-4 sm:items-end flex-wrap">
                        <div className="space-y-2 w-full sm:w-auto">
                            <label className="text-sm font-medium text-foreground">Currency</label>
                            <Select value={currency} onValueChange={setCurrency}>
                                <SelectTrigger className="w-full sm:w-[120px] bg-background dark:bg-gray-950 dark:text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent
                                    className="dark:bg-gray-950 dark:text-white"
                                >
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="INR">INR</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 w-full sm:w-auto">
                            <label className="text-sm font-medium text-foreground">Price Step</label>
                            <Input
                                type="number"
                                value={priceDiff}
                                onChange={(e) => setPriceDiff(Number(e.target.value))}
                                className="w-full sm:w-[150px] bg-background dark:bg-gray-950 dark:text-white"
                            />
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto pt-2 sm:pt-0">
                            <Button
                                variant="outline"
                                onClick={() => previewMutation.mutate()}
                                disabled={!inAppPurchase || previewMutation.isPending}
                                className="flex-1 sm:flex-none"
                            >
                                {previewMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Preview
                            </Button>
                            <Button
                                onClick={() => generateMutation.mutate()}
                                disabled={!inAppPurchase || generateMutation.isPending}
                                className="flex-1 sm:flex-none"
                            >
                                {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate & Save
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm dark:bg-gray-950 dark:text-white ">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-xl">Generated Brackets ({resData?.data?.total || 0}) </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border overflow-x-auto bg-card relative dark:bg-gray-950 dark:text-white">
                            <Table className="min-w-[800px] md:min-w-full">
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="font-semibold text-foreground">Product ID</TableHead>
                                        <TableHead className="font-semibold text-foreground">Price Range</TableHead>
                                        <TableHead className="font-semibold text-foreground">Currency</TableHead>
                                        <TableHead className="font-semibold text-foreground">Android</TableHead>
                                        <TableHead className="font-semibold text-foreground">Apple</TableHead>
                                        <TableHead className="text-right font-semibold text-foreground">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Loading...</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : brackets.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center p-0">
                                                <div className="sticky left-0 right-0 flex items-center justify-center w-[calc(100vw-2rem)] md:w-full">
                                                    <span className="text-muted-foreground py-8">No data found.</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        brackets.map((b) => (
                                            <TableRow key={b.id} className="hover:bg-muted/30 transition-colors">
                                                <TableCell className="font-mono text-xs">{b.productId}</TableCell>
                                                <TableCell className="whitespace-nowrap">{b.minPrice} - {b.maxPrice}</TableCell>
                                                <TableCell>{b.currency}</TableCell>
                                                <TableCell>{getStatusBadge(b.androidStatus)}</TableCell>
                                                <TableCell>{getStatusBadge(b.appleStatus)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant={b.isActive ? "default" : "outline"} className={cn(!b.isActive && "text-muted-foreground")}>
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
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
                            <div className="text-sm text-muted-foreground order-2 sm:order-1">
                                Showing Page {page} of {totalPages || 1}
                            </div>
                            <div className="flex items-center space-x-2 order-1 sm:order-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= totalPages}
                                    className="h-8 px-2 lg:px-3"
                                >
                                    Next <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PREVIEW MODAL WITH SCROLL AREA */}
                <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-card border-border">
                        <DialogHeader>
                            <DialogTitle className="text-foreground">Preview Brackets ({previewMutation.data?.data?.totalBrackets})</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="h-[400px] w-full rounded-md border bg-background/50 p-4">
                            <div className="space-y-2">
                                {previewMutation.data?.data?.data?.map((b: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center border-b border-border/50 pb-2 last:border-0 hover:bg-muted/20 px-1 rounded transition-colors">
                                        <code className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded border border-border/50">{b.productId}</code>
                                        <span className="text-sm font-medium text-foreground">
                                            {b.minPrice} - {b.maxPrice} {currency}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <DialogFooter className="sm:justify-end">
                            <Button onClick={() => setPreviewOpen(false)} variant="secondary">Close Preview</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}