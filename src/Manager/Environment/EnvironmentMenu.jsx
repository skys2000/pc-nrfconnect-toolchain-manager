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

import './style.scss';

import React from 'react';
import { useDispatch } from 'react-redux';
import { exec } from 'child_process';
import path from 'path';
import { shell } from 'electron';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { cloneNcs } from './environmentEffects';
import { isInstalled, toolchainDir, version } from './environmentReducer';
import { showConfirmInstallDirDialog } from '../../InstallDir/installDirReducer';
import { showConfirmRemoveDialog } from '../managerReducer';

import environmentPropType from './environmentPropType';

const openBash = folder => {
    exec(`"${path.resolve(folder, 'git-bash.exe')}"`);
};

const openCmd = folder => {
    exec(`start cmd /k "${path.resolve(folder, 'git-cmd.cmd')}"`);
};

const openFolder = folder => {
    shell.openItem(folder);
};

const EnvironmentMenu = ({ environment }) => {
    const dispatch = useDispatch();
    return (
        <DropdownButton
            className="ml-2"
            variant="outline-primary"
            title=""
            alignRight
            disabled={!isInstalled(environment)}
        >
            {/* eslint-disable max-len */}
            <Dropdown.Item onClick={() => openBash(toolchainDir(environment))}>Open bash</Dropdown.Item>
            <Dropdown.Item onClick={() => openCmd(toolchainDir(environment))}>Open command prompt</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => openFolder(path.dirname(toolchainDir(environment)))}>Open SDK folder</Dropdown.Item>
            <Dropdown.Item onClick={() => openFolder(toolchainDir(environment))}>Open toolchain folder</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => cloneNcs(dispatch, version(environment), toolchainDir(environment))}>Update SDK</Dropdown.Item>
            <Dropdown.Item onClick={() => dispatch(showConfirmInstallDirDialog(version(environment)))}>Update toolchain</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => dispatch(showConfirmRemoveDialog(version(environment)))}>Remove</Dropdown.Item>
            {/* eslint-enable max-len */}
        </DropdownButton>
    );
};
EnvironmentMenu.propTypes = { environment: environmentPropType.isRequired };

export default EnvironmentMenu;
