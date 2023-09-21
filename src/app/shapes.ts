

export interface shapeInfo {
  x: string,
  y: string,
  color?: string
}

export abstract class Shape {

  public x: number;
  public y: number;
  public name: string;

  constructor(x: number, y: number, name: string) {
    this.x = x;
    this.y = y;
    this.name = name
  }

  abstract setColor(color: string) ;

  abstract contains(x: number, y: number): boolean;

}

export class Rectangle extends Shape {
  contains(x: number, y: number): boolean {
    return x >= this.x && x <= this.x + this.width &&
           y >= this.y && y <= this.y + this.height;
}
  constructor(public override x: number, public override y: number, public width: number, public height: number, public color?: string) {
    super(x,y, 'Rectangle' );
  }

  setColor(color: string){
    this.color = color;
  }


  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

}

export class Circle extends Shape {
  constructor(public override x: number, public override y: number, public radius: number, public color?: string) {
    super(x,y, 'Circle' );

  }

  setColor(color: string){
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  contains(x: number, y: number): boolean {
    const dx = this.x - x;
    const dy = this.y - y;
    return dx * dx + dy * dy <= this.radius * this.radius;
}
}

export class Line extends Shape {
  constructor(public startX: number, public startY: number, public endX: number, public endY: number, public color?: string) {
    super(startX,startY, 'Line');
  }

  setColor(color: string){
    this.color = color;
  }



  contains(x: number, y: number): boolean {
    // tricky
    return false;

  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();
  }
}

