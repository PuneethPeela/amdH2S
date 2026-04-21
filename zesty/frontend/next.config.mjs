/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://127.0.0.1:8000/api/:path*' // proxy to FastAPI instance running locally in container
            }
        ]
    }
};

export default nextConfig;
