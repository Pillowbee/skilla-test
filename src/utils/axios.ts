import axios from 'axios'

export const instance = axios.create({
  baseURL: 'https://api.skilla.ru',
  headers: {
    Authorization: 'Bearer testtoken'
  }
})