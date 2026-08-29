import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Globe, ArrowLeft, ArrowRight, Shuffle, MapPin, AlertTriangle, Loader2 } from 'lucide-react'

const paisesDistratores = [
  'Argentina', 'Estados Unidos', 'França', 'Alemanha', 'Japão',
  'China', 'Reino Unido', 'Canadá', 'Austrália', 'Brasil'
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(realCountry) {
  const distractors = paisesDistratores.filter(p => p !== realCountry).slice(0, 9)
  return shuffle([realCountry, ...distractors])
}

function CountriesScreen() {
  const navigate = useNavigate()
  const { setAnswer, gameAnswers } = useGame()
  const [selectedCountry, setSelectedCountry] = useState(null)

  // status: 'loading' | 'success' | 'error'
  const [status, setStatus] = useState(gameAnswers.paisAlvo ? 'success' : 'loading')
  const [options, setOptions] = useState(
    gameAnswers.paisAlvo ? buildOptions(gameAnswers.paisAlvo) : []
  )

  useEffect(() => {
    if (gameAnswers.paisAlvo) return 

    if (!navigator.geolocation) {
      setStatus('error')
      const fallback = 'Brasil'
      setOptions(buildOptions(fallback))
      setAnswer('paisAlvo', fallback)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
          if (!res.ok) throw new Error('geocode falhou')
          const data = await res.json()
          const realCountry = data.pais || 'Brasil'
          setOptions(buildOptions(realCountry))
          setAnswer('paisAlvo', realCountry)
          setStatus('success')
        } catch (err) {
          console.error('Erro ao determinar país pela localização:', err)
          const fallback = 'Brasil'
          setOptions(buildOptions(fallback))
          setAnswer('paisAlvo', fallback)
          setStatus('error')
        }
      },
      (err) => {
        console.error('Geolocalização recusada/falhou:', err)
        const fallback = 'Brasil'
        setOptions(buildOptions(fallback))
        setAnswer('paisAlvo', fallback)
        setStatus('error')
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setAnswer('pais', country)
  }

  const handleContinue = () => {
    if (selectedCountry !== null) {
      navigate('/estados')
    }
  }

  const handleReshuffle = () => {
    setOptions(shuffle(options))
    setSelectedCountry(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/resultado-bloco1')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Globe className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Selecione o País
            </h2>
          </div>

          {status === 'loading' && (
            <div className="flex items-center gap-2 text-gray-500 mb-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Obtendo sua localização... (o navegador pode pedir permissão)</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Não foi possível obter sua localização automaticamente (permissão negada ou indisponível).
              </p>
            </div>
          )}
          
          {status !== 'loading' && (
            <>
              <p className="text-gray-500 mb-8">
                Os países estão embaralhados. Selecione o país onde você está agora.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {options.map((country) => (
                  <button
                    key={country}
                    onClick={() => handleCountrySelect(country)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedCountry === country
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                    }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={handleReshuffle}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 border-gray-300 hover:border-primary-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700"
                >
                  <Shuffle className="w-5 h-5" />
                  Embaralhar
                </button>
                
                <button
                  onClick={handleContinue}
                  disabled={selectedCountry === null}
                  className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 2 - Pergunta</span>
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">1</span>
            <span>de 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CountriesScreen