"use client";

export function PageHeader({
  title,
  description,
  compact,
}: {
  title: string;
  description?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`bg-linear-to-br from-background via-background to-primary/5 px-4 ${
        compact ? "py-12" : "py-20"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6">{title}</h1>
        {description ? (
          <p className="text-xl text-muted-foreground max-w-3xl">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

