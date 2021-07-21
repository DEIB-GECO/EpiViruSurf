<template>
    <v-card>
        <v-card-title>
            Result
            <v-spacer></v-spacer>
            <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Search"
                    single-line
                    hide-details
            ></v-text-field>
        </v-card-title>
        <v-data-table
                :headers="headers"
                :items="result"
                :search="search"
                :loading="isLoading"
                class="data-table"
                :pagination.sync="pagination"
        >
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
    import {mapState} from 'vuex'


    export default {
        name: "PairsTable",
        data() {
            return {
                isLoading: false,
                search: '',
                headers: [
                    {text: 'Key', value: 'key'},
                    {text: 'Value', value: 'value'},
                ],
                result: [],
                pagination: {rowsPerPage: -1},//show all
            }
        },
        watch: {
            filter() {
                this.applyFilter();
            }
        },
        mounted() {
            //load all the results
            this.applyFilter();
        },
        methods: {
            applyFilter() {
                // console.log('test');

                const url = `item/${this.sourceId}/extra`;
                this.isLoading = true;
                this.result = [];

                // eslint-disable-next-line
                axios.get(url, this.filter)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.result = res.extras;
                        this.isLoading = false;
                    });

            },
        },
        computed: {
            ...mapState({
                sourceId: 'extraMetadataSourceId',
            }),
        }

    }
</script>

<style scoped>

    .data-table {
        /*margin-bottom: 1.5em;*/
    }
</style>