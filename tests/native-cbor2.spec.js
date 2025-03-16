import { expect } from 'chai';
import { encode, decode } from '@digitalbazaar/cborld';
import { encode as encode2, decode as decode2 } from 'cbor2';
import { CONTEXT_URL, CONTEXT, BOGUS_CONTEXT, loadContext } from '../lib/test-context.js';

describe('cborld decode', () => {
    it('should load into the new context',
        async () => {
            // The type 'Note' does not exist
            const myDocument = {
                '@context': CONTEXT_URL,
                type: 'Example',
                label: 'CBOR-LD',
                content: 'CBOR-LD is awesome!'
            };

            const myLoader = loadContext(CONTEXT_URL, CONTEXT);
            const myCborldBytes = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });
            // console.log(myCborldBytes);

            // Why is @type: Note encoded? This should have been ignored by the JSON-LD processor
            // CBOR can obviously encode it but it creates issues
            const output = await decode2(myCborldBytes);
            console.log(output.contents.get(0));

            // BOGUS_CONTEXT uses a completely different namespace and overrides @type with the same alias
            const altLoader = loadContext(CONTEXT_URL, BOGUS_CONTEXT);
            const jsonOutput = await decode({ cborldBytes: myCborldBytes, documentLoader: altLoader });
            console.log(jsonOutput);



        }
    )
});