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

export interface StateTop {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StateTop = {
};

const getters: GetterTree<StateTop, StateRoot> = {
};

const actions: ActionTree<StateTop, StateRoot> = {
};

const mutations: MutationTree<StateTop> = {
};

const modules: ModuleTree<StateRoot> = {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const ModuleTop: Module<StateTop, StateRoot> = {
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
	modules,
};

export default ModuleTop;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
