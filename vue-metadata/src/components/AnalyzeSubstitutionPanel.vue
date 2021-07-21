<template>
<div class="text-center">
    <v-dialog
        persistent
        scrollable
      v-model="analyzeSubPanel"
      width="800"
    >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white" v-if="isEpitopeSurf">
          Analyze Substitutions
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color:white;"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>
        <v-card-title class="headline blue lighten-4"
                    primary-title v-else>
          Analyze Substitutions
          <v-spacer></v-spacer>
          <v-btn
            color="rgb(122, 139, 157)"
            style="color:white;"
            text
            @click="exit()"
          >
            CLOSE
          </v-btn>
        </v-card-title>

        <v-card-text>
          <h3 style="margin-bottom: 10px"> Choose a substitution: </h3>
          <v-layout wrap align-center>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-card>
                <v-autocomplete
                  v-model="selectedOriginalAmino"
                  :items="aminoAcidListOrdered"
                  :item-text="rename"
                  item-value="code"
                  :label="text_original"
                  :multiple= false
                  :disabled= false
                >
                  <template slot="item" slot-scope="data">
                      <span class="item-value-span"> {{rename(data.item)}}</span>
                  </template>
                </v-autocomplete>
              </v-card>
              <v-dialog width="500">
                  <v-btn
                          slot="activator"
                          class="info-button"
                          small
                          flat icon color="grey"
                          v-if="isEpitopeSurf">
                      <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-btn
                            slot="activator"
                            class="info-button"
                            small
                            flat icon color="blue"
                            v-else>
                        <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-card>
                      <v-card-title
                              class="headline grey lighten-2"
                              primary-title
                      >
                          Original Aminoacid
                      </v-card-title>
                      <v-card-text>
                          Affected amino acid
                      </v-card-text>
                  </v-card>
              </v-dialog>
            </v-flex>
            <v-flex class="no-horizontal-padding xs12 sm6 md6 lg6 d-flex EpitopeSelectors">
              <v-card>
                <v-autocomplete
                  v-model="selectedAlternativeAmino"
                  :items="aminoAcidListOrdered"
                  :item-text="rename"
                  item-value="code"
                  :label="text_alternative"
                  :multiple= false
                  :disabled= false
                >
                  <template slot="item" slot-scope="data">
                      <span class="item-value-span"> {{rename(data.item)}}</span>
                  </template>
                </v-autocomplete>
              </v-card>
              <v-dialog width="500">
                  <v-btn
                          slot="activator"
                          class="info-button"
                          small
                          flat icon color="grey"
                          v-if="isEpitopeSurf">
                      <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-btn
                          slot="activator"
                          class="info-button"
                          small
                          flat icon color="blue"
                          v-else>
                      <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-card>
                      <v-card-title
                              class="headline grey lighten-2"
                              primary-title
                      >
                          Alternative Aminoacid
                      </v-card-title>
                      <v-card-text>
                          Changed amino acid
                      </v-card-text>
                  </v-card>
              </v-dialog>
            </v-flex>
          </v-layout>

          <!--
          <v-layout wrap justify-center style="margin-top: 20px">
            <v-btn @click="analyzeThisSubstitution()" class="white--text" color="#00008B">APPLY</v-btn>
          </v-layout>
          -->


        <v-layout wrap justify-center style="margin-top: 20px">
          <table v-if="aminoAcidSelectedList.length > 0" style="width: 600px; margin: 20px; border-collapse: collapse;">
            <tbody>
              <tr v-for="header in headers" style="text-align: center;">
                <td> <b> {{header.text}} </b> </td>
                <td v-for="item in aminoAcidSelectedList" v-if="item"> <span v-if="item"> {{item[header.value]}} </span> </td>
              </tr>
            </tbody>
          </table>


        <!--
        <v-data-table
                :headers="headers"
                :items="aminoAcidSelectedList"
                hide-actions
                class="elevation-1"
                v-if="showTable"
                style="margin: 20px; border: solid 1px black;"
                id = "table"
        >
            <template slot="items" slot-scope="props">
                <td style="white-space:pre-wrap; word-wrap:break-word;" v-for="header in headers"
                    :key="header.value" v-show="header.text">
                  <span v-if="header.value === 'code'"> <b>{{props.item[header.value]}}</b> </span>
                <span v-else-if="header.value === 'role' || header.value === 'name'">{{props.item[header.value]}}</span>
                  <span v-else> {{props.item[header.value]}} </span>
                </td>
            </template>
        </v-data-table>
        -->


        <div style="margin: 20px; border: solid 1px black; margin-bottom: 80px !important;" v-if="originalSetted && alternativeSetted">
            <v-layout wrap align-center justify-center>
              <h3 style="margin: 20px"> Grantham distance: </h3>
              <v-chip
                color="blue"
                dark
                style="color: white"
              >
                {{calculateCoefficient}}
              </v-chip>
              <v-dialog width="500">
                  <v-btn
                          slot="activator"
                          class="info-button"
                          small
                          flat icon color="grey"
                          v-if="isEpitopeSurf">
                      <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-btn
                          slot="activator"
                          class="info-button"
                          small
                          flat icon color="blue"
                          v-else>
                      <v-icon class="info-icon">info</v-icon>
                  </v-btn>
                  <v-card>
                      <v-card-title
                              class="headline grey lighten-2"
                              primary-title
                      >
                          Grantham distance
                      </v-card-title>
                      <v-card-text>
                          Grantham distance is a formula for difference between amino acids combines properties that
                        correlate best with protein residue substitution frequencies: composition, polarity,
                        and molecular volume. (<a target="_blank" href="https://doi.org/10.1126/science.185.4154.862">source</a>)
                        <br><br>
                        <u>Conservative Change:</u><br> rarely results in dysfunction (Grantham distance <= 66)
                        <br><br>
                        <u>Radical Change:</u><br> might lead to change in the phenotype (Grantham distance > 66)
                      </v-card-text>
                  </v-card>
              </v-dialog>
            </v-layout>
            <v-layout wrap align-center justify-center v-if="calculateCoefficient !== null && calculateCoefficient>0">
              <h4 style="margin-bottom: 20px" v-if="calculateCoefficient > 66"> Radical Change </h4>
              <h4 style="margin-bottom: 20px" v-if="calculateCoefficient <= 66"> Conservative Change </h4>
            </v-layout>
        </div>

        </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>


    <v-dialog
          persistent
          v-model="errorNeedSelectBoth"
          width="300"
        >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Missing Amino Acid
          <v-spacer></v-spacer>
          <v-btn
              style="background-color: rgb(122, 139, 157)"
              slot="activator"
              flat icon
              small
            color="white"
            @click="exitMissingAminoAcid()"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-xs-center">
          Need both an original and an alternative amino acid to do the analysis.
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
          persistent
          v-model="errorSameAmino"
          width="300"
        >
      <v-card>
        <v-card-title class="headline" style="background-color:rgb(201, 53, 53) ; color: white">
          Same Amino Acids
          <v-spacer></v-spacer>
          <v-btn
              style="background-color: rgb(122, 139, 157)"
              slot="activator"
              flat icon
              small
            color="white"
            @click="exitErrorSameAmino()"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="text-xs-center">
          Need two different amino acids to do the analysis.
        </v-card-text>
      </v-card>
    </v-dialog>



  </div>
