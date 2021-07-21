<template>
  <div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="dialog"
      width="1300"
    >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Epitope Mutation Statistics
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color: white"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>

          <v-layout wrap justify-center style="margin: 30px;">
            <v-card style="background-color: #C0C0C0; width: 50%; padding: 20px">
               <v-layout wrap justify-center align-center>
                 <v-flex sm12 style="font-size: 15.5px;">
                   <!--<h2>Epitope info:</h2>-->
                   <span v-for="(value, key) in epitopeInfo" style="display: block;">
                       <b>- {{key}} : </b>
                       <a target="_blank" :href="chosenEpitope['epitope_iri']" v-if="key === 'Epitope IEDB ID'" class="capitalize">{{value}} </a>
                      <span v-else-if="key === 'Position range & sequence' || key === 'Position range'" style="word-wrap:break-word; max-width: 400px">{{value}} </span>
                      <div v-else-if="key === 'Position ranges & sequences' || key === 'Position ranges'" style="display: inline-grid; vertical-align: central;">
                        <span v-for="elem in value" style="word-wrap:break-word; max-width: 400px">
                          {{elem}}<br>
                        </span>
                      </div>

                     <span v-else-if="key === 'Mutated sequences ratio'">
                       <span class="capitalize">{{value}} </span>
                       <span v-if="chosenEpitope !== null && !chosenEpitope['epitope_name']">
                         <span v-if="checkReliabilityPercentage(chosenEpitope) === 'green'" style=" display:inline; margin-left: 5px;">
                              <v-icon
                                  size="20"
                                  flat icon
                                  slot="activator"
                                  color="green"
                                  class="white--text info-button-green" >circle</v-icon>
                        </span>
                        <span v-else-if="checkReliabilityPercentage(chosenEpitope) === 'orange'" style="display:inline; margin-left: 5px">
                            <v-dialog width="500">
                              <v-btn
                                    style="padding: 0; width: 5px; height: 5px"
                                    flat icon
                                    slot="activator"
                                    color="orange"
                                    class="white--text info-button"
                                    >
                                <v-icon size="20">circle</v-icon>
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
                        <span v-else-if="checkReliabilityPercentage(chosenEpitope) === 'red'" style="display:inline; margin-left: 5px">
                            <v-dialog width="500">
                              <v-btn
                                    style="padding: 0; width: 5px; height: 5px"
                                    flat icon
                                    slot="activator"
                                    color="red"
                                    class="white--text info-button"
                                    >
                                <v-icon size="20">circle</v-icon>
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
                       </span>
                     </span>

                      <span v-else-if="key === 'Number of mutated sequences on selected population'" class="capitalize"><br>{{value}} </span>

                      <span v-else class="capitalize">{{value}} </span>
                   </span>

                   <!--<span v-if="Object.keys(createMetadataInfos()).length !== undefined && Object.keys(createMetadataInfos()).length !== null && Object.keys(createMetadataInfos()).length > 0">
                     <br><br>
                     <h2>Metadata info:</h2>
                      <span v-for="(value, key) in createMetadataInfos()" style="display: block;">
                        <b class="text-capitalize">- {{key}}: </b>
                        <div v-if="value.length !== undefined && value.length !== null" style="display: inline">
                          <span v-for="(val, index) in value">
                            <span v-if="index!==0"> , </span>
                            <span class="capitalize">{{val}} </span>
                          </span>
                        </div>
                        <div v-else style="display: inline">
                          <span>
                            {{value}} <br>
                          </span>
                        </div>
                        <br>
                      </span>
                    <br>
                    </span>-->

                 </v-flex>
               </v-layout>
            </v-card>
          </v-layout>


          <v-layout wrap align-center justify-center>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-layout align-center justify-center>
                <v-card style="width: 300px;">
                  <v-select
                    v-model="firstParameter"
                    :items="filterParam(1)"
                    :label= "labelFirstParameter"
                    single
                    :item-text="rename"
                    dense
                    outlined
                    clearable
                    @click:clear = "clearFirstParameter()"
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- Divider and Header-->
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"/>
                      </template>
                      <!-- Normal item -->
                      <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title>{{rename(data.item.name)}}</v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-select>
                </v-card>
              </v-layout>
            </v-flex>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-layout align-center justify-center>
                <v-card style="width: 300px">
                  <v-select
                    v-model="secondParameter"
                    :items="filterParam(2)"
                    :label="labelSecondParameter"
                    single
                    :item-text="rename"
                    dense
                    outlined
                    :disabled = "this.firstParameterSetted === null"
                    clearable
                    @click:clear = "clearSecondParameter()"
                  >
                    <template
                      slot="item"
                      slot-scope="data"
                    >
                      <!-- Divider and Header-->
                      <template v-if="typeof data.item !== 'object'">
                        <v-list-tile-content v-text="data.item"/>
                      </template>
                      <!-- Normal item -->
                      <template v-else>
                        <v-list-tile-content>
                          <v-list-tile-title>{{rename(data.item.name)}}</v-list-tile-title>
                        </v-list-tile-content>
                      </template>
                    </template>
                  </v-select>
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>

          <v-layout wrap justify-center style="margin-top: 40px">
            <v-btn @click="applyTotMutStatistics()"
                   class="white--text" color="#00008B"
                    style="margin-bottom: 20px">APPLY</v-btn>
          </v-layout>


          <v-container fluid grid-list-xs v-if="showTable">
            <v-layout justify-space-between row>
                <v-flex sm3 align-self-center>
                  <v-btn @click="downloadTable()"
                         class="white--text"
                             small
                         color="rgb(122, 139, 157)"
                            :disabled="isLoading || Object.keys(this.headers).length <= 1">
                    Download Table</v-btn>
                </v-flex>
                <v-flex sm2 align-self-center>
                </v-flex>
                <v-flex sm3 align-self-center>
                  <v-layout justify-end>
                    <v-btn @click="returnPredifinedOrderHeader()"
                           class="white--text"
                               small
                           color="rgb(122, 139, 157)"
                              :disabled="isLoading || Object.keys(this.headers).length <= 1">
                      Reset order</v-btn>
                  </v-layout>
                </v-flex>
            </v-layout>
          </v-container>

          <v-data-table :loading="isLoading" :headers="headers"
                        :pagination.sync="pagination"
                        :rows-per-page-items="pagination.rowsPerPageItems"
                        :total-items="pagination.totalItems"
                        :items="result_statistics" item-key="name" v-if="showTable === true"
                        style="margin-bottom: 20px; margin-top: 10px; border: dimgrey solid 1px">


            <template v-if="headers" slot="headers" slot-scope="row">
              <tr>
                <th
                  v-for="header in row.headers"
                  :key="header.text"
                  :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '',
                  'font-weight-black', 'text-uppercase']"
                  @click="changeSort(header.value)"
                >
                  <v-icon small>arrow_upward</v-icon>
                  <pre style="display: inline; font-family: Roboto!important;">{{ header.text }}</pre>
                </th>
              </tr>
            </template>


            <template slot="items" slot-scope="props">
              <td style="white-space:pre-wrap; word-wrap:break-word" v-for="header in headers"
                      :key="header.value" v-show="header.show" :title="header.text">

                <div v-if="header.value === 'Mutation'" v-on:click="orderColumn(props.item);" :class="{'selectedRow': props.item === selectedItem}" class="row-pointer">
                  <span>{{props.item['AllMutation']}}</span>
                </div>

                <div v-else-if="header.value === 'Total'" v-on:click="orderColumn(props.item);" :class="{'selectedRow': props.item === selectedItem}" class="row-pointer">
                  <span>{{props.item[header.value]}}</span>
                  <v-icon style="margin-left: 10px; color: black;" v-if="selectedItem === props.item && order_by_row_desc" small flat>arrow_downward</v-icon>
                  <v-icon style="margin-left: 10px; color: black;" v-if="selectedItem === props.item && !order_by_row_desc" small flat>arrow_upward</v-icon>
                </div>

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


        </v-card-text>

      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";
