<template>
  <v-container fluid grid-list-xl class="EpitopeMenu" >
    <v-layout wrap align-center>
      <v-flex xs12 md8 lg8 class="no-horizontal-padding">
        <h2 style="margin-bottom: 10px">Add amino acid restriction</h2>
        <h3 style="margin-bottom: 20px">For computing statistics over a fraction of the selected population carrying the amino acid change</h3>
      </v-flex>
      <v-flex xs12 md4 lg4 class="no-horizontal-padding" style="margin-bottom: 10px">
        <v-btn @click="openAnalyzeSubstitutionPanel()"  color="rgb(122, 139, 157)" style="color:white;">
                  Analyze subsitutions</v-btn>
      </v-flex>
    </v-layout>
    <v-layout wrap align-center justify-space-around style="margin-bottom: 10px">
      <v-flex xs12 lg12 class="no-horizontal-padding" v-if="Object.keys(newSingleAminoAcidConditionUser).length > 0"
              style="margin-top: 10px; margin-bottom: 30px; margin-left: 20px; margin-right: 20px" >
          <span class="label">
            Amino acid condition:
          </span>
          <span style="font-family:monospace; font-size:120%;">
              {{ queryToShow }}
          </span>
        </v-flex>
      <v-flex class="no-horizontal-padding xs12 sm6 md4 lg2 d-flex EpitopeSelectors"
                  v-for="fieldEpi in aminoAcidFields" v-bind:key="fieldEpi.text">

        <PositionSelectorAminoAcidNewEpitope
            v-if="fieldEpi.field==='position_range'"
          :text="fieldEpi.text"
          :field="fieldEpi.field"></PositionSelectorAminoAcidNewEpitope>
        <TextSelectorAminoAcidNewEpitope
            v-else
            :text="fieldEpi.text"
          :field="fieldEpi.field"></TextSelectorAminoAcidNewEpitope>
        <v-dialog width="500">
            <v-btn
                    slot="activator"
                    class="info-button"
                    small
                    flat icon color="#696969">
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

    <!--<span><b>NEW CONDITION: </b>{{newSingleAminoAcidConditionUser}}</span>-->

    <span style="display: block" v-if="epitopeAminoacidConditionsArrayUserNewInOR.length>0"> <b>CONDITIONS IN OR:</b>
      <span v-for="(condition, index) in epitopeAminoacidConditionsArrayUserNewInOR">
        <span v-if="index > 0"> OR </span> {{condition}}
      </span>
    </span>


    <v-layout wrap justify-center style="margin-top: 20px">
      <v-btn @click="closeAminoEpiMenu()"
                       class="white--text" color="#696969">CLEAR & CLOSE</v-btn>
        <v-btn @click="clearAminoEpiMenu()" class="white--text" color="rgb(122, 139, 157)">CLEAR</v-btn>
        <v-btn @click="applyAminoacidConditions()" class="white--text" color="#00008B">ADD</v-btn>
        <!--<v-btn @click="addAminoacidConditionsInOR()" class="white--text" color="light-green">ADD IN OR</v-btn>-->
    </v-layout>

    <AnalyzeSubstitutionPanel></AnalyzeSubstitutionPanel>

  </v-container>
</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import axios from "axios";
import EpitopeSelectorText from "./EpitopeSelectorText";
import EpitopeSelectorNum from "./EpitopeSelectorNum";
import ProteinSelectorNewEpitope from "./ProteinSelectorNewEpitope";
import PositionSelectorNewEpitope from "./PositionSelectorNewEpitope";
import PositionSelectorAminoAcidNewEpitope from "./PositionSelectorAminoAcidNewEpitope";
import TextSelectorAminoAcidNewEpitope from "./TextSelectorAminoAcidNewEpitope";
import AnalyzeSubstitutionPanel from "./AnalyzeSubstitutionPanel";

