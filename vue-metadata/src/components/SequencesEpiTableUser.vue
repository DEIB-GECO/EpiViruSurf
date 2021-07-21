<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog2"
      width="1300"
    >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Sequence Table
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color: white"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>
          <MetadataTableForEpi></MetadataTableForEpi>
        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import {poll} from "../utils";
import MetadataTableForEpi from "./MetadataTableForEpi";

export default {
  name: "SequencesEpiTableUser",
  components: {MetadataTableForEpi},
  props: {
  },
  data(){
    return{
      dialog2: false,
      sequences: [],
    }
  },
  computed: {
    ...mapState([
      'showSequenceEpiTableUser', 'chosenEpitope', 'query', 'epiQuerySel'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
  },
  methods: {
    ...mapMutations([
      'showSeqEpiTableUser', 'setChosenEpitope'
    ]),
    exit(){
      this.showSeqEpiTableUser();
      this.setChosenEpitope(null);
    }
  },
  watch: {
    showSequenceEpiTableUser() {
      this.dialog2 = this.showSequenceEpiTableUser;
    },
  },
}
</script>

<style scoped>

</style>