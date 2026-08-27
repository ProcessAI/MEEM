import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Map, ArrowLeft, ArrowRight, Shuffle, MapPin, AlertTriangle, Loader2 } from 'lucide-react'

// Estados "pegadinha" usados para completar as opções. O estado real
// (detectado pela localização) é adicionado a essa lista e tudo é embaralhado.
const estadosDistratores = [
  'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia', 'Paraná',
  'Rio Grande do Sul', 'Pernambuco', 'Ceará', 'Goiás', 'Distrito Federal'
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildOptions(realState) {
  const distractors = estadosDistratores.filter(e => e !== realState).slice(0, 9)
  return shuffle([realState, ...distractors])
}

function StatesScreen() {
  const navigate = useNavigate()
  const { setAnswer, gameAnswers } = useGame()
  const [selectedState, setSelectedState] = useState(null)

  // status: 'loading' | 'success' | 'error'
  const [status, setStatus] = useState(gameAnswers.estadoAlvo ? 'success' : 'loading')
  const [options, setOptions] = useState(
    gameAnswers.estadoAlvo ? buildOptions(gameAnswers.estadoAlvo) : []
  )

  useEffect(() => {
    if (gameAnswers.estadoAlvo) return // já foi determinado antes (ex: voltou nessa tela)

    if (!navigator.geolocation) {
      setStatus('error')
      const fallback = 'Distrito Federal'
      setOptions(buildOptions(fallback))
      setAnswer('estadoAlvo', fallback)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
          if (!res.ok) throw new Error('geocode falhou')
          const data = await res.json()
          const realState = data.estado || 'Distrito Federal'
          setOptions(buildOptions(realState))
          setAnswer('estadoAlvo', realState)
          setStatus('success')
        } catch (err) {
          console.error('Erro ao determinar estado pela localização:', err)
          const fallback = 'Distrito Federal'
          setOptions(buildOptions(fallback))
          setAnswer('estadoAlvo', fallback)
          setStatus('error')
        }
      },
      (err) => {
        console.error('Geolocalização recusada/falhou:', err)
        const fallback = 'Distrito Federal'
        setOptions(buildOptions(fallback))
        setAnswer('estadoAlvo', fallback)
        setStatus('error')
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleStateSelect = (state) => {
    setSelectedState(state)
    setAnswer('estado', state)
  }

  const handleContinue = () => {
    if (selectedState !== null) {
      navigate('/construcao')
    }
  }

  const handleReshuffle = () => {
    setOptions(shuffle(options))
    setSelectedState(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/paises')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Map className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Selecione o Estado
            </h2>
          </div>

          {status === 'loading' && (
            <div className="flex items-center gap-2 text-gray-500 mb-8">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Obtendo sua localização...</span>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                Não foi possível obter sua localização automaticamente.
              </p>
            </div>
          )}
          
          {status !== 'loading' && (
            <>
              <p className="text-gray-500 mb-8">
                Os estados estão embaralhados. Selecione o estado onde você está agora.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {options.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 font-medium ${
                      selectedState === state
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                    }`}
                  >
                    {state}
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
                  disabled={selectedState === null}
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
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">2</span>
            <span>de 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatesScreen