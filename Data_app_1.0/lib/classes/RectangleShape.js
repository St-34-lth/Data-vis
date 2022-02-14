class RectShape
{
          
          //base class for rectangle shapes 

          // private properties
          #_rectX;
          #_rectY
          #_rectWidth
          #_rectHeight
          #_rectColor
          #_rectData
          
          constructor(rectX,rectY,rectWidth,rectHeight,rectColor,rectData) 
          {
                    this.#_rectX = rectX
                    this.#_rectY = rectY
                    this.#_rectWidth = rectWidth
                    this.#_rectHeight =rectHeight
                    this.#_rectColor = rectColor
                    this.#_rectData = rectData
          }

          //getters for private properties 
          get rectX()
          {
                    return this.#_rectX
          }

          get rectY()
          {
                    return this.#_rectY
          }
          
          get rectWidth()
          {
                    return this.#_rectWidth 
          }

          get rectHeight()
          {
                    return this.#_rectHeight
          }

          get rectColor() 
          {
                    return this.#_rectColor 
          }

          
          get rectData()
          {
                    return this.#_rectData
          }
          //checks if the mouse is within the bounds of the rectangle
          withinBounds(inputX,inputY)
          {
                    let rightBoundary = this.#_rectX +this.#_rectWidth 
                    let leftBoundary = this.#_rectX
                    let topBoundary = this.#_rectY
                    let bottomBoundary = this.#_rectY + this.#_rectHeight

                    if((inputX>=leftBoundary && inputX <=rightBoundary) && (inputY>=topBoundary && inputY<= bottomBoundary)) 
                    {
                              return true
                    }
                    else 
                    {
                              return false
                    } 
          }
          // draws the object
          plot()
          {
                    fill(this.#_rectColor)
                    rect(this.#_rectX,this.#_rectY,this.#_rectWidth,this.#_rectHeight);
          }
         //wrapper function for withinBounds
          hoverEffect(inputX,inputY)
          {
                    if(this.withinBounds(inputX,inputY))
                    {
                              
                              return true 
                    }
                    
          }
         
}
