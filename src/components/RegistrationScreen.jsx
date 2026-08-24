import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Calendar, ArrowLeft } from 'lucide-react'
import { useGame } from '../context/GameContext'

function RegistrationScreen() {
  const navigate = useNavigate()
  const { setParticipante } = useGame()
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    idade: '',
    escolaridade: ''
  })
  const [errors, setErrors] = useState({})

  const escolaridadeOptions = [
    { value: '', label: 'Selecione...' },
    { value: 'fundamental-incompleto', label: 'Fundamental Incompleto' },
    { value: 'fundamental-completo', label: 'Fundamental Completo' },
    { value: 'medio-incompleto', label: 'Médio Incompleto' },
    { value: 'medio-completo', label: 'Médio Completo' },
    { value: 'superior-incompleto', label: 'Superior Incompleto' },
    { value: 'superior-completo', label: 'Superior Completo' },
    { value: 'pos-graduacao', label: 'Pós-graduação' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.idade) {
      newErrors.idade = 'Idade é obrigatória'
    } else if (formData.idade < 18 || formData.idade > 120) {
      newErrors.idade = 'Idade deve estar entre 18 e 120'
    }
    
    if (!formData.escolaridade) {
      newErrors.escolaridade = 'Escolaridade é obrigatória'
    }
    
    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validateForm()
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    setParticipante(formData)
    navigate('/dias-embaralhados')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </button>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Cadastro
          </h2>
          <p className="text-gray-500 mb-8">
            Preencha seus dados para iniciar o teste
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.nome ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu nome"
                />
              </div>
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">{errors.nome}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Idade
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    errors.idade ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite sua idade"
                  min="18"
                  max="120"
                />
              </div>
              {errors.idade && (
                <p className="text-red-500 text-sm mt-1">{errors.idade}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escolaridade
              </label>
              <select
                name="escolaridade"
                value={formData.escolaridade}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                  errors.escolaridade ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {escolaridadeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.escolaridade && (
                <p className="text-red-500 text-sm mt-1">{errors.escolaridade}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
            >
              Cadastrar e Iniciar
            </button>
          </form>
          
          <p className="text-xs text-gray-400 mt-6 text-center">
            Seus dados serão utilizados apenas para fins de avaliação
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegistrationScreen