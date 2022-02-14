class Vistogram
{
          //Class to prepare contain and draw bar objects them in the vistogram visualization          
         
          // private properties
          #_bars = []
          #_maxBarsHeight = 0
          #_minBarsHeight = 0
          #_minBarsValue = 0
          #_maxBarsValue = 0
          #_barWidth = 0
          #_totalYears=[]
          #_barSums = []
          #_visualization
          #_table
          #_processedData
          
          constructor(visualization)
          {
                    this.#_visualization= visualization
                    this.name = this.#_visualization.name
                    this.id = this.#_visualization.id
                    this.layout = this.#_visualization.layout

                    // initialize a helper object to provide composition of helper functions 
                    this.helpers = {}
                    Object.assign(this.helpers, new helpers()) 
                    
                    
          }
          // preloads the provided data
          preload()
          {
                    //did not use my tableLoader helper because it's just one table
                    this.#_table = loadTable(this.#_visualization.dataPath[0],'csv','header')

          }
          setup()
          {
                    //break down the table's data into separate arrays
                    //    using a Set to first get the columns will leave only the unique values
                    this.#_totalYears = new Set(this.#_table.getColumn('tree_cover_loss__year'))
                    //casting the Set to an array for use
                    this.#_totalYears = Array.from(this.#_totalYears)
                    //set the bar width according to the layout and data provided
                    this.#_barWidth = (this.#_visualization.layout.plotWidth() / this.#_totalYears.length)
                    //calculates the number of bars and boxes contained in them according to the data
                    this.howManyBarsAndBoxes()
                    let gapBetweenBars=55
                    let barData;

                    //figures out how much data will go into the bar, then adds all of its data to a single sum
                    for(let year= 0;year<this.#_processedData.barsAcross.length;year+=1)
                    {          
                              
                              barData = this.#_table.findRows(this.#_totalYears[year],'tree_cover_loss__year')
                              this.findSums(barData)

                    }

                    //variables to hold the maximum and minimum values amongst the barSums -- needed for mapping functions
                    this.#_minBarsValue = min(this.#_barSums)
                    this.#_maxBarsValue = max(this.#_barSums)
                    //adds bar objects with their corresponding data to the vistogram
                    for(let year= 0;year<this.#_processedData.barsAcross.length;year+=1)
                    {          
                              
                              barData = this.#_table.findRows(this.#_totalYears[year],'tree_cover_loss__year')
                              this.addBar(this.#_visualization.layout.x_pos+year*gapBetweenBars,this.#_visualization.layout.bottomMargin,barData)
                              
                    }   
          }
          destroy()
          {
                    this.#_bars = [] 
          }
          //calculates the sum of data going into the bar, the min and max, and pushes the bar's sum to a sum that includes the sum of all bars together
          findSums(data)
          {
                    
                    let losses=[]
                    let totalYearLoss = 0
                    let typeLoss;
                    let loss= 0
                    
                    //Since there are six types of losses in a bar, all of them must be added to find each bar's value
                    for(let i =0;i<data.length;i+=1)
                    {
                              
                              loss = Number(data[i].obj.tree_cover_loss_)
                              typeLoss = data[i].obj.tree_cover_loss_drivers__type
                              totalYearLoss+= Number(data[i].obj.tree_cover_loss_)
                              losses.push(loss)
                    }
                    

                    
                    //this array holds each bar's sum of losses
                    this.#_barSums.push(totalYearLoss)

          }

          //self-explanatory - fills a class scoped variable with the result
          howManyBarsAndBoxes()
          {
                    let barsAcross = new Set(this.#_table.getColumn('tree_cover_loss__year'))
                    barsAcross = Array.from(barsAcross)
                    // how many boxes per bar --> number of rows(loss drivers)
                    let boxNumber = new Set(this.#_table.getColumn('tree_cover_loss_drivers__type'))
                    boxNumber = Array.from(boxNumber).length
                    this.#_processedData= {'boxNumber':boxNumber,"barsAcross":barsAcross}   
          }
          //adds bars to the vistogram
          addBar(barX,barY,barData)
          {
                    let boxValue = 0 
                    let barSum = 0
                    let barHeight = 0
                    let boxHeight= 0
                    let boxHeights = []
                    
                    let _barData = barData                     
                    let _barX = barX
                    let _barY = barY

          

                    for(let i = 0; i< _barData.length;i+=1)
                    {
                    
                              //first map the total sum of values of the bar to the layout
                              
                              boxValue = Number(_barData[i].obj.tree_cover_loss_)
                              
                              barSum+=boxValue
                              
                    }

                    //variable to hold the barHeight according to its sum
                    barHeight= this.helpers.mapBarHeight(barSum,0,this.#_maxBarsValue,this.layout)


                    //then map each box's value to the barHeight
                    for(let i=0;i<_barData.length;i+=1)
                    {
                              //find minBoxHeight and maxBoxHeight inside the bar
                              boxHeight = this.helpers.mapBoxToBarPercent(Number(_barData[i].obj.tree_cover_loss_),barSum,barHeight,this.layout)
                              boxHeights.push(boxHeight)         
                    }
                    let rectColor=undefined
                    //instantiate the bar object and add its boxes then add it to the vistogram's bars
                    let bar = new Bar(_barX,_barY,this.#_barWidth,barHeight,rectColor,_barData,boxHeights)
                    bar.addBoxes()
                    this.#_bars.push(bar)
          }   
          
          //draws the vistogram
          draw()
          {
                    push()
                    angleMode(RADIANS)
                    textSize(12)
                    this.helpers.drawAxis(this.#_visualization.layout)

                    //custom made map function - draws y axis tick labels but implements its own map function instead of passing it as an argument
                    this.helpers.maplessDrawYAxisTickLabels(0,this.#_maxBarsValue,this.#_visualization.layout)
                    //draws each bar in the array
                    if(this.#_bars.length>0)
                    {
                              
                              for(let bar=0;bar<this.#_bars.length;bar+=1)
                              {
                                        
                                        this.#_bars[bar].plot()
                              }
                    }
                    
                    this.helpers.drawAxisLabels('Year','MegaHectars',this.#_visualization.layout)
                    pop()
          }
         
}

