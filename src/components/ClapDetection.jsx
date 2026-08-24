import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Mic, ArrowLeft, ArrowRight, Volume2 } from 'lucide-react'

function ClapDetection() {
  const navigate = useNavigate()
  const { setAnswer } = useGame()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  const errorMessages = {
    'not-allowed': 'Permissão de microfone negada. Libere o acesso ao microfone nas configurações do navegador.',
    'service-not-allowed': 'O navegador bloqueou o microfone.',
    'no-speech': 'Nenhuma fala foi detectada. Tente novamente.',
    'audio-capture': 'Nenhum microfone foi encontrado neste dispositivo.',
    'network': 'Erro de conexão com o serviço de reconhecimento de voz. Verifique sua internet.',
  }

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setIsSupported(false)
    }
  }, [])

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    setErrorMsg('')
    const recognition = new SpeechRecognition()
    recognition.lang = 'pt-BR'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript
      setTranscript(speechResult)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setErrorMsg(errorMessages[event.error] || `Não foi possível usar o microfone (erro: ${event.error}).`)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const handleContinue = () => {
    setAnswer('palmas', transcript)
    navigate('/resultado-bloco9')
  }

  const speakCommand = () => {
    const utterance = new SpeechSynthesisUtterance('Leia com os olhos, e diga Lalalala')
    utterance.lang = 'pt-BR'
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/resultado-bloco8')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <Mic className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Diga "Lalalala"
            </h2>
          </div>
          
          <p className="text-gray-500 mb-8">
            Siga o comando abaixo
          </p>
          
          <div className="bg-gradient-to-r from-violet-50 to-purple-100 rounded-2xl p-8 mb-8 text-center">
            <button
              onClick={speakCommand}
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-primary-600 transition-colors mb-4"
            >
              <Volume2 className="w-6 h-6" />
              <span className="font-medium">Ouvir o comando</span>
            </button>
            <p className="text-2xl font-bold text-gray-800">
              "Leia com os olhos, e diga Lalalala"
            </p>
          </div>
          
          {!isSupported && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <p className="text-red-700 text-center">
                Seu navegador não suporta reconhecimento de voz. Por favor, use o Chrome ou Edge.
              </p>
            </div>
          )}

          {errorMsg && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-700 text-center text-sm">{errorMsg}</p>
            </div>
          )}
          
          <button
            onClick={startListening}
            disabled={isListening || !isSupported}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-semibold shadow-lg transition-all duration-300 text-lg mb-6 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Mic className={`w-6 h-6 ${isListening ? 'animate-pulse' : ''}`} />
            {isListening ? 'Ouvindo...' : 'Clique para Falar'}
          </button>
          
          {transcript && (
            <div className="bg-gray-50 rounded-xl p-4 mb-8">
              <p className="text-sm text-gray-500 mb-1">Você disse:</p>
              <p className="text-lg font-medium text-gray-800">{transcript}</p>
            </div>
          )}
          
          <button
            onClick={handleContinue}
            disabled={!transcript}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Ver Resultado do Bloco 9
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 9 - Reconhecimento de Fala</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClapDetection