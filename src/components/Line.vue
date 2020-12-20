<template>
  <div class="h-full">
    <div class="mb-4 text-3xl pt-4 text-center">
      <h3 class="place-self-center">{{models[currentModel]?models[currentModel].name:"Situazione"}}</h3>
    </div>
    <div class="flex lg:flex-row flex-col mb-4">
      <div class="lg:pl-4 pl-2 lg:mr-4 lg:pr-0 lg:pr-4 pr-2 flex-1 text-center">
        <h4 v-if="models[currentModel].today">Numero di oggi:</h4>
        <div id="dailyBox" v-if="models[currentModel].today" class="bg-red-200 p-4 rounded-xl font-bold inline-block">
          {{models[currentModel].today(allData[allData.length-1], allData[allData.length-2])}}
        </div>
      </div>
      <div class="lg:pr-4 pr-2 lg:mr-4 lg:pl-0 lg:pl-4 pl-2 flex-1">
        <p v-if="models[currentModel].description" v-html="models[currentModel].description"></p>
      </div>
    </div>
    <div class="lg:pl-4 pl-2 lg:pr-4 pr-2">
      La prima ondata comincia il giorno: {{getDate(allData[0].data)}}<br>
      La seconda ondata comincia il giorno: <input type="date" v-model="secondWaveStartDay" class="bg-gray-200"/>
    </div>
    <div class="my-auto">
      <line-chart ref="chart" v-if="allData&&dataGraph&&dataGraph.labels.length!=0" :dataCollection="dataGraph"></line-chart>
    </div>
  </div>
</template>

<script>
import VueCharts from 'vue-chartjs'
import Vue from 'vue'

const firstWaveStart = 0;

