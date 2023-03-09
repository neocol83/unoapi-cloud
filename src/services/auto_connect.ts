import { getClient } from './client'
import { SessionStore } from './session_store'
import { Outgoing } from './outgoing'
import { getStore } from './store'
import { getStoreFile } from './store_file'
import { getClientBaileys } from './client_baileys'

export const autoConnect = async (
  sessionStore: SessionStore,
  outgoing: Outgoing,
  getClient: getClient = getClientBaileys,
  getStore: getStore = getStoreFile,
) => {
  try {
    const phones = await sessionStore.getPhones()
    console.info(`${phones.length} phones to verify is auto connect`)
    for (let i = 0, j = phones.length; i < j; i++) {
      const phone = phones[i]
      try {
        console.info(`Auto connecting phone ${phone}...`)
        await getClient(phone, outgoing, getStore)
        console.info(`Auto connected phone ${phone}!`)
      } catch (error) {
        console.error(`Error on connect phone ${phone}`, error)
      }
    }
  } catch (error) {
    console.error('Erro on auto connect', error)
    throw error
  }
}
