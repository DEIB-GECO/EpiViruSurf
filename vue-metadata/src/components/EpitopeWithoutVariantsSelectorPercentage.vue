<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading || disablePercSel"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || disablePercSel || menu"
                      :loading = "isLoading"
        ></v-text-field>

        <v-card style="width: 380px">
            <v-card-title>
              <v-layout>
                <v-flex sm8 align-self-center>
                <h4 class="headline mb-0">{{text}}</h4>
                <h5 class="ml-4" style="padding-right: 10px; margin-left: 0px !important; margin-top: 5px">Suggested range >0.2 for T cell / MHC ligand assays</h5>
                </v-flex>
                <v-flex sm4 align-self-center>
                <v-checkbox v-model="isNull"
                            label="N/D"
                            input-value="true"
                            :disabled="forceNull">
                </v-checkbox>
                </v-flex>
              </v-layout>
            </v-card-title>
            <h5 class="ml-4" style="color:red;">{{errorExt}}</h5>
            <v-container fluid grid-list-xl>

                <v-layout row wrap>
                      <v-flex xs2>
                        <v-text-field
                          :value="range[0]"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 50px"
                          @change="$set(range, 0, $event)"
                          :disabled="isNull"
                        ></v-text-field>
                        <span class="mt-0 pt-0" style="color: red; font-size: x-small;">{{minFreqExtString}}</span>
                      </v-flex>
                      <v-flex xs8 style="padding-right: 25px !important; padding-left: 30px !important;">
                        <v-range-slider
                          v-model="range"
                          :max="max"
                          :min="min"
                          :step="0.01"
                          hide-details
                          class="align-center"
                          :disabled="isNull"
                        >
                        </v-range-slider>
                      </v-flex>
                      <v-flex xs2 style="padding-left: 0px !important;">
                        <v-text-field
                          :value="range[1]"
                          class="mt-0 pt-0"
                          hide-details
                          single-line
                          type="number"
                          style="width: 50px"
                          @change="$set(range, 1, $event)"
                          :disabled="isNull"
                        ></v-text-field>
                        <span class="mt-0 pt-0" style="color: red; font-size: x-small;">{{maxFreqExtString}}</span>
                      </v-flex>
                </v-layout>

            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
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
        </v-card>
    </v-menu>
  </v-card>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import {poll, stopPoll} from "../utils";

export default {
  name: "EpitopeWithoutVariantsSelectorPercentage",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  data(){
    return {
      isLoading : false,
      min: 0,
      max: 1,
      minFreqExt: 0,
      maxFreqExt: 1,
      range: [0,1],
      minFreqExtString: '',
      maxFreqExtString: '',
      errorExt: '',
      results: [],
      menu: false,
      shown_value: null,
      isNull: false,
      forceNull: false,
      disablePercSel: false,
      minRange: null,
      maxRange: null,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySelWithoutVariants',
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    textBoxValue() {
      let a = [];
      if(this.minRange != null)
          a.push('min: ' + this.minRange);
      if(this.maxRange != null)
        a.push('max: ' + this.maxRange);
      return a.join('; ');
    },
    rangeUpdate(){
      return [this.minFreqExt, this.maxFreqExt];
    },
  },
  methods: {
      ...mapActions(['setEpiDropDownSelectedWithoutVariants']),
      ...mapMutations(['resetEpiQueryFieldWithoutVariants']),
      deleteExtremesLocal() {
          this.isNull = false;
          this.errorExt = '';
          this.setEpiDropDownSelectedWithoutVariants({field: 'startFreqExt', list: []});
          this.setEpiDropDownSelectedWithoutVariants({field: 'stopFreqExt', list: []});
          this.range = this.rangeUpdate;
          this.menu = false;
          this.shown_value = '';
          this.minRange = null;
          this.maxRange = null;
      },
      setExtremesLocal() {

        if(!this.isNull){
          if(this.range[0] < this.minFreqExt || this.range[1] > this.maxFreqExt) {
            this.errorExt = 'Select position inside extremes';
          }
          else {
            this.errorExt = '';
            this.shown_value = this.textBoxValue;
            this.menu = false;

            let sendStart = {'field': 'startFreqExt', 'list': [this.range[0]]}; //   aggiungo / 100
            this.setEpiDropDownSelectedWithoutVariants(sendStart);

            let sendStop = {'field': 'stopFreqExt', 'list': [this.range[1]]}; //   aggiungo / 100
            this.setEpiDropDownSelectedWithoutVariants(sendStop);
          }
        }
        else{
          this.errorExt = '';
          this.shown_value = "N/D";
          this.menu = false;

          let sendStart = {'field': 'startFreqExt', 'list': [null]};
          this.setEpiDropDownSelectedWithoutVariants(sendStart);

          let sendStop = {'field': 'stopFreqExt', 'list': [null]};
          this.setEpiDropDownSelectedWithoutVariants(sendStop);
        }
    },
    loadExtremes(){

      if(this.my_interval_extremes !== null){
          stopPoll(this.my_interval_extremes);
      }

      if(!this.epiSearchDis) {
        this.isLoading = true;
        const url = `epitope/epiFreqExtremesWithoutVariants`;
        let to_send = this.toSend();
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_extremes = poll(res.result, (res) => {
                this.my_interval_extremes = null;
                let vals = res.values;
                this.results = vals[0];
                if (this.results['count'] == 0) {
                  if (!this.epiQuerySelWithoutVariants['startFreqExt'] && !this.epiQuerySelWithoutVariants['stopFreqExt']) {
                    this.disablePercSel = true;
                  }
                } else {
                  if (this.results['startFreq'] === null || this.results['stopFreq'] === null) {
                    this.isNull = true;
                    this.forceNull = true;
                    this.disablePercSel = false;
                  } else {
                    this.minFreqExt = (Math.floor(this.results['startFreq'] * 100 ) / 100);  //    tolgo / 100
                    this.minFreqExtString = "Min: " + this.minFreqExt;
                    this.maxFreqExt = (Math.ceil(this.results['stopFreq'] * 100) / 100);    //    tolgo / 100
                    this.maxFreqExtString = "Max: " + this.maxFreqExt;
                    this.range = this.rangeUpdate;
                    if(this.results['stopFreq'] > 1){
                      this.max = Math.ceil(this.results['stopFreq']);
                    }
                    this.minRange = this.minFreqExt;
                    this.maxRange = this.maxFreqExt;
                    this.forceNull = false;
                    this.disablePercSel = false;
                  }
                }
                this.isLoading = false;
              })
            })
      }
    },
    toSend(){
      let res = {};
      Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": this.epiQuerySelWithoutVariants});
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
      if (!this.epiQuerySelWithoutVariants['startFreqExt'] && !this.epiQuerySelWithoutVariants['stopFreqExt']) {
        this.deleteExtremesLocal();
      }
      this.loadExtremes();
      if (this.epiQuerySelWithoutVariants['startFreqExt']){
        this.minRange = this.epiQuerySelWithoutVariants['startFreqExt'];   //    aggiungo * 100
      }
      if (this.epiQuerySelWithoutVariants['stopFreqExt']){
        this.maxRange = this.epiQuerySelWithoutVariants['stopFreqExt'];    //    aggiungo * 100
      }
      this.shown_value = this.textBoxValue;
    },
  },
  created() {
    this.loadExtremes();
  },
}
</script>

<style scoped>

</style>