export default {
    name:'Line-graph',
    props: {
        allData:Array,
        currentModel:Number
    },
    data: () => {
      return {
        secondWaveStart: 235,
        secondWaveStartDay: null,
        dataGraph: {
          labels: [],
          datasets: [
            {
              label: 'Prima Ondata',
              backgroundColor: 'transparent',
              borderColor: 'red',
              data: []
            },
            {
              label: 'Seconda Ondata',
              backgroundColor: 'transparent',
              borderColor: 'black',
              data: []
            }
          ]
        },
        models: [
          {
            name: "Occupazione totale terapie intensive",
            dailyData: (data, dayNum) => {return data[dayNum].terapia_intensiva},
            today: (today) => {return today.terapia_intensiva},
            description: "Il totale di letti in terapia intensiva attualmente occupati. Un paziente in terapia intensiva è un soggetto in condizioni particolarmente critiche che necessita personale ospedaliero specializzato e cure all'avanguardia. <a href='https://www.hsr.it/news/2020/aprile/terapia-intensiva-cosa-e' class='underline hover:text-blue-700 text-blue-400 text-xs'>Leggi questo articolo di Aprile per saperne di più </a>",
            bc1: 'black',
            bc2: 'red'
          },
          {
            name: "Incremento morti",
            dailyData: (data, dayNum) => {return dayNum==0?data[dayNum].deceduti:data[dayNum].deceduti-data[dayNum-1].deceduti},
            today: (today, yesterday) => {return today.deceduti-yesterday.deceduti},
            description: "Il numero di persone morte dalla pubblicazione dell'ultimo bollettino. <a href='https://www.epicentro.iss.it/coronavirus/sars-cov-2-decessi-italia' class='underline hover:text-blue-700 text-blue-400 text-xs'>Leggi le caratteristiche dei pazienti deceduti positivi all'infezione da SARS-CoV-2 come descritte dall'ISS</a>",
            bc1: 'black',
            bc2: 'red'
          },
          {
            name: "Rapporto nuovi positivi su incremento tamponi",
            dailyData: (data, dayNum) => {return dayNum==0?data[dayNum].nuovi_positivi/data[dayNum].tamponi:data[dayNum].nuovi_positivi/(data[dayNum].tamponi-data[dayNum-1].tamponi)},
            //this will fail if today is the first day, but won't be an issue for us
            today: (today, yesterday) => {return (today.nuovi_positivi/(today.tamponi-yesterday.tamponi)*100).toFixed(3) + "%"},
            description: "Questo rapporto rappresenta il totale dei nuovi positivi dall'ultimo bollettino rispetto ai tamponi eseguiti nel medesimo lasso di tempo. Il valore indica perciò il livello di positività dei tamponi." ,
            bc1: 'black',
            bc2: 'red'
          },
          {
            name: "Rapporto nuovi positivi su incremento casi testati (dati mancanti per la prima ondata)",
            dailyData: (data, dayNum) => {return dayNum==0?data[dayNum].nuovi_positivi/data[dayNum].casi_testati:data[dayNum].nuovi_positivi/(data[dayNum].casi_testati-data[dayNum-1].casi_testati)},
            today: (today, yesterday) => {return (today.nuovi_positivi/(today.casi_testati-yesterday.casi_testati)*100).toFixed(3) + "%"},
            description: "Questo rapporto rappresenta il totale dei nuovi positivi dall'ultimo bollettino rispetto ai casi testati nel medesimo lasso di tempo. Un singolo caso testato può comprendere diversi tamponi, e questo valore indica quindi quante persone potenzialmente positive a Covid-19 hanno ricevuto almeno un tampone positivo. <a href='https://github.com/pcm-dpc/COVID-19/issues/864#issuecomment-710067361' class='underline hover:text-blue-700 text-blue-400 text-xs'>La definizione più affidabile per il termine 'caso-testato' è quella visibile a questo link</a>.",
            bc1: 'black',
            bc2: 'red'
          },
          {
            name: "Totale ricoverati con sintomi",
            dailyData: (data, dayNum) => {return data[dayNum].ricoverati_con_sintomi},
            today: (today) => {return today.ricoverati_con_sintomi},
            description: "Il totale di persone attualmente ricoverate in ospedale per Covid-19. <a href='http://www.salute.gov.it/portale/nuovocoronavirus/dettaglioContenutiNuovoCoronavirus.jsp?area=nuovoCoronavirus&id=5351&lingua=italiano&menu=vuoto' class='underline hover:text-blue-700 text-blue-400 text-xs'>Clicca qui per avere informazioni sulla situazione generale in Italia descritta dal Ministero della Salute</a>",
            bc1: 'black',
            bc2: 'red'
          },
          /*{
            name: "Variazione dimessi guariti",
            dailyData: (data, dayNum) => {return dayNum==0?data[dayNum].dimessi_guariti:data[dayNum].dimessi_guariti-data[dayNum-1].dimessi_guariti},
            bc1: 'red',
            bc2: 'green'
          },
          {
            name: "Variazione isolamento domiciliare",
            dailyData: (data, dayNum) => {return dayNum==0?data[dayNum].isolamento_domiciliare:data[dayNum].isolamento_domiciliare-data[dayNum-1].isolamento_domiciliare},
            bc1: 'red',
            bc2: 'green'
          }*/
        ]
      }
    },
    mounted () {
      const self = this;
      if (self.allData) self.fillGraph();
      let startDate = new Date(self.allData[self.secondWaveStart].data);
      //if this fail everything may explode
      self.secondWaveStartDay = startDate.toISOString().split("T")[0];
    },
    methods: {
      fillGraph() {
        const self=this;
        if (self.currentModel>self.models.length-1||self.currentModel<0) {
          return;
        }
        //Prepare first wave
        for(let i=firstWaveStart;i<=self.secondWaveStart;i++) {
          self.dataGraph.datasets[0].data.push(self.models[self.currentModel].dailyData(self.allData, i));
        }
        self.dataGraph.datasets[0].borderColor = self.models[self.currentModel].bc1;
        //Prepare second wave
        for(let i=self.secondWaveStart;i<self.allData.length;i++){
          self.dataGraph.datasets[1].data.push(self.models[self.currentModel].dailyData(self.allData, i));
        }
        self.dataGraph.datasets[1].borderColor = self.models[self.currentModel].bc2;
        //Fill labels
        if (self.dataGraph.datasets[0].data.length>self.dataGraph.datasets[1].data.length){
          for(let i=0; i<self.dataGraph.datasets[0].data.length; i++){
            self.dataGraph.labels.push(i);
          }
        } else {
          for(let i=0; i<self.dataGraph.datasets[1].data.length; i++){
            self.dataGraph.labels.push(i);
          }
        }
      },
      next() {
        const self = this;
        if (self.currentModel>self.models.length-1||self.currentModel<0) {
          return;
        }
        self.dataGraph = {
          labels: [],
          datasets: [
            {
              label: 'Prima Ondata',
              backgroundColor: 'transparent',
              borderColor: 'red',
              data: []
            },
            {
              label: 'Seconda Ondata',
              backgroundColor: 'transparent',
              borderColor: 'black',
              data: []
            }
          ]
        };
        self.fillGraph();
      },
      getDate(timestamp){
        const date = new Date(timestamp);
        const options = {};
        return date.toLocaleDateString("it-IT", options);
      }
    },
    watch : {
      secondWaveStart: function() {
        const self=this;
        self.dataGraph = {
          labels: [],
          datasets: [
            {
              label: 'Prima Ondata',
              backgroundColor: 'transparent',
              borderColor: 'red',
              data: []
            },
            {
              label: 'Seconda Ondata',
              backgroundColor: 'transparent',
              borderColor: 'black',
              data: []
            }
          ]
        };
        self.fillGraph();
      },
      currentModel: function() {
        const self=this;
        self.next();
      },
      secondWaveStartDay: function() {
        const self=this;
        const start = new Date (self.allData[0].data);
        const last = new Date (self.allData[self.allData.length - 1].data);
        const selected = new Date (self.secondWaveStartDay);
        if(selected<start) {
          self.secondWaveStartDay = start.toISOString().split("T")[0];
          self.secondWaveStart = 0;
          console.log(self.secondWaveStart)
        } else if (selected>last) {
          console.log(last.toISOString());
          self.secondWaveStartDay = last.toISOString().split("T")[0];
          self.secondWaveStart = self.allData.length - 1
        } else {
          let diff = selected-start;
          self.secondWaveStart = Math.ceil(diff/(1000*60*60*24));
        }
      }
    }
}

Vue.component('line-chart', {
  extends: VueCharts.Line,
  props: {
      dataCollection:Object
  },
  mounted () {
    const self = this;
    if(self.dataCollection&&self.dataCollection.labels.length!=0) {
      this.update();
    }
  },
  methods: {
    update() {
      const self = this;
      if(self.dataCollection&&self.dataCollection.labels.length!=0) {
        this.renderChart(self.dataCollection, {responsive: true, maintainAspectRatio: false});
      }
    }
  },
  watch: {
    dataCollection: function() {
      this.update();
    }
  }
})

</script>

<style>

</style>