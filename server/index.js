import express from 'express'
import cors from 'cors'
import path from 'path'
import os from 'os'
import https from 'https'
import selfsigned from 'selfsigned'
import { fileURLToPath } from 'url'
import db from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const HTTP_PORT = process.env.PORT || 3001
const HTTPS_PORT = process.env.HTTPS_PORT || 3443

app.use(cors())
app.use(express.json())

// ---------- API ----------

// Salvar um novo resultado de teste
app.post('/api/resultados', (req, res) => {
  try {
    const {
      nome, email, idade, escolaridade,
      dataPartida, horaPartida,
      bloco1, bloco2, bloco3, bloco4, bloco5,
      bloco6, bloco7, bloco8, bloco9, bloco10, bloco11,
      pontuacaoTotal, pontuacaoMaxima,
      respostas
    } = req.body

    if (!nome || pontuacaoTotal === undefined || pontuacaoMaxima === undefined) {
      return res.status(400).json({ erro: 'Campos obrigatórios ausentes (nome, pontuacaoTotal, pontuacaoMaxima).' })
    }

    const stmt = db.prepare(`
      INSERT INTO resultados (
        nome, email, idade, escolaridade, data_partida, hora_partida,
        bloco1, bloco2, bloco3, bloco4, bloco5, bloco6, bloco7, bloco8, bloco9, bloco10, bloco11,
        pontuacao_total, pontuacao_maxima, respostas_json
      ) VALUES (
        @nome, @email, @idade, @escolaridade, @dataPartida, @horaPartida,
        @bloco1, @bloco2, @bloco3, @bloco4, @bloco5, @bloco6, @bloco7, @bloco8, @bloco9, @bloco10, @bloco11,
        @pontuacaoTotal, @pontuacaoMaxima, @respostas
      )
    `)

    const info = stmt.run({
      nome,
      email: email || null,
      idade: idade || null,
      escolaridade: escolaridade || null,
      dataPartida,
      horaPartida,
      bloco1: bloco1 || 0,
      bloco2: bloco2 || 0,
      bloco3: bloco3 || 0,
      bloco4: bloco4 || 0,
      bloco5: bloco5 || 0,
      bloco6: bloco6 || 0,
      bloco7: bloco7 || 0,
      bloco8: bloco8 || 0,
      bloco9: bloco9 || 0,
      bloco10: bloco10 || 0,
      bloco11: bloco11 || 0,
      pontuacaoTotal,
      pontuacaoMaxima,
      respostas: respostas ? JSON.stringify(respostas) : null
    })

    res.status(201).json({ id: info.lastInsertRowid, sucesso: true })
  } catch (err) {
    console.error('Erro ao salvar resultado:', err)
    res.status(500).json({ erro: 'Erro interno ao salvar resultado.' })
  }
})

// Listar todos os resultados (mais recentes primeiro)
app.get('/api/resultados', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM resultados ORDER BY id DESC').all()
    res.json(rows)
  } catch (err) {
    console.error('Erro ao buscar resultados:', err)
    res.status(500).json({ erro: 'Erro interno ao buscar resultados.' })
  }
})

// Buscar um resultado específico
app.get('/api/resultados/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM resultados WHERE id = ?').get(req.params.id)
    if (!row) return res.status(404).json({ erro: 'Resultado não encontrado.' })
    res.json(row)
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// Apagar um resultado
app.delete('/api/resultados/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM resultados WHERE id = ?').run(req.params.id)
    if (info.changes === 0) return res.status(404).json({ erro: 'Resultado não encontrado.' })
    res.json({ sucesso: true })
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno.' })
  }
})

// Cache simples em memória pra não bater no serviço externo repetidamente
// com coordenadas muito próximas (arredonda pra ~1km de precisão)
const geocodeCache = new Map()

