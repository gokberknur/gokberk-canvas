import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreService, mainColors } from 'src/app/store.service';
import {MatIconModule} from '@angular/material/icon';
import { IconPipePipe } from 'src/app/icon-pipe.pipe';

export enum CanvasState {
  RECTANGLE = 'rectangle',
  CIRCLE = 'circle',
  DRAGGING = 'drag_drop',
  DRAWING_LINE = 'line'
}

@Component({
  selector: 'app-toolbox',
  standalone: true,
  imports: [CommonModule,MatIconModule, IconPipePipe ],
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.scss']
})
export class ToolboxComponent {

  private ctx: CanvasRenderingContext2D;

  public store= inject(StoreService);
  toolbox: string[] = Object.values(CanvasState);
  colors: string[] = this.store.colorKeys
  colorCodes = mainColors

  selectTool(tool: string){
    console.log(tool, 'selected');
    this.store.currentTool.set(tool);
  }

  selectColor(color: string){
    if(this.store.selectedShape()) {
      let shape = this.store.selectedShape();
      shape.setColor(color);
      this.store.redrawRequest.next();
    }
    this.store.currentColor.set(color)
  }
}
