const ONE_DAY_MS = 24 * 60 * 60 * 1000

export const BOOKINGS_COLLECTION = 'runtime-bookings'
export const FEEDBACK_COLLECTION = 'runtime-feedbacks'
export const PAYMENTS_COLLECTION = 'runtime-payments'
export const USERS_COLLECTION = 'runtime-users'

const EXPIRY_COLLECTIONS = new Set([
  BOOKINGS_COLLECTION,
  FEEDBACK_COLLECTION,
  PAYMENTS_COLLECTION
])

const collections = {
  [BOOKINGS_COLLECTION]: new Map(),
  [FEEDBACK_COLLECTION]: new Map(),
  [PAYMENTS_COLLECTION]: new Map(),
  [USERS_COLLECTION]: new Map()
}

const getCollection = (collection) => {
  if (!collections[collection]) {
    collections[collection] = new Map()
  }
  return collections[collection]
}

const buildExpiry = (createdAt) => {
  const createdTime = createdAt ? new Date(createdAt).getTime() : Date.now()
  const safeTime = Number.isNaN(createdTime) ? Date.now() : createdTime
  return new Date(safeTime + ONE_DAY_MS).toISOString()
}

export const isExpiredRuntimeRecord = (expiresAt) => {
  if (!expiresAt) return false
  const expiry = new Date(expiresAt).getTime()
  if (Number.isNaN(expiry)) return false
  return Date.now() > expiry
}

export const attachRuntimeExpiry = (record) => {
  if (!record || typeof record !== 'object') return record
  if (record.expiresAt) return record

  return {
    ...record,
    expiresAt: buildExpiry(record.createdAt)
  }
}

const withCollectionExpiry = (collection, record) => {
  if (!EXPIRY_COLLECTIONS.has(collection)) return record
  return attachRuntimeExpiry(record)
}

export const createRecord = (collection, record) => {
  if (!record?.id) {
    throw new Error(`createRecord requires id for collection ${collection}`)
  }

  const coll = getCollection(collection)
  const withExpiry = withCollectionExpiry(collection, record)
  coll.set(String(withExpiry.id), withExpiry)
  return withExpiry
}

export const readRecordById = (collection, id) => {
  const coll = getCollection(collection)
  const existing = coll.get(String(id))
  if (!existing) return null

  const withExpiry = withCollectionExpiry(collection, existing)
  if (EXPIRY_COLLECTIONS.has(collection) && isExpiredRuntimeRecord(withExpiry.expiresAt)) {
    coll.delete(String(id))
    return null
  }

  if (withExpiry !== existing) {
    coll.set(String(id), withExpiry)
  }

  return withExpiry
}

export const updateRecord = (collection, id, patch) => {
  const existing = readRecordById(collection, id)
  if (!existing) return null

  const updates = typeof patch === 'function' ? patch(existing) : patch
  const next = withCollectionExpiry(collection, {
    ...existing,
    ...updates,
    id: existing.id
  })

  const coll = getCollection(collection)
  coll.set(String(id), next)
  return next
}

export const deleteRecord = (collection, id) => {
  const coll = getCollection(collection)
  return coll.delete(String(id))
}

export const hasRecord = (collection, id) => Boolean(readRecordById(collection, id))

export const listRecords = (collection) => {
  purgeExpiredInCollection(collection)
  return Array.from(getCollection(collection).values())
}

export const queryRecords = (collection, predicate) => listRecords(collection).filter(predicate)

export const purgeExpiredInCollection = (collection) => {
  if (!EXPIRY_COLLECTIONS.has(collection)) return

  const coll = getCollection(collection)
  Array.from(coll.entries()).forEach(([id, record]) => {
    const withExpiry = withCollectionExpiry(collection, record)
    if (isExpiredRuntimeRecord(withExpiry.expiresAt)) {
      coll.delete(id)
      return
    }

    if (withExpiry !== record) {
      coll.set(id, withExpiry)
    }
  })
}

export const purgeAllRuntimeCollections = () => {
  purgeExpiredInCollection(BOOKINGS_COLLECTION)
  purgeExpiredInCollection(FEEDBACK_COLLECTION)
  purgeExpiredInCollection(PAYMENTS_COLLECTION)
}
