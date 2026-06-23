import { fetchAuthSession, signIn } from 'aws-amplify/auth'

export type AmplifyTokens = {
  accessToken: string
  idToken: string
}

// Amplify가 signIn 시점에 refreshToken까지 포함한 모든 토큰을 자체 storage(기본 localStorage)에 저장함.
// 우리는 refreshToken을 직접 다루지 않고, 필요한 accessToken/idToken만 꺼내서 씀.
export async function signInWithAmplify(userId: string, password: string): Promise<AmplifyTokens> {
  await signIn({
    username: userId,
    password,
    options: {
      authFlowType: 'USER_PASSWORD_AUTH',
    },
  })

  const session = await fetchAuthSession()
  const accessToken = session.tokens?.accessToken?.toString()
  const idToken = session.tokens?.idToken?.toString()

  if (!accessToken || !idToken) {
    throw new Error('토큰을 가져오지 못했습니다.')
  }

  return { accessToken, idToken }
}
