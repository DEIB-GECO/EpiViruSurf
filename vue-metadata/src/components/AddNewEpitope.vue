<template>

  <div>

      <v-container fluid grid-list-xl class="EpitopeMenu">
        <v-layout wrap align-center justify-center>

          <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
            <h2>New custom epitopes</h2>
          </v-flex>

          <v-flex xs12 lg12 class="no-horizontal-padding" v-if="Object.keys(newSingleEpitope).length > 0 && !epiSearchDis"
                  style="margin-top: 10px; margin-bottom: 30px; margin-left: 20px; margin-right: 20px" >
          <span class="label">
            Epitope search condition:
          </span>
          <span style="font-family:monospace; font-size:120%;">
              {{ queryToShow }}
          </span>
        </v-flex>

          <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
            <h3 style="color:red; margin-bottom: 10px"  v-if="epiSearchDis">{{requirement}}</h3>
          </v-flex>
          <v-flex class="no-horizontal-padding xs12 sm12 md12 d-flex EpitopeSelectors">
          <v-layout wrap align-center justify-space-around>
            <v-flex class="no-horizontal-padding xs12 sm6 md4 lg4 d-flex EpitopeSelectors"
                                v-for="fieldEpi in newEpitopeFields" v-bind:key="fieldEpi.text">
            <v-card v-if="fieldEpi.field ==='epitope_name'">
              <v-text-field
                v-model="epitope_name"
                label= "Epitope Name"
                :disabled="epiSearchDis"
              ></v-text-field>
            </v-card>
              <ProteinSelectorNewEpitope
                  v-else-if="fieldEpi.field==='product'"
              :text="fieldEpi.text"
              :field="fieldEpi.field"></ProteinSelectorNewEpitope>
              <PositionSelectorNewEpitope
                  v-else-if="fieldEpi.field==='position_range'"
              :text="fieldEpi.text"
              :field="fieldEpi.field"></PositionSelectorNewEpitope>

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
          </v-flex>

          <v-layout wrap>
            <v-flex class="no-horizontal-padding xs12 sm6 md4 lg4 d-flex"></v-flex>
            <v-flex class="no-horizontal-padding xs12 sm6 md4 lg4 d-flex"></v-flex>
            <v-flex class="no-horizontal-padding xs12 sm6 md4 lg4 d-flex" style="margin-top: 15px; margin-bottom: 15px">
              <v-layout wrap>
                <v-flex class="no-horizontal-padding xs12 sm12 md12 lg12 d-flex">
                <h3 v-if="newSingleEpitope['position_range']" style="width: 100%; margin-bottom: 15px;"> Positions: </h3>
                </v-flex>
                <v-flex class="no-horizontal-padding xs12 sm12 md12 lg12 d-flex">
                  <v-layout wrap justify-left style="margin-left: 0px">
                  <div v-for="(pos, index) in newSingleEpitope['position_range']" v-if="!epiSearchDis">
                       <v-layout align-center style="margin: 0px">
                         <div class="singlePosition">
                            <span>
                                {{pos}}
                            </span>
                           <v-btn @click="deletePosition(index)" class="white--text" color="red" small flat icon>
                             <v-icon dark>remove_circle</v-icon>
                           </v-btn>
                         </div>
                       </v-layout>
                  </div>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>

        </v-layout>

        <v-layout wrap justify-center style="margin-top: 20px">
              <v-btn @click="openShowAminoacidVariantUserNewEpi()"
                         color="rgb(201, 53, 53) "
                     style="color:white;"
                        :disabled="epiSearchDis || disableSelectorUserNewEpitopePart || this.epitopeAminoacidConditionsArrayUserNew.length>0">
                <!--change condition to make in and-->
                Add condition on amino acids (optional)</v-btn>
        </v-layout>
        <AminoacidVariantNewUserEpitope v-if="showAminoacidVariantUserNewEpi"></AminoacidVariantNewUserEpitope>

        <h3 v-if="epitopeAminoacidConditionsArrayUserNew.length>0"> Amino acid condition: </h3>
        <div v-for="(aminoConditions, index) in epitopeAminoacidConditionsArrayUserNewToShow">
          <v-card style="background-color: #C0C0C0">
             <v-layout wrap justify-center align-center style="margin-top: 20px">
               <v-flex sm2 class="text-xs-center">
                 <!--<span style="border: solid black 2px; border-radius: 10%; padding: 5px"><b>{{index + 1}}</b></span>-->
               </v-flex>
               <v-flex sm6>
                 <div v-if="aminoConditions.length>0">
                   <span v-for="(condition, index2) in aminoConditions" style="display: block;" >
                     <span v-if="index2 !== 0" style="display: block;" > <b> OR </b> </span>
                     <span v-for="(value2, key2) in condition" style="display: block;">
                        <b>- {{key2}} : </b>
                       <span class="capitalize">{{value2}} </span>
                     </span>
                   </span>
                 </div>
                 <div v-else>
                   <span v-for="(value, key) in aminoConditions" style="display: block;">
                     <b>- {{key}} : </b>
                     <span class="capitalize">{{value}} </span>
                   </span>
                 </div>
               </v-flex>
               <v-flex sm4 class="text-xs-center">
                 <v-btn @click="deleteAminoConditions(index)" class="white--text" color="#696969">DELETE CONDITION</v-btn>
               </v-flex>
             </v-layout>
          </v-card>
        </div>

        <v-layout wrap justify-center style="margin-top: 40px">
         <v-btn :disabled="epiSearchDis" @click="clearEpitope()" class="white--text" color="rgb(122, 139, 157)">CLEAR EPITOPE</v-btn>
          <v-btn :disabled="epiSearchDis || newEpitopeLoading" @click="addEpitope()" class="white--text" color="#00008B">ADD EPITOPE</v-btn>
        </v-layout>

        <v-dialog
              v-model="dialogModeCustomEpitopes"
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
                @click="dialogModeCustomEpitopes = false;"
              >
                <v-icon>close</v-icon>
              </v-btn>
              </v-card-title>
              <v-card-text>
                Please mind that for an appropriate use of EpiSurf, users should keep in mind that purely position-based considerations
                are especially useful for B-cell assay epitopes. For T cell/MHC ligand assay, users should consider
                also HLA restrictions on target populations.
                <br><br>
                The custom epitope functionality may be exploited in any case, but we invite users to conduct
                deeper investigation when using epitopes for T cell /MHC ligand assays having a low response
                frequency (e.g., below 0.2).
                <v-layout wrap justify-end style="margin-top: 10px;">
                  <v-flex sm7 align-self-center>
                  </v-flex>
                  <v-flex sm5 align-end>
                    <v-checkbox
                        color="gray"
                      v-model="dontShowAgainWarningMode1"
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

        <v-dialog
            persistent
          v-model="missingFields"
          width="300"
        >
          <v-card>
            <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
              Missing Fields
              <v-spacer></v-spacer>
              <v-btn
                  style="background-color: rgb(122, 139, 157)"
                  slot="activator"
                  flat icon
                  small
                color="white"
                @click="exitMissingFields()"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="text-xs-center">
              All fields need to be filled to save the new epitope
            </v-card-text>

          </v-card>
        </v-dialog>

        <v-dialog
            persistent
          v-model="nameAlreadyExisting"
          width="300"
        >
          <v-card>
            <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
              Name not available
              <v-spacer></v-spacer>
              <v-btn
                  style="background-color: rgb(122, 139, 157)"
                  slot="activator"
                  flat icon
                  small
                color="white"
                @click="exitNameAlreadExisting()"
              >
                <v-icon>close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="text-xs-center">
              Name not available, please choose another one.
            </v-card-text>

          </v-card>
        </v-dialog>

        <v-layout wrap align-center justify-center>
          <div class="separator"></div>
        </v-layout>

        <DownloadAndLoadEpitopes></DownloadAndLoadEpitopes>

        <v-progress-linear v-if="newEpitopeLoading"
          indeterminate
          color="blue"
        ></v-progress-linear>

        <v-layout wrap align-center justify-center v-if="epitopeAdded.length>0">
          <h2 style="margin-left: 10px"> User-defined epitope list: </h2>
          <v-spacer></v-spacer>
          <h4>Search epitope by name:</h4>
          <v-flex class="sm2">
          <v-text-field
            v-model="searchedName"
            append-icon="close"
            @click:append="resetSearchedName"
          ></v-text-field>
          </v-flex>
          <v-flex class="sm1">
            <span> ({{epitopeAddedReview.length}}) </span>
          </v-flex>
        </v-layout>

        <v-layout align-center justify-end style="margin-right: 53px" v-if="epitopeAddedReview.length > 0">
          <v-dialog width="500">
              <v-btn
                    slot="activator"
                    color="rgb(122, 139, 157)"
                    small
                    class="white--text">
                Buttons Info
                <v-icon class="info-icon" color="white" style="margin-left: 10px">info</v-icon>
              </v-btn>
              <v-card>
                  <v-card-title
                          class="headline grey lighten-2"
                          primary-title
                  >
                      Buttons functionalities:
                  </v-card-title>
                  <v-card-text>
                    <b>- MORE INFO:</b>
                    <span> Complete information on the epitope, the sequence population,
                      optional amino acid condition, and computed statistics.</span>
                    <br><br>
                    <b>- REFRESH:</b>
                    <span> It refreshes the four statistics computed for the epitope;
                      this option is typically used after uploading from an external JSON file.</span>
                    <br><br>
                    <b>- RELOAD:</b>
                    <span> It reloads all the values that were used to originally create that epitope into the
                      drop-down menus of the sequence, epitopes, and amino acid condition search panels.
                      This option facilitates the creation of a new epitope with slight coordinate changes or testing
                      its conservancy on a different underlying population. Note that the amino acid condition
                      should be completed or delete in order to modify the sequence population filters.</span>
                    <br><br>
                    <b>- DELETE:</b>
                    <span> It deletes the element from the user-defined list.</span>
                  </v-card-text>
              </v-card>
          </v-dialog>
        </v-layout>

        <div v-for="(epitope, index) in epitopeAddedReview" v-if="index >= pageEpitopeList*numOfElemInPage && index < Math.min((pageEpitopeList+1)*numOfElemInPage, epitopeAddedReview.length)">
          <v-card style="background-color: #C0C0C0">
             <v-layout wrap justify-center align-center style="margin-top: 20px">
               <v-flex sm2 class="text-xs-center">
                 <v-progress-circular
                        indeterminate
                        color="primary"
                        v-if="refreshingIndex === epitope.index - 1"
                        style="margin-right: 20px"
                 ></v-progress-circular>
                 <span style="border: solid black 2px; border-radius: 10%; padding: 5px"><b>{{epitope.index}}</b></span>
               </v-flex>
               <v-flex sm6 style="font-size: 15.5px">
                 <span v-for="(value, key) in epitope" style="display: block;">
                   <b v-if="key !== 'file_name' && key !== 'index' && key !== 'Protein'">- {{key}} : </b>
                   <b v-else-if="key === 'Protein'">- {{key}} name : </b>
                   <span v-if="key === 'Epitope name'"> <u>{{value}}</u>
                     <span v-if="epitope['file_name']" :title="epitope['file_name']"> <b class="capitalize" style="margin-left: 20px">[File: </b> {{epitope['file_name']}} <b>]</b></span>
                   </span>
                   <span v-else-if="key === 'Creation date' || key === 'Refresh date'" >{{value}} </span>
                   <div v-else-if="key === 'Position range & sequence' || key === 'Position ranges & sequences'" style="display: inline-grid; vertical-align: central">
                      <span v-for="elem in value" style="word-wrap:break-word; max-width: 400px">
                        {{elem}}<br>
                      </span>
                    </div>

                   <span v-else-if="key !== 'file_name' && key !== 'index'" class="capitalize">{{value}} </span>
                 </span>
               </v-flex>
               <v-flex sm4 class="text-xs-center">
                 <v-btn @click="moreInfo(epitope.index - 1)" class="white--text" color="rgb(122, 139, 157)" style="width: 60%">MORE INFO</v-btn>
                 <v-btn :disabled="newEpitopeLoading || epiSearchDis || !allPossibleProteinAnnotations.includes(epitope['Protein'].toLowerCase())" @click="refreshCustomEpitope(epitope.index - 1)" class="white--text" color="rgb(122, 139, 157)" style="width: 60%">REFRESH</v-btn>
                 <v-btn :disabled="epiSearchDis || !allPossibleProteinAnnotations.includes(epitope['Protein'].toLowerCase())" @click="reloadCustomEpitope(epitope.index - 1)" class="white--text" color="rgb(122, 139, 157)" style="width: 60%">RELOAD</v-btn>
                 <v-btn @click="setEpitopeIndexToDelete(epitope.index - 1); confirmDeleteSingleEpitope = true;" class="white--text" color="#696969" style="width: 60%">DELETE</v-btn>
               </v-flex>
             </v-layout>
          </v-card>
        </div>

        <v-dialog
          persistent
          scrollable
            v-model="confirmDeleteSingleEpitope"
            width="300">
        <v-card>
            <v-card-title
                    class="headline"
                    style="background-color:rgb(201, 53, 53) ; color: white">
                Delete epitope
            </v-card-title>
            <v-card-text style="text-align: center; justify-content: center">
                <p>
                </p>
                <p>
                  Are you sure?
                </p>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="yesDeleteSingleEpitope()">
                    Yes
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="noDeleteSingleEpitope()"
                >
                    No
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

        <v-layout wrap align-center justify-center style="margin-top: 40px" v-if="epitopeAddedReview.length>0">
          <v-spacer></v-spacer>
          <div>
            <span>Epitopes per page: </span>
              <v-select
                v-model="numOfElemInPage2"
              :items="listPossibleNumPage"
                class="shrink2"
                style="display: inline-block"
            ></v-select>
          </div>
          <div>
            <span style="margin-right: 10px"
                  v-if="(pageEpitopeList*numOfElemInPage + 1) ===
                  Math.min((pageEpitopeList+1)*numOfElemInPage, epitopeAddedReview.length)">
              {{pageEpitopeList*numOfElemInPage + 1}}
              of {{epitopeAddedReview.length}}
            </span>
            <span style="margin-right: 10px" v-else>
              {{pageEpitopeList*numOfElemInPage + 1}} -
              {{Math.min((pageEpitopeList+1)*numOfElemInPage, epitopeAddedReview.length)}}
              of {{epitopeAddedReview.length}}
            </span>
            <v-btn @click="pageLeft()" class="white--text arrowButton"
                 color="rgb(122, 139, 157)" icon medium
                  :disabled="pageEpitopeList === 0">
              <v-icon>arrow_back</v-icon>
            </v-btn>
            <v-btn @click="pageRight()" class="white--text arrowButton"
                  color="rgb(122, 139, 157)" icon medium
                  :disabled="pageEpitopeList === maxPage">
             <v-icon>arrow_forward</v-icon>
            </v-btn>
          </div>
        </v-layout>

        <v-layout wrap justify-center style="margin-top: 40px" v-if="epitopeAdded.length>0">
          <v-spacer></v-spacer>
         <v-btn @click="confirmDeleteAllEpitopes = true" class="white--text" color="#696969">DELETE ALL EPITOPES ({{this.epitopeAdded.length}})</v-btn>
        </v-layout>

        <v-dialog
          persistent
          scrollable
            v-model="confirmDeleteAllEpitopes"
            width="300">
        <v-card>
            <v-card-title
                    class="headline"
                    style="background-color:rgb(201, 53, 53) ; color: white">
                Delete all epitopes
            </v-card-title>
            <v-card-text style="text-align: center; justify-content: center">
                <p>
                </p>
                <p>
                  Are you sure?
                </p>
            </v-card-text>
            <v-divider></v-divider>

            <v-card-actions>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="yesDeleteAllEpitopes()">
                    Yes
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                        color="rgb(201, 53, 53) "
                        flat
                        @click="noDeleteAllEpitopes()"
                >
                    No
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

      </v-container>

      <EpitopeTableUserAdd></EpitopeTableUserAdd>

      <MoreInfoEpitopeUser></MoreInfoEpitopeUser>

  </div>

