import {Module,} from 'vuex';
import {GetterTree,} from 'vuex';
import {ActionTree,} from 'vuex';
import {ActionContext,} from 'vuex';
import {MutationTree,} from 'vuex';
import {ModuleTree,} from 'vuex';
import {StateRoot,} from '../store';
import utilGetUniqueKey from '../util/utilGetUniqueKey';
import {mat4,} from 'gl-matrix';

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

export interface StatePuppet {
	step: number;
	width: number;
	height: number;
	radiusScale: number;
	matrix: mat4;
};

export const getterStep: string = utilGetUniqueKey();
export const getterWidth: string = utilGetUniqueKey();
export const getterHeight: string = utilGetUniqueKey();
export const getterRadiusScale: string = utilGetUniqueKey();
export const getterMatrix: string = utilGetUniqueKey();
export const mutationStepAdd: string = utilGetUniqueKey();
export const mutationRadiusScaleSet: string = utilGetUniqueKey();
export const mutationMatrixSet: string = utilGetUniqueKey();

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const state: StatePuppet = {
	step: 1,
	width: 300,
	height: 300,
	radiusScale: 1,
	matrix: mat4.create(),
};

const getters: GetterTree<StatePuppet, StateRoot> = {
	[getterStep]: (state: StatePuppet): number => state.step,
	[getterWidth]: (state: StatePuppet): number => state.width,
	[getterHeight]: (state: StatePuppet): number => state.height,
	[getterRadiusScale]: (state: StatePuppet): number => state.radiusScale,
	[getterMatrix]: (state: StatePuppet): mat4 => state.matrix,
};

const actions: ActionTree<StatePuppet, StateRoot> = {
};

const mutations: MutationTree<StatePuppet> = {
	[mutationStepAdd]: (state: StatePuppet): void => {state.step++;},
	[mutationRadiusScaleSet]: (state: StatePuppet, radiusScale: number): void => {state.radiusScale = radiusScale;},
	[mutationMatrixSet]: (state: StatePuppet, matrix: mat4): void => {state.matrix = matrix;},
};

const modules: ModuleTree<StateRoot> = {
};

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------

const ModulePuppet: Module<StatePuppet, StateRoot> = {
	namespaced: false,
	state,
	getters,
	actions,
	mutations,
	modules,
};

export default ModulePuppet;

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// ----------------------------------------------------------------
