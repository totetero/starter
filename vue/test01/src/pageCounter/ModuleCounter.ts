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

export interface StateCounter {
	count: number;
};

export const getterCount: string = utilGetUniqueKey();
export const actionIncrement: string = utilGetUniqueKey();
export const mutationIncrement: string = utilGetUniqueKey();
export const mutationDecrement: string = utilGetUniqueKey();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StateCounter = {
	count: 1,
};

const getters: GetterTree<StateCounter, StateRoot> = {
	[getterCount]: (state: StateCounter): number => state.count,
};

const actions: ActionTree<StateCounter, StateRoot> = {
	[actionIncrement]: (context: ActionContext<StateCounter, StateRoot>): Promise<void> => new Promise<void>((resolve: ()=>void): void => {
		setTimeout((): void => {
			context.commit(mutationIncrement);
			resolve();
		}, 0);
	}),
};

const mutations: MutationTree<StateCounter> = {
	[mutationIncrement]: (state: StateCounter): void => {state.count++;},
	[mutationDecrement]: (state: StateCounter): void => {state.count--;},
};

const modules: ModuleTree<StateRoot> = {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const ModuleCounter: Module<StateCounter, StateRoot> = {
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
	modules,
};

export default ModuleCounter;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
