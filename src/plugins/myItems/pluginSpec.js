/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

import {
    createOpenMct,
    resetApplicationState
} from 'utils/testing';
import myItemsIdentifier from './myItemsIdentifier';

describe("the plugin", () => {
    let openmct;

    beforeEach((done) => {
        openmct = createOpenMct();

        openmct.install(openmct.plugins.MyItems());

        openmct.on('start', done);
        openmct.startHeadless();
    });

    afterEach(() => {
        return resetApplicationState(openmct);
    });

    it('when installed, adds "My Items" to the root', async () => {
        const root = await openmct.objects.get('ROOT');
        let myItems = root.composition.filter((identifier) => {
            return identifier.key === myItemsIdentifier.key
                && identifier.namespace === myItemsIdentifier.namespace;
        })[0];

        expect(myItems).toBeDefined();
    });

    describe('adds an interceptor', () => {
        let myItems;
        let mockUndefinedProvider;

        beforeEach(async () => {
            mockUndefinedProvider = {
                get: () => Promise.resolve(undefined)
            };

            spyOn(openmct.objects, 'getProvider').and.returnValue(mockUndefinedProvider);

            myItems = await openmct.objects.get(myItemsIdentifier);
        });

        it('that returns a "My Items" model for missiong objects', () => {
            let keysMatch = myItems.identifier.key === myItemsIdentifier.key
                && myItems.identifier.namespace === myItemsIdentifier.namespace;

            expect(myItems).toBeDefined();
            expect(keysMatch).toBeTrue();
        });
    });

});
