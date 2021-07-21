<template>
  <v-app>
    <v-toolbar dark color="primary" app>
      <v-img :src="require('../assets/virusurf_logo.png')" contain max-width="39px" max-height="39px"></v-img>
      <v-btn flat @click="mainContent=true">
        <v-toolbar-title class="headline" style="font-size: 32px;text-transform: none !important;">
          <span>Viru</span>
          <span class="font-weight-light">Surf</span>
        </v-toolbar-title>
      </v-btn>
      <!--            <span style="font-size: 24px;">enabled by data from-->
      <!--                <a href="https://www.gisaid.org" target="_blank">-->
      <!--                    <img style="vertical-align: middle;" :src="require('./assets/gisaid.png')" alt="gisaid-logo"-->
      <!--                         height="24px"/>-->
      <!--                </a>-->
      <!--            </span>-->
      <!--            <span style="font-size: 24px">and GenBank.</span>-->
      <v-spacer></v-spacer>
      <!--            <v-btn flat href="api" target="repository_browser_api"><span class="mr-2">API-->
      <!--                <span class="font-weight-light">doc</span></span>-->
      <!--            </v-btn>-->
      <v-toolbar-items class="hidden-md-and-down">
        <v-btn flat href="http://geco.deib.polimi.it/episurf/" target="_blank">
          <span class="mr-2">EpiSurf</span>
        </v-btn>
        <v-btn flat href="http://geco.deib.polimi.it/episurf_gisaid/" target="_blank">
            <span class="mr-2">EpiSurf GISAID</span>
        </v-btn>
        <v-btn flat href="http://geco.deib.polimi.it/virusurf_gisaid/" target="_blank">
          <span class="mr-2">ViruSurf GISAID</span>
        </v-btn>
        <v-btn flat href="http://geco.deib.polimi.it/genosurf/" target="_blank">
          <span class="mr-2">GenoSurf</span>
        </v-btn>
        <v-btn flat href="/virusurf/repo_static/datacuration.html" target="_blank">
          <span class="mr-2">Data curation</span>
        </v-btn>
        <v-btn flat href="https://github.com/DEIB-GECO/vue-metadata/wiki" target="_blank">
          <span class="mr-2">Wiki</span>
        </v-btn>
        <v-btn flat href="https://www.youtube.com/watch?v=ljo4WWZ1rU0&list=PLfWxoOMC6swIkqfLc3G4H-hW_pdmI1jFF"
               target="_blank">
          <span class="mr-2">Video</span>
        </v-btn>
        <v-btn flat href="http://geco.deib.polimi.it/surveys/index.php/2/" target="_blank">
          <span class="mr-2">Survey</span>
        </v-btn>
        <!--          <v-btn flat href="/virusurf/repo_static/acknowledgements.html" target="_blank">
                      <span class="mr-2">Acknowledgements</span>
                  </v-btn>
                  <v-btn flat href="/virusurf/repo_static/contact.html" target="_blank">
                      <span class="mr-2">Contacts</span>
                  </v-btn>-->
        <v-btn flat href="/virusurf/repo_static/about.html" target="_blank">
          <span class="mr-2">About</span>
        </v-btn>
      </v-toolbar-items>
      <v-menu class="hidden-lg-and-up">
        <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="http://geco.deib.polimi.it/episurf/" target="_blank">
                <span class="mr-2">EpiSurf</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="http://geco.deib.polimi.it/episurf_gisaid/" target="_blank">
                  <span class="mr-2">EpiSurf GISAID</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="http://geco.deib.polimi.it/virusurf_gisaid/" target="_blank">
                <span class="mr-2">ViruSurf GISAID</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="http://geco.deib.polimi.it/genosurf/" target="_blank">
                <span class="mr-2">GenoSurf</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="/virusurf/repo_static/datacuration.html" target="_blank">
                <span class="mr-2">Data curation</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="https://github.com/DEIB-GECO/vue-metadata/wiki" target="_blank">
                <span class="mr-2">Wiki</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="https://www.youtube.com/watch?v=ljo4WWZ1rU0&list=PLfWxoOMC6swIkqfLc3G4H-hW_pdmI1jFF"
                     target="_blank">
                <span class="mr-2">Video</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="http://geco.deib.polimi.it/surveys/index.php/2/" target="_blank">
                <span class="mr-2">Survey</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="background-color: white">
            <v-list-tile-content>
              <v-btn flat href="/virusurf/repo_static/about.html" target="_blank">
                <span class="mr-2">About</span>
              </v-btn>
            </v-list-tile-content>
        </v-list-tile>
      </v-menu>
    </v-toolbar>
    <v-content class="main-content">
      <v-content v-show="mainContent">
        <!--<v-layout column class="fab-container"> -->
        <v-container fluid grid-list-xl style="background:#f1f3f4">
          <v-layout wrap align-center test>
            <v-flex sm12 class="no-horizontal-padding" v-if="isDev">{{ queryInput }}</v-flex>
            <v-flex md12 sm12 class=" no-horizontal-padding" v-if="lastUpdate" style="text-align: right;">
              Last update date: {{ lastUpdate }}
            </v-flex>
            <!--<v-flex md2 sm2 d-flex class="no-horizontal-padding">
                <span class=label>Query:</span>
            </v-flex>-->  <!--query utils-->
            <v-flex md2 sm2 class="no-horizontal-padding">
              <v-btn color='info' @click="afterQuerySelection();sars_info=false;">Clear your query
              </v-btn>
            </v-flex>  <!--clear all-->
            <!--                        <v-flex md1 sm2 class="no-horizontal-padding">-->
            <!--                            <v-dialog v-model="dialogShowQuery">-->
            <!--                                <v-btn flat class="small-btn" dark small-->
            <!--                                       slot="activator"-->
            <!--                                       color="info"-->
            <!--                                >Modify-->
            <!--                                </v-btn>-->
            <!--                                <v-card>-->
            <!--                                    <v-card-title-->
            <!--                                            class="headline blue lighten-4"-->
            <!--                                            primary-title-->
            <!--                                    >-->
            <!--                                        Copy, modify or paste query-->
            <!--                                    </v-card-title>-->
            <!--                                    <v-alert type="error" :value="true" v-if="!inputValid">-->
            <!--                                        Input is not valid-->
            <!--                                    </v-alert>-->
            <!--                                    <v-textarea class="mytextarea"-->
            <!--                                                v-model="queryInput"-->
            <!--                                    >-->
            <!--                                    </v-textarea>-->

            <!--                                    <v-divider></v-divider>-->

            <!--                                    <v-card-actions>-->
            <!--                                        <v-btn-->
            <!--                                                color="primary"-->
            <!--                                                flat-->
            <!--                                                @click="toClipboard()"-->
            <!--                                        >-->
            <!--                                            Copy to clipboard-->
            <!--                                        </v-btn>-->
            <!--                                        <v-spacer></v-spacer>-->
            <!--                                        <v-btn-->
            <!--                                                :disabled=!inputValid-->
            <!--                                                color="primary"-->
            <!--                                                flat-->
            <!--                                                @click="setInputQuery"-->
            <!--                                        >-->
            <!--                                            Apply-->
            <!--                                        </v-btn>-->
            <!--                                        <v-btn-->
            <!--                                                color="primary"-->
            <!--                                                flat-->
            <!--                                                @click="dialogShowQuery = false"-->
            <!--                                        >-->
            <!--                                            Close-->
            <!--                                        </v-btn>-->
            <!--                                    </v-card-actions>-->
            <!--                                </v-card>-->
            <!--                            </v-dialog>-->
            <!--                        </v-flex>  &lt;!&ndash;modify&ndash;&gt;-->

            <!--                        <v-flex md1 sm2 class="no-horizontal-padding">-->
            <!--                            <text-reader @load="queryString = $event"></text-reader>-->
            <!--                        </v-flex>  &lt;!&ndash;upload query&ndash;&gt;-->

            <!--                        <v-flex md1 sm2 class="no-horizontal-padding">-->
            <!--                            <v-btn flat class="small-btn" small color='info' @click="downloadQuery">Download</v-btn>-->
            <!--                        </v-flex>  &lt;!&ndash;download query&ndash;&gt;-->

            <v-spacer></v-spacer>

            <v-flex md8 sm8 class=" no-horizontal-padding">
              <v-select solo
                        dense
                        :menu-props='{"maxHeight":1000}'
                        class="predef-q"
                        :items="queryItems"
                        v-model="selectedQuery"
                        label="Chose a predefined query"
                        @input="afterQuerySelection"
                        single-line
              ></v-select>
            </v-flex> <!--predefined queries-->

          </v-layout>
        </v-container>
        <v-container fluid grid-list-xl style="background:#FFFFFF">
          <v-layout wrap align-center test style="background:#FFFFFF">
            <v-flex xs12 justify-center>
              <div v-if="sars_info" style="font-size: 1.3em;color: blue;justify-content: center;">Novel <strong>Severe
                acute respiratory syndrome coronavirus 2</strong> sequences are preselected.
                If you are interested in other virus(es), please change it from the dropdown menu below:
              </div>
            </v-flex>
            <v-flex xs12 class="no-horizontal-padding">
              <!--<div id="query" class="selected-query">-->
              <span class="label">
                                Metadata search
                            </span>
              <span style="font-family:monospace; font-size:120%;">
                                {{ queryToShow }}
                            </span>
            </v-flex>
          </v-layout>
          <MetadataDropDownList/>
        </v-container>

        <FullScreenViewer/>
        <PairQuery/>
        <div class="result-div">
          <v-tabs dark color="blue darken-1" v-model="selectedTab">
            <v-tab>
              Result sequences
            </v-tab>
            <v-tab-item>
              <MetadataTable/>
            </v-tab-item>
          </v-tabs>
        </div>

        <v-footer app>
          <v-flex
              lighten-2
              xs6
              class="bottom-info"
              style="font-size:12px;">
            <!--                        <div>GISAID data provided on this website is subject to GISAID’s <a-->
            <!--                                href="https://www.gisaid.org/registration/terms-of-use/" target="_blank">Terms-->
            <!--                            and Conditions</a>.-->
            <!--                        </div>-->
            <div>Our manuscript on ViruSurf has been published on Nucleic Acids Research. <a
                href="https://doi.org/10.1093/nar/gkaa846" target="_blank">Check it out!</a>.
            </div>
          </v-flex>
          <v-flex
              lighten-2
              text-xs-right
              xs6
              class="bottom-info">


            <div v-if="count === null" style="font-size:1.4em;">Loading...</div>
            <div style="font-size:1.4em;" v-else-if="count>0">{{ count }} sequence<span
                v-if="count>1">s</span> found
            </div>
            <div v-else>No result</div>

          </v-flex>
        </v-footer>

      </v-content>
    </v-content>

    <v-snackbar multi-line dark color="#009688" v-model="snackbar"  bottom :timeout="120000">
      <v-flex>
