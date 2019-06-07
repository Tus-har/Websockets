import {Controller, Get} from '@nestjs/common';


@Controller()
export class ChatController {
    @Get(':id')
    get( ) : any {
        return 'Hello';
    }
}
