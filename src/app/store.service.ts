import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Shape } from 'src/app/shapes';

export interface Colors {
  red: string;
  blue: string;
  green: string;
  yellow: string;
  orange: string;
  purple: string;
  brown: string;
}

export const mainColors: Colors = {
  red: '#FF0000',
  blue: '#0000FF',
  green: '#008000',
  yellow: '#FFFF00',
  orange: '#FFA500',
  purple: '#800080',
  brown: '#A52A2A'
};

@Injectable({
  providedIn: 'root'
})

export class StoreService {
  public redrawRequest = new Subject<void>();
  redrawRequest$ = this.redrawRequest.asObservable();

  shapes = [];

  selectedShape = signal<any>(null);

  colorKeys = Object.keys(mainColors);

  currentColor = signal<string>('red');

  currentTool = signal<string>('free');

  drawingLine = computed( () => this.currentTool() === 'line' )

  constructor() {
  }
}
