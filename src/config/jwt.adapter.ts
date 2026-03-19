import jwt, { Secret } from 'jsonwebtoken'
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class Jwt {

    static async generateToken(payload:any, duration:string = '15m'): Promise<string | null> {

        return new Promise((resolve)=>{
            jwt.sign(payload, JWT_SEED as Secret, {expiresIn: duration} as jwt.SignOptions, (err, token)=>{
                if (err) return resolve(null);
                resolve(token!);
                
            })
        })
    }
  
    static validateToken<T>(token: string): Promise< T | null> {
        return new Promise( (resolve) => {
            jwt.verify( token, JWT_SEED, (err, decoded) => {
                if( err ) return resolve(null);
                resolve( decoded as T);
            });

        })
    }
}