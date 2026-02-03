import { useState, useEffect, useRef } from 'react';
import {
  Send,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Headphones,
  Plus,
  Mail,
  MessageCircle,
  BookOpen,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useTranslation } from '@/contexts/TranslationContext';
import { connectSocket } from '@/socket/socket';

interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: string;
  senderName: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  userId: string;
  userName: string;
  assignedToName?: string | null;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

export default function AccountSupport() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  interface PaginatedTickets {
    data: Ticket[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }

  const [createFormData, setCreateFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
  });

  // Fetch user's tickets - uses default queryFn which handles standardized API responses
  // API returns tickets array directly (unwrapped from {success, data})
  const {
    data: ticketsResponse,
    refetch: refetchTickets,
    isLoading,
  } = useQuery<PaginatedTickets>({
    queryKey: ['/api/customer/tickets', page, limit],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/customer/tickets?page=${page}&limit=${limit}`);
      const json = await res.json();
      return json.data;
    },
    keepPreviousData: true,
  });

  useEffect(() => {
    setPage(1);
  }, [limit]);

  // Filter tickets by status on client side
  // const tickets: Ticket[] = (ticketsRaw || []).filter(t =>
  //   statusFilter === "all" ? true : t.status === statusFilter
  // );

  const ticketsRaw = ticketsResponse?.data || [];

  const tickets: Ticket[] = ticketsRaw.filter((t) =>
    statusFilter === 'all' ? true : t.status === statusFilter,
  );

  const totalPages = ticketsResponse?.pagination.totalPages || 1;

  // Build detail URL - only construct when we have a valid ID
  const ticketDetailUrl = selectedTicketId ? `/api/ticket/${selectedTicketId}` : null;

  const { data: replies } = useQuery<Message[]>({
    queryKey: ['/api/customer/tickets/replies', selectedTicketId],
    enabled: !!selectedTicketId,
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/customer/tickets/${selectedTicketId}/replies`);
      const json = await res.json();
      return json.data;
    },
  });

  // Fetch single ticket with messages - uses default queryFn
  // API returns single ticket object with messages
  const { data: ticketDetails, refetch: refetchTicketDetails } = useQuery<Ticket>({
    queryKey: [ticketDetailUrl],
    enabled: !!ticketDetailUrl,
  });

  useEffect(() => {
    if (replies) {
      setLiveMessages(replies);
    }
  }, [replies]);

  useEffect(() => {
    if (!selectedTicketId) return;

    const socket = connectSocket();

    // 🔌 join ticket room
    socket.emit('join_ticket', { ticketId: selectedTicketId });

    // 📩 receive realtime messages
    socket.on('ticket_message', (data) => {
      /*
      {
        ticketId,
        replyId,
        senderType: "user" | "admin",
        message,
        createdAt
      }
    */

      // prevent duplicates
      setLiveMessages((prev) => {
        const exists = prev.some((m) => m.id === data.replyId);
        if (exists) return prev;

        return [
          ...prev,
          {
            id: data.replyId,
            ticketId: data.ticketId,
            senderId: '',
            senderType: data.senderType,
            senderName: data.senderType === 'admin' ? 'Support' : 'You',
            message: data.message,
            isInternal: false,
            createdAt: data.createdAt,
          },
        ];
      });
    });

    return () => {
      socket.emit('leave_ticket', { ticketId: selectedTicketId });
      socket.off('ticket_message');
    };
  }, [selectedTicketId]);

  // Create ticket mutation
  const createTicketMutation = useMutation({
    mutationFn: async (data: typeof createFormData) => {
      const res = await apiRequest('POST', '/api/customer/tickets', data);
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to create ticket');
      return json;
    },
    onSuccess: () => {
      refetchTickets();
      toast({ title: 'Success', description: 'Ticket created successfully' });
      setShowCreateDialog(false);
      setCreateFormData({ title: '', description: '', priority: 'medium' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create ticket',
        variant: 'destructive',
      });
    },
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: async ({ ticketId, message }: { ticketId: string; message: string }) => {
      const res = await apiRequest('POST', `/api/customer/tickets/${ticketId}/reply`, {
        message,
        isInternal: false,
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Failed to send message');
      return json;
    },
    onSuccess: () => {
      refetchTickets();
      refetchTicketDetails();
      setNewMessage('');
      toast({ title: 'Success', description: 'Message sent successfully' });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    },
  });

  const handleCreateTicket = () => {
    if (!createFormData.title || !createFormData.description) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    createTicketMutation.mutate(createFormData);
  };

  const handleSendMessage = () => {
    if (!selectedTicketId || !newMessage.trim()) return;
    addMessageMutation.mutate({
      ticketId: selectedTicketId,
      message: newMessage.trim(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'closed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveMessages]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" data-testid="text-support-title">
            {t?.('support.myTickets', 'My Support Tickets')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t?.('support.manageTickets', 'Track and manage your support requests')}
          </p>
        </div>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
          data-testid="button-new-ticket"
        >
          <Plus className="w-4 h-4" />
          {t?.('support.createTicket', 'New Ticket')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card data-testid="card-stat-open">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <h3 className="text-2xl font-bold mt-1" data-testid="text-count-open">
                  {tickets?.filter((t) => t.status === 'open').length || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-in-progress">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold mt-1" data-testid="text-count-in-progress">
                  {tickets?.filter((t) => t.status === 'in_progress').length || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-resolved">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <h3 className="text-2xl font-bold mt-1" data-testid="text-count-resolved">
                  {tickets?.filter((t) => t.status === 'resolved').length || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-stat-total">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <h3 className="text-2xl font-bold mt-1" data-testid="text-count-total">
                  {tickets?.length || 0}
                </h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tickets List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Status Filter */}

          <div className="flex items-center gap-3 mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg bg-background text-sm"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="px-2 py-2 border rounded-lg text-sm bg-background"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Tickets */}
          {isLoading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-muted-foreground">Loading tickets...</div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={`cursor-pointer transition-all border hover:border-orange-400 ${
                    selectedTicketId === ticket.id ? 'ring-2 ring-orange-500 bg-orange-50/30' : ''
                  }`}
                  data-testid={`card-ticket-${ticket.id}`}
                >
                  <CardContent className="p-4 space-y-2">
                    {/* Status Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(ticket.status)}
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}
                        >
                          {ticket.status.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-medium text-sm line-clamp-2">{ticket.title}</h3>

                    {/* Footer */}
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Updated {new Date(ticket.updatedAt).toLocaleTimeString()}</span>

                      {ticket.assignedToName && (
                        <span className="text-orange-600 font-medium">{ticket.assignedToName}</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {tickets.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Headphones className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tickets found</h3>
                    <p className="text-muted-foreground mb-4">
                      {statusFilter !== 'all'
                        ? 'Try adjusting your filter'
                        : 'Create your first support ticket'}
                    </p>
                    <Button
                      onClick={() => setShowCreateDialog(true)}
                      className="gap-2 bg-teal-500 hover:bg-teal-600 text-white"
                      data-testid="button-create-first-ticket"
                    >
                      <Plus className="w-4 h-4" />
                      Create Ticket
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              Page <span className="font-medium">{page}</span> of {totalPages}
            </span>

            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Ticket Details */}
        <div className="lg:col-span-2">
          {selectedTicketId && selectedTicket ? (
            <Card className="sticky top-6">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3 flex-wrap">
                    <CardTitle>{selectedTicket.title}</CardTitle>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTicket.status)}`}
                    >
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refetchTicketDetails()}
                    className="gap-2"
                    data-testid="button-refresh-ticket"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Created:</span>
                    <div className="font-medium mt-1">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Priority:</span>
                    <div className="mt-1">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}
                      >
                        {selectedTicket.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-lg border bg-muted/30 p-4">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">
                    Description
                  </span>
                  <p className="mt-2 text-sm whitespace-pre-wrap leading-relaxed">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Conversation */}
                <div className="border-t pt-6 flex flex-col h-[500px]">
                  <h3 className="font-medium mb-3">Conversation</h3>

                  <div className="flex-1 space-y-4 overflow-y-auto px-1 pr-2 mb-4">
                    {!liveMessages || liveMessages.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-12">
                        No messages yet. Start the conversation!
                      </p>
                    ) : (
                      liveMessages.map((msg: Message) => {
                        const isUser = msg.senderType === 'user';

                        return (
                          <div
                            key={msg.id}
                            className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                                isUser
                                  ? 'bg-orange-500 text-white rounded-br-sm'
                                  : 'bg-muted text-foreground rounded-bl-sm'
                              }`}
                            >
                              {/* Header */}
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium opacity-80">
                                  {msg.senderName}
                                </span>

                                {!isUser && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500">
                                    Support
                                  </span>
                                )}
                              </div>

                              {/* Message */}
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {msg.message}
                              </p>

                              {/* Time */}
                              <div className="text-[10px] text-right mt-1 opacity-60">
                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Reply Box */}
                  <div className="border-t pt-3 flex items-end gap-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1 resize-none rounded-xl"
                      rows={2}
                    />

                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || addMessageMutation.isPending}
                      className="h-10 px-4 rounded-xl bg-teal-500 hover:bg-teal-600 text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Headphones className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No ticket selected</h3>
                <p className="text-muted-foreground mb-4">
                  Select a ticket from the list to view details and conversation
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Contact Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-email-support">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <Mail className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="font-medium mb-1">Email Support</div>
            <div className="text-sm text-muted-foreground">support@esim-global.com</div>
          </CardContent>
        </Card>
        <Card data-testid="card-live-chat">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="font-medium mb-1">Live Chat</div>
            <div className="text-sm text-muted-foreground">Available 24/7</div>
          </CardContent>
        </Card>
        <Card data-testid="card-help-center">
          <CardContent className="pt-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="font-medium mb-1">Help Center</div>
            <div className="text-sm text-muted-foreground">Browse FAQs & Guides</div>
          </CardContent>
        </Card>
      </div>

      {/* Create Ticket Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Support Ticket</DialogTitle>
            <DialogDescription>
              Describe your issue and we'll get back to you as soon as possible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={createFormData.title}
                onChange={(e) => setCreateFormData({ ...createFormData, title: e.target.value })}
                placeholder="Brief description of your issue"
                className="mt-1"
                data-testid="input-ticket-title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={createFormData.description}
                onChange={(e) =>
                  setCreateFormData({ ...createFormData, description: e.target.value })
                }
                placeholder="Please provide detailed information about your issue"
                rows={5}
                className="mt-1"
                data-testid="input-ticket-description"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                value={createFormData.priority}
                onChange={(e) =>
                  setCreateFormData({
                    ...createFormData,
                    priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent',
                  })
                }
                className="w-full px-4 py-2 mt-1 border rounded-md bg-background"
                data-testid="select-ticket-priority"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              data-testid="button-cancel-ticket"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTicket}
              disabled={createTicketMutation.isPending}
              className="bg-teal-500 hover:bg-teal-600 text-white"
              data-testid="button-submit-ticket"
            >
              {createTicketMutation.isPending ? 'Creating...' : 'Create Ticket'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
