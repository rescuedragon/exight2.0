import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Plus, 
  Receipt, 
  TrendingUp, 
  Settings, 
  History,
  Search,
  Upload,
  Camera,
  PieChart,
  BarChart3,
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ArrowRight,
  Split,
  Calculator,
  Globe,
  Zap,
  Star,
  ChevronDown,
  ChevronRight,
  UserPlus,
  CreditCard,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  color: string;
}

interface Group {
  id: string;
  name: string;
  description?: string;
  members: User[];
  totalExpenses: number;
  currency: string;
  defaultSplitType: 'equal' | 'exact' | 'percentage' | 'shares';
  createdAt: Date;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  groupId?: string;
  category: string;
  date: Date;
  splitType: 'equal' | 'exact' | 'percentage' | 'shares' | 'itemized';
  splits: { userId: string; amount: number; percentage?: number; shares?: number }[];
  receipt?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
}

interface Balance {
  userId: string;
  owes: { [userId: string]: number };
  owedBy: { [userId: string]: number };
}

// Mock Data
const mockUsers: User[] = [
  { id: '1', name: 'You', email: 'you@example.com', color: '#3B82F6' },
  { id: '2', name: 'Alice Johnson', email: 'alice@example.com', color: '#10B981' },
  { id: '3', name: 'Bob Smith', email: 'bob@example.com', color: '#F59E0B' },
  { id: '4', name: 'Carol Davis', email: 'carol@example.com', color: '#EF4444' },
  { id: '5', name: 'David Wilson', email: 'david@example.com', color: '#8B5CF6' },
];

const mockGroups: Group[] = [
  {
    id: '1',
    name: 'Roommates',
    description: 'Shared apartment expenses',
    members: [mockUsers[0], mockUsers[1], mockUsers[2]],
    totalExpenses: 2450.50,
    currency: 'USD',
    defaultSplitType: 'equal',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Goa Trip 2024',
    description: 'Beach vacation with friends',
    members: [mockUsers[0], mockUsers[1], mockUsers[2], mockUsers[3]],
    totalExpenses: 8750.00,
    currency: 'INR',
    defaultSplitType: 'equal',
    createdAt: new Date('2024-02-01')
  }
];

const categories = [
  'Food & Dining', 'Transportation', 'Entertainment', 'Utilities', 
  'Groceries', 'Travel', 'Shopping', 'Healthcare', 'Other'
];

