import { useNavigate } from 'react-router-dom'
import { Brain, ArrowRight } from 'lucide-react'

function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary-100 p-6 rounded-full">
              <Brain className="w-16 h-16 text-primary-600" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            MEEM
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-600 mb-6">
            Mini Exame do Estado Mental
          </h2>
          
          <p className="text-gray-500 mb-8 leading-relaxed">
            Bem-vindo ao jogo digital do MEEM! Este teste é uma ferramenta importante 
            para avaliar funções cognitivas como atenção, memória, linguagem e 
            capacidades visoespaciais.
          </p>
          
          <div className="bg-gradient-to-r from-primary-50 to-cyan-50 rounded-2xl p-6 mb-8">
            <h3 className="font-semibold text-gray-700 mb-3">O que você encontrará:</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✓</span>
                Testes de orientação temporal e espacial
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✓</span>
                Exercícios de memória e atenção
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✓</span>
                Avaliação de linguagem e praxis
              </li>
              <li className="flex items-start">
                <span className="text-primary-500 mr-2">✓</span>
                Resultados instantâneos
              </li>
            </ul>
          </div>
          
          <button
            onClick={() => navigate('/cadastro')}
            className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mx-auto text-lg"
          >
            Começar
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-sm text-gray-400 mt-6">
            O teste leva aproximadamente 10-15 minutos para completar
          </p>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen