<template>
    <v-container fluid class="second-color">
        <v-layout>
            <v-flex xs2 d-flex class="no-horizontal-padding">
                <span class=label>Variants search</span>
            </v-flex>
            <v-flex xs3 d-flex class="no-horizontal-padding">
                <v-btn @click='setKey("aa")'
                       color="info"
                       :disabled="searchDisabled">Add condition on amino acids</v-btn>

            </v-flex>
            <v-flex xs3 d-flex class="no-horizontal-padding">
                <v-btn @click='setKey("nuc")'
                       color="info"
                       :disabled="searchDisabled">Add condition on nucleotides</v-btn>

            </v-flex>
        </v-layout>
        <v-expansion-panel>
            <KvExpansionPanel v-for="item in keys" :query_text="item['query_text']"
                              :query_type="item['query_type']" :id="item['id']" :key="item['id']" :exact_match="item['exact']"
                              :query="kvLocal[item['query_text']+'_'+item['id']]"
                              class="second-color"></KvExpansionPanel>
        </v-expansion-panel>
    </v-container>
</template>

<script>
    import {mapState, mapMutations, mapGetters} from 'vuex';

    import KvExpansionPanel from "./KvExpansionPanel"

    export default {
        name: "PairQuery",
        components: {KvExpansionPanel},
        data() {
            return {
                search: "",
                infoDialog: false,
                key: "",
                pairQueryType: "key",
                kvLocal: {},
                exact_match: false,
            }
        },
        methods: {
            ...mapMutations(["pushKey", "setSearch", "resetPanelActive"]),
            openInfoDialog() {
                this.infoDialog = true
            },
            setKey(inp){
                this.search = inp;
                if (this.search !== '') {
                    this.key = this.search.toLowerCase().replace(" ", "%20");
                    let last = this.keys[this.keys.length - 1];
                    let i;
                    if (last !== undefined) {
                        i = last['id'] + 1
                    } else {
                        i = 0;
                    }
                    let a = {
                        'id': i,
                        'query_text': this.key,
                        'query_type': inp,
                        'exact': this.exact_match
                    };
                    // window.alert(this.key + "_" + this.pairQueryType + this.exact_match+i);
                    this.pushKey(a);
                    this.search = ''
                    this.exact_match = false
                    this.pairQueryType = 'key'
                } else {
                    window.alert("Please input a search keyword")
                }
            },
        },
        computed: {
            ...mapGetters({
                compound_query: 'build_query',
                keysEmpty: "keysEmpty"
            }),
            ...mapState({
                keys: 'keys',
                panelActive: "panelActive",
            }),
            searchDisabled() {
                return this.panelActive.length !== 0
            },
        },
        watch: {
            compound_query() {
                let kv = this.compound_query['kv'];
                this.kvLocal = kv;
                for (let i in kv) {
                    let a = kv[i];
                    let query_text = i.substring(0, i.lastIndexOf("_"));
                    let id = parseInt(i.substring(i.lastIndexOf("_") + 1));
                    let obj = {id: id, query_text: query_text, query_type: a['type_query'], exact: a['exact']};
                    let filtered = this.keys.filter(function (value) {
                        return value.id === obj.id
                    });
                    if (filtered.length===0)
                        this.pushKey(obj);
                }
                // this.setSearch(false)
            },
            keysEmpty() {
                if (this.keysEmpty)
                    this.resetPanelActive()
            },
        }
    }
</script>

<style>
    .radio-group2 .v-input__icon--append .v-icon {
        color: #2196F3;
        font-size: 15px;
    }

    .radio-group2 .v-input__append-outer {
        margin-left: -0.5em;
        margin-top: -0.7em !important;
        z-index: 1;
    }

    .info-icon {
        font-size: 15px
    }

    .info-button {
        width: 10px
    }
    .second-color{
        background:#f1f3f4!important;

    }
    .second-color .v-datatable{
        background:#f1f3f4!important;
    }
    .second-color .v-datatable .v-datatable__actions{
        background:#f1f3f4!important;
    }
</style>
