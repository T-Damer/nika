import { storeVersion } from '@/lib/atoms/atomStore'
import { defaultUser } from '@/lib/storage'
import { User } from '@/types'
import { atomWithStorage } from 'jotai/utils'

export default atomWithStorage<User>(
  `userStore-${storeVersion}`,
  defaultUser,
  undefined,
  { getOnInit: true }
)
