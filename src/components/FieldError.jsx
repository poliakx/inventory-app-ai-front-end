export function FieldError({ error }) {
  if (!error) return null;
  return <p className="text-sm text-destructive">{error.message}</p>;
}
