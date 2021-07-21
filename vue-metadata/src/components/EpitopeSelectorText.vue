<template>
  <v-card>
    <v-autocomplete
      :loading="isLoading"
      v-model="selected"
      :items="results"
      :item-text="rename"
      item-value="value"
      :label="text"
      :multiple="is_multiple"
      :disabled="epiSearchDis || disableTxtSel || disableTxtAmino || disabledEpi_AminoacidMenuOpened"
    >
      <template slot="item" slot-scope="data">
          <span class="item-value-span"> {{rename(data.item)}}</span>
          <span class="item-count-span" v-if="!epitopeAminoacidFields.some(item => item.field === field) && field !== 'iedb_epitope_id'"> {{data.item.count}}</span>
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {FULL_TEXT, LOADING_TEXT, poll, stopPoll} from '../utils.js'

export default {
  name: "EpitopeSelectorText",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  watch: {
    epiSearchDis(){
      if(this.epiSearchDis === false){
        this.loadData();
      }
    },
    compound_query_epi() {
      //this.loadData();
    },
    compound_query(){
      if(this.epiSearchDis){
        this.resetEpiQuery();
      }
    },
    /*compound_query() {
        this.loadData();
    },*/
    epiQuerySel() {
      this.loadData();
    },
    aminoacidConditions(){
      if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
        //this.disableTxtAmino = this.getDisableTxtAmino();       //DISATTIVA ORIGINAL AND ALTERNATIVE AMINO
        this.loadData();
      }
      else{
        if(Object.keys(this.aminoacidConditions).length > 0){
          this.disabledEpi_AminoacidMenuOpened = true;
        }
      }
    },
    disableSelectorEpitopePart(){
      if((!this.epitopeAminoacidFields.some(item => item.field === this.field)) && this.disableSelectorEpitopePart){
          this.disabledEpi_AminoacidMenuOpened = true;
      }
      else{
        this.disabledEpi_AminoacidMenuOpened = false;
      }
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel',
      'aminoacidConditions',
      'epitopeAminoacidFields',
      'aminoacidConditions',
      'disableSelectorEpitopePart',
      'selectedTabEpitope'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      compound_query_epi: 'build_query_epi',
      epiSearchDis: 'epiSearchDisabled',
    }),
    /*searchDisabled() {
      return this.epiQuerySel.length !== 0 || this.isLoading;
    },*/
    selected: {
      get() {
        if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
          return this.aminoacidConditions[this.field];
        }else {
          if(this.field === 'product'){
            if(this.epiQuerySel[this.field]) {
              return this.epiQuerySel[this.field][0];
            }
          }
          else {
            return this.epiQuerySel[this.field];
          }
        }
      },
      set(value){
        //this.setEpiDropDownSelected({field: this.field, list: value});  FOR APPLY
        if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
          this.setAminoacidConditionsSelected({field: this.field, list: value});
          //this.clearEpiQueryFromAmino();
        }
        else{
          if(this.field === 'product'){
            let list = [];
            list.push(value);
            this.setEpiDropDownSelected({field: this.field, list: list}); //FOR APPLY
          }
          else {
            this.setEpiDropDownSelected({field: this.field, list: value}); //FOR APPLY
          }
        }
      }
    },
  },
  methods:{
    ...mapMutations(['resetEpiQuery']),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected']),
    loadData(){

      if(this.my_interval_data !== null){
        stopPoll(this.my_interval_data);
      }

      if(!this.epiSearchDis) {
        //console.log("RELOAD ", this.value);
        this.isLoading = true;
        this.results = [{value: LOADING_TEXT}];
        let to_send = this.toSend();
        let to_send_modified = JSON.parse(JSON.stringify(to_send));
        let url = ''
        if (this.epitopeAminoacidFields.some(item => item.field === this.field)) {
           url = `epitope/epiSel/${this.field}`;
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

           url = `epitope/epiSelWithoutVariants/${this.field}`;
        }

        axios.post(url, to_send_modified)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              //console.log("ID ", res.result)

              this.my_interval_data = poll(res.result, (res) => {
                this.my_interval_data = null;
                let vals = res.values;

                //console.log("RES: ", vals, "SEL: ", this.selected , "ARR: ", Array.isArray(this.selected));
                if (this.selected && Array.isArray(this.selected)) {
                  // console.log("this.selected: ", this.selected);
                  let zero_elements = this.selected
                      .filter(value => !res.values.map(v => v.value).includes(value))
                      .sort().map(v => Object({
                        value: v,
                        count: 0
                      }));
                  //console.log("QUI: ", vals, zero_elements);
                  vals = vals.concat(zero_elements);
                }
                /*if (!this.is_gcm) {
                vals = vals.map(el => el.value).filter(el => el).sort()
                vals.unshift(FULL_TEXT)
                if (!vals.includes(this.selected)) {
                    this.selected = FULL_TEXT;
                }
                vals = vals.map(val => Object({
                    value: val
                }));

            }*/
                this.results = vals;

                if(this.field === "product"){
                  if(this.results.length !== 0 && !this.results.some(item => item.value === this.selected)){
                    this.selected = this.results[0].value;
                    //this.selected.set(this.results[0]);
                  }
                }

                if (this.results.length === 0) {
                  this.disableTxtSel = true;
                } else {
                  this.disableTxtSel = false;
                }

                this.isLoading = false;

              })
            })
      }
    },
    rename(inp) {
        let value_in;
        if (inp.value !== null && inp.value !== undefined) {
          value_in = inp.value;
        } else
          value_in = 'N/D(not defined)';
        return value_in;
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
      if(this.field === 'variant_aa_type' || this.field === 'sequence_aa_original' || this.field === 'sequence_aa_alternative'){
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
      if(this.epitopeAminoacidFields.some(item => item.field === this.field)){
        Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_and_aminoacid_conditions});
      }
      else {
        Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_conditions});
      }
      return res;
    },
    getDisableTxtAmino(){
      let bool = false;
      if(this.field === 'sequence_aa_original'){
        let query = this.aminoacidConditions['variant_aa_type'];
        if(!query || (query.includes("INS") &&  !query.includes("DEL") &&  !query.includes("SUB"))){
          bool = true;
        }
      }
      else if (this.field === 'sequence_aa_alternative'){
        let query = this.aminoacidConditions['variant_aa_type'];
        if(!query || (query.includes("DEL") &&  !query.includes("INS") &&  !query.includes("SUB"))){
          bool = true;
        }
      }
      return bool;
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
  data(){
    return {
      isLoading : true,
      results: [],
      disableTxtSel: false,
      disableTxtAmino: false,   //DISATTIVA ORIGINAL AND ALTERNATIVE AMINO set true
      is_multiple: true,
      disabledEpi_AminoacidMenuOpened: false,
      my_interval_data: null,
    }
  },
  mounted() {
    //this.disableTxtAmino = this.getDisableTxtAmino();       //DISATTIVA ORIGINAL AND ALTERNATIVE AMINO
    if(this.field === "product"){
      this.is_multiple = false;
    }
    //this.loadData();
  },
  created() {
    this.loadData();
    if (!this.epitopeAminoacidFields.some(item => item.field === this.field) && this.disableSelectorEpitopePart) {
      this.disabledEpi_AminoacidMenuOpened = true;
    } else {
      this.disabledEpi_AminoacidMenuOpened = false;
    }
  }
}
</script>

<style scoped>

  .item-value-span {
      padding-right: 3.5em;
  }

  .item-count-span {
      /*float:right;*/
      position: absolute;
      right: 0.5em;
  }

</style>