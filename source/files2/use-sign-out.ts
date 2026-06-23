import { useMutation } from '@tanstack/react-query'
import { signOutWithAmplify } from '@/utils/amplify-auth'

export function useSignOut() {
  return useMutation({ mutationFn: signOutWithAmplify })
}
