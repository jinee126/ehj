import { CognitoUserPool } from 'amazon-cognito-identity-js'
import { COGNITO_CLIENT_ID, COGNITO_USER_POOL_ID } from '@/constants/auth-constant'

export const cognitoUserPool = new CognitoUserPool({
  UserPoolId: COGNITO_USER_POOL_ID,
  ClientId: COGNITO_CLIENT_ID,
})
