<template>
    <v-dialog @keydown.esc="closeDialog" v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <!--<v-btn slot="activator" color="primary" dark>Open Dialog</v-btn>-->
        <v-card>
            <v-toolbar  dense dark color="primary">
                <v-toolbar-title v-if="sourceId1">Graph of item with source id :{{sourceId1}}</v-toolbar-title>
                <v-toolbar-title v-else-if="sourceId2">Extra information of item with source id : {{sourceId2}}</v-toolbar-title>
                <v-toolbar-title v-else>Graph for query {{query}}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="closeDialog">
                    <v-icon>close</v-icon>
                </v-btn>
            </v-toolbar>
            <PairsTable v-if="sourceId2"/>

        </v-card>
    </v-dialog>
</template>

<script>
    import {mapGetters, mapMutations, mapState} from 'vuex'

    import PairsTable from "./PairsTable";

    export default {
        name: "FullScreenViewer",
        components: {PairsTable},
        data() {
            return {
                notifications: false,
                sound: true,
                widgets: false
            }
        },
        methods: {
            ...mapMutations([
                'closeDialog',
            ]),

        },
        computed: {
            ...mapState({
                sourceId1: 'graphSourceId',
                sourceId2: 'extraMetadataSourceId',
                query: 'query',
                dialog3: 'showGraphQuery'
            }),
            ...mapGetters({
                dialog1: 'showGraphDialog',
                dialog2: 'showExtraMetadataDialog',
            }),
            dialog() {
                return this.dialog1 || this.dialog2 || this.dialog3
            },
        }
    }
</script>

<style scoped>
    .graph--fullscreen {
        /*border-radius: 0;*/
        /*margin: 0;*/
        height: 95vh;
        width: 100%;
        /*position: fixed;*/
        /*overflow-y: auto;*/
        /*top: 0;*/
        /*left: 0;*/
    }

</style>
