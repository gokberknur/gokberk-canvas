import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { StoreService } from 'src/app/store.service';

@Directive({
  selector: '[appCursor]',
  standalone: true
})
export class CursorDirective {

  constructor(private el: ElementRef<HTMLCanvasElement>, private renderer: Renderer2, private store: StoreService) {
  }

  @HostListener('mousemove', ['$event'])
  onMouseOver(event: MouseEvent) {

    const mouseX = event.clientX - this.el.nativeElement.offsetLeft;
    const mouseY = event.clientY - this.el.nativeElement.offsetTop;

    const hoveredShape = this.store.shapes.find((shape) => shape.contains(mouseX, mouseY));

    if (hoveredShape) {
        this.renderer.setStyle(this.el.nativeElement, 'cursor', 'grab');
        hoveredShape.highlighted = true;
    }
    else {
      this.renderer.setStyle(this.el.nativeElement, 'cursor', 'default');

    }
  }



}
