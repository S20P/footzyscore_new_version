import { Injectable } from '@angular/core';
import { AngularFireDatabase} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

import { AngularFireObject, AngularFireList } from 'angularfire2/database';


class Book {
  constructor(public title) { }
}



@Injectable()
export class AlbumService {
  albums:AngularFireList<any>;

  public books: AngularFireObject<Book[]>;

  constructor(private db: AngularFireDatabase) {
    this.albums = db.list('/albums');
   }
   getAlbums(){
    return this.albums;
  }
}
