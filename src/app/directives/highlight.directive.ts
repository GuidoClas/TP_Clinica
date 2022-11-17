import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() color : string = "";
  private defaultColor : string = "rgb(255, 193, 7)";
  private previousColor : string = "";
  private inside: boolean = false;

  constructor(
    private el : ElementRef
  ) {
    this.previousColor = this.el.nativeElement.style.backgroundColor;
  }

  @HostListener('click')
  onClick () {
    this.inside = true;
    this.setBg( this.color || this.defaultColor, 'in' );
  }

  @HostListener('document:click')
  onBlur() {
    if (!this.inside) {
      this.setBg( this.previousColor, "out" );
    }
    this.inside = false;
  }

  private setBg( bg : string, type: string) {
    this.el.nativeElement.style.backgroundColor = bg;
    type == 'in' ? this.el.nativeElement.style.border="2px solid black" : this.el.nativeElement.style.border="0px";
  }

}
