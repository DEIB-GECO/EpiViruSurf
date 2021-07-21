<template>
  <v-app>

    <div v-if="isEpitope" >
      <AppEpitope></AppEpitope>
    </div>
    <div v-else >
      <AppMain></AppMain>
    </div>

    <!--<AppMain></AppMain>-->

  </v-app>
</template>

<script>

import AppEpitope from "./components/AppEpitope";
import AppMain from "./components/AppMain";

export default {
  name: 'App',
  components: {
    AppEpitope,
    AppMain
  },
  computed: {
    isEpitope() {
      console.log(this.$route);
      if (this.$route.path.includes('epi') || this.$route.hash === '#epitope')
        return true;
      else
        return false;
    },
  }
}

</script>
<style>

</style>
