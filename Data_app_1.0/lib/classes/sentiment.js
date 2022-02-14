class Sentiment
{

    //Class declaration for sentiment v crypto visualization
    //Takes in twitter or any other user text-based social media data, produces a graph with a sentiment score for each, and plots it
    // against any cryptocurrency(currently only Bitcoin) price-time graph.

    //private properties
          #_analyzeButton;
          #_dataPoints 
          #_cryptoData
          #_twitterData
          #_cryptoPrices
          #_cryptoTimes
          #_statusBox
          #_tweetBox;
          #_select;
          #_cryptoList 
          #_data
          #_visualization;
          #_predictionModel
          #_maxScore;
          #_minScore 
          #_oldestInterval
          #_latestInterval
          #_oldestTime;
          #_latestTime;
          #_minPrice;
          #_maxPrice ;
          #_totalScoresLabels 
          #_totalScoresValues 

          #_doughnutX 
          #_doughnutY 
          #_doughnutOuterRadius

          #_doughnutColors 
          #_doughnutChart 
          constructor(visualization)
          {
                    
                    this.#_visualization = visualization
                    this.name = this.#_visualization.name 
                    this.id = this.#_visualization.id
                    this.sentimentPoints=[]
                    this.#_dataPoints = []
                    this.#_cryptoTimes = []

                    this.#_cryptoList =['BTC']
                    this.layout = this.#_visualization.layout
                    
                    const self = this
                    this.layout.numXTickLabels = 25
                    this.layout.numYTickLabels = 15
                    let overlayMarginSize = 50
                    //second layout the sentiment graph line
                    this.overlayLayout = 
                    { 
                              leftMargin: overlayMarginSize * 2,
                              rightMargin: width- overlayMarginSize*1.8,
                              topMargin: overlayMarginSize*1.7,
                              bottomMargin: height - overlayMarginSize*4.9 ,
                              pad: 5,
                              marginSize: overlayMarginSize,
                              plotWidth: function()
                              {
                                return this.rightMargin - this.leftMargin;
                              },

                              plotHeight: function()
                              {
                                return this.bottomMargin - this.topMargin ;
                              },   
                              numXTickLabels: 25,
                              numYTickLabels: 10,
                    }


                    this.#_minScore = 0 
                    this.#_maxScore = 1

                    this.#_totalScoresLabels =['positive','neutral','negative']
                    this.#_totalScoresValues =[0,0,0]
                    this.#_doughnutOuterRadius = 150
                    this.layout.bottomMargin -= this.#_doughnutOuterRadius
                    this.#_doughnutX =  this.layout.plotWidth()
                    this.#_doughnutY = this.layout.bottomMargin + this.#_doughnutOuterRadius
                    
                    this.#_doughnutColors = ['blue','red', 'green']
                    let isDoughnut=true 
                    //holds doughnut object
                    this.#_doughnutChart = new PieChart(this.#_doughnutX,this.#_doughnutY,this.#_doughnutOuterRadius,isDoughnut)
                    //holds helper object
                    this.helpers={}
                    Object.assign(this.helpers,new helpers())


          }


          //loads necessary crypto pricing and social media text data as tables/arrays
          preload()
          {
                    let nameList = ["twitterData","cryptoData"]

                    this.#_data = this.helpers.tableLoader(this.#_visualization.dataPath,nameList)
                    this.#_cryptoData = this.#_data.cryptoData
                    this.#_twitterData = this.#_data.twitterData
                    this.testData = this.#_cryptoData
                    this.testDataTw = this.#_twitterData
                    this.#_cryptoPrices = this.#_cryptoData.getColumn(0)
                    this.#_cryptoTimes = this.#_cryptoData.getColumn(1)
                   
                    
          }
          // setups the html elements and prepares prediction model. 
          // Also casts table of crypto-data to separate arrays 
          setup()
          {
                    // convert the table columns to arrays 
                    this.#_cryptoPrices = this.#_cryptoData.getColumn(0)
                    this.#_cryptoTimes = this.#_cryptoData.getColumn(1) 
                    /* setup the html environment */
                    
                    
                    
                    //text box to display  machine learning model readiness status
                    this.#_statusBox = createP('Please wait')
                    this.#_statusBox.style('color:red');
                    this.#_statusBox.position(this.layout.x_pos+this.layout.leftMargin,this.layout.bottomMargin+this.layout.marginSize*2.5)
                    this.#_statusBox.parent('app')
                    
                    //div to hold tweet texts 
                    this.#_tweetBox = createDiv('Tweets')
                    this.#_tweetBox.id('tweetBox')
                    this.#_tweetBox.style('overflow','auto')
                    this.#_tweetBox.style('height','350px')
                    this.#_tweetBox.style('width','45%')
                    this.#_tweetBox.position(this.layout.x_pos+this.layout.leftMargin,this.layout.bottomMargin+145)
                    this.#_tweetBox.parent('app')

                    // selection box for alternative cryptocoin data sets
                    this.#_select = createSelect()
                    this.#_select.position(this.layout.x_pos+this.layout.leftMargin+this.layout.marginSize*2.5,this.layout.bottomMargin+115)
                    for(let i=0;i< this.#_cryptoList.length;i+=1)
                    {
                              this.#_select.option(this.#_cryptoList[i])
                    }

                    //holds machine learning object -- call back to provide readiness status to user 
                    this.#_predictionModel = ml5.sentiment('movieReviews',() =>
                    {
                    // model is ready
                              this.#_statusBox.html('model loaded')
                              this.#_statusBox.style('color:green'); 
                    });
                    // analyzing the data on mousePressed()
                    this.#_analyzeButton = createButton('Analyze')
                    this.#_analyzeButton.position(this.layout.x_pos+this.layout.leftMargin+200,this.layout.bottomMargin+115)
                    this.#_analyzeButton.mousePressed(this.prepareAndAnalyze.bind(this))
          }

          //calculates the median of sentiment scores for each time-interval
          findMedianAndScore()
          { 
                   
                    let previousInterval;
                    let interleavedArray = []
                    let interleavedIndex=0
                    //loops over social media text
                    for(let i =0 ; i< this.#_twitterData.rows.length;i+=1)
                    {
                              //strips the string of the time stamp to avoid (some) dilution of the text
                              let currentInterval =  new Date(this.#_twitterData.get(i,1))
                              //holds the tweet text from the table
                              let tweetText = this.#_twitterData.getRow(i).obj.twitterText
                              //uses the machine-learning algorithm to produce a score for the tweet text
                              let tweetScore = Number(this.#_predictionModel.predict(tweetText).score.toFixed(2))
                              //  pushes the score and the interval it was grouped in the table
                              if(previousInterval!=null)
                              {
                                        if( (currentInterval.getTime()-previousInterval.getTime()) <= 500000 )
                                        { 
                                                  interleavedArray.push(tweetScore)       
                                        }

                                        else 
                                        {
                                                 
                                                  interleavedIndex+=1
                                                this.#_twitterData.set(interleavedIndex,'median',median(interleavedArray))
                                                 this.#_twitterData.set(interleavedIndex, 'interval',previousInterval.getTime() )
                                                 interleavedArray=[];
                                        }
                                   
                              }
                              //  labels each social media text as positive/neutral/negative
                              let tweetLabel = this.labelSentiment(tweetScore)
                              //set the score and sentiment label of each tweet in the table
                              this.#_twitterData.set(i ,'score',tweetScore) 
                              this.#_twitterData.set(i, 'sentiment', tweetLabel)
                              
                              previousInterval = currentInterval
                    }
                    //keep track of the number of intervals for later use
                    console.log(this.#_twitterData)
                    this.#_twitterData.addColumn('numOfIntervals') 
                    this.#_twitterData.set(0,'numOfIntervals',interleavedIndex)

                   
         }
         //prepares the social media table and runs the methods that prepare and show the graphs/texts
          prepareAndAnalyze()
          {
                    
                    this.#_twitterData.addColumn('sentiment')
                    this.#_twitterData.addColumn('score')
                    this.#_twitterData.addColumn('interval')
                    this.#_twitterData.addColumn('median')
                  
                    this.findMedianAndScore()
                    this.addDataPoints()
                    this.addSentimentDataPoints()
                    this.drawSentimentGraph()
                    // uncomment below to see tweets and their scores
                    // this.displayTweets(this.#_twitterData) 

                   
          }

          //method to label each social media text score and count their sums
          labelSentiment(score)
          {
                    let sentimentLabel = '' 
                    let scoreThresholds = {
                              positive : 0.6,
                              negative: 0.5,
                              neutral:0.5,
                    } 
                    if( score >= scoreThresholds.positive) 
                    {
                              this.#_totalScoresValues[0]+=1
                              return  sentimentLabel= 'p'
                              
                    }
                    else if (score > scoreThresholds.neutral) 
                    {
                              this.#_totalScoresValues[1]+=1
                              return sentimentLabel='n'
                              
                    }
                    else if (score <= scoreThresholds.negative)
                    {
                              this.#_totalScoresValues[2]+=1
                              return sentimentLabel='neg'
                              
                    }
          }
          //adds data points on the graph - incorporates crypto prices at their respective times 
          addDataPoints()
         {
                    let previousDataPointValues;
                    let numberOfDatapoints = this.#_cryptoPrices.length
                    
                    
                    
                    for(let i = 0 ; i< numberOfDatapoints;i+=1)
                    {         
                              
                              let currentDataPointValues = 
                              {
                                        timeInstance: new Date(Number(this.#_cryptoTimes[i])),
                                        price: this.#_cryptoPrices[i],
                                        //score: twitterData.get(i,3)
                              }
                             
                              if(previousDataPointValues!=null)
                              {
                                       
                                    
                                       
                                        this.#_dataPoints.push(new dataPoint(
                                                                      this.helpers.mapTimeToWidth(previousDataPointValues.timeInstance,this.#_oldestTime,this.#_latestTime,this.layout),
                                                                      this.helpers.mapPriceToHeight(previousDataPointValues.price,this.#_minPrice,this.#_maxPrice,this.layout),
                                                                      `${Number(previousDataPointValues.price).toFixed(2)}`,
                                                                      `${previousDataPointValues.timeInstance.getUTCHours()}:${previousDataPointValues.timeInstance.getUTCMinutes()}`,
                                                                        undefined,4
                                                            ))
                                        
                                                        
                              }
                             
                              previousDataPointValues = currentDataPointValues; 
                    }


         }
          //adds the sentiment data points - incorporates the median score of each respective ''interval'' measured
         addSentimentDataPoints()
         {
                    //variables hold the interval it was grouped 
                    let numberOfSentimentIntervals = this.#_twitterData.getColumn('numOfIntervals')[0]
                    this.#_oldestInterval = new Date(this.#_twitterData.get(1,4))
                    this.#_latestInterval = new Date(this.#_twitterData.get(numberOfSentimentIntervals,4))
                    
                    let previousInterval;
                    for(let i =1 ; i< numberOfSentimentIntervals;i+=1)
                    {                    
                              
                              let currentInterval = 
                              {
                                        timeInterval: new Date(this.#_twitterData.get(i,4)),
                                        median: this.#_twitterData.get(i,5),
                                        //score: twitterData.get(i,3)
                              }
                              if(previousInterval!=null)

                              {
                                        this.sentimentPoints.push(new dataPoint(
                                                                      this.helpers.mapTimeToWidth(previousInterval.timeInterval,this.#_oldestInterval,undefined,this.overlayLayout),
                                                                      this.helpers.mapPriceToHeight(previousInterval.median,this.#_minScore,this.#_maxScore,this.overlayLayout),
                                                                      `Sentiment-median: ${previousInterval.median}`,`Time: ${previousInterval.timeInterval.getUTCHours()}:${previousInterval.timeInterval.getUTCMinutes()}`,'orange',6
                                                                      
                                                                      ))
                              }
                              previousInterval = currentInterval
                    }
         }
         //Displays the tweet texts in the designated tweet box html element - 
         // Called in the prepareAndAnalyze - to see it working uncomment - may reduce performance
          displayTweets(data)
          {
          
                    let tableLength = data.rows.length; 
                    //display tweets
                    
                    for(let i=0; i<tableLength;i+=1)
                    {
                              let tweetItem = createElement("li")
                              index+=1
                              tweetItem.html(`${data.getRow(i).obj.twitterText}\n SCORE: ${data.getRow(i).obj.score}\n SENT: ${data.getRow(i).obj.sentiment}`,true)
                              tweetItem.parent('tweetBox')
                             
                              
                    }


          }
          //draws the crypto graph line
          drawCrypto()
          {
                    //convert time strings to date objects
                    this.#_oldestTime = new Date(Number(this.#_cryptoTimes[0]))
                    this.#_latestTime = new Date(Number(this.#_cryptoTimes[this.#_cryptoTimes.length-1])) 
                    //find the min/max of all prices in the data set
                    this.#_minPrice = min(this.#_cryptoPrices)
                    this.#_maxPrice = max(this.#_cryptoPrices)
   
                 
                    
                    let previous;
                    let numHours = 288
                    
                    for(let i = 0 ; i< this.#_cryptoPrices.length;i+=1)
                    {         

                              let current = 
                              {
                                        timeInstance: new Date(Number(this.#_cryptoTimes[i])),
                                        price: this.#_cryptoPrices[i] 
                              }

                              if(previous!=null)
                              {
                                       
                                        noStroke()
                                        strokeWeight(1)

                                        stroke(0)
                                        strokeWeight(1)
                                        line(
                                                  this.helpers.mapTimeToWidth(previous.timeInstance,this.#_oldestTime,this.#_latestTime,this.layout),
                                                  this.helpers.mapPriceToHeight(previous.price,this.#_minPrice,this.#_maxPrice,this.layout),
                                                  this.helpers.mapTimeToWidth(current.timeInstance,this.#_oldestTime,this.#_latestTime,this.layout),
                                                  this.helpers.mapPriceToHeight(current.price,this.#_minPrice,this.#_maxPrice,this.layout))
                                                  
                                        let xLabelSkip = ceil(numHours / this.layout.numXTickLabels);
                                        
                                        if (i % xLabelSkip == 0) 
                                        {
                                                  this.helpers.sentimentXaxis(
                                                            previous.timeInstance,
                                                            this.#_oldestTime,this.#_latestTime, 
                                                            this.layout,
                                                            this.helpers.mapTimeToWidth.bind(this)
                                                  );
                                        }
                                                        
                              }
                              if(this.#_dataPoints[i] !=undefined)
                              {
                                  this.#_dataPoints[i].plot()
                                  this.#_dataPoints[i].hoverDisplay(mouseX, mouseY)
                              }

                              previous = current; 
                    }
                    
          }
          //draws the sentiment graph (red line)
          drawSentimentGraph()
          {

                    stroke(0)
                    strokeWeight(1)
                    for(let i=0;i<this.sentimentPoints.length;i+=1)
                    {
                              if(this.sentimentPoints[i+1]!=undefined)
                             { 
                                       line(this.sentimentPoints[i].getX(),this.sentimentPoints[i].getY(),this.sentimentPoints[i+1].getX(),this.sentimentPoints[i+1].getY())
                                       
                              }
                              this.sentimentPoints[i].plot()
                              this.sentimentPoints[i].hoverDisplay(mouseX,mouseY)
                    }
                    
          }
          //main draw method
          draw()
          {

                    
                    push()
                    textSize(10)
                    //draw axes and labels,ticks
                    this.helpers.drawAxis(this.layout)
                    this.helpers.drawAxisLabels('UTC 24-hour period','USD $ Price',this.layout,'','Sentiment Score')

                    this.helpers.drawYAxisTickLabels(this.#_minPrice,this.#_maxPrice,
                              this.layout,
                              this.helpers.mapPriceToHeight.bind(this),0)

                    this.helpers.sentimentYaxis(this.#_minScore,this.#_maxScore,this.overlayLayout,this.helpers.mapScoreToHeight.bind(this),2)
                    pop()
                    //draws the crypto pricing lines
                    push()

                    this.drawCrypto()
                    pop()
                    push()
                    //ensures draw function does not try to draw empty sentiment graph
                    if(this.#_oldestInterval !=undefined&& this.#_latestInterval !=undefined)
                    {
                              this.drawSentimentGraph()
                    }

                    //draws the doughnut chart

                    this.#_doughnutChart.draw(this.#_totalScoresValues,this.#_totalScoresLabels,this.#_doughnutColors,'Totals')
                     pop()

          }
          destroy()
          {
                    this.#_analyzeButton.remove()
                    this.#_statusBox.remove() 
                    this.#_select.remove()
                    this.#_tweetBox.remove()
          }
}