export type HttpOptions = {
    method: HttpMethod;
    body?: string;
    headers?: any;
};
export type HttpMethod = 'GET' | 'PUT' | 'POST' | 'DELETE';
