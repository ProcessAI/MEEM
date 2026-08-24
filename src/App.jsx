import { Routes, Route } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import WelcomeScreen from './components/WelcomeScreen'
import RegistrationScreen from './components/RegistrationScreen'
import OrientationTest from './components/OrientationTest'
import ShuffledDays from './components/ShuffledDays'
import YearQuestion from './components/YearQuestion'
import DayOfMonth from './components/DayOfMonth'
import MonthQuestion from './components/MonthQuestion'
import SeasonQuestion from './components/SeasonQuestion'
import ResultScreen from './components/ResultScreen'
import CountriesScreen from './components/CountriesScreen'
import StatesScreen from './components/StatesScreen'
import BuildingScreen from './components/BuildingScreen'
import DayNightScreen from './components/DayNightScreen'
import Block2ResultScreen from './components/Block2ResultScreen'
import Block3Instruction from './components/Block3Instruction'
import WordRecall1 from './components/WordRecall1'
import WordRecall2 from './components/WordRecall2'
import WordRecall3 from './components/WordRecall3'
import Block3ResultScreen from './components/Block3ResultScreen'
import Arithmetic1 from './components/Arithmetic1'
import Arithmetic2 from './components/Arithmetic2'
import Arithmetic3 from './components/Arithmetic3'
import Arithmetic4 from './components/Arithmetic4'
import Arithmetic5 from './components/Arithmetic5'
import Block4ResultScreen from './components/Block4ResultScreen'
import WordRecall4 from './components/WordRecall4'
import Block5ResultScreen from './components/Block5ResultScreen'
import ImageIdentification1 from './components/ImageIdentification1'
import ImageIdentification2 from './components/ImageIdentification2'
import Block6ResultScreen from './components/Block6ResultScreen'
import SpeechRecognition from './components/SpeechRecognition'
import Block7ResultScreen from './components/Block7ResultScreen'
import ImageIdentification3 from './components/ImageIdentification3'
import ImageIdentification4 from './components/ImageIdentification4'
import SpeechRecognition2 from './components/SpeechRecognition2'
import Block8ResultScreen from './components/Block8ResultScreen'
import ClapDetection from './components/ClapDetection'
import Block9ResultScreen from './components/Block9ResultScreen'
import PhraseOrdering from './components/PhraseOrdering'
import Block10ResultScreen from './components/Block10ResultScreen'
import PentagonMatching from './components/PentagonMatching'
import Block11ResultScreen from './components/Block11ResultScreen'
import CombinedResultScreen from './components/CombinedResultScreen'

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/cadastro" element={<RegistrationScreen />} />
          <Route path="/orientacao" element={<OrientationTest />} />
          <Route path="/dias-embaralhados" element={<ShuffledDays />} />
          <Route path="/ano" element={<YearQuestion />} />
          <Route path="/dia-mes" element={<DayOfMonth />} />
          <Route path="/mes" element={<MonthQuestion />} />
          <Route path="/estacao" element={<SeasonQuestion />} />
          <Route path="/resultado-bloco1" element={<ResultScreen />} />
          <Route path="/paises" element={<CountriesScreen />} />
          <Route path="/estados" element={<StatesScreen />} />
          <Route path="/construcao" element={<BuildingScreen />} />
          <Route path="/dia-noite" element={<DayNightScreen />} />
          <Route path="/resultado-bloco2" element={<Block2ResultScreen />} />
          <Route path="/instrucao-bloco3" element={<Block3Instruction />} />
          <Route path="/word-recall-1" element={<WordRecall1 />} />
          <Route path="/palavras2" element={<WordRecall2 />} />
          <Route path="/palavras3" element={<WordRecall3 />} />
          <Route path="/resultado-bloco3" element={<Block3ResultScreen />} />
          <Route path="/calculo1" element={<Arithmetic1 />} />
          <Route path="/calculo2" element={<Arithmetic2 />} />
          <Route path="/calculo3" element={<Arithmetic3 />} />
          <Route path="/calculo4" element={<Arithmetic4 />} />
          <Route path="/calculo5" element={<Arithmetic5 />} />
          <Route path="/resultado-bloco4" element={<Block4ResultScreen />} />
          <Route path="/palavras4" element={<WordRecall4 />} />
          <Route path="/resultado-bloco5" element={<Block5ResultScreen />} />
          <Route path="/imagem1" element={<ImageIdentification1 />} />
          <Route path="/imagem2" element={<ImageIdentification2 />} />
          <Route path="/resultado-bloco6" element={<Block6ResultScreen />} />
          <Route path="/fala" element={<SpeechRecognition />} />
          <Route path="/resultado-bloco7" element={<Block7ResultScreen />} />
          <Route path="/imagem3" element={<ImageIdentification3 />} />
          <Route path="/imagem4" element={<ImageIdentification4 />} />
          <Route path="/fala2" element={<SpeechRecognition2 />} />
          <Route path="/resultado-bloco8" element={<Block8ResultScreen />} />
          <Route path="/palmas" element={<ClapDetection />} />
          <Route path="/resultado-bloco9" element={<Block9ResultScreen />} />
          <Route path="/frase" element={<PhraseOrdering />} />
          <Route path="/resultado-bloco10" element={<Block10ResultScreen />} />
          <Route path="/pentagonos" element={<PentagonMatching />} />
          <Route path="/resultado-bloco11" element={<Block11ResultScreen />} />
          <Route path="/resultado-combined" element={<CombinedResultScreen />} />
        </Routes>
      </div>
    </GameProvider>
  )
}

export default App