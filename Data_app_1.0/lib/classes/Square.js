
class Square extends RectShape
{
          // Class to hold and provide functionality to a map's rectangles and data
          
          //private properties
          #_rectangles= [] 
          #_tooltip = new Clickable() 
          #_treemapTitle
          //the class inherits from RectShape basic dimension properties and some basic methods (some methods are overwrriten below) 
          constructor(rectX,rectY,rectWidth,rectHeight,rectData,rectTitle)
          {
                    
                    super(rectX,rectY,rectWidth,rectHeight,null,rectData)
                    //Specify tooltip details
                    this.#_tooltip.width=200
                    this.#_tooltip.height=125
                    this.#_tooltip.x = this.rectWidth
                    this.#_tooltip.y = this.rectY
                    this.#_tooltip.textSize = 10;
                    this.#_tooltip.text = 'Please hover over a country'
                    this.#_tooltip.color = this.rectY > 400 ? ("red") : ("green")
                    this.#_tooltip.textColor=('black')
                    this.#_treemapTitle=rectTitle

          }
          //method to add rectShape objects in the array
          addRectangles()
          {
                    //rectangle's details 
                    let rectColors =['blue','red','magenta','yellow',"orange","purple"]
                    let rectColor;
                    let rectX = this.rectX
                    let rectY = this.rectY
                    let rectHeight = 0 
                    let rectWidth =0 
                    let rectData 
                    //squarify algorithm instance returns array of dimensions for each rectangle
                    let TreeLayout = Treemap.getTreemap({
                                        data: this.rectData, //must be passed as an array 
                                        width:this.rectWidth, 
                                        height: this.rectHeight,
                              });
                    //loop  creates as many rectangle objects as necessary to fill the treemap
                    //each rectangle is initialized with coordinates,size color and its data 
                    for(let i=0;i<TreeLayout.length;i++)
                    {
                              rectX = TreeLayout[i].x+this.rectX
                              rectY= TreeLayout[i].y+this.rectY
                              rectWidth =  TreeLayout[i].width
                              rectHeight = TreeLayout[i].height
                              rectColor = rectColors[i%rectColors.length]
                              rectData = TreeLayout[i].data
                             
                              this.#_rectangles.push(new RectShape(rectX,rectY,rectWidth,rectHeight,rectColor,rectData))
 
                    }
                    
          }

          plot()
          {
                    push()
                    fill(0)
                    strokeWeight(1)
                    textSize(12)
                    //displays the title given for the treemap
                    text(`${ this.#_treemapTitle}`,this.rectX+100,this.rectY-12)
                    //loops over rectangleShape object array and draws 
                    for(let i=0;i<this.#_rectangles.length;i+=1)
                    {
                             
                              //checks each rectangleShape object and display's its data 
                              if(this.#_rectangles[i].hoverEffect(mouseX,mouseY))
                              {
                                        this.#_tooltip.text = `${this.#_rectangles[i].rectData.country}\n${this.#_rectangles[i].rectData.value}`
                                        this.countryShown = this.#_rectangles[i].rectData.country
                                        
                                        this.#_tooltip.draw()
                              }
                              this.#_rectangles[i].plot()
                              
                              
                    }
                    pop()
          }
          showsCountry(flag)
          {
                    return true 
          }
          //decides which rectangle is shown in the tooltip 
          showRectangle(country)
          {
                    let tooltipText = this.findRectByCountry(country) 
                    this.#_tooltip.draw() 
                    this.defineTooltipText(tooltipText)
          }
          //defines the tooltip text 
          defineTooltipText(txt)
          {
                    if (txt!=undefined)
                    {          
                              this.#_tooltip.color = rectangles
                              this.#_tooltip.text =txt
                    }
                    else if (txt!= undefined && txt!='Please hover over a country' )
                    {
                             
                             this.#_tooltip.text =txt
                    }
                    
          }
          //returns the index of a rectangle  
          findRectByCountry(country)
          {
                    return this.#_rectangles.find(_rectCountry =>_rectCountry ==country)
          }

}
