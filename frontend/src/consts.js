export default {
    API_URL: process.env.NODE_ENV == 'production' ? 'https://backend-zff7duw2vq-uc.a.run.app/api' : (process.env.NODE_ENV == 'pre_production' ? 'https://backend-pre-production-zff7duw2vq-rj.a.run.app/api' : 'http://localhost:3003/api'),
    OAPI_URL: process.env.NODE_ENV == 'production' ? 'https://backend-zff7duw2vq-uc.a.run.app/oapi' : (process.env.NODE_ENV == 'pre_production' ? 'https://backend-pre-production-zff7duw2vq-rj.a.run.app/oapi' : 'http://localhost:3003/oapi')
}