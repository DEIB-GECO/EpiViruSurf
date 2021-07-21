<template>
  <v-card>
    <v-autocomplete
      :loading="isLoading"
      v-model="selected"
      :items="results"
      :item-text="rename"
      item-value="value"
      :label="text"
      :multiple="false"
      :disabled="epiSearchDis || disableTxtAmino"
    >
      <template slot="item" slot-scope="data">
          <span class="item-value-span"> {{rename(data.item)}}</span>
          <span class="item-count-span"> {{data.item.count}}</span>
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {FULL_TEXT, LOADING_TEXT, poll, stopPoll} from '../utils.js'

export default {
  name: "TextSelectorAminoAcidNewEpitope",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  watch: {
    newSingleAminoAcidConditionUser(){
      /*if(this.field === 'sequence_aa_original' || this.field === 'sequence_aa_alternative'){
        this.disableTxtAmino = this.getDisableTxtAmino();
      }*/                                                     //DISATTIVA ORIGINAL AND ALTERNATIVE AMINO
      if(!this.disableTxtAmino) {
          this.loadData();
      }
    },
  },
  computed: {
    ...mapState([
      'epiQuerySel',
      'aminoacidConditions',
      'epitopeAminoacidFields',
      'aminoacidConditions',
      'disableSelectorEpitopePart',
      'newSingleAminoAcidConditionUser'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    selected: {
      get() {
        let field_value = this.newSingleAminoAcidConditionUser[this.field];
        if(field_value) {
          field_value = field_value[0];
        }
        return field_value;
      },
      set(value){
        let list = [];
        list.push(value);
        this.setNewSingleAminoAcidConditionUserAction({field: this.field, list: list});
      }
    },
  },
  methods:{
    ...mapMutations([]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected', 'setNewSingleAminoAcidConditionUserAction']),
    loadData(){

        if(this.my_interval_data !== null){
          stopPoll(this.my_interval_data);
        }

        this.isLoading = true;
        this.results = [{value: LOADING_TEXT}];

        let queryToRun = Object.assign({}, this.compound_query);
        queryToRun['panel'] = this.newSingleAminoAcidConditionUser;

        const url = `field/${this.field}`;
        this.isLoading = true;

        axios.post(url, queryToRun)
        .then((res) => {
            return res.data
        })
        .then((res) => {
          this.my_interval_data = poll(res.result,(res)=>{
              this.my_interval_data = null;
              let vals = res.values;
              if (this.selected) {
                let arraySelected = [this.selected];
                  let zero_elements = arraySelected.filter(value => !res.values.map(v => v.value).includes(value))
                      .sort().map(v => Object({
                          value: v,
                          count: 0
                      }));
                  vals = vals.concat(zero_elements);
              }
              this.results = vals;
              this.isLoading = false;
            });
        })
    },
    rename(inp) {
        let value_in;
        if (inp.value !== null && inp.value !== undefined) {
          value_in = inp.value;
        } else
          value_in = 'N/D(not defined)';
        return value_in;
    },
    getDisableTxtAmino(){
      let bool = false;
      if(this.field === 'sequence_aa_original'){
        let query = this.newSingleAminoAcidConditionUser['variant_aa_type'];
        if(!query || (query.includes("ins") &&  !query.includes("del") &&  !query.includes("sub"))){
          bool = true;
        }
      }
      else if (this.field === 'sequence_aa_alternative'){
        let query = this.newSingleAminoAcidConditionUser['variant_aa_type'];
        if(!query || (query.includes("del") &&  !query.includes("ins") &&  !query.includes("sub"))){
          bool = true;
        }
      }
      return bool;
    },
  },
  data(){
    return {
      isLoading : false,
      results: [],
      disableTxtSel: false,
      disableTxtAmino: false,
      is_multiple: true,
      disabledEpi_AminoacidMenuOpened: false,
      disableTextAmino: true,
      my_interval_data: null,
    }
  },
  mounted() {
    //this.disableTxtAmino = this.getDisableTxtAmino();     //DISATTIVA ORIGINAL AND ALTERNATIVE AMINO
    //if(!this.disableTxtAmino) {
    this.loadData();
    //}
  },
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