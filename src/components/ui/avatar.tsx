interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getBackgroundColor(name: string): string {
  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-orange-500",
    "bg-teal-500",
  ];
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
}

export function Avatar({
  src,
  alt = "",
  name = "",
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`rounded-full object-cover ${sizeStyles[size]} ${className}`}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center font-semibold text-white ${sizeStyles[size]} ${getBackgroundColor(name)} ${className}`}
    >
      {name ? getInitials(name) : "?"}
    </div>
  );
}
