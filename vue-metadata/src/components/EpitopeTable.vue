<template>
  <div>
    <v-dialog max-width="500" @keydown.esc="alertDialog = false" v-model="alertDialog"  >
        <v-card>
        <v-card-text>
          Please disable the pop-up blocker for this page, to open the VirusViz directly nextime.
          <br>
          In order to open the VirusViz this time, please <a :href='alertLink' target="_blank">click me</a>.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="alertDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-container fluid grid-list-xs>
      <v-layout justify-center row>
            <v-btn @click="openShowAminoacidVariantEpi()"
                       color="rgb(201, 53, 53) "
                   style="color:white;"
                      :disabled="epiSearchDis || showAminoacidVariantEpi">
              Add condition on amino acids</v-btn>
      </v-layout>
      <AminoacidVariantEpi v-if="showAminoacidVariantEpi"></AminoacidVariantEpi>
    </v-container>

     <v-container fluid grid-list-xs>
        <v-layout justify-center>
          <v-dialog
              v-model="dialogApplyEpitopeTable"
              width="500"
              persistent>
            <v-card>
              <v-card-title
                  class="headline"
                  style="background-color:rgb(201, 53, 53) ; color: white">
                Update Epitope Table
              </v-card-title>

              <v-card-text>
                You have selected
                <span v-if="countSeq2 === null">
                  ...
                </span>
                <span v-else>
                  {{countSeq2}}
                </span>
                sequences and
                <span v-if="countEpi === null">
                  ...
                </span>
                <span v-else>
                  {{countEpi}}
                </span>
                epitopes.
                Beware that our system is optimized for checking the selected sequences on top of  a limited number of
                epitopes (e.g., thousands of sequences over tens of epitopes)
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-container fluid grid-list-xs>
                  <v-layout justify-center>
                    <v-btn
                      class="white--text"
                      color="#00008B"
                      text
                       @click="showTheTable(); dialogApplyEpitopeTable = false"
                    >
                        Apply anyways
                    </v-btn>
                    <v-btn
                      color="rgb(122, 139, 157)"
                      style="color: white"
                      text
                      @click="dialogApplyEpitopeTable = false"
                    >
                        Add other condition
                    </v-btn>
                  </v-layout>
                </v-container>
              </v-card-actions>
            </v-card>
            <v-btn
              class="white--text"
             color="#00008B"
             slot="activator"
            >
               Apply Epitope Search
            </v-btn>
          </v-dialog>
        </v-layout>
     </v-container>


    <div v-if="showTable === true">

      <v-layout wrap align-center justify-center>
        <div class="separator"></div>
      </v-layout>

      <v-container fluid grid-list-xs>
        <v-layout justify-space-between row>
            <v-flex sm3 align-self-center>
              <v-btn @click="downloadTable()"
                     class="white--text"
                         small
                     color="rgb(122, 139, 157)"
                        :disabled="epiSearchDis || isLoading">
                Download Table</v-btn>
            </v-flex>
            <v-flex sm2 align-self-center>
              <v-layout justify-center>
              <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                               :disabled="this.result === null || this.result === undefined || this.result.length === 0"
                                @click="openDialogVirusViz('all', countSeq2)">
                          <v-img style="margin-right: 5px; min-width: 15px;"
                                 src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                          VirusViz All Epitopes
                        </v-btn>
              </v-layout>
            </v-flex>
            <v-flex sm3 align-self-center>
              <v-layout justify-end>
                <v-dialog width="500" v-model="dialogOrder" persistent>
                    <v-card>
                        <v-card-title
                                class="headline"
                                style="background-color:rgb(201, 53, 53) ; color: white"
                        >
                            Field order
                            <v-spacer></v-spacer>
                            <v-checkbox v-model="sortCheckbox" @change="selectAllHeaders()"
                                        :label="sortCheckBoxLabel" color="white"></v-checkbox>
                            <v-btn
                                    color="white"
                                    flat
                                    @click="dialogOrder = false"
                            >
                                Close
                            </v-btn>
                            <v-btn color="white"
                                   flat
                                   @click="resetHeadersOrder()"
                            >
                                Reset
                            </v-btn>
                        </v-card-title>
                        <v-card-text>
                            <p>Drag and drop field names in the desired position.
                                Check or uncheck fields to re-define table content.
                                Press APPLY to go back to the result window.</p>
                            <draggable v-model="headers_can_be_shown" @start="drag=true" @end="drag=false">
                                <v-list v-for="element in headers_can_be_shown" :key="element.value">
                                    <v-checkbox :label=element.text v-model=element.show color="rgb(201, 53, 53)"></v-checkbox>
                                </v-list>
                            </draggable>
                        </v-card-text>
                        <v-divider></v-divider>
                    </v-card>
                    <v-btn dark
                           slot="activator"
                           small
                           color="rgb(122, 139, 157)"
                    >
                        Select/Sort fields
                    </v-btn>
                </v-dialog>
              </v-layout>
            </v-flex>
        </v-layout>
        <v-layout align-center justify-end>
            <v-dialog width="500">
                <v-btn
                      slot="activator"
                      color="rgb(122, 139, 157)"
                      small
                      class="white--text">
                  Statistics Info
                  <v-icon class="info-icon" color="white" style="margin-left: 10px">info</v-icon>
                </v-btn>
                <v-card>
                    <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                    >
                        Statistics:
                    </v-card-title>
                    <v-card-text>
                        <b>(1) NUM MUT SEQ:</b>
                        <span> the number of sequences in the selected population
                          that exhibit at least one amino acid change within the epitope position range.</span>
                        <br><br>
                        <b>(2) TOT MUT:</b>
                        <span> the number of total amino acid changes exhibited by the full population of sequences (any insertion counts for one).</span>
                        <br><br>
                        <b>(3) MUT FREQ:</b>
                        <span> the ratio of total variants (2) over the number of mutated sequences (1).</span>
                        <br><br>
                        <b>(4) MUT SEQ RATIO:</b>
                        <span> the ratio of mutated sequences (1) over the total of the selected population.</span>
                        <div style="margin-left: 10px">
                        <span>
                          <v-icon color = 'green'>circle</v-icon>: denotes epitopes that have been derived by B-cell
                          assays and/or by T-cell/MHC ligand assays with a positive assay response frequency >= 0.2
                          <br>
                          <v-icon color = 'orange'>circle</v-icon>: denotes epitopes that have been derived by reliable
                          assays (i.e., B-cell assays or T-cell/MHC ligand assays with response frequency >= 0.2) but
                          also by less reliable assays (i.e., T-cell/MHC ligand assays with response frequency < 0.2)
                          <br>
                          <v-icon color = 'red'>circle</v-icon>: denotes epitopes that have been derived by
                          T-cell/MHC ligand assays with a positive assay response frequency < 0.2
                          <br>
                          <br>
                          When T-cell/MHC ligand epitopes are concerned, users should consider the percentages of
                          MUT SEQ RATIO with care, ensuring that the HLA restriction is appropriate for the observed
                          population (by checking population alleles databases, e.g.,
                          <a href="http://www.allelefrequencies.net/" target="_blank"> http://www.allelefrequencies.net/</a>).
                          <br>
                        </span>
                        </div>
                        <br><br>
                        <span>When an amino acid condition has been added the number of sequences considered for the
                          calculation of the four statistics is restricted to the ones that exhibit matching mutations
                          (which, by construction, fall within the epitope position range).
                        </span>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-layout>
      </v-container>


      <v-card>
        <h3 style="color:red" v-if="epiSearchDis">{{requirement}}</h3>
        <v-layout wrap align-center >
          <v-data-table
                  :headers="selected_headers"
                  :items="result"
                  :loading="isLoading"
                  class="data-table"
          >
        <!--:pagination.sync="pagination"
                  :rows-per-page-items="pagination.rowsPerPageItems"
                  :total-items="pagination.totalItems" -->
              <template slot="items" slot-scope="props">
                  <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in selected_headers"
                      :key="header.value" v-show="header.show"  v-if="!epiSearchDis"  :title=header.text>

                      <span v-if="header.value === 'num_seq'">
                        <span>
                          <!--<a @click="sendDataToSeqEpiTable(props.item[epitopeId])" target="_blank">{{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span></a>-->

                          <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                               :disabled="props.item['num_seq'] === 0 || props.item['num_seq'] === '-'"
                                @click="sendDataToSeqEpiTable(props.item[epitopeId])">
                            {{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span>
                          </v-btn>

                        </span>
                        <!--<span v-else style="color: royalblue">{{props.item[header.value]}}</span>-->
                      </span>

                      <span v-else-if="header.value === 'num_var'">
                        <span>
                          <!--<a @click="sendDataToTotMutStatistics(props.item[epitopeId])" target="_blank">{{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span></a>-->

                          <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="props.item['num_seq'] === 0 || props.item['num_seq'] === '-'"
                              @click="sendDataToTotMutStatistics(props.item)">
                              {{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span>
                          </v-btn>
                        </span>
                      </span>

                      <span v-else-if="header.value === 'position_range'">{{props.item['position_range_to_show']}}</span>

                      <div v-else-if="header.value === 'mutated_seq_ratio2'" style="float:left;">
                        <span style="display:inline;">{{props.item['mutated_seq_ratio2']}} %</span>
                        <span v-if="checkReliabilityPercentage(props.item) === 'green'" style=" display:inline; margin-left: 5px;">
                              <v-icon
                                  flat icon
                                  slot="activator"
                                  color="green"
                                  class="white--text info-button-green" >circle</v-icon>
                        </span>
                        <span v-else-if="checkReliabilityPercentage(props.item) === 'orange'" style="display:inline; margin-left: 5px">
                            <v-dialog width="500">
                              <v-btn
                                    small
                                    flat icon
                                    slot="activator"
                                    color="orange"
                                    class="white--text info-button"
                                    >
                                <v-icon >circle</v-icon>
                               </v-btn>
                              <v-card>
                                  <v-card-title
                                          class="headline orange lighten-2"
                                          primary-title
                                  >
                                      Attention!
                                  </v-card-title>
                                  <v-card-text>
                                    <span>This epitope has been derived by reliable assays (i.e., B-cell assays or
                                      T-cell/MHC ligand assays with response frequency >= 0.2) but also by less reliable
                                      assays (i.e., T-cell/MHC ligand assays with response frequency < 0.2).
                                      <br>
                                      Please consider the shown statistics with care, as epitopes should be tested on
                                      alleles that are well represented in the observed population.
                                    </span>
                                  </v-card-text>
                              </v-card>
                          </v-dialog>
                        </span>
                        <span v-else-if="checkReliabilityPercentage(props.item) === 'red'" style="display:inline; margin-left: 5px">
                            <v-dialog width="500">
                              <v-btn
                                    small
                                    flat icon
                                    slot="activator"
                                    color="red"
                                    class="white--text info-button"
                                    >
                                <v-icon >circle</v-icon>
                               </v-btn>
                              <v-card>
                                  <v-card-title
                                          class="headline red lighten-2"
                                          primary-title
                                  >
                                      Attention!
                                  </v-card-title>
                                  <v-card-text>
                                    <span>This epitope has been derived by T-cell/MHC ligand assays with a
                                      positive assay response frequency < 0.2.
                                      <br>
                                      Please consider the shown statistics with care, as epitopes should be tested
                                      on alleles that are well represented in the observed population.
                                    </span>
                                  </v-card-text>
                              </v-card>
                          </v-dialog>
                        </span>
                      </div>

                      <span v-else-if="header.value === 'iedb_epitope_id'">
                          <a v-if="props.item[header.value]" :href="props.item['epitope_iri']" target="_blank">{{props.item[header.value]}}</a>
                          <span v-else>N/D</span>
                      </span>

                      <span v-else-if="header.value === 'external_link'">
                          <v-dialog width="500">
                            <v-btn
                                  slot="activator"
                                  color="rgb(122, 139, 157)"
                                  small
                                  class="white--text">
                              Reference link
                              <span v-if="props.item[header.value] > 1">s</span>
                              <span>&nbsp;({{props.item[header.value]}})</span>
                             </v-btn>
                            <v-card>
                                <v-card-title
                                        class="headline grey lighten-2"
                                        primary-title
                                >
                                    Reference link
                                  <span v-if="props.item[header.value] > 1">s</span>
                                </v-card-title>
                                <v-card-text>
                                  <span v-for="link in props.item['external_link_to_show']">
                                    <a :href="link" target="_blank">- {{link}}</a>
                                    <br><br>
                                  </span>
                                </v-card-text>
                            </v-card>
                        </v-dialog>
                      </span>

                      <span v-else-if="header.value === 'virusViz_button'">

                        <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                               :disabled="props.item['num_seq'] === 0"
                                @click="openDialogVirusViz(props.item[epitopeId], props.item['num_seq'])">
                          <v-img style="margin-right: 5px; min-width: 15px;"
                                 src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                          VirusViz
                        </v-btn>
                        <!--
                          <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                                   @click="virusVizClicked(props.item[epitopeId])" :disabled="props.item['num_seq'] === 0">
                              <v-img style="margin-right: 5px" src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                              VirusViz
                          </v-btn>
                          -->
                      </span>

                      <span v-else-if="header.value === 'virusViz_button_all_population'">

                        <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                                @click="openDialogVirusViz(props.item[epitopeId], countSeq2, true)">
                          <v-img style="margin-right: 5px; min-width: 15px;"
                                 src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                          VirusViz
                        </v-btn>
                        <!--
                          <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                                   @click="virusVizClicked(props.item[epitopeId])" :disabled="props.item['num_seq'] === 0">
                              <v-img style="margin-right: 5px" src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                              VirusViz
                          </v-btn>
                          -->
                      </span>

                      <span v-else>{{props.item[header.value]}}</span>

                  </td>
              </template>
              <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                    Sorry, nothing to display here :(
                </v-alert>
                <v-alert slot="no-data" :value="true" style="opacity:0.6;" color="rgb(122, 139, 157)" icon="info" v-else>
                    Loading
                </v-alert>
          </v-data-table>

          <v-dialog
            v-model="dialogVirusviz"
            width="500"
            persistent>
          <v-card>
            <v-card-title
                class="headline"
                style="background-color:rgb(201, 53, 53) ; color: white">
              Open in VirusViz
            </v-card-title>
            <v-progress-linear height="2" color = "rgb(201, 53, 53)" ></v-progress-linear>

            <v-card-text>
              <p>
                You selected
                <span v-if="sendToDialogVirusViz.num_seq">{{sendToDialogVirusViz.num_seq}}</span>
                <span v-else> ... </span>
                sequence<span v-if="sendToDialogVirusViz.num_seq > 1">s</span>,
                they must be formatted and then opened by the VirusViz
                tool.
                This may take time, and your browser could crash if the file is too large.
              <p>
                By checking “FULL” you will open full FASTA sequences and nucleotide / amino acid variants, this is
                usually well supported with 5K sequences or less.
              </p>
              <p>
                By checking “AA Mutations only” you will only open amino acid variants, this option requires less
                memory and is usually well supported with 30K sequences or less.
              </p>

            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                     @click="virusVizClicked(sendToDialogVirusViz.epitope_id, false, all_pop = virusviz_all_pop); dialogVirusviz = false; virusviz_all_pop = false;">
                <v-img style="margin-right: 5px; min-width: 15px;"
                       src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                VirusViz (Full)
              </v-btn>
              <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                     @click="virusVizClicked(sendToDialogVirusViz.epitope_id, true, all_pop = virusviz_all_pop); dialogVirusviz = false; virusviz_all_pop = false;">
                <v-img style="margin-right: 5px; min-width: 15px;"
                       src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                VirusViz (AA mutations only)
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                  color="rgb(122, 139, 157)"
                  style="color: white"
                  text
                  @click="dialogVirusviz = false; virusviz_all_pop = false;"
              >
                Close
              </v-btn>

            </v-card-actions>
          </v-card>
        </v-dialog>

        </v-layout>

        <SequencesEpiTable></SequencesEpiTable>
        <TotalNumberMutationStatistics></TotalNumberMutationStatistics>

      </v-card>

    </div>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {FULL_TEXT, poll, stopPoll} from "../utils";
import SequencesEpiTable from "./SequencesEpiTable";
import AminoacidVariantEpi from "./AminoacidVariantEpi";
import TotalNumberMutationStatistics from "./TotalNumberMutationStatistics";

const itemSourceIdName = 'iedb_epitope_id';

export default {
  name: "EpitopeTable",
  components: {
    TotalNumberMutationStatistics,
    AminoacidVariantEpi,
    SequencesEpiTable,
    draggable},
  data() {
    return {
      alertLink: null,
      alertDialog: false,
      epitopeId : 'iedb_epitope_id',
      isLoading : true,
      result: [],
      requirement: 'A single Host and a single Virus are required',
      is_control : false,
      precision_float_table: 5,
      sortCheckbox: false,
      headers: this.getHeaders(),
      dialogOrder: false,
      sortable: true,
      headers_can_be_shown: this.getShownHeaders(),
      received_count_seq: true,
      pagination: {
          descending: false,
          page: 1,
          rowsPerPage: 10,
          sortBy: itemSourceIdName,
          totalItems: 0,
          rowsPerPageItems: [10, 100, 1000] //mani che si alzano
      },
      dialogVirusviz: false,
      sendToDialogVirusViz: {
        epitope_id : null,
        num_seq : null,
      },
      my_interval_num_epi: null,
      my_interval_table: null,
      my_interval_countSeq: null,
      reCalculateTable: false,
      virusviz_all_pop: false,
      dialogApplyEpitopeTable: false,
      showTable: false,
      threshold_reliability: 0.2,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'countSeq', 'countSeq2', 'countSeq3', 'countSeq4' ,'countEpi', 'showSequenceEpiTable',
      'chosenEpitope', 'showAminoacidVariantEpi', 'aminoacidConditions', 'epitopeAminoacidFields', 'fromPredefinedQuery',
        'myIntervalCountSeq'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
      compound_query_epi: 'build_query_epi',
      epiSearchDis: 'epiSearchDisabled',
      panels:'panels',
    }),
    selected_headers: {
      get() {
        var x;
        var res = [];
        for (x in this.headers_can_be_shown) {
          if (this.headers_can_be_shown[x].show) {
            this.headers_can_be_shown[x]['class'] = 'font-weight-black text-uppercase';
            res.push(this.headers_can_be_shown[x]);
          }
        }
        return res;
      },
      set(value) {
        if (value.length > 0) {
            this.selected_headers = [...this.headers_can_be_shown.filter(item => item.show === true)]
        } else this.selected_headers = []
      }
    },
    sortCheckBoxLabel() {
      if (this.sortCheckbox)
          return "Deselect all";
      else return "Select all"
    },
  },
  methods: {
    ...mapMutations([
        'setCountEpi', 'setCountSeq', 'setCountSeq2', 'setCountSeq3', 'setCountSeq4',
      'showSeqEpiTable', 'setChosenEpitope', 'setTrueShowAminoacidVariantEpi',
      'setFalseShowAminoacidVariantEpi', 'setTrueDisableSelectorEpitopePart', 'setFalseFromPredefinedQuery',
      'setMyIntervalCountSeq', 'showTotMutStatistics'
    ]),
    checkReliabilityPercentage(item){
      let color = '';
      let arr_cell = item['cell_type'].split("\n----\n");
      let arr_resp = item['response_frequency_pos'].split("\n----\n");

      let len = arr_cell.length;
      let i = 0;

      while (i < len){
        if(arr_cell[i] === 'B cell'){
          if(color === ''){
            color = 'green';
          }
          else if (color === 'red'){
            color = 'orange';
          }
        }
        else{
          if(arr_resp[i] !== 'N/D' && arr_resp[i] >= this.threshold_reliability){
              if(color === ''){
                color = 'green';
              }
              else if (color === 'red'){
                color = 'orange';
              }
          }
          else{
            if(color === ''){
                color = 'red';
              }
              else if (color === 'green'){
                color = 'orange';
              }
          }
        }

        i = i + 1;
      }
      return color;
    },
    showTheTable(){
      this.showTable = true;
      this.loadTable();
    },
    retrieveAllEpitopes(){
      let res = this.result;
      let i = 0;
      let all_epi = [];
      while(i < res.length){
        let single_epitope_info = {};
        let epi = res[i];

        single_epitope_info['link'] = epi['epitope_iri'];
        single_epitope_info['protein'] = epi['product'];
        single_epitope_info['position'] = epi['position_range_to_show'];
        single_epitope_info['id'] =epi['iedb_epitope_id'];

        all_epi.push(single_epitope_info);
        i++;
      }
      return all_epi;
    },
    openDialogVirusViz(epitope_id, num_seq, all_pop = false){
      this.dialogVirusviz = true;
      this.sendToDialogVirusViz.epitope_id = epitope_id;
      this.sendToDialogVirusViz.num_seq = num_seq;
      this.virusviz_all_pop = all_pop;
    },
    virusVizClicked(epitope_id, aa_only = false, all_pop = false){
        let orderDir = "";

          if (this.pagination.descending)
              orderDir = "DESC";
          else
              orderDir = "ASC";

          let url = `viz/submit?aa_only=${aa_only}&&is_control=${this.is_control}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
          if (this.selectedProduct !== FULL_TEXT) {
              url += `&annotation_type=${this.selectedProduct}`;
          }

          let to_send = JSON.parse(JSON.stringify(this.compound_query));

          let epitope_and_aminoacid_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));
          epitope_and_aminoacid_conditions[this.epitopeId] = epitope_id;

          if(epitope_id === 'all'){
            to_send['epitope_without_variants_all_population'] = JSON.parse(JSON.stringify(this.retrieveAllEpitopes()));
          }
          else {
            if (all_pop) {
              to_send['epitope_without_variants'] = epitope_and_aminoacid_conditions;
            } else {
              to_send['epitope'] = epitope_and_aminoacid_conditions;
            }
          }


          axios.post(url, to_send)
              .then((res) => {
                  return res.data
              })
              .then((res) => {
                console.log("res: ", res)
                let appUrl = window.location.origin + window.location.pathname
                let virusVizPollUrl = appUrl;
                virusVizPollUrl = virusVizPollUrl.replaceAll("/epitope","");
                virusVizPollUrl = virusVizPollUrl.replaceAll("/episurf","/virusurf")
                virusVizPollUrl = virusVizPollUrl.replace(/\/+$/,'')
                virusVizPollUrl += "/api/poll/";
                virusVizPollUrl += res.result;
                console.log("virusVizPollUrl: " + virusVizPollUrl);
                let virusVizUrl = "http://genomic.deib.polimi.it/virusviz/static/#!/home?";
                const appName = "ViruSurf";
                virusVizUrl += `appName=${appName}&`;
                virusVizUrl += `appURL=${appUrl}&`;
                virusVizUrl += `dataURL=${virusVizPollUrl}&`;
                const newWindow = window.open(virusVizUrl);
                if(!newWindow){
                  this.alertDialog = true;
                  this.alertLink = virusVizUrl
                }

              }).catch(function (error) {
                alert(error.response.data.message);
              });

    },
    getHeaders() {
      const predefinedHeaders = [
          //{text: 'Epitope ID', value: 'epitope_id', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Epitope IEDB ID', value: 'iedb_epitope_id', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Source Page', value: 'epitope_iri', sortable: false, show: false, to_send: true, can_be_shown: false},
          {text: 'Ref Page', value: 'external_link', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'VirusViz Mutated Seq', value: 'virusViz_button', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'VirusViz All Population', value: 'virusViz_button_all_population', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'Virus Name', value: 'taxon_name', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Host Name', value: 'host_taxon_name', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Protein Name', value: 'product', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Assay', value: 'cell_type', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Assay Type', value: 'assay_type', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'HLA restriction', value: 'mhc_allele', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'MHC class', value: 'mhc_class', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Response Frequency', value: 'response_frequency_pos', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Epitope Seq', value: 'epi_fragment_sequence', sortable: false, show: true, to_send: true, can_be_shown: true},
          /*{text: 'Variant Position', value: 'start_aa_original', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Variant Type', value: 'variant_aa_type', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Variant Length', value: 'variant_aa_length', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Original Aminoacid Sequence', value: 'sequence_aa_original', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Alternative Aminoacid Sequence', value: 'sequence_aa_alternative', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},*/
          //{text: 'Epitope Start', value: 'epi_annotation_start', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          //{text: 'Epitope Stop', value: 'epi_annotation_stop', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          //{text: 'Epitope Start', value: 'epi_frag_annotation_start', sortable: false, show: false, to_send: true, can_be_shown: false},
          //{text: 'Epitope Stop', value: 'epi_frag_annotation_stop', sortable: false, show: false, to_send: true, can_be_shown: false},
          //{text: 'All Epitope Fragments', value: 'all_fragment_position', sortable: false, show: false, to_send: true, can_be_shown: false}, //ONLY FOR VERSION 2 TABLE
          {text: 'Position Range', value: 'position_range', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Is Linear', value: 'is_linear', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Num Mut Seq', value: 'num_seq', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Tot Mut', value: 'num_var', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Mut Freq', value: 'mutated_freq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mut Seq Ratio', value: 'mutated_seq_ratio2', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+epi', value: 'mutated_seq_ratio4', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+amino', value: 'mutated_seq_ratio3', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          //{text: 'Mutated Seq Ratio meta+epi+amino', value: 'mutated_seq_ratio', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
      ];
      return predefinedHeaders;
    },
    toSend(){
      let table_headers_to_send = [];
      this.headers.forEach(item => {
        if(item['to_send']) {
          table_headers_to_send.push(item['value']);
        }
      })
      let res = {};
      Object.assign(res,{"compound_query": this.compound_query},
                        {"epi_query": this.epiQuerySel},
                        {"table_headers": table_headers_to_send});
      return res;
    },
    loadTable(){
      this.reCalculateTable = false;

      if(this.my_interval_table !== null){
        stopPoll(this.my_interval_table);
      }

      if(!this.epiSearchDis) {

        let orderDir = "";
        if (this.pagination.descending)
            orderDir = "DESC";
        else
            orderDir = "ASC";

        this.result = [];
        this.isLoading = true;
        //console.log("RELOAD table");
        let to_send = this.toSend();
        const url2 = `epitope/epiTableResLimit?page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`
        const url = `epitope/epiTableRes1`
        axios.post(url, to_send)
            .then((res) => {
              this.setFalseFromPredefinedQuery();
              return res.data
            })
            .then((res) => {
              this.my_interval_table = poll(res.result, (res) => {
                this.my_interval_table = null;
                let vals = res.values;
                vals.forEach(item => {
                  for (let k in item) {
                    if (item.hasOwnProperty(k)) {
                      let key = k;
                      let values = item[k];
                       if (key === 'cell_type' || key === 'mhc_allele' || key === 'response_frequency_pos'
                          || key === 'mhc_class' || key === 'assay_type'){
                        if (item[k] != null) {
                          let to_replace = "";
                          let i = 0;
                          while (i < values.length) {
                            if (item[k][i] != null) {
                              if (key === "mhc_allele") {
                                let str = item[k][i];
                                let regex = /[,]/g;
                                let subst = "$&\n";
                                let result_str = str.replace(regex, subst);
                                item[k][i] = result_str;
                              } else {
                                item[k][i] = item[k][i];
                              }
                              to_replace += item[k][i];
                            } else {
                              to_replace += "N/D";
                            }
                            i++;
                            if (i !== values.length) {
                              to_replace += "\n----\n";
                            }
                          }
                          item[k] = to_replace;
                        } else {
                          item[k] = "N/D";
                        }
                      }
                      else if (key === 'external_link'){
                        let arr_sequence = item[k];
                        let to_replace = [];
                        let i = 0;
                        while(i<arr_sequence.length){
                          let single_arr = arr_sequence[i].split(",");
                          to_replace.push.apply(to_replace, single_arr);
                          i = i+1;
                        }
                        to_replace = to_replace.filter(function(elem, index, self) {
                            return index === self.indexOf(elem);
                        })
                        to_replace = to_replace.sort();
                        item['external_link_to_show'] = to_replace;
                        item[k] = to_replace.length;
                      }
                      else if (key !== 'epi_fragment_all_information') {
                        //let a = 1;
                        //if (a === 1) {
                          if (item[k] != null) {
                            if (key === "mhc_allele") {
                              let str = item[k];
                              let regex = /[,]/g;
                              let subst = "$&\n";
                              let result_str = str.replace(regex, subst);
                              item[k] = result_str;
                            } else {
                              item[k] = item[k];
                            }
                          } else {
                            item[k] = "N/D";
                          }
                        /*} else {
                          let to_replace = "";
                          let i = 0;
                          while (i < values.length) {
                            if (item[k][i] != null) {
                              if (key === "mhc_allele") {
                                let str = item[k][i];
                                let regex = /[,]/g;
                                let subst = "$&\n";
                                let result_str = str.replace(regex, subst);
                                to_replace += result_str;
                              } else {
                                to_replace += item[k][i];
                              }
                            } else {
                              to_replace += "N/D";
                            }
                            //to_replace += item[k][i];
                            i++;
                            if (i !== values.length) {
                              to_replace += ",\n";
                            }
                          }
                          item[k] = to_replace;
                        }*/
                      } else if (key === 'epi_fragment_all_information') {

                        let position = "";
                        let sequence = "";
                        let str_sequence = item[k];

                        let arr_seq = [];
                        let arr_start= [];
                        let arr_stop = [];
                        let len = str_sequence.length;
                        str_sequence = str_sequence.substring(2, len-2);
                        let arr = str_sequence.split('","')

                        arr.forEach(item => {
                          let len2 = item.length;
                          item = item.substring(1,len2-1);
                          let arr2 = item.split(',');
                          arr_start.push(arr2[0]);
                          arr_stop.push(arr2[1]);
                          arr_seq.push(arr2[2]);
                        })

                        let length = arr_start.length;
                        let i = 0;
                        while (i < length) {
                          if (i === 0) {
                            item['position_range'] = arr_start[i];
                          }
                          position += arr_start[i];
                          position += "-";
                          position += arr_stop[i];
                          sequence += arr_seq[i];
                          i++;
                          if (i !== length) {
                            position += ",\n";
                            sequence += ",\n";
                          }
                        }
                        item['position_range_to_show'] = position;
                        item['epi_fragment_sequence'] = sequence;
                      }
                    }
                  }
                  if(item['num_seq'] === 0){
                    item['mutated_freq'] = 0;
                  }
                  else {
                    item['mutated_freq'] = item['num_var'] / item['num_seq'];
                  }
                  item['mutated_freq'] = item['mutated_freq'].toPrecision(this.precision_float_table);
                  //item['mutated_seq_ratio'] = (item['num_seq'] / this.countSeq) * 100;
                  item['mutated_seq_ratio2'] = (item['num_seq'] / this.countSeq2) * 100;
                  //item['mutated_seq_ratio3'] = (item['num_seq'] / this.countSeq3) * 100;
                  //item['mutated_seq_ratio4'] = (item['num_seq'] / this.countSeq4) * 100;
                  /*if (item['mutated_seq_ratio'] >= 10) {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio'] += ' %';*/
                  if (item['mutated_seq_ratio2'] >= 10) {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table + 1);
                    item['mutated_seq_ratio2'] = parseFloat(item['mutated_seq_ratio2']).toFixed(this.precision_float_table - 1);
                  } else {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table);
                    item['mutated_seq_ratio2'] = parseFloat(item['mutated_seq_ratio2']).toFixed(this.precision_float_table);
                  }
                  //item['mutated_seq_ratio2'] += ' %';
                  /*if (item['mutated_seq_ratio3'] >= 10) {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio3'] += ' %';
                  if (item['mutated_seq_ratio4'] >= 10) {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio4'] += ' %';*/

                })
                if (this.received_count_seq) {
                  this.result = vals;
                  this.isLoading = false;
                } else {
                  this.result = [];
                  this.isLoading = true;
                  this.reCalculateTable = true;
                }
              })
            })
      }
    },
    loadTable2(){
      if(!this.epiSearchDis) {

        let orderDir = "";
        if (this.pagination.descending)
            orderDir = "DESC";
        else
            orderDir = "ASC";

        this.result = [];
        this.isLoading = true;
        //console.log("RELOAD table");
        let to_send = this.toSend();
        const url = `epitope/epiTableRes2`
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {
                let vals = res.values;
                vals.forEach(item => {
                  for (let k in item) {
                    if (item.hasOwnProperty(k)) {
                      let key = k;
                      let values = item[k];
                      if (values.length !== undefined && key !== 'epi_frag_annotation_start' && key !== 'epi_frag_annotation_stop' && key !== 'epi_fragment_sequence' && key !== 'all_fragment_position') {
                        if (values.length === 1) {
                          if (item[k][0] != null) {
                            if (key === "mhc_allele") {
                              let str = item[k][0];
                              let regex = /[,]/g;
                              let subst = "$&\n";
                              let result_str = str.replace(regex, subst);
                              item[k] = result_str;
                            } else {
                              item[k] = item[k][0];
                            }
                          } else {
                            item[k] = "N/D";
                          }
                        } else {
                          let to_replace = "";
                          let i = 0;
                          while (i < values.length) {
                            to_replace += item[k][i];
                            i++;
                            if (i !== values.length) {
                              to_replace += ",\n";
                            }
                          }
                          item[k] = to_replace;
                        }
                      } else if (key === 'all_fragment_position') {
                        let position = "";
                        let sequence = "";
                        let array_all = item[key][0];
                        let array_len = array_all.length;
                        let array_sequence = [];
                        let array_start = [];
                        let array_stop = [];
                        array_all.forEach(item => {
                          let len = item.length;
                          item = item.substring(1,len-1);
                          let arr = item.split(',');
                          array_sequence.push(arr[1])
                          array_start.push(arr[2])
                          array_stop.push(arr[3])
                        })
                        let i = 0;
                        while(i < array_len){
                          if (i === 0) {
                            item['position_range'] = array_start[i];
                          }
                          sequence += array_sequence[i];
                          position += array_start[i];
                          position += "-";
                          position += array_stop[i];
                          i++;
                          if(i !== array_len){
                            position += ",\n";
                            sequence += ",\n";
                          }
                        }
                        item['position_range_to_show'] = position;
                        item['epi_fragment_sequence'] = sequence;
                      }
                    }
                  }
                  item['mutated_freq'] = item['num_var'] / item['num_seq'];
                  item['mutated_freq'] = item['mutated_freq'].toPrecision(this.precision_float_table);
                  //item['mutated_seq_ratio'] = (item['num_seq'] / this.countSeq) * 100;
                  item['mutated_seq_ratio2'] = (item['num_seq'] / this.countSeq2) * 100;
                  //item['mutated_seq_ratio3'] = (item['num_seq'] / this.countSeq3) * 100;
                  //item['mutated_seq_ratio4'] = (item['num_seq'] / this.countSeq4) * 100;
                  /*if (item['mutated_seq_ratio'] >= 10) {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio'] = item['mutated_seq_ratio'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio'] += ' %';*/
                  if (item['mutated_seq_ratio2'] >= 10) {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio2'] = item['mutated_seq_ratio2'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio2'] = parseFloat(item['mutated_seq_ratio2']).toFixed(this.precision_float_table);
                  //item['mutated_seq_ratio2'] += ' %';
                  /*if (item['mutated_seq_ratio3'] >= 10) {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio3'] = item['mutated_seq_ratio3'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio3'] += ' %';
                  if (item['mutated_seq_ratio4'] >= 10) {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table + 1);
                  } else {
                    item['mutated_seq_ratio4'] = item['mutated_seq_ratio4'].toPrecision(this.precision_float_table);
                  }
                  item['mutated_seq_ratio4'] += ' %';*/

                })
                if (this.received_count_seq) {
                  this.result = vals;
                  this.isLoading = false;
                } else {
                  this.result = [];
                  this.isLoading = true;
                }
              })
            })
      }
    },
    /*loadCountSeq(){       //meta+epi+amino
      this.received_count_seq = false;
      this.setCountSeq(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));

      //let aminoacid_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions)); // FOR APPLY
      if(this.chosenEpitope != null) {
        epitope_conditions['epitope_id'] = this.chosenEpitope;
      }

      //let epitope_and_aminoacid_conditions = Object.assign(aminoacid_conditions, epitope_conditions);   FOR APPLY

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq(res);
              this.received_count_seq = true;
          });
    },*/
    loadCountSeq2(){        //only meta
      this.received_count_seq = false;
      this.setCountSeq2(null);

      //let to_send = {};
      //Object.assign(to_send,{"compound_query": this.compound_query});
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
            this.received_count_seq = true;
          });
        });

      /*let count_url = 'epitope/countSeq';

        axios.post(count_url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {
                if (res != null) {
                  this.setCountSeq2(res[0].count);
                  this.received_count_seq = true;
                }
              })
            })*/
    },
    /*loadCountSeq3(){            //meta+amino
      this.received_count_seq = false;
      this.setCountSeq3(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.aminoacidConditions));

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq3(res);
              this.received_count_seq = true;
          });
    },
    loadCountSeq4(){            //meta+epi
      this.received_count_seq = false;
      this.setCountSeq4(null);

      let to_send = JSON.parse(JSON.stringify(this.compound_query));

      let epitope_conditions = JSON.parse(JSON.stringify(this.epiQuerySel));

      for(var k in epitope_conditions) {
        if(this.epitopeAminoacidFields.some(elem => elem.field === k) || k==='startExtVariant' || k==='stopExtVariant'){
          delete epitope_conditions[k];
        }
      }

      if(this.chosenEpitope != null) {
        epitope_conditions['epitope_id'] = this.chosenEpitope;
      }

      if(!jQuery.isEmptyObject(epitope_conditions)) {     //FOR APPLY instead epitope_and_aminoacid_conditions
        to_send['epitope'] = epitope_conditions;
      }
        let count_url = `query/count?is_control=${this.is_control}`;
        axios.post(count_url, to_send)
          .then((res) => {
              return res.data;
          })
          .then((res) => {
              this.setCountSeq4(res);
              this.received_count_seq = true;
          });
    },*/
    loadCountEpi() {

      if(this.my_interval_num_epi !== null){
        stopPoll(this.my_interval_num_epi);
      }

      if(!this.epiSearchDis) {
        let to_send = this.toSend();
        this.setCountEpi(null);
        let count_url = 'epitope/count';

        axios.post(count_url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_num_epi = poll(res.result, (res) => {
                this.my_interval_num_epi = null;
                if (res != null) {
                  this.pagination.totalItems = res[0].count;
                  this.pagination.page = 1;
                  this.setCountEpi(res[0].count);
                }
              })
            })
      }
      else{
        this.setCountEpi(0);
      }
    },
    loadEveything(){
      //this.loadCountSeq();
      this.loadCountSeq2();
      //this.loadCountSeq3();
      //this.loadCountSeq4();
      this.loadCountEpi();
      //this.loadTable();
      //this.loadTable2();
    },
    sendDataToSeqEpiTable(item){
      this.showSeqEpiTable();
      this.setChosenEpitope(item);
    },
    sendDataToTotMutStatistics(item){
      this.showTotMutStatistics();
      this.setChosenEpitope(item);
    },
    selectAllHeaders() {
      if (this.sortCheckbox) {
          for (let i in this.headers_can_be_shown) {
              this.headers_can_be_shown[i].show = true
          }
      } else {
          for (let i in this.headers_can_be_shown) {
              this.headers_can_be_shown[i].show = false
          }
      }
    },
    resetHeadersOrder() {
        this.headers_can_be_shown= this.getShownHeaders();
    },
    getShownHeaders(){
        let headers = this.getHeaders();
        let x;
        let res = [];
        for (x in headers) {
          if (headers[x].can_be_shown) {
            res.push(headers[x]);
          }
        }
        return res;
    },
    openShowAminoacidVariantEpi(){
      this.setTrueShowAminoacidVariantEpi();
      this.setTrueDisableSelectorEpitopePart();
    },
    json2csv(input, selected_headers) {
        var json = input;
        var fields = [];
        var fields2 = [];
        if(!selected_headers.some(item => item.value === this.epitopeId)){
              fields.push('Epitope IEDB ID');
              fields2.push(this.epitopeId);
        }
        selected_headers.forEach(function (el) {
          if(el.value !== 'virusViz_button' && el.value !== 'virusViz_button_all_population')
                fields.push(el.text);
        });
        selected_headers.forEach(function (el) {
          if(el.value !== 'virusViz_button' && el.value !== 'virusViz_button_all_population')
                fields2.push(el.value);
        });
        var csv = json.map(function (row) {
            return fields2.map(function (fieldName) {
                let string_val ;
                if(fieldName !== 'position_range'  && fieldName !== 'external_link') {
                  string_val = String(row[fieldName]);
                }
                else if (fieldName === 'external_link'){
                  string_val = String(row['external_link_to_show']);
                  string_val = string_val.replaceAll(",", ",  ");
                }
                else {
                  string_val = String(row['position_range_to_show']);
                }
                string_val = string_val.replaceAll("\n", " ");
                return JSON.stringify(string_val);
            }).join(',')
        });
        csv.unshift(fields.join(','));

        return csv.join('\r\n')
    },
    downloadTable(){
      let text = this.json2csv(this.result, this.selected_headers);
      let filename = "result.csv";
      let element = document.createElement('a');
      element.setAttribute('download', filename);
      var data = new Blob([text]);
      element.href = URL.createObjectURL(data);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  },
  mounted() {
    this.loadEveything();
    if(this.fromPredefinedQuery){
      this.showTheTable();
    }
  },
  watch: {
    my_interval_countSeq(){
      if(this.myIntervalCountSeq !== null && this.my_interval_countSeq !== this.myIntervalCountSeq){
        stopPoll(this.myIntervalCountSeq);
      }
      this.setMyIntervalCountSeq(this.my_interval_countSeq);
    },
    epiSearchDis(){
      if(this.epiSearchDis === false){
        this.loadCountEpi();
      }
    },
    fromPredefinedQuery(){
      if(this.fromPredefinedQuery){
        this.showTheTable();
      }
    },
    /*compound_query_epi() {
      this.loadEveything();
    },*/
    reCalculateTable(){
      if(this.reCalculateTable){
        this.loadTable();
      }
    },
    epiQuerySel() {
      this.loadCountEpi();
      if(!this.fromPredefinedQuery) {
        this.showTable = false;
      }
    },
    compound_query() {
      this.loadCountSeq2();
      if(!this.fromPredefinedQuery) {
        this.showTable = false;
      }
    },
    aminoacidConditions(){
      if(!this.fromPredefinedQuery) {
        this.showTable = false;
      }
    },
    /*countSeq(){
      if(this.countSeq !== null) {
        this.loadTable();
      }
    },*/
    countSeq2(){
      if(this.countSeq2 !== null) {
        //this.loadTable();
        //this.loadTable2();
      }
    },
    /*countSeq3(){
      if(this.countSeq3 !== null) {
        this.loadTable();
      }
    },
    countSeq4(){
      if(this.countSeq4 !== null) {
        this.loadTable();
      }
    },*/
    pagination: {
        handler(val, oldVal) {
            if (JSON.stringify(val) !== JSON.stringify(oldVal))
              this.loadTable();
              //this.loadTable2();
        },
        deep: true
    },
  }
}
</script>

<style scoped>

  .data-table{
    width: 100%;
  }

  .separator{
    width: 98%;
    height: 8px;
    background-color: #404040;
    border-radius: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  table.v-table tbody td {
    font-size: 16px !important;
  }

  .info-button {
    width: 2px;
    padding-bottom: 5px;
    margin-left: 6px;
  }

  .info-button-green {
    width: 2px;
    margin-left: 8px;
  }

</style>