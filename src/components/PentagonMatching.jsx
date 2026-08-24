import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGame } from '../context/GameContext'
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react'

// Espaço de desenho fixo (coordenadas internas). O SVG escala isso
// automaticamente para caber em qualquer largura de tela via viewBox.
// Proporção mais "larga e baixa" para caber na tela sem precisar rolar.
const CANVAS_WIDTH = 650
const CANVAS_HEIGHT = 370

function PentagonMatching() {
  const navigate = useNavigate()
  const { setAnswer } = useGame()
  const svgRef = useRef(null)

  // Pentagon SVG path
  const pentagonPath = "M 50 0 L 95 35 L 80 90 L 20 90 L 5 35 Z"

  // Shadow positions (overlapped)
  const shadows = [
    { id: 'shadow1', x: 150, y: 30, rotation: 0 },
    { id: 'shadow2', x: 200, y: 50, rotation: 0 }
  ]

  // Slots de posição fixos no espaço de desenho (embaralhados a cada jogada)
  // Organizados em 2 fileiras de 4, de forma compacta, pra tudo caber na tela
  const positionSlots = [
    { x: 30, y: 160 },
    { x: 175, y: 160 },
    { x: 320, y: 160 },
    { x: 465, y: 160 },
    { x: 30, y: 260 },
    { x: 175, y: 260 },
    { x: 320, y: 260 },
    { x: 465, y: 260 }
  ]
  const decoyRotations = [40, 80, 120, 160, 200, 240, 280, 320]

  const shuffleArray = (arr) => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  // Gera um novo desafio: sorteia quais 2 das 8 peças são as certas (rotação 0),
  // embaralha as rotações das demais (pegadinhas) e embaralha as posições iniciais
  const generatePentagons = () => {
    const ids = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8']
    const shuffledIds = shuffleArray(ids)
    const correctIds = shuffledIds.slice(0, 2)
    const shuffledRotations = shuffleArray(decoyRotations)
    const shuffledPositions = shuffleArray(positionSlots)

    let decoyIndex = 0
    return ids.map((id, index) => {
      const isCorrect = correctIds.includes(id)
      return {
        id,
        x: shuffledPositions[index].x,
        y: shuffledPositions[index].y,
        rotation: isCorrect ? 0 : shuffledRotations[decoyIndex++],
        isCorrect,
        inShadow: null
      }
    })
  }

  // Draggable pentagons (8 total, 2 sorteados a cada jogada para se encaixarem)
  const [pentagons, setPentagons] = useState(() => generatePentagons())

  const [draggedPentagon, setDraggedPentagon] = useState(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Converte a posição do ponteiro (tela) para coordenadas do espaço de
  // desenho (650x440), levando em conta a escala aplicada pelo viewBox.
  // Isso é o que faz o arraste funcionar certinho em qualquer tamanho de tela.
  const getCanvasPoint = (e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const scaleX = CANVAS_WIDTH / rect.width
    const scaleY = CANVAS_HEIGHT / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const handlePointerDown = (e, pentagon) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    const point = getCanvasPoint(e)
    setDraggedPentagon(pentagon)
    setDragOffset({
      x: point.x - pentagon.x,
      y: point.y - pentagon.y
    })
  }

  const handlePointerMove = (e) => {
    if (!draggedPentagon) return
    e.preventDefault()

    const point = getCanvasPoint(e)
    const newX = point.x - dragOffset.x
    const newY = point.y - dragOffset.y

    setPentagons(prev => prev.map(p =>
      p.id === draggedPentagon.id
        ? { ...p, x: newX, y: newY, inShadow: null }
        : p
    ))
  }

  const handlePointerUp = (e) => {
    if (!draggedPentagon) return

    // Check if pentagon is dropped in a shadow
    const pentagon = pentagons.find(p => p.id === draggedPentagon.id)
    if (!pentagon) {
      setDraggedPentagon(null)
      return
    }

    let inShadow = null
    shadows.forEach(shadow => {
      const dx = Math.abs(pentagon.x - shadow.x)
      const dy = Math.abs(pentagon.y - shadow.y)
      // More flexible tolerance (50px instead of 30px)
      if (dx < 50 && dy < 50) {
        inShadow = shadow.id
      }
    })

    setPentagons(prev => prev.map(p =>
      p.id === draggedPentagon.id
        ? { ...p, inShadow }
        : p
    ))

    setDraggedPentagon(null)
  }

  const handleReset = () => {
    setPentagons(generatePentagons())
  }

  const handleValidate = () => {
    // Peça é considerada certa se era uma das sorteadas como correta E foi
    // realmente encaixada numa sombra (não basta ter rotação 0 por acaso)
    const results = pentagons.map(p => ({
      id: p.id,
      correct: p.isCorrect && p.inShadow !== null
    }))

    setAnswer('pentagonos', results)
    navigate('/resultado-bloco11')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-5 sm:p-8 md:p-10">
          <button
            onClick={() => navigate('/resultado-bloco10')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
            Encaixe os Pentágonos
          </h2>

          <p className="text-gray-500 text-center mb-2 text-sm sm:text-base">
            Arraste os pentágonos para as sombras correspondentes
          </p>
          <p className="text-xs text-gray-400 text-center mb-6 px-2">
            Apenas 2 das 8 peças se encaixam corretamente nas sombras — as outras são "pegadinhas" e não têm sombra correspondente, isso é proposital.
          </p>

          {/* Canvas responsivo: um único SVG com viewBox, escala automaticamente
              para caber na tela (celular ou computador) sem cortar nenhuma peça */}
          <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl mb-6 overflow-hidden">
            <svg
              ref={svgRef}
              viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
              className="w-full h-auto block"
              style={{ touchAction: 'none' }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* Shadows */}
              {shadows.map(shadow => (
                <g
                  key={shadow.id}
                  transform={`translate(${shadow.x}, ${shadow.y}) rotate(${shadow.rotation}, 50, 45)`}
                >
                  <path
                    d={pentagonPath}
                    fill="none"
                    stroke="#9ca3af"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                  />
                </g>
              ))}

              {/* Draggable Pentagons */}
              {pentagons.map(pentagon => (
                <g
                  key={pentagon.id}
                  transform={`translate(${pentagon.x}, ${pentagon.y}) rotate(${pentagon.rotation}, 50, 45) scale(${draggedPentagon?.id === pentagon.id ? 1.1 : 1})`}
                  style={{
                    cursor: 'grab',
                    opacity: draggedPentagon?.id === pentagon.id ? 0.8 : 1,
                    transformOrigin: '50px 45px',
                    transition: draggedPentagon?.id === pentagon.id ? 'none' : 'transform 0.1s'
                  }}
                  onPointerDown={(e) => handlePointerDown(e, pentagon)}
                >
                  <path d={pentagonPath} fill="none" stroke="#1f2937" strokeWidth="3" pointerEvents="all" />
                </g>
              ))}
            </svg>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 sm:px-6 rounded-xl border-2 border-gray-300 hover:border-primary-400 hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700 text-sm sm:text-base"
            >
              <RefreshCw className="w-5 h-5" />
              Reiniciar
            </button>

            <button
              onClick={handleValidate}
              className="flex-1 flex items-center justify-center gap-2 sm:gap-3 py-3 px-4 sm:px-6 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Validar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
            <span>Bloco 11 - Encaixe de Pentágonos</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PentagonMatching