<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-card flat color="transparent">
        <v-card-text>
            <v-layout row class="myslider">
                <v-header>Age</v-header>
                <v-flex shrink style="width: 100px">
                    <v-text-field
                            v-model="range[0]"
                            class="mt-0"
                            hide-details
                            single-line
                            type="number"
                    ></v-text-field>
                </v-flex>
                <v-flex> <!--min/max are the bounds of age slider segment-->
                    <v-range-slider
                            v-model="range"
                            :min="minAge"
                            :max="maxAge"
                            :step="1"
                            @end="setAgeLocal"
                            @change="setAgeLocal"
                            thumb-label="always"
                            :thumb-size="24"

                    ></v-range-slider>
                </v-flex>
                <v-flex shrink style="width: 110px">
                    <v-text-field
                            v-model="range[1]"
                            class="mt-0"
                            hide-details
                            single-line
                            type="number"
                    ></v-text-field>
                </v-flex>
                <v-flex shrink style="width: 200px">
                    <v-layout row>
                        <v-checkbox
                                v-model="isNull"
                                :disabled="searchDisabled ||  disableSelectorEpitopePart"
                                label="N/D"
                                @change="setAgeLocal"
                                input-value="true">
                        </v-checkbox>
                        <!--  <v-btn @click="setAgeLocal" :disabled="searchDisabled" color="info" flat>Apply</v-btn> -->
                          <v-btn @click="deleteAgeLocal" :disabled="searchDisabled ||  disableSelectorEpitopePart" color="error" flat>Clear</v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>

        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState, mapGetters, mapActions} from 'vuex';

    export default {
        name: "MetadataRangeSlider",
        data() {
            return {
                min: null, //goes to query
                max: null, //goes to query
                minAge: null, //resulting from range available on the currently selected dataset
                maxAge: null,
                range: [40, 60],
                isNull: false,
                unit: 1,
                units: [
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
                } else {
                    c = null;
                }

                if (this.selectedMax) {
                    b = this.selectedMax;
                } else {
                    b = null;
                }

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
            unit(newVal, oldVal) {
                if (this.min !== null)
                    this.min = Math.floor(this.min * oldVal / newVal);
                if (this.max !== null)
                    this.max = Math.ceil(this.max * oldVal / newVal);
            }
        },
        computed: {
            ...mapState(["panelActive", 'disableSelectorEpitopePart']),
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
                if (this.range[0])
                    return this.range[0] * this.unit
            },
            selectedMax() {
                if (this.range[1])
                    return this.range[1] * this.unit
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

    .myslider {
        transform: scale(0.8);
        transform-origin: left;
    }

</style>
