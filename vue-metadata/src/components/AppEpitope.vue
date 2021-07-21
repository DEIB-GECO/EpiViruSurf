<template>
    <div>
        <v-toolbar dark color="rgb(201, 53, 53) " app>
            <v-img :src="require('../assets/virusurf_logo.png')" contain max-width="39px" max-height="39px"></v-img>
            <v-btn flat @click="mainContent=true">
                <v-toolbar-title class="headline" style="font-size: 32px;text-transform: none !important;">
                    <span>Epi</span>
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
              <v-btn flat href="http://geco.deib.polimi.it/episurf_gisaid/" target="_blank">
                  <span class="mr-2">EpiSurf GISAID</span>
              </v-btn>
              <v-btn flat href="http://geco.deib.polimi.it/virusurf/" target="_blank">
                  <span class="mr-2">ViruSurf</span>
              </v-btn>
              <v-btn flat href="http://geco.deib.polimi.it/virusurf_gisaid/" target="_blank">
                  <span class="mr-2">ViruSurf GISAID</span>
              </v-btn>
              <v-btn flat href="http://geco.deib.polimi.it/genosurf/" target="_blank">
                  <span class="mr-2">GenoSurf</span>
              </v-btn>
              <v-btn flat href="https://github.com/DEIB-GECO/EpiSurf/wiki" target="_blank">
                  <span class="mr-2">Wiki</span>
              </v-btn>
              <!--          <v-btn flat href="/virusurf/repo_static/acknowledgements.html" target="_blank">
                            <span class="mr-2">Acknowledgements</span>
                        </v-btn>
                        <v-btn flat href="/virusurf/repo_static/contact.html" target="_blank">
                            <span class="mr-2">Contacts</span>
                        </v-btn>-->
              <v-btn flat href="/virusurf/repo_static/about_episurf.html" target="_blank">
                  <span class="mr-2">About</span>
              </v-btn>
            </v-toolbar-items>
            <v-menu class="hidden-lg-and-up">
              <v-toolbar-side-icon slot="activator"></v-toolbar-side-icon>
              <v-list-tile style="background-color: white">
                  <v-list-tile-content>
                    <v-btn flat href="http://geco.deib.polimi.it/episurf_gisaid/" target="_blank">
                        <span class="mr-2">EpiSurf GISAID</span>
                    </v-btn>
                  </v-list-tile-content>
              </v-list-tile>
              <v-list-tile style="background-color: white">
                  <v-list-tile-content>
                    <v-btn flat href="http://geco.deib.polimi.it/virusurf/" target="_blank">
                        <span class="mr-2">ViruSurf</span>
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
                    <v-btn flat href="https://github.com/DEIB-GECO/EpiSurf/wiki" target="_blank">
                        <span class="mr-2">Wiki</span>
                    </v-btn>
                  </v-list-tile-content>
              </v-list-tile>
              <v-list-tile style="background-color: white">
                  <v-list-tile-content>
                    <v-btn flat href="/virusurf/repo_static/about_episurf.html" target="_blank">
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
                            <v-btn color='rgb(122, 139, 157)' style="color: white" @click="afterQuerySelection()">Clear
                                your query
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
                            <div style="font-size: 1.3em;color: rgb(62, 60, 122);justify-content: center;">Novel
                                <strong>"Severe
                                    acute respiratory syndrome coronavirus 2"</strong> sequences from <strong>"Homo
                                    sapiens"</strong>
                                as host are preselected.
                                If you are interested in other virus(es), please change it from the dropdown menu below:
                            </div>
                        </v-flex>
                        <v-flex xs12 class="no-horizontal-padding">
                            <!--<div id="query" class="selected-query">-->
                            <span class="label">
                                Sequence population search condition:
                            </span>
                            <span style="font-family:monospace; font-size:120%;">
                                {{ queryToShow }}
                            </span>
                        </v-flex>
                    </v-layout>
                    <MetadataDropDownList/>
                </v-container>

                <!--<FullScreenViewer/>
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
                </div>-->

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


                        <div v-if="countSeq2 === null && countEpiToShow=== null" style="font-size:1.4em;">Loading...</div>
                        <div style="font-size:1.4em;" v-else-if="countSeq2>=0 || countEpiToShow>=0">
                            <span v-if="countSeq2>=0">{{ countSeq2 }}</span>
                            <span v-if="countSeq2 === null"> ...</span>
                            <span> sequence</span>
                            <span
                                    v-if="countSeq2>1">s</span><span> and </span>
                            <span v-if="countEpiToShow>=0">{{ countEpiToShow }}</span>
                             <span v-if="countEpiToShow === null"> ...</span>
                            <span> epitope</span>
                            <span
                                v-if="countEpiToShow>1">s</span> found
                        </div>
                        <div v-else>No result</div>

                    </v-flex>
                </v-footer>

            </v-content>
        </v-content>

        <v-snackbar multi-line dark color="rgb(79, 131, 164)" v-model="snackbar" bottom :timeout="120000">
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

        <v-content style="padding-top: 10px !important;">
            <Epitope></Epitope>
        </v-content>
    </div>
