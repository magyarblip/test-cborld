import { expect } from 'chai';
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

function _loadContext(ctx_url, ctx) {
    const loader = new JsonLdDocumentLoader();
    loader.addStatic(ctx_url, ctx)
    return loader.build();
}


describe('cborld decode', () => {
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
            const output = await decode2(myCborldBytes);
            console.log(output);
            console.log(output.contents.get(0));

        }
    )
});