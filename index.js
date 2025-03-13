import { encode, decode } from '@digitalbazaar/cborld';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';

const CONTEXT_URL = 'https://example.com/my-context/v1'; 
const CONTEXT = {
  '@context': {
    ex: 'https://example.com/my-context/v1#', 
    type: '@type', 
    Example: 'ex:Example', 
    label: 'ex:label', 
    content: 'ex:content'
  }
};

const loader = new JsonLdDocumentLoader();
loader.addStatic(CONTEXT_URL, CONTEXT)
const myLoader = loader.build();

const myDocument = {
  '@context': 'https://example.com/my-context/v1',
  type: 'Note',
  label: 'CBOR-LD',
  content: 'CBOR-LD is awesome!'
};

// encode a JSON-LD Javascript object into CBOR-LD bytes
const myCborld = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });
console.log(myCborld);

//decode to get back what we put in
const roundtripJsonLdDocument = await decode({ cborldBytes: myCborld, documentLoader: myLoader })
console.log(roundtripJsonLdDocument);

const reencodedOptions = {
  jsonldDocument: roundtripJsonLdDocument,
  documentLoader: myLoader
}
// re-roundtripping
const reencodedCborldBytes = await encode(reencodedOptions);
console.log(reencodedCborldBytes);

