export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout without authentication checks
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 