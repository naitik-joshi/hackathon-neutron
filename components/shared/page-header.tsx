export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="mb-8 max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 text-4xl md:text-5xl">{title}</h1>
      <p className="mt-4 text-lg text-slate-600">{description}</p>
    </header>
  );
}
