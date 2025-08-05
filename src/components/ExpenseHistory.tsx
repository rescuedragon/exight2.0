import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, History, Plus, Edit, CreditCard, Trash2, Clock } from "lucide-react";
import { Expense } from "@/types/expense";

interface ActionLog {
  id: string;
  action: string;
  details: string;
  timestamp: Date;
  type: 'add' | 'update' | 'payment' | 'delete';
}

interface ExpenseHistoryProps {
  expenses: Expense[];
  actionLogs: ActionLog[];
  onClose: () => void;
}

export const ExpenseHistory = ({ expenses, actionLogs, onClose }: ExpenseHistoryProps) => {
  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getActionIcon = (type: ActionLog['type']) => {
    switch (type) {
      case 'add':
        return <Plus className="h-4 w-4 text-emerald-accent" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-accent" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-purple-accent" />;
      case 'delete':
        return <Trash2 className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (type: ActionLog['type']) => {
    switch (type) {
      case 'add':
        return 'bg-gradient-to-r from-emerald-accent/20 to-emerald-accent/10 text-emerald-accent border-emerald-accent/30';
      case 'update':
        return 'bg-gradient-to-r from-blue-accent/20 to-blue-accent/10 text-blue-accent border-blue-accent/30';
      case 'payment':
        return 'bg-gradient-to-r from-purple-accent/20 to-purple-accent/10 text-purple-accent border-purple-accent/30';
      case 'delete':
        return 'bg-gradient-to-r from-red-500/20 to-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gradient-to-r from-muted/20 to-muted/10 text-muted-foreground border-muted/30';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-[100] flex items-center justify-center p-4 animate-fade-in-up">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden premium-card border-border/40 shadow-premium animate-scale-in">
        <CardHeader className="flex flex-row items-center justify-between py-6 px-8 bg-gradient-to-r from-emerald-accent/5 to-blue-accent/5 border-b border-border/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/10 rounded-2xl">
              <History className="h-6 w-6 text-emerald-accent" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold text-foreground">Action History</CardTitle>
              <p className="text-muted-foreground font-medium">Complete log of all actions with timestamps</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="h-12 w-12 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="overflow-auto p-0">
          {actionLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-6 bg-gradient-to-br from-blue-accent/10 to-purple-accent/10 rounded-3xl mb-6 shadow-lg">
                <History className="h-12 w-12 text-blue-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No actions recorded yet</h3>
              <p className="text-muted-foreground text-lg max-w-md">
                All your actions like adding expenses, making payments, and updates will be logged here with timestamps
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-muted/20 to-muted/10 border-b border-border/20">
                  <TableHead className="font-bold text-foreground py-4 px-6">Action</TableHead>
                  <TableHead className="font-bold text-foreground py-4 px-4">Type</TableHead>
                  <TableHead className="font-bold text-foreground py-4 px-4">Details</TableHead>
                  <TableHead className="font-bold text-foreground py-4 px-4">Date & Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionLogs.map((log, index) => (
                  <TableRow 
                    key={log.id} 
                    className="hover:bg-gradient-to-r hover:from-blue-accent/5 hover:to-transparent transition-all duration-200 border-b border-border/10"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <TableCell className="font-bold text-foreground py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-accent/20 to-blue-accent/10 rounded-lg">
                          {getActionIcon(log.type)}
                        </div>
                        {log.action}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <span className={`px-3 py-1 border rounded-full text-xs font-medium ${getActionColor(log.type)}`}>
                        {log.type.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-4 px-4 max-w-md">
                      <div className="truncate" title={log.details}>
                        {log.details}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};