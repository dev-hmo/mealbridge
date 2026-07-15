export const dynamic = "force-dynamic";

export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-600">Signing you in...</p>
      </div>
    </div>
  );
}
