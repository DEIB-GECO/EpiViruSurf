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
                      :disabled="isLoading || epitopeAdded.length===0">
              Download Table</v-btn>
          </v-flex>
          <v-flex sm2 align-self-center></v-flex>
          <v-flex sm3 align-self-center>
            <v-layout justify-end>
              <v-dialog width="500" v-model="dialogOrder" persistent>
                  <v-card>
                      <v-card-title
                              class="headline"
                              style="background-color: rgb(201, 53, 53) ; color: white"
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
                                  <v-checkbox :label=element.text v-model=element.show color= "rgb(201, 53, 53)"></v-checkbox>
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
                      <b>(1) NUM SEQ POPULATION:</b>
                      <span> the number of sequences available in the population where the epitope has been tested
                        in EpiSurf (i.e., matching the filters in the Metadata and Amino Acid Condition columns).</span>
                      <br><br>
                      <b>(2) NUM MUT SEQ:</b>
                      <span> the number of sequences in the selected population
                        that exhibit at least one amino acid change within the epitope position range.</span>
                      <br><br>
                      <b>(3) TOT MUT:</b>
                      <span> the number of total amino acid changes exhibited by the full population of sequences (any insertion counts for one).</span>
                      <br><br>
                      <b>(4) MUT FREQ:</b>
                      <span> the ratio of total variants (3) over the number of mutated sequences (2).</span>
                      <br><br>
                      <b>(5) MUT SEQ RATIO:</b>
                      <span> the ratio of mutated sequences (2) over the total of the selected population (1).</span>
                      <br><br>
                      <span>When epitopes have been defined using also an amino acid condition, counters (2) and (3)
                        are computed by considering the fraction of the population that exhibits the specific selected
                        amino acid condition.</span>
                  </v-card-text>
              </v-card>
          </v-dialog>
      </v-layout>
    </v-container>


    <v-card>
      <v-layout wrap align-center >
        <v-data-table
                :headers="selected_headers"
                :items="result"
                :pagination.sync="pagination"
                :loading="isLoading || newEpitopeLoading"
                class="data-table"
        >
            <template slot="items" slot-scope="props">
                <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in selected_headers"
                    :key="header.value" v-show="header.show" :title=header.text>

                    <span v-if="header.value === 'num_seq'">
                      <span>
                      <!--<span v-if="props.item[header.value] !== '-'">-->
                        <!--<a @click="sendDataToSeqEpiTable(props.item)" target="_blank">{{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span></a>-->

                        <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="props.item['num_seq'] === 0 || props.item['num_seq'] === '-'"
                              @click="sendDataToSeqEpiTable(props.item)">
                          {{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span>
                        </v-btn>

                      </span>
                      <!--</span>
                      <span v-else>{{props.item[header.value]}}</span>-->
                    </span>

                  <span v-else-if="header.value === 'num_var'">
                        <span>
                          <!--<a @click="sendDataToTotMutStatistics(props.item)" target="_blank">{{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span></a>-->

                          <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="props.item['num_seq'] === 0 || props.item['num_seq'] === '-'"
                              @click="sendDataToTotMutStatistics(props.item)">
                              {{props.item[header.value]}}&nbsp&nbsp<span class="material-icons" style="font-size: 16px; display: inline">backup_table</span>
                            </v-btn>
                        </span>
                  </span>

                  <span v-else-if="header.value === 'position_range'">{{props.item['position_range_to_show']}}</span>

                  <span v-else-if="header.value === 'mutated_seq_ratio'">{{props.item['mutated_seq_ratio']}}<span v-if="props.item['mutated_seq_ratio'] !== '-'"> %</span></span>

                  <span v-else-if="header.value === 'metadata'">
                    <br>
                    <!--<br> <h3><b>Metadata:</b></h3><br>-->
                    <span v-if="Object.keys(createMetadataInfos(props.item)).length !== undefined && Object.keys(createMetadataInfos(props.item)).length !== null && Object.keys(createMetadataInfos(props.item)).length > 0">
                      <br>
                      <span v-for="(value, key) in createMetadataInfos(props.item)" style="display: block;"> <b class="text-capitalize">{{key}}: <br></b>
                        <div v-if="value.length !== undefined && value.length !== null" style="display: inline">
                          <span v-for="(val, index) in value">
                            <span v-if="index!=0"> , <br></span>
                            <span class="capitalize">{{val}} </span>
                          </span>
                        </div>
                        <div v-else style="display: inline">
                          <span>
                            {{value}} <br>
                          </span>
                        </div>
                        <br><br>
                      </span>
                    <br><br>
                    </span>
                    <span v-else> N/D <br><br></span>
                    <!--<span v-if="createAminoAcidInfos(props.item).length !== undefined && createAminoAcidInfos(props.item).length !== null && createAminoAcidInfos(props.item).length > 0">
                      <h3><b>-----------</b></h3><br>
                      <h3><b>Amino Acid Condition:</b></h3><br>
                      <div v-for="(conditionsAND, index) in createAminoAcidInfos(props.item)">
                         <div v-for="(conditionsOR, index) in conditionsAND">
                          <span style="display: block; margin-top: 10px; margin-bottom: 10px;" v-if="index > 0"><b> OR </b></span>
                          <span v-for="(value, key) in conditionsOR" style="display: block;">
                            <b>{{key}}: <br></b>
                            <span class="capitalize">{{value}} </span>
                            <br><br>
                          </span>
                        </div>
                      </div>
                      <br><br>
                    </span>-->
                  </span>

                  <span v-else-if="header.value === 'aminoacid_condition'">
                    <br>
                    <span v-if="createAminoAcidInfos(props.item).length !== undefined && createAminoAcidInfos(props.item).length !== null && createAminoAcidInfos(props.item).length > 0">
                      <br>
                      <div v-for="(conditionsAND, index) in createAminoAcidInfos(props.item)">
                        <!--<h3 style="display: block; margin-top: 10px; margin-bottom: 10px;">Condition {{index + 1}}: </h3> -->
                        <div v-for="(conditionsOR, index) in conditionsAND">
                         <span>{{conditionsOR}} </span>

                          <!--<span style="display: block; margin-top: 10px; margin-bottom: 10px;" v-if="index > 0"><b> OR </b></span>
                          <span v-for="(value, key) in conditionsOR" style="display: block;">
                            <b>{{key}}: <br></b>
                            <span class="capitalize">{{value}} </span>
                            <br><br>
                          </span>-->
                        </div>
                      </div>
                      <br><br>
                    </span>
                    <span v-else> N/D <br><br></span>
                  </span>

                    <span v-else-if="header.value === 'virusViz_button'">

                      <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="props.item['num_seq'] === 0 || props.item['num_seq'] === '-'"
                              @click="openDialogVirusViz(props.item, props.item['num_seq'])">
                        <v-img style="margin-right: 5px; min-width: 15px;"
                               src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                        VirusViz
                      </v-btn>
                        <!--<v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                                 @click="virusVizClicked(props.item)" :disabled="props.item['num_seq'] === 0">
                            <v-img style="margin-right: 5px" src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                            VirusViz
                        </v-btn>
                        -->

                    </span>

                    <span v-else-if="header.value === 'virusViz_button_all_population'">

                      <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                              @click="openDialogVirusViz(props.item, props.item['total_num_of_seq_metadata'], true)"
                              :disabled="props.item['num_seq'] === '-'">
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

                    <span v-else-if="header.value === 'creation_date'">
                      <span>{{props.item[header.value]}}</span>
                      <br><br>
                      <span>({{props.item['creation_database']}})</span>
                    </span>

                    <span v-else-if="header.value === 'refresh_date'">
                      <span>{{props.item[header.value]}}</span>
                      <br><br>
                      <span>({{props.item['refresh_database']}})</span>
                    </span>

                    <span v-else>{{props.item[header.value]}}</span>

                </td>
            </template>
            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading && !newEpitopeLoading">
                  Nothing to display here yet. Please add a custom epitope to see the result!
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
                   @click="virusVizClicked(sendToDialogVirusViz.epitope, false, all_pop = virusviz_all_pop); dialogVirusviz = false; virusviz_all_pop = false;">
              <v-img style="margin-right: 5px; min-width: 15px;"
                     src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
              VirusViz (Full)
            </v-btn>
            <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                   @click="virusVizClicked(sendToDialogVirusViz.epitope, true, all_pop = virusviz_all_pop); dialogVirusviz = false; virusviz_all_pop = false;">
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
      <!--<SequencesEpiTableUser></SequencesEpiTableUser>-->
      <TotalNumberMutationStatistics></TotalNumberMutationStatistics>

    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {FULL_TEXT, poll} from "../utils";
import SequencesEpiTable from "./SequencesEpiTable";
import AminoacidVariantEpi from "./AminoacidVariantEpi";
import SequencesEpiTableUser from "./SequencesEpiTableUser";
import TotalNumberMutationStatistics from "./TotalNumberMutationStatistics";

const itemSourceIdName = 'iedb_epitope_id';

export default {
  name: "EpitopeTableUserAdd",
  components: {
    TotalNumberMutationStatistics,
    SequencesEpiTableUser,
    AminoacidVariantEpi,
    SequencesEpiTable,
    draggable},
  data() {
    return {
      alertLink: null,
      alertDialog: false,
      isLoading : true,
      result: [],
      requirement: 'A single Host and a single Virus are required',
      is_control : false,
      sortCheckbox: false,
      headers: this.getHeaders(),
      dialogOrder: false,
      sortable: true,
      headers_can_be_shown: this.getShownHeaders(),
      received_count_seq: true,
      pagination: {},
      dialogVirusviz: false,
      sendToDialogVirusViz: {
        epitope_id : null,
        num_seq : null,
      },
      virusviz_all_pop: false,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'countSeq', 'countSeq2', 'countSeq3', 'countSeq4' ,'countEpi', 'showSequenceEpiTable',
      'chosenEpitope', 'showAminoacidVariantEpi', 'aminoacidConditions', 'epitopeAminoacidFields', 'epitopeAdded',
        'newEpitopeLoading', 'showTotalMutationStatistics'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
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
      'setFalseShowAminoacidVariantEpi', 'setTrueDisableSelectorEpitopePart','showTotMutStatistics'
    ]),
    createAminoAcidInfos(epitope){
      let kv = epitope.compound_query.kv;
      let arrayToShowInAND = [];

      Object.keys(kv).forEach(function(key) {
        let arrayToShowInOR = [];
        if(key !== 'aa_0'){
          let single = kv[key];
          let query = single['query'];
          let len = query.length;
          let i = 0;
          while(i < len){
            //let line = {};
            let line = "";
            let single = query[i];

            let len = Object.keys(single).length;
            let j = 0;

            if(single.hasOwnProperty('product')){
              line += single['product'][0].substr(0,single['product'][0].indexOf(' '));
              line = line.charAt(0).toUpperCase() + line.slice(1)
              j = j + 1;
              if(j < len) {
                line += ', '
              }
              if(j === 3){
                line += '\n'
              }
            }

            if(single.hasOwnProperty('variant_aa_type')){
              line += single['variant_aa_type'][0].toUpperCase();
              j = j + 1;
              if(j < len) {
                line += ', '
              }
              if(j === 3){
                line += '\n'
              }
            }

            if(single.hasOwnProperty('start_aa_original')){
              if(single['start_aa_original']['min_val'] !== single['start_aa_original']['max_val']){
                line += single['start_aa_original']['min_val'] + '-' + single['start_aa_original']['max_val'];
              }
              else{
                line += single['start_aa_original']['min_val'];
              }
              j = j + 1;
              if(j < len) {
                line += ', '
              }
              if(j === 3){
                line += '\n'
              }
            }

            if(single.hasOwnProperty('sequence_aa_original') || single.hasOwnProperty('sequence_aa_alternative')){
              if(single.hasOwnProperty('sequence_aa_original')){
                line += single['sequence_aa_original'][0].toUpperCase();
                j = j + 1;
              }
              else{
                line += "ref";
              }
              line += " -> "
              if(single.hasOwnProperty('sequence_aa_alternative')){
                line += single['sequence_aa_alternative'][0].toUpperCase();
                j = j + 1;
              }
              else{
                line += "any";
              }
              if(j < len) {
                line += ', '
              }
              if(j === 3){
                line += '\n'
              }
            }


            /*Object.keys(single).forEach(function(key) {
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
            })*/

            arrayToShowInOR.push(line);
            i++;
          }
          arrayToShowInAND.push(arrayToShowInOR);
        }
      })

      return arrayToShowInAND;
    },
    createMetadataInfos(epitope){
      let infos = {};
      let metadata = epitope.compound_query.gcm;

      Object.keys(metadata).forEach(function(key) {
        if(key !== 'host_taxon_name' && key !== 'taxon_name') {
          infos[key] = metadata[key];
        }
      })
      return infos;
    },
    openDialogVirusViz(epitope, num_seq, all_pop = false){
      this.dialogVirusviz = true;
      this.sendToDialogVirusViz.epitope = epitope;
      this.sendToDialogVirusViz.num_seq = num_seq;
      this.virusviz_all_pop = all_pop;
    },
    virusVizClicked(prop, aa_only = false, all_pop = false){
        let orderDir = "";

        let to_send = JSON.parse(JSON.stringify(prop['compound_query']));

          let url = `viz/submit?aa_only=${aa_only}&&is_control=${this.is_control}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
          if (this.selectedProduct !== FULL_TEXT) {
              url += `&annotation_type=${this.selectedProduct}`;
          }

          let epitope_info = {};
          epitope_info['epitope_name'] = prop['epitope_name'];
          epitope_info['position_range'] = prop['position_range_to_show'];
          epitope_info['protein'] = prop['product'];
          epitope_info['link'] = '';

          //to_send['userEpitope'] = epitope_info;
          if(all_pop){
            to_send['kv'] = {};
            to_send['epitope_without_variants'] = epitope_info;
          }else {
            to_send['userEpitope'] = epitope_info;
          }

          axios.post(url, to_send)
              .then((res) => {
                  return res.data
              })
              .then((res) => {
                let appUrl = window.location.origin + window.location.pathname
                let virusVizPollUrl = appUrl;
                virusVizPollUrl = virusVizPollUrl.replaceAll("/epitope","")
                virusVizPollUrl = virusVizPollUrl.replaceAll("/episurf","/virusurf")
                virusVizPollUrl = virusVizPollUrl.replace(/\/+$/,'')
                virusVizPollUrl += "/api/poll/";
                virusVizPollUrl += res.result;
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
          {text: 'Epitope Name', value: 'epitope_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Creation Date', value: 'creation_date', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Refresh Date', value: 'refresh_date', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'VirusViz Mutated Seq', value: 'virusViz_button', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'VirusViz All Population', value: 'virusViz_button_all_population', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'Virus Name', value: 'taxon_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Host Name', value: 'host_taxon_name', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Protein Name', value: 'product', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Position Range', value: 'position_range', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Sequence', value: 'sequence', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Metadata', value: 'metadata', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Amino Acid Condition', value: 'aminoacid_condition', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Num Seq Population', value: 'total_num_of_seq_metadata', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Num Mut Seq', value: 'num_seq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Tot Mut', value: 'num_var', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mut Freq', value: 'mutated_freq', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Mut Seq Ratio', value: 'mutated_seq_ratio', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
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
                        {"table_headers": table_headers_to_send});
      return res;
    },
    loadTable(){
      if(!this.epiSearchDis) {
        this.isLoading = true;
        let to_send = this.toSend();
        /*const url = `epitope/epiTableUserAdd`
        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              poll(res.result, (res) => {

              })
            })*/
      }
      this.isLoading = false;
    },
    loadEveything(){
      //if(this.compound_query['gcm'].host_taxon_name && this.compound_query['gcm'].taxon_name ) {
        //this.loadCountEpi();
        this.loadTable();
      //}
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
        if(!selected_headers.some(item => item.value === "epitope_name")){
              fields.push('Epitope name');
              fields2.push(this.epitope_name);
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
                if(fieldName !== 'position_range' && fieldName !== 'external_link'
                && fieldName !== 'metadata' && fieldName !== 'aminoacid_condition') {
                  string_val = String(row[fieldName]);
                }
                else if (fieldName === 'metadata') {
                   string_val = JSON.stringify(this.createMetadataInfos(row));
                }
                else if (fieldName === 'aminoacid_condition') {
                   string_val = JSON.stringify(this.createAminoAcidInfos(row));
                }
                else if (fieldName === 'external_link'){
                  string_val = String(row['external_link_to_show']);
                }
                else {
                  string_val = String(row['position_range_to_show']);
                }
                string_val = string_val.replaceAll("\n", " ");
                string_val = JSON.stringify(string_val);
                if (fieldName === 'metadata' || fieldName === 'aminoacid_condition'){
                   string_val = string_val.replaceAll(/\\/g, "");
                   string_val = string_val.replaceAll(",", "-");
                }
                return string_val
            }.bind(this)).join(',')
        }.bind(this));
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
  watch: {
    countSeq2(){
      if(this.countSeq2 !== null) {
        this.loadTable();
      }
    },
    epitopeAdded(){
      if(this.pagination.page > this.epitopeAdded.length/this.pagination.rowsPerPage){
        this.pagination.page = 1;
      }
      this.result = this.epitopeAdded;
      this.isLoading = false;
    },
    newEpitopeLoading(){
      if(this.newEpitopeLoading){
        this.result = [];
      }
    }
  }
}
</script>

<style scoped>

  .data-table{
    width: 100%;
  }

  .brown-label label {
        color: #D2691E !important;
  }

  .capitalize {
    text-transform: lowercase;
    display: inline-block;
  }

  .capitalize:first-letter {
    text-transform: uppercase
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


</style>