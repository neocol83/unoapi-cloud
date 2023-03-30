import { MessageFilter } from './message_filter'
import { getConfig, defaultConfig, Config, ignoreGetGroupMetadata, getGroupMetadata } from './config'

const {
  IGNORE_GROUP_MESSAGES,
  IGNORE_OWN_MESSAGES,
  IGNORE_BROADCAST_STATUSES,
  IGNORE_BROADCAST_MESSAGES,
  IGNORE_CALLS,
  IGNORE_HISTORY_MESSAGES,
  SEND_CONNECTION_STATUS,
  REJECT_CALLS_WEBHOOK,
  REJECT_CALLS,
  WEBHOOK_URL,
  WEBHOOK_TOKEN,
  WEBHOOK_HEADER,
} = process.env

let config: Config

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getConfigByEnv: getConfig = async (_phone: string): Promise<Config> => {
  if (!config) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const _undefined: any = undefined
    config = defaultConfig
    config.ignoreGroupMessages = IGNORE_GROUP_MESSAGES == _undefined ? true : IGNORE_GROUP_MESSAGES == 'true'
    config.ignoreBroadcastStatuses = IGNORE_BROADCAST_STATUSES === _undefined ? true : IGNORE_BROADCAST_STATUSES == 'true'
    config.ignoreBroadcastMessages = IGNORE_BROADCAST_MESSAGES === _undefined ? false : IGNORE_OWN_MESSAGES == 'true'
    config.ignoreHistoryMessages = IGNORE_HISTORY_MESSAGES === _undefined ? false : IGNORE_HISTORY_MESSAGES == 'true'
    config.ignoreOwnMessages = IGNORE_OWN_MESSAGES === _undefined ? true : IGNORE_OWN_MESSAGES == 'true'
    config.sendConnectionStatus = SEND_CONNECTION_STATUS === _undefined ? true : SEND_CONNECTION_STATUS == 'true'
    config.rejectCalls = IGNORE_CALLS || REJECT_CALLS || ''
    config.rejectCallsWebhook = REJECT_CALLS_WEBHOOK || ''
    config.webhooks[0].url = WEBHOOK_URL
    config.webhooks[0].token = WEBHOOK_TOKEN
    if (WEBHOOK_HEADER) {
      config.webhooks[0].header = WEBHOOK_HEADER
    }
    const filter: MessageFilter = new MessageFilter(config)

    config.shouldIgnoreJid = filter.isIgnoreJid.bind(filter)
    config.shouldIgnoreKey = filter.isIgnoreKey.bind(filter)
    config.getGroupMetadata = config.ignoreGroupMessages ? ignoreGetGroupMetadata : getGroupMetadata
    console.debug('Config', config)
  }
  return config
}