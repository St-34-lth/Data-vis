class Box extends RectShape
{
          // The box class inherits from the base RectShape and is used in the bar class to create box objects  
          #_barX
          #_barY
          #_tooltip 
          //the box constructor takes in the parent bar and the x and y coordinates to create the box 
          constructor(barX,barY,boxX,boxY,boxWidth,boxHeight,boxColor,boxText)
          {
                    super(boxX,boxY,boxWidth,boxHeight,boxColor,boxText)
                    this.#_barX = barX;
                    this.#_barY = barY;
                    
                    this.#_tooltip = new Clickable()
                    this.#_tooltip.text = boxText
                    this.#_tooltip.width=150
                    this.#_tooltip.height=40
                    this.#_tooltip.x = this.#_barX- this.#_tooltip.width/4
                    this.#_tooltip.y = this.#_barY + this.#_tooltip.height/2 +5
                    this.#_tooltip.textSize = 10;
                    this.#_tooltip.textColor= boxColor =='blue' ? ('white') : ('black')
                    this.#_tooltip.color = boxColor

          }
          // getters for x and y properties of the bar parent class
          get barX()
          {
                    return this.#_barX
          }
          
          get barY()
          {
                    return this.#_barY
          }
          
          
          // overwrites the base hoverEffect to show the tooltip when hovered
          hoverEffect(inputX,inputY)
          {
                   
                    if(this.withinBounds(inputX,inputY))
                    {

                              this.#_tooltip.text
                              this.#_tooltip.draw()
                              
                    }
                    
          }
}