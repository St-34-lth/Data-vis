class Bar extends RectShape
{
          // Class to represent a bar in the vistogram class. Uses RectShape as its base
          
          #_numBoxes
          #_barSum
          #_boxLosses
          #_textOffSet
          #_boxes
          #_boxWidth
          #_boxX
          #_boxY
          #_boxHeights
          
          constructor(rectX,rectY,rectWidth,rectHeight,rectColor,rectData,boxHeights)
          {
                     
                    super(rectX,rectY,rectWidth,rectHeight,rectColor,rectData)
                    
                    this.#_numBoxes = rectData.length
                    this.#_barSum = 0 
                    this.#_textOffSet = 10 
                    this.#_boxLosses = [] 
                    this.#_boxes = [] 
                    this.#_boxWidth = rectWidth 
                    this.#_boxX = rectX 
                    this.#_boxY = rectY
                    this.#_boxHeights = boxHeights

          }
          // private properties' getters
          get numBoxes()
          {
                    return this.#_numBoxes
          }

          get barSum()
          {
                    return this.#_barSum
          }

          get boxLosses()
          {
                    return this.#_boxLosses
          }

          get boxes()
          {
                    return this.#_boxes
          }
          
          get boxHeights()
          {
                    return this.#_boxHeights
          }
          
         get boxWidth()
         {
                   return this.#_boxWidth
         }
         get boxX() 
         {
                   return this.#_boxX
         }
          get boxY() 
         {
                   return this.#_boxY
         }

          
          plot()
          {
                    let barYear = this.rectData[0].obj.tree_cover_loss__year
                    let barYearX_pos = this.rectX+this.rectWidth/2+5
                    let barYearY_pos = this.rectY+20
                    // loops over the array containing the bar's boxes and draws them
                    if(this.#_boxes.length>0)
                    {
                              for(let box=0;box<this.#_boxes.length;box+=1)
                              {
                                        this.#_boxes[box].plot()
                                        this.#_boxes[box].hoverEffect(mouseX,mouseY) //checks if mouse position is over a box and displays box data below the bar 
                                        fill(0)
                                        text(barYear,barYearX_pos,barYearY_pos)
                                        push()
                                       
                                        textSize(10)
                                        text(this.#_barSum,this.rectX+this.rectWidth,this.rectY-this.rectHeight+this.#_textOffSet)
                                        pop()
                                        
                              }
                    }

          }
          // method adds boxes to the bar according to the number of data sets 
          addBoxes()
          {
                    
                    let boxColors =['blue','red','magenta','yellow',"orange","purple"]
                    let boxColor
                    
                    for(let i=0;i<this.#_numBoxes;i+=1)
                    
                    {
                              let treeLossValue = round(this.rectData[i].obj.tree_cover_loss_)
                              let treeLossType = this.rectData[i].obj.tree_cover_loss_drivers__type
                              this.#_boxLosses.push(treeLossValue)

                              let box;

                              // instantiating sequentially colored box objects to add to the bar
                              if(this.#_numBoxes>0) 
                              {
                                        boxColor= boxColors[i%boxColors.length]
                                        this.#_boxY -= this.#_boxHeights[i]    
                              }

                            
                              if(boxColor==undefined)
                              {
                                        box = new Box(this.rectX,this.rectY,this.#_boxX,this.#_boxY,this.#_boxWidth,this.#_boxHeights[i],`${treeLossValue}\n${treeLossType}`)
                                        this.#_boxes.push(box)
                              }
                              else
                              {
                                        box = new Box(this.rectX,this.rectY,this.#_boxX,this.#_boxY,this.#_boxWidth,this.#_boxHeights[i] ,boxColor,`${treeLossValue}\n${treeLossType}`)
                                        this.#_boxes.push(box)
                              }
                            
                            

                    }
                    this.#_barSum = round(sum(this.#_boxLosses))
                   
          }

}