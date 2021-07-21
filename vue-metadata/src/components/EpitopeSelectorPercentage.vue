<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading || disablePercSel || disabledEpi_AminoacidMenuOpened"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || disablePercSel || menu || disabledEpi_AminoacidMenuOpened"
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
  name: "EpitopeSelectorPercentage",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  data(){
    return {
      isLoading : true,
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
      disabledEpi_AminoacidMenuOpened: false,
      minRange: null,
      maxRange: null,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'disableSelectorEpitopePart', 'aminoacidConditions','epitopeAminoacidFields'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    textBoxValue() {
      let a = [];
        //a.push('min: ' + this.range[0]);
        //a.push('max: ' + this.range[1]);
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
      ...mapActions(['setEpiDropDownSelected']),
      ...mapMutations(['resetEpiQueryField']),
      deleteExtremesLocal() {
          this.isNull = false;
          this.errorExt = '';
          this.setEpiDropDownSelected({field: 'startFreqExt', list: []});
          this.setEpiDropDownSelected({field: 'stopFreqExt', list: []});
          this.range = this.rangeUpdate;
          this.menu = false;
          this.shown_value = '';
          this.minRange = null;
          this.maxRange = null;
          //console.log("CLEAR: " , this.epiQuerySel);
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
            this.setEpiDropDownSelected(sendStart);

            let sendStop = {'field': 'stopFreqExt', 'list': [this.range[1]]}; //   aggiungo / 100
            this.setEpiDropDownSelected(sendStop);

            //console.log("SET: ", this.epiQuerySel);
          }
        }
        else{
          this.errorExt = '';
          this.shown_value = "N/D";
          this.menu = false;

          let sendStart = {'field': 'startFreqExt', 'list': [null]};
          this.setEpiDropDownSelected(sendStart);

          let sendStop = {'field': 'stopFreqExt', 'list': [null]};
          this.setEpiDropDownSelected(sendStop);

          //console.log("SET: ", this.epiQuerySel);
        }
    },
    loadExtremes(){

      if(this.my_interval_extremes !== null){
          stopPoll(this.my_interval_extremes);
      }

      if(!this.epiSearchDis) {
        this.isLoading = true;
        let url = '';
        let to_send = this.toSend();
        let to_send_modified = JSON.parse(JSON.stringify(to_send));
        if (this.epitopeAminoacidFields.some(item => item.field === this.field)) {
           url = `epitope/epiFreqExtremes`;
        }
        else {
          let to_send_epi_query = to_send_modified.epi_query;
           delete to_send_modified.epi_query;
           delete to_send_epi_query.sequence_aa_original;
           delete to_send_epi_query.sequence_aa_alternative;
           delete to_send_epi_query.variant_aa_type;
           delete to_send_epi_query.startExtVariant;
           delete to_send_epi_query.stopExtVariant;
           to_send_modified['epi_query'] = to_send_epi_query;
          url = `epitope/epiFreqExtremesWithoutVariants`;
        }
        axios.post(url, to_send_modified)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_extremes = poll(res.result, (res) => {
                this.my_interval_extremes = null;
                let vals = res.values;
                this.results = vals[0];
                //console.log("RES PERC: ", this.results);
                if (this.results['count'] == 0) {
                  //this.deleteExtremesLocal();
                  if (!this.epiQuerySel['startFreqExt'] && !this.epiQuerySel['stopFreqExt']) {
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
      Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": this.epiQuerySel});
      return res;
    },
  },
  watch:{
    epiSearchDis(){
      if(this.epiSearchDis === false){
        this.loadExtremes();
      }
    },
    compound_query() {
      //this.loadExtremes();
    },
    aminoacidConditions(){
      if(Object.keys(this.aminoacidConditions).length > 0){
        this.disabledEpi_AminoacidMenuOpened = true;
      }
    },
    epiQuerySel(){
      if (!this.epiQuerySel['startFreqExt'] && !this.epiQuerySel['stopFreqExt']) {
        this.deleteExtremesLocal();
      }
      this.loadExtremes();
      if (this.epiQuerySel['startFreqExt']){
        this.minRange = this.epiQuerySel['startFreqExt'];   //    aggiungo * 100
      }
      if (this.epiQuerySel['stopFreqExt']){
        this.maxRange = this.epiQuerySel['stopFreqExt'];    //    aggiungo * 100
      }
      this.shown_value = this.textBoxValue;
    },
    disableSelectorEpitopePart() {
      if (this.disableSelectorEpitopePart) {
        this.disabledEpi_AminoacidMenuOpened = true;
      } else {
        this.disabledEpi_AminoacidMenuOpened = false;
      }
    }
  },
  created() {
    //this.loadExtremes();
    if (this.disableSelectorEpitopePart) {
      this.disabledEpi_AminoacidMenuOpened = true;
    } else {
      this.disabledEpi_AminoacidMenuOpened = false;
    }

    if (!this.epiQuerySel['startFreqExt'] && !this.epiQuerySel['stopFreqExt']) {
        this.deleteExtremesLocal();
      }
      this.loadExtremes();
      if (this.epiQuerySel['startFreqExt']){
        this.minRange = this.epiQuerySel['startFreqExt'];   //    aggiungo * 100
      }
      if (this.epiQuerySel['stopFreqExt']){
        this.maxRange = this.epiQuerySel['stopFreqExt'];    //    aggiungo * 100
      }
      this.shown_value = this.textBoxValue;
  },
}
</script>

<style scoped>

</style>