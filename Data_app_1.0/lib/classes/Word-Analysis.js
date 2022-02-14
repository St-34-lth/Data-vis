class WordAnalysis
{
          // class implements the word v sentiment visualization. Takes in a sentence from user input, feeds it to the sentiment algorithm, labels it
          // and provides a score for each word in the sentence with an accompanying doughnut chart that includes totals.


          //private properties
          #_visualization;
          #_doughnut
          #_doughnutX;
          #_doughnutY;
          #_doughnutDiam 
          #_doughnutColours;
          #_inputBox
          #_readyBox
          #_predictButton
          #_sentenceWords 
          #_sentenceResults 
          #_dataPoints 
          #_totalScoresValues
          #_totalScoresLabels
          #_minWordLength 
          #_maxWordLength 
          #_predictionModel;
          #_minScore
          #_maxScore
          #_scoreThresholds
          constructor(visualization)
          {
                    this.#_visualization= visualization
                    this.name = this.#_visualization.name
                    this.id = this.#_visualization.id
                    this.layout = this.#_visualization.layout
                    this.#_minScore = 0 
                    this.#_maxScore = 1
                    this.#_scoreThresholds = 
                    {
                              positive : 0.6,
                              negative: 0.5,
                              neutral:0.5,
                    } 
                    this.#_doughnutDiam = 150 
                    this.#_doughnutX= this.layout.x_pos+ this.#_doughnutDiam * 5
                    this.#_doughnutY=this.#_visualization.height - this.#_doughnutDiam *0.8

                    this.layout.bottomMargin = this.layout.bottomMargin - this.#_doughnutDiam
          
                    this.#_doughnut = new PieChart(this.#_doughnutX,this.#_doughnutY,this.#_doughnutDiam,true)

                    this.#_sentenceWords = [] 
                    this.#_sentenceResults = []
                    this.#_dataPoints = []
                    this.#_totalScoresValues = [0,0,0]
                    this.#_totalScoresLabels = ['Positive','Neutral','Negative']
                    this.#_minWordLength = 0
                    this.#_maxWordLength = 0
                    this.#_doughnutColours = ['blue','red','green']


                    //holds helper object
                    this.helpers =  {}
                    Object.assign(this.helpers, new helpers())
          }


          //Prepares html elements and the machine-learning model
          setup()
          { 

                    let inputBoxWidth = 400
                    let inputBoxheight = 25
                    this.#_inputBox = createInput('Type your sentence here')

                    this.#_inputBox.position(this.layout.leftMargin+this.layout.x_pos,this.layout.y_pos+this.layout.bottomMargin+inputBoxheight*5)
                    this.#_inputBox.size(inputBoxWidth,inputBoxheight)
                    this.#_inputBox.style('overflow','auto')
                    this.#_inputBox.parent('app')

                    this.#_readyBox = createP('Please wait')
                    this.#_readyBox.position(this.layout.x_pos,this.layout.y_pos+this.layout.bottomMargin+inputBoxheight*5)
                    this.#_readyBox.style('color:red')
                   
                    this.#_predictButton = createButton('Predict')
                    this.#_predictButton.position(this.layout.x_pos,this.layout.bottomMargin+inputBoxheight*5)
                    this.#_predictButton.mousePressed(this.processInput.bind(this))

                    this.#_predictionModel = ml5.sentiment('movieReviews',() => {
                    // model is ready
                    this.#_readyBox.html('model loaded')
                    this.#_readyBox.style('color:green'); });
          }
          //resets the graph and prepares for new user input
          resetOnNewInput()
          {
                    
                    this.#_sentenceWords=[]
                    this.#_sentenceResults = []
                    this.#_minWordLength = 0
                    this.#_maxWordLength =0
                    this.#_totalScoresValues =[0,0,0]
                    this.#_dataPoints = []
                    
          }
          //ensures there is an input to be processed. If so, feeds it to the sentiment algo and then labels it
          processInput() 
          {
                    if(this.#_sentenceWords.length>=1 && this.#_sentenceResults.length >=0)
                    {
                              this.resetOnNewInput()
                    }
                    //parses the user input string into an array of words to be analyzed separately
                    this.#_sentenceWords =  v.words(this.#_inputBox.value()) 
                    let wordLengths= []
                    //loops over the words in the array. feeds them into the sentiment algo and labels them accordingly
                    for(let i =0;i<this.#_sentenceWords.length;i+=1)
                    {
                                  
                              let score = this.#_predictionModel.predict(this.#_sentenceWords[i]).score
                              
                              let label = this.labelSentiment(score)
                              
                              this.#_sentenceResults.push(
                    
                                        {
                                                  word:this.#_sentenceWords[i],    
                                                  score:score,
                                                  label:label
                                        }      
                              )  
                    }
                    //finds the min/max length of the words provided, to be used when mapping them in the x-axis
                    this.#_minWordLength = min(wordLengths)
                    this.#_maxWordLength =max(wordLengths)
                    // adds data Points to the graph
                    this.addDataPoints()
                    
          }
          //labels each word and gives a label. Also calculates the totals for each label
          labelSentiment(score)
          {
                    
                    
                    if( score >= this.#_scoreThresholds.positive) 
                    {
                              this.#_totalScoresValues[0]+=1
                              return  
                              
                    }
                    else if ((score >= this.#_scoreThresholds.neutral) && (score < this.#_scoreThresholds.positive)) 
                    {
                              this.#_totalScoresValues[1]+=1
                              return 
                              
                    }
                    else  
                    {
                              this.#_totalScoresValues[2]+=1
                              return 
                              
                    }
          }
          //Adds datapoints to the graph. Each data point represents a word and holds its score
          addDataPoints() 
          {
          


                    let axisWidth= this.layout.plotWidth()
                    let pointDist = axisWidth/this.#_sentenceResults.length
                    let x_pos = this.layout.leftMargin
                    let y_pos=0;
                    let whichColour = (score) => {
                              let colour;
                              if (score >= this.#_scoreThresholds.positive)
                              {colour='blue'}
                              else if((score >= this.#_scoreThresholds.neutral) && (score < this.#_scoreThresholds.positive))
                              {colour='red'}
                              else
                              {colour='green'}
                              return colour 
                    }

                    for(let i =0 ;i < this.#_sentenceResults.length;i+=1)
                    {
 
                              y_pos = this.helpers.mapScoreToHeight(this.#_sentenceResults[i].score,this.#_minScore,this.#_maxScore,this.layout)
                              let score = this.#_sentenceResults[i].score.toFixed(2)
                              
                              let wordPoint = new dataPoint(x_pos,y_pos,this.#_sentenceResults[i].word,score,whichColour(score) ,7)
                              this.#_dataPoints.push(wordPoint)
                              x_pos +=pointDist

                    }



          }
          //draws the graph and data points to the canvas
          drawScore()
          {
                    let previous; 
                    
                    
                    for(let i =0 ; i< this.#_sentenceResults.length;i+=1)
                    {
                              let current =  
                              {
                                        
                                        word:this.#_sentenceResults[i].word,
                                        score:this.#_sentenceResults[i].score
                                         
                              }
                              if(previous!=null)
                              {
                                       
                                        stroke(255,0,0)
                                        strokeWeight(1)
                                        line(this.#_dataPoints[i-1].getX(),this.#_dataPoints[i-1].getY(),this.#_dataPoints[i].getX(),this.#_dataPoints[i].getY())

                                        noStroke()
                      
                              }
                              
                              previous = current 
                            
                    }
                   
          }
          draw()
          {
                    push()
                    
                    //draw the axis
                    this.helpers.drawAxis(this.layout)
                    //ensure there are data points in the array, if so draw them
                    if(this.#_dataPoints.length > 0) 
                    {
                              push()
                              
                              // map them to the x-axis depending on their size
                              push()
                              this.helpers.wordToXaxis(this.#_sentenceResults,this.layout)
                              pop()
                              textSize(10)
                              //draw y-axis tick labels and axes labels
                              this.helpers.drawYAxisTickLabels(this.#_minScore,this.#_maxScore,this.layout,this.helpers.mapScoreToHeight.bind(this),2)
                              this.helpers.drawAxisLabels('words','Sentiment score',this.layout)
                              //loop over the data points draw them and check for mouse-over events
                              for(let i=0;i< this.#_dataPoints.length;i+=1)
                              {
                                        this.#_dataPoints[i].plot()
                                        this.#_dataPoints[i].hoverDisplay(mouseX,mouseY)
                              }
                              //draw the graph
                              this.drawScore()
                              pop()
                    }
                    pop()
                    push()
                    //draw the doughnut chart
                    this.#_doughnut.draw(this.#_totalScoresValues,this.#_totalScoresLabels,this.#_doughnutColours,'Sentence score')
                   
                    pop()
          }
          destroy() 
          { 
                    this.#_inputBox.remove();
                    this.#_readyBox.remove();
                    this.#_predictButton.remove();
                    this.resetOnNewInput()
          }

}