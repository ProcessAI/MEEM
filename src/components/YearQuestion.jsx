import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react'

function YearQuestion() {
  const navigate = useNavigate()
  const { setAnswer } = useGame()
  const [year, setYear] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYear(value)
    if (error) setError('')
  }

  const handleContinue = () => {
    const yearNum = parseInt(year)
    if (!year || year.length < 4 || yearNum < 1900 || yearNum > 2100) {
      setError('Por favor, insira um ano válido (4 dígitos)')
      return
    }
    setAnswer('ano', yearNum)
    navigate('/dia-mes')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/dias-embaralhados')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Calendar className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Em que ano estamos?
            </h2>
          </div>
          
          <p className="text-gray-500 mb-8">
            Digite o ano atual
          </p>
          
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ano
            </label>
            <input
              type="text"
              value={year}
              onChange={handleChange}
              className={`w-full px-6 py-4 text-2xl text-center border-2 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder=""
              maxLength={4}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!year || year.length < 4}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Pergunta</span>
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">3</span>
            <span>de 5</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YearQuestion
