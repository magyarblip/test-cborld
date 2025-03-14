/*!
* Copyright (c) 2020-2024 Digital Bazaar, Inc. All rights reserved.
*/
import {
    expect
} from 'chai';
//   import {default as chaiBytes} from 'chai-bytes';
//   chai.use(chaiBytes);

import { encode, decode } from '@digitalbazaar/cborld';
import { encode as encode2, decode as decode2 } from 'cbor2';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';

const CONTEXT_URL = 'https://example.com/my-context/v1';
const CONTEXT = {
    '@context': {
        ex: 'https://example.com/my-context#',
        type: '@type',
        Example: 'ex:Example',
        label: 'ex:label',
        content: 'ex:content'
    }
};

const ALT_CONTEXT_URL = 'https://example.com/my-context/v2';
const ALT_CONTEXT = {
    '@context': {
        ex: 'https://example.com/my-context#',
        type2: '@type',
        Example2: 'ex:Example',
        label2: 'ex:label',
        content2: 'ex:content'
    }
};


function _loadContext(ctx_url, ctx) {
    const loader = new JsonLdDocumentLoader();
    loader.addStatic(ctx_url, ctx)
    return loader.build();
}

describe('cborld encode', () => {
    it('should load into the new context',
        async () => {
            const myDocument = {
                '@context': CONTEXT_URL,
                type: 'Example',
                label: 'CBOR-LD',
                content: 'CBOR-LD is awesome!'
            };

            const myLoader = _loadContext(CONTEXT_URL, CONTEXT);
            const myCborldBytes = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });
            // console.log(myCborldBytes);

            // Problem is this is bound to the original context URL, rather than its namespace
            // How do i inspect the CBOR data in a context neutral way
            // const output = await decode2(myCborldBytes);
            // console.log(output);


            const altLoader = _loadContext(CONTEXT_URL, ALT_CONTEXT);
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
