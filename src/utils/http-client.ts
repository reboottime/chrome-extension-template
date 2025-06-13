export default class HttpClient {
    private readonly baseUrl: string;

    constructor(baseUrl: string = '') {
        this.baseUrl = baseUrl;
    }

    private async request<T>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> {
        const fullUrl = `${this.baseUrl}${url}`;

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        const response = await fetch(fullUrl, { ...defaultOptions, ...options });

        if (!response.ok) {
            let errorMessage = `HTTP error! status: ${response.status}`;
            let errorBody: any = null;

            try {
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    errorBody = await response.json();
                    errorMessage = errorBody.message || errorBody.error || errorMessage;
                } else {
                    errorBody = await response.text();
                    errorMessage = errorBody || errorMessage;
                }
            } catch (parseError) {
                // If we can't parse the error body, use the status text
                errorMessage = response.statusText || errorMessage;
            }

            const error = new Error(errorMessage) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            error.body = errorBody;
            error.response = response;

            throw error;
        }

        // Handle different response types based on content-type
        return this.parseResponse<T>(response);
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        // Handle 204 No Content responses
        if (response.status === 204) {
            return undefined as T;
        }

        // Check if response has content
        const contentLength = response.headers.get('content-length');
        if (contentLength === '0') {
            return undefined as T;
        }

        // Parse based on content type
        const contentType = response.headers.get('content-type');

        if (!contentType) {
            // If no content-type, try to parse as text
            return (await response.text()) as T;
        }

        if (contentType.includes('application/json')) {
            try {
                return await response.json();
            } catch (error) {
                throw new Error(`Failed to parse JSON response: ${error.message}`);
            }
        }

        if (contentType.includes('text/')) {
            return (await response.text()) as T;
        }

        if (contentType.includes('application/octet-stream') ||
            contentType.includes('image/') ||
            contentType.includes('audio/') ||
            contentType.includes('video/')) {
            return (await response.blob()) as T;
        }

        if (contentType.includes('multipart/form-data')) {
            return (await response.formData()) as T;
        }

        // Default to text for unknown content types
        return (await response.text()) as T;
    }

    async get<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, { ...options, method: 'GET' });
    }

    async post<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
        const body = this.prepareBody(data);
        const headers = this.prepareHeaders(data, options?.headers);

        return this.request<T>(url, {
            ...options,
            method: 'POST',
            headers,
            body,
        });
    }

    async put<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
        const body = this.prepareBody(data);
        const headers = this.prepareHeaders(data, options?.headers);

        return this.request<T>(url, {
            ...options,
            method: 'PUT',
            headers,
            body,
        });
    }

    async delete<T>(url: string, options?: RequestInit): Promise<T> {
        return this.request<T>(url, { ...options, method: 'DELETE' });
    }

    async patch<T>(url: string, data?: any, options?: RequestInit): Promise<T> {
        const body = this.prepareBody(data);
        const headers = this.prepareHeaders(data, options?.headers);

        return this.request<T>(url, {
            ...options,
            method: 'PATCH',
            headers,
            body,
        });
    }

    private prepareBody(data: any): string | FormData | Blob | null {
        if (data === null || data === undefined) {
            return null;
        }

        // Handle different data types
        if (data instanceof FormData || data instanceof Blob || data instanceof ArrayBuffer) {
            return data;
        }

        if (typeof data === 'string') {
            return data;
        }

        // Default to JSON stringify for objects
        return JSON.stringify(data);
    }

    private prepareHeaders(data: any, existingHeaders?: HeadersInit): HeadersInit {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Don't set Content-Type for FormData (browser will set it with boundary)
        if (data instanceof FormData) {
            delete headers['Content-Type'];
        }

        // Don't set Content-Type for Blob (it has its own type)
        if (data instanceof Blob) {
            delete headers['Content-Type'];
        }

        // Merge with existing headers
        if (existingHeaders) {
            if (existingHeaders instanceof Headers) {
                existingHeaders.forEach((value, key) => {
                    headers[key] = value;
                });
            } else if (Array.isArray(existingHeaders)) {
                existingHeaders.forEach(([key, value]) => {
                    headers[key] = value;
                });
            } else {
                Object.assign(headers, existingHeaders);
            }
        }

        return headers;
    }
}