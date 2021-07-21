<template>
  <v-card>
    <v-dialog max-width="500" @keydown.esc="alertDialog = false" v-model="alertDialog">
      <v-card>
        <v-card-text>
          Please disable the pop-up blocker for this page, to open the VirusViz directly nextime.
          <br>
          In order to open the VirusViz this time, please
          <a :href='alertLink' target="_blank" @click="alertDialog = false">click me</a>.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              small
              dark
              @click="alertDialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <span id="mousehovermessage" class="mousehovermessageClass" :style="mousehovermessageStyle">
            <table style="background-color:#000000; color:#FFF;text-align:left;">
              <tr>
                <th>Originating Lab </th>
                <td> {{ mousehovermessage_originating }}</td>
              </tr>
              <tr>
                <th>Submitting Lab </th>
                <td> {{ mousehovermessage_submitting }}</td>
              </tr>
              <tr>
                <th>Authors </th>
                <td> {{ mousehovermessage_authors }}</td>
              </tr>
            </table>
        </span>
    <v-card-title>
      <v-container fluid grid-list-xs>
        <v-layout justify-space-between row>
          <v-flex sm3 align-self-center>
            <v-dialog
                v-model="dialogDownloadTable"
                width="500">
              <v-btn dark
                     slot="activator"
                     small
                     color="blue lighten-2">
                Download Table
              </v-btn>

              <v-card>
                <v-card-title
                    class="headline blue lighten-4"
                    primary-title>
                  Download metadata table
                </v-card-title>
                <v-progress-linear height="2" class="progress"
                                   :indeterminate="downloadProgress"></v-progress-linear>
                <v-card-text>
                  <p>
                    Click the "Download" button below to download a "result.csv" file that contains
                    the comma-separated version of the table shown in the "RESULT SEQUENCES"
                    section, preserving user defined fields order.
                  </p>
                  <p>
                    Please check size of selection.
                    Beware that downloading tables with many files may result in long waiting time.
                  </p>
                </v-card-text>
                <v-divider></v-divider>

                <v-card-actions>
                  <v-btn
                      color="primary"
                      flat
                      @click="downloadTable">
                    Download
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      flat
                      @click="dialogDownloadTable = false"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog
                v-model="dialogDownload"
                width="500">
              <v-btn dark
                     slot="activator"
                     small
                     color="blue lighten-2">
                Download sequence
              </v-btn>
              <v-card>
                <v-card-title
                    class="headline blue lighten-4"
                    primary-title>
                  Download sequence
                </v-card-title>
                <v-progress-linear height="2" class="progress"
                                   :indeterminate="downloadProgress"></v-progress-linear>


                <v-card-text>
                  <v-flex align-self-center>
                    <MetadataDropDown
                        field="annotation_view_product"
                        labelTitle="Choose protein name to extract its sequence"
                        :is_gcm="false"
                        v-model="selectedProduct"
                        v-if = "dialogDownload"/>
                  </v-flex>
                  <p>
                    Click the "Download" button below to download a "sequences.fasta" or
                    "sequences.csv" file that contains the sequence in
                    <a href="https://en.wikipedia.org/wiki/FASTA_format" target="_blank">FASTA</a>
                    or
                    <a href="https://en.wikipedia.org/wiki/Comma-separated_values" target="_blank">CSV</a>
                    file format, respectively.
                  </p>
                  <p>
                    Please check size of selection.
                    Beware that downloading tables with many files may result in long waiting time.
                  </p>
                  <p>
                    Please select output file format:
                    <v-radio-group v-model="downloadFileFormat">
                      <v-radio label="FASTA" value="fasta"></v-radio>
                      <v-radio label="CSV" value="csv"></v-radio>
                    </v-radio-group>
                  </p>
                  <p v-if="selectedProduct !== FULL_TEXT">
                    Please select if you wish to download nucleotide sequence or amino acid sequence:
                    <v-radio-group v-model="downloadType">
                      <v-radio label="Nucleotide" value="nuc"></v-radio>
                      <v-radio label="Amino acid" value="aa"></v-radio>
                    </v-radio-group>
                  </p>


                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-btn
                      color="primary"
                      flat
                      @click="download()">
                    Download
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      flat
                      @click="dialogDownload = false"
                  >
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
          <v-flex sm2 d-flex align-self-center>
            <v-switch style="flex-shrink: initial" v-model=is_control label="Show control"/>
            <v-dialog
                width="500"
            >
              <v-btn slot="activator"
                     class="info-button"
                     small
                     flat icon color="blue">
                <v-icon class="info-icon">info</v-icon>
              </v-btn>

              <v-card>
                <v-card-title
                    class="headline grey lighten-2"
                    primary-title
                >
                  Show control
                </v-card-title>

                <v-card-text>
                  <p>
                    Change the visualized result sequences into their control group
                  </p>
                  <p>
                    The <b>Metadata search</b> filters are fixed,
                    while the conditions set in the <b>Variant search</b> are negated.
                  </p>
                  <p> This allows to answer questions such as
                    "In the user-defined population of virus sequences extracted from SARS-CoV-2 in
                    Wuhan from 01-Jan-2020 till 31-Mar-2020,
                    how many did have the variants V1 and V2 and how many had neither V1 nor V2?"
                  </p>
                </v-card-text>

              </v-card>
            </v-dialog>
          </v-flex>

          <!--                    <v-flex sm3 align-self-center>-->
          <!--                        <MetadataDropDown-->
          <!--                                field="annotation_view_product"-->
          <!--                                labelTitle="Choose protein name to extract its sequence"-->
          <!--                                :is_gcm="false"-->
          <!--                                v-model="selectedProduct"/>-->
          <!--                    </v-flex>-->
          <v-flex sm3 align-self-center>
            <v-dialog width="500" v-model="dialogOrder">
              <v-card>
                <v-card-title
                    class="headline blue lighten-4"
                    primary-title
                >
                  Field order
                  <v-spacer></v-spacer>
                  <v-checkbox v-model="sortCheckbox" @change="selectAllHeaders()"
                              :label="sortCheckBoxLabel"></v-checkbox>
                  <v-btn
                      color="primary"
                      flat
                      @click="dialogOrder = false"
                  >
                    Close
                  </v-btn>
                  <v-btn color="primary"
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
                  <draggable v-model="headers" @start="drag=true" @end="drag=false">
                    <v-list v-for="element in headers" :key="element.value">
                      <v-checkbox :label=element.text v-model=element.show></v-checkbox>
                    </v-list>
                  </draggable>
                </v-card-text>
                <v-divider></v-divider>

              </v-card>
              <v-btn dark
                     slot="activator"
                     small color="blue lighten-2"
              >
                Select/Sort fields
              </v-btn>
            </v-dialog>
            <v-dialog
                v-model="dialogVirusviz"
                width="500">

              <v-btn slot="activator"
                     style="text-transform: none" dark small color="#009688">
                <v-img style="margin-right: 5px; min-width: 15px;"
                       src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                VirusViz
              </v-btn>
              <v-card>
                <v-card-title
                    class="headline blue lighten-4"
                    primary-title>
                  Open in VirusViz
                </v-card-title>
                <v-progress-linear height="2" class="progress"
                                   :indeterminate="downloadProgress"></v-progress-linear>


                <v-card-text>
                  <p>
                    You selected
                    <span v-if="count">{{ count }}</span>
                    <span v-else> ... </span>
                    sequence<span v-if="count > 1">s</span>,
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
                  <v-btn style="text-transform: none" dark small color="#009688"
                         @click="virusVizClicked(); dialogVirusviz = false;">
                    <v-img style="margin-right: 5px; min-width: 15px;"
                           src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                    VirusViz (Full)
                  </v-btn>
                  <v-btn style="text-transform: none" dark small color="#009688"
                         @click="virusVizClicked(true); dialogVirusviz = false;">
                    <v-img style="margin-right: 5px; min-width: 15px;"
                           src="http://genomic.elet.polimi.it/virusviz/static/img/virusviz-logo-name.png"/>
                    VirusViz (AA mutations only)
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="primary"
                      dark small
                      @click="dialogVirusviz = false;"
                  >
                    Close
                  </v-btn>

                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-data-table
        :headers="selected_headers"
        :items="result"
        :loading="isLoading"
        class="data-table"
        :pagination.sync="pagination"
        :rows-per-page-items="pagination.rowsPerPageItems"
        :total-items="pagination.totalItems"
    >
      <template slot="items" slot-scope="props">
        <td v-for="header in selected_headers" :key="header.value" v-show="header.show">
                    <span v-if="header.is_link">
                        <a v-if="props.item[header.value]" :href="props.item[header.value]" target="_blank">link</a>
                        <span v-else>N/D</span>
                    </span>
          <span v-else-if="header.is_multi_link">
                        <span v-if="props.item[header.value]">
                            <a v-if="props.item[header.value].split(',')[0]"
                               :href="props.item[header.value].split(',')[0]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[0] && props.item[header.value].split(',')[1]">, </span>
                            <a v-if="props.item[header.value].split(',')[1]"
                               :href="props.item[header.value].split(',')[1]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[1] && props.item[header.value].split(',')[2]">, </span>
                            <a v-if="props.item[header.value].split(',')[2]"
                               :href="props.item[header.value].split(',')[2]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[2] && props.item[header.value].split(',')[3]">, </span>
                            <a v-if="props.item[header.value].split(',')[3]"
                               :href="props.item[header.value].split(',')[3]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',').length>4">...</span>
                        </span>
                        <span v-else>N/D</span>
                    </span>
          <span v-else-if="header.is_multi_link">
                        <span v-if="props.item[header.value]">
                            <a v-if="props.item[header.value].split(',')[0]"
                               :href="props.item[header.value].split(',')[0]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[0] && props.item[header.value].split(',')[1]">, </span>
                            <a v-if="props.item[header.value].split(',')[1]"
                               :href="props.item[header.value].split(',')[1]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[1] && props.item[header.value].split(',')[2]">, </span>
                            <a v-if="props.item[header.value].split(',')[2]"
                               :href="props.item[header.value].split(',')[2]" target="_blank">link</a>
                            <span
                                v-if="props.item[header.value].split(',')[2] && props.item[header.value].split(',')[3]">, </span>
                            <a v-if="props.item[header.value].split(',')[3]"
                               :href="props.item[header.value].split(',')[3]" target="_blank">link</a>
                            <span v-if="props.item[header.value].split(',').length>4">...</span>
                        </span>
                        <span v-else>N/D</span>
                    </span>
          <span v-else-if="header.value === 'graph'">
                        <v-btn flat icon color="blue" @click="graphClicked(props.item)">
                            <v-icon>group_work</v-icon>
                        </v-btn>

                    </span>
          <span v-else-if="header.value === 'extra'">
                        <v-btn flat icon color="blue" @click="extraMetadataClicked(props.item)">
                            <v-icon>list</v-icon>
                        </v-btn>
                    </span>
          <span v-else-if="header.value === 'lineage_clade'">
                        <span
                            v-if="props.item['lineage'] || props.item['clade']">{{
                            updateCellTextFormat(props.item['lineage'])
                          }} ({{ updateCellTextFormat(props.item['clade']) }})</span>
                        <span v-else v-html="updateCellTextFormat(null)"></span>
                    </span>
          <span v-else-if="header.value === 'accession_id' && props.item['database_source'] == 'GISAID'">
                        <span v-html="updateCellTextFormat(props.item[header.value])"
                              @mouseover="mouseOver(props.item[header.value], $event)"
                              @mouseleave="mouseLeave"
                        />
                    </span>
          <span v-else v-html="updateCellTextFormat(props.item[header.value])"/>
        </td>
      </template>
      <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
        Sorry, nothing to display here :(
      </v-alert>
      <v-alert slot="no-results" :value="true" color="info" icon="info" v-else>
        Loading
      </v-alert>
      <template slot="actions">
        <td :colspan="headers.length">
          <strong>This is an extra footer</strong>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>

import {mapMutations, mapState, mapGetters} from 'vuex';
import draggable from 'vuedraggable'
import MetadataDropDown from "./MetadataDropDown";
import {FULL_TEXT} from '../utils.js'


const itemSourceIdName = 'accession_id';

export default {
  name: "MetadataTable",
  components: {
    MetadataDropDown,
    draggable
  },
  data() {
    return {
      dialogVirusviz: false,
      alertLink: null,
      alertDialog: false,
      downloadFileFormat: 'fasta',
      downloadType: 'nuc',
      selectedProduct: FULL_TEXT,
      mousehovermessage_originating: '...loading...',
      mousehovermessage_submitting: '...loading...',
      mousehovermessage_authors: '...loading...',
      mousehovermessage_left: null,
      mousehovermessage_top: null,
      mousehovermessage_show: false,
      sortCheckbox: false,
      downloadProgress: false,
      gmqlProgress: false,
      dialogDownload: false,
      dialogDownloadTable: false,
      dialogGmql: false,
      gmqlQuery: "",
      isLoading: true,
      search: '',
      result: [],
      agg_mode: false,
      is_control: false,
      download_table: '',
      dialogOrder: false,
      headers: this.getHeaders(),
      pagination: {
        descending: false,
        page: 1,
        rowsPerPage: 10,
        sortBy: itemSourceIdName,
        totalItems: 0,
        rowsPerPageItems: [10, 100, 1000] //mani che si alzano
      },
    }
  },
  watch: {
    compound_query() {
      console.log("CALL: compound_query")
      this.applyQuery();
    },
    synonym() {
      console.log("CALL: synonym")
      this.applyQuery();
    },
    is_control() {
      if (Object.keys(this.compound_query.kv).length) {
        console.log("CALL: is_control");
        this.applyQuery();
      } else {
        if (this.is_control) {
          alert("To execute control query, please define variant search");
          setTimeout(() => {
            this.is_control = false;
          }, 200);
        }
      }
    },
    selectedProduct() {
      console.log("CALL: selectedProduct")
      // this.applyQuery();
    },
    pagination: {
      handler(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal))
          this.applyQuery(false);
      },
      deep: true
    },
    dialogGmql() {
      if (this.dialogGmql && this.count <= 1000) {
        this.gmqlProgress = true;
        this.gmqlQuery = "Loading!";

        const url = `query/gmql?voc=${this.synonym}`;

        // eslint-disable-next-line
        axios.post(url, this.compound_query)
            .then((res) => {
              return res.data
            })
            .then((res) => {
              // console.log(res);
              this.gmqlQuery = res;
              this.gmqlProgress = false;
            });
      }
    },
  },
  mounted() {
    //load all the results
    this.applyQuery();
  },
  methods: {
    ...mapMutations([
      'openGraphDialog',
      'openExtraMetadataDialog',
      'setCount'
    ]),
    virusVizClicked(aa_only = false) {
      console.log("VirusViz clicked");
      let orderDir = "";

      if (this.pagination.descending)
        orderDir = "DESC";
      else
        orderDir = "ASC";

      let url = `viz/submit?aa_only=${aa_only}&is_control=${this.is_control}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
      if (this.selectedProduct !== FULL_TEXT) {
        url += `&annotation_type=${this.selectedProduct}`;
      }

      console.log("CALL: viz/submit");
      // eslint-disable-next-line
      axios.post(url, this.compound_query)
          .then((res) => {
            console.log("GOT: query/table");
            return res.data
          })
          .then((res) => {
            console.log("res: ", res)
            let appUrl = window.location.origin + window.location.pathname
            let virusVizPollUrl = appUrl;
            virusVizPollUrl = virusVizPollUrl.replace(/\/+$/, '')
            virusVizPollUrl += "/api/poll/";
            virusVizPollUrl += res.result;
            console.log("virusVizPollUrl: " + virusVizPollUrl);
            let virusVizUrl = "http://genomic.deib.polimi.it/virusviz/static/#!/home?";
            const appName = "ViruSurf";
            virusVizUrl += `appName=${appName}&`;
            virusVizUrl += `appURL=${appUrl}&`;
            virusVizUrl += `dataURL=${virusVizPollUrl}&`;
            const newWindow = window.open(virusVizUrl);
            if (!newWindow) {
              this.alertDialog = true;
              this.alertLink = virusVizUrl
            }

          }).catch(function (error) {
        // handle error
        console.log(error.response);
        alert(error.response.data.message);
      });

    },
    mouseOver(accessionId, e) {
      this.mousehovermessage_left = e.clientX;
      this.mousehovermessage_top = e.clientY;
      this.mousehovermessage_show = true;

      const l1 = accessionId.substring(accessionId.length - 4, accessionId.length - 2)
      const l2 = accessionId.substring(accessionId.length - 2, accessionId.length)

      const url = `https://www.epicov.org/acknowledgement/${l1}/${l2}/${accessionId}.json`;
      // eslint-disable-next-line
      axios.get(url)
          .then((res) => {
            return res.data
          })
          .then((res) => {
            // console.log(res)
            this.mousehovermessage_authors = res.covv_authors;
            this.mousehovermessage_originating = res.covv_orig_lab;
            this.mousehovermessage_submitting = res.covv_subm_lab;
          })
    },
    mouseLeave() {
      // console.log('mouseLeave')
      this.mousehovermessage_show = false;
      this.mousehovermessage_originating = '...loading...';
      this.mousehovermessage_submitting = '...loading...';
      this.mousehovermessage_authors = '...loading...';
    },
    updateHeaders() {
      const valueSuffix = '_count';

      let currentHeaders = this.headers;
      const currentHeadersValues = currentHeaders.map(el => el.value);

      // console.log(this.panels)
      let panels;
      if (this.is_control) {
        panels = [];
      } else {
        panels = this.panels
            .map(v => Object({
              text: "# vars in " + v,
              value: v + valueSuffix,
              sortable: false,
              show: true,
              is_link: false,
            }));
      }

      let newPanels = panels.filter(el => !currentHeadersValues.includes(el.value))

      const panelsValues = panels.map(el => el.value);
      currentHeaders = currentHeaders.filter(el => !el.value.endsWith(valueSuffix) || panelsValues.includes(el.value))
      // console.log('currentHeaders',currentHeaders)

      currentHeaders = currentHeaders.concat(newPanels)
      // console.log('currentHeaders',currentHeaders)

      this.headers = currentHeaders
    },
    getHeaders() {
      // console.log("HELOOOOO", this.sortable)
      const predefinedHeaders = [
        //sequence
        {
          text: 'Source Page',
          value: 'source_page',
          sortable: this.sortable,
          show: true,
          is_link: true
        },
        {text: 'Accession ID', value: itemSourceIdName, sortable: this.sortable, show: true},
        {text: 'Strain name', value: 'strain_name', sortable: this.sortable, show: true},
        {text: 'Is reference', value: 'is_reference', sortable: this.sortable, show: true},
        {text: 'Is complete', value: 'is_complete', sortable: this.sortable, show: true},
        {text: 'Strand', value: 'strand', sortable: this.sortable, show: true},
        {text: 'Sequence Length', value: 'length', sortable: this.sortable, show: true},
        {text: 'GC%', value: 'gc_percentage', sortable: this.sortable, show: true},
        {text: 'N%', value: 'n_percentage', sortable: this.sortable, show: true},
        {text: 'Lineage (Clade)', value: 'lineage_clade', sortable: false, show: true},
        // {text: 'Lineage', value: 'lineage', sortable: this.sortable, show: true},
        // {text: 'Clade', value: 'clade', sortable: this.sortable, show: true},

        //experiment_type
        {text: 'Seq. Technology', value: 'sequencing_technology', sortable: this.sortable, show: true},
        {text: 'Assembly Method', value: 'assembly_method', sortable: this.sortable, show: true},
        {text: 'Coverage', value: 'coverage', sortable: this.sortable, show: true},
        //sequencing_project
        {text: 'Submitting Lab', value: 'sequencing_lab', sortable: this.sortable, show: false},
        {text: 'Submission date', value: 'submission_date', sortable: this.sortable, show: true},
        {text: 'BioProject', value: 'bioproject_id', sortable: this.sortable, show: true},
        {text: 'Database', value: 'database_source', sortable: this.sortable, show: true},
        //host_sample
        {text: 'Host taxon name', value: 'host_taxon_name', sortable: this.sortable, show: false},
        {text: 'Host taxon ID', value: 'host_taxon_id', sortable: this.sortable, show: false},
        {text: 'Host Gender', value: 'gender', sortable: this.sortable, show: true},
        {text: 'Host Age', value: 'age', sortable: this.sortable, show: true},
        {text: 'Collection date', value: 'collection_date', sortable: this.sortable, show: true},
        {text: 'Isolation source', value: 'isolation_source', sortable: this.sortable, show: true},
        {text: 'Originating Lab', value: 'originating_lab', sortable: this.sortable, show: false},
        {text: 'Geo group', value: 'geo_group', sortable: this.sortable, show: false},
        {text: 'Country', value: 'country', sortable: this.sortable, show: true},
        {text: 'Region', value: 'region', sortable: this.sortable, show: true},
        //virus
        {text: 'Virus taxon name', value: 'taxon_name', sortable: this.sortable, show: true},
        {text: 'Virus taxon ID', value: 'taxon_id', sortable: this.sortable, show: true},
        {text: 'Family', value: 'family', sortable: this.sortable, show: false},
        {text: 'SubFamily', value: 'sub_family', sortable: this.sortable, show: false},
        {text: 'Genus', value: 'genus', sortable: this.sortable, show: false},
        {text: 'Species', value: 'species', sortable: this.sortable, show: false},
        {text: 'Equivalent names', value: 'equivalent_list', sortable: this.sortable, show: false},
        {text: 'Molecule type', value: 'molecule_type', sortable: this.sortable, show: false},
        {text: 'Single stranded', value: 'is_single_stranded', sortable: this.sortable, show: false},
        {text: 'Positive stranded', value: 'is_positive_stranded', sortable: this.sortable, show: false},

        // {text: 'Nucleotide sequence', value: 'nucleotide_sequence', sortable: false, show: true},
        // {text: 'Amino acid sequence', value: 'amino_acid_sequence', sortable: false, show: true},
      ];
      return predefinedHeaders;
    },
    resetHeadersOrder() {
      this.headers = this.getHeaders();
      this.updateHeaders();
    },
    selectAllHeaders() {
      if (this.sortCheckbox) {
        for (let i in this.headers) {
          this.headers[i].show = true
        }
      } else {
        for (let i in this.headers) {
          this.headers[i].show = false
        }
      }
    },
    graphClicked(row) {
      this.openGraphDialog(row[itemSourceIdName])
    },
    extraMetadataClicked(row) {
      this.openExtraMetadataDialog(row[itemSourceIdName])
    },
    callTableQuery() {
      this.updateHeaders();
      let orderDir = "";

      if (this.pagination.descending)
        orderDir = "DESC";
      else
        orderDir = "ASC";

      let url = `query/table?is_control=${this.is_control}&page=${this.pagination.page}&num_elems=${this.pagination.rowsPerPage}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
      // if (this.selectedProduct !== FULL_TEXT) {
      //     url += `&annotation_type=${this.selectedProduct}`;
      // }

      this.isLoading = true;
      this.result = [];
      // console.log("CALL: query/table");
      // eslint-disable-next-line
      axios.post(url, this.compound_query)
          .then((res) => {
            // console.log("GOT: query/table");
            return res.data
          })
          .then((res) => {
            return this.addLink(res);
          })
          .then((res) => {
            return this.firstCharacters(res);
          })
          .then((res) => {
            return res.map((t) => {
              if (t.local_url) {
                t.local_url = t.local_url.replace("www.gmql.eu", "genomic.deib.polimi.it");
                t.local_url = t.local_url + "?authToken=DOWNLOAD-TOKEN";
              }
              return t;
            });
          })
          .then((res) => {
            // console.log(res);
            this.result = res;
            this.isLoading = false;
          });
    },
    applyQuery(changeCount = true) {
      if (changeCount) {
        this.setCount(null);
        this.isLoading = true;
        this.result = [];

        let count_url = `query/count?is_control=${this.is_control}`;

        // TODO CHECK if each sequence has more than one annotation with different product,
        //  then we need to do below.
        // if (this.selectedProduct !== FULL_TEXT) {
        //     count_url += `&annotation_type=${this.selectedProduct}`;
        // }

        // eslint-disable-next-line
        axios.post(count_url, this.compound_query)
            .then((res) => {
              return res.data;
            })
            .then((res) => {
              this.pagination.totalItems = res;
              this.setCount(res);
              this.pagination.page = 1;
            });
      }
      this.callTableQuery();
    },
    download() {
      let orderDir = "";
      if (this.pagination.descending)
        orderDir = "DESC";
      else
        orderDir = "ASC";

      let csv_url = `query/download?is_control=${this.is_control}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}&download_file_format=${this.downloadFileFormat}&download_type=${this.downloadType}`;
      if (this.selectedProduct !== FULL_TEXT) {
        csv_url += `&annotation_type=${this.selectedProduct}`;
      }

      // console.log(csv_url);
      this.downloadProgress = true;
      // eslint-disable-next-line
      axios.post(csv_url, this.compound_query)
          .then((res) => {
            return res.data;
          })
          .then((res) => {
            let text = res;
            let filename = "sequences.fasta";
            if (this.downloadFileFormat != 'fasta') {
              filename = "sequences.csv";
            }
            let element = document.createElement('a');
            element.setAttribute('download', filename);
            var data = new Blob([text]);
            element.href = URL.createObjectURL(data);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            this.downloadProgress = false;
          });
    },
    result2fasta(input) {
      const all_row2fasta = input
          .filter((el) => el.sequence)
          .map((el) => {
            const rowFasta = this.row2fasta(el);
            // console.log('rowFasta', rowFasta);
            return rowFasta;
          });
      const result = all_row2fasta.join("\n")
      return result;
    },
    row2fasta(input) {
      const title = ">" + input.title;
      let sequence = input.sequence;
      let result = sequence.match(/.{1,60}/g);
      result.unshift(title)
      result = result.join("\n");
      return result;
    },
    toClipboard() {
      this.$copyText(this.gmqlQuery).then(function () {
        alert('Copied');
        // console.log(e);
      }, function () {
        alert('Can not copy');
        // console.log(e);
      })
    },
    updateCellTextFormat(input) {
      let temp = input;
      if (temp === null)
        temp = 'N/D';
      if (temp.replace) {
        temp = temp.replace(/\|/g, "|<br/>")
      }
      return temp
    },
    addLink(input) {
      for (const row of input) {
        if (row['database_source'] == 'GISAID')
          row['source_page'] = "https://gisaid.org/";
        else if (row['database_source'] === 'GenBank' || row['database_source'] === 'RefSeq')
          row['source_page'] = 'https://www.ncbi.nlm.nih.gov/nuccore/' + row['accession_id'];
        else if (row['database_source'] == 'COG-UK')
          row['source_page'] = "https://www.cogconsortium.uk/data/";
        //else do nothing
      }
      return input;
    },
    sub(input_str, cut_limit = 30, subst_len = 20) {
      let res = input_str
      let length = 0;

      if (res) {
        length = res.length;
        if (length > cut_limit) {
          res = `${res.substring(0, subst_len)}... (length: ${length})`
        }
      }
      return res;
    },
    firstCharacters(input) {
      for (const row of input) {
        row['nucleotide_sequence'] = this.sub(row['nucleotide_sequence']);
        row['amino_acid_sequence'] = this.sub(row['amino_acid_sequence']);
      }
      return input;
    },
    json2csv(input, selected_headers) {
      var json = input;
      var fields = [];
      selected_headers.forEach(function (el) {
        if (el.value != "extra")
          fields.push(el.value)
      });
      var replacer = function (key, value) {
        return value === null ? 'N/D' : value
      };
      var csv = json.map(function (row) {
        return fields.map(function (fieldName) {
          return JSON.stringify(row[fieldName], replacer)
        }).join(',')
      });
      csv.unshift(fields.join(','));

      return csv.join('\r\n')
    },
    downloadTable() {
      var orderDir = "";
      if (this.pagination.descending)
        orderDir = "DESC";
      else
        orderDir = "ASC";

      let csv_url = `query/table?is_control=${this.is_control}&order_col=${this.pagination.sortBy}&order_dir=${orderDir}`;
      if (this.selectedProduct !== FULL_TEXT) {
        csv_url += `&annotation_type=${this.selectedProduct}`;
      }

      this.downloadProgress = true;
      // eslint-disable-next-line
      axios.post(csv_url, this.compound_query)
          .then((res) => {
            return res.data;
          })
          .then((res) => {
            return this.addLink(res);
          })
          .then((res) => {
            let text = this.json2csv(res, this.selected_headers);
            let filename = "result.csv";
            let element = document.createElement('a');
            element.setAttribute('download', filename);
            var data = new Blob([text]);
            element.href = URL.createObjectURL(data);
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
            this.downloadProgress = false;
          });
    }
  },
  computed: {
    ...mapState(['synonym', 'count']),
    ...mapGetters({
      compound_query: 'build_query',
      panels: 'panels'
    }),
    FULL_TEXT() {
      return FULL_TEXT;
    },
    mousehovermessageStyle() {
      if (this.mousehovermessage_show) {
        return `position:fixed;top: ${this.mousehovermessage_top - 30}px; left: ${this.mousehovermessage_left + 30}px;`;
      } else {
        return 'display: none;';
      }
    },
    sortable() {
      return true;//this.result.length < 1000;
    },
    sortCheckBoxLabel() {
      if (this.sortCheckbox)
        return "Deselect all";
      else return "Select all"
    },
    selected_headers: {
      get() {
        var x;
        var res = [];
        for (x in this.headers) {
          if (this.headers[x].show) {
            res.push(this.headers[x]);
          }
        }
        return res;
      },
      set(value) {
        if (value.length > 0) {
          this.selected_headers = [...this.headers]
        } else this.selected_headers = []
      }
    },
  }

}
</script>

<style>
.v-input--selection-controls__input {
  margin-left: 8px;
}

.v-input--selection-controls.v-input .v-label {
  align-self: flex-end;
}
</style>

<style scoped>

.mousehovermessageClass table, .mousehovermessageClass table th, .mousehovermessageClass table td {
  border-collapse: collapse;
  border: 2px solid gray;
  padding: 3px;
  padding: 3px;
}

.progress {
  margin: 0;
}


.padding-right {
  padding-right: 600px !important;
}

.info-icon {
  font-size: 15px
}

.info-button {
  width: 10px
}

.data-table {
  /*margin-bottom: 1.5em;*/
}
</style>
