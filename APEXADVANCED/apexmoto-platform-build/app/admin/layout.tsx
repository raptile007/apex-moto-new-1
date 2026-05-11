export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // StoreProvider and Toaster are already provided by the root layout
  // No need to wrap again - this was causing nested provider issues
  return <>{children}</>
}
