class Visualization
{
          // Base wrapper class that encapsulates details on layout and data for each visualization.
          #_dataPath
          #_x 
          #_y
          #_width
          #_height
          #_layout
          #_name
          #_id 
          #_marginSize
          #_numXTickLabels;
          #_numYTickLabels
          constructor(x,y,width,height,marginSize,name,id,...dataPath)
          {
                    this.#_x = x || undefined 
                    this.#_y = y || undefined
                    this.#_width = width || undefined
                    this.#_height = height || undefined
                    this.#_marginSize = marginSize
                    this.#_layout = 
                    {
                              x_pos:x ,
                              y_pos: y,
                              marginSize: marginSize,
                              pad:5,
                              leftMargin: marginSize * 2.5 ,
                              rightMargin: width ,
                              topMargin: marginSize * 2  ,
                              bottomMargin: height - marginSize * 2.2 ,

                              
                              plotWidth: function()
                              {
                                        return this.rightMargin - this.leftMargin;
                              },

                              plotHeight: function()
                              {
                                        return this.bottomMargin - this.topMargin;
                              },
                              // Boolean to enable/disable background grid.
                              grid: false,
                              plotLeft: function()
                              {
                                        return this.x_pos+this.plotWidth()
                              },
                              plotBottom:function()
                              {
                                        return this.y_pos+this.plotHeight()
                              },
                              // Number of axis tick labels to draw so that they are not drawn on
                              // top of one another.
                              numXTickLabels: 20,
                              numYTickLabels: 4,
                    }

                    this.#_name = name
                    this.#_id = id
                    this.#_dataPath =  dataPath 
          }

          //setters and getters for properties
          set  numXTickLabels(value)
          {
                    this.#_layout.numXTickLabels = value
          }

          set  numYTickLabels(value)
          {
                    this.#_layout.numYTickLabels = value
          }
          
          set marginSize(value)
          {
                    this.#_marginSize = value
                    this.#_layout.marginSize = value 
          }
          
          
          get marginSize()
          {
                    return this.#_marginSize
          }
          
          get dataPath()
          {
                    return this.#_dataPath
          }
          get x()
          {
                    return this.#_x
          }
          get y()
          {
                    return this.#_y
          }
          get width()
          {
                    return this.#_width
          }
          get height()
          {
                    return this.#_height
          }
          get name()
          {
                    return this.#_name
          }
          
          get id()
          {
                    return this.#_id
          }
          
          get layout()
          {
                    return this.#_layout
          }
       
}