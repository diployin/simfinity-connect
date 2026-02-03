import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Plus,
  Edit2,
  Trash2,
  CreditCard,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PaymentGateway {
  id: string;
  provider: "stripe" | "razorpay" | "paypal" | "paystack" | "powertranz";
  displayName: string;
  publicKey?: string;
  secretKey?: string;
  isEnabled: boolean;
  createdAt: string;
  supportedCurrencies?: {
    currencyId: string;
  }[];
}

interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  isEnabled: boolean;
}


const PROVIDERS = [
  { value: "stripe", label: "Stripe" },
  { value: "razorpay", label: "Razorpay" },
  { value: "paypal", label: "PayPal" },
  { value: "paystack", label: "Paystack" },
  { value: "powertranz", label: "Powertranz" },
];

export default function PaymentGatewayManagement() {
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PaymentGateway | null>(null);

  const [form, setForm] = useState({
    provider: "",
    displayName: "",
    publicKey: "",
    secretKey: "",
    isEnabled: true,
    supportedCurrencies: [] as string[],
  });

  /* ================= FETCH ================= */
  const { data, isLoading } = useQuery({
    queryKey: ["/api/admin/payment-gateways"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/payment-gateways");
      return res.json();
    },
  });

  const gateways: PaymentGateway[] = data?.data || [];

  /* ================= MUTATIONS ================= */

  // const saveMutation = useMutation({
  //   mutationFn: async () => {
  //     const method = editing ? "PUT" : "POST";
  //     const url = editing
  //       ? `/api/admin/payment-gateways/${editing.id}`
  //       : "/api/admin/payment-gateways";

  //     return apiRequest(method, url, form);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-gateways"] });
  //     toast({ title: "Success", description: "Payment gateway saved" });
  //     resetForm();
  //   },
  //   onError: (err: any) => {
  //     toast({
  //       title: "Error",
  //       description: err.message || "Failed to save gateway",
  //       variant: "destructive",
  //     });
  //   },
  // });


  const saveMutation = useMutation({
    mutationFn: async () => {
      const method = editing ? "PUT" : "POST";
      const url = editing
        ? `/api/admin/payment-gateways/${editing.id}`
        : "/api/admin/payment-gateways";

      // 🔥 FIX: backend-compatible payload
      const payload = {
        ...form,
        supportedCurrencies: form.supportedCurrencies.map((id) => ({
          currencyId: id,
        })),
      };

      return apiRequest(method, url, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/payment-gateways"],
      });
      toast({ title: "Success", description: "Payment gateway saved" });
      resetForm();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to save gateway",
        variant: "destructive",
      });
    },
  });


  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      apiRequest("DELETE", `/api/admin/payment-gateways/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-gateways"] });
      toast({ title: "Deleted", description: "Gateway removed" });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, isEnabled }: { id: string; isEnabled: boolean }) =>
      apiRequest("PATCH", `/api/admin/payment-gateways/${id}/status`, {
        isEnabled,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payment-gateways"] });
    },
  });



  // currencies list
  const { data: currencyRes, isLoading: currencyLoading } = useQuery({
    queryKey: ["/api/admin/currencies"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/admin/currencies");
      return res.json();
    },
    enabled: open, // dialog open hone pe load
  });


  console.log("currencyRes:", currencyRes);



  const currencies: Currency[] =
    currencyRes?.data?.filter((c: Currency) => c.isEnabled) || [];

  console.log("currencies:", currencies);

  /* ================= HELPERS ================= */

  const resetForm = () => {
    setEditing(null);
    setOpen(false);
    setForm({
      provider: "",
      displayName: "",
      publicKey: "",
      secretKey: "",
      isEnabled: true,
      supportedCurrencies: [] as string[],
    });
  };

  const openEdit = (g: PaymentGateway) => {
    setEditing(g);
    setForm({
      provider: g.provider,
      displayName: g.displayName,
      publicKey: g.publicKey || "",
      secretKey: g.secretKey || "",
      isEnabled: g.isEnabled,
      supportedCurrencies: g.supportedCurrencies?.map((c: any) => c.currencyId) || [],
    });
    setOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-foreground">
            <CreditCard className="h-7 w-7" />
            Payment Gateways
          </h1>
          <p className="text-muted-foreground">
            Configure payment providers and options
          </p>
        </div>

        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Gateway
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configured Gateways</CardTitle>
          <CardDescription>
            Each row represents one user-visible payment option
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin h-6 w-6" />
            </div>
          ) : gateways.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No payment gateways added
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gateways.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="capitalize">{g.provider}</TableCell>
                    <TableCell>{g.displayName}</TableCell>
                    <TableCell>
                      <Switch
                        checked={g.isEnabled}
                        onCheckedChange={(checked) =>
                          toggleMutation.mutate({
                            id: g.id,
                            isEnabled: checked,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => openEdit(g)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(g.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* ================= ADD / EDIT MODAL ================= */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Gateway" : "Add Gateway"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Provider</Label>
              <Select
                value={form.provider}
                onValueChange={(v) => setForm({ ...form, provider: v })}
                disabled={!!editing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {PROVIDERS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Display Name</Label>
              <Input
                value={form.displayName}
                onChange={(e) =>
                  setForm({ ...form, displayName: e.target.value })
                }
                placeholder="Card / UPI / Wallet"
              />
            </div>

            <div>
              <Label>Public Key</Label>
              <Input
                value={form.publicKey}
                onChange={(e) =>
                  setForm({ ...form, publicKey: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Secret Key</Label>
              <Input
                type="password"
                value={form.secretKey}
                onChange={(e) =>
                  setForm({ ...form, secretKey: e.target.value })
                }
              />
            </div>

            <div>
              <Label>Supported Currencies</Label>

              {currencyLoading ? (
                <p className="text-sm text-muted-foreground mt-2">
                  Loading currencies...
                </p>
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currencies.map((c) => {
                    const checked = form.supportedCurrencies.includes(c.id);

                    return (
                      <Button
                        key={c.id}
                        type="button"
                        size="sm"
                        variant={checked ? "default" : "outline"}
                        onClick={() => {
                          setForm((prev) => ({
                            ...prev,
                            supportedCurrencies: checked
                              ? prev.supportedCurrencies.filter((x) => x !== c.id)
                              : [...prev.supportedCurrencies, c.id],
                          }));
                        }}
                      >
                        {c.symbol} {c.code}
                      </Button>
                    );
                  })}
                </div>
              )}

              {form.supportedCurrencies.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Select at least one currency
                </p>
              )}
            </div>


            <div className="flex items-center gap-2">
              <Switch
                checked={form.isEnabled}
                onCheckedChange={(v) =>
                  setForm({ ...form, isEnabled: v })
                }
              />
              <span className="text-sm">
                {form.isEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>


          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={() => saveMutation.mutate()}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
