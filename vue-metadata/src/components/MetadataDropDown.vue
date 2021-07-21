<template>
    <v-autocomplete
            :loading="isLoading"
            v-model="selected"
            :items="values"
            :item-text="rename"
            item-value="value"
            :label="labelTitle"
            :multiple="is_gcm"
            :disabled="searchDisabled ||  (disableSelectorEpitopePart && !appliedActuaQuery)"
    >
        <template slot="item" slot-scope="data">
            <span class="item-value-span"> {{ rename(data.item)}}</span>
            <span class="item-count-span">{{data.item.count}}</span>
        </template>
    </v-autocomplete>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
    import {FULL_TEXT, LOADING_TEXT, poll, stopPoll} from '../utils.js'


    export default {
        name: "MetadataDropDown",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
            is_gcm: {type: Boolean, default: true},
            value: {},
        },
        data() {
            return {
                ageDialog: false,
                isLoading: true,
                values: [],//the list of values of the drop-down menu
                my_interval_data: null,
            }
        },
        watch: {
            synonym() {
                this.loadData();
            },
            compound_query() {
                // if(!this.synonym)
                this.loadData();
            }
        },
        computed: {
            ...mapState([
                'query', 'synonym', "panelActive", 'disableSelectorEpitopePart', 'appliedActuaQuery'
            ]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            selected: {
                get() {
                    // console.log("GET" + this.fullQuery[this.field]);
                    if (this.is_gcm)
                        return this.query[this.field];
                    else
                        return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                    // console.log("SET" + value);
                    if (this.is_gcm)
                        this.setDropDownSelected({field: this.field, list: value});
                }
            },
            searchDisabled() {
                return this.panelActive.length !== 0 || this.isLoading;
            },
        },
        methods: {
            ...mapActions([
                'setDropDownSelected',
            ]),
            nthIndex(str, pat, n) {
                var L = str.length, i = -1;
                while (n-- && i++ < L) {
                    i = str.indexOf(pat, i);
                    if (i < 0) break;
                }
                return i;
            },
            //for the alternative solution
            // getValue() {
            //     console.log("GET" + this.fullQuery[this.field]);
            //
            //     return this.fullQuery[this.field];
            // },
            // changedValue(value) {
            //     console.log("SET" + value);
            //     this.setDropDownSelected({field: this.field, list: value})
            //     // this.$store.dispatch('setDropDownSelected', {field: this.field, list: ['TCGA']});
            // },
            rename(inp) {
                let value;
                if (inp.value !== null && inp.value !== undefined) {
                    if (this.field === 'dataset_name' && inp.value.length > 20) {
                        let i = this.nthIndex(inp.value, "_", 3);
                        value = inp.value.slice(0, i + 1) + "\n" + inp.value.slice(i + 1);
                    } else {
                        value = inp.value;
                    }
                } else
                    value = 'N/D(not defined)';

                let res;
                if (inp.count)
                    res = `${value}`;
                else
                    res = value;
                return res;
            },
            loadData() {
                if(this.my_interval_data !== null){
                  stopPoll(this.my_interval_data);
                }

                const url = `field/${this.field}`;
                this.isLoading = true;
                this.values = [{value: LOADING_TEXT}];


                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        // console.log(res.result)
                        // console.log(this.field, res.result)
                        this.my_interval_data = poll(res.result,(res)=>{
                          this.my_interval_data = null;
                          // console.log(this.field)
                          let vals = res.values
                          // console.log(res);
                          //to clean previously selected values
                          if (this.selected && Array.isArray(this.selected)) {
                              // console.log("this.selected: ", this.selected);
                              let zero_elements = this.selected
                                  .filter(value => !res.values.map(v => v.value).includes(value))
                                  .sort().map(v => Object({
                                      value: v,
                                      count: 0
                                  }));
                              // console.log(zero_elements);
                              vals = vals.concat(zero_elements);
                          }
                          if (!this.is_gcm) {
                              vals = vals.map(el => el.value).filter(el => el).sort()
                              vals.unshift(FULL_TEXT)
                              if (!vals.includes(this.selected)) {
                                  this.selected = FULL_TEXT;
                              }
                              vals = vals.map(val => Object({
                                  value: val
                              }));

                          }

                          // console.log(vals);
                          this.values = vals;
                          this.isLoading = false;
                        })



                    });

                // console.log(this.selected.get().filter(v => this.values.indexOf(v) > -1));
//
                // this.selected.set(this.selected.get().filter(v => this.values.indexOf(v) > -1));
            }
            ,
        },
        created() {
            this.loadData();
        }
    }
</script>

<style scoped>
    .item-value-span {
        padding-right: 3.5em;
    }

    .item-count-span {
        /*float:right;*/
        position: absolute;
        right: 0.5em;
    }

</style>
