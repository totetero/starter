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

export interface StateTest {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StateTest = {
};

const getters: GetterTree<StateTest, StateRoot> = {
};

const actions: ActionTree<StateTest, StateRoot> = {
};

const mutations: MutationTree<StateTest> = {
};

const modules: ModuleTree<StateRoot> = {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const ModuleTest: Module<StateTest, StateRoot> = {
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
	modules,
};

export default ModuleTest;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
