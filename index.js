import { encode, decode } from '@digitalbazaar/cborld';
import { securityLoader } from '@digitalcredentials/security-document-loader';

const contextObject = {"@context": {"ex": "https://example.com/my-context/v1#", "type": "@type", "Note": "ex:Note", "summary": "ex:summary", "content": "ex:content"}};

const loader = securityLoader()
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

const obj = await decode({ cborldBytes, documentLoader })
console.log(obj);

const c = await encode({ obj, documentLoader });
console.log(c);