const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const TestSpace = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState<Group[]>(mockGroups);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balance[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [showReceiptUpload, setShowReceiptUpload] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [proFeaturesEnabled, setProFeaturesEnabled] = useState(true);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const AddExpenseModal = () => {
    const [expenseData, setExpenseData] = useState({
      description: '',
      amount: '',
      currency: 'USD',
      paidBy: '1',
      groupId: '',
      category: 'Food & Dining',
      splitType: 'equal' as const,
      notes: '',
      isRecurring: false,
      recurringFrequency: 'monthly' as const
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock expense creation
      const newExpense: Expense = {
        id: Date.now().toString(),
        description: expenseData.description,
        amount: parseFloat(expenseData.amount),
        currency: expenseData.currency,
        paidBy: expenseData.paidBy,
        groupId: expenseData.groupId || undefined,
        category: expenseData.category,
        date: new Date(),
        splitType: expenseData.splitType,
        splits: [], // Would be calculated based on split type
        notes: expenseData.notes,
        isRecurring: expenseData.isRecurring,
        recurringFrequency: expenseData.recurringFrequency
      };
      
      setExpenses(prev => [...prev, newExpense]);
      setShowAddExpense(false);
      setExpenseData({
        description: '',
        amount: '',
        currency: 'USD',
        paidBy: '1',
        groupId: '',
        category: 'Food & Dining',
        splitType: 'equal',
        notes: '',
        isRecurring: false,
        recurringFrequency: 'monthly'
      });
    };

    return (
      <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
        <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Add New Expense</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={expenseData.description}
                  onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What was this expense for?"
                  className="rounded-xl"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Amount *</Label>
                <div className="flex gap-2">
                  <Select value={expenseData.currency} onValueChange={(value) => setExpenseData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger className="w-24 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    value={expenseData.amount}
                    onChange={(e) => setExpenseData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    className="rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid by</Label>
                <Select value={expenseData.paidBy} onValueChange={(value) => setExpenseData(prev => ({ ...prev, paidBy: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group (Optional)</Label>
                <Select value={expenseData.groupId} onValueChange={(value) => setExpenseData(prev => ({ ...prev, groupId: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select a group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Group (1-on-1)</SelectItem>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={expenseData.category} onValueChange={(value) => setExpenseData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="splitType">Split Type</Label>
                <Select value={expenseData.splitType} onValueChange={(value: 'equal' | 'exact' | 'percentage' | 'shares' | 'itemized') => setExpenseData(prev => ({ ...prev, splitType: value }))}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equal">Split Equally</SelectItem>
                    <SelectItem value="exact">Exact Amounts</SelectItem>
                    <SelectItem value="percentage">By Percentage</SelectItem>
                    <SelectItem value="shares">By Shares</SelectItem>
                    {proFeaturesEnabled && <SelectItem value="itemized">Itemized (Pro)</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={expenseData.notes}
                onChange={(e) => setExpenseData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes..."
                className="rounded-xl"
                rows={3}
              />
            </div>

            {proFeaturesEnabled && (
              <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl">
                <Switch
                  id="recurring"
                  checked={expenseData.isRecurring}
                  onCheckedChange={(checked) => setExpenseData(prev => ({ ...prev, isRecurring: checked }))}
                />
                <Label htmlFor="recurring" className="font-medium">Make this a recurring expense</Label>
                <Badge variant="secondary" className="ml-2">Pro</Badge>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setShowAddExpense(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Add Expense
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const AddGroupModal = () => {
    const [groupData, setGroupData] = useState({
      name: '',
      description: '',
      currency: 'USD',
      defaultSplitType: 'equal' as const,
      selectedMembers: ['1'] // Always include current user
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newGroup: Group = {
        id: Date.now().toString(),
        name: groupData.name,
        description: groupData.description,
        members: users.filter(user => groupData.selectedMembers.includes(user.id)),
        totalExpenses: 0,
        currency: groupData.currency,
        defaultSplitType: groupData.defaultSplitType,
        createdAt: new Date()
      };
      
      setGroups(prev => [...prev, newGroup]);
      setShowAddGroup(false);
      setGroupData({
        name: '',
        description: '',
        currency: 'USD',
        defaultSplitType: 'equal',
        selectedMembers: ['1']
      });
    };

    return (
      <Dialog open={showAddGroup} onOpenChange={setShowAddGroup}>
        <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create New Group</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                value={groupData.name}
                onChange={(e) => setGroupData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Roommates, Trip to Paris"
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                value={groupData.description}
                onChange={(e) => setGroupData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What's this group for?"
                className="rounded-xl"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Members</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {users.map(user => (
                  <div key={user.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`member-${user.id}`}
                      checked={groupData.selectedMembers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGroupData(prev => ({
                            ...prev,
                            selectedMembers: [...prev.selectedMembers, user.id]
                          }));
                        } else if (user.id !== '1') { // Can't uncheck current user
                          setGroupData(prev => ({
                            ...prev,
                            selectedMembers: prev.selectedMembers.filter(id => id !== user.id)
                          }));
                        }
                      }}
                      disabled={user.id === '1'}
                      className="rounded"
                    />
                    <Label htmlFor={`member-${user.id}`} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: user.color }}
                      />
                      <span>{user.name}</span>
                      {user.id === '1' && <Badge variant="secondary" className="text-xs">You</Badge>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => setShowAddGroup(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                Create Group
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  const ReceiptUploadModal = () => {
    const [uploadedReceipt, setUploadedReceipt] = useState<string | null>(null);
    const [ocrResult, setOcrResult] = useState<{
      total: number;
      items: Array<{ name: string; price: number }>;
      tax: number;
      tip: number;
    } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadedReceipt(e.target?.result as string);
          // Mock OCR result
          setTimeout(() => {
            setOcrResult({
              total: 45.67,
              items: [
                { name: 'Pizza Margherita', price: 18.99 },
                { name: 'Caesar Salad', price: 12.50 },
                { name: 'Coca Cola (2x)', price: 6.00 },
                { name: 'Tiramisu', price: 8.18 }
              ],
              tax: 3.65,
              tip: 0.00
            });
          }, 2000);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <Dialog open={showReceiptUpload} onOpenChange={setShowReceiptUpload}>
        <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Camera className="h-6 w-6" />
              Upload Receipt
              <Badge variant="secondary" className="ml-2">Pro Feature</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            {!uploadedReceipt ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">Upload Receipt Image</p>
                <p className="text-gray-500 mb-4">We'll automatically extract items and amounts</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="receipt-upload"
                />
                <Label htmlFor="receipt-upload">
                  <Button type="button" className="cursor-pointer">
                    Choose File
                  </Button>
                </Label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Uploaded Receipt</h3>
                    <img 
                      src={uploadedReceipt} 
                      alt="Receipt" 
                      className="w-full h-64 object-cover rounded-xl border"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">
                      {ocrResult ? 'Scanned Results' : 'Processing...'}
                    </h3>
                    {!ocrResult ? (
                      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl">
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">Scanning receipt...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="font-semibold text-green-800">
                            Total: {formatCurrency(ocrResult.total)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">Items:</p>
                          {ocrResult.items.map((item: { name: string; price: number }, index: number) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{item.name}</span>
                              <span className="font-medium">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span>Tax:</span>
                            <span>{formatCurrency(ocrResult.tax)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {ocrResult && (
                  <div className="flex justify-end space-x-3 pt-6 border-t">
                    <Button variant="outline" onClick={() => setShowReceiptUpload(false)}>
                      Cancel
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-green-500 to-blue-500"
                      onClick={() => {
                        setShowReceiptUpload(false);
                        setShowAddExpense(true);
                      }}
                    >
                      Create Expense from Receipt
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const AnalyticsModal = () => {
    const mockChartData = {
      categories: [
        { name: 'Food & Dining', value: 1250, color: '#3B82F6' },
        { name: 'Transportation', value: 450, color: '#10B981' },
        { name: 'Entertainment', value: 320, color: '#F59E0B' },
        { name: 'Utilities', value: 280, color: '#EF4444' },
        { name: 'Other', value: 180, color: '#8B5CF6' }
      ],
      monthlyTrend: [
        { month: 'Jan', amount: 1200 },
        { month: 'Feb', amount: 1450 },
        { month: 'Mar', amount: 1100 },
        { month: 'Apr', amount: 1650 },
        { month: 'May', amount: 1380 },
        { month: 'Jun', amount: 1520 }
      ]
    };

    return (
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="fixed inset-0 z-[10000] w-full h-full bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="h-6 w-6" />
              Analytics & Insights
              <Badge variant="secondary" className="ml-2">Pro Feature</Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Spending by Category */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockChartData.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="font-medium">{formatCurrency(category.value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Monthly Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {mockChartData.monthlyTrend.map((month, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{month.month}</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 bg-blue-500 rounded"
                            style={{ width: `${(month.amount / 2000) * 100}px` }}
                          />
                          <span className="font-medium text-sm">{formatCurrency(month.amount)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">$2,480</div>
                  <div className="text-sm text-gray-500">Total Spent</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">$413</div>
                  <div className="text-sm text-gray-500">Avg per Month</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">47</div>
                  <div className="text-sm text-gray-500">Total Expenses</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                TestSpace
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Complete expense sharing system with all pro features enabled
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Switch
                  checked={proFeaturesEnabled}
                  onCheckedChange={setProFeaturesEnabled}
                />
                <Label className="text-sm font-medium">Pro Features</Label>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100">
                  <Star className="h-3 w-3 mr-1" />
                  Pro
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setShowAddExpense(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            
            <Button
              onClick={() => setShowAddGroup(true)}
              variant="outline"
              className="hover:bg-green-50 hover:border-green-300 transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              New Group
            </Button>
            
            {proFeaturesEnabled && (
              <>
                <Button
                  onClick={() => setShowReceiptUpload(true)}
                  variant="outline"
                  className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
                >
                  <Receipt className="h-4 w-4 mr-2" />
                  Upload Receipt
                  <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
                </Button>
                
                <Button
                  onClick={() => setShowAnalytics(true)}
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                  <Badge variant="secondary" className="ml-2 text-xs">Pro</Badge>
                </Button>
              </>
            )}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search expenses, groups, or friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl bg-white/50 backdrop-blur-sm border-gray-200/50"
            />
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/50 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger value="groups" className="rounded-lg">
                <Users className="h-4 w-4 mr-2" />
                Groups
              </TabsTrigger>
              <TabsTrigger value="friends" className="rounded-lg">
                <UserPlus className="h-4 w-4 mr-2" />
                Friends
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg">
                <History className="h-4 w-4 mr-2" />
                History
              </TabsTrigger>
              <TabsTrigger value="balances" className="rounded-lg">
                <Wallet className="h-4 w-4 mr-2" />
                Balances
              </TabsTrigger>
            </TabsList>

            <TabsContent value="groups" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedGroup(group)}
                  >
                    <Card className="h-full bg-white/60 backdrop-blur-sm border-gray-200/50 hover:shadow-xl transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-bold">{group.name}</CardTitle>
                            <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {group.currency}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Total Expenses</span>
                            <span className="font-bold text-lg">
                              {formatCurrency(group.totalExpenses, group.currency)}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Members:</span>
                            <div className="flex -space-x-1">
                              {group.members.slice(0, 4).map((member, idx) => (
                                <div
                                  key={member.id}
                                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                                  style={{ backgroundColor: member.color }}
                                  title={member.name}
                                >
                                  {member.name.charAt(0)}
                                </div>
                              ))}
                              {group.members.length > 4 && (
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-xs font-medium text-white">
                                  +{group.members.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                {/* Add Group Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groups.length * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card 
                    className="h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-dashed border-2 border-blue-300 hover:border-blue-400 transition-all duration-300 cursor-pointer"
                    onClick={() => setShowAddGroup(true)}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-full p-8 text-center">
                      <Plus className="h-12 w-12 text-blue-500 mb-4" />
                      <h3 className="font-semibold text-blue-700 dark:text-blue-300">Create New Group</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                        Start tracking shared expenses
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="friends" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.slice(1).map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                  >
                    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                            style={{ backgroundColor: user.color }}
                          >
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">You owe</div>
                            <div className="font-bold text-green-600">$0.00</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="space-y-4">
                {expenses.length === 0 ? (
                  <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
                    <CardContent className="p-12 text-center">
                      <Receipt className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No expenses yet</h3>
                      <p className="text-gray-500 mb-4">Start by adding your first expense</p>
                      <Button onClick={() => setShowAddExpense(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Expense
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  expenses.map((expense, index) => (
                    <motion.div
                      key={expense.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Receipt className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{expense.description}</h3>
                                <p className="text-sm text-gray-500">
                                  {expense.category} • {expense.date.toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                {formatCurrency(expense.amount, expense.currency)}
                              </div>
                              <div className="text-sm text-gray-500">
                                Paid by {users.find(u => u.id === expense.paidBy)?.name}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="balances" className="space-y-6">
              <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Your Balances
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-2xl font-bold text-green-600">$0.00</div>
                        <div className="text-sm text-green-700">You are owed</div>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-xl">
                        <div className="text-2xl font-bold text-red-600">$0.00</div>
                        <div className="text-sm text-red-700">You owe</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-2xl font-bold text-blue-600">$0.00</div>
                        <div className="text-sm text-blue-700">Net balance</div>
                      </div>
                    </div>
                    
                    <div className="text-center py-8">
                      <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-500">All settled up! 🎉</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Modals */}
        <AddExpenseModal />
        <AddGroupModal />
        <ReceiptUploadModal />
        <AnalyticsModal />

        {/* Pro Features Banner */}
        {proFeaturesEnabled && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  <div>
                    <div className="font-semibold">Pro Features Active</div>
                    <div className="text-xs opacity-90">All premium features unlocked</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TestSpace;