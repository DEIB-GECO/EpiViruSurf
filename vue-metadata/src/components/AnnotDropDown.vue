<template>
    <v-autocomplete
            :loading="isLoading"
            v-model="selected"
            :items="values"
            :item-text="rename"
            item-value="value"
            :label="labelTitle"
            multiple
    >
        <template slot="item" slot-scope="data">
            <span class="item-value-span"> {{ rename(data.item)}}</span>
            <span class="item-count-span">{{data.item.count}}</span>
        </template>
    </v-autocomplete>

</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
        import {poll, stopPoll} from '../utils.js'


    export default {
        name: "AnnotDropDown",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
            value: {},
            groupCondition: {},
        },
        data() {
            return {
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
            },
            groupCondition(){
                this.loadData();
            },
        },
        computed: {
            ...mapState([
                'query', 'synonym', "panelActive"
            ]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            selected: {
                get() {
                    // console.log("GET" + this.fullQuery[this.field]);
                    return this.query[this.field];
                },
                set(value) {
                    // console.log("SET" + value);
                    // this.setDropDownSelected({field: this.field, list: value});
                    this.$emit('input', value)
                }
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },
        },
        methods: {
            ...mapActions([]),
            nthIndex(str, pat, n) {
                var L = str.length, i = -1;
                while (n-- && i++ < L) {
                    i = str.indexOf(pat, i);
                    if (i < 0) break;
                }
                return i;
            },
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
            }
            ,
            loadData() {

                if(this.my_interval_data !== null){
                  stopPoll(this.my_interval_data);
                }

                let queryToRun = Object.assign({}, this.compound_query);
                queryToRun['panel'] = this.groupCondition;

                const url = `field/${this.field}`;
                this.isLoading = true;

                // eslint-disable-next-line
                axios.post(url, queryToRun)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                      this.my_interval_data = poll(res.result,(res)=>{
                          this.my_interval_data = null;
                          let vals = res.values
                          // console.log(res);
                          //to clean previously selected values
                          if (this.value) {
                              // console.log(this.selected);
                              let zero_elements = this.value.filter(value => !res.values.map(v => v.value).includes(value))
                                  .sort().map(v => Object({
                                      value: v,
                                      count: 0
                                  }));
                              // console.log(zero_elements);
                              vals = vals.concat(zero_elements);
                          }

                          this.values = vals;
                          this.isLoading = false;
                        });
                    })





//                 // eslint-disable-next-line
//               axios({
//   method: "post",
//   url: url,
//   timeout: 1000 * 500, // Wait for 5 seconds
//   headers: {
//     "Content-Type": "application/json"
//   },
//   data: queryToRun
// } )
//                     .then((res) => {
//                         return res.data
//                     })
//                     .then((res) => {
//                         let vals = res.values
//                         // console.log(res);
//                         //to clean previously selected values
//                         if (this.value) {
//                             // console.log(this.selected);
//                             let zero_elements = this.value.filter(value => !res.values.map(v => v.value).includes(value))
//                                 .sort().map(v => Object({
//                                     value: v,
//                                     count: 0
//                                 }));
//                             // console.log(zero_elements);
//                             vals = vals.concat(zero_elements);
//                         }
//
//                         this.values = vals;
//                         this.isLoading = false;
//                     });
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
