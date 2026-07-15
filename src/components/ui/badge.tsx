interface BadgeProps {
  variant:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "available"
    | "claimed"
    | "rescued"
    | "expired";
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  danger: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  available: "bg-green-100 text-green-700",
  claimed: "bg-yellow-100 text-yellow-700",
  rescued: "bg-blue-100 text-blue-700",
  expired: "bg-gray-100 text-gray-500",
};

export function Badge({ variant, children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
