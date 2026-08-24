import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { Image as ImageIcon, ArrowLeft, ArrowRight } from 'lucide-react'

function ImageIdentification4() {
  const navigate = useNavigate()
  const { setAnswer } = useGame()
  const [selectedImage, setSelectedImage] = useState(null)

  const images = [
    { id: 'papel_chao', emoji: '📄', name: 'Papel no chão' },
    { id: 'papel_mesa', emoji: '🪑', name: 'Papel na mesa' },
    { id: 'papel_cadeira', emoji: '�️', name: 'Papel na cadeira' },
    { id: 'papel_arvore', emoji: '🌳', name: 'Papel na árvore' },
    { id: 'papel_geladeira', emoji: '🧊', name: 'Papel na geladeira' }
  ]

  const [shuffledImages, setShuffledImages] = useState(() => {
    const shuffled = [...images]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  })

  const handleImageSelect = (image) => {
    setSelectedImage(image.id)
  }

  const handleContinue = () => {
    if (selectedImage) {
      setAnswer('imagem4', selectedImage)
      navigate('/fala2')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/imagem3')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-primary-100 p-3 rounded-xl">
              <ImageIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Identifique o Papel 
            </h2>
          </div>
          
          <p className="text-gray-500 mb-8">
            Selecione a imagem que representa o papel dobrado
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {shuffledImages.map((image) => (
              <button
                key={image.id}
                onClick={() => handleImageSelect(image)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center ${
                  selectedImage === image.id
                    ? 'border-primary-500 bg-primary-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                }`}
              >
                <span className="text-6xl">{image.emoji}</span>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleContinue}
            disabled={!selectedImage}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            Continuar
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 8 - Identificação de Imagens</span>
            <span className="bg-primary-100 text-primary-600 px-3 py-1 rounded-full font-medium">2</span>
            <span>de 3</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageIdentification4
