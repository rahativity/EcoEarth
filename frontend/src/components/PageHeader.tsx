import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconTone?: string;
  badge?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  iconTone = 'text-primary',
  badge,
}: PageHeaderProps) {
  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8 border border-border/80">
      {badge ? (
        <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {badge}
        </span>
      ) : null}
      <div className="mt-3 flex items-start gap-3">
        <div className="rounded-xl bg-muted/60 p-2.5">
          <Icon className={`h-6 w-6 ${iconTone}`} aria-hidden="true" />
        </div>
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-subtitle">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}
