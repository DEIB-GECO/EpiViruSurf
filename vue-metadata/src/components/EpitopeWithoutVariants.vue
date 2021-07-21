<template>
<div>

  <v-container fluid grid-list-xl class="EpitopeMenu">
    <v-layout wrap align-center justify-center>

      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
        <h2>IEDB Epitope search</h2>
      </v-flex>

      <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
        <h3 style="color:red"  v-if="epiSearchDis">{{requirement}}</h3>
      </v-flex>

      <v-flex xs12 class="no-horizontal-padding" v-if="Object.keys(epiQuerySelWithoutVariants).length > 0" style="margin-bottom: 30px; margin-left: 20px; margin-right: 20px">
      <span class="label">
                        Epitope search condition:
                    </span>
      <span style="font-family:monospace; font-size:120%;">
                        {{ queryToShow }}
                    </span>
    </v-flex>

      <v-flex class="no-horizontal-padding xs12 sm6 md4 lg3 d-flex EpitopeSelectors"
              v-for="fieldEpi in epitopeFields" v-bind:key="fieldEpi.text">
              <EpitopeWithoutVariantsSelectorText
                  v-if="!fieldEpi.is_numerical && !fieldEpi.is_percentage "
                  :text="fieldEpi.text"
                  :field="fieldEpi.field">
              </EpitopeWithoutVariantsSelectorText>
              <EpitopeWithoutVariantsSelectorNum
                  v-if="fieldEpi.is_numerical"
                  :text="fieldEpi.text"
                  :field="fieldEpi.field">
              </EpitopeWithoutVariantsSelectorNum>
              <EpitopeWithoutVariantsSelectorPercentage
                  v-if="fieldEpi.is_percentage"
                  :text="fieldEpi.text"
                  :field="fieldEpi.field">
              </EpitopeWithoutVariantsSelectorPercentage>
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
         @click="resetEpiQueryWithoutVariants"
            color="rgb(122, 139, 157)" style="color: white">CLEAR EPITOPE QUERY</v-btn>
  </v-layout>
  </v-container>

  <EpitopeTableWithoutVariants></EpitopeTableWithoutVariants>

</div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import EpitopeSelectorText from "./EpitopeSelectorText";
import EpitopeSelectorNum from "./EpitopeSelectorNum";
import EpitopeSelectorPercentage from "./EpitopeSelectorPercentage";
import EpitopeWithoutVariantsSelectorText from "./EpitopeWithoutVariantsSelectorText";
import EpitopeWithoutVariantsSelectorNum from "./EpitopeWithoutVariantsSelectorNum";
import EpitopeWithoutVariantsSelectorPercentage from "./EpitopeWithoutVariantsSelectorPercentage";
import EpitopeTableWithoutVariants from "./EpitopeTableWithoutVariants";
export default {
  name: "EpitopeWithoutVariants",
  components: {
    EpitopeTableWithoutVariants,
    EpitopeWithoutVariantsSelectorPercentage,
    EpitopeWithoutVariantsSelectorNum,
    EpitopeWithoutVariantsSelectorText, EpitopeSelectorPercentage, EpitopeSelectorNum, EpitopeSelectorText},
  data() {
    return {
      epitopeFields: [],
      requirement: 'A single Host and a single Virus are required',
    }
  },
  computed: {
    ...mapState(['disableSelectorEpitopePart', 'countEpi', 'epitopeAdded',
      'epiQuerySelWithoutVariants', 'disableSelectorUserNewEpitopePart', 'disableSelectorEpitopePart', 'aminoacidConditions',
    'selectedTabEpitope', 'countEpiToShow', 'countEpiCustom']),
    ...mapGetters({
      epiSearchDis: 'epiSearchDisabled',
      compound_query: 'build_query'
    }),
    queryToShow() {
      let inner_list = [];
      Object.keys(this.epiQuerySelWithoutVariants).forEach(key => {
        const value2 = [];
        const value = this.epiQuerySelWithoutVariants[key];

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
   methods: {
     ...mapMutations(['resetEpiQueryWithoutVariants', 'setCountEpi', 'setFalseDisableSelectorUserNewEpitopePart',
       'setFalseShowAminoacidVariantUserNewEpi', 'setFalseDisableSelectorEpitopePart',
       'setFalseShowAminoacidVariantEpi', 'setTrueDisableSelectorEpitopePart', 'setTrueShowAminoacidVariantEpi',
     'setCountEpiCustom', 'setCountEpiToShow']),
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
       else{
         modifiedKey = key;
       }

       return modifiedKey;
     },
   },
  watch:{

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

</style>