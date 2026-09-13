export function getInitials(name: string) {
  return name
    .replace(/^DEMO DATA\s*[—–-]\s*/, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
