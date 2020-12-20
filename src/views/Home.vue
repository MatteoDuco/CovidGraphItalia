<template>
    <div class="px-4 lg:px-0 h-full">
        <LineGraph v-if="allData" :allData="allData" :currentModel="currentModel"/>
    </div>
</template>

<script>
import LineGraph from "../components/Line.vue"

const latestURL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale-latest.json"
const allURL = "https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json"

export default {
  components: {
    LineGraph
  },
  name: 'Home',
  props:{
    currentModel:Number
  },
  data: () => {
    return {
      lastUpdate: null,
      allData: null
    }
  },
  mounted: function() {
    const self = this;
    fetch(latestURL).then(response => {
        return response.json();
      })
      .then(data => {
        if(data.length == 0) throw new Error ("No data!");
        self.lastUpdate = data[0];
        this.$emit('ready', self.lastUpdate.data);
      });
    fetch(allURL).then(response => {
        return response.json();
      })
      .then(data => {
        if(data.length == 0) throw new Error ("No data!");
        self.allData = data;
      });
  }
}

</script>
