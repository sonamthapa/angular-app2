//creating and storing all data that make user  and validate token
export class User {
    // need construction cuz we can create user with New User
    constructor(
        public email: string,
        public id: string,
        private _token: string,
        private _tokenExpirationDate: Date 
        ){}
        //if developer wants to acces the token it auamatically chaeck validity
        //getter-looks like function but we access like property-(user.property)
        get token() {
            if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
                return null;
            }
            return this._token;

        }
}