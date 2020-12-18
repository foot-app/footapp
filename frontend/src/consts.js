export default {
    API_URL: process.env.NODE_ENV == 'production' ? 'https://backend-zff7duw2vq-uc.a.run.app/api' : (process.env.NODE_ENV == 'pre_production' ? 'https://backend-pre-production-zff7duw2vq-rj.a.run.app/api' : 'http://localhost:3003/api'),
    OAPI_URL: process.env.NODE_ENV == 'production' ? 'https://backend-zff7duw2vq-uc.a.run.app/oapi' : (process.env.NODE_ENV == 'pre_production' ? 'https://backend-pre-production-zff7duw2vq-rj.a.run.app/oapi' : 'http://localhost:3003/oapi'),
    PROFILE_PICTURE_DEFAULT: 'https://firebasestorage.googleapis.com/v0/b/footapp-frontend.appspot.com/o/images%2Fprofile.png?alt=media&token=8e0fe27a-7ad4-44b1-884e-9b14b92e791f'
}