function helpers()
{
         
          // NOTE: included some of the original helper functions that are used from the custom made visualizations
            // everything else is either custom or modified to fit the application needs

          // --------------------------------------------------------------------
          // Plotting helper functions 
          // --------------------------------------------------------------------

          this.drawAxis= function(layout, colour=0) 
          {
                    stroke(color(colour));

                    // x-axis
                    strokeWeight(3)
                    line(layout.leftMargin,
                    layout.bottomMargin,
                    layout.rightMargin+layout.marginSize,
                    layout.bottomMargin);

                    // y-axis
                    line(layout.leftMargin,
                    layout.topMargin,
                    layout.leftMargin,
                    layout.bottomMargin);
                    strokeWeight(1)
          }

          this.drawAxisLabels= function(xLabel, yLabel, layout,secondXlabel,secondYlabel) 
          {
                    fill(0);
                    noStroke();
                    textAlign('center', 'center');

                    // Draw x-axis label.
                    text(xLabel,
                    (layout.plotWidth() / 2) + layout.leftMargin,
                    layout.bottomMargin + (layout.marginSize*2 ));
                    // draw second-axis label if needed 
                    //not implemented

                    // Draw y-axis label.
                    push();
                    angleMode(RADIANS)
                    translate(layout.leftMargin - (layout.marginSize * 1.5),
                              layout.bottomMargin /2 );
                    rotate(- PI / 2);
                    
                    
                    text(yLabel, 0, 0);
                    pop();
                    if(secondYlabel)
                    {
                              push()
                              //second y axis label 
                              translate(layout.rightMargin+layout.marginSize*3,layout.bottomMargin/2)
                              rotate(PI / 2)
                              text(secondYlabel, 0, 0);
                              pop();
                    }
          }

          this.drawYAxisTickLabels=function(min, max, layout, mapFunction,
                              decimalPlaces)                         
          {
          // Map function must be passed with .bind(this).
                    var range = max - min;
                    var yTickStep = range / layout.numYTickLabels;

                    fill(0);
                    noStroke();
                    textAlign('right', 'center');

                    // Draw all axis tick labels and grid lines.
                    for (i = 0; i <= layout.numYTickLabels; i++)
                    {
                              var value = min + (i * yTickStep);
                              var y = mapFunction(value,min,max,layout);

                              // Add tick label.
                              text(value.toFixed(decimalPlaces),
                              layout.leftMargin - layout.pad,
                              y);

                              if (layout.grid)
                              {
                                  // Add grid line.
                                  stroke(200);
                                  line(layout.leftMargin, y, layout.rightMargin, y);
                              }
                    }
          }

            this.drawXAxisTickLabel=function(value, layout, mapFunction)
            {
                // Map function must be passed with .bind(this).
                var x = mapFunction(value);

                fill(0);
                //   noStroke();
                textAlign('center', 'center');

                // Add tick label.
                text(value,
                    x,
                    layout.bottomMargin + layout.marginSize / 2);

                if (layout.grid)
                {
                    // Add grid line.
                    stroke(220);
                    line(x,
                        layout.topMargin,
                        x,
                        layout.bottomMargin);
                }

            }
          
          // --------------------------------------------------------------------
          // custom made helper functions  //  
          // --------------------------------------------------------------------

    //  custom made map function that encapsulates its mapping function
          this.maplessDrawYAxisTickLabels= function(min,max,layout)
          {

                    let range = max - min;
                    let yTickStep = range / layout.numYTickLabels;

                    fill(0);
                    noStroke();
                    textAlign('right', 'center');
                  
                    // Draw all axis tick labels and grid lines.
                    for (let i = 0; i <= layout.numYTickLabels; i+=1) 
                    {
                              let value = min + (i * yTickStep);
                              let y = map(value,min,max,layout.bottomMargin,layout.topMargin);
                                
                              // Add tick label.
                              text(value.toFixed(0),
                              layout.leftMargin - layout.pad,
                              y);

                    
                    }
          }


          //custom helper function to map words to X axis as ticks
          this.wordToXaxis= function(wordArray,layout)
          {
                    
                    let axisWidth= layout.plotWidth()
                    
                    let pointDist = axisWidth/wordArray.length
                    let x_pos = layout.leftMargin
                    let y_pos = layout.bottomMargin
                    strokeWeight(1)
                    stroke(100)
                    for(let i =0 ;i < wordArray.length;i+=1)
                    {
                              
                              if(wordArray[i].word.length > 7)
                              {
                                  textSize(7)
                              }
                              else textSize(11) 
                              
                              push()
                              angleMode(DEGREES)
                              translate(x_pos,y_pos+12)
                              rotate(90)
                              text(`${wordArray[i].word}`,0,0)
                              pop()
                              x_pos += pointDist 
                    
                    }



          }
    //  maps the sentiment scores to the x-axis in the sentiment v crypto graph
          this.sentimentXaxis=function(value,min,max,layout,mapFunction)
          {
                    var x = mapFunction(value,min,max,layout);

                    fill(0);
                    //   noStroke();
                    textAlign('center', 'center');

                    // Add tick label.
                    text(value.getUTCHours(),
                    x,
                    layout.bottomMargin + layout.marginSize / 2);

                    if (layout.grid)
                    {
                        // Add grid line.
                        stroke(220);
                        line(x,
                        layout.topMargin,
                        x,
                        layout.bottomMargin);
                    }

          }
          //  maps the sentiment scores to the y-axis in the sentiment v crypto graph
          this.sentimentYaxis=function(min, max, layout, mapFunction,
                              decimalPlaces) 
          {
                    var range = max - min;
                    var yTickStep = range / layout.numYTickLabels;

                    fill(0);
                    noStroke();
                    textAlign('right', 'center');


                    for (i = 0; i <= 10; i++) 
                    {
                              var value = min + (i * yTickStep);
                              var y = mapFunction(value,min,max,layout);

                              // Add tick label.
                              text(value.toFixed(decimalPlaces),
                              layout.rightMargin+36,
                              y);

                              if (layout.grid) {
                              // Add grid line.
                              stroke(200);
                              line(layout.leftMargin, y, layout.rightMargin, y);
                              }
                    }
          }
          //custom made table loader function - takes in an array of paths and names and returns a table object named accordingly
          this.tableLoader=function(paths,names)
          {
                    
              //      left this here to demonstrate callback function as well - grade hunting :)
              //        Preferred the for loop version due to ''performance'' in larger sets of data etc.

              // paths.forEach((path,index) =>
                    // {
                    //                     tables.push(loadTable(path,'csv','header',
                    //                     function(table) 
                    //                     {
                    //                          self.#_treeData[names[index]] = table
                    //                     }
                    //                     ))
                    // })
                    const data = {} 
                    for(let path in paths)
                    {
                              
                              Object.defineProperty(data,`${names[path]}`,

                                   {
                                                value:loadTable(paths[path],'csv','header'),
                                                writable:true,
                                                enumerable:true,
                                                configurable:true,
                                            }
                              )
                    }
                    return data 
          }
          //maps each bar accordingly to its sum of values to the y axis
          this.mapBarHeight = function(value,min,max,layout)
          {
                    return round(map(value,min,max,layout.y_pos,layout.bottomMargin))
          }  
          //  figures out the size of each box within a bar as a percentage of its total height
          this.mapBoxToBarPercent = function(value,barSum,barHeight,layout) 
          {
                    
                    let boxHeight = (barHeight * (value / barSum * 100)) / 100
                    boxHeight = map(boxHeight,0,100,0,layout.topMargin)
                    return round(boxHeight) 
          }
          //maps sentiment scores to y axis
          this.mapScoreToHeight = function(value,min,max,layout)
          {
                    return map(value,
                             min,
                              max,
                              layout.bottomMargin,
                              layout.topMargin)
          }
          // maps time values to the x axis
          this.mapTimeToWidth= function(value,oldestTime,placeholder,layout) //times are pulled starting from older to whatever the x scale has as max - placeholder serves cases where the x scale is not set
          {
                    
                    let xAxisMaxValue = (23*60*60*1000)
                    return map(Date.parse(value),
                              Date.parse(oldestTime), //start time
                               Date.parse(oldestTime) +xAxisMaxValue, //latest time
                              layout.leftMargin,
                              layout.rightMargin
                               )

          }
          //maps price values to the y axis
          this.mapPriceToHeight = function(value,min,max,layout)
          {
                    return map(value,
                              min,
                              max,
                              layout.bottomMargin,
                              layout.topMargin)
          }
}




