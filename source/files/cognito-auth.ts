import {
  AuthenticationDetails,
  CognitoUser,
  type CognitoUserSession,
} from 'amazon-cognito-identity-js'
import { cognitoUserPool } from '@/config/cognito-config'

export type CognitoTokens = {
  accessToken: string
  idToken: string
  refreshToken: string
}

function toCognitoTokens(session: CognitoUserSession): CognitoTokens {
  return {
    accessToken: session.getAccessToken().getJwtToken(),
    idToken: session.getIdToken().getJwtToken(),
    refreshToken: session.getRefreshToken().getToken(),
  }
}

export function signInWithCognito(userId: string, password: string): Promise<CognitoTokens> {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password,
    })

    const cognitoUser = new CognitoUser({
      Username: userId,
      Pool: cognitoUserPool,
    })

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        resolve(toCognitoTokens(session))
      },
      onFailure: (err) => {
        reject(err)
      },
      // ⚠️ User Pool에 NEW_PASSWORD_REQUIRED, MFA 같은 추가 challenge가 설정돼 있다면
      // newPasswordRequired / mfaRequired 콜백을 여기에 추가해야 함.
      // 현재는 해당 challenge가 없다는 전제로 작성함 — Cognito User Pool 설정 확인 필요.
    })
  })
}
