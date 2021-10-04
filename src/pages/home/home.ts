import { Component } from '@angular/core';
import { NavController, Config } from 'ionic-angular';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BookDetailPage } from '../book-detail/book-detail';
import { Observable } from 'rxjs';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  apiKey: string = 'YOUR_API_KEY';
  searchTerms: string = '';
  totalItems: number = 0;
  items: any = [];
  displayBook: boolean = true;
  errMsg: string;
  status: number;
  allSearchTerms: any = [];
  usedTerms: string = '';

  constructor(public navCtrl: NavController, private http: HttpClient) {

  }

  // Renders an error message
  showError(msg: string) {
    const html = `<li><p class="error">${msg}</p></li>`;
    document.querySelector('#results').innerHTML = html;
  }


  findBooks(){
    this.searchForBooks(this.searchTerms, true);
  }

  oldTerm(){
    this.searchForBooks(this.usedTerms, false);
  }

   //get book json data. get error if there is one
  searchForBooks(terms: string, addTerm: boolean){
    this.getConfigResponse(terms)
        .subscribe((res: any) =>{
          console.log(res);
          this.totalItems = res.body.totalItems;
          this.items = res.body.items;
          if(addTerm){
            let termAndResults = { term: this.searchTerms, num: this.totalItems};
            this.allSearchTerms.push(termAndResults);
          }          
          this.displayBook = true;
        },
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
        });  
  }

  deleteTerms(){
    this.allSearchTerms = [];
    this.usedTerms = '';
    this.searchTerms = '';
  }

  getConfigResponse(terms: string): Observable<HttpResponse<Config>> {
    let query = encodeURIComponent(terms);
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    url = url + query + '&maxResults=30&startIndex=0'+ '&key=' + this.apiKey;
    return this.http.get<Config>( url, { observe: 'response' });
  }

  getBookDetail(id: string){
    this.navCtrl.push(BookDetailPage, {bookID: id});
  }

}
