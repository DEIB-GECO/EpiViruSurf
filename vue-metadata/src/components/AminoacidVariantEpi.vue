<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <v-layout wrap align-center>
      <v-flex xs12 md8 lg8 class="no-horizontal-padding">
        <h2 style="margin-bottom: 10px">Add condition on overlapping amino acid changes</h2>
        <h3 style="margin-bottom: 20px">Restrict statistics of selected epitopes to the given amino acid change(s)</h3>
      </v-flex>
      <v-flex xs12 md4 lg4 class="no-horizontal-padding" style="margin-bottom: 10px">
        <v-btn @click="openAnalyzeSubstitutionPanel()"  color="rgb(122, 139, 157)" style="color:white;">
                  Analyze subsitutions</v-btn>
      </v-flex>
    </v-layout>
    <v-layout wrap align-center>
      <v-flex xs12 lg12 class="no-horizontal-padding" v-if="Object.keys(aminoacidConditions).length > 0" style="margin-top: 10px; margin-bottom: 30px; margin-left: 20px; margin-right: 20px" >
          <span class="label">
            Amino Acid Variant
          </span>
          <span style="font-family:monospace; font-size:120%;">
              {{ queryToShow }}
          </span>
        </v-flex>
      <v-flex class="no-horizontal-padding xs12 sm6 md6 lg3 d-flex EpitopeSelectors"
                  v-for="fieldEpi in epitopeAminoacidFields" v-bind:key="fieldEpi.text">
                  <EpitopeSelectorText
                      v-if="!fieldEpi.is_numerical && !fieldEpi.is_percentage "
                      :text="fieldEpi.text"
                      :field="fieldEpi.field">
                  </EpitopeSelectorText>
                  <EpitopeSelectorNum
                      v-if="fieldEpi.is_numerical"
                      :text="fieldEpi.text"
                      :field="fieldEpi.field">
                  </EpitopeSelectorNum>
                  <v-dialog width="500">
                    <v-btn
                            slot="activator"
                            class="info-button"
                            small
                            flat icon color="grey">
                        <v-icon class="info-icon">info</v-icon>
                    </v-btn>
                    <v-card>
                        <v-card-title
                                class="headline grey lighten-2"
                                primary-title
                        >
                            {{fieldEpi.text}}
                        </v-card-title>
                        <v-card-text>
                            {{fieldEpi.description}}
                        </v-card-text>
                    </v-card>
                </v-dialog>

      </v-flex>
    </v-layout>
    <v-layout wrap justify-center style="margin-top: 20px">
      <v-btn @click="closeAminoEpiMenu()"
                       class="white--text" color="#696969">CLEAR & CLOSE</v-btn>
       <v-btn @click="clearAminoEpiMenu()" class="white--text" color="rgb(122, 139, 157)">CLEAR</v-btn>
      <v-btn @click="applyAminoacidConditions()" class="white--text" color="#00008B">APPLY</v-btn>
    </v-layout>

    <v-layout wrap justify-center align-center style="margin-top: 20px">
      <span v-if="appliedActuaQuery === true">
        Current amino acid filter: applied
      </span>
      <v-icon v-if="appliedActuaQuery === true" style="margin-left: 5px" medium color="green" right>check_circle</v-icon>
      <span v-if="appliedActuaQuery === false">
        Current amino acid filter: not yet applied
      </span>
      <v-icon v-if="appliedActuaQuery === false" style="background-color: red; border-radius: 100%; margin-left: 5px" color="white" right>close</v-icon>

    </v-layout>

    <AnalyzeSubstitutionPanel></AnalyzeSubstitutionPanel>

  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import EpitopeSelectorText from "./EpitopeSelectorText";
import EpitopeSelectorNum from "./EpitopeSelectorNum";
import AnalyzeSubstitutionPanel from "./AnalyzeSubstitutionPanel";