// Traduz coordenadas (lat/lon) em país e estado, usando o Nominatim
// (OpenStreetMap, serviço gratuito). Fica no backend (não no navegador do
// usuário) pra: 1) não expor a localização de cada pessoa direto pra um
// serviço externo, e 2) controlar o volume de chamadas com um único
// User-Agent, evitando bloqueio por uso excessivo quando várias pessoas
// usam o site ao mesmo tempo.
app.get('/api/geocode', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat)
    const lon = parseFloat(req.query.lon)
    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return res.status(400).json({ erro: 'lat e lon são obrigatórios e devem ser números.' })
    }

    const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`
    if (geocodeCache.has(cacheKey)) {
      return res.json(geocodeCache.get(cacheKey))
    }

    // zoom=18 pede o nível de detalhe mais fino (endereço/edificação), essencial
    // pra conseguir enxergar vilarejo/fazenda (zoom baixo só retorna a cidade
    // que engloba a região, mascarando áreas rurais dentro dela)
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=pt-BR&zoom=18&addressdetails=1&extratags=1`
    const response = await fetch(url, {
      headers: {
        // Nominatim pede um User-Agent identificável para uso não-abusivo
        'User-Agent': 'MEEM-App/1.0 (uso academico - teste cognitivo)'
      }
    })

    if (!response.ok) {
      throw new Error(`Nominatim respondeu ${response.status}`)
    }

    const data = await response.json()
    const address = data.address || {}

    // Classifica rural x urbano. Prioriza o "addresstype" (tipo específico do
    // ponto exato consultado) quando disponível, que é mais preciso do que só
    // olhar a hierarquia do endereço — evita que uma fazenda dentro do
    // território de um município grande seja classificada como "urbano" só
    // por causa da cidade que a engloba administrativamente.
    const tiposUrbanos = ['city', 'town', 'suburb', 'city_district', 'borough', 'quarter', 'residential', 'neighbourhood']
    const tiposRurais = ['village', 'hamlet', 'isolated_dwelling', 'farm', 'farmyard', 'allotments']

    let tipoLocal = 'Urbano' // padrão seguro quando não dá pra classificar
    if (tiposRurais.includes(data.addresstype)) {
      tipoLocal = 'Rural'
    } else if (tiposUrbanos.includes(data.addresstype)) {
      tipoLocal = 'Urbano'
    } else if (data.category === 'highway') {
      // Ponto mais próximo é uma estrada, não um bairro/vilarejo — comum em
      // zona rural sem povoado mapeado no OSM (ex: "Região Administrativa"
      // do DF, ou municípios enormes como Sorriso/MT, que misturam área
      // urbana e rural sob o mesmo nome de cidade na hierarquia de endereço).
      // "unclassified"/"track"/"path" já são, pela própria convenção do
      // OpenStreetMap, vias secundárias tipicamente rurais — não precisa
      // confirmar com o dado de superfície (que muitas vezes nem vem preenchido).
      // "residential"/"primary"/"secondary"/"tertiary"/"trunk" ficam de fora
      // (essas sim são tipicamente urbanas/vias principais).
      const tiposViaRural = ['track', 'path', 'bridleway', 'unclassified', 'service']
      if (tiposViaRural.includes(data.type)) {
        tipoLocal = 'Rural'
      } else {
        const temChaveRural = ['village', 'hamlet', 'isolated_dwelling', 'farm'].some(k => address[k])
        const temChaveUrbanaForte = ['city', 'town', 'suburb', 'city_district', 'borough', 'quarter'].some(k => address[k])
        if (temChaveRural && !temChaveUrbanaForte) tipoLocal = 'Rural'
      }
    } else {
      // addresstype não ajudou: olha as chaves do endereço (sem considerar
      // "municipality"/"county", que são grandes demais pra indicar zona)
      const temChaveRural = ['village', 'hamlet', 'isolated_dwelling', 'farm'].some(k => address[k])
      const temChaveUrbanaForte = ['city', 'town', 'suburb', 'city_district', 'borough', 'quarter'].some(k => address[k])
      if (temChaveRural && !temChaveUrbanaForte) tipoLocal = 'Rural'
    }

    const result = {
      pais: address.country || null,
      // Nem todo país usa "state" pro primeiro nível administrativo;
      // tenta algumas alternativas comuns antes de desistir
      estado: address.state || address.province || address.region || address.state_district || null,
      tipoLocal
    }

    geocodeCache.set(cacheKey, result)
    res.json(result)
  } catch (err) {
    console.error('Erro ao geocodificar:', err)
    res.status(502).json({ erro: 'Não foi possível determinar a localização.' })
  }
})

// ---------- Servir o front-end buildado (produção) ----------
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))
app.get('/*splat', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(distPath, 'index.html'))
})

// ---------- Descobrir IPs da rede local (para acessar do celular) ----------
function getLocalIPs() {
  const interfaces = os.networkInterfaces()
  const ips = []
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address)
      }
    }
  }
  return ips
}

// Plataformas de hospedagem (Render, Railway, Fly.io, etc.) definem a
// variável PORT automaticamente e cuidam do HTTPS com certificado real na
// frente do servidor. Nesses casos, servimos só HTTP na porta indicada.
// Sem PORT definida, assumimos que é execução local (start.bat) e também
// levantamos um HTTPS com certificado autoassinado, só pra permitir testar
// o microfone pelo celular na mesma rede Wi-Fi.
const isHostedPlatform = !!process.env.PORT

app.listen(HTTP_PORT, '0.0.0.0', () => {
  console.log(`\n✅ Servidor MEEM rodando na porta ${HTTP_PORT}`)
  if (!isHostedPlatform) {
    console.log(`   Neste computador: http://localhost:${HTTP_PORT}`)
  }
})

if (!isHostedPlatform) {
  // ---------- Servidor HTTPS local (necessário para o microfone funcionar via IP de rede) ----------
  // Navegadores só liberam microfone em HTTPS ou localhost. Como o acesso pelo
  // celular é feito por IP local (não localhost), geramos um certificado
  // autoassinado na hora, válido para o(s) IP(s) atuais da rede.
  // Isso só roda em execução local — quando hospedado de verdade, o próprio
  // serviço de hospedagem já fornece HTTPS com certificado válido.
  const ips = getLocalIPs()
  const attrs = [{ name: 'commonName', value: 'localhost' }]
  const altNames = [
    { type: 2, value: 'localhost' }, // DNS
    { type: 7, ip: '127.0.0.1' },    // IP
    ...ips.map(ip => ({ type: 7, ip }))
  ]

  const pems = await selfsigned.generate(attrs, {
    days: 3650,
    keySize: 2048,
    extensions: [{ name: 'subjectAltName', altNames }]
  })

  const httpsServer = https.createServer(
    { key: pems.private, cert: pems.cert },
    app
  )

  httpsServer.listen(HTTPS_PORT, '0.0.0.0', () => {
    console.log(`✅ Servidor MEEM (HTTPS local) rodando na porta ${HTTPS_PORT}`)
    console.log(`   Neste computador: https://localhost:${HTTPS_PORT}`)
    if (ips.length > 0) {
      console.log(`   No celular (mesma rede Wi-Fi) — use HTTPS para o microfone funcionar:`)
      ips.forEach(ip => console.log(`     https://${ip}:${HTTPS_PORT}`))
      console.log(`\n   ⚠️  O navegador vai avisar que o certificado não é confiável`)
      console.log(`      (é normal, é autoassinado). Toque em "Avançado" e depois`)
      console.log(`      em "Continuar mesmo assim" / "Acessar o site" para prosseguir.`)
    }
    console.log('')
  })
}