import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FileText, Save, Eye, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface PrivacyPolicy {
  id: string;
  title: string;
  content: string;
  version: number;
  isActive: boolean;
  createdAt: string;
}

export default function PrivacyPolicyManagement() {
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  /* ================= FETCH ALL VERSIONS ================= */
  const { data, isLoading } = useQuery({
    queryKey: ['/api/admin/privacy-policy'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/privacy-policy');
      return res.json();
    },
  });

  const policies: PrivacyPolicy[] = data?.data || [];
  const activePolicy = policies.find((p) => p.isActive);

  /* Pre-fill editor with active version */
  useState(() => {
    if (activePolicy) {
      setTitle(activePolicy.title);
      setContent(activePolicy.content);
    }
  });

  /* ================= SAVE MUTATION ================= */
  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/privacy-policy', {
        title,
        content,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/privacy-policy'] });
      toast({
        title: 'Success',
        description: 'Privacy Policy updated successfully (new version created)',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update Privacy Policy',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!title || !content) {
      toast({
        title: 'Validation Error',
        description: 'Title and content are required',
        variant: 'destructive',
      });
      return;
    }
    saveMutation.mutate();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FileText className="h-7 w-7" />
          Privacy Policy
        </h1>
        <p className="text-muted-foreground mt-1">Manage your website privacy policy (versioned)</p>
      </div>

      {/* Main Card */}
      <Card>
        <CardHeader>
          <CardTitle>Edit Privacy Policy</CardTitle>
          <CardDescription>Saving will create a new version and activate it</CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="editor">
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="versions">Versions</TabsTrigger>
            </TabsList>

            {/* ================= EDITOR ================= */}
            <TabsContent value="editor" className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Privacy Policy"
                />
              </div>

              <div>
                {/* <label className="text-sm font-medium">Content (HTML / Markdown)</label>
                <Textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<h1>Privacy Policy</h1>..."
                /> */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Content (Privacy Policy)</label>

                  <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(_, editor) => {
                      const data = editor.getData();
                      setContent(data);
                    }}
                    config={{
                      placeholder: 'Write Privacy Policy here...',
                      toolbar: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'blockQuote',
                        'insertTable',
                        '|',
                        'undo',
                        'redo',
                      ],
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saveMutation.isPending} className="gap-2">
                  {saveMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save & Publish
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* ================= PREVIEW ================= */}
            <TabsContent value="preview">
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Live Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!content ? (
                    <p className="text-muted-foreground text-sm">Nothing to preview</p>
                  ) : (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ================= VERSIONS ================= */}
            <TabsContent value="versions">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : policies.length === 0 ? (
                <p className="text-muted-foreground">No versions found</p>
              ) : (
                <div className="space-y-2">
                  {policies.map((p) => (
                    <div
                      key={p.id}
                      className={`p-3 rounded border flex justify-between items-center ${
                        p.isActive ? 'border-green-500 bg-green-50' : 'border-muted'
                      }`}
                    >
                      <div>
                        <p className="font-medium">
                          Version {p.version} {p.isActive && '(Active)'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(p.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
