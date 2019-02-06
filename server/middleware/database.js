import mongoose from 'mongoose'
import {
  resolve
} from 'path'
import fs from 'fs'
const models = resolve(__dirname, '../database/schema')

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*\.js$/))
  .forEach(file => require(resolve(models, file)))


export const database = app => {
  mongoose.connect('mongodb://127.0.0.1:27017/cnode-web-nuxt')

  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.once('open', async () => {
    console.log('success')

  })
}
