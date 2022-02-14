
// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.


var gallery;
var deforestationData = './data/deforestation/treecover_loss__ha.csv'
var vis
var treeVis 
var wordVis 
var sentimentVis
function preload()
{
         
          
          //Initialize visualization objects to hold all layout and label details 
          wordVis = new Visualization(435,1,1200,800,50,'Words v Sentiment','wordAnalysis',null)
          
          
          /*
          The commented sentimentVis initialization has a larger data set so it may slow things quite a bit depending on your system
          The uncommented line is the smaller data set for testing purposes which may run slow as well, but on my setting is running. If you come across performance issues when running the project, use the second commented line instead.
          */
          
          //Full sample
          //sentimentVis = new Visualization(300,40,1300,800,40,'Crypto v Sentiment','sentiment', './data/Sentiment_analysis/twitterData_.csv','./data/Sentiment_analysis/cryptoData.csv')  
          
          //Moderate sample
          // sentimentVis = new Visualization(300,40,1300,800,40,'Crypto v Sentiment','sentiment', './data/Sentiment_analysis/twitterData.csv','./data/Sentiment_analysis/cryptoData.csv')
          
          //Small sample
          sentimentVis = new Visualization(300,40,1300,800,40,'Crypto v Sentiment','sentiment', './data/Sentiment_analysis/sampleData.csv','./data/Sentiment_analysis/cryptoData.csv')
          
          
          
          vistogramVis = new Visualization(120,40,1200,800,44,'Deforestation-Histogram','vistogram',deforestationData) 
          treeVis = new Visualization(1,50,1200,650,0,'Forest-Location Treemap','treemap','./data/deforestation/treecover_extent_2010_by_region__ha.csv','./data/deforestation/iso_metadata.csv')
          

}
function setup() 
{
  // Create a canvas to fill the content div from index.html.
          canvasContainer = select('#app');
          var c = createCanvas(1440, 800);
          c.parent('app');
        
                    
         
          // Create a new gallery object.
          gallery = new Gallery();

          // Add the visualisation objects here.
          gallery.addVisual(new Sentiment(sentimentVis))
          gallery.addVisual(new WordAnalysis(wordVis))
          gallery.addVisual(new Vistogram(vistogramVis))
          gallery.addVisual(new Tree(treeVis))
          gallery.addVisual(new TechDiversityRace());
          gallery.addVisual(new TechDiversityGender());
          gallery.addVisual(new PayGapByJob2017());
          gallery.addVisual(new PayGapTimeSeries());
          gallery.addVisual(new ClimateChange());

}

function draw() {
          background(255);
          if (gallery.selectedVisual != null) 
          {
                    gallery.selectedVisual.draw();
          }

}
