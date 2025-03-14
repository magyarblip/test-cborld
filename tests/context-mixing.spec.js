import {expect} from 'chai';
//   import {default as chaiBytes} from 'chai-bytes';
//   chai.use(chaiBytes);

import { encode, decode } from '@digitalbazaar/cborld';
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

            // This would enable a v2 consumer to load a v1 object directly into v2 form
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
