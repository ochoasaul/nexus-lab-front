import Button from '../../components/Button/Button'
import { useHome } from './useHome'

function HomePage() {
  const { hero, features } = useHome()

  return (
    <section className="page page--home">
      <div className="hero">
        <div>
          <h1>{hero.title}</h1>
          <p>{hero.subtitle}</p>
          <Button label="Ir al Dashboard" onClick={() => console.log('Go to dashboard')} />
        </div>
        <img src={hero.image} alt="React logo" />
      </div>

      <div className="features">
        {features.map((feature) => (
          <article key={feature.title}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default HomePage
