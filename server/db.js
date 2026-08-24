import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Em desenvolvimento o banco fica em server/data/meem.db (criado
// automaticamente). Em produção, MEEM_DB_PATH aponta para um caminho FORA da
// pasta publicada pelo deploy — o deploy sincroniza com `rsync --delete`, que
// apagaria qualquer arquivo dentro da pasta publicada que não venha do build.
const dbPath = process.env.MEEM_DB_PATH || path.join(__dirname, 'data', 'meem.db')

import fs from 'fs'
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS resultados (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT,
    idade INTEGER,
    escolaridade TEXT,
    data_partida TEXT NOT NULL,
    hora_partida TEXT NOT NULL,
    bloco1 REAL DEFAULT 0,
    bloco2 REAL DEFAULT 0,
    bloco3 REAL DEFAULT 0,
    bloco4 REAL DEFAULT 0,
    bloco5 REAL DEFAULT 0,
    bloco6 REAL DEFAULT 0,
    bloco7 REAL DEFAULT 0,
    bloco8 REAL DEFAULT 0,
    bloco9 REAL DEFAULT 0,
    bloco10 REAL DEFAULT 0,
    bloco11 REAL DEFAULT 0,
    pontuacao_total REAL NOT NULL,
    pontuacao_maxima REAL NOT NULL,
    respostas_json TEXT,
    criado_em TEXT DEFAULT (datetime('now', 'localtime'))
  )
`)

export default db