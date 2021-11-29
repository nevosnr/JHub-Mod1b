import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mod1b';
  test = "nothing yet"
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  submit(){
    this.test = (this.emailFormControl.value)
  }
}
