import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ToolboxComponent } from 'src/app/toolbox/toolbox.component';
import { CanvasComponent } from 'src/app/canvas/canvas.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, ToolboxComponent, CanvasComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gokberk-canvass';
}
