import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() label: string;
  @Input() disabled: boolean;
  @Output() ClickEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  click() {
    this.ClickEvent.emit();
  }

}