</template>

<script>
    import MetadataDropDownList from "./MetadataDropDownList";
    import MetadataTable from "./MetadataTable";
    import {mapMutations, mapState, mapActions, mapGetters} from 'vuex'
    import FullScreenViewer from "./FullScreenViewer";
    import CountTable from "./CountTable";
    import TextReader from "./TextReader"
    import PairQuery from "./PairQuery"
    import Epitope from "./Epitope";
    import axios from "axios";

    export default {
        name: 'AppEpitope',
        components: {
            Epitope,
            FullScreenViewer,
            MetadataTable,
            MetadataDropDownList,
            CountTable,
            TextReader,
            PairQuery,
        },
        data() {
            return {
                snackbar: true,
                infoBar: true,
                inputValid: true,
                inputQuery: "",
                dialogShowQuery: false,
                mainContent: true,
                selectedQuery: null,
                epitopeToAdd: null,
                is_control: false,
                finish_count_seq: false,
                finish_count_var: false,
                finish_count_population: false,
                countPopulationEpi: null,
                precision_float_table: 5,
                isGisaid: false,
                queryItems: [
                     {
                        text: 'Italy sequences on B cell, linear, Nucleocapsid 153-170 epitopes',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["italy"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            epi_query: {
                                epitope_meta: {
                                    "product": ["Spike (surface glycoprotein)"],
                                    "cell_type": ["B cell"],
                                    "is_linear": [true],
                                    "startExt": [153],
                                    "stopExt": [170],
                                }
                            }
                        }
                    },
                                        {
                        text: 'Florida sequences on T cell, RBD, HLA-A*02:01 epitopes',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["florida"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            epi_query: {
                                epitope_meta: {
                                    "product": ["Spike (surface glycoprotein)"],
                                    "cell_type": ["T cell"],
                                    "mhc_allele": ["HLA-A*02:01"],
                                    "startExt": [331],
                                    "stopExt": [524],
                                }
                            }
                        }
                    },
                    {
                        text: 'Florida sequences on T cell, RBD, HLA-A*02:01 epitopes, high resp. freq.',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["florida"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            epi_query: {
                                epitope_meta: {
                                    "product": ["Spike (surface glycoprotein)"],
                                    "cell_type": ["T cell"],
                                    "mhc_allele": ["HLA-A*02:01"],
                                    "startExt": [331],
                                    "stopExt": [524],
                                    "startFreqExt": [0.20],
                                    "stopFreqExt": [1]
                                },
                            }
                        }
                    },
                    {
                        text: 'Florida sequences on T cell, RBD, HLA-A*02:01 epitopes, high resp. freq., K417N change',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["florida"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            epi_query: {
                                epitope_meta: {
                                    "product": ["Spike (surface glycoprotein)"],
                                    "cell_type": ["T cell"],
                                    "mhc_allele": ["HLA-A*02:01"],
                                    "startExt": [331],
                                    "stopExt": [524],
                                    "startFreqExt": [0.20],
                                    "stopFreqExt": [1]
                                },
                                variant_meta: {
                                    "variant_aa_type": ["SUB"],
                                    "sequence_aa_original": ["K"],
                                    "sequence_aa_alternative": ["N"],
                                    "startExtVariant": [417],
                                    "stopExtVariant": [417],
                                }
                            }
                        }
                    },
                    {
                        text: 'Texas sequences on epitopes  including Spike 677 position, statistics on Q677P',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["texas"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            epi_query: {
                                epitope_meta: {
                                    "product": ["Spike (surface glycoprotein)"],
                                    "startExt": [677],
                                    "stopExt": [677],
                                },
                                variant_meta: {
                                    "variant_aa_type": ["SUB"],
                                    "sequence_aa_original": ["Q"],
                                    "sequence_aa_alternative": ["P"],
                                    "startExtVariant": [677],
                                    "stopExtVariant": [677],
                                }
                            }
                        }
                    },
                    {
                        text: 'Custom Epitope: S14P5-USA',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S14P5-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[553, 570]],
                                }
                            }
                        }
                    },
                    {
                        text: 'Custom Epitope: S20P2-USA',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S20P2-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[769, 786]],
                                }
                            }
                        }
                    },
                    {
                        text: 'Custom Epitope: S21P2-USA',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S21P2-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[809, 826]],
                                }
                            }
                        }
                    },
                                        {
                        text: 'Custom Epitope: N45P5-USA',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "N45P5-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[153, 170]],
                                }
                            }
                        }
                    },
                                        {
                        text: 'Custom Epitope: S14P5-USA-FL',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["florida"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S14P5-USA-FL",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[553, 570]],
                                }
                            }
                        }
                    },
                                        {
                        text: 'Custom Epitope: S14P5-USA-MN',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["minnesota"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S14P5-USA-MN",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[553, 570]],
                                }
                            }
                        }
                    },
                    {
                        text: 'Custom Epitope: S14P5-USA-MI',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                    "region": ["michigan"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "S14P5-USA-MI",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[553, 570]],
                                }
                            }
                        }
                    },
                                        {
                        text: 'Custom Epitope: N45P5-USA_A156S',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "N45P5-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[153, 170]],
                                },
                                custom_variant_meta: {
                                    "product": ["spike (surface glycoprotein)"],
                                    "sequence_aa_original": ["a"],
                                    "sequence_aa_alternative": ["s"],
                                    "start_aa_original": {
                                        "max_val": 156,
                                        "min_val": 156,
                                    }
                                }
                            },
                        }
                    },
                                        {
                        text: 'Custom Epitope: N45P5-USA_L161F',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "N45P5-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[153, 170]],
                                },
                                custom_variant_meta: {
                                    "product": ["spike (surface glycoprotein)"],
                                    "sequence_aa_original": ["l"],
                                    "sequence_aa_alternative": ["f"],
                                    "start_aa_original": {
                                        "max_val": 161,
                                        "min_val": 161,
                                    }
                                }
                            },
                        }
                    },
                                        {
                        text: 'Custom Epitope: N45P5-USA_P168S',
                        value: {
                            query: {
                                "gcm": {
                                    "taxon_name": ["severe acute respiratory syndrome coronavirus 2"],
                                    "host_taxon_name": ["homo sapiens"],
                                    "country": ["usa"],
                                },
                                "type": "original",
                                "kv": {}
                            },
                            custom_epi_query: {
                                custom_epitope_meta: {
                                    "epitope_name": "N45P5-USA",
                                    "taxon_name": "severe acute respiratory syndrome coronavirus 2",
                                    "host_taxon_name": "homo sapiens",
                                    "product": "spike (surface glycoprotein)",
                                    "position_range": [[153, 170]],
                                },
                              custom_variant_meta: {
                                    "product": ["spike (surface glycoprotein)"],
                                    "sequence_aa_original": ["p"],
                                    "sequence_aa_alternative": ["s"],
                                    "start_aa_original": {
                                        "max_val": 168,
                                        "min_val": 168,
                                    }
                                }
                            },
                        }
                    }





                ],
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
        },
        created() {
            if(/gisaid/.test(window.location.href)){
              this.isGisaid = true;
            }
            else{
              this.isGisaid = false;
            }
            document.title = 'EpiSurf'
            this.setQueryStartEpi();
            this.setTrueIsEpitopeSurf();
        },
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
                mapMutations(['setQuery', 'setType', 'resetType', 'setQueryGraph', "resetKv",
                    "resetQuery", 'resetPanelActive', 'setExampleQueryLoaded', 'setQueryStartEpi',
                    'setTrueIsEpitopeSurf', 'setEpiQuery', 'resetEpiQuery', 'setTrueShowAminoacidVariantEpi',
                    'setTrueDisableSelectorEpitopePart', 'setAminoacidConditionQuery', 'resetAminoacidConditionQuery',
                    'setNewSingleEpitopeQuery', "resetNewSingleEpitopeQuery", 'setTrueDisableSelectorUserNewEpitopePart',
                    'setTrueDisableSelectorEpitopePart', 'setTrueShowAminoacidVariantUserNewEpi',
                    'setNewSingleAminoacidConditionUserQuery', 'resetNewSingleAminoacidConditionUserQuery',
                    'resetEpitopeAminoacidConditionsArrayUserNew', 'setTrueExampleCustomEpitope',
                'setSelectedTabEpitopeToEpitopeVariants', 'setSelectedTabEpitopeToCustom', 'setTrueNewEpitopeLoading',
                'setFalseNewEpitopeLoading', 'addNewEpitopeToList', 'setTrueFromPredefinedQuery', 'setFalseFromPredefinedQuery']),
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
            afterQuerySelection(item2) {
              let item = undefined;
              if(item2 !== null && item2 !== undefined) {
                item = JSON.parse(JSON.stringify(item2));
              }
                this.resetPanelActive();
                this.setExampleQueryLoaded();
                // console.log(item);
                if (item) {
                    this.setQuery(item.query.gcm);
                    this.setKvFull(item.query.kv);
                    this.setType(item.query.type);

                    if (item.epi_query) {
                      this.setTrueFromPredefinedQuery();
                      this.setSelectedTabEpitopeToEpitopeVariants();
                        let total_epitope_meta = {};

                        Object.assign(total_epitope_meta, item.epi_query.epitope_meta, item.epi_query.variant_meta);
                        this.setEpiQuery(total_epitope_meta);
                        if (item.epi_query.variant_meta) {
                            this.resetAminoacidConditionQuery();
                            this.setTrueShowAminoacidVariantEpi();
                            this.setTrueDisableSelectorEpitopePart();
                            this.setAminoacidConditionQuery(item.epi_query.variant_meta);
                        }
                    }

                    if (item.custom_epi_query) {
                      this.setTrueFromPredefinedQuery();
                      this.addCustomEpitope(item.custom_epi_query, item.query);
                      this.setSelectedTabEpitopeToCustom();
                        /*this.setTrueExampleCustomEpitope();
                        this.resetEpitopeAminoacidConditionsArrayUserNew();
                        this.setNewSingleEpitopeQuery(item.custom_epi_query.custom_epitope_meta);
                        if (item.custom_epi_query.custom_variant_meta) {
                            this.resetNewSingleAminoacidConditionUserQuery();
                            this.setTrueDisableSelectorEpitopePart();
                            this.setTrueShowAminoacidVariantUserNewEpi();
                            this.setTrueDisableSelectorUserNewEpitopePart();
                            this.setNewSingleAminoacidConditionUserQuery(item.custom_epi_query.custom_variant_meta);
                        }*/
                    }

                } else {
                    this.resetQuery();
                    this.resetType();
                    this.resetKv();
                    this.resetEpiQuery();
                    this.resetNewSingleEpitopeQuery();
                    this.resetAminoacidConditionQuery();
                    this.resetNewSingleAminoacidConditionUserQuery();
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
            ,
            addCustomEpitope(item, compound_query){
              this.setFalseFromPredefinedQuery();
              let item_custom_epi_meta;
              let item_custom_var_meta;
              if(item.custom_epitope_meta){
                item_custom_epi_meta = item.custom_epitope_meta;
                item_custom_epi_meta = this.controlExistingName(item_custom_epi_meta);
              }
              if(item.custom_variant_meta) {
                item_custom_var_meta = item.custom_variant_meta;
              }

             let val = JSON.parse(JSON.stringify(item_custom_epi_meta));
              val['all_information'] = {};
             let all_info = val['all_information'] ;
             all_info['compound_query'] = JSON.parse(JSON.stringify(compound_query));
             all_info['epitope_info'] = JSON.parse(JSON.stringify(item_custom_epi_meta));

             if(item_custom_var_meta !== undefined && item_custom_var_meta !== null) {
               all_info['amino_acid_info'] = JSON.parse(JSON.stringify(item_custom_var_meta));
             }


             val['compound_query'] = JSON.parse(JSON.stringify(compound_query));

             val['compound_query']['kv'] = this.addKvPart(val, item_custom_var_meta);

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
             val['creation_date']  =  date1;
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
             this.countPopulation(val);

            },
            controlExistingName(epitope) {
              if (this.epitopeAdded.some(item => item.epitope_name === epitope.epitope_name)) {
                let i = 1;
                while (i) {
                  let name = epitope.epitope_name + ' (' + i + ')';
                  if (!this.epitopeAdded.some(item => item.epitope_name === name)) {
                    epitope.epitope_name = name;
                    return epitope;
                  } else {
                    i++;
                  }
                }
              } else {
                return epitope;
              }
            }
            ,
            addKvPart(val, var_meta){
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


               let array = [];
               if(var_meta !== undefined && var_meta !== null) {
                 array.push(var_meta);

                 let copy = JSON.parse(JSON.stringify(array));
                 let length = copy.length;
                 let j = 0;
                 while (j < length) {
                   let single = copy[j];
                   j++;
                   let name = 'aa_' + j;
                   kv[name] = {};
                   kv[name]['type_query'] = 'aa';
                   kv[name]['exact'] = false;
                   if (single.length === undefined || single.length === null) {
                     kv[name]['query'] = [single];
                   } else {
                     kv[name]['query'] = single;
                   }
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
                  });
              },
          countNumVar(val){
               let to_send = val['compound_query'];
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
                    });
          },
          countPopulation(val){
             let to_send = JSON.parse(JSON.stringify(val['compound_query']));
             to_send['kv'] = {};
            this.finish_count_population = false;
            this.setTrueNewEpitopeLoading();

            let count_url = `query/count?is_control=${this.is_control}`;

            axios.post(count_url, to_send)
                .then((res) => {
                    return res.data;
                })
                .then((res) => {
                    this.countPopulationEpi = res;
                    this.finish_count_population = true;
                });
          },
          addFrequencies() {
            if (this.epitopeToAdd['num_var'] === 'N/D') {
              this.epitopeToAdd['mutated_freq'] = 'N/D';
              this.epitopeToAdd['mutated_seq_ratio'] = 'N/D';
              this.epitopeToAdd['total_num_of_seq_metadata'] = this.countSeq2;
            } else {
              if (this.epitopeToAdd['num_seq'] === 0) {
                this.epitopeToAdd['mutated_freq'] = 0;
              } else {
                this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['num_var'] / this.epitopeToAdd['num_seq'];
              }
              this.epitopeToAdd['mutated_freq'] = this.epitopeToAdd['mutated_freq'].toPrecision(this.precision_float_table);
              this.epitopeToAdd['mutated_seq_ratio'] = (this.epitopeToAdd['num_seq'] / this.countPopulationEpi) * 100;
              if (this.epitopeToAdd['mutated_seq_ratio'] >= 10) {
                this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table + 1);
              } else {
                this.epitopeToAdd['mutated_seq_ratio'] = this.epitopeToAdd['mutated_seq_ratio'].toPrecision(this.precision_float_table);
              }
              this.epitopeToAdd['mutated_seq_ratio'] = parseFloat(this.epitopeToAdd['mutated_seq_ratio']).toFixed(this.precision_float_table);
              //this.epitopeToAdd['mutated_seq_ratio'] += ' %';
              this.epitopeToAdd['total_num_of_seq_metadata'] = this.countPopulationEpi;
            }
          },
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
            },
            finish_count_seq(){
                if(this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population === true){

                  this.addFrequencies();
                  this.addNewEpitopeToList(this.epitopeToAdd);
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
                  this.epitopeToAdd = null;
                }
              },
            finish_count_var() {
              if (this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population === true) {

                this.addFrequencies();
                this.addNewEpitopeToList(this.epitopeToAdd);
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
                this.epitopeToAdd = null;
              }
            },
            finish_count_population() {
              if (this.finish_count_seq === true && this.finish_count_var === true && this.finish_count_population === true) {
                if(this.epitopeToAdd !== null){
                this.addFrequencies();
                this.addNewEpitopeToList(this.epitopeToAdd);
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
                this.epitopeToAdd = null;
                }
              }
            },
        }
        ,
        computed: {
            ...
                mapState(['query', 'synonym', 'count', 'type', "panelActive", 'numerical', 'countSeq', "countEpi",
                    'countSeq2', 'countSeq3', 'countSeq4', 'exampleCustomEpitope', 'epitopeAdded', 'countEpiToShow'
                , 'disableSelectorEpitopePart', 'fromPredefinedQuery']),
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
