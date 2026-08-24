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