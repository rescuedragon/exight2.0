import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail } from "lucide-react";
import { apiService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface FeedbackPayload {
  name?: string;
  email?: string;
  message: string;
}

export const FeedbackModal = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FeedbackPayload>({ message: "" });
  const { toast } = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message || form.message.trim().length < 5) {
      toast({ title: "Please add a bit more detail", description: "Message should be at least 5 characters." });
      return;
    }
    setSubmitting(true);
    try {
      await apiService.sendFeedback({
        name: form.name?.trim() || undefined,
        email: form.email?.trim() || undefined,
        message: form.message.trim(),
      });
      toast({ title: "Thanks for the feedback!", description: "We received your message at feedback@exight.in" });
      setForm({ message: "" });
      setOpen(false);
    } catch (err: any) {
      toast({
        title: "Couldn't send feedback",
        description: err?.message || "Please use feedback@exight.in to email us directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-2xl border border-border/40 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-colors"
          aria-label="Send feedback"
        >
          <Mail className="h-4 w-4" />
          <span>Feedback</span>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg w-[92vw] rounded-[28px] border border-border/40 bg-card shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-extrabold gradient-text animate-gradient-x">We'd love your feedback</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Prefer email? Write to <span className="font-semibold">feedback@exight.in</span>. If you're too lazy to open your mailbox, use this box.
          </p>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Your name (optional)</label>
              <Input
                value={form.name || ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Jane Doe"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Your email (optional)</label>
              <Input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Message</label>
            <Textarea
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Tell us what's great, what's annoying, or what you'd love to see next."
              className="mt-1 min-h-[120px]"
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {submitting ? "Sending…" : "Submit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