</template>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
  name: "AnalyzeSubstitutionPanel",
  data(){
      return{
        analyzeSubPanel: false,
        aminoAcidList: [
            {code: "A", name: "Alanine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Non essential", side_chain_flexibility: "Limited", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 71, isoelectric_point: 6, hydrophobicity: 0.806, potential_side_chain_H_bonds: 0},
            {code: "R", name: "Arginine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Positive charge",
              essentiality: "Essential", side_chain_flexibility: "High", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 156, isoelectric_point: 10.8, hydrophobicity: 0, potential_side_chain_H_bonds: 7},
            {code: "N", name: "Asparagine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Uncharged",
              essentiality: "Non essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Amide",
              molecular_weight: 114, isoelectric_point: 5.4, hydrophobicity: 0.448, potential_side_chain_H_bonds: 5},
            {code: "D", name: "Aspartic acid", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Negative charge",
              essentiality: "Non essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 115, isoelectric_point: 3, hydrophobicity: 0.417, potential_side_chain_H_bonds: 4},
            {code: "C", name: "Cysteine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Uncharged",
              essentiality: "Non essential", side_chain_flexibility: "Low", chemical_group_in_side_chain: "Sulfur",
              molecular_weight: 103, isoelectric_point: 5, hydrophobicity: 0.721, potential_side_chain_H_bonds: 0},
            {code: "E", name: "Glutamic acid", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Negative charge",
              essentiality: "Non essential", side_chain_flexibility: "High", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 129, isoelectric_point: 3.2, hydrophobicity: 0.458, potential_side_chain_H_bonds: 4},
            {code: "Q", name: "Glutamine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Uncharged",
              essentiality: "Non essential", side_chain_flexibility: "High", chemical_group_in_side_chain: "Amide",
              molecular_weight: 128, isoelectric_point: 5.7, hydrophobicity: 0.43, potential_side_chain_H_bonds: 5},
            {code: "G", name: "Glycine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Non essential", side_chain_flexibility: "No", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 57, isoelectric_point: 6, hydrophobicity: 0.77, potential_side_chain_H_bonds: 0},
            {code: "H", name: "Histidine", polarity: "Polar", r_group_structure: "Aromatic", charge: "Positive charge",
              essentiality: "Essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 137, isoelectric_point: 7.6, hydrophobicity: 0.548, potential_side_chain_H_bonds: 3},
            {code: "I", name: "Isoleucine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 113, isoelectric_point: 6, hydrophobicity: 1, potential_side_chain_H_bonds: 0},
            {code: "L", name: "Leucine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 113, isoelectric_point: 6, hydrophobicity: 0.918, potential_side_chain_H_bonds: 0},
            {code: "K", name: "Lysine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Positive charge",
              essentiality: "Essential", side_chain_flexibility: "High", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 128, isoelectric_point: 9.7, hydrophobicity: 0.263, potential_side_chain_H_bonds: 3},
            {code: "M", name: "Methionine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "High", chemical_group_in_side_chain: "Sulfur",
              molecular_weight: 131, isoelectric_point: 5.7, hydrophobicity: 0.811, potential_side_chain_H_bonds: 0},
            {code: "F", name: "Phenylalanine", polarity: "NonPolar", r_group_structure: "Aromatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 147, isoelectric_point: 5.5, hydrophobicity: 0.951, potential_side_chain_H_bonds: 0},
            {code: "P", name: "Proline", polarity: "NonPolar", r_group_structure: "Cyclic", charge: "Neutral",
              essentiality: "Non essential", side_chain_flexibility: "Restricted", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 97, isoelectric_point: 6.3, hydrophobicity: 0.678, potential_side_chain_H_bonds: 0},
            {code: "S", name: "Serine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Uncharged",
              essentiality: "Non essential", side_chain_flexibility: "Low", chemical_group_in_side_chain: "Hydroxyl",
              molecular_weight: 87, isoelectric_point: 5.7, hydrophobicity: 0.601, potential_side_chain_H_bonds: 3},
            {code: "T", name: "Threonine", polarity: "Polar", r_group_structure: "Aliphatic", charge: "Uncharged",
              essentiality: "Essential", side_chain_flexibility: "Low", chemical_group_in_side_chain: "Hydroxyl",
              molecular_weight: 101, isoelectric_point: 5.6, hydrophobicity: 0.634, potential_side_chain_H_bonds: 3},
            {code: "W", name: "Tryptophan", polarity: "NonPolar", r_group_structure: "Aromatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 186, isoelectric_point: 5.9, hydrophobicity: 0.854, potential_side_chain_H_bonds: 1},
            {code: "Y", name: "Tyrosine", polarity: "Polar", r_group_structure: "Aromatic", charge: "Uncharged",
              essentiality: "Non essential", side_chain_flexibility: "Moderate", chemical_group_in_side_chain: "Hydroxyl",
              molecular_weight: 163, isoelectric_point: 5.7, hydrophobicity: 0.714, potential_side_chain_H_bonds: 3},
            {code: "V", name: "Valine", polarity: "NonPolar", r_group_structure: "Aliphatic", charge: "Neutral",
              essentiality: "Essential", side_chain_flexibility: "Low", chemical_group_in_side_chain: "Methylene",
              molecular_weight: 99, isoelectric_point: 6, hydrophobicity: 0.923, potential_side_chain_H_bonds: 0},
        ],
        text_original: "Original Amino Acid",
        text_alternative: "Alternative Amino Acid",
        originalSetted: null,
        alternativeSetted: null,
        aminoAcidSelectedList: [],
        headers: [],
        showTable: false,
        errorNeedSelectBoth: false,
        errorSameAmino: false,
        arrayValuesCombination: [],
        aminoAcidListOrdered: [],
        coefficient: null,
      }
    },
    computed: {
      ...mapState([
          "analyzeSubstitutionPanel", 'isEpitopeSurf'
      ]),
      ...mapGetters({
        compound_query: 'build_query',
      }),
      selectedOriginalAmino: {
        get() {
          return this.originalSetted;
        },
        set(value){
          this.originalSetted = value;
          if(value !== null) {
            let original = this.aminoAcidList.filter(elem => elem.code === this.originalSetted);
            original[0]['role'] = "Original";
            this.aminoAcidSelectedList[0] = original[0];
          }
        }
      },
      selectedAlternativeAmino: {
        get() {
          return this.alternativeSetted;
        },
        set(value){
          this.alternativeSetted = value;
          if(value !== null) {
            let alternative = this.aminoAcidList.filter(elem => elem.code === this.alternativeSetted);
            alternative[0]['role'] = "Alternative";
            this.aminoAcidSelectedList[1] = alternative[0];
          }
        }
      },
      calculateCoefficient(){
        if(this.originalSetted !== null && this.alternativeSetted !== null) {
          return this.coefficient = this.retrieveCoefficient();
        }
        else{
          return 0;
        }
      }
    },
    methods: {
      ...mapMutations([
          'setFalseAnalyzeSubstitutionPanel'
      ]),
      exitMissingAminoAcid(){
        this.errorNeedSelectBoth = false;
      },
      exitErrorSameAmino(){
        this.errorSameAmino = false;
      },
      exit(){
        this.coefficient = null;
        this.showTable = false;
        this.aminoAcidSelectedList = [];
        this.alternativeSetted = null;
        this.originalSetted = null;
        this.selectedAlternativeAmino = null;
        this.selectedOriginalAmino = null;
        this.setFalseAnalyzeSubstitutionPanel();
      },
      analyzeThisSubstitution(){
        if(this.originalSetted === null || this.alternativeSetted === null){
          this.errorNeedSelectBoth = true;
        }
        else if(this.originalSetted === this.alternativeSetted){
          this.errorSameAmino = true;
        }
        else {
          this.showTable = true;
          this.aminoAcidSelectedList = [];
          let original = this.aminoAcidList.filter(elem => elem.code === this.originalSetted);
          let alternative = this.aminoAcidList.filter(elem => elem.code === this.alternativeSetted);
          original[0]['role'] = "Original";
          alternative[0]['role'] = "Alternative";
          this.aminoAcidSelectedList.push(original[0]);
          this.aminoAcidSelectedList.push(alternative[0]);
          this.coefficient = this.retrieveCoefficient();
        }
      },
      rename(inp) {
        let value_in;
        if (inp.code !== null && inp.code !== undefined) {
          value_in = inp.code;
        } else
          value_in = 'N/D(not defined)';
        return value_in;
      },
      createArrayValueCombination(){
        /*let array = [
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
            ["A", "B", 0],
        ];*/

        let array =
          //[A,     R,      N,      D,      C,      E,      Q,      G,      H,      I,      L,      K,      M,      F,      P,      S,      T,      W,      Y,     V]
        [
            [0,   112,    111,    126,    195,    107,     91,     60,     86,     94,     96,    106,     84,    113,     27,     99,     58,    148,    112,    64],   // A
            [112,   0,     86,     96,    180,     54,     43,    125,     29,     97,    102,     26,     91,     97,    103,    110,     71,    101,     77,    96],   // R
            [111,  86,      0,     23,    139,     42,     46,     80,     68,    149,    153,     94,    142,    158,     91,     46,     65,    174,    143,   133],   // N
            [126,  96,     23,      0,    154,     45,     61,     94,     81,    168,    172,    101,    160,    177,    108,     65,     85,    181,    160,   152],   // D
            [195, 180,    139,    154,      0,    170,    154,    159,    174,    198,    198,    202,    196,    205,    169,    112,    149,    215,    194,   192],   // C
            [107,  54,     42,     45,    170,      0,     29,     98,     40,    134,    138,     56,    126,    140,     93,     80,     65,    152,    122,   121],   // E
            [ 91,  43,     46,     61,    154,     29,      0,     87,     24,    109,    113,     53,    101,    116,     76,     68,     42,    130,     99,    96],   // Q
            [ 60, 125,     80,     94,    159,     98,     87,      0,     98,    135,    138,    127,    127,    153,     42,     56,     59,    184,    147,   109],   // G
            [ 86,  29,     68,     81,    174,     40,     24,     98,      0,     94,     99,     32,     87,    100,     77,     89,     47,    115,     83,    84],   // H
            [ 94,  97,    149,    168,    198,    134,    109,    135,     94,      0,      5,    102,     10,     21,     95,    142,     89,     61,     33,    29],   // I
            [ 96, 102,    153,    172,    198,    138,    113,    138,     99,      5,      0,    107,     15,     22,     98,    145,     92,     61,     36,    32],   // L
            [106,  26,     94,    101,    202,     56,     53,    127,     32,    102,    107,      0,     95,    102,    103,    121,     78,    110,     85,    97],   // K
            [ 84,  91,    142,    160,    196,    126,    101,    127,     87,     10,     15,     95,      0,     28,     87,    135,     81,     67,     36,    21],   // M
            [113,  97,    158,    177,    205,    140,    116,    153,    100,     21,     22,    102,     28,      0,    114,    155,    103,     40,     22,    50],   // F
            [ 27, 103,     91,    108,    169,     93,     76,     42,     77,     95,     98,    103,     87,    114,      0,     74,     38,    147,    110,    68],   // P
            [ 99, 110,     46,     65,    112,     80,     68,     56,     89,    142,    145,    121,    135,    155,     74,      0,     58,    177,    144,   124],   // S
            [ 58,  71,     65,     85,    149,     65,     42,     59,     47,     89,     92,     78,     81,    103,     38,     58,      0,    128,     92,    69],   // T
            [148, 101,    174,    181,    215,    152,    130,    184,    115,     61,     61,    110,     67,     40,    147,    177,    128,      0,     37,    88],   // W
            [112,  77,    143,    160,    194,    122,     99,    147,     83,     33,     36,     85,     36,     22,    110,    144,     92,     37,      0,    55],   // Y
            [ 64,  96,    133,    152,    192,    121,     96,    109,     84,     29,     32,     97,     21,     50,     68,    124,     69,     88,     55,     0],   // V
        ];

        this.arrayValuesCombination = array;
      },
      retrieveCoefficient(){
        let newArray = this.arrayValuesCombination;

        let original = this.aminoAcidList.filter(elem => elem.code === this.originalSetted);
        let alternative = this.aminoAcidList.filter(elem => elem.code === this.alternativeSetted);
        let x = this.aminoAcidList.indexOf(original[0]);
        let y = this.aminoAcidList.indexOf(alternative[0]);

        return newArray[x][y];

        /*let len = newArray.length;
        let i = 0;
        while(i < len){
          if(newArray[i][0] === this.originalSetted && newArray[i][1] === this.alternativeSetted){
            return newArray[i][2];
          }
          i++;
        }
        return 0;*/
      }
    },
    watch: {
      analyzeSubstitutionPanel(){
        this.analyzeSubPanel = this.analyzeSubstitutionPanel;
      },
      aminoAcidSelectedList(){
        //console.log("a", this.originalSetted, this.alternativeSetted);
        /*if(this.originalSetted === this.alternativeSetted){
          this.errorSameAmino = true;
        }
        else {
          this.showTable = true;
          this.aminoAcidSelectedList = [];
          if(this.originalSetted !== null && this.alternativeSetted !== null) {
            this.coefficient = this.retrieveCoefficient();
          }
        }*/
      },
    },
  mounted() {
    let newAminoAcidList = JSON.parse(JSON.stringify(this.aminoAcidList));

    this.aminoAcidListOrdered = newAminoAcidList.sort(function(a, b){
                return (a.code.charCodeAt(0)) - (b.code.charCodeAt(0));
            });

    this.headers = [];
    let pred_head = [];
    Object.keys(this.aminoAcidList[0]).forEach(key => {
      let header = {};
      header['text'] = key.toUpperCase().replaceAll("_", " ");
      header['value'] = key;
      header['sortable'] = false;
      header['class']  ='black--text';
      pred_head.push(header);
    });
    let header_type = {};
    header_type['text'] = "ROLE";
    header_type['value'] = "role";
    header_type['sortable'] = false;
    header_type['class']  ='black--text';
    pred_head.splice(2,0,header_type);
    this.headers = pred_head;
    this.createArrayValueCombination();
  }
}
</script>

<style scoped>
  .EpitopeSelectors{
    padding: 20px;
    margin-bottom: 10px;
  }

  table td {
      border: solid darkgray 1px;
  }

  th, td {
    padding: 10px;
  }

  tr:hover {background-color: #f5f5f5}

</style>