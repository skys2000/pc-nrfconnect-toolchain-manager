/* Copyright (c) 2015 - 2018, Nordic Semiconductor ASA
 *
 * All rights reserved.
 *
 * Use in source and binary forms, redistribution in binary form only, with
 * or without modification, are permitted provided that the following conditions
 * are met:
 *
 * 1. Redistributions in binary form, except as embedded into a Nordic
 *    Semiconductor ASA integrated circuit in a product or a software update for
 *    such product, must reproduce the above copyright notice, this list of
 *    conditions and the following disclaimer in the documentation and/or other
 *    materials provided with the distribution.
 *
 * 2. Neither the name of Nordic Semiconductor ASA nor the names of its
 *    contributors may be used to endorse or promote products derived from this
 *    software without specific prior written permission.
 *
 * 3. This software, with or without modification, must only be used with a Nordic
 *    Semiconductor ASA integrated circuit.
 *
 * 4. Any software provided in binary form under this license must not be reverse
 *    engineered, decompiled, modified and/or disassembled.
 *
 * THIS SOFTWARE IS PROVIDED BY NORDIC SEMICONDUCTOR ASA "AS IS" AND ANY EXPRESS OR
 * IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY, NONINFRINGEMENT, AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL NORDIC SEMICONDUCTOR ASA OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import semver from 'semver';
import environmentReducer from './Environment/environmentReducer';

const byVersion = (a, b) => {
    try {
        return -semver.compare(a.version, b.version);
    } catch (_) {
        switch (true) {
            case (a.version < b.version): return -1;
            case (a.version > b.version): return 1;
            default: return 0;
        }
    }
};

const sortedByVersion = list => [...list].sort(byVersion);

const SELECT_ENVIRONMENT = 'SELECT_ENVIRONMENT';
export const selectEnvironment = selectedVersion => ({
    type: SELECT_ENVIRONMENT,
    selectedVersion,
});

const ADD_ENVIRONMENT = 'ADD_ENVIRONMENT';
export const addEnvironment = environment => ({
    type: ADD_ENVIRONMENT,
    environment,
});

const REMOVE_ENVIRONMENT = 'REMOVE_ENVIRONMENT';
export const removeEnvironment = version => ({
    type: REMOVE_ENVIRONMENT,
    version,
});

const CLEAR_ENVIRONMENTS = 'CLEAR_ENVIRONMENTS';
export const clearEnvironments = () => ({
    type: CLEAR_ENVIRONMENTS,
});

const SET_VERSION_TO_INSTALL = 'SET_VERSION_TO_INSTALL';
export const setVersionToInstall = version => ({
    type: SET_VERSION_TO_INSTALL,
    version,
});

const SHOW_CONFIRM_REMOVE_DIALOG = 'SHOW_CONFIRM_REMOVE_DIALOG';
export const showConfirmRemoveDialog = version => ({
    type: SHOW_CONFIRM_REMOVE_DIALOG,
    version,
});

const HIDE_CONFIRM_REMOVE_DIALOG = 'HIDE_CONFIRM_REMOVE_DIALOG';
export const hideConfirmRemoveDialog = () => ({
    type: HIDE_CONFIRM_REMOVE_DIALOG,
});

const append = (environments, environment) => ({
    ...environments,
    [environment.version]: {
        ...environments[environment.version] || {},
        ...environment,
    },
});

const remove = (environments, version) => {
    if (environments[version] == null) {
        console.error(`No environment version found for ${version}`);
        return environments;
    }

    const newEnvironments = { ...environments };
    const environmentIsOnlyLocal = !environments[version].toolchains;
    if (environmentIsOnlyLocal) {
        delete newEnvironments[version];
    } else {
        newEnvironments[version] = {
            ...newEnvironments[version],
            toolchainDir: null,
        };
    }

    return newEnvironments;
};

const managerReducer = (state, action) => {
    switch (action.type) {
        case ADD_ENVIRONMENT:
            return { ...state, environments: append(state.environments, action.environment) };
        case CLEAR_ENVIRONMENTS:
            return { ...state, environments: {} };
        case REMOVE_ENVIRONMENT:
            return { ...state, environments: remove(state.environments, action.version) };
        case SET_VERSION_TO_INSTALL:
            return { ...state, versionToInstall: action.version };
        case SHOW_CONFIRM_REMOVE_DIALOG:
            return { ...state, isRemoveDirDialogVisible: true, versionToRemove: action.version };
        case HIDE_CONFIRM_REMOVE_DIALOG:
            return { ...state, isRemoveDirDialogVisible: false, versionToRemove: null };
        case SELECT_ENVIRONMENT:
            return { ...state, selectedVersion: action.selectedVersion };
        default:
            return state;
    }
};

const maybeCallEnvironmentReducer = (state, action) => {
    if (action.version == null || state.environments[action.version] == null) {
        return state;
    }

    return {
        ...state,
        environments: {
            ...state.environments,
            [action.version]: environmentReducer(state.environments[action.version], action),
        },
    };
};

const initialState = {
    environments: {},
    isRemoveDirDialogVisible: false,
    versionToInstall: null,
    versionToRemove: null,
    selectedVersion: null,
};

export default (state = initialState, action) => {
    const stateAfterEnvironmentReducer = maybeCallEnvironmentReducer(state, action);
    return managerReducer(stateAfterEnvironmentReducer, action);
};

export const getLatestToolchain = toolchains => sortedByVersion(toolchains).pop();

export const isRemoveDirDialogVisible = state => state.app.manager.isRemoveDirDialogVisible;

export const environmentToRemove = state => (
    state.app.manager.environments[state.app.manager.versionToRemove]);
export const environmentToInstall = state => (
    state.app.manager.environments[state.app.manager.versionToInstall]);

export const selectedVersion = state => state.app.manager.selectedVersion;

export const environmentsByVersion = state => (
    sortedByVersion(Object.values(state.app.manager.environments)));
