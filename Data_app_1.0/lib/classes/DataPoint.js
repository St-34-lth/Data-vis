class dataPoint 
{
          // the dataPoint class is used to plot and highlight points on a graph. It also contains a method to display data on hover if required 
          constructor(x_pos, y_pos, dataTextA,dataTextB, color,weight)
          {

                    this.x = x_pos
                    this.y = y_pos
                    this.dataTextA = dataTextA
                    this.dataTextB = dataTextB == undefined ? null : dataTextB 
                    this.color= color || 'red'
                    this.weight = weight
          }
                    
                    plot()
                    {
                                push()
                              stroke(this.color);
                                strokeWeight(this.weight>0 ? this.weight : 10);
                              point(this.x, this.y);
                                noStroke()

                              strokeWeight(1)
                                pop()
                    }
                    
                    hoverDisplay(inputX, inputY) 
                    {

                              if (dist(inputX, inputY, this.x, this.y) <= 5) 
                              {

                                        text(`${this.dataTextA}\n${this.dataTextB}`, this.x, this.y - 30);

                              }
                    }

                    getX(){
                              return this.x;
                    }
                    getY(){
                              return this.y;
                    } 
}