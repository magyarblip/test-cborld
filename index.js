import { encode, decode } from '@digitalbazaar/cborld';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';

function loadContext(ctx_url, ctx) {
  const loader = new JsonLdDocumentLoader();
  loader.addStatic(ctx_url, ctx)
  return loader.build();
}

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

const myDocument = {
  '@context': CONTEXT_URL,
  type: 'Example',
  label: 'CBOR-LD',
  content: 'CBOR-LD is awesome!'
};

const myLoader = loadContext(CONTEXT_URL, CONTEXT);
const myCborldBytes = await encode({ jsonldDocument: myDocument, documentLoader: myLoader });

// This works as expected, since we are using the same context
const jsonOutput = await decode({ cborldBytes: myCborldBytes, documentLoader: myLoader });
console.log('Using the same context everything is copacetic:');
console.log(jsonOutput);


// Change content to tcontent 
const ALT_CONTEXT1 = {
  '@context': {
      ex: 'https://example.com/my-context#',
      type: '@type',
      Example: 'ex:Example',
      label: 'ex:label',
      tcontent: 'ex:content'
  }
};
const altLoader1 = loadContext(CONTEXT_URL, ALT_CONTEXT1);
const jsonOutput1 = await decode({ cborldBytes: myCborldBytes, documentLoader: altLoader1 });
console.log('Substituting tcontent for content also works:');
console.log(jsonOutput1);

/* This works as expected
{
'@context': 'https://example.com/my-context/v1',
ex: 'CBOR-LD is awesome!',
tcontent: 'CBOR-LD',
type: 'Example'
}
*/

// Change content to ucontent 
const ALT_CONTEXT2 = {
  '@context': {
      ex: 'https://example.com/my-context#',
      type: '@type',
      Example: 'ex:Example',
      label: 'ex:label',
      ucontent: 'ex:content'
  }
};
const altLoader2 = loadContext(CONTEXT_URL, ALT_CONTEXT2);
const jsonOutput2 = await decode({ cborldBytes: myCborldBytes, documentLoader: altLoader2 });
console.log('Substituting ucontent for content mangles the results:');
console.log(jsonOutput2);

/* This gets seriously mangled
{
'@context': 'https://example.com/my-context/v1',
ex: 'CBOR-LD is awesome!',
type: 'CBOR-LD',
ucontent: 100
}
*/

