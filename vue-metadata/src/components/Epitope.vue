<template>
  <v-card class="EpitopeCard">

    <v-layout wrap align-center justify-center>
        <div class="separator"></div>
      </v-layout>

      <v-tabs color="#ebebeb" v-model="selectedTab">
        <v-tabs-slider color="rgb(201, 53, 53)"  style="height: 5px"></v-tabs-slider>
          <v-tab>
               Custom Epitopes
          </v-tab>
          <v-tab>
              Use IEDB Epitopes Without Variant Counts
          </v-tab>
          <v-tab>
              Use IEDB Epitopes With Variant Counts
          </v-tab>


          <v-tab-item>
            <div v-if="selectedTab === this.toCustom">
            <AddNewEpitope></AddNewEpitope>
            </div>
          </v-tab-item>

          <v-tab-item>
            <div v-if="selectedTab === this.toEpitopeWithoutVariants">
            <EpitopeWithoutVariants></EpitopeWithoutVariants>
            </div>
          </v-tab-item>


          <v-tab-item>
            <div v-if="selectedTab === this.toEpitopeVariants">
                  <v-container fluid grid-list-xl class="EpitopeMenu">
                    <v-layout wrap align-center justify-center>

                      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
                        <h2>IEDB Epitope search</h2>
                      </v-flex>

                      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
                        <h3 style="color:red"  v-if="epiSearchDis">{{requirement}}</h3>
                      </v-flex>

                      <v-flex xs12 class="no-horizontal-padding" v-if="Object.keys(epiQuerySel).length > 0" style="margin-bottom: 30px; margin-left: 20px; margin-right: 20px">
                      <span class="label">
                                        Epitope search condition:
                                    </span>
                      <span style="font-family:monospace; font-size:120%;">
                                        {{ queryToShow }}
                                    </span>
                    </v-flex>

                      <v-flex class="no-horizontal-padding xs12 sm6 md4 lg3 d-flex EpitopeSelectors"
                              v-for="fieldEpi in epitopeFields" v-bind:key="fieldEpi.text">
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
                              <EpitopeSelectorPercentage
                                  v-if="fieldEpi.is_percentage"
                                  :text="fieldEpi.text"
                                  :field="fieldEpi.field">
                              </EpitopeSelectorPercentage>
                              <v-dialog width="500" v-if="fieldEpi.field !== 'response_frequency'">
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
                              <v-dialog width="500" v-else>
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
                                      Range of allowed values for the response frequency of positive assays.
                                      <br><br>
                                      In IEDB this measure is defined as the number of positively responded subjects (R)
                                      divided by the total number of those tested (N), summed up by mapped epitopes; to compensate
                                      for epitopes that are identified by a low number of assays, we employ a corrected formula
                                      (proposed by Carrasco et al. (<a href="https://doi.org/10.1155/2015/763461" target="_blank">https://doi.org/10.1155/2015/763461</a>)
                                      resulting as (R-sqrt(R))/N, where the importance of corrections decreases as the number of assays increases.
                                    </v-card-text>
                                </v-card>
                            </v-dialog>
                      </v-flex>
                    </v-layout>
                    <v-layout wrap  style="margin-top: 20px">
                      <v-spacer></v-spacer>
                     <v-btn :disabled="disableSelectorEpitopePart || epiSearchDis"
                         @click="resetEpiQuery"
                            color="rgb(122, 139, 157)" style="color: white">CLEAR EPITOPE QUERY</v-btn>
                  </v-layout>
                  </v-container>

                  <EpitopeTable></EpitopeTable>
            </div>
          </v-tab-item>
      </v-tabs>

      <v-dialog
              v-model="dialogModeEpitopeWithVariants"
              width="550"
          >
          <v-card>
              <v-card-title
                      class="headline"
                      style="background-color:rgb(201, 53, 53) ; color: white">
                  Warning
                <v-spacer></v-spacer>
                <v-btn
                    style="background-color: rgb(122, 139, 157)"
                    slot="activator"
                    flat icon
                    small
                  color="white"
                  @click="dialogModeEpitopeWithVariants = false;"
                >
                  <v-icon>close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                We discourage using the mode "USE IEDB EPITOPES WITH VARIANT COUNTS"
                with very big sets of sequences.
                <br><br>
                For optimal functioning of EpiSurf, we suggest selecting on the order of thousands of sequences;
                please use metadata filters accordingly.
                If the set is bigger, expect a slowdown!
                <v-layout wrap justify-end style="margin-top: 10px;">
                  <v-flex sm7 align-self-center>
                  </v-flex>
                  <v-flex sm5 align-end>
                    <v-checkbox
                        color="gray"
                      v-model="dontShowAgainWarningMode3"
                      label="Do not show this again"
                      input-value="true"
                        class="shrink mr-0 mt-0"
                    hide-details>
                    </v-checkbox>
                  </v-flex>
                </v-layout>
              </v-card-text>
          </v-card>
      </v-dialog>


  </v-card>
</template>

<script>
import axios from "axios";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import EpitopeSelectorText from "./EpitopeSelectorText"
import EpitopeSelectorNum from "./EpitopeSelectorNum"
import EpitopeSelectorPercentage from "./EpitopeSelectorPercentage"
import EpitopeTable from "./EpitopeTable";
import AddNewEpitope from "./AddNewEpitope";
import {poll} from "../utils";
import EpitopeWithoutVariants from "./EpitopeWithoutVariants";

export default {
  name: "Epitope",
  components: {
    EpitopeWithoutVariants,
    AddNewEpitope,
    EpitopeTable,
    EpitopeSelectorText,
    EpitopeSelectorNum,
    EpitopeSelectorPercentage,
  },
  data() {
    return {
      /*epitopeFields :[{text:'Protein Name', field:'protein_ncbi_id', is_numerical: false, is_percentage: false, description: 'a'},
                      {text:'Assay (T/B Cell)', field:'cell_type', is_numerical: false, is_percentage: false, description: 'b'},
                      {text:'HLA restriction', field:'mhc_class', is_numerical: false, is_percentage: false,  description: 'c'},
                      {text:'Linear / Non Linear', field:'is_linear', is_numerical: false, is_percentage: false, description: 'd'},
                      {text:'Response Freq', field:'response_frequency', is_numerical:false, is_percentage: true, description: 'e'},
                      {text:'Position Range', field:'position_range', is_numerical: true , is_percentage: false, description: 'f'},
      ],*/
      epitopeFields: [],
      requirement: 'A single Host and a single Virus are required',
      toEpitopeVariants: 2,
      toEpitopeWithoutVariants: 1,
      toCustom : 0,
      selectedTab: this.setSelectedTab(),
      epiQueryUsedTab: 0,
      dialogModeEpitopeWithVariants: false,
      dontShowAgainWarningMode3: false,
    }
  },
  computed: {
    ...mapState(['disableSelectorEpitopePart', 'countEpi', 'epitopeAdded',
      'epiQuerySel', 'epiQuerySelWithoutVariants','disableSelectorUserNewEpitopePart', 'disableSelectorEpitopePart', 'aminoacidConditions',
    'selectedTabEpitope', 'countEpiToShow', 'countEpiCustom', 'countEpiWithoutVariants', 'epitopeAminoacidFields',
    'fromPredefinedQuery', 'dontShowWarningMode3Again']),
    ...mapGetters({
      epiSearchDis: 'epiSearchDisabled',
      compound_query: 'build_query'
    }),
    queryToShow() {
      let inner_list = [];
      Object.keys(this.epiQuerySel).forEach(key => {
        if(key !== 'variant_aa_type' && key !== 'sequence_aa_original' && key !== 'sequence_aa_alternative'
        && key !== 'startExtVariant' && key !== 'stopExtVariant') {
          const value2 = [];
          const value = this.epiQuerySel[key];

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
        }
      });
      return inner_list.join(", ");
    }
  },
   methods: {
     ...mapMutations(['resetEpiQuery', 'resetEpiQueryWithoutVariants', 'setCountEpi', 'setFalseDisableSelectorUserNewEpitopePart',
       'setFalseShowAminoacidVariantUserNewEpi', 'setFalseDisableSelectorEpitopePart',
       'setFalseShowAminoacidVariantEpi', 'setTrueDisableSelectorEpitopePart', 'setTrueShowAminoacidVariantEpi',
     'setCountEpiCustom', 'setCountEpiToShow', 'setSelectedTabEpitopeToCustom', 'setSelectedTabEpitopeToEpitopeVariants',
     'setSelectedTabEpitopeToEpitopeWithoutVariants', 'setCountEpiWithoutVariants',
     'setEpiQuery', 'setEpiQueryWithoutVariants', 'setFalseFromPredefinedQuery', 'resetAminoacidConditionQuery',
     'resetNewSingleEpitopeQuery', 'resetEpitopeAminoacidConditionsArrayUserNewInOR', 'showWarningMode3']),
     ...mapActions([
         'setNewSingleAminoAcidConditionUserAction'
     ]),
     toSend(){
      let res = {};
      Object.assign(res,{"compound_query": this.compound_query},
                        {"epi_query": this.epiQuerySel});
      return res;
    },
     setSelectedTab(){
      this.selectedTab = this.selectedTabEpitope;
    },
     modifyKey(key){
       let modifiedKey = '';
       if(key === 'product'){
         modifiedKey = 'protein';
       }
       else if(key === 'cell_type'){
         modifiedKey = 'assay_type';
       }
       else if(key === 'mhc_allele'){
         modifiedKey = 'hla_restriction';
       }
       else if(key === 'startExt'){
         modifiedKey = 'position_range_start';
       }
       else if(key === 'stopExt'){
         modifiedKey = 'position_range_stop';
       }
       else if(key === 'startFreqExt'){
         modifiedKey = 'response_frequency_start';
       }
       else if(key === 'stopFreqExt'){
         modifiedKey = 'response_frequency_stop';
       }
       else if(key === 'variant_aa_type'){
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
  watch:{
    dontShowAgainWarningMode3(){
      this.showWarningMode3();
    },
    selectedTabEpitope(){
      this.selectedTab = this.selectedTabEpitope;
    },
    countEpi(){
      if(this.selectedTab === this.toCustom){
        this.setCountEpiToShow(this.countEpiCustom);
      }
      else if(this.selectedTab === this.toEpitopeVariants){
        this.setCountEpiToShow(this.countEpi);
      }
      else if(this.selectedTab === this.toEpitopeWithoutVariants){
        this.setCountEpiToShow(this.countEpiWithoutVariants);
      }
    },
    countEpiCustom(){
      if(this.selectedTab === this.toCustom){
        this.setCountEpiToShow(this.countEpiCustom);
      }
      else if(this.selectedTab === this.toEpitopeVariants){
        this.setCountEpiToShow(this.countEpi);
      }
      else if(this.selectedTab === this.toEpitopeWithoutVariants){
        this.setCountEpiToShow(this.countEpiWithoutVariants);
      }
    },
    countEpiWithoutVariants(){
      if(this.selectedTab === this.toCustom){
        this.setCountEpiToShow(this.countEpiCustom);
      }
      else if(this.selectedTab === this.toEpitopeVariants){
        this.setCountEpiToShow(this.countEpi);
      }
      else if(this.selectedTab === this.toEpitopeWithoutVariants){
        this.setCountEpiToShow(this.countEpiWithoutVariants);
      }
    },
    selectedTab(){
      if(this.selectedTab === this.toCustom){
        this.resetNewSingleEpitopeQuery();
        this.setFalseDisableSelectorUserNewEpitopePart();
        this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
        this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
        this.resetEpitopeAminoacidConditionsArrayUserNewInOR();
        this.setFalseShowAminoacidVariantUserNewEpi();
        this.setSelectedTabEpitopeToCustom();
        if(this.disableSelectorEpitopePart){
          this.setFalseDisableSelectorEpitopePart();
          this.setFalseShowAminoacidVariantEpi();
        }
        this.setFalseFromPredefinedQuery();
        this.setCountEpiToShow(this.countEpiCustom);
      }
      else if(this.selectedTab === this.toEpitopeVariants){
        //console.log("qui", this.fromPredefinedQuery);
        if(!this.fromPredefinedQuery && !this.dontShowWarningMode3Again) {
          this.dialogModeEpitopeWithVariants = true;
        }
        if(this.epiQueryUsedTab === this.toEpitopeWithoutVariants && !this.fromPredefinedQuery){
            this.resetAminoacidConditionQuery();
            this.setFalseShowAminoacidVariantEpi();
            this.setFalseDisableSelectorEpitopePart();
            let query = JSON.parse(JSON.stringify(this.epiQuerySelWithoutVariants));
            this.resetEpiQuery();
            this.setEpiQuery(query);
        }
        //this.setFalseFromPredefinedQuery();
        this.epiQueryUsedTab = this.toEpitopeVariants;
        this.setSelectedTabEpitopeToEpitopeVariants();
        if(this.disableSelectorUserNewEpitopePart){
          this.setFalseDisableSelectorUserNewEpitopePart();
          this.setFalseDisableSelectorEpitopePart();
          this.setFalseShowAminoacidVariantUserNewEpi();
        }

        if(Object.keys(this.aminoacidConditions).length > 0){
          this.setTrueDisableSelectorEpitopePart();
          this.setTrueShowAminoacidVariantEpi();
        }
        if(!this.epiSearchDis) {
          this.setCountEpiToShow(this.countEpi);
        }
        /*if(!this.epiSearchDis) {
          let to_send = this.toSend();
          this.setCountEpi(null);
          let count_url = 'epitope/count';

          axios.post(count_url, to_send)
              .then((res) => {
                return res.data
              })
              .then((res) => {
                poll(res.result, (res) => {
                  if (res != null) {
                    this.setCountEpi(res[0].count);
                  }
                })
              })
        }*/
        else{
          this.setCountEpi(0);
        }
      }
      else if(this.selectedTab === this.toEpitopeWithoutVariants && !this.fromPredefinedQuery){
        if(this.epiQueryUsedTab === this.toEpitopeVariants){
            let query = JSON.parse(JSON.stringify(this.epiQuerySel));
            this.epitopeAminoacidFields.forEach(elem => {
                  delete query[elem.field];
                }
            )
            delete query['startExtVariant'];
            delete query['stopExtVariant'];
            this.resetEpiQueryWithoutVariants();
            this.setEpiQueryWithoutVariants(query);
        }
        this.setFalseFromPredefinedQuery();
        this.epiQueryUsedTab = this.toEpitopeWithoutVariants;
        this.setSelectedTabEpitopeToEpitopeWithoutVariants();
        this.setCountEpiToShow(this.countEpiWithoutVariants);
        this.setFalseDisableSelectorEpitopePart();
        //this.setFalseShowAminoacidVariantEpi();
      }
    }
  },
  created() {
      const url = `epitope`;

      this.epitopeFields = [];

      axios.get(url)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.epitopeFields = res.fields;
          });
  }
}
</script>

<style scoped>

  .EpitopeMenu{
    border : 1px solid black;
    background-color: #ebebeb;
    max-width: 80%;
    margin-bottom: 50px;
    border-radius: 15px !important;
    margin-top: 50px;
    }

  .EpitopeSelectors{
    margin-bottom: 30px;
  }

  .info-icon {
    font-size: 15px;
  }

  .info-button {
    width: 10px;
  }

  .EpitopeCard{
    background:#fafafa;
    padding-bottom: 100px;
  }

  .label {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px;
  }

  .separator{
    width: 98%;
    height: 8px;
    background-color: #404040;
    border-radius: 100%;
    margin-bottom: 40px;
  }

</style>