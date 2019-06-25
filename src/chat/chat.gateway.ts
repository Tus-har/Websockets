import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import {Socket} from "socket.io";

interface User  {
    username: string ,
    socketID: string ,
}

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

    @WebSocketServer() server ;
    users: User[] = [];

    async handleConnection(client: Socket) {
        const user: User = {username : client.handshake.query.username, socketID : client.id} ;
        console.log(user,"handle connection");
        this.users.push(user) ;
        this.server.to(client).emit('UserSnapshot',this.users);
        client.broadcast.emit('UserUpdateAdd',user) ;
    }
    async handleDisconnect(client : Socket){
        const index=this.users.findIndex( (user) => user.socketID ===client.id) ;
        this.server.emit('UpdateUserRemove',this.users[index]);
        this.users.splice(index,1);
    }

    @SubscribeMessage('broadcastMessage')
    onChat(client : Socket , msg : string){
        const index = this.users.findIndex((e)=> e.socketID === client.id ) ;
        const username=this.users[index].username ;
        this.server.emit('globalChat',  username + " : "+ msg);
    }
    @SubscribeMessage('PtoP')
    onPersonalChat(client : Socket , message ){
        const { receiver , msg , Username } = JSON.parse(message);
        this.server.to(receiver).emit('Pmsg', JSON.stringify({ msg , Username }));
    }

}
