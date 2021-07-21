<template>
  <v-expansion-panel-content :readonly="readOnly" @input="setOpen()" :value="[open]" hide-actions>

    <div slot="header">
      <span class="label">{{ getFullQueryType() }} query: </span>

      <v-btn @click="openAnalyzeSubstitutionPanel()"  color="info" v-if="getFullQueryType() === 'Amino acid'">
        Analyze subsitutions</v-btn>
      <AnalyzeSubstitutionPanel></AnalyzeSubstitutionPanel>

      <span style="font-family:monospace" v-html="queryToShow"></span>

    </div>
    <v-spacer></v-spacer>

    <v-btn :disabled="searchDisabled" class="delete-button" v-if="cancelButton" slot="header" color="error" flat
           @click="deleteKvLocal()">
      Remove condition
    </v-btn>
    <span slot="header" style="max-width: 30px !important">({{ query_type }}_{{ id }})</span>


    <v-container v-if="open" v-for="(cond, index) in list_of_conditions" fluid grid-list-xl>
      <v-radio-group row v-if="query_type !== 'aa'" value="del" @change="variantRadioChanged($event, cond)" column>
        <v-radio checked="1" label="Deletion" value="del"></v-radio>
        <v-radio label="Insertion" value="ins"></v-radio>
        <v-radio label="Substitution" value="sub"></v-radio>
      </v-radio-group>
      <v-layout wrap align-center>

        <v-flex v-for="element in cond" class="no-horizontal-padding xs12 sm6 md2 d-flex" v-if="!element['hidden']">
          <AnnotDropDown v-if="element['type'] == 'dropdown'"
                         :labelTitle="element['labelTitle']"
                         :field="element['field']"
                         v-model="element['value']"
                         :groupCondition="getInnerQueryOfSingleCondition(cond)"/>

          <AnnotMenu v-else
                     :labelTitle="element['labelTitle']"
                     :field="element['field']"
                     :info="element['info']"
                     v-model="element['value']"
                     :groupCondition="getInnerQueryOfSingleCondition(cond)"/>
          <v-dialog width="500">
            <v-btn
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
                {{ element['labelTitle'] }}
              </v-card-title>

              <v-card-text>
                {{ element['description'] }}
              </v-card-text>

            </v-card>
          </v-dialog>
        </v-flex>
      </v-layout>
      <hr v-if="index != list_of_conditions.length - 1">
    </v-container>

    <div v-if="open">
      <v-btn color="info" @click="addNewCondition()"> Add new condition</v-btn>
      <v-btn color="info" @click="setKvLocal" :disabled="buttonDisabled">Apply</v-btn>
      <v-btn color="error" @click="cancel(key)">Cancel</v-btn>
    </div>

    <div v-if="isDev">
      <div v-if="open">
        query_type: {{ query_type }}
        <br>
        list_of_conditions: {{ list_of_conditions }}
        <br>
        getInnerQuery: {{ getInnerQuery }}
      </div>
    </div>
  </v-expansion-panel-content>
</template>

<script>
import {mapGetters, mapMutations, mapActions, mapState} from 'vuex';
import MetadataDropDown from "./MetadataDropDown";
import AnnotDropDown from "./AnnotDropDown";
import AnnotMenu from "./AnnotMenu";
import AnalyzeSubstitutionPanel from "./AnalyzeSubstitutionPanel";

