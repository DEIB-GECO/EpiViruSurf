<template>
    <!--{{filter}}-->
    <v-container fluid grid-list-xl style="background:#FFFFFF">
        <div v-for="view in views" :key="view.value" class="view" :style="{}">
            <h4 style="text-align: center">{{view.text}}</h4>
            <v-layout wrap align-center class="container">
                <!--<v-flex xs12 sm6 md2 d-flex class="label no-horizontal-padding">-->
                <!--{{view.text}}:-->
                <!--</v-flex>-->
                <v-flex :class="getClass(field.name)"
                        v-for="field in getViewFields(view.value)"
                        :key="field.name">
                    <MetadataMenu
                            v-if="field.is_numerical"
                            :field="field.name"
                            :labelTitle="getFieldTitle(field)"
                    ></MetadataMenu>
                    <MetadataMenuDate
                            v-if="field.is_date"
                            :field="field.name"
                            :labelTitle="getFieldTitle(field)"
                    ></MetadataMenuDate>
                    <MetadataDropDown
                            v-if="!field.is_date && !field.is_numerical"
                            :field="field.name"
                            :labelTitle="getFieldTitle(field)"
                    ></MetadataDropDown>
                    <v-dialog width="500">
                        <v-btn
                              v-if="isEpitopeSurf"
                                slot="activator"
                                class="info-button"
                                small
                                flat icon color="grey">
                            <v-icon class="info-icon">info</v-icon>
                        </v-btn>
                        <v-btn v-else
                                slot="activator"
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
                                {{getFieldTitle(field)}}
                            </v-card-title>

                            <v-card-text>
                                {{field.description}}
                            </v-card-text>

                        </v-card>
                    </v-dialog>
                </v-flex>
            </v-layout>
        </div>
    </v-container>

</template>

<script>
    import MetadataDropDown from "./MetadataDropDown";
    import MetadataMenu from "./MetadataMenu";
    import MetadataMenuDate from "./MetadataMenuDate";
    import {mapState} from "vuex";

    export default {
        name: "MetadataDropDownList",
        components: {MetadataDropDown, MetadataMenu, MetadataMenuDate},
        // props: {
        //     field: {type: String, required: true,},// default: 100,
        // },
        data() {
            return {
                isLoading: true,
                fields: [],
                filter: {},
                // groups: [
                //     {text: 'Project', value: 'Project'},
                //     {text: 'Experiment type', value: 'ExperimentType'},
                //     {text: 'Dataset', value: 'Dataset'},
                //     {text: 'Biosample', value: 'Biosample'},
                //     {text: 'Donor', value: 'Donor'},
                //     {text: 'Replicate', value: 'Replicate'},
                //     {text: 'Item', value: 'Item'},
                //     {text: 'Case study', value: 'CaseStudy'},
                // ],
                views: [
                    {text: 'Virus', value: 'biological_v', color: '#B3E1FF'},
                    {text: 'Host Organism', value: 'biological_h', color: '#FFA9BF'},
                    {text: 'Sequence properties and technology', value: 'technological', color: '#DEFFC5'},
                    {text: 'Organization', value: 'organizational', color: '#FFBF5B'},
                ],
            }
        },
        computed: {
          ...
              mapState(['isEpitopeSurf']),
        },
        methods: {
            // getGroupFields(groupValue) {
            //     return this.fields.filter(field => field.group === groupValue);
            // },
            //getClass(field) {
            getClass() {
                // if (field === 'age')
                //     return "no-horizontal-padding xs12 sm12 md6 d-flex";
                // else
                return "no-horizontal-padding xs12 sm6 md2 d-flex"
            },
            getViewFields(viewValue) {
                return this.fields.filter(field => field.view === viewValue);
            },
            getFieldTitle: (field) => {
                let upperField = field.name;
                //upperField = upperField === "is_ann" ? "is_annotation": upperField;
                upperField = upperField.charAt(0).toUpperCase() + upperField.slice(1);
                upperField = upperField.replace(/_/g, ' ');
                // return group + " " + upperField;
                // return  upperField;
                if (field.title)
                    return field.title;
                else
                    return upperField;
            },
        },
        created() {
            // const url = `/api/value/${this.field}`;
            const url = `field`;


            this.fields = [];

            let temp_fields = [];

            // eslint-disable-next-line
            axios.get(url)
                .then((res) => {
                    return res.data
                })
                .then((res) => {
                    this.fields = res.fields;
                    this.isLoading = false;
                });
            this.fields = temp_fields;
        }
    }
</script>

<style scoped>
    .container{
        padding-top: 0;
        padding-bottom: 0;
        min-width: 100%;
      }


    .label {
      display: block;
      font-size: 1.3em;
      font-weight: bold;
    }

    .info-icon {
      font-size: 15px;
    }

    .info-button {
      width: 10px;
    }

    .view {
      margin: 15px;
      outline: 1px solid black;
    }


</style>
