import { useMemo } from 'react'
import logo from '../../assets/react.svg'

type HeroContent = {
  title: string
  subtitle: string
  image: string
}

type Feature = {
  title: string
  description: string
}

export function useHome(): { hero: HeroContent; features: Feature[] } {
  const hero = useMemo<HeroContent>(
    () => ({
      title: 'Bienvenido a MaquetaLab',
      subtitle: 'Estructura lista para comenzar a construir tus vistas y flujos.',
      image: logo,
    }),
    [],
  )

  const features = useMemo<Feature[]>(
    () => [
      { title: 'Componentes', description: 'Button, sidebar y hooks dedicados listos para ampliar.' },
      { title: 'Rutas', description: 'AppRouter organiza las vistas principales y layouts.' },
      { title: 'Servicios', description: 'Capa de fetch centralizada con Axios y stores de Zustand.' },
    ],
    [],
  )

  return { hero, features }
}
