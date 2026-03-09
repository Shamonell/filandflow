'use client'

import {useMemo} from 'react'
import {NextStudio} from 'next-sanity/studio'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import product from '../../../sanity/schemas/product'
import event from '../../../sanity/schemas/event'
import workshopTemplate from '../../../sanity/schemas/workshopTemplate'

export default function AdminStudio() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

  // Mémoïser la config pour éviter les re-renders infinis
  const config = useMemo(() => {
    if (!projectId) {
      return null
    }

    return defineConfig({
      name: 'default',
      title: 'Fil & Flow',
      projectId,
      dataset,
      basePath: '/admin',
      plugins: [structureTool()],
      schema: {
        types: [product, event, workshopTemplate] as any,
      },
    })
  }, [projectId, dataset])

  if (!projectId) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Configuration manquante</h1>
        <p>NEXT_PUBLIC_SANITY_PROJECT_ID n&apos;est pas défini dans .env.local</p>
        <p>Veuillez ajouter cette variable et redémarrer le serveur.</p>
      </div>
    )
  }

  if (!config) {
    return null
  }

  return <NextStudio config={config} />
}
