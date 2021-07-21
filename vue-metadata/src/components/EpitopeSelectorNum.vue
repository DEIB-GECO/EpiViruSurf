<template>
  <v-card>
    <v-menu style="width: 100%"
            :close-on-click="true"
            :close-on-content-click="false"
            :loading = "isLoading"
            v-model="menu"
            offset-y
            :disabled="epiSearchDis || isLoading || disableNumSel || disabledEpi_AminoacidMenuOpened"
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="text"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="epiSearchDis || isLoading || disableNumSel || menu || disabledEpi_AminoacidMenuOpened"
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
  name: "EpitopeSelectorNum",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  data(){
    return {
      isLoading : true,
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
      disabledEpi_AminoacidMenuOpened: false,
      my_interval_extremes: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'aminoacidConditions', 'disableSelectorEpitopePart', 'epitopeAminoacidFields'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    /*searchDisabled() {
      return this.epiQuerySel.length !== 0
    },*/
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
      ...mapActions(['setEpiDropDownSelected', "setAminoacidConditionsSelected"]),
      ...mapMutations(['resetEpiQueryField']),
      deleteExtremesLocal() {
          this.errorExt = '';
          if(this.field === 'position_range') {
            this.setEpiDropDownSelected({field: 'startExt', list: []});
            this.setEpiDropDownSelected({field: 'stopExt', list: []});
          }
          else if (this.field === 'variant_position_range'){
            //this.clearEpiQueryFromAmino();
            //this.setEpiDropDownSelected({field: 'startExtVariant', list: []});                FOR APPLY
            this.setAminoacidConditionsSelected({field: 'startExtVariant', list: []});
            //this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});                 FOR APPLY
            this.setAminoacidConditionsSelected({field: 'stopExtVariant', list: []});
          }
          this.min = null;
          this.max = null;
          this.menu = false;
          this.shown_value = this.textBoxValue;
          //console.log("CLEAR: " , this.epiQuerySel);
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

          //if(this.field === 'variant_position_range'){
            //this.clearEpiQueryFromAmino();
          //}

          if(this.min !== null && this.min !== undefined) {
            let sendStart;
            if (this.field === 'position_range') {
              if(Array.isArray(this.min)){
                sendStart = {'field': 'startExt', 'list': this.min};
              }
              else {
                sendStart = {'field': 'startExt', 'list': [this.min]};
              }
              this.setEpiDropDownSelected(sendStart);
            }
            else if(this.field === 'variant_position_range') {
              sendStart = {field: 'startExtVariant', list: [this.min]};
              //this.setEpiDropDownSelected(sendStart);                 FOR APPLY
              this.setAminoacidConditionsSelected(sendStart);
            }
          }else{
            if(this.field === 'position_range') {
              this.setEpiDropDownSelected({field: 'startExt', list: []});
            }
            else if (this.field === 'variant_position_range'){
              //this.setEpiDropDownSelected({field: 'startExtVariant', list: []});            FOR APPLY
              this.setAminoacidConditionsSelected({field: 'startExtVariant', list: []});
            }
          }

          if(this.max !== null && this.max !== undefined) {
            let sendStop;
            if (this.field === 'position_range') {
               if(Array.isArray(this.max)){
                  sendStop = {'field': 'stopExt', 'list': this.max};
                }
                else {
                  sendStop = {'field': 'stopExt', 'list': [this.max]};
                }
              this.setEpiDropDownSelected(sendStop);
            }
            else if(this.field === 'variant_position_range') {
              sendStop = {field: 'stopExtVariant', list: [this.max]};
              //this.setEpiDropDownSelected(sendStop);              FOR APPLY
              this.setAminoacidConditionsSelected(sendStop);
            }
          }
          else{
            if(this.field === 'position_range') {
              this.setEpiDropDownSelected({field: 'stopExt', list: []});
            }
            else if (this.field === 'variant_position_range'){
              //this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});               FOR APPLY
              this.setAminoacidConditionsSelected({field: 'stopExtVariant', list: []});
            }
          }
        }
    },
    loadExtremes(){

      if(this.my_interval_extremes !== null){
        stopPoll(this.my_interval_extremes);
      }

      if(!this.epiSearchDis){
        this.isLoading = true;
        //console.log("RELOAD extremes");
        let to_send = this.toSend();
        let to_send_modified = JSON.parse(JSON.stringify(to_send));
        let url = '';
        if (this.epitopeAminoacidFields.some(item => item.field === this.field)) {
           url = `epitope/epiExtremes/${this.field}`;
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
          url = `epitope/epiExtremesWithoutVariants/${this.field}`;  //ONLY IF ALL EPITOPE HAVE A MUTATION
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
                if (this.results['start'] === null || this.results['stop'] === null) {
                  if (this.field === 'position_range' && !this.epiQuerySel['startExt'] && !this.epiQuerySel['stopExt']) {
                    this.disableNumSel = true;
                  }else if (this.field === 'variant_position_range' && !this.aminoacidConditions['startExtVariant'] && !this.aminoacidConditions['stopExtVariant']) {
                    this.disableNumSel = true;
                  }
                  //this.deleteExtremesLocal();
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
      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));              //  FOR APPLY ALL IF AND ELSE
      this.epitopeAminoacidFields.forEach(elem => {
            delete epitope_conditions[elem.field];
          }
      )
      delete epitope_conditions['startExtVariant'];
      delete epitope_conditions['stopExtVariant'];

      /*    CHANGE EPITOPE AMINO ACID SELECTION
      if(this.field === 'variant_position_range'){
        delete epitope_conditions['cell_type'];
        delete epitope_conditions['is_linear'];
        delete epitope_conditions['mhc_allele'];
        delete epitope_conditions['startExt'];
        delete epitope_conditions['startFreqExt'];
        delete epitope_conditions['stopExt'];
        delete epitope_conditions['stopFreqExt'];
      }
       */

      let aminoacid_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions));
      let epitope_and_aminoacid_conditions = Object.assign(aminoacid_conditions, epitope_conditions);
      if(this.field === 'variant_position_range'){
         Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_and_aminoacid_conditions});
      }
      else {
         Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_conditions});
      }
      return res;
    },
    clearEpiQueryFromAmino(){
      this.epitopeAminoacidFields.forEach(elem => {
            this.setEpiDropDownSelected({field: elem.field, list: []});
          }
      )
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
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
    epiQuerySel(){
      if (this.field === 'position_range' && !this.epiQuerySel['startExt'] && !this.epiQuerySel['stopExt']) {
        this.deleteExtremesLocal();
      }
      this.loadExtremes();
      if(this.field === 'position_range') {
        if (this.epiQuerySel['startExt']) {
          this.min = this.epiQuerySel['startExt'];
        }
        if (this.epiQuerySel['stopExt']) {
          this.max = this.epiQuerySel['stopExt'];
        }
      }
      else{
        if (this.epiQuerySel['startExtVariant']) {
          this.min = this.epiQuerySel['startExtVariant'];
        }
        if (this.epiQuerySel['stopExtVariant']) {
          this.max = this.epiQuerySel['stopExtVariant'];
        }
      }
      this.shown_value = this.textBoxValue;
    },
    aminoacidConditions(){
      if (this.field === 'variant_position_range' && !this.aminoacidConditions['startExtVariant'] && !this.aminoacidConditions['stopExtVariant']) {
        this.deleteExtremesLocal();
      }
      if(this.field === 'variant_position_range'){
        this.loadExtremes();
      }
      else{
        if(Object.keys(this.aminoacidConditions).length > 0){
          this.disabledEpi_AminoacidMenuOpened = true;
        }
      }
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
      //console.log(this.min, this.minInt, this.min_min);
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
      //console.log(this.max, this.maxInt, this.max_max);
    },
    disableSelectorEpitopePart(){
      if(this.field === "position_range" && this.disableSelectorEpitopePart){
          this.disabledEpi_AminoacidMenuOpened = true;
      }
      else{
        this.disabledEpi_AminoacidMenuOpened = false;
      }
    }
  },
  created() {
    this.loadExtremes();
    if (!this.epitopeAminoacidFields.some(item => item.field === this.field) && this.disableSelectorEpitopePart) {
      this.disabledEpi_AminoacidMenuOpened = true;
    } else {
      this.disabledEpi_AminoacidMenuOpened = false;
    }
    if(this.field === 'position_range') {
        if (this.epiQuerySel['startExt']) {
          this.min = this.epiQuerySel['startExt'];
        }
        if (this.epiQuerySel['stopExt']) {
          this.max = this.epiQuerySel['stopExt'];
        }
      }
      else{
        if (this.epiQuerySel['startExtVariant']) {
          this.min = this.epiQuerySel['startExtVariant'];
        }
        if (this.epiQuerySel['stopExtVariant']) {
          this.max = this.epiQuerySel['stopExtVariant'];
        }
      }
      this.shown_value = this.textBoxValue;
  },
}
</script>

<style scoped>

</style>