<template>
    <v-menu
            :close-on-click="false"
            :close-on-content-click="false"
            :nudge-width="200"
            v-model="menu"
            offset-y
    >
        <v-text-field slot="activator"
                      name="input-1"
                      :label="labelTitle"
                      v-model="shown_value"
                      :append-icon="menu ? 'arrow_drop_up' : 'arrow_drop_down'"
                      :disabled="menu"
        ></v-text-field>

        <v-card>
            <v-card-title>
                <h4 class="headline mb-0">{{labelTitle}}</h4>
            </v-card-title>
            <v-container fluid grid-list-xl class="mylay2">
                <v-layout style="padding-right: 50px">{{info}}</v-layout>
                <!--<v-layout class="container view">-->
                <v-layout>
                    <v-flex md4 class="age-comp">
                        <v-text-field v-model="min" type="number" label="Min value"
                                      :min="minInt" :max="max" :hint="minString" persistent-hint>
                        </v-text-field>
                    </v-flex>
                    <v-flex md4 class="age-comp">
                        <v-text-field v-model="max" type="number" label="Max value"
                                      :min="min" :max="maxInt" :hint="maxString" persistent-hint>
                        </v-text-field>
                    </v-flex>
                    <!--                    <v-flex md2 class="age-comp">-->
                    <!--                        <v-checkbox v-model="isNull"-->
                    <!--                                    label="N/D"-->
                    <!--                                    input-value="true">-->
                    <!--                        </v-checkbox>-->
                    <!--                    </v-flex>-->
                </v-layout>
            </v-container>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                        color="blue"
                        flat
                        outline
                        @click="setAgeLocal">
                    Apply
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>
                <v-btn
                        color="red"
                        flat
                        outline
                        @click="deleteAgeLocal">
                    Clear
                    <v-icon dark right>block</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-menu>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "AnnotMenu",
        props: {
            labelTitle: {type: String, required: true,},
            field: {type: String, required: true,},
            value: {},
            info: {},
            groupCondition: {},
        },
        data() {
            return {
                menu: false,
                shown_value: null,
                min: null, //goes to query
                max: null, //goes to query
                minAge: null, //resulting from range available on the currently selected dataset
                maxAge: null,
                isNull: false,
                unit: 1,
                units: [
                    {'text': 'Years', 'value': 1},
                ],
                selectedAge: {},
            }
        },
        methods: {
            // ...mapActions(["setNumerical", "deleteNumerical"]),
            deleteAgeLocal() {
                // this.deleteNumerical(this.field);
                this.$emit('input', null)
                this.min = null;
                this.unit = 1;
                this.max = null;
                this.isNull = false;

                this.menu = false;
            },
            loadMinMaxAge() {
                let queryToRun = Object.assign({}, this.compound_query);
                queryToRun['panel'] = this.groupCondition;

                const url = `field/numerical/${this.field}`;


                // eslint-disable-next-line
                axios.post(url, queryToRun)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_val'];

                        this.maxAge = res['max_val'];

                        if (this.ageItem) {
                            if (this.ageItem['min_val'] != null) {
                                this.min = this.ageItem['min_val'] / this.unit;
                            }
                            this.isNull = this.ageItem['is_null'];
                            if (this.ageItem['max_val'] != null) {
                                this.max = this.ageItem['max_val'] / this.unit;
                            }
                        }
                    });
            },
            setAgeLocal() {
                let c = 0;
                let b = 0;

                c = this.selectedMin;
                b = this.selectedMax;

                let a = {
                    'min_val': c,
                    'max_val': b,
                    'is_null': this.isNull
                };

                let p = {'field': this.field, 'setting_a': a}

                // this.setNumerical(p);

                // console.log("a", a)

                let res = {};

                if (this.isNull)
                    res['is_null'] = true;
                if (this.selectedMin != null)
                    res['min_val'] = this.selectedMin;
                if (this.selectedMax != null)
                    res['max_val'] = this.selectedMax;

                if (Object.keys(res).length > 0)
                    this.$emit('input', res)
                // else
                //     this.deleteAgeLocal()


                this.menu = false;
            }
            ,
        },
        mounted() {
            this.loadMinMaxAge()
        },
        watch: {
            compound_query() {
                this.loadMinMaxAge();
            },
            groupCondition() {
                this.loadMinMaxAge();
            },
            ageItem() {
                if (!this.ageItem) {
                    this.min = null;
                    this.max = null;
                    this.unit = 1;
                    this.isNull = false;
                }
            },
            min() {
                this.shown_value = this.textBoxValue;
            },
            max() {
                this.shown_value = this.textBoxValue;
            },
            isNull() {
                this.shown_value = this.textBoxValue;
            },
            unit(newVal, oldVal) {
                if (this.min !== null)
                    this.min = Math.floor(this.min * oldVal / newVal);
                if (this.max !== null)
                    this.max = Math.ceil(this.max * oldVal / newVal);
            }
        },
        computed: {
            ...mapState(["panelActive"]),
            ...mapGetters({
                compound_query: 'build_query',
            }),
            //here we will calculate the value of textbox
            textBoxValue() {
                let a = [];
                if (this.min != null)
                    a.push('min: ' + this.min);
                if (this.max != null)
                    a.push('max: ' + this.max);
                if (this.isNull)
                    a.push('N/D');
                return a.join('; ');
            },
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            ageItem() {
                return this.compound_query.gcm[this.field]
            },
            selectedMin() {
                if (this.min != null && this.min !== '') {
                    return this.min * this.unit;
                } else {
                    return null;
                }
            },
            selectedMax() {
                if (this.max != null && this.max !== '') {
                    return this.max * this.unit;
                } else {
                    return null;
                }
            },
            maxString() {
                return Math.ceil((this.maxAge / this.unit)).toString();
            },
            minString() {
                return Math.floor((this.minAge / this.unit)).toString();
            },
            maxInt() {
                return Math.ceil((this.maxAge / this.unit))
            },
            minInt() {
                return Math.floor((this.minAge / this.unit))
            },
        }
    }

</script>

<style scoped>

    .mylay2 {
        margin-left: 20px;
        margin-right: -80px;
        padding-right: 0px !important;
    }
</style>