export default {
  name: "AminoacidVariantNewUserEpitope",
  components: {
    AnalyzeSubstitutionPanel,
    TextSelectorAminoAcidNewEpitope,
    PositionSelectorAminoAcidNewEpitope, PositionSelectorNewEpitope, ProteinSelectorNewEpitope},
  data() {
    return {
      singleCondition: [],
      aminoAcidFields: null,
    }
  },
  computed: {
    ...mapState([
        'disableSelectorUserNewEpitopePart', 'newSingleAminoAcidConditionUser',
      'epitopeAminoacidConditionsArrayUserNewInOR', 'addingEpitope'
    ]),
    ...mapGetters({
        compound_query: 'build_query',
    }),
    queryToShow() {
      let inner_list = [];
      Object.keys(this.newSingleAminoAcidConditionUser).forEach(key => {
        const value2 = [];
        const value = this.newSingleAminoAcidConditionUser[key];

        let modifiedKey = this.modifyKey(key);

        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val === null)
              value2.push("N/D");
            else{
              if(modifiedKey === 'original_amino_acid' || modifiedKey === 'alternative_amino_acid' || modifiedKey === 'variant_type'){
                value2.push(val.toUpperCase());
              }
              else {
                value2.push(val);
              }
            }
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
       'setFalseDisableSelectorUserNewEpitopePart',
      'setFalseShowAminoacidVariantUserNewEpi', 'setFalseDisableSelectorEpitopePart',
        'addEpitopeAminoacidConditionsArrayUserNew', 'addEpitopeAminoacidConditionsArrayUserNewInOR',
        'resetEpitopeAminoacidConditionsArrayUserNewInOR', 'resetNewSingleAminoAcidConditionUser',
        'changeAddingEpitope', 'setTrueAnalyzeSubstitutionPanel'
    ]),
    ...mapActions(['setNewSingleAminoAcidConditionUserAction']),
    openAnalyzeSubstitutionPanel(){
      this.setTrueAnalyzeSubstitutionPanel();
    },
    closeAminoEpiMenu(){
      this.setFalseDisableSelectorEpitopePart();
      this.setFalseShowAminoacidVariantUserNewEpi();
      this.clearAminoEpiMenu();
      this.setFalseDisableSelectorUserNewEpitopePart();
    },
    clearAminoEpiMenu(){
      this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
      this.resetEpitopeAminoacidConditionsArrayUserNewInOR();
    },
    applyAminoacidConditions(){
      let copy = JSON.parse(JSON.stringify(this.newSingleAminoAcidConditionUser));
      let copyOR = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNewInOR));
      let all;
      if(Object.keys(copy).length === 0 && copyOR.length === 0) {
        console.log("NOTHING TO ADD");
      }
      else {
        if (copyOR.length > 0) {
          all = copyOR;
          if(Object.keys(copy).length>0){
            all.push(copy);
          }
        } else {
          all = copy;
        }
        this.addEpitopeAminoacidConditionsArrayUserNew(all);
        this.closeAminoEpiMenu();
      }
    },
    addAminoacidConditionsInOR(){
      if(Object.keys(this.newSingleAminoAcidConditionUser).length > 0) {
        let copy = JSON.parse(JSON.stringify(this.newSingleAminoAcidConditionUser));
        this.addEpitopeAminoacidConditionsArrayUserNewInOR(copy);
        this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
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
       else if(key === 'product'){
         modifiedKey = 'variant_protein';
       }
       else if(key === 'start_aa_original'){
         modifiedKey = 'variant_position_range';
       }
       else{
         modifiedKey = key;
       }

       return modifiedKey;
     },
  },
  watch: {
    disableSelectorUserNewEpitopePart(){
      if(this.disableSelectorUserNewEpitopePart){
        this.singleCondition = [];
      }
    },
    addingEpitope(){
      if(this.addingEpitope){
        this.closeAminoEpiMenu();
        this.changeAddingEpitope();
      }
    }

  },
  created() {
    const url = `epitope/fieldAminoNewEpiUser `;

    axios.get(url)
      .then((res) => {
          return res.data;
      })
      .then((res) => {
          let vals = res.fields;
          this.aminoAcidFields = vals;
      });
  }
}
</script>

<style scoped>
  .EpitopeMenu{
    border : 1px solid black;
    background-color:	#C0C0C0 !important;
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