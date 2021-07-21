<template>
    <v-container fluid grid-list-xl class="mylay2">
         <!--<v-layout class="container view">-->
        <v-layout>
            <v-flex md4 class="age-comp">
                <v-text-field v-model="min" type="number" label="Min years" :hint="minString" persistent-hint
                              :min="minInt" :max="max" :disabled="searchDisabled">
                </v-text-field>
            </v-flex>
            <v-flex md4 class="age-comp">
                <v-text-field v-model="max" type="number" label="Max years" :hint="maxString" persistent-hint
                              :min="min" :max="maxInt" :disabled="searchDisabled">
                </v-text-field>
            </v-flex>
            <!--<v-flex md4 class="age-comp">
                <v-select
                        v-model="unit"
                        :items="units"
                        label="Age unit"
                        :disabled="searchDisabled"
                >
                </v-select>
            </v-flex>-->
            <v-flex md2 class="age-comp">
                <v-checkbox v-model="isNull"
                            :disabled="searchDisabled"
                            label="N/D"
                            input-value="true">
                </v-checkbox>
            </v-flex>

            <!--<v-flex md3 class="age-comp">
                <v-btn tiny @click="setAgeLocal" :disabled="searchDisabled" color="info" flat>Apply</v-btn>
                <v-btn small @click="deleteAgeLocal" :disabled="searchDisabled" color="error" flat>Clear</v-btn>
            </v-flex>-->

        </v-layout>
    </v-container>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "AgeSelector",
        data() {
            return {

                min: null,
                max: null,
                minAge: null,
                maxAge: null,
                isNull: false,
                unit: 1,
                units: [
                    // {'text': 'Days', 'value': 1},
                    //  {'text': 'Weeks', 'value': 7},
                    //  {'text': 'Months', 'value': 30},
                    {'text': 'Years', 'value': 1},
                ],
                selectedAge: {},
            }
        },
        methods: {
            ...mapActions(["setAge", "deleteAge"]),
            deleteAgeLocal() {
                this.deleteAge();
                this.min = null;
                this.unit = 1;
                this.max = null;
                this.isNull = false;
                // console.log(this.min)
            },
            loadMinMaxAge() {
                const url = `field/age`;

                // eslint-disable-next-line
                axios.post(url, this.compound_query)
                    .then((res) => {
                        return res.data
                    })
                    .then((res) => {
                        this.minAge = res['min_age'];
                        this.maxAge = res['max_age'];
                        if (this.ageItem) {
                            if (this.ageItem['min_age'] != null) {
                                this.min = this.ageItem['min_age'] / this.unit;
                            }
                            this.isNull = this.ageItem['is_null'];
                            if (this.ageItem['max_age'] != null) {
                                this.max = this.ageItem['max_age'] / this.unit;
                            }
                        }
                    });
            },
            setAgeLocal() {
                let c = 0;
                let b = 0;

                if (this.selectedMin) {
                    c = this.selectedMin;
                    // console.log("min not null")
                } else {
                    c = null
                    // console.log("min null")
                }
                // console.log(c);

                if (this.selectedMax)
                    b = this.selectedMax;
                else b = null

                let a = {
                    'min_age': c,
                    'max_age': b,
                    'is_null': this.isNull
                };
                this.setAge(a)
            },
        },
        mounted() {
            this.loadMinMaxAge()
        },
        watch: {
            compound_query() {
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
            // min(newVal) {
            //     if (newVal !== null)
            //         if ((newVal * this.min) < this.minAge)
            //             this.min = Math.floor(this.minAge / this.unit)
            // },
            // max(newVal) {
            //     if (newVal !== null)
            //         if ((newVal * this.unit) > this.maxAge)
            //             this.max = Math.ceil(this.maxAge / this.unit)
            // },
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
            searchDisabled() {
                return this.panelActive.length !== 0
            },
            ageItem() {
                return this.compound_query.gcm.age
            },
            selectedMin() {
                if (this.min)
                    return this.min * this.unit
            },
            selectedMax() {
                if (this.max)
                    return this.max * this.unit
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
    .container {
        padding-left: 0px;
        padding-right: 0px;
        padding-top: 0px;
        padding-bottom: 0px;
        margin-bottom: 0px;
    }

    .view {
        margin-bottom: 0px !important;
        margin-top: -12px !important;
        outline: 1px solid black;

    }

    .mylay {

    }

    .mylay2 {
        margin-left: 20px;
        margin-right: -80px;
        padding-right: 0px !important;
    }

    .age-comp {
        padding-top: 0px !important;
        padding-bottom: 0px !important;
    }
</style>
