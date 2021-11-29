import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'Mod1b/node_modules/rxjs/dist/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  title = 'Mod1b';
  test = "nothing yet"
  readonly ROOT_URL = "https://api.postcodes.io/postcodes/"

  API_Return: any;
  postcodeFormControl = new FormControl('', [Validators.required]);

  constructor(private http: HttpClient) {

  }
  submit(){
    if (this.postcodeFormControl.valid == true){ // if the form is valid then do the next bunch of bits
      this.test = this.postcodeFormControl.value
      this.test = (this.test.replace(/\s/g, "")) //gets rid of the spaces in the form
      // http get set
      this.API_Return = this.http.get(this.ROOT_URL + this.test)
      console.log("requesting:", this.ROOT_URL + this.test, this.API_Return)
    } else { // if the form is not valid the do the next bunch of bits
      this.test = "Form not valid"
    }

  }
}
