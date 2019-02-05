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

export interface StateVector {
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

const state: StateVector = {
	step: 1,
	width: 300,
	height: 300,
	radiusScale: 1,
	matrix: mat4.create(),
};

const getters: GetterTree<StateVector, StateRoot> = {
	[getterStep]: (state: StateVector): number => state.step,
	[getterWidth]: (state: StateVector): number => state.width,
	[getterHeight]: (state: StateVector): number => state.height,
	[getterRadiusScale]: (state: StateVector): number => state.radiusScale,
	[getterMatrix]: (state: StateVector): mat4 => state.matrix,
};

const actions: ActionTree<StateVector, StateRoot> = {
};

const mutations: MutationTree<StateVector> = {
	[mutationStepAdd]: (state: StateVector): void => {state.step++;},
	[mutationRadiusScaleSet]: (state: StateVector, radiusScale: number): void => {state.radiusScale = radiusScale;},
	[mutationMatrixSet]: (state: StateVector, matrix: mat4): void => {state.matrix = matrix;},
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