</template>

<script>
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import EpitopeTableUserAdd from "./EpitopeTableUserAdd";
import axios from "axios";
import ProteinSelectorNewEpitope from "./ProteinSelectorNewEpitope";
import PositionSelectorNewEpitope from "./PositionSelectorNewEpitope";
import MoreInfoEpitopeUser from "./MoreInfoEpitopeUser";
import AminoacidVariantNewUserEpitope from "./AminoacidVariantNewUserEpitope";
import DownloadAndLoadEpitopes from "./DownloadAndLoadEpitopes";
import {FULL_TEXT, poll, stopPoll} from "../utils";

export default {
  name: "AddNewEpitope",
  components: {
    DownloadAndLoadEpitopes,
    AminoacidVariantNewUserEpitope,
    MoreInfoEpitopeUser, PositionSelectorNewEpitope, ProteinSelectorNewEpitope, EpitopeTableUserAdd},
  data() {
    return {
      requirement: 'A single Host and a single Virus are required',
      missingFields: false,
      dialogModeCustomEpitopes: false,
      dontShowAgainWarningMode1: false,
      newEpitopeFields: [],
      epitope_name: '',
      is_control: false,
      finish_count_seq: false,
      finish_count_var: false,
      epitopeToAdd: null,
      precision_float_table: 5,
      nameAlreadyExisting: false,
      searchedName: '',
      pageEpitopeList: 0,
      maxPage: 0,
      numOfElemInPage: 5,
      numOfElemInPage2: 5,
      listPossibleNumPage: [1,2,5,10,20, 'All'],
      confirmDeleteSingleEpitope: false,
      epitopeIndexToDelete: 0,
      confirmDeleteAllEpitopes: false,
      isRefresh: false,
      refreshingIndex: null,
      countPopulationRefreshed: null,
      finish_count_population_refreshed: true,
      isGisaid: false,
      allPossibleProteinAnnotations: [],
      previousVirus: '',
      my_interval_countSeq: null,
    }
  },
  computed: {
    ...mapState(['epitopeAdded', 'newSingleEpitope', 'newEpitopeLoading', 'showMoreInfoEpitopeUser',
      'countSeq2', 'showAminoacidVariantUserNewEpi',
      'disableSelectorUserNewEpitopePart', 'newSingleAminoAcidConditionUser',
      'epitopeAminoacidConditionsArrayUserNew', 'epitopeAdded', 'userEpitopeSelected', 'myIntervalCountSeq',
    'dontShowWarningMode1Again']),
    ...mapGetters({
      epiSearchDis: 'epiSearchDisabled',
      compound_query: 'build_query',
    }),
    epitopeAminoacidConditionsArrayUserNewToShow(){
      let copy = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNew));
      let len = copy.length;

      let i = 0;
      let arrayToShow = [];
      while(i<len) {
        let line = {};
        let single = copy[i];
        if (single.length === undefined || single.length === null) {
          Object.keys(single).forEach(function (key) {
            if (key === 'product') {
              line['Protein'] = single[key][0];
            } else if (key === 'variant_aa_type') {
              line['Variant type'] = single[key][0];
            } else if (key === 'sequence_aa_original') {
              line['Original amino acid'] = single[key][0];
            } else if (key === 'sequence_aa_alternative') {
              line['New amino acid'] = single[key][0];
            } else if (key === 'start_aa_original') {
              let pos = single[key]['min_val'] + '-' + single[key]['max_val'];
              line['Position range'] = pos;
            }
          })
          arrayToShow.push(line);
        }
        else {
          let j = 0;
          let length = single.length;
          let arrayToAddArray = [];
          while (j < length) {
            let line2 = {};
            let single2 = single[j];
            Object.keys(single2).forEach(function (key) {
              if (key === 'product') {
                line2['protein'] = single2[key][0];
              } else if (key === 'variant_aa_type') {
                line2['variant_type'] = single2[key][0];
              } else if (key === 'sequence_aa_original') {
                line2['original_amino_acid'] = single2[key][0];
              } else if (key === 'sequence_aa_alternative') {
                line2['new_amino_acid'] = single2[key][0];
              } else if (key === 'start_aa_original') {
                let pos = single2[key]['min_val'] + '-' + single2[key]['max_val'];
                line2['position_range'] = pos;
              }
            })
            arrayToAddArray.push(line2);
            j++;
          }
          arrayToShow.push(arrayToAddArray);
        }
        i++;
      }
      return arrayToShow;
    },
    epitopeAddedReview(){
      let val = JSON.parse(JSON.stringify(this.epitopeAdded));
      let arrayToReturn = [];
      let len = val.length;
      let i=0;
      while(i<len){
        let line = {};
        line['Epitope name'] = val[i].epitope_name;
        line['Creation date'] = val[i].creation_date + " on " + val[i].creation_database;
        line['Refresh date'] = val[i].refresh_date + " on " + val[i].refresh_database;
        line['Protein'] = val[i].product;

        let arrAll = [];
        if(!val[i].sequence){
          val[i].sequence = "";
        }
        let posRange = val[i].position_range_to_show.replaceAll('\n', '');
        let sequences = val[i].sequence.replaceAll('\n', '');
        let arrSeq = sequences.split(',');
        let arrPos = posRange.split(',');
        let len = arrPos.length;
        let j = 0;
        while (j<len){
          let singlePosSeq = "";
          if(arrSeq[j] !== undefined) {
            singlePosSeq = arrPos[j] + ' : ' + arrSeq[j].toUpperCase();
          }
          arrAll.push(singlePosSeq);
          j = j + 1;
        }
        if(len === 1) {
          line['Position range & sequence'] = arrAll;
        }
        else{
          line['Position ranges & sequences'] = arrAll;
        }

        //line['Virus taxon name'] = val[i].taxon_name;
        //line['Host taxon name'] = val[i].host_taxon_name;
        line['Number of mutated sequences'] = val[i].num_seq;
        line['Number of variants'] = val[i].num_var;
        if(val[i].file_name) {
          line['file_name'] = val[i].file_name;
        }
        line['index'] = i + 1;
        arrayToReturn.push(line);
        i++;
      }
      let arrayFiltered = arrayToReturn.filter(item => item['Epitope name'].toLowerCase().includes(this.searchedName.toLowerCase()));
      this.maxPage = Math.max(Math.ceil(arrayFiltered.length/this.numOfElemInPage) - 1, 0);
      return arrayFiltered;
    },
    queryToShow() {
      let inner_list = [];
      Object.keys(this.newSingleEpitope).forEach(key => {
        if (key !== "taxon_name" && key !== "host_taxon_name") {
          const value2 = [];
          const value = this.newSingleEpitope[key];

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
      let i = 0;
      let len = this.epitopeAminoacidConditionsArrayUserNew.length;
      while(i<len) {
        Object.keys(this.epitopeAminoacidConditionsArrayUserNew[i]).forEach(key => {
          const value2 = [];
          const value = this.epitopeAminoacidConditionsArrayUserNew[i][key];

          let modifiedKey = this.modifyKey2(key);

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
        i++;
      }
      return inner_list.join(", ");
    }
  },
   methods: {
     ...mapMutations(['addNewEpitopeToList', 'removeNewEpitopeFromList', 'setCountEpi', 'removePositionFromNewEpitope',
     'setFalseNewEpitopeLoading', 'setTrueNewEpitopeLoading', 'showMoreInfo', 'setUserEpitopeSelected',
     'setTrueShowAminoacidVariantUserNewEpi', 'setTrueDisableSelectorUserNewEpitopePart',
       'setTrueDisableSelectorEpitopePart', 'removeEpitopeAminoacidConditionsArrayUserNew',
     'resetEpitopeAminoacidConditionsArrayUserNew', 'changeAddingEpitope', 'resetNewEpitopeFromLocalStorage',
     'setCountEpiCustom', 'setCountSeq2', 'setTrueFinishCountPopulation', 'setFalseFinishCountPopulation',
     'setTrueExampleCustomEpitope', 'setNewSingleEpitopeQuery', 'resetNewSingleAminoacidConditionUserQuery',
     'setNewSingleAminoacidConditionUserQuery', 'setQuery', 'setFalseDisableSelectorEpitopePart',
     'setFalseDisableSelectorUserNewEpitopePart', 'setFalseShowAminoacidVariantUserNewEpi',
     'resetNewSingleEpitopeQuery', 'refreshEpitopeInList', 'setMyIntervalCountSeq', 'showWarningMode1']),
     ...mapActions(['setNewSingleEpitopeSelected', 'setNewSingleAminoAcidConditionUserAction',]),
     loadCountSeq2(){
       this.setFalseFinishCountPopulation();
       this.setCountSeq2(null);
     let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let count_url = `query/countPoll?is_control=${this.is_control}`;

      if(this.my_interval_countSeq !== null){
        stopPoll(this.my_interval_countSeq);
      }

      axios.post(count_url, to_send)
        .then((res) => {
            return res.data;
        })
        .then((res) => {
          this.my_interval_countSeq = poll(res.result, (res) => {
            this.my_interval_countSeq = null;
            this.setCountSeq2(res);
            this.setTrueFinishCountPopulation();
          });
        });
    },
     setEpitopeIndexToDelete(index){
       this.epitopeIndexToDelete = index;
     },
     yesDeleteSingleEpitope(){
       this.deleteEpitope(this.epitopeIndexToDelete);
       this.confirmDeleteSingleEpitope = false;
     },
     noDeleteSingleEpitope(){
       this.confirmDeleteSingleEpitope = false;
     },
     yesDeleteAllEpitopes(){
       this.deleteAllEpitopes()
       this.confirmDeleteAllEpitopes = false;
     },
     noDeleteAllEpitopes(){
       this.confirmDeleteAllEpitopes = false;
     },
     openShowAminoacidVariantUserNewEpi(){
       this.setNewSingleAminoAcidConditionUserAction({field: 'product', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'variant_aa_type', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_original', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'sequence_aa_alternative', list: ''});
      this.setNewSingleAminoAcidConditionUserAction({field: 'start_aa_original', list: ''});
       this.setTrueDisableSelectorEpitopePart();
      this.setTrueShowAminoacidVariantUserNewEpi();
      this.setTrueDisableSelectorUserNewEpitopePart();
    },
     addEpitope(){
       if(this.allFieldsCompiled()) {
         if(this.epitopeAdded.some(item => item.epitope_name === this.newSingleEpitope.epitope_name)){
            this.nameAlreadyExisting = true;
         }
         else {
           if(!this.dontShowWarningMode1Again) {
             this.dialogModeCustomEpitopes = true;
           }
           this.changeAddingEpitope();
           this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
           this.setNewSingleEpitopeSelected({
             field: 'host_taxon_name',
             list: this.compound_query['gcm'].host_taxon_name[0]
           })
           let val = JSON.parse(JSON.stringify(this.newSingleEpitope));
           val['all_information'] = {};
           let all_info = val['all_information'] ;
           all_info['compound_query'] = JSON.parse(JSON.stringify(this.compound_query));
           all_info['epitope_info'] = JSON.parse(JSON.stringify(this.newSingleEpitope));
           if (this.epitopeAminoacidConditionsArrayUserNew.length>0) {
             all_info['amino_acid_info'] = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNew[0]));
           }
           else{
             all_info['amino_acid_info'] = {};
           }

           val['compound_query'] = JSON.parse(JSON.stringify(this.compound_query));

           val['compound_query']['kv'] = this.addKvPart(val);

           let listPosition = val['position_range'];
           let len = listPosition.length;
           let i = 0;
           let newListPositionString = '';
           while (i < len) {
             if (i === 0) {
               val['position_range'] = listPosition[i][0];
             }
             let min = listPosition[i][0];
             let max = listPosition[i][1];
             newListPositionString += min + "-" + max;
             i++;
             if (i < len) {
               newListPositionString += ", \n"
             }
           }
           val['position_range_to_show'] = newListPositionString;
           let date1 = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
           let date2 = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
           val['creation_date']  =  date1;     // date1.split('/').reverse().join('/');
           val['refresh_date']  =  date2;

           if(/gisaid/.test(window.location.href)){
             val['creation_database'] = "EpiSurf GISAID";
             val['refresh_database'] = "EpiSurf GISAID";
           }
           else{
             val['creation_database'] = "EpiSurf";
             val['refresh_database'] = "EpiSurf";
           }

           this.epitopeToAdd = val;
           this.countNumSeq(val);
           this.countNumVar(val);
           this.loadSequence(val);
           this.countPopulationRefreshedFunction(val);
           this.resetEpitopeAminoacidConditionsArrayUserNew();

           this.clearEpitope();
         }
       }
       else{
         this.missingFields = true;
       }
     },
     allFieldsCompiled(){
       if(this.newSingleEpitope['taxon_name'] && this.newSingleEpitope['host_taxon_name']
       && this.newSingleEpitope['epitope_name'] && this.newSingleEpitope['product']
       && this.newSingleEpitope['position_range'] ){
         return true;
       }
       else{
         return false;
       }
     },
     clearEpitope(){
       this.epitope_name = '';
       this.setNewSingleEpitopeSelected({field: "epitope_name", list: ''});
       this.setNewSingleEpitopeSelected({field: "product", list: ''});
       this.setNewSingleEpitopeSelected({field: "position_range", list: ''});
       this.setNewSingleEpitopeSelected({field: "num_seq", list: ''});
       this.resetEpitopeAminoacidConditionsArrayUserNew();
       this.resetNewSingleAminoacidConditionUserQuery();
       this.setFalseDisableSelectorEpitopePart();
       this.setFalseDisableSelectorUserNewEpitopePart();
       this.setFalseShowAminoacidVariantUserNewEpi();
     },
     deleteEpitope(index){
        this.removeNewEpitopeFromList(index);
        if((this.pageEpitopeList*this.numOfElemInPage) + 1 > this.epitopeAddedReview.length){
          this.pageEpitopeList = Math.max(this.pageEpitopeList - 1, 0);
        }
        let epitopeArr = (JSON.stringify(this.epitopeAdded));
        let storage_name = 'epitopeArr';
        if(this.isGisaid){
          storage_name = storage_name + '_' + 'EpiSurf GISAID'
        }
        else{
          storage_name = storage_name + '_' + 'EpiSurf'
        }
        localStorage.setItem(storage_name, epitopeArr);
     },
     deleteAllEpitopes(){
       this.pageEpitopeList = 0;
       this.maxPage = 0;
       let arr = [];
       this.resetNewEpitopeFromLocalStorage(arr);
       let epitopeArr = (JSON.stringify(this.epitopeAdded));
       let storage_name = 'epitopeArr';
        if(this.isGisaid){
          storage_name = storage_name + '_' + 'EpiSurf GISAID'
        }
        else{
          storage_name = storage_name + '_' + 'EpiSurf'
        }
        localStorage.setItem(storage_name, epitopeArr);
     },
     deleteAminoConditions(index){
       this.removeEpitopeAminoacidConditionsArrayUserNew(index);
     },
     moreInfo(index){
       this.setUserEpitopeSelected(index);
       this.showMoreInfo();
     },
     deletePosition(index){
       this.removePositionFromNewEpitope(index);
        if(this.newSingleEpitope['position_range'] && this.newSingleEpitope['position_range'].length === 0){
          this.setNewSingleEpitopeSelected({field: "position_range", list: ''});
        }
     },
     exitMissingFields(){
       this.missingFields = false;
     },
     exitNameAlreadExisting(){
       this.nameAlreadyExisting = false;
     },
     addKvPart(val){
       let kv = {};
       kv['aa_0'] = {};
       kv['aa_0']['type_query'] = 'aa';
       kv['aa_0']['exact'] = false;

       let array_conditions = [];

       let len = val['position_range'].length;
       let i = 0;
       while(i<len){
         let product = val['product'];
         let position = val['position_range'][i];
         let min = position[0];
         let max = position[1];
         let line = {};
         line['product'] = [product];
         line['start_aa_original'] = {'min_val': min, 'max_val': max};
         array_conditions.push(line);
         i++;
       }

       kv['aa_0']['query'] = array_conditions;

       let copy = JSON.parse(JSON.stringify(this.epitopeAminoacidConditionsArrayUserNew));
       let length = copy.length;
       let j = 0;
       while(j < length){
         let single = copy[j];
         j++;
         let name = 'aa_' + j;
         kv[name] = {};
         kv[name]['type_query'] = 'aa';
         kv[name]['exact'] = false;
         if(single.length === undefined || single.length === null) {
            kv[name]['query'] = [single];
         }
         else{
            kv[name]['query'] = single;
         }
       }

       return kv;

     },
     loadSequence(epitope){
        let to_send = {};
        to_send['product'] = epitope['product'];
        to_send['compound_query'] = epitope['compound_query'];
        to_send['position_ranges'] = epitope['position_range_to_show'];
        const url = `epitope/sequenceAminoacidNewEpitope`;
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
                this.epitopeToAdd['sequence'] = res;
              })
    },
     countNumSeq(val){
       let to_send = val['compound_query'];
      this.isLoading = true;
      this.finish_count_seq = false;
      this.setTrueNewEpitopeLoading();

      let count_url = `query/count?is_control=${this.is_control}`;

      axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              val['num_seq'] = res;
              this.epitopeToAdd['num_seq'] = res;
              this.finish_count_seq = true;
              //this.addNewEpitopeToList(val);
              //this.setFalseNewEpitopeLoading();
          });
     },
     countPopulationRefreshedFunction(val){
       let to_send = JSON.parse(JSON.stringify(val['compound_query']));
       to_send['kv'] = {};
      this.isLoading = true;
      this.finish_count_population_refreshed = false;
      this.setTrueNewEpitopeLoading();

      let count_url = `query/count?is_control=${this.is_control}`;

      axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.countPopulationRefreshed = res;
              this.finish_count_population_refreshed = true;
          });
     },
     countNumVar(val){
       let to_send = val['compound_query'];
      this.isLoading = true;
      this.finish_count_var = false;
      this.setTrueNewEpitopeLoading();

        let count_url = `epitope/countVariantsEpitopeUser`;

        axios.post(count_url, to_send)
            .then((res) => {
              return res.data;
            })
            .then((res) => {
              if (res[0].count === null || res[0].count === undefined) {
                val['num_var'] = 0;
                this.epitopeToAdd['num_var'] = 0;
              } else {
                val['num_var'] = res[0].count;
                this.epitopeToAdd['num_var'] = res[0].count;
              }
              this.finish_count_var = true;
              //this.addNewEpitopeToList(val);
              //this.setFalseNewEpitopeLoading();
            });
     },
     addFrequencies(){
       if(this.epitopeToAdd['num_var'] === 'N/D'){
         this.epitopeToAdd['mutated_freq'] = 'N/D';
         this.epitopeToAdd['mutated_seq_ratio'] = 'N/D';
         this.epitopeToAdd['total_num_of_seq_metadata'] = this.countSeq2;
       }
       else {
         if (this.epitopeToAdd['num_seq'] === 0) {
           this.epitopeToAdd['mutated_freq'] = 0;
         } else {
           this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['num_var'] / this.epitopeToAdd['num_seq'];
         }
         this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['mutated_freq'].toPrecision(this.precision_float_table);
         this.epitopeToAdd['mutated_seq_ratio'] = (this.epitopeToAdd['num_seq'] / this.countPopulationRefreshed) * 100;
         if (this.epitopeToAdd['mutated_seq_ratio'] >= 10) {
           this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
         } else {
           this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table);
         }
         this.epitopeToAdd['mutated_seq_ratio'] = parseFloat(this.epitopeToAdd['mutated_seq_ratio']).toFixed(this.precision_float_table);
         //this.epitopeToAdd['mutated_seq_ratio'] += ' %';
         this.epitopeToAdd['total_num_of_seq_metadata'] = this.countPopulationRefreshed;
       }
     },
     resetSearchedName(){
       this.searchedName = '';
       if(this.numOfElemInPage2 === 'All' ){
         this.numOfElemInPage = this.epitopeAdded.length;
       }
     },
     pageLeft(){
       this.pageEpitopeList = this.pageEpitopeList - 1;
     },
     pageRight(){
       this.pageEpitopeList = this.pageEpitopeList + 1;
     },
     modifyKey(key){
       let modifiedKey = '';
       if(key === 'taxon_name'){
         modifiedKey = 'virus';
       }
       else if(key === 'host_taxon_name'){
         modifiedKey = 'host';
       }
       else if(key === 'product'){
         modifiedKey = 'protein';
       }
       else{
         modifiedKey = key;
       }

       return modifiedKey;
     },
     modifyKey2(key){
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
     controlExistingName(name_epitope){
        let i = 0;
        while (i >= 0){
          let name = name_epitope + '_' + i;
          if(!this.epitopeAdded.some(item => item.epitope_name === name)) {
              return name;
          }
          else{
            i++;
          }
      }
    },
     reloadCustomEpitope(epitope_index){
       let epitope = JSON.parse(JSON.stringify(this.epitopeAdded[epitope_index]));
       let custom_epi_info = epitope.all_information.epitope_info;
       custom_epi_info['epitope_name'] = this.controlExistingName(custom_epi_info['epitope_name']);
       let amino_acid_info = epitope.all_information.amino_acid_info;
       let metadata = epitope.all_information.compound_query;
       this.setQuery(metadata.gcm);

        this.setTrueExampleCustomEpitope();
        this.resetEpitopeAminoacidConditionsArrayUserNew();
        this.resetNewSingleEpitopeQuery();
        this.setNewSingleEpitopeQuery(custom_epi_info);
        this.resetNewSingleAminoacidConditionUserQuery();
        if (Object.keys(amino_acid_info).length > 0) {
            this.setTrueDisableSelectorEpitopePart();
            this.setTrueShowAminoacidVariantUserNewEpi();
            this.setTrueDisableSelectorUserNewEpitopePart();
            this.setNewSingleAminoacidConditionUserQuery(amino_acid_info);
        }
        else{
          this.setFalseDisableSelectorEpitopePart();
          this.setFalseDisableSelectorUserNewEpitopePart();
          this.setFalseShowAminoacidVariantUserNewEpi();
        }
     },
    refreshCustomEpitope(epitope_index){
      this.setUserEpitopeSelected(epitope_index);
      this.isRefresh = true;
      this.refreshingIndex = epitope_index;
     let epitope = JSON.parse(JSON.stringify(this.epitopeAdded[epitope_index]));
     let date1 = new Date().toISOString().replace('-', '/').split('T')[0].replace('-', '/');
     epitope['refresh_date']  =  date1;
     if(/gisaid/.test(window.location.href)){
       epitope['refresh_database'] = "EpiSurf GISAID";
     }
     else{
       epitope['refresh_database'] = "EpiSurf";
     }
     this.epitopeToAdd = epitope;
     this.countNumSeq(epitope);
     this.countNumVar(epitope);
     this.loadSequence(epitope);
     this.countPopulationRefreshedFunction(epitope);
    }
   },
  created() {

      if(/gisaid/.test(window.location.href)){
        this.isGisaid = true;
      }
      else{
        this.isGisaid = false;
      }
      //if(this.countSeq2 === null || this.countSeq2 === undefined) {
      this.loadCountSeq2();
      //}
      if(this.compound_query['gcm'].taxon_name) {
        this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
      }
      if(this.compound_query['gcm'].host_taxon_name) {
        this.setNewSingleEpitopeSelected({
          field: 'host_taxon_name',
          list: this.compound_query['gcm'].host_taxon_name[0]
        })
      }
      const url = `epitope/newEpitopeFields`;

      this.newEpitopeFields = [];

      axios.get(url)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.newEpitopeFields = res.fields;
          });

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let protein_url = `epitope/allProtein`;
      axios.post(protein_url, to_send)
        .then((res) => {
            return res.data;
        })
        .then((res) => {
            this.allPossibleProteinAnnotations = res;
            this.allPossibleProteinAnnotations  = this.allPossibleProteinAnnotations .filter(function (el) {
              return el != null;
            });
            this.allPossibleProteinAnnotations = this.allPossibleProteinAnnotations .map(protein => protein.toLowerCase());
        });

  },
  watch:{
    dontShowAgainWarningMode1(){
      this.showWarningMode1();
    },
    my_interval_countSeq(){
      if(this.myIntervalCountSeq !== null && this.my_interval_countSeq !== this.myIntervalCountSeq){
        stopPoll(this.myIntervalCountSeq);
      }
      this.setMyIntervalCountSeq(this.my_interval_countSeq);
    },
    epiSearchDis(){
      if(this.epiSearchDis){
        this.clearEpitope();
      }
    },
    newSingleEpitope(){
      if(this.newSingleEpitope['epitope_name'] && this.newSingleEpitope['epitope_name'] !== this.epitope_name){
        this.epitope_name = this.newSingleEpitope['epitope_name'];
      }
    },
    numOfElemInPage2(){
      if(this.numOfElemInPage2 === 'All'){
        this.numOfElemInPage = this.epitopeAddedReview.length;
      }
      else{
        this.numOfElemInPage = this.numOfElemInPage2;
      }
    },
    searchedName(){
      //this.searchedName = this.searchedName.charAt(0).toUpperCase() + this.searchedName.slice(1);
      if((this.pageEpitopeList*this.numOfElemInPage) + 1 > this.epitopeAddedReview.length){
          this.pageEpitopeList = Math.max(Math.ceil(this.epitopeAddedReview.length/this.numOfElemInPage) - 1, 0);
      }
      if (this.pageEpitopeList < 0){
        this.pageEpitopeList = 0;
      }
    },
    epitope_name(){
      this.epitope_name = this.epitope_name.charAt(0).toUpperCase() + this.epitope_name.slice(1);
      this.setNewSingleEpitopeSelected({field: 'epitope_name', list: this.epitope_name})
    },
    compound_query(){
      this.loadCountSeq2();
      if(this.compound_query['gcm'].taxon_name) {
        this.setNewSingleEpitopeSelected({field: 'taxon_name', list: this.compound_query['gcm'].taxon_name[0]})
      }
      if(this.compound_query['gcm'].host_taxon_name) {
        this.setNewSingleEpitopeSelected({
          field: 'host_taxon_name',
          list: this.compound_query['gcm'].host_taxon_name[0]
        })
      }

      if(!this.epiSearchDis){
        let virus = this.compound_query.gcm.taxon_name;
        if(this.previousVirus !== virus) {
          let to_send = JSON.parse(JSON.stringify(this.compound_query));

          let protein_url = `epitope/allProtein`;
          axios.post(protein_url, to_send)
              .then((res) => {
                return res.data;
              })
              .then((res) => {
                this.allPossibleProteinAnnotations = res;
                this.allPossibleProteinAnnotations  = this.allPossibleProteinAnnotations .filter(function (el) {
                  return el != null;
                });
                this.allPossibleProteinAnnotations = this.allPossibleProteinAnnotations .map(protein => protein.toLowerCase());
              });
        }
        this.previousVirus = virus;
      }


    },
    epitopeAdded(){
      this.setCountEpiCustom(this.epitopeAdded.length);
      if((this.pageEpitopeList*this.numOfElemInPage) + 1 > this.epitopeAddedReview.length){
          this.pageEpitopeList = 0;
        }
      if(this.numOfElemInPage2 === 'All' && (this.epitopeAddedReview.length !== this.numOfElemInPage)){
        this.numOfElemInPage = this.epitopeAdded.length;
      }
    },
    finish_count_seq(){
      if(this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population_refreshed === true){

        this.addFrequencies();
        if(!this.isRefresh) {
          this.addNewEpitopeToList(this.epitopeToAdd);
        }
        else{
          this.deleteEpitope(this.userEpitopeSelected);
          let epitope_to_pass = {epitope: this.epitopeToAdd, index: this.userEpitopeSelected};
          this.refreshEpitopeInList(epitope_to_pass);
          this.setUserEpitopeSelected(null);
        }
        let epitopeArr = (JSON.stringify(this.epitopeAdded));
        let storage_name = 'epitopeArr';
        if(this.isGisaid){
          storage_name = storage_name + '_' + 'EpiSurf GISAID'
        }
        else{
          storage_name = storage_name + '_' + 'EpiSurf'
        }
        localStorage.setItem(storage_name, epitopeArr);
        this.setFalseNewEpitopeLoading();
        this.countPopulationRefreshed = null;
        this.epitopeToAdd = null;
        this.refreshingIndex = null;
        this.isRefresh = false;
      }
    },
    finish_count_var(){
      if(this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population_refreshed === true){

        this.addFrequencies();
        if(!this.isRefresh) {
          this.addNewEpitopeToList(this.epitopeToAdd);
        }
        else{
          this.deleteEpitope(this.userEpitopeSelected);
          let epitope_to_pass = {epitope: this.epitopeToAdd, index: this.userEpitopeSelected};
          this.refreshEpitopeInList(epitope_to_pass);
          this.setUserEpitopeSelected(null);
        }
        let epitopeArr = (JSON.stringify(this.epitopeAdded));
        let storage_name = 'epitopeArr';
        if(this.isGisaid){
          storage_name = storage_name + '_' + 'EpiSurf GISAID'
        }
        else{
          storage_name = storage_name + '_' + 'EpiSurf'
        }
        localStorage.setItem(storage_name, epitopeArr);
        this.setFalseNewEpitopeLoading();
        this.countPopulationRefreshed = null;
        this.epitopeToAdd = null;
        this.refreshingIndex = null;
        this.isRefresh = false;
      }
    },
    finish_count_population_refreshed(){
      if(this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population_refreshed === true){
        this.addFrequencies();
        if(!this.isRefresh) {
          this.addNewEpitopeToList(this.epitopeToAdd);
        }
        else{
          this.deleteEpitope(this.userEpitopeSelected);
          let epitope_to_pass = {epitope: this.epitopeToAdd, index: this.userEpitopeSelected};
          this.refreshEpitopeInList(epitope_to_pass);
          this.setUserEpitopeSelected(null);
        }
        let epitopeArr = (JSON.stringify(this.epitopeAdded));
        let storage_name = 'epitopeArr';
        if(this.isGisaid){
          storage_name = storage_name + '_' + 'EpiSurf GISAID'
        }
        else{
          storage_name = storage_name + '_' + 'EpiSurf'
        }
        localStorage.setItem(storage_name, epitopeArr);
        this.setFalseNewEpitopeLoading();
        this.countPopulationRefreshed = null;
        this.epitopeToAdd = null;
        this.refreshingIndex = null;
        this.isRefresh = false;
      }
    },
    pageEpitopeList(){
      if(this.pageEpitopeList < 0){
        this.pageEpitopeList = 0;
      }
      else if (this.pageEpitopeList > this.maxPage){
        this.pageEpitopeList = this.maxPage;
      }
    },
  },
  mounted() {
    let storage_name = 'epitopeArr';
    if(this.isGisaid){
      storage_name = storage_name + '_' + 'EpiSurf GISAID'
    }
    else{
      storage_name = storage_name + '_' + 'EpiSurf'
    }
    if(localStorage.getItem(storage_name)) {
      try {
        let epitopeArr = JSON.parse(localStorage.getItem(storage_name));
        this.resetNewEpitopeFromLocalStorage(epitopeArr);
      } catch (e) {
        localStorage.removeItem(storage_name);
      }
    }
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
    padding-bottom: 50px;
    }

    .EpitopeSelectors{
    margin-bottom: 10px;
    }

   .info-icon {
     font-size: 15px
   }

  .info-button {
    width: 10px
  }

  .singlePosition{
    background-color: #C0C0C0;
    padding-left: 5px;
    padding-right: 5px;
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 5px;
    border-radius: 5%;
  }

  .separator{
    width: 90%;
    height: 8px;
    background-color: #696969;
    border-radius: 100%;
    margin-top: 40px;
  }

  .capitalize {
  text-transform: lowercase;
  display: inline-block;
}

  .capitalize:first-letter {
    text-transform: uppercase !important;
  }

  .arrowButton:disabled{
    opacity: 0.5 !important;
  }

  .shrink2{
    width: 50px;
    margin-right: 30px;
    margin-left: 30px;
    font-size: small;
  }

</style>