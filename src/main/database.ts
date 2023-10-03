import { randomUUID } from 'crypto'
import { app } from 'electron'
import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { Database } from 'sqlite3'
import { Migration } from './types'

class AudioDatabase {
  database: Database
  run_migrations_on_startup = true

  constructor() {
    const path = app.getPath('userData').concat('/database.db')
    console.log(`Loading db from ${path}`)

    this.database = new Database(path)
    this.handleMigrations()
  }

  async handleMigrations() {
    try {
      this.run_migrations_on_startup && (await this.initMigrations())
      await this.checkAndApplyPendingMigrations()
    } catch (error) {
      console.error(`
        There was some error during applying the migrations. \n
        ${error}
      `)
    }
  }

  async initMigrations(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.database.run(
          `CREATE TABLE IF NOT EXISTS migrations (
            id varchar(255) primary key,
            file_name varchar(510) not null
        );`,
          (err) => {
            if (err) {
              reject()
            } else {
              resolve()
            }
          }
        )
      } catch (error) {
        throw error
      }
    })
  }

  async getAppliedMigrations(): Promise<Migration[]> {
    return new Promise((resolve, reject) => {
      const get_migrations_sql = `SELECT * FROM migrations;`
      this.database.all(get_migrations_sql, (err, row) => {
        if (err) reject(err)
        resolve(row as Migration[])
      })
    })
  }

  checkAndApplyPendingMigrations(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const app_path = '/Users/jayprakashpathak/Desktop/music-dhoom/migrations'

      const migration_folder_path = app_path

      try {
        const m_files = await readdir(migration_folder_path)

        const applied_migrations = await this.getAppliedMigrations()

        const not_applied_migrations: string[] = []

        for (let i = 0; i < m_files.length; i++) {
          const current_m_file_path = path.join(app_path, m_files[i])
          const find_in_db = applied_migrations.findIndex(
            (ele) => ele.song_path === current_m_file_path
          )
          if (find_in_db === -1) {
            not_applied_migrations.push(current_m_file_path)
          }
        }

        for (let i = 0; i < not_applied_migrations.length; i++) {
          const file_path = not_applied_migrations[i]
          const sql_content = await readFile(file_path, 'utf-8')
          this.database.serialize(() => {
            this.database.run(sql_content, (err) => {
              if (err) {
                reject(err)
              }
            })
            const uuid = randomUUID()
            this.database.run(`INSERT INTO migrations values (? , ?)`, [uuid, file_path], (err) => {
              if (err) {
                reject(err)
              }
            })
          })
        }

        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default AudioDatabase
