function PieChart(x, y, diameter,doughnutFlag) {
          this.x = x;
          this.y = y;
          this.diameter = diameter;
          this.labelSpace = 30;
          this.doughtnutFlag = doughnutFlag;
          this.angles;
          this.sectors = [] 
          var data; 
          this.get_radians = function (data) {
                    var total = sum(data);
                    var radians = [];

                    for (let i = 0; i < data.length; i++) {
                              radians.push((data[ i ] / total) * TWO_PI);
                              
                    }

                    return radians;
          };

          this.draw = function (data, labels, colours, title) {
                    // Test that data is not empty and that each input array is the
                    // same length.
                    data =data 
                    if (data.length == 0) 
                    {
                              alert("Data has length zero!");
                    } 
                    else if (![ labels, colours ].every((array) => 
                                        {
                                                  return array.length == data.length;
                                        }
                              )
                    ) 
                    {
                              alert(`Data (length: ${data.length})
                              Labels (length: ${labels.length})
                              Colours (length: ${colours.length})
                              Arrays must be the same length!`);
                    }

                    // https://p5js.org/examples/form-pie-chart.html

                    this.angles = this.get_radians(data);
                    var lastAngle = 0;
                    var colour;


                    
                    for (var i = 0; i < data.length; i++) 
                    {
                              
                              if (colours) 
                              {
                                        colour = colours[ i ];
                              } 
                              else 
                              {
                                        colour = map(i, 0, data.length, 0, 255);
                              }

                              fill(colour);
                              stroke(0);
                              strokeWeight(1);
                              
                              arc(
                                        this.x,
                                        this.y,
                                        this.diameter,
                                        this.diameter,
                                        lastAngle,
                                        lastAngle + this.angles[ i ] + 0.001
                              ); // Hack for 0!
                              
                              // Hack for doughnut chart !
                              if(this.doughtnutFlag)
                              {
                                        push()
                                        fill(255)
                                        angleMode(DEGREES) 
                                        arc(
                                                  this.x,
                                                  this.y, 
                                                  this.diameter/2,
                                                  this.diameter/2,
                                                  0,
                                                  360
                                        )
                                        angleMode(RADIANS) 
                                        pop()
                              }
                              if (labels) 
                              {
                                        this.makeLegendItem(labels[ i ], i, colour);
                              }

                              let sector= 
                              {
                                        start:lastAngle,
                                        end:lastAngle+this.angles[i],
                                        color:colour 
                              }
                              if(this.sectors.length<this.angles.length &&  !isNaN(sector.start) && !isNaN(sector.end) )
                              {
                                        this.sectors.push(sector)
                              }
                              lastAngle += this.angles[ i ];
                              
                    }

                    if (title) {
                              noStroke();
                              textAlign("center", "center");
                              textSize(24);
                              text(title, this.x, this.y - this.diameter * 0.6);
                    }

                    for(let i =0;i<this.sectors.length;i+=1)
                    {
                              if((this.sectors[i].end- this.sectors[i].start)<=0) continue
                              else if(this.isInsideSector(loc={x:mouseX,y:mouseY},this.sectors[i].start,this.sectors[i].end))
                              {
                                        
                                        
                                        text(data[i],this.x,this.y)
                                        
                              }
                    }
          };

          this.makeLegendItem = function (label, i, colour) {
                    var x = this.x + 50 + this.diameter / 2;
                    var y = this.y + this.labelSpace * i - this.diameter / 3;
                    var boxWidth = this.labelSpace / 2;
                    var boxHeight = this.labelSpace / 2;

                    fill(colour);
                    rect(x, y, boxWidth, boxHeight);

                    fill("black");
                    noStroke();
                    textAlign("left", "center");
                    textSize(12);
                    text(label, x + boxWidth + 10, y + boxWidth / 2);
          };
          this.toDegrees= function(radians)
          {
                    let degrees = radians * (180/PI)

                    return degrees  
                                                 
          }
         
          //adapted from rudigerkidd on fullstack exchange https://stackoverflow.com/questions/23712191/if-mouse-is-inside-circle-sector 
          //Checks whether mouse is inside a sector of the doughnut/pie and displays the corresponding data in its middle
          this.isInsideSector=function(point,angle1,angle2) 
          
          {
                    var radius = this.diameter/2
                    var center = {x:this.x,y:this.y}

                    function areClockwise( angle, point2) 
                    {
                              let point1 = 
                              {
                                        x : (center.x + radius) * Math.cos(angle),
                                        y : (center.y + radius) * Math.sin(angle)
                              };
                              return -point1.x*point2.y + point1.y*point2.x > 0;
                    }

                    let relPoint = 
                    {
                              x: point.x - center.x,
                              y: point.y - center.y
                    };

                    return !areClockwise( angle1, relPoint) &&
                    areClockwise(angle2, relPoint) &&
                    (relPoint.x*relPoint.x + relPoint.y*relPoint.y <= radius * radius);
          }

}
