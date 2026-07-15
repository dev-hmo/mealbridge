interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export function Card({
  children,
  hoverable = false,
  className = "",
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${
        hoverable
          ? "cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all"
          : ""
      } ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 border-b border-gray-100 ${className}`}>{children}</div>;
}

export function CardContent({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 border-t border-gray-100 ${className}`}>{children}</div>
  );
}
