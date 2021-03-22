import { Component, OnInit } from '@angular/core';
import {HttpServiceService} from './http-service-service.service';
import * as Highcharts from 'highcharts';
import {Chart, StockChart} from 'angular-highcharts';
import highcharts3D from 'highcharts/highcharts-3d';
highcharts3D(Highcharts);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent{
  memory
  total
  free
  today= new Date();
  diskStatus;
  show=true;
  public chartstock: StockChart;
  constructor(private actuatorService:HttpServiceService){this.getChart(),this.MemoryUse()}

  ngOnInit() {
    setInterval(() => {
       this.today = new Date();
    }, 1000);
}

//////***CPU UTILIZATION CHART****//////
  getChart() {
    var dataService =this.actuatorService;
    var time=(new Date()).getTime();
    this.chartstock = new  StockChart({
      chart:{
                plotBackgroundColor: "#DDFFEC",
                marginRight: 10,
                //Zoom Chart 
                zoomType: 'x',              
                events: {
                  load: function () {
                    var series = this.series[0];
                    setInterval(function(){
                      //call service and store value of cpu usage
                      dataService.cpuUse().subscribe(resp=>{
                        resp["measurements"].forEach(res=>{
                          var x=(new Date()).getTime(),
                          y=Math.round(res.value*100);
                          //add points dynamically to a graph
                          series.addPoint([x, y]);
                                       
                        })
                      })
                    },1000)
                  }
                }
      },
      //hide watermark highchart.com
      credits: {
        enabled: false
    },
      time:{
        useUTC:false
      },
      //display how many data point records to display
      rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1m'
        },{
          count: 5,
          type: 'minute',
          text: '5m'
        },{
        count: 1,
        type: 'month',
        text: '1M'
        },{
            count: 3,
            type: 'month',
            text: '3M'
        },{
            type: 'all',
            text: 'All'
        }],

        inputEnabled: true,
        selected: 5
    },
    title: {
      text: 'Live CPU Utilization'
  },
  subtitle: {
    text: 'Displaying usage of CPU in %'
},
//navigation bar
navigator: {
  enabled: true,
  xAxis: {
      type: 'datetime',
      labels: {
          format: '{value:%e%b-%y %H:%M:%S %p}',
          align: 'center',
          style: {
              color: '#062384'
          }
      }
  }
},


scrollbar: {
  barBackgroundColor: 'gray',
  barBorderRadius: 4,
  barBorderWidth: 0,
  buttonBackgroundColor: '#919DFE',
  buttonBorderWidth: 0,
  buttonBorderRadius: 2,
  trackBackgroundColor: 'none',
  trackBorderWidth: 1,
  trackBorderRadius: 2,
  trackBorderColor: '#CCC'
},

xAxis: {
  type: 'datetime',
  labels: {
      format: '{value:%e %b-%y}',
      align: 'left',
      rotation: 90,
      style: {
          color: '#FA0202'
      }
  },
},
yAxis:{
  min:0,
  max:100
},

tooltip: {
  valueSuffix:" %"
},
  series: [{
    name: 'CPU usage Percent',
    type: 'area',
    tooltip: {xDateFormat: '%e-%b-%y %H:%M:%S %p'},
    data: [],
    fillColor: {
      linearGradient: {
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 1
      },
      stops: [
          [0, Highcharts.getOptions().colors[3]],
          [1, Highcharts.getOptions().colors[2]]
      ]
  }
}]
})
}
/////////////***Memory Storage Graph*******/////////////////////////
chart=new Chart({
  chart:{
    plotBackgroundColor: '#ddd6f3',
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
     }
  },
  
  title:{
    text:'Memory Utilization',
    align: 'center',
  
  },
  credits:{
    enabled:false
  },
  tooltip: {
    valueSuffix:" GB"
 },
 plotOptions: {
  pie: {
    colors:[{
      radialGradient: { cx: 0.5, cy: 0.5, r: 0.5 },
      stops: [
         [0, '#43cea2'],
         [1, '#185a9d'],
      ]
  }, {
      radialGradient: {
        cx: 0,
        cy: 0,
        r: 0,
      },
      stops: [
        [0, '#ffb88c'],
        [1, '#eb3349']
      ]
    }],
    depth: 30,
  },
  
 },
  series:[{
    name: 'Memory',
    type:'pie',
    data:[],
    },
],
});

MemoryUse(){
 this.actuatorService.memoryInfo().subscribe(res=>{
  this.memory=res;
  console.log(this.memory)
  this.diskStatus=this.memory.status;
  this.total=['Free Memory',Math.round((this.memory.details.free)/1073741824)]
  this.free=['Memory Used',Math.round((this.memory.details.total)/1073741824-(this.memory.details.free)/1073741824)]
  this.chart.removePoint(this.chart.ref.series[0].data.length - 1)
  this.chart.removePoint(this.chart.ref.series[0].data.length - 1)
  this.chart.addPoint(this.total)
  this.chart.addPoint(this.free)
 })
}

}
