import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  Loader2,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  ListOrdered,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/* ✅ TipTap */
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface Page {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function PageManagement() {
  const { toast } = useToast();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: false,
  });

  /* ================= TipTap Editor ================= */
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    if (!showAddDialog && !editingPage) {
      editor?.commands.clearContent();
    }
  }, [showAddDialog, editingPage]);

  /* ---------------- FETCH PAGES ---------------- */
  const { data, isLoading } = useQuery({
    queryKey: ['/api/pages'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/pages');
      return res.json();
    },
  });

  const pages = data?.data || [];

  /* ---------------- MUTATIONS ---------------- */
  const addPageMutation = useMutation({
    mutationFn: async (payload: typeof formData) => {
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to create page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      resetForm();
      setShowAddDialog(false);
      toast({ title: 'Success', description: 'Page created successfully' });
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: typeof formData }) => {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update page');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      resetForm();
      setEditingPage(null);
      toast({ title: 'Success', description: 'Page updated successfully' });
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => apiRequest('DELETE', `/api/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({ title: 'Deleted', description: 'Page deleted successfully' });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['/api/pages'] }),
  });

  /* ---------------- HELPERS ---------------- */
  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      metaTitle: '',
      metaDescription: '',
      isPublished: false,
    });
  };

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const openEditDialog = (page: Page) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaTitle: page.metaTitle || '',
      metaDescription: page.metaDescription || '',
      isPublished: page.isPublished,
    });

    setTimeout(() => {
      editor?.commands.setContent(page.content || '');
    }, 0);
  };

  /* ================= UI ================= */
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Page Management</h1>
          <p className="text-muted-foreground">Manage static CMS pages</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Page
        </Button>
      </div>

      {/* TABLE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <FileText className="h-5 w-5" /> Pages
          </CardTitle>
          <CardDescription>All static pages</CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page: Page) => (
                  <TableRow key={page.id}>
                    <TableCell>{page.title}</TableCell>
                    <TableCell>/{page.slug}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={page.isPublished}
                          onCheckedChange={(checked) =>
                            togglePublishMutation.mutate({
                              id: page.id,
                              isPublished: checked,
                            })
                          }
                        />
                        <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                          {page.isPublished ? (
                            <>
                              <Eye className="h-3 w-3 mr-1" /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" /> Draft
                            </>
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(page.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(page)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePageMutation.mutate(page.id)}
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

      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={showAddDialog || !!editingPage}
        onOpenChange={() => {
          setShowAddDialog(false);
          setEditingPage(null);
          resetForm();
          editor?.commands.clearContent();
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? 'Edit Page' : 'Add Page'}</DialogTitle>
            <DialogDescription>Manage page content & SEO</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Page Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                    slug: generateSlug(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <Label>URL Slug *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            {/* TipTap Editor */}
            <div>
              <Label>Page Content *</Label>

              <div className="border rounded-md">
                {/* Toolbar */}
                <div className="flex gap-2 border-b p-2 bg-muted">
                  <Button size="icon" variant="ghost" onClick={() => editor?.chain().focus().toggleBold().run()}>
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => editor?.chain().focus().toggleItalic().run()}>
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    <List className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                    <ListOrdered className="h-4 w-4" />
                  </Button>
                </div>

                <EditorContent
                  editor={editor}
                  className="min-h-[300px] p-3 prose max-w-none"
                />
              </div>
            </div>

            <div>
              <Label>Meta Title</Label>
              <Input
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
              />
            </div>

            <div>
              <Label>Meta Description</Label>
              <textarea
                className="w-full border rounded-md p-2 text-sm"
                rows={3}
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
              />
              <Label>Publish immediately</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() =>
                editingPage
                  ? updatePageMutation.mutate({
                      id: editingPage.id,
                      payload: formData,
                    })
                  : addPageMutation.mutate(formData)
              }
            >
              {editingPage ? 'Update Page' : 'Create Page'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
