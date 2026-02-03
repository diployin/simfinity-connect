import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Upload, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useTranslation } from '@/contexts/TranslationContext';
import { AccountLayout } from '@/components/layout/AccountLayout';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface User {
  id: string;
  email: string;
  name?: string;
  kycStatus: string;
  kycRejectionReason?: string;
}

interface KycDocument {
  id: string;
  documentType: string;
  status: string;
  createdAt: string;
}

export default function KYCSubmission() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>('');
  const [kycBlockedModal, setKycBlockedModal] = useState(false);

  const { data: user } = useQuery<User>({
    queryKey: ['/api/customer/profile'],
  });

  const { data: documents, isLoading } = useQuery<KycDocument[]>({
    queryKey: ['/api/kyc/documents'],
  });

  const canResubmitKyc = user?.kycStatus === 'rejected' || user?.kycStatus == 'pending';
  console.log('canResubmitKyc:', user?.kycStatus);

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/customer/kyc/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/kyc/documents'] });
      queryClient.invalidateQueries({ queryKey: ['/api/customer/profile'] });
      setSelectedFile(null);
      setDocumentType('');
      toast({
        title: t('kyc.documentUploaded', 'Document Uploaded'),
        description: t(
          'kyc.documentUploadedDesc',
          'Your KYC document has been submitted for review.',
        ),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('kyc.uploadFailed', 'Upload Failed'),
        description: error.message || t('kyc.uploadFailedDesc', 'Failed to upload document'),
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: t('kyc.fileTooLarge', 'File Too Large'),
          description: t('kyc.fileTooLargeDesc', 'Please select a file smaller than 10MB'),
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canResubmitKyc) {
      setKycBlockedModal(true);
      return;
    }
    if (!selectedFile || !documentType) {
      toast({
        title: t('kyc.missingInformation', 'Missing Information'),
        description: t('kyc.missingInformationDesc', 'Please select a document type and file'),
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('documentType', documentType);

    uploadMutation.mutate(formData);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getDocumentStatusBadge = (status?: string) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: 'Under Review' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
    };

    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getStatusBadge = (status: string | undefined) => {
    const variants = {
      pending: { variant: 'secondary' as const, label: t('kyc.status.pending', 'Not Submitted') },
      approved: { variant: 'default' as const, label: t('kyc.status.approved', 'Approved') },
      verified: { variant: 'default' as const, label: t('kyc.status.verified', 'Verified') },
      rejected: { variant: 'destructive' as const, label: t('kyc.status.rejected', 'Rejected') },
      submitted: { variant: 'secondary' as const, label: t('kyc.status.submitted', 'Submitted') },
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  return (
    // <AccountLayout>
     <>
      <Helmet>
        <title>KYC Verification | eSIM Global</title>
        <meta
          name="description"
          content="Complete your identity verification to unlock all features"
        />
      </Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">{t('kyc.title', 'KYC Verification')}</h1>
        <p className="text-muted-foreground">
          {t('kyc.description', 'Complete your identity verification to ensure account security')}
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <p className="text-slate-600 dark:text-slate-400">{t('kyc.loading', 'Loading...')}</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('kyc.verificationStatus', 'Verification Status')}</CardTitle>
              <CardDescription>
                {t('kyc.verificationStatusDesc', 'Current status of your KYC verification')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 rounded-lg border">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  {user?.kycStatus === 'approved' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : user?.kycStatus === 'verified' ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : user?.kycStatus === 'rejected' ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : user?.kycStatus === 'submitted' ? (
                    <Clock className="h-6 w-6 text-orange-500" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-orange-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">
                    {user?.kycStatus === 'approved' &&
                      t('kyc.verificationApproved', 'Verification Approved')}
                    {user?.kycStatus === 'verified' &&
                      t('kyc.identityVerified', 'Identity Verified')}
                    {user?.kycStatus === 'rejected' &&
                      t('kyc.verificationRejected', 'Verification Rejected')}
                    {user?.kycStatus === 'submitted' && t('kyc.underReview', 'Under Review')}
                    {(user?.kycStatus === 'pending' || !user?.kycStatus) &&
                      t('kyc.verificationPending', 'Verification Pending')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user?.kycStatus === 'approved' &&
                      t('kyc.approvedDesc', 'Your identity has been verified successfully')}
                    {user?.kycStatus === 'verified' &&
                      t('kyc.verifiedDesc', 'Your identity has been verified successfully')}
                    {user?.kycStatus === 'rejected' &&
                      t('kyc.rejectedDesc', 'Please submit new documents')}
                    {user?.kycStatus === 'submitted' &&
                      t('kyc.submittedDesc', 'Our team is reviewing your documents')}
                    {(user?.kycStatus === 'pending' || !user?.kycStatus) &&
                      t('kyc.pendingDesc', 'Submit your documents to get verified')}
                  </div>
                </div>
                <Badge
                  variant={getStatusBadge(user?.kycStatus).variant}
                  className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                >
                  {getStatusBadge(user?.kycStatus).label}
                </Badge>
              </div>

              {user?.kycStatus === 'rejected' && user?.kycRejectionReason && (
                <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="font-medium text-destructive mb-1">
                    {t('kyc.rejectionReason', 'Rejection Reason')}
                  </div>
                  <div className="text-sm">{user.kycRejectionReason}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {canResubmitKyc && (
            <Card>
              <CardHeader>
                <CardTitle>{t('kyc.uploadDocuments', 'Upload Documents')}</CardTitle>
                <CardDescription>
                  {t(
                    'kyc.uploadDocumentsDesc',
                    'Upload a clear photo or scan of your government-issued ID',
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">{t('kyc.documentType', 'Document Type')}</Label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger data-testid="select-document-type">
                        <SelectValue
                          placeholder={t('kyc.selectDocumentType', 'Select document type')}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">{t('kyc.passport', 'Passport')}</SelectItem>
                        <SelectItem value="national_id">
                          {t('kyc.nationalId', 'National ID Card')}
                        </SelectItem>
                        <SelectItem value="drivers_license">
                          {t('kyc.driversLicense', "Driver's License")}
                        </SelectItem>
                        <SelectItem value="proof_of_address">
                          {t('kyc.proofOfAddress', 'Proof of Address')}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="document">{t('kyc.uploadFile', 'Upload File')}</Label>
                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                      {selectedFile ? (
                        <div className="space-y-3">
                          <FileText className="h-12 w-12 mx-auto text-teal-500" />
                          <div>
                            <div className="font-medium">{selectedFile.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                            data-testid="button-remove-file"
                          >
                            {t('kyc.removeFile', 'Remove File')}
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
                            <Label htmlFor="file-upload" className="cursor-pointer">
                              <span className="text-teal-500 hover:underline">
                                {t('kyc.clickToUpload', 'Click to upload')}
                              </span>
                              {' ' + t('kyc.orDragAndDrop', 'or drag and drop')}
                            </Label>
                            <div className="text-sm text-muted-foreground mt-1">
                              {t('kyc.fileFormat', 'PNG, JPG, PDF up to 10MB')}
                            </div>
                          </div>
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            data-testid="input-file"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-teal-50 dark:bg-teal-950/20 p-4 rounded-lg border border-teal-200 dark:border-teal-900">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-teal-900 dark:text-teal-100">
                        <div className="font-medium mb-1">
                          {t('kyc.documentRequirements', 'Document Requirements:')}
                        </div>
                        <ul className="list-disc list-inside space-y-1 text-teal-800 dark:text-teal-200">
                          <li>{t('kyc.requirement1', 'Must be a government-issued ID')}</li>
                          <li>{t('kyc.requirement2', 'Photo should be clear and readable')}</li>
                          <li>
                            {t('kyc.requirement3', 'All corners of the document must be visible')}
                          </li>
                          <li>{t('kyc.requirement4', 'No glare or shadows covering text')}</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                    disabled={!selectedFile || !documentType || uploadMutation.isPending}
                    data-testid="button-submit-kyc"
                  >
                    {uploadMutation.isPending
                      ? t('kyc.uploading', 'Uploading...')
                      : t('kyc.submitForReview', 'Submit for Review')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {documents && documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t('kyc.submittedDocuments', 'Submitted Documents')}</CardTitle>
                <CardDescription>
                  {t('kyc.submittedDocumentsDesc', "Documents you've uploaded for verification")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        {getStatusIcon(doc.status)}

                        <div>
                          <div className="font-medium capitalize">
                            {doc.documentType.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('kyc.uploaded', 'Uploaded')}{' '}
                            {new Date(doc.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      {/* <Badge variant={getStatusBadge(doc.status).variant}>
                        {getStatusBadge(doc.status).label}
                      </Badge> */}

                      <Badge variant={getDocumentStatusBadge(doc.status).variant}>
                        {getDocumentStatusBadge(doc.status).label}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          <Dialog open={kycBlockedModal} onOpenChange={setKycBlockedModal}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>KYC Already Submitted</DialogTitle>
                <DialogDescription>
                  {user?.kycStatus === 'submitted' &&
                    'Your documents are currently under review. Please wait for verification.'}

                  {user?.kycStatus === 'pending' &&
                    'Please submit your documents once. Our team will review them shortly.'}

                  {user?.kycStatus === 'approved' &&
                    'Your KYC is already approved. No further action is required.'}

                  {user?.kycStatus === 'verified' && 'Your identity is already verified.'}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button onClick={() => setKycBlockedModal(false)}>OK</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}
     </>
    // </AccountLayout>
  );
}