export default {
  name: "AminoacidVariantEpi",
  components: {AnalyzeSubstitutionPanel, EpitopeSelectorNum, EpitopeSelectorText},
  data() {
    return {
    }
  },
  computed: {
    ...mapState([
      'showAminoacidVariantEpi', 'epiQuerySel', 'query', 'epitopeAminoacidFields',
      'aminoacidConditions', 'epitopeAminoacidFields','fromPredefinedQuery', 'disableSelectorEpitopePart',
        'appliedActuaQuery'
    ]),
    ...mapGetters({
        epiSearchDis: 'epiSearchDisabled',
        compound_query: 'build_query',
    }),
    queryToShow() {
      let inner_list = [];
      Object.keys(this.aminoacidConditions).forEach(key => {
        const value2 = [];
        const value = this.aminoacidConditions[key];

        let modifiedKey = this.modifyKey(key);

        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val === null)
              value2.push("N/D");
            else
              value2.push(val);
          });
          inner_list.push(modifiedKey + ': ' + JSON.stringify(value2));
        } else {
          inner_list.push(modifiedKey + ': ' + JSON.stringify(value));
        }
      });
      return inner_list.join(", ");
    }
  },
  methods:{
    ...mapMutations([
        'setTrueShowAminoacidVariantEpi', 'setFalseShowAminoacidVariantEpi', 'setEpitopeAminoacidFields',
      'setFalseDisableSelectorEpitopePart', 'setTrueAnalyzeSubstitutionPanel', 'setTrueAppliedActuaQuery',
        'setFalseAppliedActuaQuery'
    ]),
    ...mapActions(['setEpiDropDownSelected', 'setAminoacidConditionsSelected']),
    openAnalyzeSubstitutionPanel(){
      this.setTrueAnalyzeSubstitutionPanel();
    },
    closeAminoEpiMenu(){
      this.setFalseDisableSelectorEpitopePart();
      this.setFalseShowAminoacidVariantEpi();
      this.clearAminoEpiMenu();
      this.clearEpiQueryFromAmino();
    },
    clearAminoEpiMenu(){
      this.epitopeAminoacidFields.forEach(elem => {
            //this.setEpiDropDownSelected({field: elem.field, list: []});
            this.setAminoacidConditionsSelected({field: elem.field, list: []});
          }
      )
      //this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'startExtVariant', list: []});
      //this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
      this.setAminoacidConditionsSelected({field: 'stopExtVariant', list: []});
    },
    clearEpiQueryFromAmino(){
      this.epitopeAminoacidFields.forEach(elem => {
            this.setEpiDropDownSelected({field: elem.field, list: []});
          }
      )
      this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
    },
    applyAminoacidConditions(){
      this.setTrueAppliedActuaQuery();
      Object.entries(this.aminoacidConditions).forEach(item => {
          this.setEpiDropDownSelected({field: item[0], list:item[1]});
      });
      this.epitopeAminoacidFields.forEach(elem => {
        if(Object.entries(this.aminoacidConditions).some(item => item[0] === elem.field)){
        }
        else{
          this.setEpiDropDownSelected({field: elem.field, list: []});
        }
      });
      if(!this.aminoacidConditions['startExtVariant']){
        this.setEpiDropDownSelected({field: 'startExtVariant', list: []});
      }
      if(!this.aminoacidConditions['stopExtVariant']){
        this.setEpiDropDownSelected({field: 'stopExtVariant', list: []});
      }
    },
    modifyKey(key){
       let modifiedKey = '';
       if(key === 'variant_aa_type'){
         modifiedKey = 'variant_type';
       }
       else if(key === 'sequence_aa_original'){
         modifiedKey = 'original_amino_acid';
       }
       else if(key === 'sequence_aa_alternative'){
         modifiedKey = 'alternative_amino_acid';
       }
       else if(key === 'startExtVariant'){
         modifiedKey = 'variant_pos_range_start';
       }
       else if(key === 'stopExtVariant'){
         modifiedKey = 'variant_pos_range_stop';
       }
       else{
         modifiedKey = key;
       }

       return modifiedKey;
     },
  },
  watch: {
    compound_query(){
      if(!this.fromPredefinedQuery){
        if(this.epiSearchDis) {
          this.closeAminoEpiMenu();
        }
      }
    },
    aminoacidConditions(){
      this.setFalseAppliedActuaQuery();
    }
  },
  created() {
    const url = `epitope/fieldAminoEpi `;

    this.setEpitopeAminoacidFields([]);

    axios.get(url)
      .then((res) => {
          return res.data;
      })
      .then((res) => {
          let vals = res.fields;
          this.setEpitopeAminoacidFields(vals);
      });
  }
}
</script>

<style scoped>
  .EpitopeMenu{
    border : 1px solid black;
    background-color: #ebebeb;
    max-width: 70%;
    border-radius: 15px !important;
    margin-top: 20px;
    margin-bottom: 20px;
    }

  .EpitopeSelectors{
    margin-bottom: 10px;
  }

  .label {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px;
  }

</style>