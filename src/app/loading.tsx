export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-green-200 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-600 rounded-full border-t-transparent animate-spin" />
        </div>
        <p className="text-gray-600 mt-4">Loading...</p>
      </div>
    </div>
  );
}
