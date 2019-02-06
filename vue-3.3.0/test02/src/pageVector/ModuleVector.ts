import {Module,} from 'vuex';
import {GetterTree,} from 'vuex';
import {ActionTree,} from 'vuex';
import {ActionContext,} from 'vuex';
import {MutationTree,} from 'vuex';
import {ModuleTree,} from 'vuex';
import {StateRoot,} from '../store';
import utilGetUniqueKey from '../util/utilGetUniqueKey';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface StateVector {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StateVector = {
};

const getters: GetterTree<StateVector, StateRoot> = {
};

const actions: ActionTree<StateVector, StateRoot> = {
};

const mutations: MutationTree<StateVector> = {
};

const modules: ModuleTree<StateRoot> = {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const ModuleVector: Module<StateVector, StateRoot> = {
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
	modules,
};

export default ModuleVector;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
