import Vue from 'vue'
import Vuex from 'vuex'
import {GetterTree,} from 'vuex';
import {ActionTree,} from 'vuex';
import {MutationTree,} from 'vuex';
import {ModuleTree,} from 'vuex';
import {Plugin,} from 'vuex';

import ModuleVector from './pageVector/ModuleVector';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface StateRoot {
	version: string;
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StateRoot = {
	version: '0.0.1',
};

const getters: GetterTree<StateRoot, StateRoot> = {
};

const actions: ActionTree<StateRoot, StateRoot> = {
};

const mutations: MutationTree<StateRoot> = {
};

const modules: ModuleTree<StateRoot> = {
	vector: ModuleVector,
};

const plugins: Plugin<StateRoot>[] = [
];

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

Vue.use(Vuex);

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	modules,
	plugins,
	strict: true,
});

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
