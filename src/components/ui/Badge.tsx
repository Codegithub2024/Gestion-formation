type BadgeVariant = "green" | "blue" | "amber" | "red" | "gray" | "purple";

const variantMap: Record<BadgeVariant, string> = {
  green: "bg-green-100 text-green-700",
  blue: "bg-blue-100 text-blue-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  gray: "bg-neutral-100 text-neutral-600",
  purple: "bg-purple-100 text-purple-700",
};

export default function Badge({
  text,
  variant = "gray",
}: {
  text: string;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${variantMap[variant]}`}
    >
      {text}
    </span>
  );
}
