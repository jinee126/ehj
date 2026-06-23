import { Amplify } from 'aws-amplify'
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from '@/constants/auth-constant'

// 앱 진입점(main.tsx 등)에서 한 번만 import해서 실행되도록 해야 함
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: COGNITO_USER_POOL_ID,
      userPoolClientId: COGNITO_CLIENT_ID,
    },
  },
})
