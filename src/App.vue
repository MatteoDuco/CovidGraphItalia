<template>
  <div id="app" class="h-screen flex flex-col">

    <!-- top DIV -->
    <div class="flex flex-row items-center justify-between h-auto px-8 py-4 bg-green-700 lg:flex-none">
      <div class="flex flex-row items-center">
        <svg
          class="w-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          ></path>
        </svg>
        <h1 class="ml-2 text-3xl">Covid Chart Italia</h1>
      </div>
      <div>
        <p class="p-2 bg-green-300 rounded-xl">Ultimo Aggiornamento :<span> {{last_update}}</span></p>
      </div>
    </div>

    <!-- center DIV -->
    <div class="flex flex-col lg:flex-row lg:flex-grow">

      <!-- left DIV -->
      <div class="flex flex-row items-center py-4 overflow-x-auto text-white bg-black md:justify-evenly lg:px-0 lg:flex-col lg:py-0 lg:w-1/5 lg:flex">
        <div class="flex mx-4 lg:mx-0 flex-col lg:flex-row items-center text-center" v-bind:class="{ 'font-black': currentModel==1?true:false }" v-on:click="currentModel=1">
          <font-awesome-icon icon="sad-tear" class="text-white text-3xl"/>
          <p class="ml-2 no-underline hover:underline">Deceduti</p>
        </div>
        <div class="flex mx-4 lg:mx-0 flex-col lg:flex-row items-center text-center" v-bind:class="{ 'font-black': currentModel==0?true:false }" v-on:click="currentModel=0">
          <font-awesome-icon icon="procedures" class="text-white text-3xl"/>
          <p class="ml-2 no-underline hover:underline">T. intensive</p>
        </div>
        <div class="flex mx-4 lg:mx-0 flex-col lg:flex-row items-center text-center" v-bind:class="{ 'font-black': currentModel==4?true:false }" v-on:click="currentModel=4">
          <font-awesome-icon icon="bed" class="text-white text-3xl"/>
          <p class="ml-2 no-underline hover:underline">Ricoveri</p>
        </div>
        <div class="flex mx-4 lg:mx-0 flex-col lg:flex-row items-center text-center" v-bind:class="{ 'font-black': currentModel==2?true:false }" v-on:click="currentModel=2">
          <font-awesome-icon icon="vial" class="text-white text-3xl"/>
          <p class="ml-2 no-underline hover:underline">Positivi su tamponi</p>
        </div>
        <div class="flex pr-4 mx-4 lg:mx-0 lg:pr-0 flex-col lg:flex-row items-center text-center" v-bind:class="{ 'font-black': currentModel==3?true:false }" v-on:click="currentModel=3">
          <font-awesome-icon icon="head-side-cough" class="text-white text-3xl"/>
          <p class="ml-2 no-underline hover:underline">Positivi su casi testati</p>
        </div>
      </div>

      <!-- MAIN DIV -->
      <div class="px-4 lg:px-0 lg:w-4/5">
        <Home :currentModel="currentModel" @ready="setLastUpdate"/>
      </div>

    </div>

    <!-- bottom div -->
    <div class="py-4 text-center bg-gray-700 flex flex-row items-center justify-between lg:flex-none">
      <div class="pl-4"><a class='underline hover:text-white text-blue-300' href="https://github.com/MatteoDuco/ComeStiamoACovid19">Q&A</a> - <a class='underline hover:text-white text-blue-300' href="https://github.com/pcm-dpc/COVID-19">Fonte dati</a> - <a class='underline hover:text-white text-blue-300' href="https://vuejs.org/">Vue</a> - <a class='underline hover:text-white text-blue-300' href="https://tailwindcss.com/">Tailwind</a> - <a class='underline hover:text-white text-blue-300' href="https://fontawesome.com/">Fontawesome</a> - <a class='underline hover:text-white text-blue-300' href="https://www.chartjs.org/">ChartJS</a> - <a class='underline hover:text-white text-blue-300' href="https://covid-timex.it/">Qualcosa di più sofisticato</a></div>
      <div class="pr-4"><a class='underline hover:text-white text-blue-300' href="https://www.linkedin.com/in/matteo-ducoli-15087991">Matteo Ducoli</a> - <a class='underline hover:text-white text-blue-300' href="mailto:it.nicholas.gares@gmail.com">Nicholas Gares</a></div>
    </div>

  </div>
</template>

<script>
import Home from "./views/Home.vue"

export default {
  name: 'App',
  components: {
    Home
  },
  data: () => {
    return {
      currentModel: 1,
      last_update: "caricando..."
    }
  },
  methods: {
    setLastUpdate(date) {
      this.last_update = date;
    }
  }
}
</script>

<style>
  @import url("https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css");
</style>
