// pages/Login/LoginPage.tsx
import Button from '../../components/Button/Button'
import { useLogin } from './useLogin'

function LoginPage() {
  const { values, handleChange, handleSubmit, error, isSubmitting } = useLogin()

  return (
    <section className="flex min-h-screen items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2">
          <img 
            src="/src/assets/Icons/LogoUtepsa.png" 
            alt="Logo UTEPSA" 
            className="h-24 w-24 object-contain"
          />
        </div>

        <div className="space-y-8 rounded-3xl border border-charcoal-100 bg-white p-10 pt-16 shadow-xl">
          <header className="space-y-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-primary-600">NexusLab · Control integral</p>
            <h1 className="text-3xl font-semibold text-charcoal-900">Iniciar Sesión</h1>
            <p className="text-sm text-charcoal-500">
              Ingresa tus credenciales para acceder al sistema y gestionar tu laboratorio.
            </p>
          </header>

          {error && (
            <p className="rounded-xl border border-primary-200 bg-primary-50 px-4 py-2 text-sm text-primary-800">
              {error}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <label className="block text-sm text-charcoal-600">
              Usuario
              <input
                className="mt-2 w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-3 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                placeholder="Ingresa tu usuario"
                required
              />
            </label>
            <label className="block text-sm text-charcoal-600">
              Contraseña
              <input
                className="mt-2 w-full rounded-2xl border border-charcoal-200 bg-white px-4 py-3 text-charcoal-900 placeholder:text-charcoal-400 focus:border-primary-400 focus:outline-none"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
              />
            </label>
            <Button
              type="submit"
              label="Ingresar"
              isLoadingText="Validando..."
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            />
          </form>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
