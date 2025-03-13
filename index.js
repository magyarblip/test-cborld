import { encode, decode } from '@digitalbazaar/cborld';
import { JsonLdDocumentLoader } from 'jsonld-document-loader';

const contextObject = {"@context": {"ex": "https://example.com/my-context/v1#", "type": "@type", "Note": "ex:Note", "summary": "ex:summary", "content": "ex:content"}};

const loader = new JsonLdDocumentLoader();
loader.addStatic('https://example.com/my-context/v1', contextObject)
const documentLoader = loader.build();

const jsonldDocument = {
  '@context': 'https://example.com/my-context/v1',
  type: 'Note',
  summary: 'CBOR-LD',
  content: 'CBOR-LD is awesome!'
};

// encode a JSON-LD Javascript object into CBOR-LD bytes
const cborldBytes = await encode({ jsonldDocument, documentLoader });
console.log(cborldBytes);

//decode to get back what we put in
const roundtripJsonLdDocument = await decode({ cborldBytes, documentLoader })
console.log(roundtripJsonLdDocument);

const reencodedOptions = {
  jsonldDocument: roundtripJsonLdDocument,
  documentLoader: documentLoader
}
// rountripping fails due to missing '#' in namespace
const reencodedCborldBytes = await encode(reencodedOptions);
console.log(reencodedCborldBytes);

