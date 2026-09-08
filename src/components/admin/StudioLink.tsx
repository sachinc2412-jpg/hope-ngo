/** Deep-link into Sanity Studio to edit a specific doc (intent link). */
export function StudioLink({
  id,
  label = "Edit in Studio",
}: {
  id?: string;
  type?: string;
  label?: string;
}) {
  const href = id ? `/studio/intent/edit/id=${id}` : "/studio";
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-accent font-sans text-sm underline underline-offset-2"
    >
      {label} &rarr;
    </a>
  );
}
