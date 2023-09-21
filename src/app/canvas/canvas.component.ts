import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  inject,
  effect,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService } from 'src/app/store.service';
import { Circle, Line, Rectangle, Shape } from 'src/app/shapes';
import { CanvasState } from 'src/app/toolbox/toolbox.component';
import { CursorDirective } from 'src/app/cursor.directive';
import { tap } from 'rxjs';

@Component({
  selector: 'app-canvas',
  standalone: true,
  imports: [CommonModule, CursorDirective],
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnDestroy {
  @ViewChild('drawingCanvas') canvas: ElementRef<HTMLCanvasElement>;

  ngOnDestroy(): void {
   this.redrawRequest$.unsubscribe()
  }

  private ctx: CanvasRenderingContext2D;
  private drawing: boolean = false;
  public store = inject(StoreService);

  currentTool = this.store.currentTool;
  color = this.store.currentColor;
  currentShape = this.store.selectedShape;
  dragging: boolean = false;

  drawingLine: boolean = false;
  draggedShape: Shape = null;

  offsetX: number = 0;
  offsetY: number = 0;

  startX: number = 0;
  startY: number = 0;

  // redraw trigger
  redrawRequest$ = this.store.redrawRequest$.pipe(
    tap( () => this.redrawCanvas() )
  ).subscribe()

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  mouseDown(event: MouseEvent) {
    this.startX = event.clientX - this.canvas.nativeElement.offsetLeft;
    this.startY = event.clientY - this.canvas.nativeElement.offsetTop;

    // set mode
    if (this.currentTool() === CanvasState.DRAGGING) {
      this.dragAndDrop(event);
      //drag and drop mode
    } else {
      //shape mode
      this.handleShapeCreation(event);
    }
  }

  dragAndDrop(event: MouseEvent) {
    const mouseX = event.clientX - this.canvas.nativeElement.offsetLeft;
    const mouseY = event.clientY - this.canvas.nativeElement.offsetTop;

    this.draggedShape = this.store.shapes.find((shape) =>
      shape.contains(mouseX, mouseY)
    );
    if (this.draggedShape) {
      this.store.selectedShape.set(this.draggedShape);
      this.dragging = true;
      this.offsetX = mouseX - this.draggedShape.x;
      this.offsetY = mouseY - this.draggedShape.y;
    } else {
      //clear selection
      this.store.selectedShape.set(null);
    }
  }

  mouseMove(event: MouseEvent) {
    if (this.store.drawingLine()) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      for (const shape of this.store.shapes) {
        shape.draw(this.ctx);
      }

      const endX = event.clientX - this.canvas.nativeElement.offsetLeft;
      const endY = event.clientY - this.canvas.nativeElement.offsetTop;

      this.ctx.beginPath();
      this.ctx.moveTo(this.startX, this.startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
    }

    if (this.dragging && this.draggedShape) {
      const mouseX = event.clientX - this.canvas.nativeElement.offsetLeft;
      const mouseY = event.clientY - this.canvas.nativeElement.offsetTop;
      this.draggedShape.x = mouseX - this.offsetX;
      this.draggedShape.y = mouseY - this.offsetY;
      this.redrawCanvas();
    }

    if (!this.drawing) return;
    this.ctx.lineTo(
      event.clientX - this.canvas.nativeElement.offsetLeft,
      event.clientY - this.canvas.nativeElement.offsetTop
    );
    this.ctx.stroke();
  }

  redrawCanvas() {
    console.log('redraw canvas');
    this.ctx.clearRect(
      0,
      0,
      this.canvas.nativeElement.width,
      this.canvas.nativeElement.height
    );
    for (const shape of this.store.shapes) {
      shape.draw(this.ctx);
    }
  }

  mouseUp(event: MouseEvent) {
    if (this.store.drawingLine()) {
      const endX = event.clientX - this.canvas.nativeElement.offsetLeft;
      const endY = event.clientY - this.canvas.nativeElement.offsetTop;

      const line = new Line(this.startX, this.startY, endX, endY);
      this.store.shapes.push(line);
      this.redrawCanvas();
      this.drawingLine = false;
      // this.store.currentTool.set(CanvasState.DRAGGING)
    }

    this.drawing = false;
    this.draggedShape = null;
    this.ctx.closePath();
  }

  handleShapeCreation(event: MouseEvent) {
    let shapeType = this.store.currentTool();
    const size = 50;
    let shape: Rectangle | Circle | Line;

    const color = this.store.currentColor();
    console.log('color', color);

    const x = event.clientX - this.canvas.nativeElement.offsetLeft;
    const y = event.clientY - this.canvas.nativeElement.offsetTop;

    switch (shapeType) {
      case 'rectangle':
        shape = new Rectangle(x - size / 2, y - size / 2, size, size, color);
        break;
      case 'circle':
        shape = new Circle(x, y, size, color);
        break;
      default:
        return;
    }

    shape.draw(this.ctx);
    this.store.shapes.push(shape);
    //after creating shape user probably want to move it
    this.store.currentTool.set('drag_drop');
  }
}
