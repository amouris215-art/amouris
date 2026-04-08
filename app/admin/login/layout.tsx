// Ce layout OVERRIDE le layout parent admin
// La page login admin n'a PAS de sidebar
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
