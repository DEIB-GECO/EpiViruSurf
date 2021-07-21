<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading || disableNumSel"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || disableNumSel || menu"
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
                      Apply
                      <v-icon dark right>check_circle</v-icon>
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
  name: "EpitopeWithoutVariantsSelectorNum",
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
      min_min: null,
      max_max: null,
      minExt: null, //resulting from range available on the currently selected dataset
      maxExt: null,
      menu: false,
      shown_value: null,
      disableNumSel: false,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySelWithoutVariants'
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
      ...mapActions(['setEpiDropDownSelectedWithoutVariants']),
      ...mapMutations(['resetEpiQueryFieldWithoutVariants']),
      deleteExtremesLocal() {
          this.errorExt = '';
          this.setEpiDropDownSelectedWithoutVariants({field: 'startExt', list: []});
          this.setEpiDropDownSelectedWithoutVariants({field: 'stopExt', list: []});
          this.min = null;
          this.max = null;
          this.menu = false;
          this.shown_value = this.textBoxValue;
      },
      setExtremesLocal() {

        if((
            ((this.min !== null && this.min !== '' && this.min !== undefined) &&
            (this.min < this.minInt || this.min > this.max_max))
            ||
            ((this.max !== null && this.max !== '' && this.max !== undefined) &&
            (this.max < this.min_min || this.max > this.maxInt)))){

          this.errorExt = 'Select position inside extremes';

        }
        else {
          this.shown_value = this.textBoxValue;
          this.errorExt = '';
          this.menu = false;

          if(this.min !== null && this.min !== undefined) {
            let sendStart;
            if(Array.isArray(this.min)){
              sendStart = {'field': 'startExt', 'list': this.min};
            }
            else {
              sendStart = {'field': 'startExt', 'list': [this.min]};
            }
            this.setEpiDropDownSelectedWithoutVariants(sendStart);
          }else{
            this.setEpiDropDownSelectedWithoutVariants({field: 'startExt', list: []});
          }

          if(this.max !== null && this.max !== undefined) {
            let sendStop;
            if(Array.isArray(this.max)){
              sendStop = {'field': 'stopExt', 'list': this.max};
            }
            else {
              sendStop = {'field': 'stopExt', 'list': [this.max]};
            }
            this.setEpiDropDownSelectedWithoutVariants(sendStop);
          }
          else{
            this.setEpiDropDownSelectedWithoutVariants({field: 'stopExt', list: []});
          }
        }
    },
    loadExtremes(){

      if(this.my_interval_extremes !== null){
        stopPoll(this.my_interval_extremes);
      }

      if(!this.epiSearchDis){
        this.isLoading = true;
        let to_send = this.toSend();
        const url = `epitope/epiExtremesWithoutVariants/${this.field}`;
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_extremes = poll(res.result, (res) => {
                this.my_interval_extremes = null;
                let vals = res.values;
                this.results = vals[0];
                if (this.results['start'] === null || this.results['stop'] === null) {
                  if (this.field === 'position_range' && !this.epiQuerySelWithoutVariants['startExt'] && !this.epiQuerySelWithoutVariants['stopExt']) {
                    this.disableNumSel = true;
                  }
                } else {
                  this.minExt = this.results['start'];
                  this.min_min = this.minExt;
                  this.maxExt = this.results['stop'];
                  this.max_max = this.maxExt;
                  this.disableNumSel = false;
                }
                this.isLoading = false;
              })
            })
      }
    },
    toSend(){
      let res = {};
      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySelWithoutVariants));
      Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_conditions});
      return res;
    },
  },
  watch:{
    epiSearchDis(){
      if(this.epiSearchDis === false){
        this.loadExtremes();
      }
    },
    epiQuerySelWithoutVariants(){
      if (this.field === 'position_range' && !this.epiQuerySelWithoutVariants['startExt'] && !this.epiQuerySelWithoutVariants['stopExt']) {
        this.deleteExtremesLocal();
      }
      this.loadExtremes();
      if (this.epiQuerySelWithoutVariants['startExt']) {
        this.min = this.epiQuerySelWithoutVariants['startExt'];
      }
      if (this.epiQuerySelWithoutVariants['stopExt']) {
        this.max = this.epiQuerySelWithoutVariants['stopExt'];
      }
      this.shown_value = this.textBoxValue;
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
  },
  created() {
    this.loadExtremes();
    if (this.epiQuerySelWithoutVariants['startExt']) {
      this.min = this.epiQuerySelWithoutVariants['startExt'];
    }
    if (this.epiQuerySelWithoutVariants['stopExt']) {
      this.max = this.epiQuerySelWithoutVariants['stopExt'];
    }
    this.shown_value = this.textBoxValue;
  },
}
</script>

<style scoped>

</style>