<template>
    <v-card>
        <!--{{query}}-->
        <!--<v-card-title>-->
        <!--Result-->
        <!--<v-spacer></v-spacer>-->
        <!--<v-text-field-->
        <!--v-model="search"-->
        <!--append-icon="search"-->
        <!--label="Search"-->
        <!--single-line-->
        <!--hide-details-->
        <!--&gt;</v-text-field>-->
        <!--</v-card-title>-->
        <v-data-table
                :headers="headers"
                :items="result"
                :search="search"
                :loading="isLoading"
                class="data-table"
                :pagination.sync="pagination">
            <template slot="items" slot-scope="props">
                <td v-for="header in headers" :key="header.value">
                    <span>{{props.item[header.value]}}</span>
                </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                Your search for "{{ search }}" found no results.
            </v-alert>

            <v-alert slot="no-data" :value="true" color="error" icon="warning" v-if="!isLoading">
                Sorry, nothing to display here :(
            </v-alert>
            <v-alert slot="no-data" :value="true" color="info" icon="info" v-else>
                Loading
            </v-alert>
        </v-data-table>


    </v-card>
</template>

<script>
    import {mapMutations, mapState, mapGetters} from 'vuex';

    export default {
        name: "CountTable",
        props: {
            countType: {type: String, required: true,},
        },
        data() {
            return {
                isLoading: false,
                search: '',
                result: [],
                pagination: {rowsPerPage: -1},//show all
            }
        },
        watch: {
            compound_query() {
                this.applyQuery();
            },
            synonym() {
                this.applyQuery();
            },
            isLoading() {
                if (this.isLoading)
                    this.setCount(null);
                else
                    this.setCount(this.result.map(x=>x.count).reduce((a, b) => a + b, 0));
            },
        },
        mounted() {
            //load all the results
            this.applyQuery();
        },
        methods: {
            ...mapMutations(['setCount',]),
            //TODO merge these functions with metadata table
            applyQuery() {
                // console.log('test');
                const url = `query/count/${this.countType}?voc=${this.synonym}`;
                this.isLoading = true;
                this.result = [];
                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        // console.log(res);
                        this.result = res;
                        this.isLoading = false;
                    });
            },
        },
        computed: {
            ...mapState(['query', 'synonym',]),
            ...mapGetters({
                compound_query: 'build_query'
            }),
            sortable() {
                return true;
            },
            headers() {
                return [
                    {text: 'Name', value: 'name', sortable: this.sortable,},
                    {text: 'Count', value: 'count', sortable: this.sortable,},
                ];
            },
        }

    }
</script>

<style scoped>


    .data-table {
        /*margin-bottom: 1.5em;*/
    }
</style>