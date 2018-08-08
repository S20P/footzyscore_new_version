import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MatchesApiService {
  socket: any;
  SocketPath: any;


  constructor() {

    this.SocketPath = 'https://api.footzyscore.com/v2/socket.io';
    // this.SocketPath = "https://6bef51bd.ngrok.io/"    //local socket url it for testing;
    this.socket = '';

    // this.socket = io.connect(this.SocketPath, {
    //   secure: true
    // });

    this.socket = io.connect('https://api.footzyscore.com', {
      path: "/v2/socket.io",
      secure: true
    });

    console.log("socket", this.socket);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });
    });
  }

  public sendMessage(message) {
    return this.socket.emit('SendSocketData', message);
  }

  public liveMatches() {
    return Observable.create((observer) => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });
    });

  }
}
