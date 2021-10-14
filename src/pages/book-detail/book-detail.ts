import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, Config } from 'ionic-angular';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@IonicPage()
@Component({
  selector: 'page-book-detail',
  templateUrl: 'book-detail.html',
})
export class BookDetailPage implements OnDestroy{
  apiKey: string = 'YOUR_API_KEY';
  item: any;
  status: number;
  displayBook: boolean = true;
  errMsg: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient) {
    let bookID = this.navParams.get('bookID');
    this.searchForBooks(bookID);    
  }

  ngOnDestroy(){
  
  }
  
  // Renders an error message
  showError(msg: string) {
    const html = `<p class="error">${msg}</p>`;
    document.querySelector('#result-book').innerHTML = html;
  }

  // back to book list page
  goBack(){
    this.navCtrl.pop();
  }

  //get book json data. get error if there is one
  searchForBooks(id: string) {
    this.getConfigResponse(id)
      .subscribe(
        (resp: any) => {
          this.item = resp.body.volumeInfo; 
          this.displayBook = true },
        error => {
          this.displayBook = false;
          if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.          
            this.errMsg = 'A client-side or network error occurred.:' + error.error.message;
          } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            let info = JSON.stringify(error.error)
            this.errMsg = `Backend returned code ${error.status}, ` + `body was: ` + info;
          }
          this.showError(this.errMsg);
        }
      );
        
  }

  getConfigResponse(bookID: string): Observable<HttpResponse<Config>> {
    let url = 'https://www.googleapis.com/books/v1/volumes/' + bookID + '?key=' + this.apiKey;
    return this.http.get<Config>( url, { observe: 'response' });
  }

}