<!--      <strong>News:</strong><br>-->
        Did you use our new tool <strong>VirusViz</strong>?
      Try visualize your result in VirusViz by using button in the "Result section".
      </v-flex>
      <v-btn
          flat
          @click="snackbar = false"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </v-snackbar>

  </v-app>
</template>

<script>
import MetadataDropDownList from "./MetadataDropDownList";
import MetadataTable from "./MetadataTable";
import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
import FullScreenViewer from "./FullScreenViewer";
import CountTable from "./CountTable";
import TextReader from "./TextReader"
import PairQuery from "./PairQuery"
import examples from "../examples.json"

export default {
  name: 'AppMain',
  components: {
    FullScreenViewer,
    MetadataTable,
    MetadataDropDownList,
    CountTable,
    TextReader,
    PairQuery,
  },
  data() {
    return {
      sars_info: true,
      snackbar: true,
      infoBar: true,
      inputValid: true,
      inputQuery: "",
      dialogShowQuery: false,
      mainContent: true,
      selectedQuery: null,
      queryItems: examples,
      selectedTab: 0,
      queryString:
          '',
      infoDialog:
          false,
      fields:
          [],
      lastUpdate:
          null
    }
  }
  ,
  mounted() {
    const url = `field`;

    window.addEventListener('beforeunload', null)


    this.fields = [];

    // eslint-disable-next-line
    axios.get(url)
        .then((res) => {
          return res.data
        })
        .then((res) => {
          for (let i in res.fields) {
            this.fields.push(res.fields[i].name)
          }
        });

    const url_info = `db_info`;
    // eslint-disable-next-line
    axios.get(url_info)
        .then((res) => {
          return res.data
        })
        .then((res) => {
          this.lastUpdate = res.sources.map(x => x.update_date).sort().reverse()[0];
        });
  }
  ,
  methods: {
    ...
        mapMutations(['setQuery', 'setType', 'resetType', 'setQueryGraph', "resetKv", "resetQuery", 'resetPanelActive', 'setExampleQueryLoaded']),
    ...
        mapActions(["setKv", "setKvFull", "deleteAge"]),
    setInputQuery() {
      this.queryString = this.inputQuery
      this.dialogShowQuery = false
    }
    ,
    getFieldTitle(field) {
      return `${field.name} (${field.group})`
    }
    ,
    openInfoDialog() {
      this.infoDialog = true;
    }
    ,
    afterQuerySelection(item) {
      this.resetPanelActive();
      this.setExampleQueryLoaded();
      // console.log(item);
      if (item) {
        this.setQuery(item.query.gcm);
        this.setKvFull(item.query.kv);
        this.setType(item.query.type)
      } else {
        this.resetQuery();
        this.resetType();
        this.resetKv();
      }
      this.$nextTick(() => {
        this.selectedQuery = null
      })
    }
    ,
    downloadQuery() {
      var text = JSON.stringify(this.compound_query);
      // console.log(text);
      var filename = "query.txt";
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    ,
    toClipboard() {
      this.$copyText(JSON.stringify(this.compound_query)).then(function (e) {
        alert('Copied');
        // console.log(e);
      }, function (e) {
        alert('Can not copy');
        // console.log(e);
      })
    }
    ,
    validateJson(input) {
      var a = null;
      try {
        a = JSON.parse(input);
      } catch (e) {
        return false;
      }
      let keys = Object.keys(a);
      //check if all three major query elements are present
      let allKeys = (keys.includes("gcm") && keys.includes("type") && keys.includes("kv"));

      if (!allKeys) {
        return false;
      }

      //check if type is correct value
      let type = a['type'];
      let typeCorrect = (type === 'original' || type === 'synonym' || type === 'expanded')

      //check if a field in gcm query element is valid
      let b = Object.keys(a['gcm']);
      let allFields = this.arrayContainsArray(this.fields, b);


      return allKeys && allFields && typeCorrect
    }
    ,
    arrayContainsArray(superset, subset) {
      return subset.every(function (value) {
        return (superset.indexOf(value) >= 0);
      });
    }
  }
  ,
  watch: {
    queryString() {
      if (this.queryString !== '') {
        const json = JSON.parse(this.queryString);
        this.setQuery(json['gcm']);
        this.setType(json['type']);
        this.resetKv();
        this.setKvFull(json['kv']);
        this.queryString = ''
      }
    }
    ,
    inputQuery() {
      this.inputValid = this.validateJson(this.inputQuery)
    }
  }
  ,
  computed: {
    ...
        mapState(['query', 'synonym', 'count', 'type', "panelActive", 'numerical']),
    ...
        mapGetters({
          compound_query: 'build_query',

        }),
    queryInput:
        {
          get() {
            return JSON.stringify(this.compound_query)
          }
          ,
          set(value) {
            this.inputQuery = value
          }
        }
    ,
    searchDisabled() {
      return this.panelActive.length !== 0
    }
    ,

    queryToShow() {
      let inner_list = [];
      Object.keys(this.compound_query['gcm']).forEach(key => {
        const value2 = [];
        const value = this.compound_query['gcm'][key];
        if (Array.isArray(value)) {
          value.forEach(val => {
            if (val === null)
              value2.push("N/D");
            else
              value2.push(val);
          });
          inner_list.push(key + ': ' + JSON.stringify(value2));
        } else {
          inner_list.push(key + ': ' + JSON.stringify(value));
        }


      });
      return inner_list.join(", ");
    }
    ,
    typeLocal: {
      get() {
        return this.type;
      }
      ,
      set(value) {
        if (value) {
          this.setType(value)
        } else {
          this.resetType();
        }
      }
    }
    ,
    isDev() {
      return process.env.NODE_ENV === 'development';
    }
    ,

  }
  ,
}
</script>
<style>
.no-horizontal-padding {
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.main-content {
  padding-top: 10px !important;
  padding-bottom: 0 !important;

}

.result-div {
  margin-bottom: 1.5em;
  max-width: 100%;
}

.fab-container {
  position: absolute;
  /*top: 64px;*/
  right: 20px;
  z-index: 1;
}

.label {
  font-size: 1.3em;
  font-weight: bold;
  padding: 12px;
}

.radio-group .v-input__icon--append .v-icon {
  color: #2196F3;
  font-size: 15px;
}

.bottom-info {
  margin: 1.5em;
}

.v-input__append-outer {
  margin-left: -1.9em;
  margin-top: -0.7em !important;
  z-index: 1;
}

.selected-query {
  padding-top: 15px;
}

.predef-q .v-input__control .v-text-field__details {
  display: none;
}

.small-btn {


}

.mytextarea {
  padding: 16px;
}


</style>
