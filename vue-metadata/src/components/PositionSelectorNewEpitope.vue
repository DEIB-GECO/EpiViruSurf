<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading || waitProteinSelected || positionRangeBlocked"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || waitProteinSelected || positionRangeBlocked || menu"
                      :loading = "isLoading"
        ></v-text-field>

        <v-card style="width: 350px">
            <v-card-title>
                <h4 class="headline mb-0">{{text}}</h4>
                <h5 style="margin-top: 5px">Non linear epitopes segment must be inserted in order</h5>
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
  name: "PositionSelectorNewEpitope",
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
      waitProteinSelected: true,
      previousProtein: '',
      positionRangeBlocked: false,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'aminoacidConditions', 'disableSelectorEpitopePart',
      'epitopeAminoacidFields', 'newSingleEpitope', 'newSingleEpitope', 'exampleCustomEpitope'
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
    positionRanges() {
      return this.newSingleEpitope.position_range;
    }
  },
  methods: {
      ...mapActions(['setEpiDropDownSelected', "setAminoacidConditionsSelected", 'setNewSingleEpitopeSelected']),
      ...mapMutations(['resetEpiQueryField', 'setFalseExampleCustomEpitope']),
    deleteExtremesLocal() {
        this.errorExt = '';
        this.min = '';
        this.max = '';
        this.menu = false;
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
            let list = [];
            if (this.newSingleEpitope['position_range']) {
              list = this.newSingleEpitope['position_range'];
            }
            let pos = [parseInt(this.min), parseInt(this.max)];
            list.push(pos);
            this.setNewSingleEpitopeSelected({field: 'position_range', list: list});

            this.errorExt = '';
            this.min = '';
            this.max = '';
            this.menu = false;
          }
        }
        else{
          this.errorExt = 'Select both start and stop position';
        }
    },
    loadExtremes(){

        /*if(this.my_interval_extremes !== null){
          stopPoll(this.my_interval_extremes);
        }*/

        this.isLoading = true;
        //console.log("RELOAD extremes");
        let to_send = {};
        to_send['product'] = this.newSingleEpitope['product'];
        to_send['compound_query'] = this.compound_query;
        const url = `epitope/extremesPositionNewEpitope`;
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              //this.my_interval_extremes = poll(res.result, (res) => {
                //this.my_interval_extremes = null;
                let vals = res.values;
                this.results = vals[0];
                if(this.exampleCustomEpitope){
                  this.minExt = this.newSingleEpitope['position_range'][this.newSingleEpitope['position_range'].length - 1][1] + 1;
                  this.setFalseExampleCustomEpitope();
                }
                else
                {
                  this.minExt = this.results['start'];
                }
                this.saveMin = this.results['start'];
                this.min_min = this.minExt;
                this.maxExt = this.results['stop'];
                this.max_max = this.maxExt;
                this.isLoading = false;
              })
            //})
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
    newSingleEpitope(){
      if(this.newSingleEpitope['product']){
        this.waitProteinSelected = false;
        if(this.newSingleEpitope['product'] !== this.previousProtein){
          if(!this.exampleCustomEpitope) {
            this.setNewSingleEpitopeSelected({field: "position_range", list: ''});
          }
          this.loadExtremes();
        }
        this.previousProtein = this.newSingleEpitope['product'];
      }
      else{
         this.waitProteinSelected = true;
      }
    },
    positionRanges() {
      if(this.newSingleEpitope.hasOwnProperty('position_range')) {
        this.minExt = this.newSingleEpitope['position_range'][this.newSingleEpitope['position_range'].length - 1][1] + 1;
        if(this.minExt > this.maxExt){
          this.positionRangeBlocked = true;
        }
        else{
          this.positionRangeBlocked = false;
        }
      }
      else{
        this.minExt = this.saveMin;
        this.positionRangeBlocked = false;
      }
    }
  },
  created() {
    //this.loadExtremes();
  },
}
</script>

<style scoped>

</style>