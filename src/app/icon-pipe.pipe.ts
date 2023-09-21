import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'iconPipe',
  standalone: true
})
export class IconPipePipe implements PipeTransform {

  transform(toolName: string, ...args: unknown[]): unknown {

    switch (toolName) {
      case 'rectangle':
      return 'check_box_outline_blank'
      break
      case 'circle':
        return 'radio_button_unchecked'
        break
        case 'drag_drop':
        return 'open_with'
        case 'line':
          return 'remove'
        break
      break
    }

    return null;
  }

}
