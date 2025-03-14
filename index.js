import { encode, decode } from '@digitalbazaar/cborld';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';

const CONTEXT_URL = 'https://example.com/my-context'; 
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
  '@context': CONTEXT_URL,
  type: 'Note',
  label: 'CBOR-LD',
  content: 'CBOR-LD is awesome!'
};

console.log(myDocument);

// encode a JSON-LD Javascript object into CBOR-LD bytes
const myCborldBytes = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });
console.log(myCborldBytes);


const ALT_CONTEXT_URL = 'https://example.com/my-context';
const ALT_CONTEXT = {
  '@context': {
    ex: 'https://example.com/my-context/v2#',
    type: '@type',
    Fred: 'ex:Example',
    barney: 'ex:label',
    wilma: 'ex:content'
  }
};
const altDocLoader = new JsonLdDocumentLoader();
altDocLoader.addStatic(CONTEXT_URL, ALT_CONTEXT)
const altLoader = altDocLoader.build();

//decode to get back what we put in
const roundtripJsonLdDocument = await decode({ cborldBytes: myCborldBytes, documentLoader: altLoader })
console.log(roundtripJsonLdDocument);

// const reencodedOptions = {
//   jsonldDocument: roundtripJsonLdDocument,
//   documentLoader: myLoader
// }
// // re-roundtripping
// const reencodedCborldBytes = await encode(reencodedOptions);
// console.log(reencodedCborldBytes);

