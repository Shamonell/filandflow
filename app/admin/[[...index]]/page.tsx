import dynamic from 'next/dynamic'

const AdminStudio = dynamic(() => import('./AdminStudio'), { ssr: false })

export async function generateStaticParams() {
  return [{ index: [''] }]
}

export default function AdminPage() {
  return <AdminStudio />
}


