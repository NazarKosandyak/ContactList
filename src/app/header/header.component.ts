import { Component, OnInit } from '@angular/core';
import { init } from 'ityped'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.ityped()
  }
  ityped(){
    const myElement  = document.querySelector('.test')
    init(myElement, {showCursor: true,typeSpeed:200,cursorChar: "|", strings: ['Hello', 'Have a nice day! :)' ] });
  }
}
