import { useMutation } from '@tanstack/react-query'
import { postAuthSession } from '@/api/auth-api'
import { signInWithCognito } from '@/utils/cognito-auth'

type SignInParams = {
  userId: string
  password: string
}

async function signIn({ userId, password }: SignInParams) {
  const { accessToken, idToken, refreshToken } = await signInWithCognito(userId, password)

  // refreshToken은 받는 즉시 백엔드로 넘기고, 이 함수 스코프를 벗어나면 다시 들고 있지 않음.
  // 백엔드가 Set-Cookie(httpOnly)로 응답하면 그 이후로는 브라우저가 쿠키로만 관리.
  await postAuthSession({ refreshToken })

  return { accessToken, idToken }
}

export function useSignIn() {
  return useMutation({ mutationFn: signIn })
}
