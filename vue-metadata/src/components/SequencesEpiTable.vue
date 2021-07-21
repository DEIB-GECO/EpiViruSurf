<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog"
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
  name: "SequencesEpiTable",
  components: {MetadataTableForEpi},
  props: {
  },
  data(){
    return{
      dialog: false,
      sequences: [],
    }
  },
  computed: {
    ...mapState([
      'showSequenceEpiTable', 'chosenEpitope', 'query', 'epiQuerySel'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
  },
  methods: {
    ...mapMutations([
      'showSeqEpiTable', 'setChosenEpitope'
    ]),
    exit(){
      this.showSeqEpiTable();
      this.setChosenEpitope(null);
    }
  },
  watch: {
    showSequenceEpiTable() {
      this.dialog = this.showSequenceEpiTable;
    },
  },
}
</script>

<style scoped>

</style>