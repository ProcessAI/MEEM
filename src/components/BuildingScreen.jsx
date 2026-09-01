import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Building, ArrowLeft, ArrowRight, MapPin, AlertTriangle, Loader2 } from 'lucide-react'

const opcoes = [
  { value: 'Rural', label: 'Rural', icon: '🌾' },
  { value: 'Urbano', label: 'Urbano', icon: '🏙️' }
]

function BuildingScreen() {
  const navigate = useNavigate()
  const { setAnswer, gameAnswers } = useGame()
  const [selectedBuilding, setSelectedBuilding] = useState(null)

  // status: 'loading' | 'success' | 'error'
  const [status, setStatus] = useState(gameAnswers.construcaoAlvo ? 'success' : 'loading')

  useEffect(() => {
    if (gameAnswers.construcaoAlvo) return // já foi determinado antes (ex: voltou nessa tela)

    if (!navigator.geolocation) {
      setStatus('error')
      setAnswer('construcaoAlvo', 'Urbano')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          const res = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}`)
          if (!res.ok) throw new Error('geocode falhou')
          const data = await res.json()
          // Se não veio nem país, não temos endereço nenhum pra esse ponto
          // (ex: meio do oceano) — melhor avisar do que decidir "Urbano" no escuro
          if (!data.pais) throw new Error('localização sem nenhum dado de endereço')
          setAnswer('construcaoAlvo', data.tipoLocal || 'Urbano')
          setStatus('success')
        } catch (err) {
          console.error('Erro ao determinar tipo de local pela localização:', err)
          setAnswer('construcaoAlvo', 'Urbano')
          setStatus('error')
        }
      },
      (err) => {
        console.error('Geolocalização recusada/falhou:', err)
        setAnswer('construcaoAlvo', 'Urbano')
        setStatus('error')
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBuildingSelect = (building) => {
    setSelectedBuilding(building.value)
    setAnswer('construcao', building.value)
  }

  const handleContinue = () => {
    if (selectedBuilding !== null) {
      navigate('/dia-noite')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/estados')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Building className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Você está em uma zona rural ou urbana?
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
                Não foi possível obter sua localização automaticamente. Usando "Urbano" como referência padrão.
              </p>
            </div>
          )}

          {status === 'success' && (
            <p className="flex items-center gap-2 text-sm text-green-600 mb-2">
              <MapPin className="w-4 h-4" />
              Localização identificada.
            </p>
          )}

          {status !== 'loading' && (
            <>
              <p className="text-gray-500 mb-8">
                Selecione a opção correta para onde você está agora
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                {opcoes.map((building) => (
                  <button
                    key={building.value}
                    onClick={() => handleBuildingSelect(building)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 font-medium ${
                      selectedBuilding === building.value
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50 text-gray-700'
                    }`}
                  >
                    <div className="text-4xl mb-2">{building.icon}</div>
                    <div className="text-lg">{building.label}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleContinue}
                disabled={selectedBuilding === null}
                className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 2 - Pergunta</span>
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">3</span>
            <span>de 4</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingScreen