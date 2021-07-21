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
            <v-layout>
            <v-btn @click="downloadTable()"
                   class="white--text"
                       small
                   color="rgb(122, 139, 157)"
                      :disabled="epiSearchDis || isLoading">
              Download Table</v-btn>
            </v-layout>
          </v-flex>
          <v-flex sm2 align-self-center>
            <v-layout justify-center>
            <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                             :disabled="this.result === null || this.result === undefined || this.result.length === 0"
                              @click="openDialogVirusViz('all')">
                        <v-img style="margin-right: 5px; min-width: 15px;"
                               src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                        VirusViz All Epitopes
                      </v-btn>
            </v-layout>
          </v-flex>
          <v-flex sm3 align-self-right>
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
    </v-container>


    <v-card>
      <h3 style="color:red" v-if="epiSearchDis">{{requirement}}</h3>
      <v-layout wrap align-center >
        <v-data-table
                :headers="selected_headers"
                :items="result"
                :loading="isLoading"
                :pagination.sync="pagination"
                class="data-table"
        >
            <template slot="items" slot-scope="props">
                <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in selected_headers"
                    :key="header.value" v-show="header.show"  v-if="!epiSearchDis"  :title=header.text>

                    <span v-if="header.value === 'num_seq'">
                        <a @click="sendDataToSeqEpiTable(props.item[epitopeId])" target="_blank">{{props.item[header.value]}}</a>
                    </span>

                    <span v-else-if="header.value === 'position_range'">{{props.item['position_range_to_show']}}</span>

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
                                <span v-if="props.item[header.value]> 1">s</span>
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
                              @click="openDialogVirusViz(props.item[epitopeId])">
                        <v-img style="margin-right: 5px; min-width: 15px;"
                               src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                        VirusViz
                      </v-btn>
                    </span>

                    <span v-else>{{props.item[header.value]}}</span>

                </td>
            </template>
            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                  Sorry, nothing to display here :(
              </v-alert>
          <v-alert slot="no-results" :value="true" color="error" icon="warning" v-if="!isLoading">
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
                   @click="virusVizClicked(sendToDialogVirusViz.epitope_id); dialogVirusviz = false;">
              <v-img style="margin-right: 5px; min-width: 15px;"
                     src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
              VirusViz (Full)
            </v-btn>
            <v-btn style="text-transform: none; color: white" small color="rgb(79, 131, 164)"
                   @click="virusVizClicked(sendToDialogVirusViz.epitope_id, true); dialogVirusviz = false;">
              <v-img style="margin-right: 5px; min-width: 15px;"
                     src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
              VirusViz (AA mutations only)
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                color="rgb(122, 139, 157)"
                style="color: white"
                text
                @click="dialogVirusviz = false;"
            >
              Close
            </v-btn>

          </v-card-actions>
        </v-card>
      </v-dialog>

      </v-layout>

      <SequencesEpiTable></SequencesEpiTable>

    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import {mapGetters, mapMutations, mapState} from "vuex";
import draggable from 'vuedraggable'
import {FULL_TEXT, poll, stopPoll} from "../utils";
import SequencesEpiTable from "./SequencesEpiTable";
import AminoacidVariantEpi from "./AminoacidVariantEpi";

const itemSourceIdName = 'iedb_epitope_id';

export default {
  name: "EpitopeTableWithoutVariants2",
  components: {
    AminoacidVariantEpi,
    SequencesEpiTable,
    draggable},
  data() {
    return {
      alertLink: null,
      alertDialog: false,
      epitopeId : 'iedb_epitope_id',
      isLoading : false,
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
      pagination: {},
      dialogVirusviz: false,
      sendToDialogVirusViz: {
        epitope_id : null,
        num_seq : null,
      },
      my_interval_num_epi: null,
      my_interval_table: null,
      my_interval_countSeq: null,
    }
  },
  computed: {
    ...mapState([
      'epiQuerySel', 'epiQuerySelWithoutVariants',  'countSeq', 'countSeq2', 'countSeq3', 'countSeq4' ,'countEpiWithoutVariants', 'showSequenceEpiTable',
      'chosenEpitope', 'aminoacidConditions', 'epitopeAminoacidFields', 'myIntervalCountSeq'
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
        'setCountEpiWithoutVariants', 'setCountSeq', 'setCountSeq2', 'setCountSeq3', 'setCountSeq4',
      'showSeqEpiTable', 'setChosenEpitope', 'setTrueDisableSelectorEpitopePart', 'setMyIntervalCountSeq'
    ]),
    openDialogVirusViz(epitope_id){
      this.dialogVirusviz = true;
      this.sendToDialogVirusViz.epitope_id = epitope_id;
      this.sendToDialogVirusViz.num_seq = this.countSeq2;
    },
    virusVizClicked(epitope_id, aa_only = false){
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

          let epitope_and_aminoacid_conditions = JSON.parse(JSON.stringify(this.epiQuerySelWithoutVariants));
          epitope_and_aminoacid_conditions[this.epitopeId] = epitope_id;
          if(epitope_id !== 'all') {
            to_send['epitope_without_variants'] = epitope_and_aminoacid_conditions;
          }
          else{
            to_send['epitope_without_variants_all_population'] = JSON.parse(JSON.stringify(this.retrieveAllEpitopes()));
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
    retrieveAllEpitopes(){
      let res = this.result;
      let i = 0;
      let all_epi = [];
      while(i < res.length){
        let single_epitope_info = {};
        let epi = res[i];

        single_epitope_info['link'] = epi['epitope_iri'];
        single_epitope_info['protein'] = epi['protein_name'];
        //single_epitope_info['protein'] = "Spike (surface glycoprotein)";
        single_epitope_info['position'] = epi['position_range_to_show'];
        single_epitope_info['id'] =epi['iedb_epitope_id'];

        /*let all_position = epi['position_range_to_show'];

        let regex = /[\n]/g;
        let subst = "";
        all_position = all_position.replace(regex, subst);

        let array_all_position = [];
        let arr_start= [];
        let arr_stop = [];
        let arr = all_position.split(',')

        arr.forEach(item => {
          let arr2 = item.split('-');
          arr_start.push(arr2[0]);
          arr_stop.push(arr2[1]);
        })

        let start_pos_name = "";
        let stop_pos_name = "";

        let length = arr_start.length;
        let j = 0;
        while (j < length) {
          if(j === 0){
            start_pos_name = arr_start[j] + '-' + arr_stop[j];
          }
          else if( j === length-1){
            stop_pos_name = arr_start[j] + '-' + arr_stop[j];
          }
          let position = [];
          position.push(arr_start[j]);
          position.push(arr_stop[j]);
          array_all_position.push(position);
          j++;
        }

        single_epitope_info['position'] = array_all_position;

        let both_position = "";
        if(stop_pos_name !== ''){
          both_position = start_pos_name + ' .. ' + stop_pos_name;
        }
        else{
          both_position = start_pos_name ;
        }

        single_epitope_info['id'] = both_position + " - id " + epi['iedb_epitope_id'];*/
        all_epi.push(single_epitope_info);
        i++;
      }
      return all_epi;
    },
    getHeaders() {
      const predefinedHeaders = [
          {text: 'Epitope IEDB ID', value: 'iedb_epitope_id', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Source Page', value: 'epitope_iri', sortable: false, show: false, to_send: true, can_be_shown: false},
          {text: 'Ref Page', value: 'external_link', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'VirusViz', value: 'virusViz_button', sortable: false, show: true, to_send: false, can_be_shown: true},
          {text: 'Virus Name', value: 'virus_id', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Host Name', value: 'host_id', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Protein Name', value: 'protein_name', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Assay', value: 'cell_type', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Assay Type', value: 'assay_type', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'HLA restriction', value: 'mhc_allele', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'MHC class', value: 'mhc_class', sortable: this.sortable, show: false, to_send: true, can_be_shown: true},
          {text: 'Response Frequency', value: 'response_frequency_pos', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
          {text: 'Epitope Seq', value: 'epi_fragment_sequence', sortable: false, show: true, to_send: true, can_be_shown: true},
          {text: 'Position Range', value: 'position_range', sortable: this.sortable, show: true, to_send: false, can_be_shown: true},
          {text: 'Is Linear', value: 'is_linear', sortable: this.sortable, show: true, to_send: true, can_be_shown: true},
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
                        {"epi_query": this.epiQuerySelWithoutVariants},
                        {"table_headers": table_headers_to_send});
      return res;
    },
    loadTable(){

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
        let to_send = this.toSend();
        const url = `epitope/epiTableResWithoutVariants`
        axios.post(url, to_send)
            .then((res) => {
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
                })
                  this.result = vals;
                  this.isLoading = false;
              })
            })
      }
    },
    loadCountSeq2(){
      this.received_count_seq = false;
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
            this.received_count_seq = true;
          });
        });
    },
    loadCountEpi() {

      if(this.my_interval_num_epi !== null){
        stopPoll(this.my_interval_num_epi);
      }

      if(!this.epiSearchDis) {
        let to_send = this.toSend();
        this.setCountEpiWithoutVariants(null);
        let count_url = 'epitope/countWithoutVariants';

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
                  this.setCountEpiWithoutVariants(res[0].count);
                }
              })
            })
      }
      else{
        this.setCountEpiWithoutVariants(0);
      }
    },
    loadEveything(){
      this.loadCountSeq2();
      this.loadCountEpi();
      this.loadTable();
    },
    sendDataToSeqEpiTable(item){
      this.showSeqEpiTable();
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
                if(fieldName !== 'position_range' && fieldName !== 'external_link') {
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
        this.loadTable();
        this.loadCountEpi();
      }
    },
    compound_query_epi() {
      //this.loadEveything();
    },
    compound_query() {
      this.loadCountSeq2();
    },
    epiQuerySelWithoutVariants(){
      this.loadEveything();
    },
    countSeq2(){
      if(this.countSeq2 !== null) {
        //this.loadTable();
        //this.loadTable2();
      }
    },
  }
}
</script>

<style scoped>

  .data-table{
    width: 100%;
  }

  table.v-table tbody td {
    font-size: 16px !important;
  }

    .separator{
    width: 98%;
    height: 8px;
    background-color: #404040;
    border-radius: 100%;
    margin-top: 20px;
    margin-bottom: 20px;
  }

</style>