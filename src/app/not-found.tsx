import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you&apos;re looking for doesn&apos; exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/feed"
            className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Browse Food
          </Link>
        </div>
      </div>
    </div>
  );
}
