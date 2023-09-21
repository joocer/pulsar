/**
 * APIAdapter class to facilitate API calls.
 * This class automatically handles different environments, methods, and standard error responses.
 */
class APIAdapter {
    /**
     * Create an APIAdapter instance for a specific service.
     * 
     * @param {string} service - The service name, like 'user' or 'data'.
     */
    constructor(service) {
        this.service = service;
        this.environment = this.detectEnvironment();
    }

    /**
     * Detect the current environment based on the hostname.
     * 
     * @returns {string} - 'local', 'test', or 'production'
     */
    detectEnvironment() {
        if (window.location.hostname === 'localhost') {
            return 'local';
        } else if (window.location.hostname.endsWith('tst.example.com')) {
            return 'test';
        } else {
            return 'production';
        }
    }

    /**
     * Generate the base URL for API calls based on the environment.
     * 
     * @returns {string} - The base URL.
     */
    getBaseURL() {
        if (this.environment === 'local') {
            return `http://localhost:8084/${this.service}/`;
        } else if (this.environment === 'test') {
            return `https://${this.service}.tst.example.com/`;
        } else {
            return `https://${this.service}.example.com/`;
        }
    }

    /**
     * Make an API request.
     * 
     * @param {string} endpoint - API endpoint with optional templated sections like ':id'.
     * @param {string} method - HTTP method ('GET', 'POST', etc.)
     * @param {object} [payload=null] - Data to send with 'POST', 'PATCH', 'PUT', or 'QUERY'.
     * @param {string} [returnType='json'] - Expected return type ('json', 'csv', 'parquet').
     * @param {object} [params=null] - Object to replace templated sections in the endpoint.
     * @param {object} [queryString=null] - Object representing query string parameters.
     * @returns {Promise} - Promise resolving to the API response.
     */
    async makeRequest(endpoint, method, payload = null, returnType = 'json', params = null, queryString = null) {
        let templatedEndpoint = endpoint;
        if (params) {
            for (const [key, value] of Object.entries(params)) {
                templatedEndpoint = templatedEndpoint.replace(`:${key}`, value);
            }
        }
        
        let url = `${this.getBaseURL()}${templatedEndpoint}`;
  
        if (queryString) {
            const queryParams = new URLSearchParams(queryString).toString();
            url = `${url}?${queryParams}`;
        }

        let options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        };

        if (['POST', 'PATCH', 'PUT', 'QUERY'].includes(method)) {
            options.body = JSON.stringify(payload);
        }

        const response = await fetch(url, options);

        if (response.status === 401) {
            window.location.href = '/sign-in';
            return;
        }

        if ([403, 500, 518, 522, 527].includes(response.status)) {
            const error = new Error(`HTTP Error: ${response.status}`);
            error.statusCode = response.status;
            throw error;
        }

        if (returnType === 'json') {
            return await response.json();
        } else if (returnType === 'csv') {
            return await response.text();
        } else if (returnType === 'parquet') {
            return await response.arrayBuffer();
        } else {
            throw new Error(`Unsupported return type: ${returnType}`);
        }
    }
}

// Usage Example:
const userApi = new APIAdapter('user');
const dataApi = new APIAdapter('data');

// Make a GET request to fetch user by id
userApi.makeRequest('/users/:id', 'GET', null, 'json', { id: 42 })
    .then(data => console.log(data))
    .catch(err => console.error(`Error occurred: ${err}`));

// Make a GET request with query parameters
userApi.makeRequest('/users', 'GET', null, 'json', null, { age: 30, sort: 'asc' })
    .then(data => console.log(data))
    .catch(err => console.error(`Error occurred: ${err}`));
