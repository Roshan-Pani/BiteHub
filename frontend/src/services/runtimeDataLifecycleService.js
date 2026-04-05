import { attachRuntimeExpiry, purgeAllRuntimeCollections } from './fileCrudStoreService'

export { attachRuntimeExpiry }

export const purgeExpiredRuntimeData = () => {
  purgeAllRuntimeCollections()
}
