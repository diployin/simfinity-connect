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
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {t('admin.kyc.title', 'KYC Verification Queue')}
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-1">
            {t('admin.kyc.subtitle', 'Review and approve customer identity documents')}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm p-5 bg-white dark:bg-slate-950">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('admin.kyc.stats.pendingReviews', 'Pending Reviews')}
              </p>
              <h3
                className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-1"
                data-testid="text-pending-count"
              >
                {requests?.length || 0}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t('admin.kyc.stats.documentsAwaiting', 'Documents awaiting review')}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-6 w-6 text-primary-second" />
            </div>
          </div>
        </Card>
      </div>

      {/* KYC Requests */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm dark:bg-slate-950">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">
            {t('admin.kyc.cardTitle', 'Pending Requests')}
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            {t('admin.kyc.cardDescription', 'Review and process KYC documents')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-second"></div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('admin.kyc.loading', 'Loading requests...')}</p>
            </div>
          ) : requests && requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 gap-4 hover:border-primary/20 transition-all"
                  data-testid={`kyc-request-${request.id}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="h-12 w-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                      <User className="h-6 w-6 text-primary-second" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-50 truncate">
                        {request.user.name || request.user.email}
                      </div>
                      <div className="text-sm flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none text-[10px] uppercase font-bold px-2 py-0">
                          {request.documentType.replace(/_/g, ' ')}
                        </Badge>
                        <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 sm:flex-none h-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      onClick={() => handleView(request)}
                      data-testid={`button-view-${request.id}`}
                    >
                      <Eye className="h-4 w-4 mr-1.5" />
                      {t('admin.kyc.review', 'Review')}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1 sm:flex-none h-9"
                      onClick={() => handleApprove(request)}
                      disabled={approveMutation.isPending}
                      data-testid={`button-approve-${request.id}`}
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      {t('admin.kyc.approve', 'Approve')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 sm:flex-none h-9"
                      onClick={() => {
                        setSelectedRequest(request);
                        setRejectDialogOpen(true);
                      }}
                      disabled={rejectMutation.isPending}
                      data-testid={`button-reject-${request.id}`}
                    >
                      <XCircle className="h-4 w-4 mr-1.5" />
                      {t('admin.kyc.reject', 'Reject')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-slate-300 dark:text-slate-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{t('admin.kyc.noPending', 'No pending KYC requests')}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{t('admin.kyc.allCaughtUp', 'You are all caught up with identity verifications.')}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('admin.kyc.dialog.title', 'Review KYC Document')}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.kyc.dialog.description', 'Review the submitted document and customer information')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2 bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.customerName', 'Customer Name')}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{selectedRequest.user.name || t('admin.kyc.dialog.notProvided', 'Not provided')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.email', 'Email')}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRequest.user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.phone', 'Phone')}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{selectedRequest.user.phone || t('admin.kyc.dialog.notProvided', 'Not provided')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.documentType', 'Document Type')}</p>
                  <Badge variant="outline" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-[10px] uppercase font-bold px-2 py-0 capitalize">
                    {selectedRequest.documentType.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.submitted', 'Submitted')}</p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Date(selectedRequest.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('admin.kyc.dialog.fileName', 'File Name')}</p>
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300 truncate">{selectedRequest.fileName}</p>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-900 shadow-sm text-center">
                <Label className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-4 block">
                  {t('admin.kyc.dialog.documentPreview', 'Document Preview')}
                </Label>

                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center border-2 border-dashed border-primary/20">
                    <FileText className="h-10 w-10 text-primary-second opacity-60" />
                  </div>
                  {docUrl ? (
                    <div className="space-y-4">
                      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                        {t('admin.kyc.dialog.previewSecurityMsg', 'For security, documents are opened in a secure new tab.')}
                      </p>
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-primary text-white font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary-dark transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t('admin.kyc.dialog.viewDocument', 'View Identity Document')}
                      </a>
                    </div>
                  ) : (
                    <span className="text-red-500 font-bold text-sm bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-100 dark:border-red-900/50">
                      {t('admin.kyc.dialog.docUnavailable', 'Document not available or expired')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full sm:flex-1 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
              onClick={() => setViewDialogOpen(false)}
              data-testid="button-close-dialog"
            >
              {t('admin.kyc.dialog.close', 'Close')}
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:flex-1 h-11"
              onClick={() => {
                setViewDialogOpen(false);
                setRejectDialogOpen(true);
              }}
              data-testid="button-reject-dialog"
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t('admin.kyc.reject', 'Reject')}
            </Button>
            <Button
              variant="default"
              className="w-full sm:flex-1 h-11 shadow-md shadow-primary/20"
              onClick={() => selectedRequest && handleApprove(selectedRequest)}
              disabled={approveMutation.isPending}
              data-testid="button-approve-dialog"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {t('admin.kyc.approve', 'Approve')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-50">{t('admin.kyc.rejectDialog.title', 'Reject KYC Document')}</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400">
              {t('admin.kyc.rejectDialog.description', 'Please provide a reason for rejection. The customer will be notified.')}
            </DialogDescription>
          </DialogHeader>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-semibold text-slate-900 dark:text-slate-50 ml-1">
                {t('admin.kyc.rejectDialog.rejectionReason', 'Rejection Reason')}
              </Label>
              <Textarea
                id="reason"
                placeholder={t('admin.kyc.rejectDialog.placeholder', 'e.g., Document is unclear, expired, or does not match requirements...')}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-red-500 min-h-[120px]"
                data-testid="textarea-rejection-reason"
              />
            </div>
          </div>
          <DialogFooter className="p-6 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 h-11 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
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
              className="flex-1 h-11 shadow-md shadow-red-500/20"
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectionReason.trim()}
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{t('admin.kyc.rejectDialog.rejecting', 'Rejecting...')}</span>
                </div>
              ) : (
                t('admin.kyc.rejectDialog.confirmRejection', 'Confirm Rejection')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
