export const HttpStatus = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    CONFLICT: 409,
    I_AM_A_TEAPOT: 418,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
});

export class RequestBuilder {
    constructor() {
        this.iurl = '';
        this.imethod = 'GET';
        this.iheaders = {};
        this.ibody = {};
    }

    url(purl) {
        this.iurl = purl;
        return this;
    }

    method(pmethod) {
        this.imethod = pmethod;
        return this;
    }

    headers(pheaders) {
        this.iheaders = pheaders;
        return this;
    }

    body(pbody) {
        this.ibody = pbody;
        return this;
    }

    build() {
        return () => {
            const options = {
                method: this.imethod,
                headers: this.iheaders
            };
            if(this.imethod !== "GET" && Object.keys(this.ibody).length > 0) {
                options.body = JSON.stringify(this.ibody);
            }
            return fetch(this.iurl, options);     
        };
    }
}