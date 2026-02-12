import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Shield, Save } from "lucide-react";

export function AdminAccountSettings() {
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const mutation = useMutation({
        mutationFn: () =>
            apiRequest("PUT", "/api/admin/account", {
                email: email || undefined,
                currentPassword,
                newPassword: newPassword || undefined,
            }),
        onSuccess: () => {
            toast({ title: "Success", description: "Account updated successfully" });
            setCurrentPassword("");
            setNewPassword("");
        },
        onError: (err: any) => {
            toast({
                title: "Error",
                description: err.message || "Failed to update account",
                variant: "destructive",
            });
        },
    });

    return (
        <Card className="border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[var(--primary-hex)] to-[var(--primary-second-hex)] flex items-center justify-center">
                    <Shield className="h-6 w-6 text-black" />
                </div>
                <CardTitle className="text-2xl font-bold">Account & Security</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 p-8">
                <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="New email" />
                </div>

                <div className="space-y-2">
                    <Label>Current Password *</Label>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                    />
                </div>

                <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New password (min 6 chars)"
                    />
                </div>

                <Button
                    onClick={() => mutation.mutate()}
                    disabled={mutation.isPending}
                    className="gap-2 h-12 px-8 text-lg bg-gradient-to-r from-[var(--primary-hex)] to-[var(--primary-second-hex)]"
                >
                    {mutation.isPending ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-5 w-5" />
                            Update Account
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
