import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Trophy, RefreshCw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

function Block11ResultScreen() {
  const navigate = useNavigate()
  const { gameAnswers, calculateBlock11Score } = useGame()
  
  const score = calculateBlock11Score()
  const maxScore = 1

  const results = gameAnswers.pentagonos && gameAnswers.pentagonos.length > 0 
    ? gameAnswers.pentagonos
        .filter(p => p.correct)
        .map(p => ({
          question: `Pentágono ${p.id}`,
          userAnswer: 'Posicionado corretamente',
          correctAnswer: 'Posicionado corretamente',
          isCorrect: p.correct
        }))
    : []

  const getScoreColor = () => {
    if (score === maxScore) return 'text-green-600'
    if (score >= 0.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreMessage = () => {
    if (score === maxScore) return 'Excelente! Você posicionou todos os pentágonos corretamente!'
    if (score >= 0.5) return 'Bom trabalho! Você posicionou pelo menos um pentágono corretamente!'
    return 'Continue praticando!'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-full">
              <Trophy className="w-16 h-16 text-yellow-600" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Resultado do Bloco 11
          </h2>
          
          <div className="text-center mb-8">
            <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>
              {score}/{maxScore}
            </div>
            <p className="text-gray-600 font-medium">
              {getScoreMessage()}
            </p>
          </div>
          
          {results.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-700 mb-4 text-center">Detalhes da Resposta</h3>
              
              <div className="space-y-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      result.isCorrect ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {result.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <div>
                        <p className="font-medium text-gray-700">{result.question}</p>
                        <p className="text-sm text-gray-500">
                          {result.userAnswer}
                        </p>
                      </div>
                    </div>
                    {result.isCorrect && (
                      <div className="text-right">
                        <p className="text-sm text-green-600 font-medium">
                          +0.5
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <button
            onClick={() => navigate('/resultado-combined')}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            Ver Resultado Completo
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-4">
            <button
              onClick={() => navigate('/pentagonos')}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-primary-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700"
            >
              <RefreshCw className="w-5 h-5" />
              Tentar Bloco 11 Novamente
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Block11ResultScreen