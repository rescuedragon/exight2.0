import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Loan, Currency } from "@/types/loan";
import { useToast } from "@/hooks/use-toast";

interface AddLoanModalProps {
  onAddLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'payments' | 'totalReceived' | 'remainingAmount' | 'status'>) => void;
  existingPersons: string[];
}

export const AddLoanModal = ({ onAddLoan, existingPersons }: AddLoanModalProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    personName: '',
    amount: '',
    currency: 'INR' as Currency,
    dateGiven: new Date().toISOString().split('T')[0],
    description: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.personName || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "Amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    const loanData = {
      personName: formData.personName.trim(),
      amount,
      currency: formData.currency,
      dateGiven: new Date(formData.dateGiven),
      description: formData.description.trim() || undefined
    };

    onAddLoan(loanData);

    setFormData({
      personName: '',
      amount: '',
      currency: 'INR',
      dateGiven: new Date().toISOString().split('T')[0],
      description: ''
    });
    
    setOpen(false);
    toast({
      title: "Success",
      description: "Loan entry added successfully!"
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          size="lg" 
          className="gap-3 rounded-full px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          onClick={() => setOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px] w-[90vw] max-h-[90vh] overflow-y-auto premium-card border-border/40 shadow-premium">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Loan Entry</DialogTitle>
          <p className="text-muted-foreground">Record money you've lent to someone</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="personName" className="text-sm font-semibold text-foreground">Person Name *</Label>
                <div className="relative">
                  <Input
                    id="personName"
                    list="existing-persons"
                    value={formData.personName}
                    onChange={(e) => setFormData(prev => ({ ...prev, personName: e.target.value }))}
                    placeholder="e.g., John Doe"
                    className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-emerald-accent/20"
                  />
                  <datalist id="existing-persons">
                    {existingPersons.map((person, index) => (
                      <option key={index} value={person} />
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-semibold text-foreground">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="10000"
                    className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-emerald-accent/20"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="currency" className="text-sm font-semibold text-foreground">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value: Currency) => setFormData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger className="bg-background border-border/40 rounded-xl h-12 text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="premium-card border-border/40">
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="dateGiven" className="text-sm font-semibold text-foreground">Date Given</Label>
                <Input
                  id="dateGiven"
                  type="date"
                  value={formData.dateGiven}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateGiven: e.target.value }))}
                  className="bg-background border-border/40 rounded-xl h-12 text-lg focus:ring-2 focus:ring-emerald-accent/20"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-semibold text-foreground">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Purpose of the loan, additional notes..."
                  className="bg-background border-border/40 rounded-xl focus:ring-2 focus:ring-emerald-accent/20"
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-border/20">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-full px-8 h-12">
              Cancel
            </Button>
            <Button type="submit" className="rounded-full px-8 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Add Loan Entry
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};