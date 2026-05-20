"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
    return app;
}
let cachedApp;
exports.default = async (req, res) => {
    if (!cachedApp) {
        const app = await bootstrap();
        await app.init();
        cachedApp = app.getHttpAdapter().getInstance();
    }
    return cachedApp(req, res);
};
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    bootstrap().then(async (app) => {
        const port = process.env.PORT ?? 3000;
        await app.listen(port);
        console.log(`🚀 Ustaad API running on http://localhost:${port}/api`);
    });
}
//# sourceMappingURL=main.js.map