export default {
  name: "KvExpansionPanel",
  components: {AnalyzeSubstitutionPanel, AnnotDropDown, MetadataDropDown, AnnotMenu},
  props: {
    id: {type: Number, required: true},
    query_text: {type: String, required: true},
    query_type: {type: String, required: true},
    exact_match: {type: Boolean, required: true},
    query: {type: Object, required: false},
  },
  data() {
    return {
      radioVariantType: 'del',
      list_of_conditions: [this.getEmptyElement()],
      cancelButton: false,
      readOnly: false,
      open: false,

      isLoading: false,
      key: "",
      panel: [],
      kvLocal: {
        type_query: this.query_type,
        exact: this.exact_match,
        query: {}
      },
      precalculatedShowQuery: null,
    }
  },
  mounted() {
    // this.searchText();
    this.key = this.query_text;
    this.setPanelActive(this.query_text);
    if (this.query) {
      this.readOnly = true;
      this.cancelButton = true;
      this.kvLocal = this.query;
      this.open = false;
      this.resetPanelActive();

      this.precalculatedShowQuery = this.queryToShow2(this.query.query)
    } else {
      this.open = true;

    }
  },
  methods: {
    ...mapMutations(["deleteKey", "setPanelActive", "resetPanelActive", "deleteKvField", 'setTrueAnalyzeSubstitutionPanel']),
    ...mapActions(["setKv", "deleteKv"]),
    openAnalyzeSubstitutionPanel(){
      this.setTrueAnalyzeSubstitutionPanel();
    },
    variantRadioChanged(newValue, cond) {
      console.log(cond);
      const oldValue = cond.filter(el => el['field'] == 'variant_type')[0]['value'][0];
      console.log(newValue, oldValue)
      cond.filter(el => el['field'] == 'variant_type')[0]['value'] = [newValue]

      const isSub = newValue == 'sub'
      const wasSub = oldValue == 'sub'

      cond.filter(el => el['field'] == 'sequence_original')[0]['hidden'] = !isSub;
      cond.filter(el => el['field'] == 'sequence_alternative')[0]['hidden'] = !isSub;
      cond.filter(el => el['field'] == 'variant_length')[0]['hidden'] = isSub;


      if (isSub) {
        if (!wasSub) {
          cond.filter(el => el['field'] == 'variant_length')[0]['value'] = null;
        }
      } else {
        if (wasSub) {
          cond.filter(el => el['field'] == 'sequence_original')[0]['value'] = [];
          cond.filter(el => el['field'] == 'sequence_alternative')[0]['value'] = [];
        }
      }

    },
    addNewCondition() {
      this.list_of_conditions.push(this.getEmptyElement())
    },
    getFullQueryType() {
      if (this.query_type === 'aa') {
        return 'Amino acid';
      } else {
        return 'Nucleotide';
      }
    },
    getEmptyElement() {
      if (this.query_type === 'aa') {
        return [
          {
            type: 'dropdown',
            labelTitle: 'Product protein',
            field: 'product',
            value: [],
            description: 'Protein produced by the sub-sequence within which the amino acid change occurs'
          },
          {
            type: 'dropdown',
            labelTitle: 'Change type',
            field: 'variant_aa_type',
            value: [],
            description: 'Type of amino acid change (SUB = substitution, INS = insertion, DEL = deletion)'
          },
          {
            type: 'dropdown',
            labelTitle: 'Original sequence',
            field: 'sequence_aa_original',
            value: [],
            description: 'Affected amino acid sequence from the corresponding reference sequence of the chosen Virus'
          },
          {
            type: 'dropdown',
            labelTitle: 'Alternative sequence',
            field: 'sequence_aa_alternative',
            value: [],
            description: 'Changed amino acid sequence (in the target sequence) with respect to the reference one'
          },
          {
            type: 'min-max',
            labelTitle: 'Position range',
            field: 'start_aa_original',
            info: 'Position of amino acid variant in the gene coding sequence (CDS), e.g. 0-1000',
            value: null,
            description: 'Range of positions within the amino acid sequence of the gene, based on the reference sequence'
          },
        ];
      } else if (this.query_type === 'nuc') {
        return [
          {
            type: 'dropdown',
            labelTitle: 'Gene name',
            field: 'n_gene_name',
            value: [],
            description: 'Gene to which the sub-sequence belongs'
          },
          {
            type: 'dropdown',
            labelTitle: 'Variant type',
            field: 'variant_type',
            value: ['del'],
            description: 'Type of amino acid change (SUB = substitution, INS = insertion, DEL = deletion)',
            hidden: true
          },
          {
            type: 'dropdown',
            labelTitle: 'Original sequence',
            field: 'sequence_original',
            value: [],
            description: 'Affected nucleotide sequence from the corresponding reference sequence of the chosen Virus',
            hidden: true
          },
          {
            type: 'dropdown',
            labelTitle: 'Alternative sequence',
            field: 'sequence_alternative',
            value: [],
            description: 'Changed nucleotide sequence (in the target sequence) with respect to the reference one',
            hidden: true
          },
          {
            type: 'min-max',
            labelTitle: 'Variant length',
            field: 'variant_length',
            info: 'Length of the deletion or insertion',
            value: null,
            description: 'Length of the deletion or insertion',
          },
          {
            type: 'min-max',
            labelTitle: 'Position range',
            field: 'start_original',
            info: 'Position of nucleotide variant in the full sequence, e.g. 0-15000',
            value: null,
            description: 'Range of positions within the full nucleotide sequence, based on the reference sequence'
          },
          // {
          //   type: 'dropdown',
          //   labelTitle: 'Effect',
          //   field: 'effect',
          //   value: [],
          //   description: 'Effect of the variant, annotated using the Sequence Ontology terms (http://www.sequenceontology.org/), predicted by SnpEff (http://snpeff.sourceforge.net/)'
          // },
          // {
          //   type: 'dropdown',
          //   labelTitle: 'Putative impact',
          //   field: 'putative_impact',
          //   value: [],
          //   description: 'A simple estimation of putative impact / deleteriousness : {HIGH, MODERATE, LOW, MODIFIER}, predicted by SnpEff (http://snpeff.sourceforge.net/)'
          // },
          // {
          //   type: 'dropdown',
          //   labelTitle: 'Impacted gene',
          //   field: 'impact_gene_name',
          //   value: [],
          //   description: 'Common gene name (HGNC, https://www.genenames.org/). Optional: use closest gene when the variant is intergenic, predicted by SnpEff (http://snpeff.sourceforge.net/),'
          // },
        ];
      }

    },
    setOpen() {
      this.open = false;
    },
    cancel() {
      this.deleteKey(this.id);
      this.resetPanelActive()
    },

    deleteKvLocal() {
      this.deleteKv(this.query_text + "_" + this.id)
      this.deleteKey(this.id);
    },
    setKvLocal() {
      let savePanel = true;
      let problematicPanels = []


      if (this.query_type == "aa") {
        for (let i = 0; i < this.list_of_conditions.length; i++) {
          const cond = this.list_of_conditions[i];
          const productValues = cond.filter(el => el['field'] == 'product')[0]['value'];
          console.log("productValues", productValues);
          let res = this.getInnerQueryOfSingleCondition(cond);
          if (Object.keys(res).length > 0) {
            if (productValues.length == 0)
              problematicPanels.push(`[Panel ${i + 1} does not have any product protein]`);
            else if (productValues.length > 1)
              problematicPanels.push(`[Panel ${i + 1} has multiple product proteins]`);
          }
        }
      }
      if (problematicPanels.length) {
        problematicPanels = problematicPanels.join("\n")
        if (confirm('Conditions without any product protein or with multiple product proteins should not be used. Please select one! \n' + problematicPanels)) {
          savePanel = true;
        } else {
          savePanel = false;
        }
      }


      if (savePanel) {
        this.kvLocal.query = this.getInnerQuery;
        this.setKv({
          kv: this.kvLocal,
          search_text: this.key + "_" + this.id
        });

        this.readOnly = true;
        this.cancelButton = true;
        this.open = false;
        this.resetPanelActive()
      }
    },
    queryToShow2(input) {
      // return JSON.stringify(this.getInnerQuery);
      let el = {};
      this.getEmptyElement().forEach(element => {
        el[element['field']] = element['labelTitle'];
      });

      let outer_list = [];
      // console.log(this.getInnerQuery);
      input.forEach(element => {
        // console.log(element);
        let inner_list = [];
        Object.keys(element).forEach(key => {
          const value = element[key];
          inner_list.push(key + ': ' + JSON.stringify(value));
        });
        outer_list.push(inner_list.join(", "))
      });

      return "<br/>" + outer_list.join("<br/><b>OR</b><br/>");
    },
    getInnerQueryOfSingleCondition(cond) {
      let res = {}
      cond.forEach(element => {
        const value = element['value'];
        const field = element['field']
        if (value) {
          if (Array.isArray(value)) {
            if (value.length)
              res[field] = value;
          } else {
            res[field] = value;
          }
        }
      });
      return res;
    }
  },
  computed: {
    ...mapState(["panelActive", 'exampleQueryLoaded']),
    ...mapGetters({
      compound_query: 'build_query'
    }),
    queryToShow() {
      if (this.precalculatedShowQuery) {
        return this.precalculatedShowQuery;
      } else {
        return this.queryToShow2(this.getInnerQuery);
      }
    },
    buttonDisabled() {
      return this.getInnerQuery.length == 0;
    },
    searchDisabled() {
      return this.panelActive.length !== 0
    },
    getInnerQuery() {
      let res_list = []
      this.list_of_conditions.forEach(cond => {
        // console.log(cond);
        let res = this.getInnerQueryOfSingleCondition(cond);
        if (Object.keys(res).length > 0) {
          res_list.push(res);
        }
      });
      return res_list;
    },
    isDev() {
      return process.env.NODE_ENV === 'development';
    }

  },
  watch: {
    query: {
      handler() {
        console.log(this.query);
        if (this.query) {
          this.precalculatedShowQuery = this.queryToShow2(this.query.query);
        }
      }
      ,
      deep: true
    },
    open: {
      handler() {
        if (!this.readOnly) {
          this.open = true
        }
      }
      ,
      deep: true
    },
    exampleQueryLoaded: {
      handler() {
        console.log('exampleQueryLoaded', this.exampleQueryLoaded)
        this.readOnly = true;
        this.cancelButton = true;
        this.kvLocal = this.query;
        this.open = false;
        this.resetPanelActive();

        this.precalculatedShowQuery = this.queryToShow2(this.query.query)
      }
      ,
      deep: false
    },
  }

}
</script>

<style scoped>
.delete-button {
  flex: none !important;
}

  .container {
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

  .label {
    font-size: 1.3em;
    font-weight: bold;
    padding: 12px;
  }


</style>
