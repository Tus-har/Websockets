import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat/chat.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(ChatModule);
    app.useStaticAssets(join(__dirname, '..', 'public'));
    await app.listen(5000);
}
bootstrap();
