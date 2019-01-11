import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  	templateUrl: './not-found.html',
  	styleUrls: ['./not-found.scss']
})

// tslint:disable-next-line:component-class-suffix
export class NotFoundPage {


  	constructor(private location: Location) {
  	}

  	back(){
        this.location.back();
    }
}
