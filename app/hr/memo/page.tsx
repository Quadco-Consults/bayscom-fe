'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, FileText, AlertCircle, Search } from 'lucide-react';
import { Memo } from '@/lib/types';

export default function MemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [viewMode, setViewMode] = useState<'my-memos' | 'manager'>(
    modeParam === 'manager' ? 'manager' : 'my-memos'
  );

  // Mock current user ID
  const currentUserId = '1';

  // Mock memo data
  const [memos, setMemos] = useState<Memo[]>([
    {
      id: '1',
      title: 'Q1 Performance Review Deadline',
      content: 'All department heads are reminded to submit their Q1 performance reviews by the end of this week. Please ensure all evaluations are completed and submitted through the HR portal.',
      fromEmployeeId: '2',
      toEmployeeIds: ['1', '3', '4'],
      departmentId: '1',
      priority: 'high',
      category: 'reminder',
      status: 'sent',
      readBy: ['1'],
      createdBy: '2',
      createdAt: '2025-03-01T10:00:00Z',
      updatedAt: '2025-03-01T10:00:00Z',
    },
    {
      id: '2',
      title: 'New Safety Protocol Implementation',
      content: 'Effective immediately, all field staff must comply with the updated safety protocols as outlined in the attached document. Failure to comply may result in disciplinary action.',
      fromEmployeeId: '1',
      toEmployeeIds: ['2', '3', '4', '5'],
      departmentId: '2',
      priority: 'urgent',
      category: 'policy',
      status: 'sent',
      readBy: ['2', '3'],
      createdBy: '1',
      createdAt: '2025-02-28T14:30:00Z',
      updatedAt: '2025-02-28T14:30:00Z',
    },
    {
      id: '3',
      title: 'Team Meeting Agenda',
      content: 'The weekly team meeting is scheduled for Friday at 2 PM. Topics include project updates, budget review, and upcoming initiatives.',
      fromEmployeeId: '1',
      toEmployeeIds: ['2', '3'],
      priority: 'medium',
      category: 'meeting',
      status: 'sent',
      readBy: [],
      createdBy: '1',
      createdAt: '2025-03-02T09:15:00Z',
      updatedAt: '2025-03-02T09:15:00Z',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMemo, setSelectedMemo] = useState<Memo | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    toEmployeeIds: '',
    departmentId: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general' as Memo['category'],
    dueDate: '',
  });

  // Filter memos based on view mode
  const displayMemos = viewMode === 'my-memos'
    ? memos.filter(m => m.fromEmployeeId === currentUserId || m.toEmployeeIds.includes(currentUserId))
    : memos;

  // Apply search and filters
  const filteredMemos = displayMemos.filter(memo => {
    const matchesSearch = memo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         memo.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'all' || memo.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || memo.category === filterCategory;
    return matchesSearch && matchesPriority && matchesCategory;
  });

  // Stats calculations
  const stats = {
    total: filteredMemos.length,
    urgent: filteredMemos.filter(m => m.priority === 'urgent').length,
    unread: viewMode === 'my-memos'
      ? filteredMemos.filter(m => m.toEmployeeIds.includes(currentUserId) && !m.readBy?.includes(currentUserId)).length
      : filteredMemos.filter(m => (m.readBy?.length || 0) < m.toEmployeeIds.length).length,
    sent: viewMode === 'my-memos'
      ? filteredMemos.filter(m => m.fromEmployeeId === currentUserId).length
      : filteredMemos.filter(m => m.status === 'sent').length,
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newMemo: Memo = {
      id: String(memos.length + 1),
      title: formData.title,
      content: formData.content,
      fromEmployeeId: currentUserId,
      toEmployeeIds: formData.toEmployeeIds.split(',').map(id => id.trim()),
      departmentId: formData.departmentId || undefined,
      priority: formData.priority,
      category: formData.category,
      status: 'sent',
      dueDate: formData.dueDate || undefined,
      readBy: [],
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (selectedMemo) {
      setMemos(memos.map(m =>
        m.id === selectedMemo.id
          ? { ...m, ...newMemo, id: selectedMemo.id, createdAt: selectedMemo.createdAt }
          : m
      ));
    } else {
      setMemos([...memos, newMemo]);
    }

    handleCancel();
  };

  const handleCancel = () => {
    setIsCreateModalOpen(false);
    setSelectedMemo(undefined);
    setFormData({
      title: '',
      content: '',
      toEmployeeIds: '',
      departmentId: '',
      priority: 'medium',
      category: 'general',
      dueDate: '',
    });
  };

  const handleEdit = (memo: Memo) => {
    setSelectedMemo(memo);
    setFormData({
      title: memo.title,
      content: memo.content,
      toEmployeeIds: memo.toEmployeeIds.join(', '),
      departmentId: memo.departmentId || '',
      priority: memo.priority,
      category: memo.category,
      dueDate: memo.dueDate || '',
    });
    setIsCreateModalOpen(true);
  };

  const handleView = (memo: Memo) => {
    setSelectedMemo(memo);
    setIsViewModalOpen(true);

    // Mark as read if in my-memos mode and user is a recipient
    if (viewMode === 'my-memos' && memo.toEmployeeIds.includes(currentUserId)) {
      if (!memo.readBy?.includes(currentUserId)) {
        setMemos(memos.map(m =>
          m.id === memo.id
            ? { ...m, readBy: [...(m.readBy || []), currentUserId] }
            : m
        ));
      }
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this memo?')) {
      setMemos(memos.filter(m => m.id !== id));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'policy':
        return <AlertCircle className="h-4 w-4" />;
      case 'meeting':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {viewMode === 'my-memos' ? 'My Memos' : 'Manage Memos'}
          </h1>
          <p className="text-muted-foreground">
            {viewMode === 'my-memos'
              ? 'Create and manage your memos'
              : 'Manage all staff memos'}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Memo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Memos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.urgent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unread}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {viewMode === 'my-memos' ? 'Sent by Me' : 'Total Sent'}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Memos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search memos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="directive">Directive</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Memos Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'my-memos' ? 'My Memos' : 'All Staff Memos'}
          </CardTitle>
          <CardDescription>
            {filteredMemos.length} memo(s) found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMemos.map((memo) => {
                const isUnread = viewMode === 'my-memos'
                  ? memo.toEmployeeIds.includes(currentUserId) && !memo.readBy?.includes(currentUserId)
                  : (memo.readBy?.length || 0) < memo.toEmployeeIds.length;

                return (
                  <TableRow key={memo.id} className={isUnread ? 'font-semibold' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(memo.category)}
                        {memo.title}
                        {isUnread && (
                          <Badge variant="outline" className="ml-2">New</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{memo.category}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(memo.priority) as any}>
                        {memo.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{memo.toEmployeeIds.length} recipient(s)</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {memo.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(memo.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(memo)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(viewMode === 'manager' || memo.fromEmployeeId === currentUserId) && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(memo)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(memo.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredMemos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No memos found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Memo Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMemo ? 'Edit Memo' : 'Create New Memo'}</DialogTitle>
            <DialogDescription>
              {selectedMemo ? 'Update memo details' : 'Fill in the details to create a new memo'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content *</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="policy">Policy</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="directive">Directive</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="toEmployeeIds">To Employee IDs *</Label>
                <Input
                  id="toEmployeeIds"
                  name="toEmployeeIds"
                  value={formData.toEmployeeIds}
                  onChange={handleInputChange}
                  placeholder="1, 2, 3"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Comma-separated employee IDs
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="departmentId">Department ID</Label>
                <Input
                  id="departmentId"
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleInputChange}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedMemo ? 'Update' : 'Create'} Memo
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Memo Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMemo?.title}</DialogTitle>
            <DialogDescription>
              Created on {selectedMemo && new Date(selectedMemo.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedMemo && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={getPriorityColor(selectedMemo.priority) as any}>
                  {selectedMemo.priority}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {selectedMemo.category}
                </Badge>
                <Badge variant="outline">
                  {selectedMemo.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
                  {selectedMemo.content}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <p className="text-sm">{selectedMemo.toEmployeeIds.length} employee(s)</p>
                </div>

                {selectedMemo.dueDate && (
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <p className="text-sm">
                      {new Date(selectedMemo.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {viewMode === 'manager' && (
                <div className="space-y-2">
                  <Label>Read Status</Label>
                  <p className="text-sm">
                    {selectedMemo.readBy?.length || 0} of {selectedMemo.toEmployeeIds.length} recipients have read this memo
                  </p>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
