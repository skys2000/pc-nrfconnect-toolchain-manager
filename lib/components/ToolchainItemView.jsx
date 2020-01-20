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

import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

const ToolchainItemView = ({
    toolchain,
}) => (
    <ListGroup.Item>
        <Row noGutters className="py-1">
            <Col xs="auto my-2 mr-3" className="d-flex align-items-start">
                {/* <AppIcon toolchain={toolchain} /> */}
            </Col>
            <Col>
                <div className="h8">
                    {toolchain.name}
                </div>
                <div className="small text-muted">
                    {toolchain.version}
                </div>
            </Col>
            <Col xs="auto ml-auto" className="d-flex align-items-center my-3 pl-3">
                <ButtonToolbar className="wide-btns">
                    <Button
                        variant="outline-primary"
                        title="Update"
                    >
                       Update
                    </Button>
                    <DropdownButton
                        // variant={installed ? 'outline-primary' : 'outline-secondary'}
                        title=""
                        alignRight
                    >
                        <Dropdown.Item
                            title="Go to toolchain website"
                        >
                            More info
                        </Dropdown.Item>
                        <Dropdown.Item
                            title="Show release notes"
                        >
                            Release notes
                        </Dropdown.Item>
                        <Dropdown.Item
                            title="Create a desktop shortcut for this toolchain"
                        >
                            Create shortcut
                        </Dropdown.Item>
                    </DropdownButton>
                </ButtonToolbar>
            </Col>
        </Row>
    </ListGroup.Item>
);

ToolchainItemView.propTypes = {
    toolchain: PropTypes.shape({
        name: PropTypes.string.isRequired,
        version: PropTypes.string.isRequired,
    }).isRequired,
};
export default ToolchainItemView;