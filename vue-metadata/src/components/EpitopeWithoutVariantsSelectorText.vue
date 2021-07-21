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
      :disabled="epiSearchDis || disableTxtSel"
    >
      <template slot="item" slot-scope="data">
          <span class="item-value-span"> {{rename(data.item)}}</span>
          <span v-if="field !== 'iedb_epitope_id'" class="item-count-span"> {{data.item.count}}</span>
      </template>
    </v-autocomplete>
  </v-card>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {FULL_TEXT, LOADING_TEXT, poll, stopPoll} from '../utils.js'

export default {
  name: "EpitopeWithoutVariantsSelectorText",
  props: {
      text: {type: String, required: true,},
      field: {type: String, required: true,},
  },
  watch: {
    epiQuerySelWithoutVariants() {
      this.loadData();
    },
    compound_query(){
      if(this.epiSearchDis){
        this.resetEpiQueryWithoutVariants();
      }
    },
    epiSearchDis(){
      if(this.epiSearchDis === false){
        this.loadData();
      }
    }
  },
  computed: {
    ...mapState([
      'epiQuerySelWithoutVariants',
      'selectedTabEpitope'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      epiSearchDis: 'epiSearchDisabled',
    }),
    selected: {
      get() {
        if(this.field === 'product'){
          if(this.epiQuerySelWithoutVariants[this.field]) {
            return this.epiQuerySelWithoutVariants[this.field][0];
          }
        }
        else {
          return this.epiQuerySelWithoutVariants[this.field];
        }
      },
      set(value){
        if(this.field === 'product'){
          let list = [];
          list.push(value);
          this.setEpiDropDownSelectedWithoutVariants({field: this.field, list: list}); //FOR APPLY
        }
        else {
          this.setEpiDropDownSelectedWithoutVariants({field: this.field, list: value}); //FOR APPLY
        }
      }
    },
  },
  methods:{
    ...mapMutations(['resetEpiQueryWithoutVariants']),
    ...mapActions(['setEpiDropDownSelectedWithoutVariants']),
    loadData(){

      if(this.my_interval_data !== null){
        stopPoll(this.my_interval_data);
      }

      if(!this.epiSearchDis) {
        this.isLoading = true;
        this.results = [{value: LOADING_TEXT}];
        let to_send = this.toSend();

        const url = `epitope/epiSelWithoutVariants/${this.field}`;
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {

              this.my_interval_data = poll(res.result, (res) => {
                this.my_interval_data = null;
                let vals = res.values;

                if (this.selected && Array.isArray(this.selected)) {
                  let zero_elements = this.selected
                      .filter(value => !res.values.map(v => v.value).includes(value))
                      .sort().map(v => Object({
                        value: v,
                        count: 0
                      }));
                  vals = vals.concat(zero_elements);
                }
                this.results = vals;

                if(this.field === "product"){
                  if(this.results.length !== 0 && !this.results.some(item => item.value === this.selected)){
                    this.selected = this.results[0].value;
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
      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySelWithoutVariants));
      Object.assign(res, {"compound_query": this.compound_query}, {"epi_query": epitope_conditions});
      return res;
    },
  },
  data(){
    return {
      isLoading : false,
      results: [],
      disableTxtSel: false,
      is_multiple: true,
      my_interval_data: null,
    }
  },
  mounted() {
    if(this.field === "product"){
      this.is_multiple = false;
    }
    this.loadData();
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