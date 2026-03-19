import { Credentials, OAuth2Client } from 'google-auth-library'

export class OAuth2Service {
    private client: OAuth2Client;
    constructor(
        private clientId: string,
        private clientSecret: string,
        private redirectUrl: string
    ) {
        this.client = new OAuth2Client(clientId, clientSecret, redirectUrl);
    }

    generateAtuhUrl(): string{
        return this.client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email',
                'openid'
            ],
            prompt: 'consent',
            redirect_uri: this.redirectUrl
        })
    }

    async getTokens(token: string){
        try {
            const { tokens } = await this.client.getToken(token);
            this.client.setCredentials(tokens);
            return tokens;
        } catch (error) {
            console.log('Error logging in with OAuth2 user', error);
        }
    }


    async getUserInfo(token: Credentials) {
        const {access_token} = token;
        try {
            const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;
            const userInfo = await fetch(url);
            const data = await userInfo.json()
            return data;            
        } catch (error) {
            console.log('Error logging in with OAuth2 user', error);
        }
    }


}