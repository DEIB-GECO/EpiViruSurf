<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || menu"
                      :loading = "isLoading"
        ></v-text-field>

        <v-card style="width: 300px">
            <v-card-title>
                <h4 class="headline mb-0">{{text}}</h4>
            </v-card-title>
            <h5 class="ml-4" style="color:red;">{{errorExt}}</h5>
            <v-container fluid grid-list-xl>
                <v-layout>
                    <v-flex>
                        <v-text-field v-model="min" type="number" label="Min value" :hint="minString" persistent-hint
                                      :min="minInt" :max="max_max">
                        </v-text-field>
                    </v-flex>
                    <v-flex>
                        <v-text-field v-model="max" type="number" label="Max value" :hint="maxString" persistent-hint
                                      :min="min_min" :max="maxInt">
                        </v-text-field>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-layout justify-center>
              <v-card-actions>
                  <!--<v-spacer></v-spacer>-->
                  <v-btn
                          color="blue"
                          flat
                          outline
                          @click="setExtremesLocal">
                      Add
                      <v-icon dark right>add_circle</v-icon>
                  </v-btn>
                  <v-btn
                          color="red"
                          flat
                          outline
                          @click="deleteExtremesLocal">
                      Clear
                      <v-icon dark right>block</v-icon>
                  </v-btn>
              </v-card-actions>
            </v-layout>
        </v-card>
    </v-menu>
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import {poll, stopPoll} from "../utils";

export default {
  name: "PositionSelectorAminoAcidNewEpitope",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  data(){
    return {
      isLoading : false,
      errorExt: '',
      results: [],
      min: null, //goes to query
      max: null, //goes to query
      min_min: 0,
      max_max: 1000,
      minExt: 0, //resulting from range available on the currently selected dataset
      maxExt: 1000,
      saveMin: 0,
      menu: false,
      shown_value: null,
      disableNumSel: false,
      disabledEpi_AminoacidMenuOpened: false,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'aminoacidConditions', 'disableSelectorEpitopePart',
      'epitopeAminoacidFields', 'newSingleAminoAcidConditionUser'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    maxString() {
        return Math.ceil(this.maxExt).toString();
    },
    minString() {
        return Math.floor(this.minExt).toString();
    },
    maxInt() {
        return Math.ceil(this.maxExt);
    },
    minInt() {
        return Math.floor(this.minExt);
    },
    textBoxValue() {
      let a = [];
      if (this.min != null)
          a.push('min: ' + this.min);
      if (this.max != null)
          a.push('max: ' + this.max);
      return a.join('; ');
    },
  },
  methods: {
      ...mapActions(['setEpiDropDownSelected', "setAminoacidConditionsSelected", 'setNewSingleAminoAcidConditionUserAction']),
      ...mapMutations(['resetEpiQueryField']),
    deleteExtremesLocal() {
        this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
        this.errorExt = '';
        this.min = null;
        this.max = null;
        this.menu = false;
        this.shown_value = this.textBoxValue;
    },
    setExtremesLocal() {
        if(this.min && this.max) {
          if((
            (
            (this.min < this.minInt || this.min > this.max_max)
            ||
            (this.max < this.min_min || this.max > this.maxInt)))){

          this.errorExt = 'Select position inside extremes';

          }
          else {
            this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});

            let list = {};
            list['max_val'] = parseInt(this.max);
            list['min_val'] = parseInt(this.min);
            this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: list});

            this.shown_value = this.textBoxValue;
            this.errorExt = '';
            this.min = null;
            this.max = null;
            this.menu = false;
          }
        }
        else{
          this.errorExt = 'Select both start and stop position';
        }
    },
    loadExtremes(){

        if(this.my_interval_extremes !== null){
          stopPoll(this.my_interval_extremes);
        }

        this.isLoading = true;

        let to_send = {};
        let product = this.newSingleAminoAcidConditionUser['product'];
        if(product) {
          to_send['product'] =  product[0];
        }

        let panel_to_send = {};
        let variant_type =  this.newSingleAminoAcidConditionUser['variant_type'];
        let sequence_aa_original =  this.newSingleAminoAcidConditionUser['sequence_aa_original'];
        let sequence_aa_alternative =  this.newSingleAminoAcidConditionUser['sequence_aa_alternative'];
        if(variant_type) {
          panel_to_send['variant_type'] = variant_type[0];
        }
        if(sequence_aa_original) {
           panel_to_send['sequence_aa_original'] = sequence_aa_original[0];
         }
        if(sequence_aa_alternative) {
          panel_to_send['sequence_aa_alternative'] = sequence_aa_alternative[0];
        }
        to_send['panel'] = panel_to_send;

        const url = `epitope/extremesPositionNewEpitopeAminoacid`;
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_extremes = poll(res.result, (res) => {
                this.my_interval_extremes = null;
                let vals = res.values;
                this.results = vals[0];
                this.minExt = this.results['start'];
                this.saveMin = this.results['start'];
                this.min_min = this.minExt;
                this.maxExt = this.results['stop'];
                this.max_max = this.maxExt;
                this.isLoading = false;
              })
            })
    },
    toSend(){

    },
    clearEpiQueryFromAmino(){

    },
  },
  watch:{
    compound_query() {
      //this.loadExtremes();
    },
    min() {
      if(this.min === '' || this.min === undefined){
        this.min = null;
      }
      if(this.min !== null) {
        this.min_min = Math.max(this.min, this.minInt);
      }
      else{
        this.min_min = this.minInt;
      }
    },
    max() {
      if(this.max === '' || this.max === undefined){
        this.max = null;
      }
      if(this.max !== null) {
        this.max_max = Math.min(this.max, this.maxInt);
      }
      else{
        this.max_max = this.maxInt;
      }
    },
    newSingleAminoAcidConditionUser(){
      if(!this.newSingleAminoAcidConditionUser['start_aa_original']){
        this.errorExt = '';
        this.min = null;
        this.max = null;
        this.shown_value = this.textBoxValue;
      }
      if(this.newSingleAminoAcidConditionUser['start_aa_original']){
        this.min = this.newSingleAminoAcidConditionUser['start_aa_original']['min_val'];
        this.max = this.newSingleAminoAcidConditionUser['start_aa_original']['max_val'];
        this.shown_value = this.textBoxValue;
      }
      this.loadExtremes();
    },
  },
  created() {
    if(this.newSingleAminoAcidConditionUser['start_aa_original']){
        this.min = this.newSingleAminoAcidConditionUser['start_aa_original']['min_val'];
        this.max = this.newSingleAminoAcidConditionUser['start_aa_original']['max_val'];
        this.shown_value = this.textBoxValue;
      }
    //this.loadExtremes();
  },
  mounted() {
    this.loadExtremes();
  },
}
</script>

<style scoped>

</style>