import {
  findUserByEmail,
  listUsers,
  upsertUserById
} from '../repositories/userRepository.js'
import { createHashId, normalizeEmail } from '../utils/identity.js'

// User service owns identity resolution and profile reads.
export const getUserList = () => listUsers()

export const resolveUserIdentity = async ({ email, name, phone }) => {
  const safeEmail = normalizeEmail(email)
  if (!safeEmail) {
    return { ok: false, status: 400, message: 'Email is required' }
  }

  const found = await findUserByEmail(safeEmail)
  if (found) {
    return {
      ok: true,
      status: 200,
      data: {
        id: found.id,
        isSeedUser: true,
        name: found.name,
        email: found.email,
        phone: found.phone || phone || ''
      }
    }
  }

  const fallbackName = (name || safeEmail.split('@')[0] || 'Guest User').trim() || 'Guest User'
  const created = {
    id: createHashId('U', safeEmail),
    name: fallbackName,
    email: safeEmail,
    phone: phone || '',
    isAuthenticated: true,
    source: 'runtime'
  }

  await upsertUserById(created)

  return {
    ok: true,
    status: 201,
    data: {
      id: created.id,
      isSeedUser: false,
      name: created.name,
      email: created.email,
      phone: created.phone
    }
  }
}

export const normalizeUserEmail = normalizeEmail