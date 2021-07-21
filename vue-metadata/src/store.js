import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        query: {
            taxon_name: ["severe acute respiratory syndrome coronavirus 2"]
        },
        synonym: false,
        kv: {},
        type: 'original',
        graphSourceId: null,
        extraMetadataSourceId: null,
        count: null,
        showGraphQuery: false,
        keys: [],
        panelActive: [],
        numerical: new Set(),
        exampleQueryLoaded: null,
        epiQuerySel: {
            "product": ['Spike (surface glycoprotein)'],
        },
        epiQuerySelWithoutVariants: {
            "product": ['Spike (surface glycoprotein)'],
        },
        aminoacidConditions: {},
        countSeq: null,          // metadata + epitope + aminoacid
        countSeq2: null,         //only metadata
        countSeq3: null,         //metadata + aminoacid
        countSeq4: null,         //metadata + epitope
        countEpi: null,
        countEpiWithoutVariants: null,
        countEpiCustom: null,
        countEpiToShow: null,
        showSequenceEpiTable: false,
        showTotalMutationStatistics: false,
        chosenEpitope: null,
        showAminoacidVariantEpi: false,
        epitopeAminoacidFields: [],
        disableSelectorEpitopePart: false,
        epitopeAdded: [],
        newSingleEpitope: {},
        newEpitopeLoading: false,
        showSequenceEpiTableUser: false,
        showMoreInfoEpitopeUser: false,
        userEpitopeSelected: null,
        showAminoacidVariantUserNewEpi: false,
        epitopeAminoacidConditionsArrayUserNew: [],
        epitopeAminoacidConditionsArrayUserNewInOR: [],
        disableSelectorUserNewEpitopePart: false,
        newSingleAminoAcidConditionUser: {},
        isEpitopeSurf: false,
        addingEpitope: false,
        exampleCustomEpitope: false,
        selectedTabEpitope: 0,
        analyzeSubstitutionPanel: false,
        finish_count_population: true,
        fromPredefinedQuery: false,
        appliedActuaQuery: true,
        myIntervalCountSeq: null,
        dontShowWarningMode3Again: false,
        dontShowWarningMode1Again: false,
    },
    getters: {
        showGraphDialog: (state) => state.graphSourceId != null,
        showExtraMetadataDialog: (state) => state.extraMetadataSourceId != null,
        build_query: state => {
            let res = {};
            Object.assign(res, {"gcm": state.query}, {"type": state.type}, {"kv": state.kv})
            return res
        },
        build_query_epi: state => {
            let res = {};
            Object.assign(res, {"gcm": state.query}, {"type": state.type}, {"kv": state.kv}, {"epi": state.epiQuerySel})
            return res
        },
        keysEmpty: (state) => state.keys.length === 0,
        panels: state => Object.keys(state.kv),
        epiSearchDisabled: state => {
            let res = true;
            if(state.query['taxon_name'] && state.query['host_taxon_name'] ){
                if(state.query['taxon_name'].length === 1 && state.query['host_taxon_name'].length === 1 ) {
                    res = false;
                }
            }
            return res;
        },
    },
    mutations: {
        setQueryStartEpi:(state)=>{
            state.query = {
                taxon_name: ["severe acute respiratory syndrome coronavirus 2"],
                host_taxon_name: ["homo sapiens"]
            }
        },
        setExampleQueryLoaded:(state)=>{
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)
            console.log("snew Date().getTime()",new Date().getTime())
            state.exampleQueryLoaded = new Date().getTime();
            console.log("state.exampleQueryLoaded",state.exampleQueryLoaded)

        },
        setPanelActive: (state, value) => {
            state.panelActive.push(value);
        },
        resetPanelActive: (state) => {
            state.panelActive = [];
        },
        setSearch: (state, value) => {
            state.searchDisabled = value;
        },
        pushKey: (state, key) => {
            // let filtered = state.keys.filter(function (value) {
            //     return (
            //         value.query_text === key.query_text &&
            //         value.query_type=== key.query_type &&
            //         value.exact === key.exact
            //     )
            // });
            // if (filtered.length === 0) {
            state.keys.push(key);
            // } else {
            //     window.alert("Duplicate Key")
            // }
        },
        deleteKey: (state, key) => {
            var filtered = state.keys.filter(function (value) {
                return value.id !== key
            });
            state.keys = Object.assign([], filtered)
        },
        setQuery: (state, query) => {
            state.query = Object.assign({}, query);
        },
        setKvField: (state, payload) => {
            state.kv[payload.search_text] = payload.kv
        },
        reloadKv: (state) => {
            state.kv = Object.assign({}, state.kv);
        },
        resetKvField: (state, field) => {
            delete state.kv[field]
        },
        resetKv: (state) => {
            state.keys = [];
            state.kv = {}
        },
        setType: (state, type) => {
            state.type = type;
        },
        resetType: (state) => {
            state.type = 'original';
        },
        //reload the query
        reloadQuery: (state) => {
            state.query = Object.assign({}, state.query);
        },
        reloadEpiQuery: (state) => {
            state.epiQuerySel = Object.assign({}, state.epiQuerySel);
        },
        reloadEpiQueryWithoutVariants: (state) => {
            state.epiQuerySelWithoutVariants = Object.assign({}, state.epiQuerySelWithoutVariants);
        },
        reloadAminoacidConditions: (state) => {
            state.aminoacidConditions = Object.assign({}, state.aminoacidConditions);
        },
        reloadNewSingleEpitope: (state) => {
            state.newSingleEpitope = Object.assign({}, state.newSingleEpitope);
        },
        reloadNewSingleAminoAcidConditionUser: (state) => {
            state.newSingleAminoAcidConditionUser = Object.assign({}, state.newSingleAminoAcidConditionUser);
        },
        setQueryField: (state, payload) => {
            state.query[payload.field] = payload.fieldQuery;
            // Vue.set(state.query, payload.field, payload.list);
        },
        setEpiQueryField: (state, payload) => {
            state.epiQuerySel[payload.field] = payload.fieldQuery;
        },
         setEpiQueryFieldWithoutVariants: (state, payload) => {
            state.epiQuerySelWithoutVariants[payload.field] = payload.fieldQuery;
        },
        setAminoacidConditions: (state, payload) => {
            state.aminoacidConditions[payload.field] = payload.fieldQuery;
        },
        setNewSingleEpitope: (state, payload) => {
            state.newSingleEpitope[payload.field] = payload.fieldQuery;
        },
        setNewSingleAminoAcidConditionUser: (state, payload) => {
            state.newSingleAminoAcidConditionUser[payload.field] = payload.fieldQuery;
        },
        resetQueryField: (state, field) => {
            delete state.query[field];
            // Vue.delete(state.query, field);
        },
        resetEpiQueryField: (state, field) => {
            delete state.epiQuerySel[field];
        },
        resetEpiQueryFieldWithoutVariants: (state, field) => {
            delete state.epiQuerySelWithoutVariants[field];
        },
        resetAminoacidConditions: (state, field) => {
            delete state.aminoacidConditions[field];
        },
        resetNewSingleEpitope: (state, field) => {
            delete state.newSingleEpitope[field];
        },
        resetNewSingleAminoAcidConditionUser: (state, field) => {
            delete state.newSingleAminoAcidConditionUser[field];
        },
        resetQuery: (state) => {
            if(/gisaid/.test(window.location.href)) {
                let taxon_name = state.query["taxon_name"];
                state.query = {"taxon_name": taxon_name};
            }
            else{
                state.query = {};
            }
        },
        setEpiQuery: (state, query) => {
            state.epiQuerySel = Object.assign({}, query);
        },
        setEpiQueryWithoutVariants: (state, query) => {
            state.epiQuerySelWithoutVariants = Object.assign({}, query);
        },
        resetEpiQuery: (state) => {
            let protein = state.epiQuerySel["product"]
            state.epiQuerySel = {"product": protein}
        },
        resetEpiQueryWithoutVariants: (state) => {
            let protein = state.epiQuerySelWithoutVariants["product"]
            state.epiQuerySelWithoutVariants = {"product": protein}
        },
        setAminoacidConditionQuery: (state, query) => {
            state.aminoacidConditions = Object.assign({}, query);
        },
        resetAminoacidConditionQuery: (state) => {
            state.aminoacidConditions = {}
        },
        setNewSingleEpitopeQuery: (state, query) => {
            state.newSingleEpitope = Object.assign({}, query);
        },
        resetNewSingleEpitopeQuery: (state) => {
            state.newSingleEpitope = {}
        },
        setNewSingleAminoacidConditionUserQuery: (state, query) => {
            state.newSingleAminoAcidConditionUser = Object.assign({}, query);
        },
        resetNewSingleAminoacidConditionUserQuery: (state) => {
            state.newSingleAminoAcidConditionUser = {}
        },
        setTrueExampleCustomEpitope: (state) => {
            state.exampleCustomEpitope = true;
        },
        setFalseExampleCustomEpitope: (state) => {
            state.exampleCustomEpitope = false;
        },
        setTrueFinishCountPopulation: (state) => {
            state.finish_count_population = true;
        },
        setFalseFinishCountPopulation: (state) => {
            state.finish_count_population = false;
        },
        setTrueFromPredefinedQuery: (state) => {
            state.fromPredefinedQuery = true;
        },
        setFalseFromPredefinedQuery: (state) => {
            state.fromPredefinedQuery = false;
        },
        openGraphDialog: (state, sourceId) => {
            state.graphSourceId = sourceId;
        },
        openExtraMetadataDialog: (state, sourceId) => {
            state.extraMetadataSourceId = sourceId;
        },
        closeDialog: (state) => {
            state.graphSourceId = null;
            state.extraMetadataSourceId = null;
            state.showGraphQuery = false;
        },
        setCount: (state, count) => {
            state.count = count;
        },
        setQueryGraph: (state, input) => {
            state.showGraphQuery = input;
        },
        setCountSeq: (state, count) => {
            state.countSeq = count;
        },
        setCountSeq2: (state, count) => {
            state.countSeq2 = count;
        },
        setCountSeq3: (state, count) => {
            state.countSeq3 = count;
        },
        setCountSeq4: (state, count) => {
            state.countSeq4 = count;
        },
        setCountEpi: (state, count) => {
            state.countEpi = count;
        },
        setCountEpiWithoutVariants: (state, count) => {
            state.countEpiWithoutVariants = count;
        },
        setCountEpiCustom: (state, count) => {
            state.countEpiCustom = count;
        },
        setCountEpiToShow: (state, count) => {
            state.countEpiToShow = count;
        },
        showSeqEpiTable: (state) => {
            state.showSequenceEpiTable = !state.showSequenceEpiTable;
        },
        showSeqEpiTableUser: (state) => {
            state.showSequenceEpiTableUser = !state.showSequenceEpiTableUser;
        },
        showTotMutStatistics: (state) => {
            state.showTotalMutationStatistics = !state.showTotalMutationStatistics;
        },
        showMoreInfo: (state) => {
            state.showMoreInfoEpitopeUser = !state.showMoreInfoEpitopeUser;
        },
        showWarningMode3: (state) => {
            state.dontShowWarningMode3Again = !state.dontShowWarningMode3Again;
        },
        showWarningMode1: (state) => {
            state.dontShowWarningMode1Again = !state.dontShowWarningMode1Again;
        },
        setChosenEpitope: (state, item) => {
            state.chosenEpitope = item;
        },
        setUserEpitopeSelected: (state, index) => {
            state.userEpitopeSelected = index;
        },
        setTrueShowAminoacidVariantEpi: (state) => {
            state.showAminoacidVariantEpi = true;
        },
        setFalseShowAminoacidVariantEpi: (state) => {
            state.showAminoacidVariantEpi = false;
        },
        setTrueShowAminoacidVariantUserNewEpi: (state) => {
            state.showAminoacidVariantUserNewEpi = true;
        },
        setFalseShowAminoacidVariantUserNewEpi: (state) => {
            state.showAminoacidVariantUserNewEpi = false;
        },
        setEpitopeAminoacidFields: (state, item) => {
            state.epitopeAminoacidFields = item;
        },
        addEpitopeAminoacidConditionsArrayUserNew: (state, new_condition) => {
            state.epitopeAminoacidConditionsArrayUserNew.push(new_condition);
        },
        removeEpitopeAminoacidConditionsArrayUserNew: (state, index) => {
            state.epitopeAminoacidConditionsArrayUserNew.splice(index, 1);
        },
        resetEpitopeAminoacidConditionsArrayUserNew: (state) => {
            state.epitopeAminoacidConditionsArrayUserNew = [];
        },
        addEpitopeAminoacidConditionsArrayUserNewInOR: (state, new_condition) => {
            state.epitopeAminoacidConditionsArrayUserNewInOR.push(new_condition);
        },
        removeEpitopeAminoacidConditionsArrayUserNewInOR: (state, index) => {
            state.epitopeAminoacidConditionsArrayUserNewInOR.splice(index, 1);
        },
        resetEpitopeAminoacidConditionsArrayUserNewInOR: (state) => {
            state.epitopeAminoacidConditionsArrayUserNewInOR = [];
        },
        setTrueDisableSelectorEpitopePart: (state) => {
            state.disableSelectorEpitopePart = true;
        },
        setFalseDisableSelectorEpitopePart: (state) => {
            state.disableSelectorEpitopePart = false;
        },
        setTrueDisableSelectorUserNewEpitopePart: (state) => {
            state.disableSelectorUserNewEpitopePart = true;
        },
        setFalseDisableSelectorUserNewEpitopePart: (state) => {
            state.disableSelectorUserNewEpitopePart = false;
        },
        addNewEpitopeToList: (state, new_epitope) => {
            state.epitopeAdded.push(new_epitope);
        },
        refreshEpitopeInList: (state, new_epitope) => {
            state.epitopeAdded.splice(new_epitope.index, 0, new_epitope.epitope);
        },
        removeNewEpitopeFromList: (state, index) => {
            state.epitopeAdded.splice(index, 1);
        },
        resetNewEpitopeFromLocalStorage: (state, epitopeArr) => {
            state.epitopeAdded = epitopeArr;
        },
        removePositionFromNewEpitope: (state, index) => {
            state.newSingleEpitope['position_range'].splice(index, 1);
        },
        setTrueNewEpitopeLoading: (state) => {
            state.newEpitopeLoading = true;
        },
        setFalseNewEpitopeLoading: (state) => {
            state.newEpitopeLoading = false;
        },
        setTrueIsEpitopeSurf: (state) => {
            state.isEpitopeSurf = true;
        },
        setFalseIsEpitopeSurf: (state) => {
            state.isEpitopeSurf = false;
        },
        changeAddingEpitope: (state) => {
            state.addingEpitope = !state.addingEpitope;
        },
        setSelectedTabEpitopeToCustom: (state) => {
            state.selectedTabEpitope = 0;
        },
        setSelectedTabEpitopeToEpitopeVariants: (state) => {
            state.selectedTabEpitope = 2;
        },
        setSelectedTabEpitopeToEpitopeWithoutVariants: (state) => {
            state.selectedTabEpitope = 1;
        },
        setTrueAnalyzeSubstitutionPanel: (state) => {
            state.analyzeSubstitutionPanel = true;
        },
        setFalseAnalyzeSubstitutionPanel: (state) => {
            state.analyzeSubstitutionPanel = false;
        },
        setTrueAppliedActuaQuery: (state) => {
            state.appliedActuaQuery = true;
        },
        setFalseAppliedActuaQuery: (state) => {
            state.appliedActuaQuery = false;
        },
        setMyIntervalCountSeq: (state, poll) => {
            state.myIntervalCountSeq = poll;
        },
    },
    actions: {
        deleteKv({commit}, field) {
            commit('resetKvField', field);
            commit('reloadKv');
        },
        setKv({commit}, payload) {
            commit('setKvField', payload);
            commit('reloadKv');
        },
        setKvFull: ({commit, state}, payload) => {
            commit('resetKv');
            let i=0;
            Object.keys(payload).forEach(key => {
                const val = payload[key];
                let a = {
                        'id': i,
                        'query_text': val.type_query,
                        'query_type': val.type_query,
                        'exact': false
                    };
                i=i+1;
                commit('pushKey', a)
            });
            if (Object.keys(payload).length === 0)
                commit('resetKv');
            else
                state.kv = payload;
            commit('reloadKv')
        },
        /*setAge({commit, state}, age_item) {
            state.query['age'] = age_item;
            commit('reloadQuery')
        },
        deleteAge({commit}) {
            commit('resetQueryField', 'age');
            commit('reloadQuery')
        },*/

        setNumerical({commit, state}, payload) {
            const field = payload.field;
            state.query[field] = payload.setting_a;
            state.numerical.add(field);
            commit('reloadQuery')
        },

        deleteNumerical({commit}, field) {
            commit('resetQueryField', field);
            commit('reloadQuery')
        },

        setDate({commit, state}, payload) {
            const field = payload.field;
            state.query[field] = payload.setting_a;
            state.numerical.add(field);
            commit('reloadQuery')
        },

        deleteDate({commit}, field) {
            commit('resetQueryField', field);
            commit('reloadQuery')
        },

        setDropDownSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.query[field];
            if (!previousList)
                previousList = [];

            //update if they are not equal
            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setQueryField', newPayload);
                } else
                    commit('resetQueryField', field);
                commit('reloadQuery');
            }
        },
        setEpiDropDownSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.epiQuerySel[field];
            if (!previousList)
                previousList = [];

            //update if they are not equal
            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setEpiQueryField', newPayload);
                } else
                    commit('resetEpiQueryField', field);
                commit('reloadEpiQuery');
            }
        },
        setEpiDropDownSelectedWithoutVariants({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.epiQuerySelWithoutVariants[field];
            if (!previousList)
                previousList = [];

            //update if they are not equal
            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setEpiQueryFieldWithoutVariants', newPayload);
                } else
                    commit('resetEpiQueryFieldWithoutVariants', field);
                commit('reloadEpiQueryWithoutVariants');
            }
        },
        setAminoacidConditionsSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.aminoacidConditions[field];
            if (!previousList)
                previousList = [];

            if (!(JSON.stringify(previousList) === JSON.stringify(newList))) {
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setAminoacidConditions', newPayload);
                } else
                    commit('resetAminoacidConditions', field);
                commit('reloadAminoacidConditions');
            }
        },
        setNewSingleEpitopeSelected({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.newSingleEpitope[field];
            if (!previousList)
                previousList = [];

            if ((!(JSON.stringify(previousList) === JSON.stringify(newList))) || newList.length === 0){
                if (newList.length > 0) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setNewSingleEpitope', newPayload);
                } else {
                    commit('resetNewSingleEpitope', field);
                }
                commit('reloadNewSingleEpitope');
            }
        },
        setNewSingleAminoAcidConditionUserAction({commit, state}, payload) {
            const field = payload.field;

            let newList = payload.list;
            if (!newList)
                newList = [];

            let previousList = state.newSingleAminoAcidConditionUser[field];
            if (!previousList)
                previousList = [];

            if ((!(JSON.stringify(previousList) === JSON.stringify(newList))) || newList.length === 0){
                if (newList.length > 0 || newList['min_val']) {
                    const newPayload = {field: field, fieldQuery: newList};
                    commit('setNewSingleAminoAcidConditionUser', newPayload);
                } else {
                    commit('resetNewSingleAminoAcidConditionUser', field);
                }
                commit('reloadNewSingleAminoAcidConditionUser');
            }
        },
    },
})
