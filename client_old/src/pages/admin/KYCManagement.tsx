import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { FileText, CheckCircle, XCircle, User, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useTranslation } from "@/contexts/TranslationContext";

interface KycRequest {
  id: string;
  userId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  status: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name?: string;
    phone?: string;
  };
}

export default function KYCManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<KycRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: requests, isLoading } = useQuery<KycRequest[]>({
    queryKey: ["/api/admin/kyc/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("POST", `/api/admin/kyc/${id}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc/pending"] });
      setViewDialogOpen(false);
      setSelectedRequest(null);
      toast({
        title: t('admin.kyc.approvedTitle', 'KYC Approved'),
        description: t('admin.kyc.approvedDescription', 'The user has been notified of the approval.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin.kyc.approvalFailedTitle', 'Approval Failed'),
        description: error.message || t('admin.kyc.approvalFailedDescription', 'Failed to approve KYC'),
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return await apiRequest("POST", `/api/admin/kyc/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/kyc/pending"] });
      setRejectDialogOpen(false);
      setViewDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      toast({
        title: t('admin.kyc.rejectedTitle', 'KYC Rejected'),
        description: t('admin.kyc.rejectedDescription', 'The user has been notified with the rejection reason.'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('admin.kyc.rejectionFailedTitle', 'Rejection Failed'),
        description: error.message || t('admin.kyc.rejectionFailedDescription', 'Failed to reject KYC'),
        variant: "destructive",
      });
    },
  });

  const handleApprove = (request: KycRequest) => {
    if (confirm(t('admin.kyc.confirmApprove', 'Are you sure you want to approve this KYC document?'))) {
      approveMutation.mutate(request.id);
    }
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: t('admin.kyc.reasonRequiredTitle', 'Reason Required'),
        description: t('admin.kyc.reasonRequiredDescription', 'Please provide a reason for rejection'),
        variant: "destructive",
      });
      return;
    }
    if (selectedRequest) {
      rejectMutation.mutate({ id: selectedRequest.id, reason: rejectionReason });
    }
  };

  const handleView = (request: KycRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };


  const getDocumentUrl = (filePath?: string) => {
    if (!filePath) return "";

    // Normalize path for safety
    const cleanPath = filePath.replace(/\\/g, "/");

    // Find "/uploads" in the path
    const uploadsIndex = cleanPath.indexOf("/uploads");

    if (uploadsIndex === -1) {
      return ""; // or show error UI
    }

    const relativePath = cleanPath.substring(uploadsIndex);
    return `${import.meta.env.VITE_API_BASE_URL || ""}${relativePath}`;
  };

  const docUrl = getDocumentUrl(selectedRequest?.filePath);
 


  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          {t('admin.kyc.title', 'KYC Verification Queue')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {t('admin.kyc.subtitle', 'Review and approve customer identity documents')}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.kyc.stats.pendingReviews', 'Pending Reviews')}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-count">
              {requests?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('admin.kyc.stats.documentsAwaiting', 'Documents awaiting review')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KYC Requests */}
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.kyc.cardTitle', 'Pending Requests')}</CardTitle>
          <CardDescription>{t('admin.kyc.cardDescription', 'Review and process KYC documents')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  data-testid={`kyc-request-${request.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{request.user.name || request.user.email}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                        <span className="capitalize">{request.documentType.replace(/_/g, ' ')}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleView(request)}
                      data-testid={`button-view-${request.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t('admin.kyc.review', 'Review')}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleApprove(request)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${request.id}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {t('admin.kyc.approve', 'Approve')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setRejectDialogOpen(true);
                      }}
                      disabled={rejectMutation.isPending}
                      data-testid={`button-reject-${request.id}`}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      {t('admin.kyc.reject', 'Reject')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('admin.kyc.noPending', 'No pending KYC requests')}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t('admin.kyc.dialog.title', 'Review KYC Document')}</DialogTitle>
            <DialogDescription>
              {t('admin.kyc.dialog.description', 'Review the submitted document and customer information')}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.customerName', 'Customer Name')}</Label>
                  <div className="font-medium">{selectedRequest.user.name || t('admin.kyc.dialog.notProvided', 'Not provided')}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.email', 'Email')}</Label>
                  <div className="font-medium">{selectedRequest.user.email}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.phone', 'Phone')}</Label>
                  <div className="font-medium">{selectedRequest.user.phone || t('admin.kyc.dialog.notProvided', 'Not provided')}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.documentType', 'Document Type')}</Label>
                  <div className="font-medium capitalize">
                    {selectedRequest.documentType.replace(/_/g, ' ')}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.submitted', 'Submitted')}</Label>
                  <div className="font-medium">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('admin.kyc.dialog.fileName', 'File Name')}</Label>
                  <div className="font-medium">{selectedRequest.fileName}</div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <Label className="text-sm text-muted-foreground mb-2 block">
                  {t('admin.kyc.dialog.documentPreview', 'Document Preview')}
                </Label>

                <div className="text-center">
                  {docUrl ? (
                    <a
                      href={docUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {t('admin.kyc.dialog.viewDocument', 'Click to view document in new tab')}
                    </a>
                  ) : (
                    <span className="text-red-500 text-sm">
                      Document not available
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
              data-testid="button-close-dialog"
            >
              {t('admin.kyc.dialog.close', 'Close')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewDialogOpen(false);
                setRejectDialogOpen(true);
              }}
              data-testid="button-reject-dialog"
            >
              <XCircle className="h-4 w-4 mr-1" />
              {t('admin.kyc.reject', 'Reject')}
            </Button>
            <Button
              variant="default"
              onClick={() => selectedRequest && handleApprove(selectedRequest)}
              disabled={approveMutation.isPending}
              data-testid="button-approve-dialog"
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {t('admin.kyc.approve', 'Approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.kyc.rejectDialog.title', 'Reject KYC Document')}</DialogTitle>
            <DialogDescription>
              {t('admin.kyc.rejectDialog.description', 'Please provide a reason for rejection. The customer will be notified.')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">{t('admin.kyc.rejectDialog.rejectionReason', 'Rejection Reason')}</Label>
              <Textarea
                id="reason"
                placeholder={t('admin.kyc.rejectDialog.placeholder', 'e.g., Document is unclear, expired, or does not match requirements...')}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="mt-2"
                rows={4}
                data-testid="textarea-rejection-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setRejectionReason("");
              }}
              data-testid="button-cancel-reject"
            >
              {t('admin.kyc.rejectDialog.cancel', 'Cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? t('admin.kyc.rejectDialog.rejecting', 'Rejecting...') : t('admin.kyc.rejectDialog.confirmRejection', 'Confirm Rejection')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
