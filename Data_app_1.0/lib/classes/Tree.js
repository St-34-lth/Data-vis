class Tree
{
          //Class that implements the treemap visualization.
          // The tree class creates a tree based on data provided and populates it with rectangles holding each sub-set of data

          // private properties
          #_squares 
          #_visualization
          #_treeData
          constructor(visualization)
          {
                    this.#_visualization= visualization
                    this.name = this.#_visualization.name
                    this.id = this.#_visualization.id
                    this.layout = this.#_visualization.layout
                    this.#_squares = []
                    this.#_treeData = {} 
                    this.helpers={}
                    Object.assign(this.helpers, new helpers())
          }
          // loads the data  from the vis object
          preload() 
          {
                   
                    let nameList = ['forest', 'country']
                    this.#_treeData = this.helpers.tableLoader(this.#_visualization.dataPath,nameList) //custom made tableLoader function helper that automatically names the table according to the nameList
                   
                    this.forestLocations = this.#_treeData.forest 
                    this.countryCodes = this.#_treeData.country
          }
          // adds a ''square''(map) to the tree 
          //(named so because the tree map was originally to be square in shape but didnt fit the canvas well)
          addSquare(squareX,squareY,squareWidth,squareHeight,squareData,squareTitle)
          {
                    let _squareX = squareX
                    let _squareY = squareY
                    let _squareWidth = squareWidth
                    let _squareHeight = squareHeight
                    let _squareData = squareData
                    let _squareTitle = squareTitle
                    
                    let square = new Square(_squareX,_squareY,_squareWidth,_squareHeight,_squareData,_squareTitle)
                    square.addRectangles()
                    this.#_squares.push(square)

          }

          findCountry(countryIsoCode)
          {  
                    for(let i =0; i<this.countryCodes.rows.length;i+=1)
                    {
                             
                              if (String(this.countryCodes.rows[i].obj.iso)==String(countryIsoCode))
                              {
                                        return this.countryCodes.rows[i].obj.name
                              }
                    }
                    
          }
          setup()
          {
                    let squareX= this.#_visualization.x
                    let squareY = this.#_visualization.y 
                    let squareWidth= this.#_visualization.width
                    let squareHeight = this.#_visualization.height
                    let countryForests =[]
                    let countryAreas = []
                    let rawSquareData = this.forestLocations.rows


                    // associates each forest area size with a country and a color then pushes them to the countryForests  array  
                    rawSquareData.forEach((item,index) => 
                              {
                              
                                        countryForests.push(
                                                            {
                                                                      value:Number(item.obj.umd_tree_cover_extent_2010__ha) > 0 ? Number(item.obj.umd_tree_cover_extent_2010__ha) : 1 ,
                                                                      country:this.findCountry(item.obj.iso),
                                                                      color: color(index*(10%255),index*(2%255),index*(200%255))
                                                            }
                                                            )
                              }
                    )
                    //associates each country with its area size and a color then pushes them to the countryAreas array
                    rawSquareData.forEach((item,index) => 
                              {
                              
                                        countryAreas.push(
                                                            {
                                                                      value:Number(item.obj.area__ha) > 0 ? Number(item.obj.area__ha) : 1 ,
                                                                      country:this.findCountry(item.obj.iso),
                                                                      color: color(index*(10%255),index*(2%255),index*(200%255))
                                                            }
                                                            )
                              }
                    )
                    let squareGap=50

                    // adds the 'squares' to the tree 
                    this.addSquare(squareX,squareY,squareWidth,squareHeight/2,countryForests,'Forest area per country')
                    this.addSquare(squareX,squareY+squareHeight/2+squareGap,squareWidth,squareHeight/2,countryAreas,'Land area per country')
          }

          draw()
          {
                    push()
                    // draws each 'square' in the tree
                    for (let i =0; i<this.#_squares.length;i+=1)
                    {

            
                              this.#_squares[i].plot()
                              // displays the last country shown or a default message in the tooltip  
                              if(this.#_squares[i].showsCountry())
                              {
                                        this.#_squares[i].showRectangle(this.#_squares[i].countryShown)
                                        
                              }
                    
                    }
                    
                    pop()
          }
          destroy()
          {
                    this.#_squares = []
          }

}