import { jwtDecode } from "jwt-decode";

class JWTDecoder {
    constructor(token) {
        this.token = token
    }

    decodeToken() {
        try {
            console.log(this.token);
            
            return jwtDecode(this.token)
        } catch (error) {
            return { error: 'Token invalido'}
        }
    }
}

export default JWTDecoder