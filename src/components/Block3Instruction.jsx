import { useNavigate } from 'react-router-dom'
import { ArrowRight, Volume2 } from 'lucide-react'

function Block3Instruction() {
  const navigate = useNavigate()

  const speakCommand = () => {
    const utterance = new SpeechSynthesisUtterance('Leia, e memorize as seguintes palavras: Anzol, Ralo e Pote')
    utterance.lang = 'pt-BR'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/resultado-bloco2')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2 rotate-180" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Volume2 className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Bloco 3 - Memória de Palavras
            </h2>
          </div>
          
          <p className="text-gray-500 mb-8">
            Siga o comando abaixo
          </p>
          
          <div className="bg-gradient-to-r from-violet-50 to-purple-100 rounded-2xl p-4 sm:p-8 mb-8 text-center">
            <button
              onClick={speakCommand}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
            >
              <Volume2 className="w-6 h-6" />
              <span className="font-medium">Ouvir o comando</span>
            </button>
            <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              "Leia, e memorize as seguintes palavras:"
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-8 mt-6">
              <div className="bg-white rounded-xl px-5 py-3 sm:px-8 sm:py-4 shadow-md">
                <p className="text-xl sm:text-3xl font-bold text-primary-600">Anzol</p>
              </div>
              <div className="bg-white rounded-xl px-5 py-3 sm:px-8 sm:py-4 shadow-md">
                <p className="text-xl sm:text-3xl font-bold text-primary-600">Ralo</p>
              </div>
              <div className="bg-white rounded-xl px-5 py-3 sm:px-8 sm:py-4 shadow-md">
                <p className="text-xl sm:text-3xl font-bold text-primary-600">Pote</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/word-recall-1')}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 3 - Instrução</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Block3Instruction