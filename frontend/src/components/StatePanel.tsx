import { AlertCircle, Loader2 } from 'lucide-react';

export function LoadingPanel({ message = 'Loading data…' }: { message?: string }) {
  return (
    <div className="status-panel flex items-center justify-center gap-3 py-10">
      <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" />
      <p className="font-medium text-muted-foreground">{message}</p>
    </div>
  );
}

export function ErrorPanel({ message }: { message: string }) {
  return (
    <div className="status-panel border-destructive/35 bg-destructive/8 text-destructive flex items-center gap-3">
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

export function EmptyPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="status-panel py-10 text-center">
      <p className="text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
