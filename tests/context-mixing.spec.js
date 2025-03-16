import {expect} from 'chai';
import { encode, decode } from '@digitalbazaar/cborld';
import { CONTEXT_URL, CONTEXT, ALT_CONTEXT, loadContext } from '../lib/test-context.js';

describe('cborld encode', () => {
    it('should load into the new context',
        async () => {
            const myDocument = {
                '@context': CONTEXT_URL,
                type: 'Example',
                label: 'CBOR-LD',
                content: 'CBOR-LD is awesome!'
            };

            const myLoader = loadContext(CONTEXT_URL, CONTEXT);
            const myCborldBytes = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });
            // console.log(myCborldBytes);

            // This would enable a v2 consumer to load a v1 object directly into v2 form
            const altLoader = loadContext(CONTEXT_URL, ALT_CONTEXT);
            const roundtripJsonLdDocument = await decode({ cborldBytes: myCborldBytes, documentLoader: altLoader })
            // console.log(roundtripJsonLdDocument);

            const expectedDocument = {
                '@context': CONTEXT_URL,
                type2: 'Example2',
                label2: 'CBOR-LD',
                content2: 'CBOR-LD is awesome!'
            };

            expect(roundtripJsonLdDocument).to.deep.equal(expectedDocument);
        });
});