import {poll, stopPoll} from "../utils";
import axios from "axios";

export default {
  name: "TotalNumberMutationStatistics",
  components: {},
  props: {
  },
  data(){
    return{
      dialog: false,
      threshold_reliability: 0.2,
      selectedItem: null,
      pagination: {
        sortBy: 'Mutation',
        page: 1,
        rowsPerPage: 10
      },
      allParameters: [
        { header: 'GEOGRAPHY', group: 'GEO'},
        { name: 'Continent', group: 'GEO' },
        { name: 'Country', group: 'GEO' },
        { name: 'Region', group: 'GEO' },
        { divider: true, group: 'MUT' },
        { header: 'VARIANTS', group: 'MUT' },
        { name: 'Lineage', group: 'MUT' },
        { name: 'Clade', group: 'MUT' },
        { divider: true, group: 'TIME' },
        { header: 'DATE', group: 'TIME' },
        { name: 'Collection date as month', group: 'TIME' },
        { name: 'Collection date as year', group: 'TIME' },
      ],
      firstParameterSetted: null,
      secondParameterSetted: null,
      labelFirstParameter: "First Grouping Parameter",
      labelSecondParameter: "Second Grouping Parameter",
      showTable: false,
      my_interval_table: null,
      isLoading : false,
      headers: [],
      predefined_order_header: [],
      result_statistics: [],
      sortable: true,
      order_by_row_desc: true,
    }
  },
  computed: {
    ...mapState([
      'showTotalMutationStatistics', 'chosenEpitope', 'epiQuerySel', 'countSeq2'
    ]),
    ...mapGetters({
      compound_query: 'build_query',
    }),
    epitopeInfo(){
      let epitopeInfo = {};
      let epitope = JSON.parse(JSON.stringify(this.chosenEpitope));
      if(this.chosenEpitope != null) {
        if (this.chosenEpitope['epitope_name']) {
          epitopeInfo['Epitope name'] = epitope['epitope_name'];
          //epitopeInfo['Virus name'] = epitope['taxon_name'];
          //epitopeInfo['Host name'] = epitope['host_taxon_name'];
          epitopeInfo['Protein name'] = epitope['product'];

          if(!epitope['sequence']){
            epitope['sequence'] = "";
          }

          let posRange = epitope['position_range_to_show'].replaceAll('\n', '');
          let sequences = epitope['sequence'].replaceAll('\n', '');
          let arrSeq = sequences.split(',');
          let arrPos = posRange.split(',');
          let len2 = arrPos.length;
          if (len2 === 1){
            let str1 = arrPos[0] + ' : ' + arrSeq[0].toUpperCase();
            epitopeInfo['Position range & sequence'] = str1;
          }
          else {
            let arrAll = [];
            let len = arrPos.length;
            let i = 0;
            while (i<len){
              let singlePosSeq = arrPos[i] + ' : ' + arrSeq[i];
              arrAll.push(singlePosSeq);
              i = i + 1;
            }
            epitopeInfo['Position ranges & sequences'] = arrAll;
          }
          epitopeInfo['Number of mutated sequences on selected population'] = epitope.num_seq;
          epitopeInfo['Number of variants on selected population'] = epitope.num_var;
          epitopeInfo['Variants frequency on selected population'] = epitope.mutated_freq;
          epitopeInfo['Mutated sequences ratio'] = epitope.mutated_seq_ratio + " %";
          epitopeInfo['Total number of sequences on selected population'] = epitope.total_num_of_seq_metadata;
        }
        else if(this.chosenEpitope['iedb_epitope_id'])
        {
          epitopeInfo['Epitope IEDB ID'] = epitope['iedb_epitope_id'];
          //epitopeInfo['Virus name'] = epitope['taxon_name'];
          //epitopeInfo['Host name'] = epitope['host_taxon_name'];
          epitopeInfo['Protein name'] = epitope['product'];
          if(epitope['is_linear'] === true){
            let str1 = epitope['position_range_to_show'] + ' : ' + epitope['epi_fragment_sequence'].toUpperCase();
            epitopeInfo['Position range & sequence'] = str1;
          }
          else{
            let pos = epitope['position_range_to_show'].replaceAll('\n', '');
            let seq = epitope['epi_fragment_sequence'].replaceAll('\n', '');
            let arrPos = pos.split(',');
            let seqPos = seq.split(',');
            let arrAll = [];
            let len = arrPos.length;
            let i = 0;
            while (i<len){
              let singlePosSeq = arrPos[i] + ' : ' + seqPos[i];
              arrAll.push(singlePosSeq);
              i = i + 1;
            }
            epitopeInfo['Position ranges & sequences'] = arrAll;
          }
          epitopeInfo['Number of mutated sequences on selected population'] = epitope.num_seq;
          epitopeInfo['Number of variants on selected population'] = epitope.num_var;
          epitopeInfo['Variants frequency on selected population'] = epitope.mutated_freq;
          epitopeInfo['Mutated sequences ratio'] = epitope.mutated_seq_ratio2 + " %";
          epitopeInfo['Total number of sequences on selected population'] = this.countSeq2;
        }
      }
      return epitopeInfo
    },
    firstParameter: {
        get() {
          return this.firstParameterSetted;
        },
        set(value){
          this.showTable = false;
          if(value === undefined || value === null){
            this.firstParameterSetted = null;
          }
          else{
            this.firstParameterSetted = value;
          }
        }
    },
    secondParameter: {
        get() {
          return this.secondParameterSetted;
        },
        set(value){
          this.showTable = false;
          if(value === undefined || value === null){
            this.secondParameterSetted = null;
          }
          else{
            this.secondParameterSetted = value;
          }
        }
    },
  },
  methods: {
    ...mapMutations([
       'showTotMutStatistics','setChosenEpitope'
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
    createMetadataInfos(){
      let infos = {};
      let epitope = JSON.parse(JSON.stringify(this.chosenEpitope));
      let metadata = {};
      if(this.chosenEpitope != null) {
        if (this.chosenEpitope['epitope_name']) {
          metadata = epitope.compound_query.gcm;
        }
        else{
          metadata = this.compound_query.gcm;
        }
      }
      Object.keys(metadata).forEach(function(key) {
        if(key !== 'host_taxon_name' && key !== 'taxon_name') {
          infos[key] = metadata[key];
        }
      })
      return infos;
    },
    orderColumn(mutation){

      if(mutation !== this.selectedItem || (mutation === this.selectedItem && !this.order_by_row_desc)) {

        this.order_by_row_desc = true;
        this.selectedItem = mutation;

        let old_header = JSON.parse(JSON.stringify(this.headers));

        let new_headers = old_header.splice(0, 2);

        let ordered_header = old_header.sort(function (a, b) {
          if (mutation[a.value] === mutation[b.value]) {
            return a.value > b.value ? 1 : -1;
          } else {
            return parseInt(mutation[a.value], 10) < parseInt(mutation[b.value], 10) ? 1 : -1;
          }
        });

        this.headers = new_headers.concat(ordered_header);
      }
      else if(mutation === this.selectedItem && this.order_by_row_desc){

        this.order_by_row_desc = false;
        this.selectedItem = mutation;

        let old_header = JSON.parse(JSON.stringify(this.headers));

        let new_headers = old_header.splice(0, 2);

        let ordered_header = old_header.sort(function (a, b) {
          if (mutation[a.value] === mutation[b.value]) {
            return a.value < b.value ? 1 : -1;
          } else {
            return parseInt(mutation[a.value], 10) > parseInt(mutation[b.value], 10) ? 1 : -1;
          }
        });

        this.headers = new_headers.concat(ordered_header);
      }

    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    returnPredifinedOrderHeader(){
      if(this.pagination.sortBy !== "Mutation" || (this.pagination.sortBy === "Mutation" && this.pagination.descending === true)){
        this.changeSort("Mutation");
      }
      this.headers = this.predefined_order_header;
      this.selectedItem = null;
    },
    downloadTable(){
      let sort = this.pagination.sortBy;
      let order = this.pagination.descending;
      let result = JSON.parse(JSON.stringify(this.result_statistics));
      result = result.sort(function(a, b){
        if(sort === 'Mutation') {
          if (a.Mutation === b.Mutation) {
            if (a.Original === b.Original) {
              if (a.Alternative === "-") {
                return 1;
              } else if (b.Alternative === "-") {
                return -1;
              } else {
                return a.Alternative > b.Alternative ? 1 : -1;
              }
            } else {
              if (a.Original === "-") {
                return 1;
              } else if (b.Original === "-") {
                return -1;
              } else {
                return a.Original > b.Original ? 1 : -1;
              }
            }
          } else {
            if(!order) {
              return parseInt(a.Mutation, 10) > parseInt(b.Mutation, 10) ? 1 : -1;
            }
            else{
              return parseInt(a.Mutation, 10) < parseInt(b.Mutation, 10) ? 1 : -1;
            }
          }
        }
        else{
          if(a[sort] === b[sort]) {
            if (a.Mutation === b.Mutation) {
              if (a.Original === b.Original) {
                if (a.Alternative === "-") {
                  return 1;
                } else if (b.Alternative === "-") {
                  return -1;
                } else {
                  return a.Alternative > b.Alternative ? 1 : -1;
                }
              } else {
                if (a.Original === "-") {
                  return 1;
                } else if (b.Original === "-") {
                  return -1;
                } else {
                  return a.Original > b.Original ? 1 : -1;
                }
              }
            }
            else{
              return parseInt(a.Mutation, 10) > parseInt(b.Mutation, 10) ? 1 : -1;
            }
          }
          else {
            if(order) {
              return parseInt(a[sort], 10) < parseInt(b[sort], 10) ? 1 : -1;
            }
            else{
              return parseInt(a[sort], 10) > parseInt(b[sort], 10) ? 1 : -1;
            }
          }
        }
      });
      let text = this.json2csv(result);
      let name = '';
      if(this.chosenEpitope != null && this.chosenEpitope['epitope_name']){
        name = this.chosenEpitope['epitope_name'];
      }
      else{
        name = this.chosenEpitope['iedb_epitope_id'];
      }
      let filename = "table_mutation_epitope_" + name + ".csv";
      let element = document.createElement('a');
      element.setAttribute('download', filename);
      var data = new Blob([text]);
      element.href = URL.createObjectURL(data);
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    json2csv(input) {
        var json = input;
        var fields = [];
        var fields2 = [];
        this.headers.forEach(function (el) {
          let val = el.text.replaceAll(",", "; ");
          fields.push(val);
        });
        this.headers.forEach(function (el) {
          fields2.push(el.value);
        });
        var csv = json.map(function (row) {
            return fields2.map(function (fieldName) {
                let string_val ;
                if(fieldName !== 'Mutation'){
                  string_val = String(row[fieldName]);
                }
                else{
                  string_val = String(row['AllMutation']);
                }
                return JSON.stringify(string_val);
            }).join(',')
        });
        csv.unshift(fields.join(','));
        return csv.join('\r\n')
    },
    applyTotMutStatistics(){
        this.showTable = true;
        this.loadTable();
    },
    loadTable(){

        if(this.my_interval_table !== null){
          stopPoll(this.my_interval_table);
        }

        this.headers = [];

        this.result_statistics = [];
        this.isLoading = true;
        this.pagination.sortBy = "Mutation";
        this.pagination.descending = false;

        const url = `epitope/totalMutationStatistics`

        let to_send = {};
        if(this.chosenEpitope != null && this.chosenEpitope['epitope_name']){
          to_send['compound_query'] = this.chosenEpitope['compound_query'];
          to_send['parameters'] = {firstParameter: this.firstParameterSetted, secondParameter: this.secondParameterSetted};
          to_send['epi_query'] = null;
          to_send['epitopeID'] = null;

        }
        else {
          to_send['compound_query'] = JSON.parse(JSON.stringify(this.compound_query));
          to_send['epi_query'] = JSON.parse(JSON.stringify(this.epiQuerySel));
          to_send['epitopeID'] = JSON.parse(JSON.stringify(this.chosenEpitope['iedb_epitope_id']));
          to_send['parameters'] = {firstParameter: this.firstParameterSetted, secondParameter: this.secondParameterSetted};
        }

        axios.post(url, to_send)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              this.my_interval_table = poll(res.result, (res) => {
                this.my_interval_table = null;

                this.headers = [
                    {text: 'Mutation', value: 'Mutation', sortable: this.sortable, show: true},
                    {text: 'Total', value: 'Total', sortable: this.sortable, show: true},
                ];

                let list_sum = {};
                let total = 0;
                let vals = res.values;
                let i = 0;
                let len = vals.length;

                let result = [];

                while(i<len){
                  let item = vals[i];
                  let text = "";
                  let j = 0;
                  for (var key in item) {
                    if(j!==0 && key!=="all_info"){
                      text += " ( ";
                    }
                    if (item.hasOwnProperty(key) && key !== "all_info") {
                      if(item[key] !== null && item[key] !== undefined) {
                        if((this.firstParameterSetted === "Collection date as month"
                            || this.secondParameterSetted === "Collection date as month") && key === "col_date"){
                          let substr = item[key].substring(0, item[key].lastIndexOf("-"));
                          text += substr;
                        }
                        else if((this.firstParameterSetted === "Collection date as year"
                            || this.secondParameterSetted === "Collection date as year") && key === "col_date"){
                          let substr = item[key].substring(0, item[key].indexOf("-"));
                          text += substr;
                        }
                        else {
                          text += item[key];
                          text = text.replaceAll(".", "_");
                        }
                      }
                      else{
                        text += "N/D";
                      }
                    }
                    if(j!==0 && key!=="all_info"){
                      text += " ) ";
                    }
                    j = j + 1;
                  }
                  if(text !== "") {
                    let header = {};
                    header['text'] = text;
                    header['value'] = text;
                    header['sortable'] = this.sortable;
                    header['show'] = true;
                    list_sum[text] = 0;
                    this.headers.push(header);
                  }
                  i = i+1;
                }

                let i2 = 0;
                while(i2<len){
                  let item2 = vals[i2];
                  let text = "";
                  let j = 0;
                  for (var key in item2) {
                    if (j !== 0 && key !== "all_info") {
                      text += " ( ";
                    }
                    if (item2.hasOwnProperty(key) && key !== "all_info") {
                      if (item2[key] !== null && item2[key] !== undefined) {
                        if((this.firstParameterSetted === "Collection date as month"
                            || this.secondParameterSetted === "Collection date as month") && key === "col_date"){
                          let substr = item2[key].substring(0, item2[key].lastIndexOf("-"));
                          text += substr;
                        }
                        else if((this.firstParameterSetted === "Collection date as year"
                            || this.secondParameterSetted === "Collection date as year") && key === "col_date"){
                          let substr = item2[key].substring(0, item2[key].indexOf("-"));
                          text += substr;
                        }
                        else {
                          text += item2[key];
                          text = text.replaceAll(".", "_");
                        }
                      } else {
                        text += "N/D";
                      }
                    }
                    else if (item2.hasOwnProperty(key) && key === "all_info"){
                      let str = item2["all_info"];
                      let len2 = str.length;
                      str = str.substring(2,len2-2);
                      let arr = str.split('","');

                      arr.forEach(item3 => {
                          let len3 = item3.length;
                          item3 = item3.substring(1,len3-1);
                          let arr2 = item3.split(',');
                          let position = arr2[0];
                          let original = arr2[1];
                          let alternative = arr2[2];
                          let count = parseInt(arr2[3], 10);

                          let mutation = original + position + alternative;


                          if (result.some(el => el['AllMutation'] === mutation)){
                            result.forEach(function(el){
                              if(el['AllMutation'] === mutation){
                                el[text] = count;
                                el['Total'] = el['Total'] + count;
                                list_sum[text] = list_sum[text] + count;
                                total = total + count;
                              }
                            });
                          }
                          else {
                            let row = {};
                            this.headers.forEach(el => row[el.text] = 0);
                            row['Mutation'] = position;
                            row['AllMutation'] = mutation;
                            row['Original'] = original;
                            row['Alternative'] = alternative;
                            row['Total'] = count;
                            row[text] = count;
                            result.push(row);
                            list_sum[text] = list_sum[text] + count;
                            total = total + count;
                          }
                      })
                    }
                    if (j !== 0 && key !== "all_info") {
                      text += " ) ";
                    }
                    j = j + 1;
                  }
                  i2 = i2 + 1;
                }

                this.headers.forEach(function(el){
                  if(list_sum.hasOwnProperty(el.text)){
                    el.text = el.text + "  [" + list_sum[el.text] + "] ";
                  }
                  else if(el.text === 'Total'){
                    el.text = el.text + "  [" + total + "] ";
                  }
                });

                result = result.sort(function(a, b){
                  if (a.Mutation === b.Mutation) {
                      if (a.Original === b.Original) {
                        if(a.Alternative === "-"){
                          return 1;
                        }
                        else if(b.Alternative === "-"){
                          return -1;
                        }
                        else {
                          return a.Alternative > b.Alternative ? 1 : -1;
                        }
                      }
                      else{
                        if(a.Original === "-"){
                          return 1;
                        }
                        else if(b.Original === "-"){
                          return -1;
                        }
                        else {
                          return a.Original > b.Original ? 1 : -1;
                        }
                      }
                    }
                    else {
                      return parseInt(a.Mutation,10) > parseInt(b.Mutation, 10) ? 1 : -1;
                    }
                });
                this.predefined_order_header = this.headers;
                this.result_statistics = result;
                this.isLoading = false;
              });
            });

    },
    exit(){
      this.showTotMutStatistics();
      this.setChosenEpitope(null);
      this.firstParameterSetted = null;
      this.secondParameterSetted = null;
      this.showTable = false;
      this.result_statistics = [];
    },
    rename(inp) {
      let value_in;
      if (inp.name !== null && inp.name !== undefined) {
        value_in = inp.name;
      } else
        value_in = inp;
      return value_in;
    },
    clearSecondParameter(){
      this.showTable = false;
      this.secondParameterSetted = null;
    },
    clearFirstParameter(){
      this.showTable = false;
      this.firstParameterSetted = null;
      this.secondParameterSetted = null;
    },
    filterParam(selector){
      let listParameters = [];
      let all_param = JSON.parse(JSON.stringify(this.allParameters));
      if(selector === 1){
        if(this.secondParameterSetted !== null){
          let all_param2 = JSON.parse(JSON.stringify(this.allParameters));
          const map1 = all_param2.filter(x => x.name === this.secondParameterSetted);
          all_param.forEach(par => {
            if (par.group !== map1[0].group) {
              listParameters.push(par);
            }
          });
        }
        else{
            listParameters = this.allParameters;
        }
      }
      else if(selector === 2){
        if(this.firstParameterSetted !== null){
          let all_param3 = JSON.parse(JSON.stringify(this.allParameters));
          const map2 = all_param3.filter(x => x.name === this.firstParameterSetted);
          all_param.forEach(par => {
            if (par.group !== map2[0].group){
              listParameters.push(par);
            }
          });
        }
        else{
            listParameters = this.allParameters;
        }
      }
      return listParameters;
    }
  },
  watch: {
    showTotalMutationStatistics() {
      this.dialog = this.showTotalMutationStatistics;
    },
  },
}
</script>

<style scoped>

  .EpitopeSelectors{
    padding: 20px;
    margin-bottom: 10px;
    margin-top: 10px;
  }

  table > tbody > tr > td:nth-child(1),
  table > thead > tr > th:nth-child(1){
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 0;
    z-index: 9998;
    background: white;
  }

  table > tbody > tr > td:nth-child(2){
    position: sticky !important;
    position: -webkit-sticky !important;
    left: 97px;
    z-index: 9998;
    background: white;
    box-shadow: inset -0.5px 0px 0px 0px grey;
  }
  table > thead > tr > th:nth-child(2){
     position: sticky !important;
    position: -webkit-sticky !important;
    left: 97px;
    z-index: 9998;
    background: white;
    box-shadow: inset -0.5px 0px 0px 0px grey;
    padding-right: 10px !important;
  }

  table > tbody > tr:hover >td{
    background: lightgrey !important;
  }

   table > tbody > tr > td{
      text-align: center;
     padding: 0px !important;
  }

  table > thead > tr > th{
    padding: 10px !important;
  }

  .row-pointer {
    cursor: pointer;
  }

  .capitalize {
    text-transform: lowercase;
    display: inline-block;
  }

  .capitalize:first-letter {
    text-transform: uppercase !important;
  }

  .selectedRow {
      font-weight: 1000;
  }


</style>